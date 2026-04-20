import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const body = await req.json();
  const { brandName, bio, websiteUrl } = body;

  if (!brandName?.trim()) {
    return NextResponse.json({ error: "Brand name is required." }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    await prisma.brandProfile.upsert({
      where: { userId: user.id },
      update: {
        brandName: brandName.trim(),
        bio: bio?.trim() || null,
        websiteUrl: websiteUrl?.trim() || null,
      },
      create: {
        userId: user.id,
        brandName: brandName.trim(),
        bio: bio?.trim() || null,
        websiteUrl: websiteUrl?.trim() || null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[brand-profile] DB upsert failed:", err);
    return NextResponse.json({ error: "Something went wrong — please try again." }, { status: 500 });
  }
}
