import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SoftwareListingClient from "./SoftwareListingClient";

const DELIVERABLE_LABELS: Record<string, string> = {
  INSTAGRAM_POST:  "Instagram Post",
  INSTAGRAM_REEL:  "Instagram Reel",
  INSTAGRAM_STORY: "Instagram Story",
  TIKTOK_VIDEO:    "TikTok Video",
  YOUTUBE_VIDEO:   "YouTube Video",
  YOUTUBE_SHORT:   "YouTube Short",
  TWEET:           "Tweet",
  LINKEDIN_POST:   "LinkedIn Post",
  BLOG_POST:       "Blog Post",
  OTHER:           "Post",
};

function groupDeliverables(types: string[]) {
  const counts: Record<string, number> = {};
  for (const t of types) counts[t] = (counts[t] ?? 0) + 1;
  return Object.entries(counts).map(([enumValue, quantity]) => ({
    quantity,
    type: DELIVERABLE_LABELS[enumValue] ?? enumValue,
    enumValue,
  }));
}

export default async function SoftwareListingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { userId } = await auth();

  const listing = await prisma.softwareListing.findUnique({
    where: { slug },
    include: {
      brandProfile: { select: { brandName: true } },
      accessKeys: { where: { isConsumed: false }, select: { id: true } },
    },
  });

  if (!listing) notFound();

  // Check if the current creator already has a shop for this listing
  let existingShop: { id: string; status: string } | null = null;
  if (userId) {
    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (user) {
      existingShop = await prisma.shop.findFirst({
        where: { creatorId: user.id, softwareListingId: listing.id },
        select: { id: true, status: true },
      });
    }
  }

  return (
    <SoftwareListingClient
      listing={{
        slug: listing.slug,
        name: listing.name,
        brand: listing.brandProfile.brandName,
        tagline: listing.tagline ?? "",
        description: listing.description ?? "",
        logoUrl: listing.logoUrl,
        planName: listing.planName,
        planValue: listing.planValue ?? 0,
        deliveryDays: listing.deliveryDays,
        deliverables: groupDeliverables(listing.preferredDeliverables),
        slotsRemaining: listing.accessKeys.length,
      }}
      existingShop={existingShop}
    />
  );
}
