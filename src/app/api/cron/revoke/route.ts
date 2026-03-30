import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Called hourly by Vercel cron — finds APPROVED shops past their deadline and revokes them.
// Protected by a secret so only Vercel can trigger it.
export async function GET(req: Request) {
  const secret = req.headers.get("authorization")?.replace("Bearer ", "");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const overdueShops = await prisma.shop.findMany({
    where: {
      status: "APPROVED",
      deadline: { lt: new Date() },
    },
    select: { id: true, accessKeyId: true },
  });

  if (overdueShops.length === 0) {
    return NextResponse.json({ revoked: 0 });
  }

  // Revoke all overdue shops and burn their keys in one transaction
  await prisma.$transaction([
    prisma.shop.updateMany({
      where: { id: { in: overdueShops.map((s) => s.id) } },
      data: { status: "REVOKED", revokedAt: new Date() },
    }),
    // Note: accessKey.isConsumed is already true from approval — no change needed.
    // "Burned" means the shop is REVOKED so the key can never be re-revealed.
  ]);

  return NextResponse.json({ revoked: overdueShops.length });
}
