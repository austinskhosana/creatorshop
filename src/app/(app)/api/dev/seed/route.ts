/**
 * DEV-ONLY seed route — never runs in production.
 * POST /api/dev/seed?brandUserId=xxx
 *
 * Seeds 6 creator users + profiles + a software listing + 6 PENDING shops
 * so the /applications swipe flow has real data to work with.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

if (process.env.NODE_ENV === "production") {
  throw new Error("Seed route must never run in production");
}

// ── Fake creator profiles ──────────────────────────────────────────────────────

const CREATORS = [
  {
    email: "zara.mensah@seed.dev",
    displayName: "Zara Mensah",
    bio: "Lifestyle & wellness creator based in London. I make content that actually helps people feel good.",
    location: "London, UK",
    niches: ["Wellness", "Lifestyle", "Mental Health"],
    services: ["Instagram Post", "Instagram Reel", "Story Series"],
    audienceSize: "84K",
    instagramUrl: "https://instagram.com/zaramensah",
    deliverable: "INSTAGRAM_REEL" as const,
    pitch: "I've been looking for a project management tool that doesn't make my brain hurt. Your app looks exactly like what my community asks about constantly — I'd love to create an honest 'day in my life using Notion' reel showing how it fits into a creative workflow.",
  },
  {
    email: "kai.brooks@seed.dev",
    displayName: "Kai Brooks",
    bio: "Tech & productivity YouTuber. I break down complex tools into digestible videos for founders and indie hackers.",
    location: "Austin, TX",
    niches: ["Tech", "Productivity", "SaaS"],
    services: ["YouTube Video", "YouTube Short", "Newsletter"],
    audienceSize: "210K",
    instagramUrl: null,
    deliverable: "YOUTUBE_VIDEO" as const,
    pitch: "My audience is exactly your ICP — bootstrapped founders who live in their tools. I do a monthly 'my current stack' video that consistently hits 100K+ views. I'd feature your software as my primary tool for the next 30 days and document the real impact.",
  },
  {
    email: "nina.okafor@seed.dev",
    displayName: "Nina Okafor",
    bio: "TikTok creator in the personal finance space. Making money stuff less scary for Gen Z.",
    location: "Lagos / Remote",
    niches: ["Finance", "Gen Z", "Career"],
    services: ["TikTok Video", "Instagram Reel", "Duet/Stitch"],
    audienceSize: "1.2M",
    instagramUrl: null,
    deliverable: "TIKTOK_VIDEO" as const,
    pitch: "I post daily about tools that help young professionals manage their money and careers. My audience skews 18–26 and they trust my recommendations — I've driven 40K+ signups for fintech apps in the past. I'd create a honest 'I tried it for a week' TikTok series.",
  },
  {
    email: "tom.hadley@seed.dev",
    displayName: "Tom Hadley",
    bio: "Design & UX creator on LinkedIn. Writing about the intersection of design systems and real-world product work.",
    location: "Berlin, Germany",
    niches: ["Design", "UX", "Product"],
    services: ["LinkedIn Post", "Newsletter", "Twitter/X Thread"],
    audienceSize: "47K followers",
    instagramUrl: null,
    deliverable: "LINKEDIN_POST" as const,
    pitch: "My LinkedIn audience is made up of senior designers and PMs at B2B companies — exactly the people who evaluate and buy tools like yours. I'd write a deep-dive case study on how I integrated your software into my design process, with real screenshots and outcomes.",
  },
  {
    email: "priya.singh@seed.dev",
    displayName: "Priya Singh",
    bio: "Food & travel creator. Partner-friendly content that actually converts — I have the receipts.",
    location: "Mumbai, India",
    niches: ["Food", "Travel", "Lifestyle"],
    services: ["Instagram Post", "Instagram Story", "Blog Post"],
    audienceSize: "320K",
    instagramUrl: "https://instagram.com/priyasinghcreates",
    deliverable: "INSTAGRAM_POST" as const,
    pitch: "I know food & travel sounds off-brand for a software product, but my audience is full of small business owners — restaurant owners, travel agencies, boutique hotels — who are actively looking for tools to streamline operations. I'd frame this as 'the tool that runs my creator business'.",
  },
  {
    email: "marcus.cole@seed.dev",
    displayName: "Marcus Cole",
    bio: "Developer advocate and content creator. I make coding feel approachable and actually fun.",
    location: "Toronto, Canada",
    niches: ["Dev Tools", "Open Source", "Career"],
    services: ["YouTube Video", "Blog Post", "Twitter/X Thread"],
    audienceSize: "95K",
    instagramUrl: null,
    deliverable: "YOUTUBE_SHORT" as const,
    pitch: "Developers in my community are always asking for tool recommendations from someone they trust rather than ads. I've been wanting to cover your product for a while — I'd create a 'first look' short-form video plus a longer-form tutorial showing real use cases.",
  },
];

// ── Route handler ──────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const brandUserId = searchParams.get("brandUserId");

  if (!brandUserId) {
    return NextResponse.json({ error: "brandUserId query param required" }, { status: 400 });
  }

  // Verify brand user exists
  const brandUser = await prisma.user.findUnique({ where: { id: brandUserId } });
  if (!brandUser) {
    return NextResponse.json({ error: "Brand user not found" }, { status: 404 });
  }

  // ── Ensure brand profile exists ──────────────────────────────────────────────
  const brandProfile = await prisma.brandProfile.upsert({
    where: { userId: brandUserId },
    create: {
      userId: brandUserId,
      brandName: "Creatorshop (Demo)",
      bio: "The demo brand account for testing the swipe review flow.",
      websiteUrl: "https://creatorshop.co",
    },
    update: {},
  });

  // ── Create (or reuse) a software listing ────────────────────────────────────
  const existingListing = await prisma.softwareListing.findFirst({
    where: { brandProfileId: brandProfile.id, slug: "notion-seed" },
  });

  const listing = existingListing ?? await prisma.softwareListing.create({
    data: {
      brandProfileId: brandProfile.id,
      slug: "notion-seed",
      name: "Notion",
      tagline: "The all-in-one workspace for your team",
      description: "Notion is a connected workspace where better, faster work happens. Notes, docs, wikis, tasks, databases — all in one place.",
      category: "Productivity",
      planName: "Notion Plus",
      planValue: 16,
      billingCycle: "monthly",
      planDurationMonths: 3,
      brief: "We're looking for creators who genuinely use productivity tools and can show their real workflow. We want authentic content — not a sales pitch. Show us how Notion fits into your actual day, the messy parts included.",
      preferredDeliverables: ["INSTAGRAM_REEL", "YOUTUBE_VIDEO", "TIKTOK_VIDEO", "LINKEDIN_POST"],
      deliveryDays: 21,
      isActive: true,
      accessKeys: {
        create: Array.from({ length: 10 }, () => ({
          encryptedValue: `NOTION-DEMO-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
          isConsumed: false,
        })),
      },
    },
  });

  // ── Create creator users + profiles + pending shops ──────────────────────────
  const created: string[] = [];
  const skipped: string[] = [];

  for (const c of CREATORS) {
    // Skip if this creator was already seeded
    const existing = await prisma.user.findUnique({ where: { email: c.email } });
    if (existing) {
      // But still create the shop if it doesn't exist
      const existingShop = await prisma.shop.findFirst({
        where: { creatorId: existing.id, softwareListingId: listing.id },
      });
      if (!existingShop) {
        await prisma.shop.create({
          data: {
            creatorId: existing.id,
            brandId: brandUserId,
            softwareListingId: listing.id,
            status: "PENDING",
            deliverable: c.deliverable,
            pitch: c.pitch,
          },
        });
        created.push(c.displayName + " (shop only)");
      } else {
        skipped.push(c.displayName);
      }
      continue;
    }

    // Create creator user
    const creatorUser = await prisma.user.create({
      data: {
        clerkId: `seed_${c.email.replace(/[@.]/g, "_")}`,
        email: c.email,
        role: "CREATOR",
      },
    });

    // Create creator profile
    await prisma.creatorProfile.create({
      data: {
        userId: creatorUser.id,
        displayName: c.displayName,
        bio: c.bio,
        location: c.location,
        niches: c.niches,
        services: c.services,
        audienceSize: c.audienceSize,
        instagramUrl: c.instagramUrl,
      },
    });

    // Create pending shop (application)
    await prisma.shop.create({
      data: {
        creatorId: creatorUser.id,
        brandId: brandUserId,
        softwareListingId: listing.id,
        status: "PENDING",
        deliverable: c.deliverable,
        pitch: c.pitch,
      },
    });

    created.push(c.displayName);
  }

  return NextResponse.json({
    ok: true,
    listingId: listing.id,
    created,
    skipped,
    message: `Seeded ${created.length} creator(s). Navigate to /applications to test the swipe flow.`,
  });
}

// Wipe all seed data (for re-seeding cleanly)
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const brandUserId = searchParams.get("brandUserId");
  if (!brandUserId) return NextResponse.json({ error: "brandUserId required" }, { status: 400 });

  // Delete shops for seed creators
  const seedEmails = CREATORS.map((c) => c.email);
  const seedUsers = await prisma.user.findMany({ where: { email: { in: seedEmails } } });
  const seedUserIds = seedUsers.map((u) => u.id);

  await prisma.shop.deleteMany({ where: { creatorId: { in: seedUserIds } } });
  await prisma.creatorProfile.deleteMany({ where: { userId: { in: seedUserIds } } });
  await prisma.user.deleteMany({ where: { id: { in: seedUserIds } } });

  // Delete seed listing
  await prisma.softwareListing.deleteMany({
    where: { slug: "notion-seed", brandProfile: { userId: brandUserId } },
  });

  return NextResponse.json({ ok: true, message: "Seed data wiped." });
}
