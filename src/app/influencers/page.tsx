import { prisma } from "@/lib/prisma";
import InfluencersClient from "./InfluencersClient";

export default async function InfluencersPage() {
  const profiles = await prisma.creatorProfile.findMany({
    select: {
      id: true,
      displayName: true,
      bio: true,
      niches: true,
      avatarUrl: true,
    },
    orderBy: { createdAt: "asc" },
  });

  return <InfluencersClient creators={profiles} />;
}
