/**
 * Checks the link a creator submits as proof of payment: a live post on the
 * platform they paid with. It only checks the link's shape — it can't tell
 * whether the post exists.
 */
export interface ProofLinkCheck {
  /** Why the link can't be used, or null when it looks right. */
  problem: string | null;
  /** A non-blocking heads-up, e.g. the link is from a different account. */
  note: string | null;
  /** A short form of the link for showing on a receipt. */
  short: string;
}

/** What a valid post link looks like on each platform, so the field can hint at it. */
export const PROOF_LINK_EXAMPLES: Record<string, string> = {
  TikTok: "https://www.tiktok.com/@you/video/…",
  Instagram: "https://www.instagram.com/reel/…",
  X: "https://x.com/you/status/…",
};

function shorten(url: URL) {
  const text = `${url.hostname.replace(/^www\./, "")}${url.pathname.replace(/\/$/, "")}`;
  return text.length > 30 ? `${text.slice(0, 29)}…` : text;
}

function parse(raw: string) {
  try {
    return new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  } catch {
    return null;
  }
}

/** `handle` is the account the creator says they post from, e.g. "@jordanmakes". */
export function checkProofLink(platform: string, raw: string, handle: string): ProofLinkCheck {
  const value = raw.trim();
  if (!value) return { problem: "Paste the link to your live post.", note: null, short: "" };

  const url = parse(value);
  if (!url || !url.hostname.includes(".")) return { problem: "That doesn't look like a link.", note: null, short: "" };

  const host = url.hostname.replace(/^(www|m)\./, "");
  const path = url.pathname;
  const article = platform === "X" || /^[aeiou]/i.test(platform) ? "an" : "a";
  const wrong = { problem: `That doesn't look like a link to ${article} ${platform} post.`, note: null, short: "" };

  let linkedHandle: string | null = null;
  if (platform === "TikTok") {
    const full = /^\/@([^/]+)\/(video|photo)\/\d+/.exec(path);
    const short = host === "vm.tiktok.com" || host === "vt.tiktok.com" || (host === "tiktok.com" && /^\/t\/\w+/.test(path));
    if (host !== "tiktok.com" && !short) return wrong;
    if (!full && !short) return wrong;
    linkedHandle = full ? full[1] : null;
  } else if (platform === "Instagram") {
    if (host !== "instagram.com" || !/^\/([^/]+\/)?(p|reel|reels|tv)\/[\w-]+/.test(path)) return wrong;
  } else if (platform === "X") {
    const post = /^\/([^/]+)\/status\/\d+/.exec(path);
    if ((host !== "x.com" && host !== "twitter.com") || !post) return wrong;
    linkedHandle = post[1];
  }

  const expected = handle.replace(/^@/, "").toLowerCase();
  const note =
    linkedHandle && expected && linkedHandle.toLowerCase() !== expected
      ? `This post is from @${linkedHandle}, not ${handle}. Make sure it's your account.`
      : null;

  return { problem: null, note, short: shorten(url) };
}
