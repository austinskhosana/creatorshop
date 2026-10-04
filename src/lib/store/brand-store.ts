import { useMemo, useSyncExternalStore } from "react";
import type { BrandAccount, BrandShop, BrandState, CreatorInvite, Pitch, ProductPage, ProductPageStatus } from "@/lib/data/brand-schema";
import { DEMO_ACCOUNT, DEMO_PITCHES, DEMO_PRODUCTS, DEMO_SHOPS, SHOPPERS } from "@/lib/mock-brand";
import { tierPlatform } from "@/lib/brand-format";

/**
 * The signed-in brand's account, product pages, pitches and shops — a stand-in for their Supabase
 * rows, built the same way as `creator-store`: localStorage-backed, every write through a
 * `brandStore` action, hooks that keep their shape when the backend lands.
 *
 * Signed out is `account: null`. The brand landing page is the only way in: "Sign in" loads the
 * lived-in demo merchant, "Get started" creates an empty one.
 */

const STORAGE_KEY = "creatorshop:brand-state";
const DAY = 24 * 60 * 60 * 1000;

const SIGNED_OUT: BrandState = { version: 1, account: null, products: [], pitches: [], shops: [], invites: [] };

export const DEMO_STATE: BrandState = { version: 1, account: DEMO_ACCOUNT, products: DEMO_PRODUCTS, pitches: DEMO_PITCHES, shops: DEMO_SHOPS, invites: [] };

let state: BrandState = SIGNED_OUT;
let loaded = false;
const listeners = new Set<() => void>();

/** A product page runs on one platform: tiers on any other platform than the first are dropped. */
function onePlatform<Tier extends { name: string }>(tiers: Tier[]): Tier[] {
  if (tiers.length === 0) return tiers;
  const platform = tierPlatform(tiers[0].name);
  return tiers.filter((tier) => tierPlatform(tier.name) === platform);
}

/**
 * Pages saved before the one-platform rule could mix platforms. Demo pages take the current demo
 * tiers; anything else keeps the tiers on its first platform.
 */
function migrateProduct(product: ProductPage): ProductPage {
  if (onePlatform(product.tiers).length === product.tiers.length) return product;
  const demo = DEMO_PRODUCTS.find((item) => item.id === product.id);
  return { ...product, tiers: demo ? demo.tiers : onePlatform(product.tiers) };
}

function parse(raw: string | null): BrandState | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as BrandState;
    // Invites arrived after v1 shipped; older saved states simply have none yet.
    return parsed?.version === 1 ? { ...parsed, invites: parsed.invites ?? [], products: parsed.products.map(migrateProduct) } : null;
  } catch {
    return null;
  }
}

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    state = parse(window.localStorage.getItem(STORAGE_KEY)) ?? SIGNED_OUT;
  } catch {
    // Storage can be blocked (private mode, sandboxed previews). Stay in memory.
  }
}

function notify() {
  listeners.forEach((listener) => listener());
}

function commit(next: BrandState) {
  state = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // See load().
  }
  notify();
}

function handleStorage(event: StorageEvent) {
  if (event.key !== STORAGE_KEY) return;
  state = parse(event.newValue) ?? SIGNED_OUT;
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

function getServerSnapshot() {
  return SIGNED_OUT;
}

function update(recipe: (current: BrandState) => BrandState) {
  commit(recipe(getSnapshot()));
}

const now = () => new Date().toISOString();
const addDays = (iso: string, days: number) => new Date(new Date(iso).getTime() + days * DAY).toISOString();
const addMonths = (iso: string, months: number) => {
  const date = new Date(iso);
  date.setMonth(date.getMonth() + months);
  return date.toISOString();
};

/** Shops that hold a stock slot. A creator withdrawing after approval gives the slot back. */
function usedStock(current: BrandState, productId: string) {
  return current.shops.filter((shop) => shop.productId === productId && shop.state !== "incomplete").length;
}

export function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function domainOf(value: string) {
  return value.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").split(/[/?#]/)[0];
}

/** v1 verification: the work email's domain matches the website's. */
export function emailMatchesWebsite(email: string, website: string) {
  const emailDomain = email.split("@")[1]?.trim().toLowerCase();
  return Boolean(emailDomain) && emailDomain === domainOf(website);
}

/**
 * Pretend creators found a freshly published page, so a new merchant can try reviewing end to end.
 * Every shopper is from the fictional mock roster. Goes away when real pitches arrive from the backend.
 */
function simulatedPitches(product: ProductPage): Pitch[] {
  return SHOPPERS.slice(0, 3).map((shopper, index) => ({
    id: `pitch-${shopper.id}-${product.id}`,
    productId: product.id,
    tierId: product.tiers[index % product.tiers.length].id,
    shopperId: shopper.id,
    status: "pending",
    createdAt: now(),
  }));
}

export type OutreachSettings = Pick<BrandAccount, "introMessage" | "autoSendInvites" | "defaultInviteProductId">;

export type ProductDraft = Omit<ProductPage, "id" | "slug" | "status" | "createdAt" | "pausedFrom" | "pausedForBilling">;

export const brandStore = {
  getState: getSnapshot,

  signInDemo() {
    commit(DEMO_STATE);
  },

  /** A brand-new merchant: their account, nothing listed yet. */
  signUp(account: BrandAccount) {
    commit({ ...SIGNED_OUT, account });
  },

  signOut() {
    commit(SIGNED_OUT);
  },

  updateAccount(patch: Partial<BrandAccount>) {
    update((current) => (current.account ? { ...current, account: { ...current.account, ...patch } } : current));
  },

  /**
   * Starting or ending the subscription. Lapsing pauses every live page; resubscribing restores
   * them exactly as they were. Nothing is deleted either way.
   */
  setSubscription(subscription: BrandAccount["subscription"]) {
    update((current) => {
      if (!current.account) return current;
      const products = current.products.map((product): ProductPage => {
        if (subscription === "paused" && product.status !== "paused" && product.status !== "draft" && product.status !== "closed") {
          return { ...product, status: "paused", pausedFrom: product.status, pausedForBilling: true };
        }
        if (subscription === "active" && product.status === "paused" && product.pausedForBilling) {
          return { ...product, status: product.pausedFrom ?? "live", pausedFrom: undefined, pausedForBilling: undefined };
        }
        return product;
      });
      return { ...current, account: { ...current.account, subscription }, products };
    });
  },

  /** Creates or edits a product page. Editing never touches approved shops — their terms were copied at approval. */
  saveProduct(input: ProductDraft, options: { id?: string; publish: boolean }): ProductPage {
    const draft = { ...input, tiers: onePlatform(input.tiers) };
    const current = getSnapshot();
    const existing = options.id ? current.products.find((product) => product.id === options.id) : undefined;
    const baseSlug = slugify(draft.name) || "product";
    const taken = new Set(current.products.filter((product) => product.id !== existing?.id).map((product) => product.slug));
    let slug = baseSlug;
    for (let n = 2; taken.has(slug); n++) slug = `${baseSlug}-${n}`;

    const status: ProductPageStatus = options.publish
      ? usedStock(current, existing?.id ?? "") >= draft.stock && existing ? "sold_out" : "live"
      : existing?.status ?? "draft";
    const product: ProductPage = existing
      ? { ...existing, ...draft, slug, status }
      : { ...draft, id: crypto.randomUUID(), slug, status, createdAt: now() };

    const products = existing ? current.products.map((item) => (item.id === product.id ? product : item)) : [product, ...current.products];
    const firstPublish = options.publish && !current.pitches.some((pitch) => pitch.productId === product.id);
    const pitches = firstPublish ? [...current.pitches, ...simulatedPitches(product)] : current.pitches;
    commit({ ...current, products, pitches });
    return product;
  },

  pauseProduct(id: string) {
    update((current) => ({
      ...current,
      products: current.products.map((product) =>
        product.id === id && product.status !== "paused" ? { ...product, status: "paused", pausedFrom: product.status } : product,
      ),
    }));
  },

  reopenProduct(id: string) {
    update((current) => ({
      ...current,
      products: current.products.map((product) => {
        if (product.id !== id) return product;
        if (product.status === "paused") return { ...product, status: product.pausedFrom ?? "live", pausedFrom: undefined, pausedForBilling: undefined };
        if (product.status === "closed") return { ...product, status: usedStock(current, id) >= product.stock ? "sold_out" : "live" };
        return product;
      }),
    }));
  },

  /** Closing stops new shoppers. Pending pitches decline; approved shops carry on, protected. */
  closeProduct(id: string) {
    update((current) => ({
      ...current,
      products: current.products.map((product) => (product.id === id ? { ...product, status: "closed", pausedFrom: undefined, pausedForBilling: undefined } : product)),
      pitches: current.pitches.map((pitch) => (pitch.productId === id && pitch.status === "pending" ? { ...pitch, status: "declined" } : pitch)),
    }));
  },

  duplicateProduct(id: string) {
    const source = getSnapshot().products.find((product) => product.id === id);
    if (!source) return;
    const { name, description, tiers, accessMethod, accessPayload, accessInstructions, creatorAccess, stock, deadlineDays } = source;
    const copyId = crypto.randomUUID();
    brandStore.saveProduct(
      { name: `${name} (copy)`, description, tiers: tiers.map((tier) => ({ ...tier, id: `${copyId}-${tier.id}` })), accessMethod, accessPayload, accessInstructions, creatorAccess, stock, deadlineDays },
      { publish: false },
    );
  },

  /**
   * Approving creates a protected shop, takes a stock slot, and starts the delivery deadline.
   * The last slot sells the page out and declines everyone still waiting.
   */
  decidePitch(pitchId: string, approve: boolean) {
    update((current) => {
      const pitch = current.pitches.find((item) => item.id === pitchId);
      const product = pitch && current.products.find((item) => item.id === pitch.productId);
      if (!pitch || !product || pitch.status !== "pending") return current;

      if (!approve) {
        return { ...current, pitches: current.pitches.map((item) => (item.id === pitchId ? { ...item, status: "declined" } : item)) };
      }

      const tier = product.tiers.find((item) => item.id === pitch.tierId) ?? product.tiers[0];
      const approvedAt = now();
      const shop: BrandShop = {
        id: crypto.randomUUID(),
        pitchId,
        productId: product.id,
        productName: product.name,
        tierName: tier.name,
        months: tier.months,
        retailValue: tier.retailValue,
        shopperId: pitch.shopperId,
        state: "approved",
        approvedAt,
        deadline: addDays(approvedAt, product.deadlineDays),
      };
      const soldOut = usedStock(current, product.id) + 1 >= product.stock;
      return {
        ...current,
        shops: [shop, ...current.shops],
        products: soldOut ? current.products.map((item) => (item.id === product.id ? { ...item, status: "sold_out" } : item)) : current.products,
        pitches: current.pitches.map((item) => {
          if (item.id === pitchId) return { ...item, status: "approved" };
          if (soldOut && item.productId === product.id && item.status === "pending") return { ...item, status: "declined" };
          return item;
        }),
      };
    });
  },

  /** One callable confirm, so a social-API check can replace the manual tap later. Releases access. */
  confirmProof(shopId: string) {
    update((current) => ({
      ...current,
      shops: current.shops.map((shop) => {
        if (shop.id !== shopId) return shop;
        const accessStart = now();
        return { ...shop, state: "active", proofDeclineReason: undefined, accessStart, accessEnd: addMonths(accessStart, shop.months) };
      }),
    }));
  },

  /** Sends proof back with a reason. The deadline stays where it was. */
  declineProof(shopId: string, reason: string) {
    update((current) => ({
      ...current,
      shops: current.shops.map((shop) => (shop.id === shopId ? { ...shop, state: "approved", proofUrl: undefined, proofDeclineReason: reason } : shop)),
    }));
  },

  /**
   * Swiping right on a creator: the intro, already filled in with their name, goes out with the
   * campaign the brand picked, if any.
   */
  inviteCreator(shopperId: string, message: string, productId?: string): CreatorInvite {
    const invite: CreatorInvite = { id: crypto.randomUUID(), shopperId, sentAt: now(), message, ...(productId ? { productId } : {}) };
    update((current) => ({ ...current, invites: [...current.invites, invite] }));
    return invite;
  },

  /** Swipe mode's undo: takes the intro (and any campaign) back out of the thread. */
  withdrawInvite(inviteId: string) {
    update((current) => ({ ...current, invites: current.invites.filter((invite) => invite.id !== inviteId) }));
  },

  /** The swipe-right intro, whether right swipes send it without asking, and the campaign that goes with it. */
  saveOutreach(settings: Partial<OutreachSettings>) {
    brandStore.updateAccount(settings);
  },

  /** Puts back a snapshot — the review deck's undo. */
  restore(snapshot: BrandState) {
    commit(snapshot);
  },
};

const subscribeNever = () => () => {};

export function useBrandState() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * The signed-in account once the client has read storage. `ready` stays false through hydration,
 * so a guard never bounces a signed-in brand off the page during the server-rendered first pass.
 */
export function useBrandSession() {
  const { account } = useBrandState();
  const ready = useSyncExternalStore(subscribeNever, () => true, () => false);
  return { ready, account };
}

export interface ProductStats {
  remaining: number;
  pending: number;
  activeShops: number;
}

/** Stock left, shoppers waiting, and shops in flight, per product page. */
export function useProductStats() {
  const { products, pitches, shops } = useBrandState();
  return useMemo(() => {
    const stats: Record<string, ProductStats> = {};
    for (const product of products) {
      const productShops = shops.filter((shop) => shop.productId === product.id);
      stats[product.id] = {
        remaining: Math.max(0, product.stock - productShops.filter((shop) => shop.state !== "incomplete").length),
        pending: pitches.filter((pitch) => pitch.productId === product.id && pitch.status === "pending").length,
        activeShops: productShops.filter((shop) => !["expired", "incomplete"].includes(shop.state)).length,
      };
    }
    return stats;
  }, [products, pitches, shops]);
}

export interface LiveCampaign {
  product: ProductPage;
  /** Creator spots left on the page. */
  remaining: number;
}

/** Live product pages — the only campaigns a new creator can be invited to. */
export function useLiveCampaigns(): LiveCampaign[] {
  const { products } = useBrandState();
  const stats = useProductStats();
  return useMemo(
    () => products.filter((product) => product.status === "live").map((product) => ({ product, remaining: stats[product.id]?.remaining ?? product.stock })),
    [products, stats],
  );
}

/** Pending pitches on pages that can still sell. Paused and closed pages accept no new shoppers. */
export function usePendingPitches() {
  const { products, pitches } = useBrandState();
  return useMemo(() => {
    const open = new Set(products.filter((product) => product.status === "live").map((product) => product.id));
    return pitches.filter((pitch) => pitch.status === "pending" && open.has(pitch.productId));
  }, [products, pitches]);
}
