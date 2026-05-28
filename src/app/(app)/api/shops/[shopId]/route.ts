import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/crypto";
import {
  sendShopApproved,
  sendShopDenied,
  sendShopCompleted,
  sendCreatorDelivered,
} from "@/lib/email";

// ── PATCH — brand actions: approve / deny / complete / revoke ──────────────────

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ shopId: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { shopId } = await params;
  const { action } = await req.json();

  if (!["approve", "deny", "complete", "revoke"].includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const shop = await prisma.shop.findUnique({
    where: { id: shopId },
    include: {
      softwareListing: true,
      creator: { select: { email: true, creatorProfile: { select: { displayName: true } } } },
    },
  });
  if (!shop) return NextResponse.json({ error: "Shop not found" }, { status: 404 });
  if (shop.brandId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const creatorName = shop.creator.creatorProfile?.displayName ?? shop.creator.email;
  const listingName = shop.softwareListing.name;

  // ── complete / revoke — brand reviewing a DELIVERED shop ──────────────────
  if (action === "complete" || action === "revoke") {
    if (shop.status !== "DELIVERED") {
      return NextResponse.json({ error: "Shop is not delivered" }, { status: 400 });
    }

    await prisma.shop.update({
      where: { id: shopId },
      data:
        action === "complete"
          ? { status: "COMPLETED", completedAt: new Date() }
          : { status: "REVOKED", revokedAt: new Date() },
    });

    // Email #9: shop completed → creator
    if (action === "complete") {
      const brandProfile = await prisma.brandProfile.findUnique({ where: { userId: user.id } });
      sendShopCompleted({
        to: shop.creator.email,
        creatorName,
        listingName,
        brandName: brandProfile?.brandName ?? "the brand",
      }).catch(() => {});
    }

    return NextResponse.json({ ok: true });
  }

  if (shop.status !== "PENDING") return NextResponse.json({ error: "Shop is not pending" }, { status: 400 });

  // ── deny ──────────────────────────────────────────────────────────────────
  if (action === "deny") {
    await prisma.shop.update({
      where: { id: shopId },
      data: { status: "DENIED" },
    });

    // Email #2: shop denied → creator
    sendShopDenied({
      to: shop.creator.email,
      creatorName,
      listingName,
    }).catch(() => {});

    return NextResponse.json({ ok: true });
  }

  // ── approve — consume next available key and set deadline ─────────────────
  const nextKey = await prisma.accessKey.findFirst({
    where: { softwareListingId: shop.softwareListingId, isConsumed: false },
  });
  if (!nextKey) {
    return NextResponse.json(
      { error: "No access keys available — add more keys to this listing." },
      { status: 400 }
    );
  }

  const deadline = new Date();
  deadline.setDate(deadline.getDate() + shop.softwareListing.deliveryDays);

  await prisma.$transaction([
    prisma.accessKey.update({
      where: { id: nextKey.id },
      data: { isConsumed: true, consumedAt: new Date() },
    }),
    prisma.shop.update({
      where: { id: shopId },
      data: { status: "APPROVED", accessKeyId: nextKey.id, deadline },
    }),
  ]);

  // Auto-close listing if no keys remain
  const remaining = await prisma.accessKey.count({
    where: { softwareListingId: shop.softwareListingId, isConsumed: false },
  });
  if (remaining === 0) {
    await prisma.softwareListing.update({
      where: { id: shop.softwareListingId },
      data: { isActive: false },
    });
  }

  // Email #1: shop approved → creator (with decrypted access key)
  try {
    const plainKey = decrypt(nextKey.encryptedValue);
    sendShopApproved({
      to: shop.creator.email,
      creatorName,
      listingName,
      brandName: (await prisma.brandProfile.findUnique({ where: { userId: user.id } }))?.brandName ?? "the brand",
      accessKey: plainKey,
      deliverable: shop.deliverable,
      deadline,
      shopId,
    }).catch(() => {});
  } catch {
    // Key decryption failure shouldn't block the approval response
  }

  return NextResponse.json({ ok: true });
}

// ── POST — creator submits delivery link ──────────────────────────────────────

export async function POST(
  req: Request,
  { params }: { params: Promise<{ shopId: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { shopId } = await params;
  const { deliveryLink, deliveryNote } = await req.json();

  if (!deliveryLink?.trim()) return NextResponse.json({ error: "Delivery link is required." }, { status: 400 });
  try { new URL(deliveryLink.trim()); } catch {
    return NextResponse.json({ error: "Invalid URL." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const shop = await prisma.shop.findUnique({
    where: { id: shopId },
    include: {
      softwareListing: { select: { name: true } },
      brand: { select: { email: true, brandProfile: { select: { brandName: true, userId: true } } } },
      creator: { select: { creatorProfile: { select: { displayName: true } } } },
    },
  });
  if (!shop) return NextResponse.json({ error: "Shop not found" }, { status: 404 });
  if (shop.creatorId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (shop.status !== "APPROVED") return NextResponse.json({ error: "Shop is not approved" }, { status: 400 });

  await prisma.shop.update({
    where: { id: shopId },
    data: {
      status: "DELIVERED",
      deliveryLink: deliveryLink.trim(),
      deliveryNote: deliveryNote?.trim() || null,
      deliveredAt: new Date(),
    },
  });

  // Email #8: creator delivered → brand
  sendCreatorDelivered({
    to: shop.brand.email,
    brandName: shop.brand.brandProfile?.brandName ?? "there",
    creatorName: shop.creator.creatorProfile?.displayName ?? user.email ?? "A creator",
    listingName: shop.softwareListing.name,
    deliveryLink: deliveryLink.trim(),
    shopId,
  }).catch(() => {});

  return NextResponse.json({ ok: true });
}
