"use client";

import { useState } from "react";
import Link from "next/link";

// ── Mock data ─────────────────────────────────────────────────────────────────

type Influencer = {
  id: string;
  name: string;
  location: string;
  niches: string[];
  heroImage: string; // placeholder colour
  avatarColour: string;
};

const INFLUENCERS: Influencer[] = [
  { id: "aino-johansson",  name: "Aino Johansson",  location: "Los Angeles, California", niches: ["Lifestyle", "Food"],     heroImage: "#C4A882", avatarColour: "#D4B896" },
  { id: "noah-brown",      name: "Noah Brown",      location: "Los Angeles, California", niches: ["Lifestyle", "Fashion"],  heroImage: "#7A9E8A", avatarColour: "#8BAA98" },
  { id: "isla-smith",      name: "Isla Smith",      location: "Los Angeles, California", niches: ["Lifestyle", "Fashion"],  heroImage: "#B07B6A", avatarColour: "#C4957A" },
  { id: "isla-brown",      name: "Isla Brown",      location: "Los Angeles, California", niches: ["Lifestyle", "Travel"],   heroImage: "#A8C4C4", avatarColour: "#8AB0B0" },
  { id: "olivia-williams", name: "Olivia Williams", location: "Los Angeles, California", niches: ["Fashion", "Travel"],     heroImage: "#C4C4A0", avatarColour: "#B0B08C" },
  { id: "george-williams", name: "George Williams", location: "Los Angeles, California", niches: ["Lifestyle", "Fitness"],  heroImage: "#A0A8C4", avatarColour: "#8C94B0" },
  { id: "maya-chen",       name: "Maya Chen",       location: "New York, New York",      niches: ["Beauty", "Fashion"],     heroImage: "#C4A8B8", avatarColour: "#B094A4" },
  { id: "james-lee",       name: "James Lee",       location: "Austin, Texas",           niches: ["Tech", "Lifestyle"],     heroImage: "#A8B8A8", avatarColour: "#94A494" },
  { id: "sara-kim",        name: "Sara Kim",        location: "Chicago, Illinois",       niches: ["Food", "Travel"],        heroImage: "#C4B8A0", avatarColour: "#B0A48C" },
];

const ALL_NICHES = ["All", "Lifestyle", "Fashion", "Travel", "Fitness", "Food", "Beauty", "Tech"];

// ── Card ──────────────────────────────────────────────────────────────────────

function InfluencerCard({ influencer }: { influencer: Influencer }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.09)] transition-shadow duration-200">

      {/* Avatar + name + location */}
      <div className="px-4 pt-4 pb-3 flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white text-[15px] font-semibold"
          style={{ backgroundColor: influencer.avatarColour }}
        >
          {influencer.name.charAt(0)}
        </div>
        <div>
          <div className="text-[14px] font-medium text-gray-900">{influencer.name}</div>
          <div className="flex items-center gap-1 mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-gray-400">
              <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 1 0 3 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 0 0 2.273 1.765 11.842 11.842 0 0 0 .976.544l.062.029.018.008.006.003ZM10 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" clipRule="evenodd" />
            </svg>
            <span className="text-[12px] text-gray-400">{influencer.location}</span>
          </div>
        </div>
      </div>

      {/* Niche pills */}
      <div className="px-4 pb-3 flex gap-1.5 flex-wrap">
        {influencer.niches.map((niche) => (
          <span key={niche} className="px-2.5 py-1 rounded-full bg-gray-100 text-[12px] text-gray-600">
            {niche}
          </span>
        ))}
      </div>

      {/* Hero image */}
      <div
        className="mx-4 rounded-xl h-[180px]"
        style={{ backgroundColor: influencer.heroImage }}
      />

      {/* View Profile button */}
      <div className="p-4">
        <Link
          href={`/influencers/${influencer.id}`}
          className="block w-full py-3 rounded-xl bg-gray-900 text-white text-[14px] font-semibold text-center hover:bg-gray-800 active:scale-[0.98] transition-all duration-[140ms]"
        >
          View Profile
        </Link>
      </div>

    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function InfluencersPage() {
  const [activeNiche, setActiveNiche] = useState("All");

  const filtered = activeNiche === "All"
    ? INFLUENCERS
    : INFLUENCERS.filter((i) => i.niches.includes(activeNiche));

  return (
    <div className="p-8">

      {/* ── Header ──────────────────────────────────────────────────── */}
      <h1 className="text-[28px] font-semibold text-gray-900 mb-6">Influencers</h1>

      {/* ── Niche filter tabs ────────────────────────────────────────── */}
      <div className="flex gap-1 mb-8 border border-gray-200 rounded-xl p-1 w-fit">
        {ALL_NICHES.map((niche) => (
          <button
            key={niche}
            onClick={() => setActiveNiche(niche)}
            className={[
              "px-4 py-2 rounded-lg text-[14px] font-medium transition-all duration-[140ms]",
              activeNiche === niche
                ? "bg-gray-900 text-white"
                : "text-gray-500 hover:text-gray-800",
            ].join(" ")}
          >
            {niche}
          </button>
        ))}
      </div>

      {/* ── Grid ────────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="py-24 text-center text-gray-400 text-[15px]">
          No influencers in this niche yet.
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-5">
          {filtered.map((influencer) => (
            <InfluencerCard key={influencer.id} influencer={influencer} />
          ))}
        </div>
      )}

    </div>
  );
}
