import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/crypto";
import ShopDetailClient from "./ShopDetailClient";

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

export default async function ShopDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) redirect("/onboarding");

  const shop = await prisma.shop.findUnique({
    where: { id },
    include: {
      softwareListing: {
        select: {
          name: true,
          planName: true,
          planDurationMonths: true,
          brief: true,
          preferredDeliverables: true,
        },
      },
      accessKey: { select: { encryptedValue: true } },
    },
  });

  if (!shop || shop.creatorId !== user.id) notFound();

  const decryptedKey =
    shop.status === "APPROVED" && shop.accessKey
      ? decrypt(shop.accessKey.encryptedValue)
      : undefined;

  const deliverables = shop.softwareListing.preferredDeliverables.map(
    (d) => DELIVERABLE_LABELS[d] ?? d
  );

  return (
    <ShopDetailClient
      shop={{
        id: shop.id,
        status: shop.status as "APPROVED" | "DELIVERED" | "COMPLETED" | "REVOKED" | "PENDING" | "DENIED",
        softwareName: shop.softwareListing.name,
        planName: shop.softwareListing.planName,
        months: shop.softwareListing.planDurationMonths,
        brief: shop.softwareListing.brief,
        deliverables,
        deadline: shop.deadline ?? undefined,
        deliveryLink: shop.deliveryLink ?? undefined,
        accessKey: decryptedKey,
      }}
    />
  );
}
