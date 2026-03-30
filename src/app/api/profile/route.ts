import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const body = await req.json();
  const {
    displayName,
    bio,
    location,
    niches,
    audienceSize,
    services,
    instagramUrl,
    tiktokUrl,
    youtubeUrl,
    twitterUrl,
    linkedinUrl,
  } = body;

  if (!displayName?.trim()) {
    return NextResponse.json({ error: "Display name is required." }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    await prisma.creatorProfile.upsert({
      where: { userId: user.id },
      update: {
        displayName: displayName.trim(),
        bio: bio?.trim() || null,
        location: location?.trim() || null,
        niches: niches ?? [],
        audienceSize: audienceSize || null,
        services: services ?? [],
        instagramUrl: instagramUrl?.trim() || null,
        tiktokUrl: tiktokUrl?.trim() || null,
        youtubeUrl: youtubeUrl?.trim() || null,
        twitterUrl: twitterUrl?.trim() || null,
        linkedinUrl: linkedinUrl?.trim() || null,
      },
      create: {
        userId: user.id,
        displayName: displayName.trim(),
        bio: bio?.trim() || null,
        location: location?.trim() || null,
        niches: niches ?? [],
        audienceSize: audienceSize || null,
        services: services ?? [],
        instagramUrl: instagramUrl?.trim() || null,
        tiktokUrl: tiktokUrl?.trim() || null,
        youtubeUrl: youtubeUrl?.trim() || null,
        twitterUrl: twitterUrl?.trim() || null,
        linkedinUrl: linkedinUrl?.trim() || null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[profile] DB upsert failed:", err);
    return NextResponse.json({ error: "Something went wrong — please try again." }, { status: 500 });
  }
}
