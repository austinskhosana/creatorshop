"use client";

import { useState, useRef, useLayoutEffect } from "react";
import ListingCard from "@/components/software/ListingCard";

const CATEGORIES = ["All", "Productivity", "Design", "Video", "Marketing", "Analytics", "Social Media"];

const MOCK_LISTINGS = [
  { slug: "notion-plus",         name: "Notion",     logoUrl: null, planName: "Plus",         months: 3, postsRequired: 1, slotsRemaining: 3, category: "Productivity" },
  { slug: "figma-pro",           name: "Figma",      logoUrl: null, planName: "Professional", months: 1, postsRequired: 2, slotsRemaining: 1, category: "Design" },
  { slug: "capcut-pro",          name: "CapCut",     logoUrl: null, planName: "Pro",          months: 2, postsRequired: 1, slotsRemaining: 5, category: "Video" },
  { slug: "mailchimp-standard",  name: "Mailchimp",  logoUrl: null, planName: "Standard",     months: 3, postsRequired: 3, slotsRemaining: 2, category: "Marketing" },
  { slug: "buffer-essentials",   name: "Buffer",     logoUrl: null, planName: "Essentials",   months: 1, postsRequired: 1, slotsRemaining: 4, category: "Social Media" },
  { slug: "descript-creator",    name: "Descript",   logoUrl: null, planName: "Creator",      months: 6, postsRequired: 2, slotsRemaining: 2, category: "Video" },
];

export default function ExplorePage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [pill, setPill] = useState({ left: 0, width: 0, ready: false });

  useLayoutEffect(() => {
    const el = tabRefs.current[0];
    if (el) setPill({ left: el.offsetLeft, width: el.offsetWidth, ready: false });
  }, []);

  function handleCategoryChange(cat: string) {
    setActiveCategory(cat);
    const idx = CATEGORIES.indexOf(cat);
    const el = tabRefs.current[idx];
    if (el) setPill({ left: el.offsetLeft, width: el.offsetWidth, ready: true });
  }

  const filtered = activeCategory === "All"
    ? MOCK_LISTINGS
    : MOCK_LISTINGS.filter((l) => l.category === activeCategory);

  return (
    <div className="p-10 pl-20 flex flex-col items-center">
      <div className="w-full max-w-4xl">

      {/* ── Header ── */}
      <div className="flex flex-col gap-1 mb-6">
        <h1 className="text-3xl font-bold text-neutral-900">Explore Software</h1>
        <p className="text-[15px] text-gray-400">Post about a product. Get the subscription free.</p>
      </div>

      {/* ── Category filter tabs ── */}
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
        {CATEGORIES.map((cat, i) => (
          <button
            key={cat}
            ref={(el) => { tabRefs.current[i] = el; }}
            onClick={() => handleCategoryChange(cat)}
            className={[
              "relative z-10 px-4 py-1.5 rounded-lg text-sm font-medium",
              "transition-colors duration-[200ms]",
              activeCategory === cat ? "text-neutral-900" : "text-gray-500 hover:text-gray-800",
            ].join(" ")}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Listings grid ── */}
      <div className="grid grid-cols-3 gap-6">
        {filtered.map((listing, i) => (
          <div
            key={listing.slug + activeCategory}
            className="h-full"
            style={{
              animationName: "card-enter",
              animationDuration: "0.55s",
              animationTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
              animationFillMode: "both",
              animationDelay: `${i * 90}ms`,
            }}
          >
            <ListingCard {...listing} />
          </div>
        ))}
      </div>

      </div>
    </div>
  );
}
