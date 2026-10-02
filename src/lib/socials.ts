/**
 * The social accounts a creator can list on their profile, and how a handle becomes a link.
 * Names match `content-types` platforms, so a deliverable's platform finds the right handle.
 */
export const SOCIAL_PLATFORMS = [
  { name: "Instagram", host: "instagram.com", prefix: "instagram.com/" },
  { name: "TikTok", host: "tiktok.com", prefix: "tiktok.com/@" },
  { name: "YouTube", host: "youtube.com", prefix: "youtube.com/@" },
  { name: "X", host: "x.com", prefix: "x.com/" },
] as const;

export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number]["name"];

/** Handles without the leading "@". An empty string means the creator hasn't added that account. */
export type SocialHandles = Record<SocialPlatform, string>;

export function socialProfileUrl(platform: SocialPlatform, handle: string) {
  const { prefix } = SOCIAL_PLATFORMS.find((item) => item.name === platform)!;
  return `https://www.${prefix}${encodeURIComponent(handle)}`;
}

/**
 * Turns whatever the creator typed or pasted — "@name", "name", or a full profile link —
 * into a bare handle.
 */
export function normalizeHandle(platform: SocialPlatform, raw: string) {
  const { host } = SOCIAL_PLATFORMS.find((item) => item.name === platform)!;
  let value = raw.trim();
  const link = new RegExp(`^(?:https?://)?(?:www\\.|m\\.)?${host.replace(".", "\\.")}/`, "i");
  if (link.test(value)) value = value.replace(link, "").split(/[/?#]/)[0];
  return value.replace(/^@/, "").replace(/\s/g, "");
}
