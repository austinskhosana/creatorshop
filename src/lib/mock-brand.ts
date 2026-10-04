import type { BrandAccount, BrandShop, Pitch, ProductPage, Shopper } from "@/lib/data/brand-schema";

/**
 * A fictional merchant for the brand-side prototype. "Fernpad" is invented, and every domain uses
 * the reserved `.example` TLD so nothing here points at a real company. The shoppers are fictional
 * creators; the three with illustrated avatars are the same characters the landing page uses.
 */

export const DEMO_ACCOUNT: BrandAccount = {
  ownerName: "Sam Rivera",
  workEmail: "sam@fernpad.example",
  companyName: "Fernpad",
  slug: "fernpad",
  website: "https://fernpad.example",
  tagline: "A calm notes app that links your ideas as you write.",
  category: "Productivity",
  verified: true,
  subscription: "active",
  rating: 4.8,
  completedShops: 14,
};

export const SHOPPERS: Shopper[] = [
  {
    id: "nova",
    name: "Nova Reyes",
    handle: "novareyes",
    avatar: "/creators/nova-reyes.png",
    bio: "Streetwear fits and vintage flips, plus the apps that keep a resale side hustle organised.",
    niches: ["Fashion", "Side hustles"],
    platforms: [{ name: "Instagram", handle: "novareyes", audience: 41200 }, { name: "TikTok", handle: "novareyes", audience: 23600 }],
    rating: 4.9,
    completedShops: 9,
    examplePosts: [{ platform: "TikTok", title: "How I track 200 thrift flips a month", url: "https://example.com/novareyes/thrift-tracker" }],
  },
  {
    id: "theo",
    name: "Theo Bramm",
    handle: "theobramm",
    avatar: "/creators/theo-bramm.png",
    bio: "Notion templates and productivity systems for indie hackers.",
    niches: ["Productivity", "Indie hacking"],
    platforms: [{ name: "Instagram", handle: "theobramm", audience: 112000 }, { name: "X", handle: "theobramm", audience: 18400 }],
    rating: 5,
    completedShops: 21,
    examplePosts: [
      { platform: "Instagram", title: "My second-brain setup, 2026 edition", url: "https://example.com/theobramm/second-brain" },
      { platform: "X", title: "Thread: 9 tools I pay for and why", url: "https://example.com/theobramm/tools-thread" },
    ],
  },
  {
    id: "marcus",
    name: "Marcus Vale",
    handle: "marcusvale",
    avatar: "/creators/marcus-vale.png",
    bio: "Strength training and mindset coaching for people rebuilding their routine.",
    niches: ["Fitness", "Mindset"],
    platforms: [{ name: "YouTube", handle: "marcusvale", audience: 18000 }, { name: "Instagram", handle: "marcusvale", audience: 9100 }],
    rating: 4.7,
    completedShops: 6,
    examplePosts: [{ platform: "YouTube", title: "Journaling for lifters: a 10-minute routine", url: "https://example.com/marcusvale/journaling" }],
  },
  {
    id: "lerato",
    name: "Lerato Dube",
    handle: "leratomakes",
    bio: "Johannesburg-based designer sharing study setups and calm workflows for creative students.",
    niches: ["Design", "Study"],
    platforms: [{ name: "TikTok", handle: "leratomakes", audience: 36800 }, { name: "Instagram", handle: "leratomakes", audience: 12500 }],
    rating: 4.8,
    completedShops: 4,
    examplePosts: [{ platform: "TikTok", title: "Desk tour: final-year design student", url: "https://example.com/leratomakes/desk-tour" }],
  },
  {
    id: "kai",
    name: "Kai Okafor",
    handle: "kaibuilds",
    bio: "Shipping small apps in public and reviewing the dev tools that make it possible.",
    niches: ["Dev tools", "Building in public"],
    platforms: [{ name: "X", handle: "kaibuilds", audience: 27300 }, { name: "YouTube", handle: "kaibuilds", audience: 8400 }],
    rating: null,
    completedShops: 0,
    examplePosts: [{ platform: "X", title: "Week 12 of building a habit tracker in public", url: "https://example.com/kaibuilds/week-12" }],
  },
  {
    id: "priya",
    name: "Priya Raman",
    handle: "priyareads",
    bio: "Book notes, reading systems, and the occasional annotated-library tour.",
    niches: ["Books", "Productivity"],
    platforms: [{ name: "Instagram", handle: "priyareads", audience: 58900 }],
    rating: 4.6,
    completedShops: 3,
    examplePosts: [{ platform: "Instagram", title: "How I take notes on 60 books a year", url: "https://example.com/priyareads/book-notes" }],
  },
  {
    id: "diego",
    name: "Diego Ferraz",
    handle: "diegoexplains",
    bio: "Explainer videos on AI tools, minus the hype. Long-form reviews every Thursday.",
    niches: ["AI tools", "Tech reviews"],
    platforms: [{ name: "YouTube", handle: "diegoexplains", audience: 146000 }, { name: "TikTok", handle: "diegoexplains", audience: 51000 }],
    rating: 4.9,
    completedShops: 17,
    examplePosts: [{ platform: "YouTube", title: "I tested 5 AI note-takers for a month", url: "https://example.com/diegoexplains/ai-notetakers" }],
  },
  {
    id: "sasha",
    name: "Sasha Lindqvist",
    handle: "sashawrites",
    bio: "Newsletter writer turning messy research into clear threads.",
    niches: ["Writing", "Research"],
    platforms: [{ name: "X", handle: "sashawrites", audience: 22100 }],
    rating: 4.8,
    completedShops: 8,
    examplePosts: [{ platform: "X", title: "My research-to-newsletter pipeline", url: "https://example.com/sashawrites/pipeline" }],
  },
  {
    id: "jun",
    name: "Jun Park",
    handle: "junpark.studio",
    bio: "Short videos on minimalist tech and calmer phones.",
    niches: ["Minimalism", "Tech"],
    platforms: [{ name: "TikTok", handle: "junpark.studio", audience: 74000 }],
    rating: 4.4,
    completedShops: 5,
    examplePosts: [{ platform: "TikTok", title: "My 4-app home screen", url: "https://example.com/junpark/home-screen" }],
  },
  {
    id: "maya",
    name: "Maya Cohen",
    handle: "mayaplans",
    bio: "Planner spreads, digital and paper, for busy parents.",
    niches: ["Planning", "Family"],
    platforms: [{ name: "Instagram", handle: "mayaplans", audience: 31400 }, { name: "TikTok", handle: "mayaplans", audience: 12900 }],
    rating: 4.7,
    completedShops: 11,
    examplePosts: [{ platform: "Instagram", title: "Sunday reset: planning the family week", url: "https://example.com/mayaplans/sunday-reset" }],
  },
];

export const DEMO_PRODUCTS: ProductPage[] = [
  {
    id: "fernpad-pro",
    slug: "fernpad-pro",
    name: "Fernpad Pro",
    description:
      "Unlimited linked notes, offline sync, and the graph view. We want a real look at how you capture and connect ideas — show the backlinks panel in action. Must-have: mention that notes stay plain Markdown.",
    tiers: [
      { id: "fernpad-pro--ig-carousel", name: "Instagram carousel", months: 3, retailValue: 36 },
      { id: "fernpad-pro--ig-reel", name: "Instagram Reel", months: 6, retailValue: 72 },
    ],
    accessMethod: "promo_code",
    accessPayload: "FERN-CS-PRO",
    accessInstructions: "Redeem at fernpad.example/redeem after signing in.",
    stock: 12,
    deadlineDays: 14,
    status: "live",
    createdAt: "2026-09-01T09:00:00.000Z",
  },
  {
    id: "fernpad-ai",
    slug: "fernpad-ai-notes",
    name: "Fernpad AI Notes",
    description:
      "Meeting transcripts that turn into linked notes automatically. Show a real meeting (or a mock one) going from recording to summary. Must-have: point out that audio never leaves the device.",
    tiers: [
      { id: "fernpad-ai--x-thread", name: "X thread", months: 1, retailValue: 12 },
    ],
    accessMethod: "license_key",
    accessPayload: "FPAI-7Q2M-K8RD-41XZ",
    accessInstructions: "Paste the key in Settings → License.",
    creatorAccess: { method: "promo_code", payload: "FPAI-MAKE-CS", instructions: "Redeem at fernpad.example/redeem to record your demo meeting." },
    stock: 8,
    deadlineDays: 21,
    status: "live",
    createdAt: "2026-09-10T09:00:00.000Z",
  },
  {
    id: "fernpad-sync",
    slug: "fernpad-sync",
    name: "Fernpad Sync",
    description: "End-to-end encrypted sync across every device. A quick story showing a note appear on your phone after writing it on desktop.",
    tiers: [{ id: "fernpad-sync--ig-story", name: "Instagram Story", months: 1, retailValue: 8 }],
    accessMethod: "invite_link",
    accessPayload: "https://fernpad.example/invite/cs-sync",
    accessInstructions: "",
    stock: 4,
    deadlineDays: 7,
    status: "sold_out",
    createdAt: "2026-08-12T09:00:00.000Z",
  },
  {
    id: "fernpad-templates",
    slug: "fernpad-templates",
    name: "Fernpad Template Pack",
    description: "Forty planning and research templates. Show one template in daily use — we'd love a study or content-planning angle.",
    tiers: [{ id: "fernpad-templates--tiktok-video", name: "TikTok video", months: 3, retailValue: 15 }],
    accessMethod: "promo_code",
    accessPayload: "FERN-TPL-CS",
    accessInstructions: "",
    stock: 10,
    deadlineDays: 14,
    status: "paused",
    pausedFrom: "live",
    createdAt: "2026-08-20T09:00:00.000Z",
  },
  {
    id: "fernpad-teams",
    slug: "fernpad-teams",
    name: "Fernpad Teams",
    description: "Shared workspaces with permissions and comments. Looking for a walkthrough of a small team planning a launch together.",
    tiers: [{ id: "fernpad-teams--ig-reel", name: "Instagram Reel", months: 3, retailValue: 60 }],
    accessMethod: "manual_seat",
    accessPayload: "",
    accessInstructions: "We'll add your email to a team workspace within one working day.",
    stock: 5,
    deadlineDays: 14,
    status: "draft",
    createdAt: "2026-09-28T09:00:00.000Z",
  },
];

export const DEMO_PITCHES: Pitch[] = [
  { id: "pitch-nova-pro", productId: "fernpad-pro", tierId: "fernpad-pro--ig-reel", shopperId: "nova", status: "pending", createdAt: "2026-10-01T08:12:00.000Z" },
  { id: "pitch-lerato-pro", productId: "fernpad-pro", tierId: "fernpad-pro--ig-reel", shopperId: "lerato", status: "pending", createdAt: "2026-10-01T14:40:00.000Z" },
  { id: "pitch-priya-pro", productId: "fernpad-pro", tierId: "fernpad-pro--ig-carousel", shopperId: "priya", status: "pending", createdAt: "2026-10-02T07:05:00.000Z" },
  { id: "pitch-kai-pro", productId: "fernpad-pro", tierId: "fernpad-pro--ig-carousel", shopperId: "kai", status: "pending", createdAt: "2026-10-02T19:30:00.000Z" },
  { id: "pitch-theo-ai", productId: "fernpad-ai", tierId: "fernpad-ai--x-thread", shopperId: "theo", status: "pending", createdAt: "2026-10-03T06:45:00.000Z" },
  // Already decided — they back the shops below.
  { id: "pitch-marcus-pro", productId: "fernpad-pro", tierId: "fernpad-pro--ig-carousel", shopperId: "marcus", status: "approved", createdAt: "2026-09-18T09:00:00.000Z" },
  { id: "pitch-jun-pro", productId: "fernpad-pro", tierId: "fernpad-pro--ig-reel", shopperId: "jun", status: "approved", createdAt: "2026-09-10T09:00:00.000Z" },
  { id: "pitch-sasha-ai", productId: "fernpad-ai", tierId: "fernpad-ai--x-thread", shopperId: "sasha", status: "approved", createdAt: "2026-09-26T09:00:00.000Z" },
  { id: "pitch-theo-sync", productId: "fernpad-sync", tierId: "fernpad-sync--ig-story", shopperId: "theo", status: "approved", createdAt: "2026-09-01T09:00:00.000Z" },
  { id: "pitch-jun-sync", productId: "fernpad-sync", tierId: "fernpad-sync--ig-story", shopperId: "jun", status: "approved", createdAt: "2026-09-02T09:00:00.000Z" },
  { id: "pitch-maya-sync", productId: "fernpad-sync", tierId: "fernpad-sync--ig-story", shopperId: "maya", status: "approved", createdAt: "2026-08-14T09:00:00.000Z" },
  { id: "pitch-sasha-sync", productId: "fernpad-sync", tierId: "fernpad-sync--ig-story", shopperId: "sasha", status: "approved", createdAt: "2026-08-15T09:00:00.000Z" },
  { id: "pitch-priya-sync", productId: "fernpad-sync", tierId: "fernpad-sync--ig-story", shopperId: "priya", status: "declined", createdAt: "2026-08-16T09:00:00.000Z" },
];

export const DEMO_SHOPS: BrandShop[] = [
  { id: "shop-marcus-pro", pitchId: "pitch-marcus-pro", productId: "fernpad-pro", productName: "Fernpad Pro", tierName: "Instagram carousel", months: 3, retailValue: 36, shopperId: "marcus", state: "posted", approvedAt: "2026-09-20T09:00:00.000Z", deadline: "2026-10-04T09:00:00.000Z", proofUrl: "https://example.com/marcusvale/fernpad-carousel" },
  { id: "shop-sasha-ai", pitchId: "pitch-sasha-ai", productId: "fernpad-ai", productName: "Fernpad AI Notes", tierName: "X thread", months: 1, retailValue: 12, shopperId: "sasha", state: "approved", approvedAt: "2026-09-27T09:00:00.000Z", deadline: "2026-10-18T09:00:00.000Z" },
  { id: "shop-jun-pro", pitchId: "pitch-jun-pro", productId: "fernpad-pro", productName: "Fernpad Pro", tierName: "Instagram Reel", months: 6, retailValue: 72, shopperId: "jun", state: "overdue", approvedAt: "2026-09-12T09:00:00.000Z", deadline: "2026-09-26T09:00:00.000Z" },
  { id: "shop-theo-sync", pitchId: "pitch-theo-sync", productId: "fernpad-sync", productName: "Fernpad Sync", tierName: "Instagram Story", months: 1, retailValue: 8, shopperId: "theo", state: "active", approvedAt: "2026-09-02T09:00:00.000Z", deadline: "2026-09-09T09:00:00.000Z", proofUrl: "https://example.com/theobramm/sync-story", accessStart: "2026-09-08T09:00:00.000Z", accessEnd: "2026-10-08T09:00:00.000Z" },
  { id: "shop-jun-sync", pitchId: "pitch-jun-sync", productId: "fernpad-sync", productName: "Fernpad Sync", tierName: "Instagram Story", months: 1, retailValue: 8, shopperId: "jun", state: "active", approvedAt: "2026-09-03T09:00:00.000Z", deadline: "2026-09-10T09:00:00.000Z", proofUrl: "https://example.com/junpark/sync-story", accessStart: "2026-09-09T09:00:00.000Z", accessEnd: "2026-10-09T09:00:00.000Z" },
  { id: "shop-maya-sync", pitchId: "pitch-maya-sync", productId: "fernpad-sync", productName: "Fernpad Sync", tierName: "Instagram Story", months: 1, retailValue: 8, shopperId: "maya", state: "expired", approvedAt: "2026-08-15T09:00:00.000Z", deadline: "2026-08-22T09:00:00.000Z", proofUrl: "https://example.com/mayaplans/sync-story", accessStart: "2026-08-20T09:00:00.000Z", accessEnd: "2026-09-20T09:00:00.000Z" },
  { id: "shop-sasha-sync", pitchId: "pitch-sasha-sync", productId: "fernpad-sync", productName: "Fernpad Sync", tierName: "Instagram Story", months: 1, retailValue: 8, shopperId: "sasha", state: "expired", approvedAt: "2026-08-16T09:00:00.000Z", deadline: "2026-08-23T09:00:00.000Z", proofUrl: "https://example.com/sashawrites/sync-story", accessStart: "2026-08-21T09:00:00.000Z", accessEnd: "2026-09-21T09:00:00.000Z" },
];

export function getShopper(id: string) {
  return SHOPPERS.find((shopper) => shopper.id === id);
}

export function getShopperByHandle(handle: string) {
  return SHOPPERS.find((shopper) => shopper.handle === handle);
}

/** Total audience across platforms, compact: 64.8K. */
export function formatAudience(count: number) {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(count);
}

export function totalAudience(shopper: Shopper) {
  return shopper.platforms.reduce((sum, platform) => sum + platform.audience, 0);
}
