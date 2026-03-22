"use client";

import { use } from "react";
import Link from "next/link";

// ── Mock data ─────────────────────────────────────────────────────────────────

type Influencer = {
  id: string;
  name: string;
  handle: string;
  location: string;
  followers: string; // e.g. "45K"
  engagementRate: string; // e.g. "4.5"
  about: string;
  niches: string[];
  // Placeholder colours for content grid images
  contentImages: string[];
};

const INFLUENCERS: Record<string, Influencer> = {
  "aino-johansson": {
    id: "aino-johansson",
    name: "Aino Johansson",
    handle: "@ainojohansson",
    location: "Los Angeles, California",
    followers: "45K",
    engagementRate: "4.5",
    about:
      "Hi, I'm Aino Johansson! I'm a fashion enthusiast and adventure lover who shares my unique style and vibrant experiences with you. From chic streetwear to stunning travel spots, I mix everyday moments with high-fashion looks to inspire you to live boldly and authentically. Join me as I explore urban landscapes, share style tips, and celebrate creativity and confidence.",
    niches: ["Fashion", "Travel", "Lifestyle", "Food", "Family"],
    contentImages: ["#D4B896", "#8B9E7A", "#C4956A", "#7B8FA6", "#B8A9C9", "#9CAF88", "#D4A8B0", "#8BA8C4"],
  },
  "noah-brown": {
    id: "noah-brown",
    name: "Noah Brown",
    handle: "@noahbrown",
    location: "Los Angeles, California",
    followers: "28K",
    engagementRate: "6.2",
    about:
      "Lifestyle creator based in LA. I document the everyday — good food, good fits, and everything in between. Focused on keeping it real and relatable.",
    niches: ["Lifestyle", "Fashion"],
    contentImages: ["#A8C4B8", "#C4A88C", "#8CA4C4", "#C4B88C", "#A88CA4", "#B8C4A8"],
  },
  "isla-smith": {
    id: "isla-smith",
    name: "Isla Smith",
    handle: "@islasmith",
    location: "Los Angeles, California",
    followers: "62K",
    engagementRate: "3.8",
    about:
      "Fashion and lifestyle content creator. I love exploring the intersection of personal style and everyday living. Always hunting for the next great find.",
    niches: ["Lifestyle", "Fashion"],
    contentImages: ["#C4A8A8", "#A8B8C4", "#C4BCA8", "#A8C4B0", "#BCA8C4", "#C4C4A8"],
  },
};

const FALLBACK = INFLUENCERS["aino-johansson"];

// ── Subcomponents ─────────────────────────────────────────────────────────────

function StatBadge({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <div className="flex items-center gap-2 bg-black/10 backdrop-blur-sm px-3.5 py-2 rounded-full">
      {icon}
      <span className="text-[14px] font-semibold text-gray-900">{value}</span>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function InfluencerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const influencer = INFLUENCERS[id] ?? FALLBACK;

  // How many content images to show before the overflow counter
  const VISIBLE_COUNT = 4;
  const visibleImages = influencer.contentImages.slice(0, VISIBLE_COUNT);
  const overflow = influencer.contentImages.length - VISIBLE_COUNT;

  return (
    <div className="min-h-full p-8">

      {/* ── Back button ──────────────────────────────────────────────── */}
      <Link
        href="/influencers"
        className="inline-flex items-center gap-2 text-[14px] text-gray-400 hover:text-gray-700 transition-colors duration-[120ms] mb-8 w-fit"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
        </svg>
        Back to Influencers
      </Link>

      {/* ── Profile card ─────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.06)] overflow-hidden">

        {/* ── Green gradient header ─────────────────────────────────── */}
        <div className="bg-gradient-to-b from-[#A3FF38] to-white px-8 pt-8 pb-6">
          <div className="flex items-start justify-between">

            {/* Avatar + name + location */}
            <div className="flex items-center gap-4">
              {/* Avatar placeholder */}
              <div className="w-16 h-16 rounded-full bg-white/60 border-2 border-white flex items-center justify-center flex-shrink-0 text-[24px]">
                {influencer.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-[22px] font-semibold text-gray-900">{influencer.name}</h1>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-gray-500">
                    <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 1 0 3 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 0 0 2.273 1.765 11.842 11.842 0 0 0 .976.544l.062.029.018.008.006.003ZM10 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[13px] text-gray-500">{influencer.location}</span>
                </div>
              </div>
            </div>

            {/* Stat badges */}
            <div className="flex items-center gap-2">
              <StatBadge
                value={`${influencer.followers} Followers`}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-700">
                    <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
                  </svg>
                }
              />
              <StatBadge
                value={`${influencer.engagementRate} Engagement Rate`}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-700">
                    <path d="M15.98 1.804a1 1 0 0 0-1.96 0l-.24 1.192a1 1 0 0 1-.784.785l-1.192.238a1 1 0 0 0 0 1.962l1.192.238a1 1 0 0 1 .785.785l.238 1.192a1 1 0 0 0 1.962 0l.238-1.192a1 1 0 0 1 .785-.785l1.192-.238a1 1 0 0 0 0-1.962l-1.192-.238a1 1 0 0 1-.785-.785l-.238-1.192ZM6.949 5.684a1 1 0 0 0-1.898 0l-.683 2.051a1 1 0 0 1-.633.633l-2.051.683a1 1 0 0 0 0 1.898l2.051.684a1 1 0 0 1 .633.632l.683 2.051a1 1 0 0 0 1.898 0l.683-2.051a1 1 0 0 1 .633-.633l2.051-.683a1 1 0 0 0 0-1.898l-2.051-.683a1 1 0 0 1-.633-.633L6.95 5.684Z" />
                  </svg>
                }
              />
            </div>
          </div>
        </div>

        {/* ── Body ─────────────────────────────────────────────────────── */}
        <div className="px-8 py-6 space-y-7">

          {/* About */}
          <div>
            <h2 className="text-[17px] font-semibold text-gray-900 mb-2">About</h2>
            <p className="text-[14px] text-gray-500 leading-relaxed">{influencer.about}</p>
          </div>

          {/* Niches */}
          <div>
            <h2 className="text-[17px] font-semibold text-gray-900 mb-3">Niches</h2>
            <div className="flex flex-wrap gap-2">
              {influencer.niches.map((niche) => (
                <span
                  key={niche}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-[14px] text-gray-700"
                >
                  {niche}
                </span>
              ))}
            </div>
          </div>

          {/* Content grid */}
          <div>
            <h2 className="text-[17px] font-semibold text-gray-900 mb-3">Content</h2>
            <div className="flex gap-2">
              {visibleImages.map((colour, i) => (
                <div
                  key={i}
                  className="w-[110px] h-[110px] rounded-xl flex-shrink-0"
                  style={{ backgroundColor: colour }}
                />
              ))}
              {overflow > 0 && (
                <div className="w-[110px] h-[110px] rounded-xl flex-shrink-0 bg-gray-100 flex items-center justify-center">
                  <span className="text-[16px] font-semibold text-gray-500">+{overflow}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-1">
            <button className="flex-1 py-3.5 rounded-2xl bg-gray-900 text-white text-[15px] font-semibold hover:bg-gray-800 active:scale-[0.98] transition-all duration-[140ms]">
              View Profile
            </button>
            <button className="flex-1 py-3.5 rounded-2xl bg-[#A3FF38] text-gray-900 text-[15px] font-semibold hover:brightness-95 active:scale-[0.98] transition-all duration-[140ms]">
              Contact
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
