import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { encrypt } from "@/lib/crypto";

const DELIVERABLE_MAP: Record<string, string> = {
  "Instagram Reel":    "INSTAGRAM_REEL",
  "Instagram Post":    "INSTAGRAM_POST",
  "Instagram Story":   "INSTAGRAM_STORY",
  "TikTok Video":      "TIKTOK_VIDEO",
  "YouTube Video":     "YOUTUBE_VIDEO",
  "YouTube Short":     "YOUTUBE_SHORT",
  "Tweet / Thread":    "TWEET",
  "LinkedIn Post":     "LINKEDIN_POST",
  "Blog Post":         "BLOG_POST",
};

function toSlug(str: string) {
  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { brandProfile: true },
  });
  if (!user?.brandProfile) {
    return NextResponse.json({ error: "Brand profile not found. Complete your profile first." }, { status: 404 });
  }

  const body = await req.json();
  const { productName, planName, planValue, description, brief, websiteUrl, deliverables, deliveryDays, accessKeys } = body;

  if (!productName?.trim()) return NextResponse.json({ error: "Product name is required." }, { status: 400 });
  if (!planName?.trim())    return NextResponse.json({ error: "Plan name is required." }, { status: 400 });
  if (!brief?.trim())       return NextResponse.json({ error: "Creator brief is required." }, { status: 400 });
  if (!accessKeys?.length)  return NextResponse.json({ error: "At least one access key is required." }, { status: 400 });

  // Generate a unique slug
  const baseSlug = toSlug(`${productName} ${planName}`);
  let slug = baseSlug;
  let attempt = 0;
  while (await prisma.softwareListing.findUnique({ where: { slug } })) {
    attempt++;
    slug = `${baseSlug}-${attempt}`;
  }

  // Map deliverable labels to enum values
  const preferredDeliverables = (deliverables as string[])
    .map((d) => DELIVERABLE_MAP[d])
    .filter(Boolean) as string[];

  const listing = await prisma.softwareListing.create({
    data: {
      brandProfileId: user.brandProfile.id,
      slug,
      name: productName.trim(),
      planName: planName.trim(),
      planValue: planValue ? parseFloat(planValue) : null,
      description: description?.trim() || null,
      brief: brief.trim(),
      websiteUrl: websiteUrl?.trim() || null,
      preferredDeliverables: preferredDeliverables as import("@prisma/client").DeliverableType[],
      deliveryDays: parseInt(deliveryDays) || 14,
      isActive: true,
      accessKeys: {
        create: (accessKeys as string[]).map((key: string) => ({
          encryptedValue: encrypt(key),
        })),
      },
    },
  });

  return NextResponse.json({ ok: true, slug: listing.slug });
}
