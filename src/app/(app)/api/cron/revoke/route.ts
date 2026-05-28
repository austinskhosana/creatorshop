import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  sendDeadlineReminder,
  sendDeadlineWarning,
  sendShopRevokedCreator,
  sendShopRevokedBrand,
} from "@/lib/email";

/**
 * GET /api/cron/revoke
 * Called hourly by Vercel cron. Protected by CRON_SECRET.
 *
 * Does three things per run:
 * 1. Auto-revokes APPROVED shops past their deadline
 * 2. Sends deadline reminder emails at the halfway mark
 * 3. Sends final warning emails 24 hours before the deadline
 */
export async function GET(req: Request) {
  const secret = req.headers.get("authorization")?.replace("Bearer ", "");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const now = new Date();

  // ── 1. Auto-revoke overdue shops ───────────────────────────────────────────
  const overdueShops = await prisma.shop.findMany({
    where: {
      status: "APPROVED",
      deadline: { lt: now },
    },
    include: {
      creator: {
        select: { email: true, creatorProfile: { select: { displayName: true } } },
      },
      brand: {
        select: { email: true, brandProfile: { select: { brandName: true } } },
      },
      softwareListing: { select: { name: true } },
    },
  });

  if (overdueShops.length > 0) {
    await prisma.shop.updateMany({
      where: { id: { in: overdueShops.map((s) => s.id) } },
      data: { status: "REVOKED", revokedAt: now },
    });

    for (const shop of overdueShops) {
      const creatorName = shop.creator.creatorProfile?.displayName ?? shop.creator.email;
      const listingName = shop.softwareListing.name;

      // Email #6a: revoked → creator
      sendShopRevokedCreator({
        to: shop.creator.email,
        creatorName,
        listingName,
      }).catch(() => {});

      // Email #6b: revoked → brand
      sendShopRevokedBrand({
        to: shop.brand.email,
        brandName: shop.brand.brandProfile?.brandName ?? "there",
        creatorName,
        listingName,
      }).catch(() => {});
    }
  }

  // ── 2. Halfway-point reminder emails ──────────────────────────────────────
  // A shop is at the halfway point when it was approved ~(deliveryDays/2) days ago.
  // We check for shops where deadline is roughly halfway away:
  //   deadline is between (now + halfDays - 1h) and (now + halfDays + 1h)
  // Since deliveryDays varies per listing, we use a range window instead.
  // Simpler: shops where (deadline - now) is within [23h, 25h] of half the window.
  // Actually simplest: fire for shops where deadline is in ~[halfWindow-1h, halfWindow+1h].
  // We store approvedAt implicitly — use updatedAt as a proxy (set on approval).
  // Cleanest approach: fire once for shops where floor((deadline-now)/86400000)
  //   equals floor(totalDays/2). Since we run hourly, add a seen-flag or just
  //   accept that we may double-fire within an hour window (acceptable).

  // Fetch active approved shops not yet delivered
  const activeShops = await prisma.shop.findMany({
    where: {
      status: "APPROVED",
      deadline: { gt: now },
    },
    include: {
      creator: {
        select: { email: true, creatorProfile: { select: { displayName: true } } },
      },
      softwareListing: { select: { name: true, deliveryDays: true } },
    },
  });

  let reminders = 0;
  let warnings = 0;

  for (const shop of activeShops) {
    if (!shop.deadline) continue;

    const msLeft = shop.deadline.getTime() - now.getTime();
    const hoursLeft = msLeft / (1000 * 60 * 60);

    const creatorName = shop.creator.creatorProfile?.displayName ?? shop.creator.email;
    const listingName = shop.softwareListing.name;

    // Email #5: final warning — within last 24 hours (23–25h window to fire once)
    if (hoursLeft >= 23 && hoursLeft < 25) {
      sendDeadlineWarning({
        to: shop.creator.email,
        creatorName,
        listingName,
        shopId: shop.id,
      }).catch(() => {});
      warnings++;
      continue;
    }

    // Email #4: halfway reminder — check if msLeft ≈ half of total window
    const totalMs = shop.softwareListing.deliveryDays * 24 * 60 * 60 * 1000;
    const halfMs = totalMs / 2;
    // Fire if we're within a 1-hour window of the halfway point
    if (Math.abs(msLeft - halfMs) < 60 * 60 * 1000) {
      sendDeadlineReminder({
        to: shop.creator.email,
        creatorName,
        listingName,
        deadline: shop.deadline,
        shopId: shop.id,
      }).catch(() => {});
      reminders++;
    }
  }

  return NextResponse.json({
    revoked: overdueShops.length,
    reminders,
    warnings,
  });
}
