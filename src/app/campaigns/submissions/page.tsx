import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SubmissionsClient, { type Submission } from "./SubmissionsClient";

function platformFromDeliverable(deliverable: string): Submission["platform"] {
  if (deliverable.startsWith("INSTAGRAM")) return "Instagram";
  if (deliverable.startsWith("TIKTOK"))    return "TikTok";
  if (deliverable.startsWith("YOUTUBE"))   return "YouTube";
  if (deliverable === "TWEET")             return "X";
  if (deliverable === "LINKEDIN_POST")     return "LinkedIn";
  return "Other";
}

function statusFromShop(status: string): Submission["status"] {
  if (status === "PENDING")                                    return "pending";
  if (status === "APPROVED" || status === "DELIVERED" || status === "COMPLETED") return "approved";
  return "rejected";
}

export default async function SubmissionsPage() {
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

  const submissions: Submission[] = shops.map((s) => ({
    id: s.id,
    creatorId: s.creatorId,
    creator: s.creator.creatorProfile?.displayName ?? s.creator.email,
    platform: platformFromDeliverable(s.deliverable),
    product: s.softwareListing.name,
    submittedAt: s.createdAt.toISOString(),
    status: statusFromShop(s.status),
    bio: s.creator.creatorProfile?.bio ?? "",
    location: s.creator.creatorProfile?.location ?? "",
    followers: s.creator.creatorProfile?.audienceSize ?? "",
    niches: s.creator.creatorProfile?.niches ?? [],
    services: s.creator.creatorProfile?.services ?? [],
    pitch: s.pitch,
    postUrl: s.deliveryLink ?? "",
  }));

  return <SubmissionsClient initialSubmissions={submissions} />;
}
