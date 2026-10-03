import type { Shop } from "@/lib/data/schema";

export type { ShopState } from "@/lib/data/schema";
/** A shop as the creator's screens read it. Same row as `Shop`; the alias predates the data model. */
export type CreatorShop = Shop;

export const CREATOR = {
  name: "Jordan Lee",
  handle: "@jordanmakes",
  initials: "JL",
  avatar: "/creators/nova-reyes.png",
  followers: "50K+",
  bio: "Designing a calmer, more capable internet — one tool at a time.",
  niche: "Design & creative tools",
  niches: ["Design & creative tools", "Tech & software"],
  rating: "4.9",
  completedShops: 12,
};

/**
 * The parts of Jordan's public profile they can't type in Settings: audience comes from connected
 * accounts and example posts from finished shops. Fictional, like the rest of this file.
 */
export const CREATOR_TRACK_RECORD = {
  audience: { Instagram: 31_200, TikTok: 14_800, YouTube: 6_400, X: 2_900 },
  examplePosts: [
    { platform: "Instagram", title: "Paper Pro: designing in real HTML", url: "https://example.com/jordanmakes/paper-carousel" },
    { platform: "X", title: "Thread: the 6 tools on my design desk", url: "https://example.com/jordanmakes/design-desk" },
  ],
} as const;

export const CREATOR_SHOPS: CreatorShop[] = [
  { id: "paper", listingSlug: "paper", product: "Paper Pro", brand: "Paper", description: "An AI-native design canvas where what you draw is real HTML and CSS.", tier: "Instagram carousel", value: 48, access: "3 months", state: "active", accessEnd: "Dec 21, 2026", accessCode: "CS-PAPER-JL26-PRO", redemptionUrl: "https://paper.design", createdAt: "2026-09-02T09:00:00.000Z" },
  { id: "cursor", listingSlug: "cursor", product: "Cursor Pro", brand: "Cursor", description: "An AI code editor that reads your whole codebase as you write.", tier: "IG Reel", value: 120, access: "6 months", state: "posted", deadline: "Sep 18", createdAt: "2026-08-28T09:00:00.000Z" },
  { id: "notion", listingSlug: "notion", product: "Notion Plus", brand: "Notion", description: "Docs, wikis, and project tracking in one connected workspace.", tier: "X thread", value: 120, access: "12 months", state: "active", accessEnd: "Oct 31, 2026", accessCode: "CS-NOTION-JL26-PLUS", redemptionUrl: "https://www.notion.so/product", createdAt: "2026-08-14T09:00:00.000Z" },
  { id: "dia", listingSlug: "dia-browser", product: "Dia Browser", brand: "Dia", description: "An AI browser that understands your tabs and remembers your context.", tier: "TikTok", value: 60, access: "3 months", state: "expired", createdAt: "2026-06-10T09:00:00.000Z" },
  { id: "elevenlabs", listingSlug: "elevenlabs", product: "ElevenLabs Creator", brand: "ElevenLabs", description: "Lifelike voiceovers and voice cloning built for creators.", tier: "TikTok", value: 66, access: "3 months", state: "overdue", deadline: "Sep 14", createdAt: "2026-08-30T09:00:00.000Z" },
  { id: "canva", listingSlug: "canva", product: "Canva Pro", brand: "Canva", description: "Design social posts, presentations, and more with ready-made templates.", tier: "TikTok", value: 54, access: "3 months", state: "approved", deadline: "Oct 3", createdAt: "2026-09-22T09:00:00.000Z" },
  { id: "higgsfield", listingSlug: "higgsfield", product: "Higgsfield Starter", brand: "Higgsfield", description: "Turn a prompt into cinematic AI video, with motion presets and camera control.", tier: "TikTok", value: 57, access: "3 months", state: "ready", deadline: "Oct 6", createdAt: "2026-09-18T09:00:00.000Z" },
  { id: "procreate", listingSlug: "procreate", product: "Procreate", brand: "Procreate", description: "The iPad illustration app, with a full brush engine and animation tools.", tier: "Instagram carousel", value: 13, access: "1 month", state: "draft", deadline: "Oct 8", createdAt: "2026-09-20T09:00:00.000Z" },
  { id: "spotify", listingSlug: "spotify", product: "Spotify Premium", brand: "Spotify", description: "Ad-free music with offline downloads and unlimited skips.", tier: "TikTok", value: 39, access: "3 months", state: "declined", createdAt: "2026-07-05T09:00:00.000Z" },
];

/** Static cart for the receipt-printer showcase. The real cart lives in the creator store. */
export const CART_ITEMS = [
  { id: "cursor", product: "Cursor Pro", brand: "Cursor", tier: "IG Reel", value: 120, access: "6 months", logo: "/logos/cursor.jpg" },
  { id: "higgsfield", product: "Higgsfield Starter", brand: "Higgsfield", tier: "TikTok", value: 57, access: "3 months", logo: "/logos/higgsfield.jpg" },
];
