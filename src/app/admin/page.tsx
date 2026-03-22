"use client";

// This whole page runs in the browser so we can use state to track
// which submissions have been approved or rejected without a database.

import { useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

type Platform = "Instagram" | "TikTok" | "YouTube" | "X";

type Status = "pending" | "approved" | "rejected";

type Submission = {
  id: string;
  creator: string;
  handle: string;
  platform: Platform;
  postUrl: string;
  product: string;
  submittedAt: string; // ISO date string
  status: Status;
};

// ── Mock data ─────────────────────────────────────────────────────────────────
// Stand-in for what would eventually come from a database.

const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: "1",
    creator: "Jordan Lee",
    handle: "@jordanlee",
    platform: "Instagram",
    postUrl: "https://instagram.com/p/abc123",
    product: "Wireless Headphones",
    submittedAt: "2026-03-20T09:15:00Z",
    status: "pending",
  },
  {
    id: "2",
    creator: "Maya Chen",
    handle: "@mayachen",
    platform: "TikTok",
    postUrl: "https://tiktok.com/@mayachen/video/456",
    product: "Skincare Starter Kit",
    submittedAt: "2026-03-20T10:42:00Z",
    status: "pending",
  },
  {
    id: "3",
    creator: "Devin Park",
    handle: "@devinpark",
    platform: "YouTube",
    postUrl: "https://youtube.com/watch?v=xyz789",
    product: "Mechanical Keyboard",
    submittedAt: "2026-03-19T16:00:00Z",
    status: "pending",
  },
  {
    id: "4",
    creator: "Aisha Okafor",
    handle: "@aishaokafor",
    platform: "X",
    postUrl: "https://x.com/aishaokafor/status/111",
    product: "Protein Powder Bundle",
    submittedAt: "2026-03-19T11:30:00Z",
    status: "pending",
  },
  {
    id: "5",
    creator: "Lucas Mendes",
    handle: "@lucasmendes",
    platform: "Instagram",
    postUrl: "https://instagram.com/p/def456",
    product: "Yoga Mat",
    submittedAt: "2026-03-18T08:05:00Z",
    status: "approved",
  },
  {
    id: "6",
    creator: "Sara Kim",
    handle: "@sarakim",
    platform: "TikTok",
    postUrl: "https://tiktok.com/@sarakim/video/789",
    product: "LED Ring Light",
    submittedAt: "2026-03-17T14:20:00Z",
    status: "rejected",
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

// Formats an ISO date string into a readable short date like "Mar 20, 2026"
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Returns a pill colour based on platform
function platformColour(platform: Platform) {
  const map: Record<Platform, string> = {
    Instagram: "bg-pink-50 text-pink-700",
    TikTok:    "bg-gray-100 text-gray-700",
    YouTube:   "bg-red-50 text-red-700",
    X:         "bg-sky-50 text-sky-700",
  };
  return map[platform];
}

// ── Subcomponents ─────────────────────────────────────────────────────────────

// A single row in the submissions table
function SubmissionRow({
  sub,
  onApprove,
  onReject,
}: {
  sub: Submission;
  onApprove?: () => void;
  onReject?: () => void;
}) {
  return (
    <tr className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors duration-100">
      {/* Creator */}
      <td className="py-4 px-6">
        <div className="font-medium text-gray-900 text-[15px]">{sub.creator}</div>
        <div className="text-[13px] text-gray-400">{sub.handle}</div>
      </td>

      {/* Platform */}
      <td className="py-4 px-6">
        <span className={`inline-block px-2.5 py-1 rounded-full text-[12px] font-medium ${platformColour(sub.platform)}`}>
          {sub.platform}
        </span>
      </td>

      {/* Post URL — truncated so it doesn't overflow */}
      <td className="py-4 px-6 max-w-[200px]">
        <a
          href={sub.postUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[13px] text-blue-600 hover:underline truncate block"
        >
          {sub.postUrl}
        </a>
      </td>

      {/* Product */}
      <td className="py-4 px-6 text-[14px] text-gray-700">{sub.product}</td>

      {/* Date */}
      <td className="py-4 px-6 text-[13px] text-gray-400 whitespace-nowrap">
        {formatDate(sub.submittedAt)}
      </td>

      {/* Actions — only show for pending; otherwise show a status badge */}
      <td className="py-4 px-6">
        {sub.status === "pending" && onApprove && onReject ? (
          <div className="flex items-center gap-2">
            <button
              onClick={onApprove}
              className="px-3 py-1.5 rounded-lg text-[13px] font-medium bg-[#A3FF38] text-gray-900 hover:brightness-95 active:scale-[0.97] transition-all duration-[120ms]"
            >
              Approve
            </button>
            <button
              onClick={onReject}
              className="px-3 py-1.5 rounded-lg text-[13px] font-medium text-gray-500 hover:bg-gray-100 active:scale-[0.97] transition-all duration-[120ms]"
            >
              Reject
            </button>
          </div>
        ) : sub.status === "approved" ? (
          <span className="inline-block px-2.5 py-1 rounded-full text-[12px] font-medium bg-green-50 text-green-700">
            Approved
          </span>
        ) : (
          <span className="inline-block px-2.5 py-1 rounded-full text-[12px] font-medium bg-red-50 text-red-600">
            Rejected
          </span>
        )}
      </td>
    </tr>
  );
}

// An empty state shown when a tab has no submissions
function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-20 text-center text-gray-400 text-[15px]">{message}</div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

type Tab = "pending" | "approved" | "rejected";

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<Submission[]>(INITIAL_SUBMISSIONS);
  const [activeTab, setActiveTab] = useState<Tab>("pending");

  // Move a submission to a new status
  function updateStatus(id: string, status: Status) {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
  }

  const filtered = submissions.filter((s) => s.status === activeTab);

  const counts = {
    pending:  submissions.filter((s) => s.status === "pending").length,
    approved: submissions.filter((s) => s.status === "approved").length,
    rejected: submissions.filter((s) => s.status === "rejected").length,
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "pending",  label: "Pending"  },
    { id: "approved", label: "Approved" },
    { id: "rejected", label: "Rejected" },
  ];

  return (
    <div className="p-8 max-w-6xl">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="mb-8">
        <h1 className="text-[24px] font-semibold text-gray-900">Post Submissions</h1>
        <p className="text-[15px] text-gray-400 mt-1">
          Review posts from creators and approve or reject them.
        </p>
      </div>

      {/* ── Stat cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Pending review", value: counts.pending,  colour: "text-yellow-600" },
          { label: "Approved",       value: counts.approved, colour: "text-green-600"  },
          { label: "Rejected",       value: counts.rejected, colour: "text-red-500"    },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-gray-100 rounded-xl px-6 py-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
          >
            <div className={`text-[28px] font-semibold ${stat.colour}`}>{stat.value}</div>
            <div className="text-[13px] text-gray-400 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* ── Tab bar ─────────────────────────────────────────────────────── */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={[
              "px-4 py-2 rounded-md text-[14px] font-medium transition-all duration-[140ms]",
              activeTab === tab.id
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700",
            ].join(" ")}
          >
            {tab.label}
            <span className="ml-2 text-[12px] text-gray-400">{counts[tab.id]}</span>
          </button>
        ))}
      </div>

      {/* ── Table ───────────────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState
            message={
              activeTab === "pending"
                ? "No pending submissions — you're all caught up."
                : activeTab === "approved"
                ? "No approved submissions yet."
                : "No rejected submissions."
            }
          />
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {["Creator", "Platform", "Post URL", "Product", "Submitted", "Action"].map(
                  (heading) => (
                    <th
                      key={heading}
                      className="py-3 px-6 text-[12px] font-medium text-gray-400 uppercase tracking-wide"
                    >
                      {heading}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map((sub) => (
                <SubmissionRow
                  key={sub.id}
                  sub={sub}
                  onApprove={() => updateStatus(sub.id, "approved")}
                  onReject={() => updateStatus(sub.id, "rejected")}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}
