/**
 * The kinds of post a creator can pay with, across TikTok, Instagram and X.
 * Each one picks the layout the post builder shows.
 *
 * The limits are prototype values — check them against each platform before
 * launch, since platforms change them.
 */
export type ContentTypeId = "tiktok-video" | "tiktok-carousel" | "ig-reel" | "ig-carousel" | "ig-story" | "x-thread";

/** How the post builder is laid out for a content type. */
export type BuilderLayout = "video" | "carousel" | "story" | "thread";

export interface ContentType {
  /** `generic` is the fallback for tiers that aren't one of the ones below. */
  id: ContentTypeId | "generic";
  platform: string;
  label: string;
  layout: BuilderLayout;
  /** Max characters — for the caption, or for each post in a thread. 0 when the type has no caption (Stories). */
  textLimit: number;
  /** Slides in a carousel, frames in a Story, or posts in a thread. */
  range?: { min: number; max: number };
}

export const CONTENT_TYPES: Record<ContentTypeId, ContentType> = {
  "tiktok-video": { id: "tiktok-video", platform: "TikTok", label: "TikTok video", layout: "video", textLimit: 4000 },
  "tiktok-carousel": { id: "tiktok-carousel", platform: "TikTok", label: "TikTok carousel", layout: "carousel", textLimit: 4000, range: { min: 2, max: 6 } },
  "ig-reel": { id: "ig-reel", platform: "Instagram", label: "Instagram Reel", layout: "video", textLimit: 2200 },
  "ig-carousel": { id: "ig-carousel", platform: "Instagram", label: "Instagram carousel", layout: "carousel", textLimit: 2200, range: { min: 2, max: 6 } },
  "ig-story": { id: "ig-story", platform: "Instagram", label: "Instagram Story", layout: "story", textLimit: 0, range: { min: 1, max: 5 } },
  "x-thread": { id: "x-thread", platform: "X", label: "X thread", layout: "thread", textLimit: 280, range: { min: 2, max: 10 } },
};

export function isContentTypeId(value: string): value is ContentTypeId {
  return value in CONTENT_TYPES;
}

/**
 * Maps a shop's `tier` (or a listing deliverable such as "IG Reel") to a content
 * type. The data spells these inconsistently — "IG carousel" / "Instagram
 * carousel", "TikTok" / "TikTok video" — so this matches on the prefix.
 */
export function resolveContentType(tier: string): ContentType {
  const value = tier.trim().toLowerCase();
  if (value.startsWith("x thread")) return CONTENT_TYPES["x-thread"];
  if (/^tiktok (carousel|photo)/.test(value)) return CONTENT_TYPES["tiktok-carousel"];
  if (value.startsWith("tiktok")) return CONTENT_TYPES["tiktok-video"];
  if (/^(ig|instagram) reel/.test(value)) return CONTENT_TYPES["ig-reel"];
  if (/^(ig|instagram) carousel/.test(value)) return CONTENT_TYPES["ig-carousel"];
  if (/^(ig|instagram) stor(y|ies)/.test(value)) return CONTENT_TYPES["ig-story"];
  return {
    id: "generic",
    platform: tier.split(" ")[0] || tier,
    label: tier,
    layout: "carousel",
    textLimit: 2200,
    range: { min: 1, max: 6 },
  };
}
