"use client";

import { useState, useRef, useLayoutEffect } from "react";
import Link from "next/link";

type Influencer = {
  id: string;
  name: string;
  bio: string;
  niches: string[];
  coverColor: string;
};

const INFLUENCERS: Influencer[] = [
  { id: "aino-johansson",  name: "Aino Johansson",  bio: "A designer creating content for design tools with new AI workflows.",                    niches: ["Lifestyle", "Fashion"],  coverColor: "#C4A882" },
  { id: "noah-brown",      name: "Noah Brown",      bio: "Lifestyle creator based in LA. Good food, good fits, and everything in between.",         niches: ["Lifestyle", "Fashion"],  coverColor: "#7A9E8A" },
  { id: "isla-smith",      name: "Isla Smith",      bio: "Exploring the intersection of personal style and everyday living.",                       niches: ["Lifestyle", "Fashion"],  coverColor: "#B07B6A" },
  { id: "isla-brown",      name: "Isla Brown",      bio: "Travel and lifestyle creator sharing the world one destination at a time.",               niches: ["Lifestyle", "Travel"],   coverColor: "#A8C4C4" },
  { id: "olivia-williams", name: "Olivia Williams", bio: "Fashion-forward traveller documenting style across continents.",                          niches: ["Fashion", "Travel"],     coverColor: "#C4C4A0" },
  { id: "george-williams", name: "George Williams", bio: "Fitness and lifestyle creator helping you build better habits every day.",                niches: ["Lifestyle", "Fitness"],  coverColor: "#A0A8C4" },
  { id: "maya-chen",       name: "Maya Chen",       bio: "Beauty and fashion content creator obsessed with clean looks and bold statements.",       niches: ["Beauty", "Fashion"],     coverColor: "#C4A8B8" },
  { id: "james-lee",       name: "James Lee",       bio: "Tech creator breaking down AI tools and workflows for everyday people.",                  niches: ["Tech", "Lifestyle"],     coverColor: "#A8B8A8" },
  { id: "sara-kim",        name: "Sara Kim",        bio: "Food and travel content creator chasing the best bites around the world.",                niches: ["Food", "Travel"],        coverColor: "#C4B8A0" },
];

const ALL_NICHES = ["All", "Lifestyle", "Fashion", "Travel", "Fitness", "Food", "Beauty", "Tech"];

function InfluencerCard({ influencer }: { influencer: Influencer }) {
  return (
    <div className="card-shine flex flex-col rounded-3xl border border-gray-200 bg-white p-3 gap-3 h-full">

      {/* ── Cover image ── */}
      <div
        className="w-full h-44 rounded-2xl flex-shrink-0"
        style={{ backgroundColor: influencer.coverColor }}
      />

      {/* ── Niche tags ── */}
      <div className="flex flex-wrap gap-2 px-1">
        {influencer.niches.slice(0, 2).map((niche) => (
          <span
            key={niche}
            className="px-4 py-1.5 rounded-xl bg-[#EDFFD0] text-[#3A7A00] text-[13px] font-medium"
          >
            {niche}
          </span>
        ))}
      </div>

      {/* ── Info ── */}
      <div className="flex flex-col gap-1 px-1 flex-1">
        <p className="text-[18px] font-bold text-neutral-900 leading-snug">{influencer.name}</p>
        <p className="text-[14px] text-gray-400 leading-snug line-clamp-2">{influencer.bio}</p>
      </div>

      {/* ── Button ── */}
      <Link
        href={`/influencers/${influencer.id}`}
        className="w-full bg-neutral-900 text-white text-sm font-semibold text-center py-3 rounded-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] hover:opacity-90 transition-opacity"
      >
        View Profile
      </Link>

    </div>
  );
}

export default function InfluencersPage() {
  const [activeNiche, setActiveNiche] = useState("All");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [pill, setPill] = useState({ left: 0, width: 0, ready: false });

  useLayoutEffect(() => {
    const el = tabRefs.current[0];
    if (el) setPill({ left: el.offsetLeft, width: el.offsetWidth, ready: false });
  }, []);

  function handleNicheChange(niche: string) {
    setActiveNiche(niche);
    const idx = ALL_NICHES.indexOf(niche);
    const el = tabRefs.current[idx];
    if (el) setPill({ left: el.offsetLeft, width: el.offsetWidth, ready: true });
  }

  const filtered = activeNiche === "All"
    ? INFLUENCERS
    : INFLUENCERS.filter((i) => i.niches.includes(activeNiche));

  return (
    <div className="p-10 pl-20 flex flex-col items-center">
      <div className="w-full max-w-4xl">

      {/* ── Header ── */}
      <div className="flex flex-col gap-1 mb-6">
        <h1 className="text-3xl font-bold text-neutral-900">Creators</h1>
        <p className="text-[15px] text-gray-400">Browse creators available for your next campaign.</p>
      </div>

      {/* ── Niche filter tabs ── */}
      <div className="relative flex gap-1 border border-gray-200 rounded-xl p-1 w-fit mb-8">
        <div
          className="absolute top-1 bottom-1 rounded-lg bg-white shadow-sm border border-gray-200 will-change-transform"
          style={{
            left: 0,
            width: pill.width,
            transform: `translateX(${pill.left}px)`,
            opacity: pill.width === 0 ? 0 : 1,
            transition: pill.ready
              ? [
                  "transform 320ms cubic-bezier(0.34, 1.1, 0.64, 1)",
                  "width 280ms cubic-bezier(0.34, 1.1, 0.64, 1)",
                ].join(", ")
              : "none",
          }}
        />
        {ALL_NICHES.map((niche, i) => (
          <button
            key={niche}
            ref={(el) => { tabRefs.current[i] = el; }}
            onClick={() => handleNicheChange(niche)}
            className={[
              "relative z-10 px-4 py-1.5 rounded-lg text-sm font-medium",
              "transition-colors duration-[200ms]",
              activeNiche === niche ? "text-neutral-900" : "text-gray-500 hover:text-gray-800",
            ].join(" ")}
          >
            {niche}
          </button>
        ))}
      </div>

      {/* ── Grid ── */}
      {filtered.length === 0 ? (
        <div className="py-24 text-center text-gray-400 text-[15px]">
          No influencers in this niche yet.
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {filtered.map((influencer, i) => (
            <div
              key={influencer.id + activeNiche}
              style={{
                animationName: "card-enter",
                animationDuration: "0.55s",
                animationTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                animationFillMode: "both",
                animationDelay: `${i * 90}ms`,
              }}
            >
              <InfluencerCard influencer={influencer} />
            </div>
          ))}
        </div>
      )}

      </div>
    </div>
  );
}
