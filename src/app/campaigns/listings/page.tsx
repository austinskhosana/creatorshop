import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ListingsClient from "./ListingsClient";

export default async function ListingsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { brandProfile: true },
  });
  if (!user?.brandProfile) redirect("/onboarding");

  const listings = await prisma.softwareListing.findMany({
    where: { brandProfileId: user.brandProfile.id },
    select: {
      slug: true,
      name: true,
      planName: true,
      isActive: true,
      createdAt: true,
      _count: {
        select: {
          shops: true,
          accessKeys: true,
        },
      },
      accessKeys: {
        where: { isConsumed: false },
        select: { id: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const rows = listings.map((l) => ({
    slug: l.slug,
    name: l.name,
    planName: l.planName,
    isActive: l.isActive,
    totalSlots: l._count.accessKeys,
    slotsRemaining: l.accessKeys.length,
    totalApplications: l._count.shops,
    createdAt: l.createdAt.toISOString(),
  }));

  return <ListingsClient listings={rows} />;
}
