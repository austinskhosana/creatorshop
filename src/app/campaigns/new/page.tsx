"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ── Data ──────────────────────────────────────────────────────────────────────

const PLATFORMS: { label: string; selected: string; icon: React.ReactNode }[] = [
  {
    label: "Instagram",
    selected: "bg-pink-50 border-pink-200 text-pink-600",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069Zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z"/>
      </svg>
    ),
  },
  {
    label: "TikTok",
    selected: "bg-gray-900 border-gray-900 text-white",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.3 6.3 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06Z"/>
      </svg>
    ),
  },
  {
    label: "YouTube",
    selected: "bg-red-50 border-red-200 text-red-600",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z"/>
      </svg>
    ),
  },
  {
    label: "X",
    selected: "bg-sky-50 border-sky-200 text-sky-600",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    selected: "bg-blue-50 border-blue-200 text-blue-700",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
];

const NICHES = ["Lifestyle", "Tech", "Fashion", "Beauty", "Food", "Travel", "Fitness", "Gaming", "Finance", "Education"];
const DELIVERABLES = ["Instagram Reel", "Instagram Post", "Instagram Story", "TikTok Video", "YouTube Video", "YouTube Short", "Tweet / Thread", "LinkedIn Post", "Blog Post"];
const AUDIENCE_SIZES = ["Under 1K", "1K–10K", "10K–50K", "50K–100K", "100K+"];

type Campaign = {
  name: string;
  description: string;
  brief: string;
  productName: string;
  planName: string;
  planValue: string;
  websiteUrl: string;
  accessKeys: string[];
  platforms: string[];
  niches: string[];
  deliverables: string[];
  minAudienceSize: string;
  slots: string;
  deliveryDays: string;
  autoAccept: boolean;
};

const INITIAL: Campaign = {
  name: "", description: "", brief: "",
  productName: "", planName: "", planValue: "", websiteUrl: "",
  accessKeys: [],
  platforms: [], niches: [], deliverables: [],
  minAudienceSize: "", slots: "", deliveryDays: "14", autoAccept: false,
};

// ── Primitives ─────────────────────────────────────────────────────────────────

const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 text-[14px] text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-gray-400 transition-colors duration-[120ms] bg-white";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline gap-2">
        <label className="text-[13px] font-medium text-gray-600">{label}</label>
        {hint && <span className="text-[12px] text-gray-400">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

// Each section is a self-contained card matching the platform's card shell
function SectionCard({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white overflow-hidden">
      {/* Green gradient header — same visual language as the onboarding cards */}
      <div className="flex items-center gap-4 px-6 pt-6 pb-6 bg-gradient-to-b from-[#A3FF38]/40 to-white">
        <div className="w-11 h-11 rounded-2xl bg-[#A3FF38] border border-[#82F200] flex items-center justify-center flex-shrink-0 shadow-[inset_3px_3px_6px_rgba(255,255,255,0.4)]">
          {icon}
        </div>
        <div>
          <h2 className="text-[16px] font-semibold text-neutral-900 leading-snug">{title}</h2>
          <p className="text-[13px] text-gray-400 leading-snug mt-0.5">{description}</p>
        </div>
      </div>
      {/* Body */}
      <div className="px-6 pb-6 flex flex-col gap-5">
        {children}
      </div>
    </div>
  );
}

// Platform chip — each platform has its own selected color
function PlatformChip({ platform, selected, onClick }: { platform: typeof PLATFORMS[number]; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-[13px] font-medium transition-all duration-[120ms] active:scale-[0.96]",
        selected ? platform.selected : "border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700",
      ].join(" ")}
    >
      {platform.icon}
      {platform.label}
    </button>
  );
}

// Niche chip — uses the green tag style from the influencer cards
function NicheChip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "px-4 py-2 rounded-xl border text-[13px] font-medium transition-all duration-[120ms] active:scale-[0.96]",
        selected
          ? "bg-[#EDFFD0] border-[#EDFFD0] text-[#3A7A00]"
          : "border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

// Generic dark chip — for deliverables, audience size, etc.
function Chip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "px-4 py-2 rounded-xl border text-[13px] font-medium transition-all duration-[120ms] active:scale-[0.96]",
        selected
          ? "bg-neutral-900 border-neutral-900 text-white"
          : "border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function NewCampaignPage() {
  const router = useRouter();
  const [campaign, setCampaign] = useState<Campaign>(INITIAL);
  const [keyInput, setKeyInput] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function addKey() {
    const trimmed = keyInput.trim();
    if (!trimmed || campaign.accessKeys.includes(trimmed)) return;
    setCampaign((c) => ({ ...c, accessKeys: [...c.accessKeys, trimmed] }));
    setKeyInput("");
  }

  function removeKey(key: string) {
    setCampaign((c) => ({ ...c, accessKeys: c.accessKeys.filter((k) => k !== key) }));
  }

  function set(key: keyof Campaign, value: string) {
    setCampaign((c) => ({ ...c, [key]: value }));
  }

  function toggle(key: "platforms" | "niches" | "deliverables", value: string) {
    setCampaign((c) => {
      const current = c[key] as string[];
      return { ...c, [key]: current.includes(value) ? current.filter((v) => v !== value) : [...current, value] };
    });
  }

  async function handleSave() {
    if (!campaign.productName.trim()) { setErrorMsg("Product name is required."); setStatus("error"); return; }
    if (!campaign.planName.trim())    { setErrorMsg("Plan name is required."); setStatus("error"); return; }
    if (!campaign.brief.trim())       { setErrorMsg("Creator brief is required."); setStatus("error"); return; }
    if (!campaign.accessKeys.length)  { setErrorMsg("Add at least one access key."); setStatus("error"); return; }
    setStatus("saving");
    setErrorMsg("");
    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(campaign),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      setStatus("saved");
      setTimeout(() => router.push("/campaigns/list"), 800);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  }

  return (
    <div className="p-10 max-w-2xl mx-auto pb-24">

      {/* ── Back ── */}
      <Link
        href="/campaigns"
        className="inline-flex items-center gap-2 text-[14px] text-gray-400 hover:text-gray-700 transition-colors duration-[120ms] mb-8"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
        </svg>
        Back
      </Link>

      {/* ── Header ── */}
      <div className="flex flex-col gap-1 mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Create a Campaign</h1>
        <p className="text-[15px] text-gray-400">Fill in the details below and start receiving creator applications.</p>
      </div>

      <div className="flex flex-col gap-4">

        {/* ── 1: Campaign overview ── */}
        <SectionCard
          title="Campaign overview"
          description="Give your campaign a name and describe what it's about."
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-900">
              <path d="M16.881 4.345A23.112 23.112 0 0 1 8.25 6H7.5a5.25 5.25 0 0 0-.88 10.427 21.593 21.593 0 0 0 1.378 3.94c.464 1.004 1.674 1.32 2.582.796l.657-.379c.88-.508 1.165-1.593.73-2.477a19.665 19.665 0 0 1-.748-2.37 23.148 23.148 0 0 1 5.33 1.43 22.795 22.795 0 0 0 .97-6.308c0-1.833-.277-3.553-.78-5.148a.5.5 0 0 0-.11-.166Z" />
              <path d="M20.08 4.14a23.09 23.09 0 0 1 1.17 6.705 23.085 23.085 0 0 1-1.17 6.704 23.046 23.046 0 0 0 2.63-6.704 23.046 23.046 0 0 0-2.63-6.705Z" />
            </svg>
          }
        >
          <Field label="Campaign name">
            <input
              type="text"
              value={campaign.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Spring Product Launch 2026"
              className={inputClass}
            />
          </Field>
          <Field label="Description" hint="optional">
            <textarea
              value={campaign.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="A short summary of the campaign goal for internal reference"
              rows={2}
              className={inputClass + " resize-none"}
            />
          </Field>
        </SectionCard>

        {/* ── 2: What you're offering ── */}
        <SectionCard
          title="What you're offering"
          description="The software plan creators will receive in exchange for their content."
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-900">
              <path d="M9.375 3a1.875 1.875 0 0 0 0 3.75h1.875v4.5H3.375A1.875 1.875 0 0 1 1.5 9.375v-.75c0-1.036.84-1.875 1.875-1.875h3.193A3.375 3.375 0 0 1 12 2.753a3.375 3.375 0 0 1 5.432 3.997h3.943c1.035 0 1.875.84 1.875 1.875v.75c0 1.036-.84 1.875-1.875 1.875H12.75v-4.5h1.875a1.875 1.875 0 1 0-1.875-1.875V6.75h-1.5V4.875C11.25 3.839 10.41 3 9.375 3ZM11.25 12.75H3v6.75a2.25 2.25 0 0 0 2.25 2.25h6v-9ZM12.75 21.75h6A2.25 2.25 0 0 0 21 19.5v-6.75h-8.25v9Z" />
            </svg>
          }
        >
          <Field label="Product name">
            <input
              type="text"
              value={campaign.productName}
              onChange={(e) => set("productName", e.target.value)}
              placeholder="e.g. Acme Analytics"
              className={inputClass}
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Plan name">
              <input
                type="text"
                value={campaign.planName}
                onChange={(e) => set("planName", e.target.value)}
                placeholder="e.g. Pro Plan"
                className={inputClass}
              />
            </Field>
            <Field label="Plan value" hint="$ / month">
              <input
                type="number"
                min="0"
                value={campaign.planValue}
                onChange={(e) => set("planValue", e.target.value)}
                placeholder="29"
                className={inputClass}
              />
            </Field>
          </div>
          <Field label="Product website" hint="optional">
            <input
              type="url"
              value={campaign.websiteUrl}
              onChange={(e) => set("websiteUrl", e.target.value)}
              placeholder="https://yourproduct.com"
              className={inputClass}
            />
          </Field>

          <Field label="Access keys" hint={campaign.accessKeys.length > 0 ? `${campaign.accessKeys.length} added` : "one per creator slot"}>
            <div className="flex gap-2">
              <input
                type="text"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addKey())}
                placeholder="Paste a key, invite link, or promo code"
                className={inputClass}
              />
              <button
                type="button"
                onClick={addKey}
                className="px-4 py-3 rounded-xl bg-gray-900 text-white text-[13px] font-medium hover:opacity-90 transition-opacity flex-shrink-0"
              >
                Add
              </button>
            </div>
            {campaign.accessKeys.length > 0 && (
              <div className="flex flex-col gap-1.5 mt-1">
                {campaign.accessKeys.map((key, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-100"
                  >
                    <span className="text-[13px] text-gray-700 font-mono truncate">{key}</span>
                    <button
                      type="button"
                      onClick={() => removeKey(key)}
                      className="text-gray-300 hover:text-gray-500 transition-colors flex-shrink-0 text-lg leading-none"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Field>
        </SectionCard>

        {/* ── 3: Creator requirements ── */}
        <SectionCard
          title="Creator requirements"
          description="Define who you're looking for and what they should create."
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-900">
              <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z" clipRule="evenodd" />
              <path d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z" />
            </svg>
          }
        >
          <Field label="Platforms">
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((p) => (
                <PlatformChip
                  key={p.label}
                  platform={p}
                  selected={campaign.platforms.includes(p.label)}
                  onClick={() => toggle("platforms", p.label)}
                />
              ))}
            </div>
          </Field>

          <Field label="Niches">
            <div className="flex flex-wrap gap-2">
              {NICHES.map((n) => (
                <NicheChip
                  key={n}
                  label={n}
                  selected={campaign.niches.includes(n)}
                  onClick={() => toggle("niches", n)}
                />
              ))}
            </div>
          </Field>

          <Field label="Deliverables" hint="what you want them to make">
            <div className="flex flex-wrap gap-2">
              {DELIVERABLES.map((d) => (
                <Chip
                  key={d}
                  label={d}
                  selected={campaign.deliverables.includes(d)}
                  onClick={() => toggle("deliverables", d)}
                />
              ))}
            </div>
          </Field>

          <Field label="Minimum audience size" hint="optional">
            <div className="flex flex-wrap gap-2">
              {AUDIENCE_SIZES.map((size) => (
                <Chip
                  key={size}
                  label={size}
                  selected={campaign.minAudienceSize === size}
                  onClick={() => set("minAudienceSize", campaign.minAudienceSize === size ? "" : size)}
                />
              ))}
            </div>
          </Field>
        </SectionCard>

        {/* ── 4: Creator brief ── */}
        <SectionCard
          title="Creator brief"
          description="This is shown to every creator who applies. Be specific about what you want."
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-900">
              <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75-6.75a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z" clipRule="evenodd" />
              <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
            </svg>
          }
        >
          <textarea
            value={campaign.brief}
            onChange={(e) => set("brief", e.target.value)}
            placeholder="Describe exactly what you want creators to make — tone, key messages, what to show, what to avoid…"
            rows={6}
            className={inputClass + " resize-none"}
          />
        </SectionCard>

        {/* ── 5: Campaign settings ── */}
        <SectionCard
          title="Campaign settings"
          description="Set the number of creator slots and how long they have to deliver."
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-900">
              <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.986.571.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" clipRule="evenodd" />
            </svg>
          }
        >
          <div className="grid grid-cols-2 gap-4">
            <Field label="Creator slots" hint="max applications to accept">
              <input
                type="number"
                min="1"
                value={campaign.slots}
                onChange={(e) => set("slots", e.target.value)}
                placeholder="10"
                className={inputClass}
              />
            </Field>
            <Field label="Delivery window" hint="days after approval">
              <input
                type="number"
                min="1"
                value={campaign.deliveryDays}
                onChange={(e) => set("deliveryDays", e.target.value)}
                placeholder="14"
                className={inputClass}
              />
            </Field>
          </div>

          <button
            type="button"
            onClick={() => setCampaign((c) => ({ ...c, autoAccept: !c.autoAccept }))}
            className={[
              "flex items-center justify-between w-full px-5 py-4 rounded-2xl border transition-all duration-[160ms] text-left",
              campaign.autoAccept
                ? "bg-[#EDFFD0] border-[#A3FF38]"
                : "bg-white border-gray-200 hover:border-gray-300",
            ].join(" ")}
          >
            <div className="flex flex-col gap-0.5">
              <span className={`text-[14px] font-semibold ${campaign.autoAccept ? "text-[#2A6000]" : "text-neutral-900"}`}>
                Auto-accept applications
              </span>
              <span className={`text-[13px] ${campaign.autoAccept ? "text-[#3A7A00]" : "text-gray-400"}`}>
                Anyone who applies is instantly approved and gets access
              </span>
            </div>
            {/* Toggle pill */}
            <div className={[
              "relative w-11 h-6 rounded-full flex-shrink-0 transition-colors duration-[160ms]",
              campaign.autoAccept ? "bg-[#A3FF38]" : "bg-gray-200",
            ].join(" ")}>
              <div className={[
                "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-[160ms]",
                campaign.autoAccept ? "translate-x-5" : "translate-x-0.5",
              ].join(" ")} />
            </div>
          </button>
        </SectionCard>

        {/* ── Submit ── */}
        <div className="flex flex-col gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={status === "saving"}
            className="w-full py-3.5 rounded-2xl bg-[#A3FF38] border border-[#82F200] shadow-[inset_3px_3px_6px_rgba(255,255,255,0.4)] text-gray-900 text-[15px] font-semibold hover:brightness-95 active:scale-[0.98] transition-all duration-[140ms] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "saving" ? "Creating campaign…" : status === "saved" ? "Campaign created!" : "Create Campaign"}
          </button>
          {status === "error" && (
            <p className="text-[13px] text-red-500 text-center">{errorMsg}</p>
          )}
        </div>

      </div>
    </div>
  );
}
