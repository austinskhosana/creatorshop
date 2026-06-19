export const DELIVERABLE_MAP = {
  "Instagram Reel": "INSTAGRAM_REEL",
  "Instagram Post": "INSTAGRAM_POST",
  "Instagram Story": "INSTAGRAM_STORY",
  "TikTok Video": "TIKTOK_VIDEO",
  "YouTube Video": "YOUTUBE_VIDEO",
  "YouTube Short": "YOUTUBE_SHORT",
  "Tweet / Thread": "TWEET",
  "LinkedIn Post": "LINKEDIN_POST",
  "Blog Post": "BLOG_POST",
} as const;

export const DELIVERABLE_LABELS = Object.keys(DELIVERABLE_MAP) as Array<
  keyof typeof DELIVERABLE_MAP
>;
