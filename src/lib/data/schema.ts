/**
 * Creatorshop's data model, shaped like the Supabase tables it will become.
 *
 * Postgres columns will be snake_case (`listing_slug`, `added_at`); the app keeps camelCase
 * and maps at the query layer. Timestamps are ISO strings, as Supabase returns them.
 *
 * Catalog rows (listings and their offers) are public reads. Everything else belongs to one
 * creator and will sit behind row-level security on `creator_id`, so the client-side rows
 * below leave that column out — they are always the signed-in creator's.
 */

import type { SocialHandles } from "@/lib/socials";

export type ISODateString = string;

/**
 * One way to pay for a listing: a deliverable in exchange for a length of access.
 * Table: `listing_offers` (listing_slug → listings.slug).
 */
export interface ListingOffer {
  id: string;
  listingSlug: string;
  /** The deliverable, e.g. "IG carousel" or "YouTube review". */
  label: string;
  /** Months of access the deliverable buys. */
  months: number;
}

/**
 * A listing the creator means to shop. Table: `cart_items`, unique on (creator_id, listing_slug) —
 * a listing sits in the cart once, and picking another offer replaces the choice.
 */
export interface CartItem {
  listingSlug: string;
  offerId: string;
  addedAt: ISODateString;
}

/**
 * A creator's wish for software that isn't on Creatorshop yet — one vote on the Genie Index.
 * Table: `wishes`, unique on (creator_id, brand_key).
 */
export interface Wish {
  /** Lowercased brand name, so "Figma" and "figma" land on the same entry. */
  brandKey: string;
  brandName: string;
  website?: string;
  wishedAt: ISODateString;
}

/**
 * Where a shop is in the barter: pending → approved (upload a draft) → draft (brand reviewing it)
 * → ready (draft approved: post it, then add proof of payment) → posted (brand checking the proof) → active.
 */
export type ShopState = "pending" | "approved" | "draft" | "ready" | "posted" | "active" | "expired" | "overdue" | "declined" | "withdrawn";

/**
 * One barter between a creator and a brand — created when the creator checks out a cart item.
 * Table: `shops`.
 *
 * The deal terms (product, deliverable, value, access) are copied from the listing at checkout,
 * like an order line keeps its price: the listing can change later without rewriting the deal.
 */
export interface Shop {
  id: string;
  listingSlug: string;
  /** The offer chosen at checkout. Absent on shops seeded before offers had ids. */
  offerId?: string;
  state: ShopState;
  product: string;
  brand: string;
  description: string;
  /** The deliverable the creator pays with, e.g. "TikTok" or "Instagram carousel". */
  tier: string;
  value: number;
  access: string;
  /** Delivery deadline, once a brand approves. */
  deadline?: string;
  accessEnd?: string;
  accessCode?: string;
  redemptionUrl?: string;
  createdAt: ISODateString;
}

/**
 * The creator's public profile — what Settings edits and /profile shows. Table: `profiles`, one row
 * per creator. Audience numbers come from connected platforms, so they live elsewhere.
 */
export interface CreatorProfile {
  displayName: string;
  /** Without the leading "@". */
  username: string;
  avatar: string;
  bio: string;
  niches: string[];
  /** A preset id from `COVER_OPTIONS`, or "upload" for `coverImage`. */
  coverId: string;
  /** The uploaded cover, as a data URL until storage exists. */
  coverImage: string | null;
  coverImageName: string | null;
  /** Handles shown as links on the profile, and checked against proof-of-post links. */
  socials: SocialHandles;
  showEarnings: boolean;
  showLocation: boolean;
  /** Whether brands can find the creator in discovery and invite them. */
  discoverable: boolean;
}

/** Everything the signed-in creator owns on the client. Bump `version` when a shape changes. */
export interface CreatorState {
  version: 3;
  profile: CreatorProfile;
  cart: CartItem[];
  wishes: Wish[];
  shops: Shop[];
}
