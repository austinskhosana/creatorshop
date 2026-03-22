import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const { role } = await req.json();
  if (role !== "CREATOR" && role !== "BRAND") {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  // Update Clerk publicMetadata — middleware reads this
  const client = await clerkClient();
  await client.users.updateUser(userId, {
    publicMetadata: { role, onboardingComplete: true },
  });

  // Sync role to our DB
  await prisma.user.update({
    where: { clerkId: userId },
    data: { role },
  });

  return NextResponse.json({ ok: true });
}
