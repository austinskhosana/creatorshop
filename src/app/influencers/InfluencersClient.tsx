"use client";

import { useState, useRef, useLayoutEffect } from "react";
import Link from "next/link";

type Creator = {
  id: string;
  displayName: string;
  bio: string | null;
  niches: string[];
  avatarUrl: string | null;
};

const COVER_PALETTE = [
  "#C4A882", "#7A9E8A", "#B07B6A", "#A8C4C4",
  "#C4C4A0", "#A0A8C4", "#C4A8B8", "#A8B8A8", "#C4B8A0",
];

function coverColor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return COVER_PALETTE[hash % COVER_PALETTE.length];
}

function CreatorCard({ creator }: { creator: Creator }) {
  return (
    <div className="card-shine flex flex-col rounded-3xl border border-gray-200 bg-white p-3 gap-3 h-full">
      <div
        className="w-full h-44 rounded-2xl flex-shrink-0"
        style={{ backgroundColor: coverColor(creator.id) }}
      />

      <div className="flex flex-wrap gap-2 px-1">
        {creator.niches.slice(0, 2).map((niche) => (
          <span
            key={niche}
            className="px-4 py-1.5 rounded-xl bg-[#EDFFD0] text-[#3A7A00] text-[13px] font-medium"
          >
            {niche}
          </span>
        ))}
      </div>

      <div className="flex flex-col gap-1 px-1 flex-1">
        <p className="text-[18px] font-bold text-neutral-900 leading-snug">{creator.displayName}</p>
        <p className="text-[14px] text-gray-400 leading-snug line-clamp-2">{creator.bio}</p>
      </div>

      <Link
        href={`/influencers/${creator.id}`}
        className="w-full bg-neutral-900 text-white text-sm font-semibold text-center py-3 rounded-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] hover:opacity-90 transition-opacity"
      >
        View Profile
      </Link>
    </div>
  );
}

export default function InfluencersClient({ creators }: { creators: Creator[] }) {
  const allNiches = ["All", ...Array.from(new Set(creators.flatMap((c) => c.niches))).sort()];

  const [activeNiche, setActiveNiche] = useState("All");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [pill, setPill] = useState({ left: 0, width: 0, ready: false });

  useLayoutEffect(() => {
    const el = tabRefs.current[0];
    if (el) setPill({ left: el.offsetLeft, width: el.offsetWidth, ready: false });
  }, []);

  function handleNicheChange(niche: string) {
    setActiveNiche(niche);
    const idx = allNiches.indexOf(niche);
    const el = tabRefs.current[idx];
    if (el) setPill({ left: el.offsetLeft, width: el.offsetWidth, ready: true });
  }

  const filtered =
    activeNiche === "All" ? creators : creators.filter((c) => c.niches.includes(activeNiche));

  return (
    <div className="p-10 pl-20 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <div className="flex flex-col gap-1 mb-6">
          <h1 className="text-3xl font-bold text-neutral-900">Creators</h1>
          <p className="text-[15px] text-gray-400">Browse creators available for your next campaign.</p>
        </div>

        {creators.length === 0 ? (
          <div className="py-24 text-center text-gray-400 text-[15px]">
            No creators have joined yet.
          </div>
        ) : (
          <>
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
              {allNiches.map((niche, i) => (
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

            {filtered.length === 0 ? (
              <div className="py-24 text-center text-gray-400 text-[15px]">
                No creators in this niche yet.
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-6">
                {filtered.map((creator, i) => (
                  <div
                    key={creator.id + activeNiche}
                    style={{
                      animationName: "card-enter",
                      animationDuration: "0.55s",
                      animationTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                      animationFillMode: "both",
                      animationDelay: `${i * 90}ms`,
                    }}
                  >
                    <CreatorCard creator={creator} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
