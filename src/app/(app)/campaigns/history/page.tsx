import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/getOrCreateUser";
import CampaignHistoryClient from "./CampaignHistoryClient";

export default async function CampaignHistoryPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await getOrCreateUser(userId);

  const brandProfile = await prisma.brandProfile.findUnique({
    where: { userId: user.id },
  });
  if (!brandProfile) redirect("/brand-profile/setup");

  const listings = await prisma.softwareListing.findMany({
    where: { brandProfileId: brandProfile.id, isActive: false },
    include: {
      accessKeys: { select: { isConsumed: true } },
      shops: { select: { status: true, createdAt: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  const campaigns = listings.map((l) => {
    const totalSlots  = l.accessKeys.length;
    const filled      = l.accessKeys.filter((k) => k.isConsumed).length;
    const delivered   = l.shops.filter((s) => s.status === "COMPLETED").length;
    const lastShopAt  = l.shops.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0]?.createdAt;

    return {
      id:         l.id,
      name:       l.name,
      planName:   l.planName,
      createdAt:  l.createdAt.toISOString(),
      endedAt:    (lastShopAt ?? l.updatedAt).toISOString(),
      totalSlots,
      filled,
      delivered,
    };
  });

  return <CampaignHistoryClient campaigns={campaigns} />;
}
