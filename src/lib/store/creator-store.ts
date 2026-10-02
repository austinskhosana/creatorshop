import { useMemo, useSyncExternalStore } from "react";
import type { CartItem, CreatorProfile, CreatorState, ListingOffer, Shop, ShopState } from "@/lib/data/schema";
import { formatAccess, getListing, getListingOffers, resolveOffer } from "@/lib/listings/offers";
import { CREATOR, CREATOR_SHOPS } from "@/lib/mock-creator";
import { GENIE_INDEX, toBrandKey } from "@/lib/mock-genie-index";
import type { Listing } from "@/lib/listings/types";

/**
 * The signed-in creator's profile, cart, wishes and shops — a stand-in for their Supabase rows.
 *
 * It persists to localStorage so the shell behaves like a real app across reloads. Every write
 * goes through one of the `creatorStore` actions below; when Supabase lands, each action becomes
 * an insert/update/delete on the matching table and the hooks keep their shape.
 */

const STORAGE_KEY = "creatorshop:creator-state";

function seedCartItem(listingSlug: string, addedAt: string): CartItem {
  const listing = getListing(listingSlug);
  const offerId = listing ? getListingOffers(listing)[0].id : "";
  return { listingSlug, offerId, addedAt };
}

const SEED_PROFILE: CreatorProfile = {
  displayName: CREATOR.name,
  username: CREATOR.handle.replace(/^@/, ""),
  avatar: CREATOR.avatar,
  bio: CREATOR.bio,
  niches: CREATOR.niches,
  coverId: "shader",
  coverImage: null,
  coverImageName: null,
  socials: { Instagram: "jordanmakes", TikTok: "jordanmakes", YouTube: "jordanmakes", X: "" },
  showEarnings: true,
  showLocation: true,
  discoverable: true,
};

/** Fictional starting data so a fresh browser shows a lived-in account. */
export const SEED_STATE: CreatorState = {
  version: 3,
  profile: SEED_PROFILE,
  cart: [seedCartItem("cursor", "2026-09-30T10:00:00.000Z"), seedCartItem("higgsfield", "2026-09-30T10:05:00.000Z")],
  wishes: [{ brandKey: "capcut", brandName: "CapCut", website: "capcut.com", wishedAt: "2026-09-27T08:00:00.000Z" }],
  shops: CREATOR_SHOPS,
};

let state: CreatorState = SEED_STATE;
let loaded = false;
const listeners = new Set<() => void>();

/** Sample avatars that have since been removed from `public/`. */
const RETIRED_AVATARS = ["/creators/meng-to.png"];

/** Saved profile fields over the sample ones, so fields added since it was saved get a value. */
function withSeedProfile(profile: Partial<CreatorProfile> | undefined): CreatorProfile {
  const merged = { ...SEED_PROFILE, ...profile };
  return RETIRED_AVATARS.includes(merged.avatar) ? { ...merged, avatar: SEED_PROFILE.avatar } : merged;
}

function parse(raw: string | null): CreatorState | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as
      | CreatorState
      | (Pick<CreatorState, "cart" | "shops"> & { version: 1 | 2; profile?: CreatorProfile });
    if (parsed?.version === SEED_STATE.version) return { ...parsed, profile: withSeedProfile(parsed.profile) };
    // v1 predates the profile and v2 had saved listings instead of wishes: keep the cart and shops.
    if (parsed?.version === 1 || parsed?.version === 2) {
      return { version: 3, profile: withSeedProfile(parsed.profile), cart: parsed.cart, shops: parsed.shops, wishes: SEED_STATE.wishes };
    }
    return null;
  } catch {
    return null;
  }
}

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    state = parse(window.localStorage.getItem(STORAGE_KEY)) ?? SEED_STATE;
  } catch {
    // Storage can be blocked (private mode, sandboxed previews). The seed still works in memory.
  }
}

function notify() {
  listeners.forEach((listener) => listener());
}

function commit(next: CreatorState) {
  state = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // See load(): stay in memory.
  }
  notify();
}

/** Keeps other tabs in step when one of them writes. */
function handleStorage(event: StorageEvent) {
  if (event.key !== STORAGE_KEY) return;
  state = parse(event.newValue) ?? SEED_STATE;
  notify();
}

function subscribe(listener: () => void) {
  if (listeners.size === 0) window.addEventListener("storage", handleStorage);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", handleStorage);
  };
}

function getSnapshot() {
  load();
  return state;
}

/** The server always renders the seed; React swaps in the stored state right after hydration. */
function getServerSnapshot() {
  return SEED_STATE;
}

function update(recipe: (current: CreatorState) => CreatorState) {
  commit(recipe(getSnapshot()));
}

const now = () => new Date().toISOString();

export const creatorStore = {
  updateProfile(patch: Partial<CreatorProfile>) {
    update((current) => ({ ...current, profile: { ...current.profile, ...patch } }));
  },

  /** Adds a listing, or swaps the chosen offer if it's already in the cart. */
  addToCart(listingSlug: string, offerId: string) {
    update((current) => {
      const existing = current.cart.find((item) => item.listingSlug === listingSlug);
      const cart = existing
        ? current.cart.map((item) => (item.listingSlug === listingSlug ? { ...item, offerId } : item))
        : [...current.cart, { listingSlug, offerId, addedAt: now() }];
      return { ...current, cart };
    });
  },

  removeFromCart(listingSlug: string) {
    update((current) => ({ ...current, cart: current.cart.filter((item) => item.listingSlug !== listingSlug) }));
  },

  clearCart() {
    update((current) => ({ ...current, cart: [] }));
  },

  /** Adds the creator's wish for a brand. Wishing twice for the same brand is a no-op. */
  makeWish(brandName: string, website?: string) {
    const brandKey = toBrandKey(brandName);
    if (!brandKey) return;
    update((current) => {
      if (current.wishes.some((wish) => wish.brandKey === brandKey)) return current;
      return { ...current, wishes: [...current.wishes, { brandKey, brandName: brandName.trim(), website, wishedAt: now() }] };
    });
  },

  withdrawWish(brandKey: string) {
    update((current) => ({ ...current, wishes: current.wishes.filter((wish) => wish.brandKey !== brandKey) }));
  },

  /** Turns every cart item into a pending shop and empties the cart. Returns the new shops. */
  checkout(): Shop[] {
    const current = getSnapshot();
    const createdAt = now();
    const placed = current.cart.flatMap((item): Shop[] => {
      const resolved = resolveOffer(item.listingSlug, item.offerId);
      if (!resolved) return [];
      const { listing, offer } = resolved;
      return [{
        id: crypto.randomUUID(),
        listingSlug: listing.slug,
        offerId: offer.id,
        state: "pending",
        product: listing.title,
        brand: listing.brandName,
        description: listing.description,
        tier: offer.label,
        value: listing.retailValue,
        access: formatAccess(offer.months),
        createdAt,
      }];
    });
    commit({ ...current, cart: [], shops: [...placed, ...current.shops] });
    return placed;
  },

  setShopState(shopId: string, shopState: ShopState) {
    update((current) => ({ ...current, shops: current.shops.map((shop) => (shop.id === shopId ? { ...shop, state: shopState } : shop)) }));
  },

  /** Puts the seed data back — handy while prototyping. */
  reset() {
    commit(SEED_STATE);
  },
};

function useCreatorState() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** A cart item joined with the catalog rows it points at. */
export interface CartLine {
  item: CartItem;
  listing: Listing;
  offer: ListingOffer;
}

export function useCart() {
  const { cart } = useCreatorState();
  const lines = useMemo(
    () =>
      cart.flatMap((item): CartLine[] => {
        const resolved = resolveOffer(item.listingSlug, item.offerId);
        return resolved ? [{ item, ...resolved }] : [];
      }),
    [cart],
  );
  const total = lines.reduce((sum, line) => sum + line.listing.retailValue, 0);
  return { lines, total, count: lines.length };
}

/** The cart item for one listing, if it's in the cart. */
export function useCartItem(listingSlug: string) {
  const { cart } = useCreatorState();
  return cart.find((item) => item.listingSlug === listingSlug);
}

/** One brand on the Genie Index, and whether this creator has wished for it. */
export interface GenieIndexRow {
  brandKey: string;
  brandName: string;
  website?: string;
  description?: string;
  category?: string;
  wished: boolean;
}

/** The Genie Index: brands the creator added themselves first (newest first), then the curated list. */
export function useGenieIndex() {
  const { wishes } = useCreatorState();
  return useMemo(() => {
    const wished = new Set(wishes.map((wish) => wish.brandKey));
    const curated = new Set(GENIE_INDEX.map((entry) => entry.brandKey));
    const added: GenieIndexRow[] = wishes
      .filter((wish) => !curated.has(wish.brandKey))
      .reverse()
      .map((wish) => ({ brandKey: wish.brandKey, brandName: wish.brandName, website: wish.website, wished: true }));
    return [...added, ...GENIE_INDEX.map((entry) => ({ ...entry, wished: wished.has(entry.brandKey) }))];
  }, [wishes]);
}

export function useProfile() {
  return useCreatorState().profile;
}

export function useShops() {
  return useCreatorState().shops;
}
