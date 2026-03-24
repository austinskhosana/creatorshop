"use client";

import { useState } from "react";
import ListingCard from "@/components/software/ListingCard";

const CATEGORIES = ["All", "Productivity", "Design", "Video", "Marketing", "Analytics", "Social Media"];

const MOCK_LISTINGS = [
  { slug: "notion-plus", name: "Notion", logoUrl: null, tagline: "All-in-one workspace for notes, docs, and projects.", planName: "Plus Plan", slotsRemaining: 3, category: "Productivity" },
  { slug: "figma-pro", name: "Figma", logoUrl: null, tagline: "Collaborative interface design tool for teams.", planName: "Professional Plan", slotsRemaining: 1, category: "Design" },
  { slug: "capcut-pro", name: "CapCut", logoUrl: null, tagline: "Professional video editing made simple.", planName: "Pro Plan", slotsRemaining: 5, category: "Video" },
  { slug: "mailchimp-standard", name: "Mailchimp", logoUrl: null, tagline: "Email marketing and automation platform.", planName: "Standard Plan", slotsRemaining: 2, category: "Marketing" },
  { slug: "buffer-essentials", name: "Buffer", logoUrl: null, tagline: "Schedule and manage all your social media posts.", planName: "Essentials Plan", slotsRemaining: 4, category: "Social Media" },
  { slug: "descript-creator", name: "Descript", logoUrl: null, tagline: "Record, edit, and publish podcasts and videos.", planName: "Creator Plan", slotsRemaining: 2, category: "Video" },
];

export default function ExplorePage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? MOCK_LISTINGS
    : MOCK_LISTINGS.filter((l) => l.category === activeCategory);

  return (
    <div className="p-10">

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-neutral-900">Explore Software</h1>
      </div>

      {/* ── Category filter tabs ── */}
      <div className="flex items-center gap-1 border border-gray-200 rounded-xl p-1 w-fit mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={[
              "px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-150",
              activeCategory === cat
                ? "bg-white shadow-sm border border-gray-200 text-neutral-900"
                : "text-gray-500 hover:text-gray-700",
            ].join(" ")}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Listings grid ── */}
      <div className="grid grid-cols-3 gap-5">
        {filtered.map((listing) => (
          <ListingCard key={listing.slug} {...listing} />
        ))}
      </div>

    </div>
  );
}
