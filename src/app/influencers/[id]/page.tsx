"use client";

import { use } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

// ── Types ──────────────────────────────────────────────────────────────────────

type CreatorProfile = {
  id: string;
  displayName: string;
  handle: string;
  bio: string;
  location: string;
  niches: string[];
  audienceSize: string;
  services: string[];
  instagramUrl: string;
  tiktokUrl: string;
  youtubeUrl: string;
  twitterUrl: string;
  linkedinUrl: string;
};

// ── Mock data ─────────────────────────────────────────────────────────────────

const CREATORS: Record<string, CreatorProfile> = {
  "aino-johansson": {
    id: "aino-johansson",
    displayName: "Aino Johansson",
    handle: "@ainojohansson",
    bio: "Fashion enthusiast and adventure lover sharing my unique style and vibrant experiences. From chic streetwear to stunning travel spots, I mix everyday moments with high-fashion looks to inspire you to live boldly and authentically.",
    location: "Los Angeles, California",
    niches: ["Fashion", "Travel", "Lifestyle"],
    audienceSize: "10K–50K",
    services: ["Instagram Reels", "Stories", "YouTube Reviews", "Blog Posts"],
    instagramUrl: "https://instagram.com/ainojohansson",
    tiktokUrl: "https://tiktok.com/@ainojohansson",
    youtubeUrl: "",
    twitterUrl: "",
    linkedinUrl: "",
  },
  "noah-brown": {
    id: "noah-brown",
    displayName: "Noah Brown",
    handle: "@noahbrown",
    bio: "Lifestyle creator based in LA. I document the everyday — good food, good fits, and everything in between. Focused on keeping it real and relatable.",
    location: "Los Angeles, California",
    niches: ["Lifestyle", "Fashion"],
    audienceSize: "10K–50K",
    services: ["Instagram Reels", "TikTok Videos", "Stories"],
    instagramUrl: "https://instagram.com/noahbrown",
    tiktokUrl: "https://tiktok.com/@noahbrown",
    youtubeUrl: "",
    twitterUrl: "https://x.com/noahbrown",
    linkedinUrl: "",
  },
  "isla-smith": {
    id: "isla-smith",
    displayName: "Isla Smith",
    handle: "@islasmith",
    bio: "Fashion and lifestyle content creator. I love exploring the intersection of personal style and everyday living. Always hunting for the next great find.",
    location: "London, UK",
    niches: ["Lifestyle", "Fashion", "Fitness"],
    audienceSize: "50K–100K",
    services: ["Instagram Reels", "Stories", "Sponsored Posts"],
    instagramUrl: "https://instagram.com/islasmith",
    tiktokUrl: "",
    youtubeUrl: "https://youtube.com/@islasmith",
    twitterUrl: "",
    linkedinUrl: "",
  },
};

const FALLBACK = CREATORS["aino-johansson"];

// ── Social links config ────────────────────────────────────────────────────────

const SOCIAL_PLATFORMS = [
  {
    key: "instagramUrl" as keyof CreatorProfile,
    label: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069Zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z"/>
      </svg>
    ),
  },
  {
    key: "tiktokUrl" as keyof CreatorProfile,
    label: "TikTok",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.3 6.3 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06Z"/>
      </svg>
    ),
  },
  {
    key: "youtubeUrl" as keyof CreatorProfile,
    label: "YouTube",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z"/>
      </svg>
    ),
  },
  {
    key: "twitterUrl" as keyof CreatorProfile,
    label: "X / Twitter",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    key: "linkedinUrl" as keyof CreatorProfile,
    label: "LinkedIn",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CreatorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const creator = CREATORS[id] ?? FALLBACK;
  const searchParams = useSearchParams();
  const fromProfile = searchParams.get("from") === "profile";
  const backHref = fromProfile ? "/profile" : "/influencers";
  const backLabel = fromProfile ? "Back to Profile" : "Back to Creators";

  const socialLinks = SOCIAL_PLATFORMS.filter((p) => creator[p.key]);

  return (
    <div className="min-h-full p-8 pb-24 flex flex-col">

      {/* ── Back ── */}
      <Link
        href={backHref}
        className="inline-flex items-center gap-2 text-[14px] text-gray-400 hover:text-gray-700 transition-colors duration-[120ms] mb-8 w-fit"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
        </svg>
        {backLabel}
      </Link>

      <div className="flex-1 flex flex-col justify-center">
      <div className="max-w-2xl mx-auto w-full flex flex-col gap-5">

        {/* ── Header card ── */}
        <div className="rounded-3xl border border-gray-200 bg-white overflow-hidden">
          <div className="bg-gradient-to-b from-[#A3FF38]/40 to-white px-8 pt-8 pb-6">
            <div className="flex items-start justify-between gap-4">

              {/* Avatar + name */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#A3FF38]/30 border border-[#A3FF38]/40 flex items-center justify-center text-[24px] font-bold text-[#2A6000] flex-shrink-0">
                  {creator.displayName[0]}
                </div>
                <div>
                  <h1 className="text-[20px] font-bold text-neutral-900 leading-tight">{creator.displayName}</h1>
                  <p className="text-[13px] text-gray-400 mt-0.5">{creator.handle}</p>
                  {creator.location && (
                    <div className="flex items-center gap-1 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-gray-400">
                        <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 1 0 3 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 0 0 2.273 1.765 11.842 11.842 0 0 0 .976.544l.062.029.018.008.006.003ZM10 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" clipRule="evenodd" />
                      </svg>
                      <span className="text-[12px] text-gray-400">{creator.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Audience size pill */}
              {creator.audienceSize && (
                <span className="flex-shrink-0 px-3 py-1.5 rounded-full bg-[#A3FF38] border border-[#82F200] shadow-[inset_3px_3px_6px_rgba(255,255,255,0.4)] text-gray-900 text-[12px] font-semibold">
                  {creator.audienceSize} followers
                </span>
              )}

            </div>
          </div>

          {/* Bio + services + socials */}
          <div className="px-8 pb-6 flex flex-col gap-5">
            {creator.bio && (
              <p className="text-[14px] text-gray-500 leading-relaxed">{creator.bio}</p>
            )}

            {creator.niches.length > 0 && (
              <div className="flex flex-col gap-2.5 pt-5 border-t border-gray-100">
                <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider">Niches</p>
                <div className="flex flex-wrap gap-2">
                  {creator.niches.map((n) => (
                    <span key={n} className="px-3 py-1.5 rounded-xl bg-[#F6F6F6] text-gray-700 text-[13px] font-medium">
                      {n}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {creator.services.length > 0 && (
              <div className="flex flex-col gap-2.5 pt-5 border-t border-gray-100">
                <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider">What they offer</p>
                <div className="flex flex-wrap gap-2">
                  {creator.services.map((s) => (
                    <span key={s} className="px-3 py-1.5 rounded-xl bg-[#F6F6F6] text-gray-700 text-[13px] font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {socialLinks.length > 0 && (
              <div className="flex flex-col gap-2.5 pt-5 border-t border-gray-100">
                <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider">Socials</p>
                <div className="flex flex-wrap gap-2">
                  {socialLinks.map(({ key, label, icon }) => (
                    <a
                      key={key}
                      href={creator[key] as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-gray-200 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.03)] text-[13px] font-medium text-gray-600 hover:border-gray-300 hover:text-gray-900 transition-colors duration-[120ms]"
                    >
                      <span className="text-gray-500">{icon}</span>
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Actions ── */}
        {!fromProfile && (
          <button className="w-full py-3.5 rounded-2xl bg-[#A3FF38] border border-[#82F200] shadow-[inset_3px_3px_6px_rgba(255,255,255,0.4)] text-gray-900 text-[15px] font-semibold hover:brightness-95 active:scale-[0.98] transition-all duration-[140ms]">
            Invite to Campaign
          </button>
        )}

      </div>
      </div>
    </div>
  );
}
