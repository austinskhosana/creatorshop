"use client";

import { useState } from "react";
import CardStack from "./CardStack";
import type { Application } from "@/components/organisms/SwipeCard";

const MOCK_QUEUE: Application[] = [
  {
    id: "1",
    creatorId: "c1",
    displayName: "Jordan Lee",
    avatarUrl: null,
    bio: "Lifestyle and travel content creator working with software brands.",
    pitch: "I'll create a 60s TikTok walkthrough of your onboarding flow.",
    niches: ["Lifestyle", "Travel"],
    services: ["TikTok video"],
    audienceSize: "24K",
    deliverable: "TikTok video",
    platform: "TikTok",
    listingName: "Acme Tool",
    appliedAt: new Date().toISOString(),
    instagramUrl: null,
    tiktokUrl: "https://tiktok.com/@jordanlee",
    status: "PENDING",
  },
  {
    id: "2",
    creatorId: "c2",
    displayName: "Priya Nair",
    avatarUrl: null,
    bio: "Design and productivity tips for indie hackers.",
    pitch: "Instagram carousel breaking down your top 3 features.",
    niches: ["Design", "Productivity"],
    services: ["Instagram post"],
    audienceSize: "11K",
    deliverable: "Instagram post",
    platform: "Instagram",
    listingName: "Acme Tool",
    appliedAt: new Date().toISOString(),
    instagramUrl: "https://instagram.com/priyanair",
    tiktokUrl: null,
    status: "PENDING",
  },
  {
    id: "3",
    creatorId: "c3",
    displayName: "Sam Osei",
    avatarUrl: null,
    bio: "Marketing and growth content for early-stage startups.",
    pitch: "YouTube short comparing you to two competitors.",
    niches: ["Marketing"],
    services: ["YouTube short"],
    audienceSize: "8K",
    deliverable: "YouTube short",
    platform: "YouTube",
    listingName: "Acme Tool",
    appliedAt: new Date().toISOString(),
    instagramUrl: null,
    tiktokUrl: null,
    status: "PENDING",
  },
];

export default function CardStackDemo() {
  const [queue, setQueue] = useState(MOCK_QUEUE);

  function handleSwipe() {
    setQueue((prev) => {
      const next = prev.slice(1);
      return next.length > 0 ? next : MOCK_QUEUE;
    });
  }

  return (
    <CardStack
      queue={queue}
      onSwipe={handleSwipe}
      programmaticDirection={null}
      onProgrammaticAnimationDone={() => {}}
    />
  );
}
