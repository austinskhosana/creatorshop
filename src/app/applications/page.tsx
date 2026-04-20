import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SwipeReviewClient from "./SwipeReviewClient";
import SeedBanner from "./SeedBanner";
import type { Application, Platform } from "./types";

// ── Helpers ────────────────────────────────────────────────────────────────────

function platformFromDeliverable(deliverable: string): Platform {
  if (deliverable.startsWith("INSTAGRAM")) return "Instagram";
  if (deliverable.startsWith("TIKTOK"))    return "TikTok";
  if (deliverable.startsWith("YOUTUBE"))   return "YouTube";
  if (deliverable === "TWEET")             return "X";
  if (deliverable === "LINKEDIN_POST")     return "LinkedIn";
  return "Other";
}

function statusFromShop(status: string): Application["status"] {
  if (status === "PENDING")  return "PENDING";
  if (status === "APPROVED" || status === "DELIVERED" || status === "COMPLETED") return "APPROVED";
  return "DENIED";
}

// ── Page ───────────────────────────────────────────────────────────────────────

export const metadata = {
  title: "Applications — Creatorshop",
  description: "Review creator applications for your software listings",
};

export default async function ApplicationsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) redirect("/onboarding");

  const shops = await prisma.shop.findMany({
    where: { brandId: user.id },
    include: {
      creator: { include: { creatorProfile: true } },
      softwareListing: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const applications: Application[] = shops.map((s) => ({
    id: s.id,
    creatorId: s.creatorId,
    displayName: s.creator.creatorProfile?.displayName ?? s.creator.email,
    avatarUrl:   s.creator.creatorProfile?.avatarUrl   ?? null,
    bio:         s.creator.creatorProfile?.bio         ?? "",
    pitch:       s.pitch,
    niches:      (s.creator.creatorProfile as { niches?: string[] } | null)?.niches ?? [],
    services:    s.creator.creatorProfile?.services    ?? [],
    audienceSize: s.creator.creatorProfile?.audienceSize ?? null,
    deliverable: s.deliverable,
    platform:    platformFromDeliverable(s.deliverable),
    listingName: s.softwareListing.name,
    appliedAt:   s.createdAt.toISOString(),
    instagramUrl: s.creator.creatorProfile?.instagramUrl ?? null,
    tiktokUrl:    s.creator.creatorProfile?.tiktokUrl    ?? null,
    status: statusFromShop(s.status),
  }));

  // Pending applications go into the swipe queue; all others populate the reviewed list
  const pending  = applications.filter((a) => a.status === "PENDING");
  const reviewed = applications.filter((a) => a.status !== "PENDING");

  return (
    <>
      {process.env.NODE_ENV !== "production" && (
        <SeedBanner brandUserId={user.id} hasPending={pending.length > 0} />
      )}
      <SwipeReviewClient pending={pending} reviewed={reviewed} />
    </>
  );
}
