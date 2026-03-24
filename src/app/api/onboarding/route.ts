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

  // Get Clerk user — needed for email if we have to create the DB record
  let clerk;
  let clerkUser;
  try {
    clerk = await clerkClient();
    clerkUser = await clerk.users.getUser(userId);
  } catch (err) {
    console.error("[onboarding] Clerk user fetch failed:", err);
    return NextResponse.json({ error: "Something went wrong — please try again." }, { status: 500 });
  }

  const primaryEmail = clerkUser.emailAddresses.find(
    (e) => e.id === clerkUser.primaryEmailAddressId
  )?.emailAddress;

  if (!primaryEmail) {
    return NextResponse.json({ error: "No email on account." }, { status: 400 });
  }

  // Upsert — create the DB record if the webhook hasn't fired yet
  try {
    await prisma.user.upsert({
      where: { clerkId: userId },
      update: { role },
      create: { clerkId: userId, email: primaryEmail, role },
    });
  } catch (err) {
    console.error("[onboarding] DB upsert failed:", err);
    return NextResponse.json({ error: "Database error — please try again." }, { status: 500 });
  }

  // Update Clerk metadata — if this fails, revert the DB role
  try {
    await clerk.users.updateUser(userId, {
      publicMetadata: { role, onboardingComplete: true },
    });
  } catch (err) {
    console.error("[onboarding] Clerk update failed:", err);
    await prisma.user.update({
      where: { clerkId: userId },
      data: { role: "CREATOR" },
    });
    return NextResponse.json({ error: "Something went wrong — please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
