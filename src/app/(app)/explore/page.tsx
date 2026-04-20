import { prisma } from "@/lib/prisma";
import ExploreClient from "./ExploreClient";

export default async function ExplorePage() {
  const listings = await prisma.softwareListing.findMany({
    where: { isActive: true },
    select: {
      slug: true,
      name: true,
      logoUrl: true,
      planName: true,
      planDurationMonths: true,
      preferredDeliverables: true,
      category: true,
      accessKeys: {
        where: { isConsumed: false },
        select: { id: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const cards = listings.map((l) => ({
    slug: l.slug,
    name: l.name,
    logoUrl: l.logoUrl,
    planName: l.planName,
    months: l.planDurationMonths,
    postsRequired: l.preferredDeliverables.length,
    slotsRemaining: l.accessKeys.length,
    category: l.category,
  }));

  return <ExploreClient listings={cards} />;
}
