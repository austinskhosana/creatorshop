import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ShopsClient from "./ShopsClient";

export default async function ShopsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) redirect("/onboarding");

  const shops = await prisma.shop.findMany({
    where: { creatorId: user.id },
    include: {
      softwareListing: {
        select: {
          slug: true,
          name: true,
          logoUrl: true,
          planName: true,
          planDurationMonths: true,
          preferredDeliverables: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const cards = shops.map((s) => ({
    id: s.id,
    slug: s.softwareListing.slug,
    name: s.softwareListing.name,
    logoUrl: s.softwareListing.logoUrl,
    planName: s.softwareListing.planName,
    months: s.softwareListing.planDurationMonths,
    postsRequired: s.softwareListing.preferredDeliverables.length,
    status: s.status,
    deadline: s.deadline ?? undefined,
  }));

  return <ShopsClient shops={cards} />;
}
