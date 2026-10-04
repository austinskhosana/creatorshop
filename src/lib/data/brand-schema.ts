/**
 * The merchant side of Creatorshop's data model, shaped like the Supabase tables it will become.
 * Same conventions as `schema.ts`: camelCase in the app, ISO timestamps, and rows that belong to the
 * signed-in brand leave out `brand_id` because row-level security scopes them.
 */

import type { ISODateString } from "@/lib/data/schema";
import type { SocialPlatform } from "@/lib/socials";

/** `draft` → `live` → `sold_out` → `closed`, with `paused` as a side state that remembers where it came from. */
export type ProductPageStatus = "draft" | "live" | "sold_out" | "closed" | "paused";

export type AccessMonths = 1 | 3 | 6;

/**
 * A deliverable option on a product page — what a creator picks when adding it to their cart,
 * like a size or plan. Table: `price_tiers` (product_id → product_pages.id).
 */
export interface PriceTier {
  id: string;
  /** The content type the creator pays with, e.g. "Instagram story". */
  name: string;
  months: AccessMonths;
  /** The stated retail price of the access, in USD. Shown on the product page and the receipt. */
  retailValue: number;
}

export type AccessMethod = "promo_code" | "license_key" | "invite_link" | "manual_seat" | "email_invite" | "instructions";

/**
 * What a creator needs to make the post, for products with no free plan that covers it. It isn't a
 * trial to try the product: it's released the moment the brand approves a creator, and lasts
 * through the delivery window. Full access still waits for confirmed proof.
 */
export interface CreatorAccess {
  method: AccessMethod;
  /** The code, key or link. Empty for methods without one. */
  payload: string;
  instructions: string;
}

/** The merchant's listing — a Shopify-style product page. Table: `product_pages`. */
export interface ProductPage {
  id: string;
  /** The human-readable part of `/store/{brand}/{product}`. */
  slug: string;
  name: string;
  /** What the product is, what content the brand wants, and any must-haves. */
  description: string;
  tiers: PriceTier[];
  accessMethod: AccessMethod;
  /** The code, key or link. Stored securely and only revealed when a creator's access unlocks. */
  accessPayload: string;
  accessInstructions: string;
  /** Unset when the product's free plan covers everything the post would show. */
  creatorAccess?: CreatorAccess;
  /** Creator spots. Required, no default: the brand sets it deliberately. */
  stock: number;
  /** Days from approval to deliver the post. */
  deadlineDays: number;
  status: ProductPageStatus;
  /** Where a paused page returns to when it reopens. */
  pausedFrom?: Exclude<ProductPageStatus, "paused">;
  /** Paused by a lapsed subscription rather than the brand. Only these come back on resubscribe. */
  pausedForBilling?: boolean;
  createdAt: ISODateString;
}

/**
 * A creator's public profile, which is also their pitch. It's the one shape every profile surface
 * reads — the creator's own page, review, the directory deck, a brand's profile view — and one
 * card renders it everywhere (ShopperReviewCard). The creator side builds it from their editable
 * `CreatorProfile` with `toPublicProfile`, so what a creator sees is exactly what brands see.
 * Incomplete shops and private account details are never part of this row.
 */
export interface Shopper {
  id: string;
  name: string;
  /** Without the leading "@". */
  handle: string;
  avatar?: string;
  bio: string;
  niches: string[];
  platforms: { name: SocialPlatform; handle: string; audience: number }[];
  /** Out of 5. Null until their first rated shop. */
  rating: number | null;
  completedShops: number;
  examplePosts: { platform: SocialPlatform; title: string; url: string }[];
  /** The banner the creator picked in Settings (see `profile-covers`). Unset runs the shader. */
  coverId?: string;
  coverImage?: string | null;
}

/** `pending` → `approved` | `declined` | `withdrawn`. Table: `pitches`. One per product per checkout. */
export type PitchStatus = "pending" | "approved" | "declined" | "withdrawn";

export interface Pitch {
  id: string;
  productId: string;
  tierId: string;
  shopperId: string;
  status: PitchStatus;
  createdAt: ISODateString;
}

/**
 * `approved` → `posted` → `confirmed` → `active` → `expired`, with `overdue`, `incomplete` and
 * `under_review` as side states. Confirming proof releases access, so the brand UI moves a shop
 * straight from `posted` to `active`; `confirmed` stays in the type for the receipt pipeline.
 */
export type BrandShopState = "approved" | "posted" | "confirmed" | "active" | "expired" | "overdue" | "incomplete" | "under_review";

/**
 * A protected deal, created when a pitch is approved. Table: `shops`.
 * Deal terms are copied from the product page at approval, so later edits never rewrite a deal.
 */
export interface BrandShop {
  id: string;
  pitchId: string;
  productId: string;
  productName: string;
  tierName: string;
  months: AccessMonths;
  retailValue: number;
  shopperId: string;
  state: BrandShopState;
  approvedAt: ISODateString;
  deadline: ISODateString;
  proofUrl?: string;
  /** Why the brand sent the proof back. Cleared when new proof arrives. */
  proofDeclineReason?: string;
  /** The note the brand sent when closing an overdue shop. */
  closeNote?: string;
  accessStart?: ISODateString;
  accessEnd?: ISODateString;
}

export type SubscriptionStatus = "none" | "active" | "grace" | "paused";

/** The merchant account and its public storefront. Table: `brands`. */
export interface BrandAccount {
  ownerName: string;
  workEmail: string;
  companyName: string;
  slug: string;
  website: string;
  tagline: string;
  category: string;
  /** v1 verification: the work email's domain matches the website's. */
  verified: boolean;
  subscription: SubscriptionStatus;
  rating: number | null;
  completedShops: number;
  /**
   * The intro a swipe right sends, written by the brand. `{first name}` becomes each creator's first
   * name. Unset until the brand writes one — their first swipe right asks for it before anything sends.
   */
  introMessage?: string;
  /** Right swipes send the intro (and the default campaign) without asking. Needs an intro. */
  autoSendInvites?: boolean;
  /** The campaign that goes with the intro — every time on auto-send, preselected when asking. Unset sends the intro alone. */
  defaultInviteProductId?: string;
}

/**
 * The brand reaching out first, from swipe mode on the creator directory. Swiping right sends the
 * brand's intro, and a campaign (a product page) with it when they pick one. Table: `creator_invites`.
 */
export interface CreatorInvite {
  id: string;
  shopperId: string;
  sentAt: ISODateString;
  /**
   * The intro exactly as sent, name filled in, so editing the saved intro never rewrites a thread.
   * Missing only on invites saved before intros were editable.
   */
  message?: string;
  /** The product page sent as the campaign. Missing when the brand sent the intro alone. */
  productId?: string;
}

/** Everything the signed-in brand owns on the client. `account` is null while signed out. */
export interface BrandState {
  version: 1;
  account: BrandAccount | null;
  products: ProductPage[];
  pitches: Pitch[];
  shops: BrandShop[];
  invites: CreatorInvite[];
}
