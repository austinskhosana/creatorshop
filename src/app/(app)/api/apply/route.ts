import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendNewApplication } from "@/lib/email";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { slug, pitch, deliverable } = await req.json();
  if (!slug) return NextResponse.json({ error: "Missing listing slug" }, { status: 400 });
  if (!pitch?.trim()) return NextResponse.json({ error: "Pitch is required" }, { status: 400 });
  if (!deliverable) return NextResponse.json({ error: "Deliverable type is required" }, { status: 400 });

  // Get the creator's DB user (include profile for display name)
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { creatorProfile: { select: { displayName: true } } },
  });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Find the listing
  const listing = await prisma.softwareListing.findUnique({
    where: { slug },
    include: { brandProfile: true },
  });
  if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  if (!listing.isActive) return NextResponse.json({ error: "This listing is no longer active" }, { status: 400 });

  // Block duplicate applications
  const existing = await prisma.shop.findFirst({
    where: { creatorId: user.id, softwareListingId: listing.id },
  });
  if (existing) return NextResponse.json({ error: "You've already applied to this listing" }, { status: 409 });

  // Create the shop
  const shop = await prisma.shop.create({
    data: {
      creatorId: user.id,
      brandId: listing.brandProfile.userId,
      softwareListingId: listing.id,
      status: "PENDING",
      pitch: pitch.trim(),
      deliverable,
    },
  });

  // Email #7: new application → brand
  const brandUser = await prisma.user.findUnique({
    where: { id: listing.brandProfile.userId },
    select: { email: true, brandProfile: { select: { brandName: true } } },
  });
  if (brandUser) {
    sendNewApplication({
      to: brandUser.email,
      brandName: brandUser.brandProfile?.brandName ?? "there",
      creatorName: user.creatorProfile?.displayName ?? user.email,
      listingName: listing.name,
    }).catch(() => {});
  }

  return NextResponse.json({ ok: true, shopId: shop.id });
}
