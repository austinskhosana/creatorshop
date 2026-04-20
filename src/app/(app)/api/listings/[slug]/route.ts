import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { encrypt } from "@/lib/crypto";

// PATCH /api/listings/[slug]
// Adds more access keys to an existing listing the brand owns.
// If the listing was closed (isActive: false) purely because keys ran out, it reopens automatically.
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { slug } = await params;

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { brandProfile: true },
  });
  if (!user?.brandProfile) {
    return NextResponse.json({ error: "Brand profile not found." }, { status: 404 });
  }

  const listing = await prisma.softwareListing.findUnique({
    where: { slug },
    select: { id: true, brandProfileId: true, isActive: true },
  });
  if (!listing) return NextResponse.json({ error: "Listing not found." }, { status: 404 });
  if (listing.brandProfileId !== user.brandProfile.id) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const body = await req.json();
  const { action, accessKeys } = body as { action?: string; accessKeys?: string[] };

  // ── Close listing ─────────────────────────────────────────────────────────
  if (action === "close") {
    await prisma.$transaction([
      // Auto-deny all pending shops
      prisma.shop.updateMany({
        where: { softwareListingId: listing.id, status: "PENDING" },
        data: { status: "DENIED" },
      }),
      prisma.softwareListing.update({
        where: { id: listing.id },
        data: { isActive: false },
      }),
    ]);
    return NextResponse.json({ ok: true });
  }

  // ── Top up keys ───────────────────────────────────────────────────────────
  if (!accessKeys?.length) {
    return NextResponse.json({ error: "Provide at least one access key." }, { status: 400 });
  }

  await prisma.$transaction([
    prisma.accessKey.createMany({
      data: (accessKeys as string[]).map((key: string) => ({
        softwareListingId: listing.id,
        encryptedValue: encrypt(key),
      })),
    }),
    prisma.softwareListing.update({
      where: { id: listing.id },
      data: { isActive: true },
    }),
  ]);

  return NextResponse.json({ ok: true, added: accessKeys.length });
}
