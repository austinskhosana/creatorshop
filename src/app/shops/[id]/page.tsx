"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";

// ── Types ──────────────────────────────────────────────────────────────────────

type ShopStatus = "APPROVED" | "DELIVERED" | "COMPLETED" | "REVOKED";

type MockShop = {
  id: string;
  status: ShopStatus;
  softwareName: string;
  planName: string;
  months: number;
  brief: string;
  deliverables: string[];
  deadline: Date;
  deliveryLink?: string;
  accessKey?: string;
};

// ── Mock data ──────────────────────────────────────────────────────────────────

const now = new Date();

const MOCK_SHOPS: Record<string, MockShop> = {
  "1": {
    id: "1",
    status: "APPROVED",
    softwareName: "Notion",
    planName: "Plus",
    months: 3,
    brief:
      "Create authentic content showing how you use Notion to organise your creative work or daily life. Show your real workspace — not a staged demo. Key message: Notion helps creators stay organised without the complexity.",
    deliverables: ["1 Instagram Reel (60–90s)", "2 Instagram Stories"],
    deadline: new Date(now.getTime() + 9 * 24 * 60 * 60 * 1000),
    accessKey: "NOTION-XKCD-7291",
  },
  "2": {
    id: "2",
    status: "DELIVERED",
    softwareName: "Figma",
    planName: "Professional",
    months: 1,
    brief:
      "Show your design workflow inside Figma — a real project, not a fake one. Focus on collaboration features or components. The brand wants authentic creator content, not polished ads.",
    deliverables: ["1 TikTok Tutorial (90s+)", "1 Review Post", "3 Stories"],
    deadline: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000),
    deliveryLink: "https://tiktok.com/@yourhandle/video/12345",
  },
  "3": {
    id: "3",
    status: "COMPLETED",
    softwareName: "CapCut",
    planName: "Pro",
    months: 2,
    brief:
      "Create a short-form video using CapCut Pro's AI features. Show the before/after of your editing process. Mention at least one Pro-exclusive feature.",
    deliverables: ["2 Instagram Reels", "1 Review Post"],
    deadline: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    deliveryLink: "https://instagram.com/p/abc123",
  },
  "4": {
    id: "4",
    status: "REVOKED",
    softwareName: "Mailchimp",
    planName: "Standard",
    months: 3,
    brief:
      "Create content about how you use email marketing as a creator. Show your newsletter setup or a recent campaign result.",
    deliverables: ["1 Newsletter Feature", "2 Stories"],
    deadline: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
  },
};

// ── SectionCard ────────────────────────────────────────────────────────────────

function SectionCard({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white overflow-hidden">
      <div className="flex items-center gap-4 px-6 pt-6 pb-6 bg-gradient-to-b from-[#A3FF38]/40 to-white">
        <div className="w-11 h-11 rounded-2xl bg-[#A3FF38] border border-[#82F200] flex items-center justify-center flex-shrink-0 shadow-[inset_3px_3px_6px_rgba(255,255,255,0.4)]">
          {icon}
        </div>
        <div>
          <h2 className="text-[15px] font-semibold text-neutral-900 leading-snug">{title}</h2>
          {description && (
            <p className="text-[13px] text-gray-400 leading-snug mt-0.5">{description}</p>
          )}
        </div>
      </div>
      <div className="px-6 pb-6 flex flex-col gap-4">
        {children}
      </div>
    </div>
  );
}

// ── Access key display ─────────────────────────────────────────────────────────

function AccessKeyCard({ accessKey }: { accessKey: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(accessKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <SectionCard
      icon={
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-900">
          <path fillRule="evenodd" d="M15.75 1.5a6.75 6.75 0 0 0-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 0 0-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 0 0 .75-.75v-1.5h1.5A.75.75 0 0 0 9 19.5V18h1.5a.75.75 0 0 0 .53-.22l.5-.5c.19-.189.517-.288.907-.22A6.75 6.75 0 1 0 15.75 1.5Zm0 3a.75.75 0 0 0 0 1.5A2.25 2.25 0 0 1 18 8.25a.75.75 0 0 0 1.5 0 3.75 3.75 0 0 0-3.75-3.75Z" clipRule="evenodd" />
        </svg>
      }
      title="Access Key"
      description="Use this to activate your subscription."
    >
      <div className="flex items-center justify-between gap-3 bg-gray-50 rounded-2xl px-5 py-4">
        <span className="font-mono text-[18px] font-bold tracking-[0.15em] text-neutral-900 select-all">
          {accessKey}
        </span>
        <button
          onClick={handleCopy}
          className="flex-shrink-0 px-4 py-2 rounded-xl bg-neutral-900 text-white text-[13px] font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] hover:opacity-90 active:scale-[0.97] transition-all duration-[140ms]"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <p className="text-[12px] text-gray-400">
        Keep this safe — you'll need it to redeem your subscription.
      </p>
    </SectionCard>
  );
}

// ── Deadline timer ─────────────────────────────────────────────────────────────

function useCountdown(deadline: Date) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(deadline));

  function getTimeLeft(d: Date) {
    const diff = d.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    return {
      days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours:   Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
      expired: false,
    };
  }

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft(deadline)), 1000);
    return () => clearInterval(id);
  }, [deadline]);

  return timeLeft;
}

function DeadlineTimer({ deadline }: { deadline: Date }) {
  const { days, hours, minutes, seconds, expired } = useCountdown(deadline);

  const urgency =
    expired ? "red"
    : days < 1 ? "red"
    : days < 3 ? "amber"
    : "green";

  const colours = {
    green: { bg: "bg-[#EDFFD0]", text: "text-[#2A6000]", border: "border-[#A3FF38]", dot: "bg-[#A3FF38]" },
    amber: { bg: "bg-amber-50",  text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-400" },
    red:   { bg: "bg-red-50",    text: "text-red-600",   border: "border-red-200",   dot: "bg-red-400"   },
  }[urgency];

  if (expired) {
    return (
      <div className={`rounded-2xl border ${colours.border} ${colours.bg} px-5 py-4 flex items-center gap-3`}>
        <div className={`w-2 h-2 rounded-full ${colours.dot} flex-shrink-0`} />
        <p className={`text-[14px] font-semibold ${colours.text}`}>Deadline has passed</p>
      </div>
    );
  }

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className={`rounded-2xl border ${colours.border} ${colours.bg} px-5 py-4`}>
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-2 h-2 rounded-full ${colours.dot} flex-shrink-0`} />
        <p className={`text-[12px] font-semibold uppercase tracking-wider ${colours.text}`}>
          Time remaining
        </p>
      </div>
      <div className="flex items-end gap-3">
        {[
          { value: days,    label: "days"    },
          { value: hours,   label: "hours"   },
          { value: minutes, label: "min"     },
          { value: seconds, label: "sec"     },
        ].map(({ value, label }) => (
          <div key={label} className="flex flex-col items-center gap-0.5">
            <span className={`text-[28px] font-bold leading-none tabular-nums ${colours.text}`}>
              {label === "days" ? value : pad(value)}
            </span>
            <span className={`text-[11px] font-medium ${colours.text} opacity-60`}>{label}</span>
          </div>
        ))}
      </div>
      <p className={`text-[12px] mt-3 ${colours.text} opacity-70`}>
        Deliver by {deadline.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
      </p>
    </div>
  );
}

// ── Status states ──────────────────────────────────────────────────────────────

function DeliveredState({ deliveryLink }: { deliveryLink?: string }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl bg-blue-50 border border-blue-100 px-5 py-4 flex items-start gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5">
          <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z" clipRule="evenodd" />
        </svg>
        <div>
          <p className="text-[14px] font-semibold text-blue-700 mb-0.5">Submitted — waiting for review</p>
          <p className="text-[13px] text-blue-600/70">The brand is reviewing your content. You'll get an email once they confirm.</p>
        </div>
      </div>

      {deliveryLink && (
        <div className="rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4">
          <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Your submission</p>
          <a
            href={deliveryLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[14px] text-blue-500 hover:text-blue-700 transition-colors duration-[120ms] break-all"
          >
            {deliveryLink}
          </a>
        </div>
      )}
    </div>
  );
}

function CompletedState({ deliveryLink }: { deliveryLink?: string }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl bg-[#EDFFD0] border border-[#A3FF38] px-5 py-4 flex items-start gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-[#2A6000] flex-shrink-0 mt-0.5">
          <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
        </svg>
        <div>
          <p className="text-[14px] font-semibold text-[#2A6000] mb-0.5">Shop complete</p>
          <p className="text-[13px] text-[#3A7A00]/70">The brand confirmed your delivery. This shop is done.</p>
        </div>
      </div>

      {deliveryLink && (
        <div className="rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4">
          <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Delivered content</p>
          <a
            href={deliveryLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[14px] text-blue-500 hover:text-blue-700 transition-colors duration-[120ms] break-all"
          >
            {deliveryLink}
          </a>
        </div>
      )}
    </div>
  );
}

function RevokedState() {
  return (
    <div className="rounded-2xl bg-red-50 border border-red-100 px-5 py-4 flex items-start gap-3">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5">
        <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z" clipRule="evenodd" />
      </svg>
      <div>
        <p className="text-[14px] font-semibold text-red-600 mb-0.5">Shop revoked</p>
        <p className="text-[13px] text-red-500/70">
          The delivery deadline passed without a submission. The access key has been burned.
          You can apply to new listings now.
        </p>
      </div>
    </div>
  );
}

function DeliveryForm({ shopId }: { shopId: string }) {
  const [url, setUrl]   = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "submitted" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit() {
    if (!url.trim()) {
      setErrorMsg("Please enter the URL to your content.");
      setStatus("error");
      return;
    }
    try {
      new URL(url.trim());
    } catch {
      setErrorMsg("That doesn't look like a valid URL.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setErrorMsg("");

    // TODO: POST /api/shops/[id]/deliver
    await new Promise((r) => setTimeout(r, 900));
    setStatus("submitted");
  }

  if (status === "submitted") {
    return <DeliveredState deliveryLink={url} />;
  }

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-gray-200 text-[14px] text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-gray-400 transition-colors duration-[120ms] bg-white";

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-[13px] font-medium text-gray-600 mb-1.5">
          Link to your content
        </label>
        <input
          type="url"
          value={url}
          onChange={(e) => { setUrl(e.target.value); setStatus("idle"); }}
          placeholder="https://instagram.com/p/… or https://tiktok.com/@…"
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-[13px] font-medium text-gray-600 mb-1.5">
          Note <span className="text-gray-300 font-normal">— optional</span>
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Anything you want the brand to know about your post…"
          rows={3}
          className={inputClass + " resize-none"}
        />
      </div>

      {status === "error" && (
        <p className="text-[13px] text-red-500">{errorMsg}</p>
      )}

      <button
        onClick={handleSubmit}
        disabled={status === "submitting"}
        className="w-full py-3.5 rounded-2xl bg-[#A3FF38] border border-[#82F200] shadow-[inset_3px_3px_6px_rgba(255,255,255,0.4)] text-gray-900 text-[15px] font-semibold hover:brightness-95 active:scale-[0.98] transition-all duration-[140ms] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? "Submitting…" : "Submit Delivery"}
      </button>

      <p className="text-[12px] text-gray-400 text-center">
        Make sure your post is live and public before submitting.
      </p>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ShopDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const shop = MOCK_SHOPS[id] ?? MOCK_SHOPS["1"];

  const statusConfig = {
    APPROVED:  { label: "Approved",  className: "bg-[#EDFFD0] text-[#2A6000]"  },
    DELIVERED: { label: "Delivered", className: "bg-blue-50 text-blue-600"      },
    COMPLETED: { label: "Completed", className: "bg-[#EDFFD0] text-[#2A6000]"  },
    REVOKED:   { label: "Revoked",   className: "bg-red-50 text-red-500"        },
  };

  const { label, className } = statusConfig[shop.status];

  return (
    <div className="p-10 max-w-xl mx-auto pb-24">

      {/* ── Back ── */}
      <Link
        href="/shops"
        className="inline-flex items-center gap-2 text-[14px] text-gray-400 hover:text-gray-700 transition-colors duration-[120ms] mb-10"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
        </svg>
        My Shops
      </Link>

      {/* ── Software header ── */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-2xl font-bold text-gray-300 flex-shrink-0">
            {shop.softwareName[0]}
          </div>
          <div>
            <p className="text-[13px] text-gray-400 font-medium">{shop.planName} Plan · {shop.months} {shop.months === 1 ? "month" : "months"}</p>
            <h1 className="text-[22px] font-bold text-neutral-900 leading-tight">{shop.softwareName}</h1>
          </div>
        </div>
        <span className={`text-[12px] font-semibold px-3 py-1.5 rounded-full ${className}`}>
          {label}
        </span>
      </div>

      <div className="flex flex-col gap-5">

        {/* ── Deadline timer (only while active) ── */}
        {(shop.status === "APPROVED" || shop.status === "DELIVERED") && (
          <DeadlineTimer deadline={shop.deadline} />
        )}

        {/* ── Access key (APPROVED only) ── */}
        {shop.status === "APPROVED" && shop.accessKey && (
          <AccessKeyCard accessKey={shop.accessKey} />
        )}

        {/* ── Creator brief ── */}
        <SectionCard
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-900">
              <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97Z" clipRule="evenodd" />
            </svg>
          }
          title="Creator Brief"
          description="What the brand is asking for."
        >
          <p className="text-[14px] text-gray-600 leading-relaxed">{shop.brief}</p>

          {shop.deliverables.length > 0 && (
            <div className="flex flex-col gap-2 pt-3 border-t border-gray-100">
              <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider">What to deliver</p>
              {shop.deliverables.map((d) => (
                <div key={d} className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#A3FF38] flex-shrink-0" />
                  <span className="text-[13px] text-gray-600">{d}</span>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* ── Delivery section (APPROVED only) ── */}
        {shop.status === "APPROVED" && (
          <SectionCard
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-900">
                <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1-1.06 1.06l-3.22-3.22V16.5a.75.75 0 0 1-1.5 0V4.81L8.03 8.03a.75.75 0 0 1-1.06-1.06l4.5-4.5ZM3 15.75a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
              </svg>
            }
            title="Submit Your Delivery"
            description="Share your live post link once it's published."
          >
            <DeliveryForm shopId={shop.id} />
          </SectionCard>
        )}

        {/* ── State-aware status sections ── */}
        {shop.status === "DELIVERED" && <DeliveredState deliveryLink={shop.deliveryLink} />}
        {shop.status === "COMPLETED" && <CompletedState deliveryLink={shop.deliveryLink} />}
        {shop.status === "REVOKED"   && <RevokedState />}

      </div>
    </div>
  );
}
