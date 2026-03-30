import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ shopId: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { shopId } = await params;
  const { action } = await req.json();

  if (action !== "approve" && action !== "deny") {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const shop = await prisma.shop.findUnique({
    where: { id: shopId },
    include: { softwareListing: true },
  });
  if (!shop) return NextResponse.json({ error: "Shop not found" }, { status: 404 });
  if (shop.brandId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (shop.status !== "PENDING") return NextResponse.json({ error: "Shop is not pending" }, { status: 400 });

  if (action === "deny") {
    await prisma.shop.update({
      where: { id: shopId },
      data: { status: "DENIED" },
    });
    return NextResponse.json({ ok: true });
  }

  // Approve — consume next available key and set deadline
  const nextKey = await prisma.accessKey.findFirst({
    where: { softwareListingId: shop.softwareListingId, isConsumed: false },
  });
  if (!nextKey) {
    return NextResponse.json({ error: "No access keys available — add more keys to this listing." }, { status: 400 });
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

  return NextResponse.json({ ok: true });
}
