"use client";

import { use, useState } from "react";
import Link from "next/link";

type Deliverable = {
  quantity: number;
  type: string;
};

type Listing = {
  slug: string;
  name: string;
  brand: string;
  tagline: string;
  description: string;
  logoUrl: string | null;
  planName: string;
  planValue: number;
  category: string;
  slotsRemaining: number;
  deliveryDays: number;
  deliverables: Deliverable[];
};

const LISTINGS: Record<string, Listing> = {
  "notion-plus": {
    slug: "notion-plus",
    name: "Notion",
    brand: "Notion Labs",
    tagline: "All-in-one workspace for notes, docs, and projects.",
    description:
      "Notion is the connected workspace that combines notes, docs, project management, and wikis — all in one tool. Used by teams at companies like Figma, Pixar, and The New York Times.",
    logoUrl: null,
    planName: "Plus Plan",
    planValue: 96,
    category: "Productivity",
    slotsRemaining: 3,
    deliveryDays: 14,
    deliverables: [
      { quantity: 1, type: "Review Post" },
      { quantity: 2, type: "Stories" },
    ],
  },
  "figma-pro": {
    slug: "figma-pro",
    name: "Figma",
    brand: "Figma Inc.",
    tagline: "Collaborative interface design tool for teams.",
    description:
      "Figma is the leading collaborative design tool. Build beautiful products from wireframes to high-fidelity prototypes — all in the browser, all in real-time with your team.",
    logoUrl: null,
    planName: "Professional Plan",
    planValue: 144,
    category: "Design",
    slotsRemaining: 1,
    deliveryDays: 21,
    deliverables: [
      { quantity: 1, type: "Tutorial Reel" },
      { quantity: 1, type: "Review Post" },
      { quantity: 3, type: "Stories" },
    ],
  },
  "capcut-pro": {
    slug: "capcut-pro",
    name: "CapCut",
    brand: "ByteDance",
    tagline: "Professional video editing made simple.",
    description:
      "CapCut Pro gives you access to premium templates, advanced AI tools, and unlimited exports with no watermark. The go-to editor for creators on TikTok, Instagram, and YouTube.",
    logoUrl: null,
    planName: "Pro Plan",
    planValue: 84,
    category: "Video",
    slotsRemaining: 5,
    deliveryDays: 10,
    deliverables: [
      { quantity: 2, type: "Reels" },
      { quantity: 1, type: "Review Post" },
    ],
  },
  "mailchimp-standard": {
    slug: "mailchimp-standard",
    name: "Mailchimp",
    brand: "Intuit Mailchimp",
    tagline: "Email marketing and automation platform.",
    description:
      "Mailchimp Standard gives you advanced audience insights, predictive segmentation, and multi-step automation. Everything a growing creator needs to run a professional email list.",
    logoUrl: null,
    planName: "Standard Plan",
    planValue: 180,
    category: "Marketing",
    slotsRemaining: 2,
    deliveryDays: 14,
    deliverables: [
      { quantity: 1, type: "Newsletter Feature" },
      { quantity: 2, type: "Stories" },
    ],
  },
  "buffer-essentials": {
    slug: "buffer-essentials",
    name: "Buffer",
    brand: "Buffer Inc.",
    tagline: "Schedule and manage all your social media posts.",
    description:
      "Buffer Essentials lets you schedule posts across all major platforms, analyse what's working, and keep a consistent presence without being glued to your phone.",
    logoUrl: null,
    planName: "Essentials Plan",
    planValue: 60,
    category: "Social Media",
    slotsRemaining: 4,
    deliveryDays: 7,
    deliverables: [
      { quantity: 1, type: "Review Post" },
      { quantity: 2, type: "Stories" },
    ],
  },
  "descript-creator": {
    slug: "descript-creator",
    name: "Descript",
    brand: "Descript Inc.",
    tagline: "Record, edit, and publish podcasts and videos.",
    description:
      "Descript is the all-in-one audio and video editor that works like a doc. Edit media by editing text, remove filler words in one click, and publish directly to YouTube or your podcast feed.",
    logoUrl: null,
    planName: "Creator Plan",
    planValue: 144,
    category: "Video",
    slotsRemaining: 2,
    deliveryDays: 21,
    deliverables: [
      { quantity: 1, type: "Tutorial Video" },
      { quantity: 1, type: "Review Post" },
      { quantity: 3, type: "Stories" },
    ],
  },
};

// Mock: slugs the current creator has already applied to
const EXISTING_APPLICATIONS: Record<string, { shopId: string; status: "PENDING" | "APPROVED" | "DELIVERED" | "COMPLETED" | "REVOKED" }> = {
  "notion-plus": { shopId: "1", status: "APPROVED" },
};

const STATUS_COPY: Record<string, string> = {
  PENDING:   "Application pending",
  APPROVED:  "Already approved",
  DELIVERED: "Delivery submitted",
  COMPLETED: "Shop completed",
  REVOKED:   "Shop revoked",
};

function deliverablesSummary(deliverables: Deliverable[]) {
  return deliverables.map((d) => `${d.quantity} ${d.type}`).join(" · ");
}

function PayWithPostCard({ listing }: { listing: Listing }) {
  return (
    <div className="rounded-2xl overflow-hidden">
      <div className="bg-[#111111] px-6 pt-6 pb-5">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#A3FF38] flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 58 56" fill="none" className="w-5 h-5">
                <path d="M45.446 0H11.969C5.359 0 0 5.329 0 11.903V44.031C0 50.605 5.359 55.935 11.969 55.935H45.446C52.057 55.935 57.415 50.605 57.415 44.031V11.903C57.415 5.329 52.057 0 45.446 0Z" fill="#A3FF38"/>
                <path d="M45.659 27.311H31.892c-.587 0-.881-.707-.467-1.12l6.563-6.526a.75.75 0 000-1.061.75.75 0 00-1.063 0l-6.563 6.527c-.416.413-1.125.12-1.125-.465V11.109a.662.662 0 00-.662-.657.662.662 0 00-.663.657V24.8c0 .585-.711.877-1.125.465l-6.563-6.527a.75.75 0 00-1.062 0 .75.75 0 000 1.06l6.562 6.527c.415.414.12 1.12-.466 1.12H11.756a.662.662 0 00-.66.657c0 .361.295.656.66.656h13.767c.587 0 .881.707.466 1.12l-6.562 6.527a.75.75 0 000 1.06.75.75 0 001.062 0l6.563-6.527c.414-.413 1.125-.12 1.125.465v13.691c0 .362.296.657.663.657.366 0 .662-.294.662-.657V30.635c0-.585.711-.877 1.125-.465l6.563 6.527a.75.75 0 001.062 0 .75.75 0 000-1.06l-6.563-6.527c-.414-.413-.12-1.12.467-1.12H45.66a.662.662 0 00.66-.656.662.662 0 00-.66-.657z" fill="#181818"/>
              </svg>
            </div>
            <div>
              <div className="text-[11px] text-white/40 uppercase tracking-widest font-medium">Pay with</div>
              <div className="text-[16px] text-white font-semibold leading-tight">Post</div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[11px] text-white/40 uppercase tracking-widest font-medium">Plan value</div>
            <div className="text-[20px] text-[#A3FF38] font-semibold">${listing.planValue}<span className="text-[13px] text-white/40 font-normal">/yr</span></div>
          </div>
        </div>

        <div className="border-t border-white/10 mb-5" />

        <div className="space-y-3">
          {listing.deliverables.map((d) => (
            <div key={d.type} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#A3FF38]" />
                <span className="text-[14px] text-white/60">{d.type}</span>
              </div>
              <span className="text-[14px] text-white font-medium">×{d.quantity}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#1A1A1A] px-6 py-3.5 flex items-center justify-between">
        <span className="text-[12px] text-white/40">{deliverablesSummary(listing.deliverables)}</span>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#A3FF38]" />
          <span className="text-[12px] text-[#A3FF38] font-medium">
            {listing.slotsRemaining} {listing.slotsRemaining === 1 ? "slot" : "slots"} left
          </span>
        </div>
      </div>
    </div>
  );
}

export default function SoftwareListingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const listing = LISTINGS[slug] ?? LISTINGS["notion-plus"];
  const existingApp = EXISTING_APPLICATIONS[slug] ?? null;
  const [state, setState] = useState<"idle" | "loading" | "applied" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleApply() {
    setState("loading");
    await new Promise((r) => setTimeout(r, 800));
    setState("applied");
  }

  return (
    <div className="min-h-full py-10 pb-24 px-16 flex flex-col">

      {/* ── Back ── */}
      <Link
        href="/explore"
        className="inline-flex items-center gap-2 text-[14px] text-gray-400 hover:text-gray-700 transition-colors duration-[120ms] mb-14 w-fit"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
        </svg>
        Back to Explore
      </Link>

      {/* ── Single-column layout ── */}
      <div className="flex flex-col gap-6 w-[420px] mx-auto">

        {/* Logo area */}
        <div className="w-full h-52 rounded-3xl bg-gray-100 flex items-center justify-center">
          {listing.logoUrl ? (
            <img src={listing.logoUrl} alt={listing.name} className="w-20 h-20 object-contain" />
          ) : (
            <span className="text-7xl font-bold text-gray-300">{listing.name[0]}</span>
          )}
        </div>

        {/* Brand + name */}
        <div>
          <div className="text-[13px] text-gray-400 uppercase tracking-widest font-medium mb-1">
            {listing.brand} · {listing.planName}
          </div>
          <h1 className="text-[28px] font-semibold text-gray-900 leading-tight">
            {listing.name}
          </h1>
        </div>

        {/* Description */}
        <p className="text-[15px] text-gray-500 leading-relaxed -mt-2">
          {listing.description}
        </p>

        {/* Pay with Post card */}
        <PayWithPostCard listing={listing} />

        {/* Delivery note */}
        <p className="text-[13px] text-gray-400 text-center -mt-2">
          Deliver within {listing.deliveryDays} days of approval
        </p>

        {/* Apply button */}
        {existingApp ? (
          <div className="flex flex-col gap-2">
            <div className="w-full py-4 rounded-2xl bg-gray-100 text-gray-400 text-[16px] font-medium text-center cursor-not-allowed select-none">
              {STATUS_COPY[existingApp.status]}
            </div>
            <Link
              href={`/shops/${existingApp.shopId}`}
              className="text-[13px] text-gray-400 hover:text-gray-700 transition-colors duration-[120ms] text-center"
            >
              View your shop →
            </Link>
          </div>
        ) : state === "applied" ? (
          <div className="w-full py-4 rounded-2xl bg-gray-100 text-gray-500 text-[16px] font-medium text-center">
            Application sent — we&apos;ll be in touch.
          </div>
        ) : (
          <>
            <button
              onClick={handleApply}
              disabled={state === "loading"}
              className="w-full py-4 rounded-2xl bg-[#A3FF38] text-gray-900 text-[16px] font-semibold hover:brightness-95 active:scale-[0.98] transition-[filter,transform] duration-[140ms] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {state === "loading" ? "Applying…" : "Apply to Purchase"}
            </button>
            {state === "error" && (
              <p className="text-[13px] text-red-500 text-center -mt-2">{errorMsg}</p>
            )}
          </>
        )}

      </div>
    </div>
  );
}
