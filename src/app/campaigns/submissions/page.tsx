"use client";

import { useState, useRef, useLayoutEffect, useEffect } from "react";
import Badge from "@/components/ui/Badge";
import Link from "next/link";

type Platform = "Instagram" | "TikTok" | "YouTube" | "X";
type Status = "pending" | "approved" | "rejected";

type Submission = {
  id: string;
  creator: string;
  handle: string;
  platform: Platform;
  postUrl: string;
  product: string;
  submittedAt: string;
  status: Status;
  bio: string;
  location: string;
  followers: string;
  niches: string[];
  services: string[];
};

const INITIAL_SUBMISSIONS: Submission[] = [
  { id: "1", creator: "Jordan Lee",    handle: "@jordanlee",    platform: "Instagram", postUrl: "https://instagram.com/p/abc123",           product: "Wireless Headphones",   submittedAt: "2026-03-20T09:15:00Z", status: "pending",  bio: "Lifestyle creator based in NYC. I cover everyday carry, tech, and urban living.",             location: "New York, NY",      followers: "32K",  niches: ["Lifestyle", "Tech"],             services: ["Instagram Reels", "Story Series"]          },
  { id: "2", creator: "Maya Chen",     handle: "@mayachen",     platform: "TikTok",    postUrl: "https://tiktok.com/@mayachen/video/456",    product: "Skincare Starter Kit",  submittedAt: "2026-03-20T10:42:00Z", status: "pending",  bio: "Beauty and skincare obsessed. Clean routines, honest reviews, bold aesthetics.",               location: "Los Angeles, CA",   followers: "88K",  niches: ["Beauty", "Fashion"],             services: ["TikTok Videos", "UGC Content"]              },
  { id: "3", creator: "Devin Park",    handle: "@devinpark",    platform: "YouTube",   postUrl: "https://youtube.com/watch?v=xyz789",        product: "Mechanical Keyboard",   submittedAt: "2026-03-19T16:00:00Z", status: "pending",  bio: "Tech reviewer and productivity nerd. Deep dives, honest takes, no filler.",                   location: "Austin, TX",        followers: "120K", niches: ["Tech", "Productivity"],          services: ["YouTube Reviews", "Short-form Videos"]     },
  { id: "4", creator: "Aisha Okafor",  handle: "@aishaokafor",  platform: "X",         postUrl: "https://x.com/aishaokafor/status/111",      product: "Protein Powder Bundle", submittedAt: "2026-03-19T11:30:00Z", status: "pending",  bio: "Fitness coach and content creator helping people build sustainable healthy habits.",           location: "Atlanta, GA",       followers: "18K",  niches: ["Fitness", "Lifestyle"],          services: ["Twitter Threads", "Long-form Posts"]       },
  { id: "5", creator: "Lucas Mendes",  handle: "@lucasmendes",  platform: "Instagram", postUrl: "https://instagram.com/p/def456",           product: "Yoga Mat",              submittedAt: "2026-03-18T08:05:00Z", status: "approved", bio: "Yoga instructor and mindfulness creator sharing flow routines and wellness tips.",             location: "Miami, FL",         followers: "54K",  niches: ["Fitness", "Wellness"],           services: ["Instagram Reels", "Carousels"]             },
  { id: "6", creator: "Sara Kim",      handle: "@sarakim",      platform: "TikTok",    postUrl: "https://tiktok.com/@sarakim/video/789",     product: "LED Ring Light",        submittedAt: "2026-03-17T14:20:00Z", status: "rejected", bio: "Food and travel content creator chasing the best bites around the world.",                    location: "San Francisco, CA", followers: "41K",  niches: ["Food", "Travel"],                services: ["TikTok Videos", "Recipe Content"]          },
];

const AVATAR_COLORS = [
  "bg-violet-100 text-violet-600",
  "bg-blue-100 text-blue-600",
  "bg-emerald-100 text-emerald-600",
  "bg-orange-100 text-orange-600",
  "bg-pink-100 text-pink-600",
  "bg-yellow-100 text-yellow-700",
  "bg-teal-100 text-teal-600",
  "bg-red-100 text-red-500",
];

function avatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const PLATFORM_STYLES: Record<Platform, string> = {
  Instagram: "bg-pink-50 text-pink-600",
  TikTok:    "bg-gray-100 text-gray-700",
  YouTube:   "bg-red-50 text-red-600",
  X:         "bg-sky-50 text-sky-600",
};

// ── Creator detail drawer ──────────────────────────────────────────────────────

function CreatorDrawer({
  sub,
  onClose,
  onApprove,
  onReject,
}: {
  sub: Submission;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const initials = sub.creator.split(" ").map((n) => n[0]).join("");
  const colorClass = avatarColor(sub.creator);

  return (
    <>
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40 transition-opacity duration-200"
        onClick={onClose}
      />
      <div className="fixed top-0 right-0 h-full w-[420px] bg-white z-50 shadow-2xl flex flex-col overflow-hidden animate-slide-in">

        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <p className="text-[13px] font-medium text-gray-400 uppercase tracking-widest">Creator details</p>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors duration-[120ms]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold flex-shrink-0 ${colorClass}`}>
              {initials}
            </div>
            <div>
              <p className="text-[17px] font-bold text-neutral-900">{sub.creator}</p>
              <p className="text-[13px] text-gray-400">{sub.handle}</p>
            </div>
            <span className={`ml-auto text-[11px] font-medium px-2.5 py-1 rounded-full ${PLATFORM_STYLES[sub.platform]}`}>
              {sub.platform}
            </span>
          </div>

          <div>
            <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">About</p>
            <p className="text-[14px] text-gray-600 leading-relaxed">{sub.bio}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-0.5 bg-gray-50 rounded-2xl p-4">
              <p className="text-[12px] text-gray-400">Followers</p>
              <p className="text-[18px] font-bold text-neutral-900">{sub.followers}</p>
            </div>
            <div className="flex flex-col gap-0.5 bg-gray-50 rounded-2xl p-4">
              <p className="text-[12px] text-gray-400">Location</p>
              <p className="text-[14px] font-semibold text-neutral-900 leading-tight">{sub.location}</p>
            </div>
          </div>

          <div>
            <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Niches</p>
            <div className="flex flex-wrap gap-2">
              {sub.niches.map((niche) => (
                <span key={niche} className="px-3 py-1.5 rounded-xl bg-[#EDFFD0] text-[#3A7A00] text-[13px] font-medium">
                  {niche}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider mb-2">What they offer</p>
            <div className="flex flex-wrap gap-2">
              {sub.services.map((s) => (
                <span key={s} className="px-3 py-1.5 rounded-xl bg-gray-100 text-gray-700 text-[13px] font-medium">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 p-4 space-y-2.5">
            <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider">This submission</p>
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-gray-500">Product</span>
              <span className="text-[13px] font-medium text-neutral-900">{sub.product}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-gray-500">Submitted</span>
              <span className="text-[13px] font-medium text-neutral-900">{formatDate(sub.submittedAt)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-gray-500">Post</span>
              <a
                href={sub.postUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] text-blue-500 hover:text-blue-700 transition-colors duration-[120ms]"
              >
                View post →
              </a>
            </div>
          </div>

          <Link
            href={`/influencers/${sub.handle.replace("@", "")}`}
            className="flex items-center justify-between px-4 py-3 rounded-2xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-[120ms] group"
          >
            <span className="text-[13px] font-medium text-gray-600 group-hover:text-gray-900">View full profile</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-400 group-hover:text-gray-600">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>
          </Link>

        </div>

        {sub.status === "pending" ? (
          <div className="px-6 py-4 border-t border-gray-100 flex gap-2">
            <button
              onClick={() => { onApprove(); onClose(); }}
              className="flex-1 py-3 rounded-xl bg-neutral-900 text-white text-sm font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] hover:opacity-90 active:scale-[0.98] transition-all duration-[140ms]"
            >
              Approve
            </button>
            <button
              onClick={() => { onReject(); onClose(); }}
              className="flex-1 py-3 rounded-xl border border-gray-200 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.03)] text-gray-500 text-sm font-semibold hover:bg-gray-50 active:scale-[0.98] transition-all duration-[140ms]"
            >
              Reject
            </button>
          </div>
        ) : (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-[13px] text-gray-400">Decision made</span>
            <Badge
              variant={sub.status === "approved" ? "APPROVED" : "DENIED"}
              label={sub.status === "approved" ? "Approved" : "Rejected"}
            />
          </div>
        )}
      </div>
    </>
  );
}

// ── Submission card ────────────────────────────────────────────────────────────

function SubmissionCard({
  sub,
  onApprove,
  onReject,
  onViewDetails,
}: {
  sub: Submission;
  onApprove: () => void;
  onReject: () => void;
  onViewDetails: () => void;
}) {
  return (
    <div className="card-shine flex flex-col rounded-3xl border border-gray-200 bg-white p-3 gap-3 h-full">

      <button
        onClick={onViewDetails}
        className={`flex items-center justify-center h-36 rounded-2xl ${avatarColor(sub.creator)} hover:opacity-80 transition-opacity duration-[120ms] cursor-pointer w-full`}
      >
        <span className="text-4xl font-bold opacity-40">
          {sub.creator.split(" ").map((n) => n[0]).join("")}
        </span>
      </button>

      <div className="flex flex-col gap-2 px-1 flex-1">
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={onViewDetails}
            className="text-[16px] font-semibold text-neutral-900 leading-snug hover:underline text-left"
          >
            {sub.creator}
          </button>
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${PLATFORM_STYLES[sub.platform]}`}>
            {sub.platform}
          </span>
        </div>
        <p className="text-sm text-gray-400 leading-snug">{sub.product}</p>
        <div className="flex items-center justify-between mt-auto pt-1">
          <span className="text-[12px] text-gray-300">{sub.handle}</span>
          <span className="text-[12px] text-gray-300">{formatDate(sub.submittedAt)}</span>
        </div>
      </div>

      {sub.status === "pending" ? (
        <div className="flex gap-2">
          <button
            onClick={onApprove}
            className="flex-1 py-2.5 rounded-xl bg-neutral-900 text-white text-sm font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] hover:opacity-90 active:scale-[0.98] transition-all duration-[140ms]"
          >
            Approve
          </button>
          <button
            onClick={onReject}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.03)] text-gray-500 text-sm font-semibold hover:bg-gray-50 active:scale-[0.98] transition-all duration-[140ms]"
          >
            Reject
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between px-1">
          <a
            href={sub.postUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] text-blue-500 hover:text-blue-700 transition-colors duration-[120ms]"
          >
            View post →
          </a>
          <Badge
            variant={sub.status === "approved" ? "APPROVED" : "DENIED"}
            label={sub.status === "approved" ? "Approved" : "Rejected"}
          />
        </div>
      )}

    </div>
  );
}

type Tab = "pending" | "approved" | "rejected";
const TABS: { id: Tab; label: string }[] = [
  { id: "pending",  label: "Pending"  },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
];

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>(INITIAL_SUBMISSIONS);
  const [activeTab, setActiveTab] = useState<Tab>("pending");
  const [drawerSub, setDrawerSub] = useState<Submission | null>(null);

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [pill, setPill] = useState({ left: 0, width: 0, ready: false });

  useLayoutEffect(() => {
    const el = tabRefs.current[0];
    if (el) setPill({ left: el.offsetLeft, width: el.offsetWidth, ready: false });
  }, []);

  function handleTabChange(tab: Tab) {
    setActiveTab(tab);
    const idx = TABS.findIndex((t) => t.id === tab);
    const el = tabRefs.current[idx];
    if (el) setPill({ left: el.offsetLeft, width: el.offsetWidth, ready: true });
  }

  function updateStatus(id: string, status: Status) {
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
    setDrawerSub((prev) => (prev?.id === id ? { ...prev, status } : prev));
  }

  const filtered = submissions.filter((s) => s.status === activeTab);
  const counts = {
    pending:  submissions.filter((s) => s.status === "pending").length,
    approved: submissions.filter((s) => s.status === "approved").length,
    rejected: submissions.filter((s) => s.status === "rejected").length,
  };

  return (
    <div className="p-10 pl-20 flex flex-col items-center">
      <div className="w-full max-w-4xl">

      {/* ── Back ── */}
      <Link
        href="/campaigns/list"
        className="inline-flex items-center gap-2 text-[14px] text-gray-400 hover:text-gray-700 transition-colors duration-[120ms] mb-8"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
        </svg>
        Back
      </Link>

      {/* ── Header ── */}
      <div className="flex flex-col gap-1 mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Submitted Posts</h1>
        <p className="text-[15px] text-gray-400">Review posts from creators and approve or reject them.</p>
      </div>

      {/* ── Tab bar ── */}
      <div className="relative flex gap-1 border border-gray-200 rounded-xl p-1 w-fit mb-8">
        <div
          className="absolute top-1 bottom-1 rounded-lg bg-white shadow-sm border border-gray-200 will-change-transform"
          style={{
            left: 0,
            width: pill.width,
            transform: `translateX(${pill.left}px)`,
            opacity: pill.width === 0 ? 0 : 1,
            transition: pill.ready
              ? "transform 320ms cubic-bezier(0.34, 1.1, 0.64, 1), width 280ms cubic-bezier(0.34, 1.1, 0.64, 1)"
              : "none",
          }}
        />
        {TABS.map((tab, i) => (
          <button
            key={tab.id}
            ref={(el) => { tabRefs.current[i] = el; }}
            onClick={() => handleTabChange(tab.id)}
            className={[
              "relative z-10 flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors duration-[200ms]",
              activeTab === tab.id ? "text-neutral-900" : "text-gray-500 hover:text-gray-800",
            ].join(" ")}
          >
            {tab.label}
            <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-400">
              {counts[tab.id]}
            </span>
          </button>
        ))}
      </div>

      {/* ── Grid ── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <p className="text-gray-400 text-[15px]">
            {activeTab === "pending" ? "No pending submissions — you're all caught up." :
             activeTab === "approved" ? "No approved submissions yet." : "No rejected submissions."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {filtered.map((sub, i) => (
            <div
              key={sub.id + activeTab}
              style={{
                animationName: "card-enter",
                animationDuration: "0.55s",
                animationTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                animationFillMode: "both",
                animationDelay: `${i * 90}ms`,
              }}
            >
              <SubmissionCard
                sub={sub}
                onApprove={() => updateStatus(sub.id, "approved")}
                onReject={() => updateStatus(sub.id, "rejected")}
                onViewDetails={() => setDrawerSub(sub)}
              />
            </div>
          ))}
        </div>
      )}

      {drawerSub && (
        <CreatorDrawer
          sub={drawerSub}
          onClose={() => setDrawerSub(null)}
          onApprove={() => updateStatus(drawerSub.id, "approved")}
          onReject={() => updateStatus(drawerSub.id, "rejected")}
        />
      )}

      </div>
    </div>
  );
}
