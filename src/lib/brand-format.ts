import type { StatusTone } from "@/components/molecules/StatusPill";
import { CONTENT_TYPES, resolveContentType } from "@/lib/content-types";
import type { AccessMethod, AccessMonths, BrandShopState, PriceTier, ProductPageStatus, Shopper } from "@/lib/data/brand-schema";
import { formatAudience, totalAudience } from "@/lib/mock-brand";
import { socialProfileUrl } from "@/lib/socials";

/** Shop language for every brand-side status. Commerce words only — see the v1 spec's language rules. */

export const PRODUCT_STATUS: Record<ProductPageStatus, { label: string; tone: StatusTone }> = {
  draft: { label: "Draft", tone: "neutral" },
  live: { label: "Live", tone: "success" },
  sold_out: { label: "Sold out", tone: "waiting" },
  closed: { label: "Closed", tone: "muted" },
  paused: { label: "Paused", tone: "muted" },
};

export const BRAND_SHOP_STATE: Record<BrandShopState, { label: string; tone: StatusTone }> = {
  approved: { label: "Awaiting post", tone: "waiting" },
  posted: { label: "Proof to review", tone: "progress" },
  confirmed: { label: "Proof confirmed", tone: "success" },
  active: { label: "Access active", tone: "success" },
  expired: { label: "Access expired", tone: "muted" },
  overdue: { label: "Post overdue", tone: "danger" },
  incomplete: { label: "Incomplete", tone: "neutral" },
  under_review: { label: "Under review", tone: "danger" },
};

export const ACCESS_METHODS: { value: AccessMethod; label: string; payloadLabel: string; placeholder: string }[] = [
  { value: "promo_code", label: "Promo code", payloadLabel: "Promo code", placeholder: "e.g. CREATORSHOP-PRO" },
  { value: "license_key", label: "License key", payloadLabel: "License key", placeholder: "e.g. XXXX-XXXX-XXXX-XXXX" },
  { value: "invite_link", label: "Invite or referral link", payloadLabel: "Invite link", placeholder: "https://" },
  { value: "manual_seat", label: "Manual seat add", payloadLabel: "", placeholder: "" },
  { value: "email_invite", label: "Email invite", payloadLabel: "", placeholder: "" },
  { value: "instructions", label: "Written instructions", payloadLabel: "", placeholder: "" },
];

export function accessMethodLabel(method: AccessMethod) {
  return ACCESS_METHODS.find((item) => item.value === method)?.label ?? method;
}

/** What a creator can pay with: the post builder's content types, plus long-form YouTube reviews. */
export const TIER_CONTENT_TYPES = [...Object.values(CONTENT_TYPES).map((type) => type.label), "YouTube review"];

export const ACCESS_MONTHS: AccessMonths[] = [1, 3, 6];

/** The platform a tier's content type posts to, e.g. "Instagram" for "Instagram Story". */
export function tierPlatform(name: string) {
  return resolveContentType(name).platform;
}

/** A product page runs on one platform; tiers can be different content types on it. */
export const TIER_PLATFORMS = [...new Set(TIER_CONTENT_TYPES.map(tierPlatform))];

export function contentTypesFor(platform: string) {
  return TIER_CONTENT_TYPES.filter((label) => tierPlatform(label) === platform);
}

export function productPlatform(product: { tiers: Pick<PriceTier, "name">[] }) {
  return tierPlatform(product.tiers[0]?.name ?? TIER_CONTENT_TYPES[0]);
}

/** "3 months" or "1–6 months" — the access a page's tiers buy, read on its own. */
export function formatAccessRange(tiers: Pick<PriceTier, "months">[]) {
  if (tiers.length === 0) return "";
  const months = tiers.map((tier) => tier.months);
  const low = Math.min(...months);
  const high = Math.max(...months);
  return low === high ? formatMonths(low) : `${low}–${high} months`;
}

export function formatMonths(months: number) {
  return `${months} month${months === 1 ? "" : "s"}`;
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatUsd(value: number) {
  return `$${value.toLocaleString("en-US")}`;
}

/** "Today", "in 3 days", "2 days ago" — relative to now. */
export function relativeDays(iso: string) {
  const days = Math.round((new Date(iso).getTime() - Date.now()) / (24 * 60 * 60 * 1000));
  if (days === 0) return "today";
  if (days > 0) return `in ${days} day${days === 1 ? "" : "s"}`;
  return `${-days} day${days === -1 ? "" : "s"} ago`;
}

/** A public profile's numbers and links, formatted for display. */
export interface ProfileCardDisplay {
  name: string;
  handle: string;
  avatar?: string;
  followers: string;
  bio: string;
  niches: string[];
  platforms: { name: string; handle: string; audience: string; url: string }[];
}

/** A shopper's handles, audience and links formatted the way the creator profile card shows them. */
export function toProfileCard(shopper: Shopper): ProfileCardDisplay {
  return {
    name: shopper.name,
    handle: `@${shopper.handle}`,
    avatar: shopper.avatar,
    bio: shopper.bio,
    niches: shopper.niches,
    followers: formatAudience(totalAudience(shopper)),
    platforms: shopper.platforms.map((platform) => ({
      name: platform.name,
      handle: `@${platform.handle}`,
      audience: formatAudience(platform.audience),
      url: socialProfileUrl(platform.name, platform.handle),
    })),
  };
}
