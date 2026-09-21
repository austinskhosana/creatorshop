export type ShopState = "pending" | "approved" | "posted" | "active" | "expired" | "overdue" | "declined" | "withdrawn";

export type CreatorShop = {
  id: string;
  product: string;
  brand: string;
  description: string;
  tier: string;
  value: number;
  access: string;
  state: ShopState;
  deadline?: string;
  accessEnd?: string;
  accessCode?: string;
  redemptionUrl?: string;
  logo: string;
};

export const CREATOR = {
  name: "Jordan Lee",
  handle: "@jordanmakes",
  initials: "JL",
  avatar: "/creators/meng-to.png",
  followers: "50K+",
  bio: "Designing a calmer, more capable internet — one tool at a time.",
  niche: "Design & creative tools",
  niches: ["Design", "Creative tools", "Productivity"],
  rating: "4.9",
  completedShops: 12,
  platforms: [
    { name: "Instagram", handle: "@jordanmakes", audience: "28.4K" },
    { name: "YouTube", handle: "Jordan Makes", audience: "14.2K" },
    { name: "TikTok", handle: "@jordanmakes", audience: "9.8K" },
  ],
};

export const CREATOR_SHOPS: CreatorShop[] = [
  { id: "paper", product: "Paper Pro", brand: "Paper", description: "An AI-native design canvas where what you draw is real HTML and CSS.", tier: "Instagram carousel", value: 48, access: "3 months", state: "active", accessEnd: "Dec 21, 2026", accessCode: "CS-PAPER-JL26-PRO", redemptionUrl: "https://paper.design", logo: "/logos/paper.jpeg" },
  { id: "cursor", product: "Cursor Pro", brand: "Cursor", description: "An AI code editor that reads your whole codebase as you write.", tier: "YouTube review", value: 120, access: "6 months", state: "posted", deadline: "Sep 18", logo: "/logos/cursor.jpg" },
  { id: "notion", product: "Notion Plus", brand: "Notion", description: "Docs, wikis, and project tracking in one connected workspace.", tier: "X thread", value: 120, access: "12 months", state: "active", accessEnd: "Oct 31, 2026", accessCode: "CS-NOTION-JL26-PLUS", redemptionUrl: "https://www.notion.so/product", logo: "/logos/notion.jpg" },
  { id: "dia", product: "Dia Browser", brand: "Dia", description: "An AI browser that understands your tabs and remembers your context.", tier: "TikTok", value: 60, access: "3 months", state: "expired", logo: "/logos/dia-browser.jpg" },
  { id: "elevenlabs", product: "ElevenLabs Creator", brand: "ElevenLabs", description: "Lifelike voiceovers and voice cloning built for creators.", tier: "YouTube review", value: 66, access: "3 months", state: "overdue", deadline: "Sep 14", logo: "/logos/elevenlabs.png" },
  { id: "canva", product: "Canva Pro", brand: "Canva", description: "Design social posts, presentations, and more with ready-made templates.", tier: "TikTok", value: 54, access: "3 months", state: "pending", logo: "/logos/canva.jpg" },
  { id: "spotify", product: "Spotify Premium", brand: "Spotify", description: "Ad-free music with offline downloads and unlimited skips.", tier: "TikTok", value: 39, access: "3 months", state: "declined", logo: "/logos/spotify.jpg" },
];

export const CART_ITEMS = [
  { id: "cursor", product: "Cursor Pro", brand: "Cursor", tier: "YouTube review", value: 120, access: "6 months", logo: "/logos/cursor.jpg" },
  { id: "higgsfield", product: "Higgsfield Starter", brand: "Higgsfield", tier: "TikTok", value: 57, access: "3 months", logo: "/logos/higgsfield.jpg" },
];
