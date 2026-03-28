"use client";

import { useState } from "react";
import Link from "next/link";

// ── Data ──────────────────────────────────────────────────────────────────────

const NICHES = ["Lifestyle", "Tech", "Fashion", "Beauty", "Food", "Travel", "Fitness", "Gaming", "Finance", "Education"];
const AUDIENCE_SIZES = ["Under 1K", "1K–10K", "10K–50K", "50K–100K", "100K–500K", "500K+"];

const SOCIAL_PLATFORMS = [
  {
    key: "instagramUrl",
    label: "Instagram",
    placeholder: "https://instagram.com/yourhandle",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069Zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z"/>
      </svg>
    ),
  },
  {
    key: "tiktokUrl",
    label: "TikTok",
    placeholder: "https://tiktok.com/@yourhandle",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.3 6.3 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06Z"/>
      </svg>
    ),
  },
  {
    key: "youtubeUrl",
    label: "YouTube",
    placeholder: "https://youtube.com/@yourchannel",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z"/>
      </svg>
    ),
  },
  {
    key: "twitterUrl",
    label: "X / Twitter",
    placeholder: "https://x.com/yourhandle",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    key: "linkedinUrl",
    label: "LinkedIn",
    placeholder: "https://linkedin.com/in/yourhandle",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
] as const;

type SocialKey = typeof SOCIAL_PLATFORMS[number]["key"];

type Profile = {
  displayName: string;
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

const INITIAL: Profile = {
  displayName: "", bio: "", location: "", niches: [], audienceSize: "",
  services: [], instagramUrl: "", tiktokUrl: "", youtubeUrl: "", twitterUrl: "", linkedinUrl: "",
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
      <div className="flex items-center gap-4 px-6 pt-6 pb-6 bg-gradient-to-b from-[#A3FF38]/40 to-white">
        <div className="w-11 h-11 rounded-2xl bg-[#A3FF38] border border-[#82F200] flex items-center justify-center flex-shrink-0 shadow-[inset_3px_3px_6px_rgba(255,255,255,0.4)]">
          {icon}
        </div>
        <div>
          <h2 className="text-[16px] font-semibold text-neutral-900 leading-snug">{title}</h2>
          <p className="text-[13px] text-gray-400 leading-snug mt-0.5">{description}</p>
        </div>
      </div>
      <div className="px-6 pb-6 flex flex-col gap-5">
        {children}
      </div>
    </div>
  );
}

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

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>(INITIAL);
  const [serviceInput, setServiceInput] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function set(key: keyof Profile, value: string) {
    setProfile((p) => ({ ...p, [key]: value }));
  }

  function toggleNiche(n: string) {
    setProfile((p) => ({
      ...p,
      niches: p.niches.includes(n) ? p.niches.filter((x) => x !== n) : [...p.niches, n],
    }));
  }

  function addService() {
    const trimmed = serviceInput.trim();
    if (!trimmed || profile.services.includes(trimmed)) return;
    setProfile((p) => ({ ...p, services: [...p.services, trimmed] }));
    setServiceInput("");
  }

  function removeService(s: string) {
    setProfile((p) => ({ ...p, services: p.services.filter((x) => x !== s) }));
  }

  async function handleSave() {
    if (!profile.displayName.trim()) {
      setErrorMsg("Display name is required.");
      setStatus("error");
      return;
    }
    setStatus("saving");
    setErrorMsg("");
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Something went wrong");
      }
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2000);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong — please try again.");
      setStatus("error");
    }
  }

  return (
    <div className="p-10 max-w-2xl mx-auto pb-24">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-neutral-900">My Profile</h1>
          <p className="text-[15px] text-gray-400">This is what brands see when they review your application.</p>
        </div>
        <Link
          href="/influencers/aino-johansson?from=profile"
          className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.03)] text-[13px] font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors duration-[120ms]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-400">
            <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
            <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 0 1 0-1.186A10.004 10.004 0 0 1 10 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0 1 10 17c-4.257 0-7.893-2.66-9.336-6.41ZM14 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" clipRule="evenodd" />
          </svg>
          View public profile
        </Link>
      </div>

      <div className="flex flex-col gap-4">

        {/* ── About you ── */}
        <div style={{ animationName: "card-enter", animationDuration: "0.55s", animationTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)", animationFillMode: "both", animationDelay: "0ms" }}>
        <SectionCard
          title="About you"
          description="The basics brands use to identify who you are."
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-900">
              <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
            </svg>
          }
        >
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-2xl font-bold text-gray-300 flex-shrink-0">
              {profile.displayName ? profile.displayName[0].toUpperCase() : "?"}
            </div>
            <div className="flex flex-col gap-1">
              <button className="px-4 py-2 rounded-xl border border-gray-200 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.03)] text-[13px] font-medium text-gray-600 hover:bg-gray-50 transition-colors duration-[120ms] w-fit">
                Upload photo
              </button>
              <p className="text-[12px] text-gray-300">JPG or PNG, max 2MB</p>
            </div>
          </div>

          <Field label="Display name">
            <input
              type="text"
              value={profile.displayName}
              onChange={(e) => set("displayName", e.target.value)}
              placeholder="Your name or handle"
              className={inputClass}
            />
          </Field>

          <Field label="Bio">
            <textarea
              value={profile.bio}
              onChange={(e) => set("bio", e.target.value)}
              placeholder="Tell brands a bit about yourself and the content you make"
              rows={3}
              className={inputClass + " resize-none"}
            />
          </Field>

          <Field label="Location" hint="optional">
            <input
              type="text"
              value={profile.location}
              onChange={(e) => set("location", e.target.value)}
              placeholder="City, Country"
              className={inputClass}
            />
          </Field>
        </SectionCard>
        </div>

        {/* ── What you offer ── */}
        <div style={{ animationName: "card-enter", animationDuration: "0.55s", animationTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)", animationFillMode: "both", animationDelay: "90ms" }}>
        <SectionCard
          title="What you offer"
          description="List the types of content you create so brands know what to expect."
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-900">
              <path fillRule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036a2.63 2.63 0 0 0 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258a2.63 2.63 0 0 0-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.63 2.63 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.63 2.63 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5Z" clipRule="evenodd" />
            </svg>
          }
        >
          <Field label="Services" hint="press Enter to add">
            <div className="flex gap-2">
              <input
                type="text"
                value={serviceInput}
                onChange={(e) => setServiceInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addService())}
                placeholder="e.g. Instagram Reels, YouTube Reviews…"
                className={inputClass}
              />
              <button
                type="button"
                onClick={addService}
                className="px-4 py-3 rounded-xl bg-gray-900 text-white text-[13px] font-medium hover:opacity-90 transition-opacity flex-shrink-0"
              >
                Add
              </button>
            </div>
            {profile.services.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-1">
                {profile.services.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EDFFD0] text-[#3A7A00] text-[13px] font-medium"
                  >
                    {s}
                    <button
                      type="button"
                      onClick={() => removeService(s)}
                      className="text-[#3A7A00]/50 hover:text-[#3A7A00] leading-none transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </Field>
        </SectionCard>
        </div>

        {/* ── Niches & audience ── */}
        <div style={{ animationName: "card-enter", animationDuration: "0.55s", animationTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)", animationFillMode: "both", animationDelay: "180ms" }}>
        <SectionCard
          title="Niches & audience"
          description="Help brands find you when they're looking for the right fit."
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-900">
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
            </svg>
          }
        >
          <Field label="Your niches" hint="select all that apply">
            <div className="flex flex-wrap gap-2">
              {NICHES.map((n) => (
                <NicheChip
                  key={n}
                  label={n}
                  selected={profile.niches.includes(n)}
                  onClick={() => toggleNiche(n)}
                />
              ))}
            </div>
          </Field>

          <Field label="Audience size">
            <div className="flex flex-wrap gap-2">
              {AUDIENCE_SIZES.map((size) => (
                <Chip
                  key={size}
                  label={size}
                  selected={profile.audienceSize === size}
                  onClick={() => set("audienceSize", profile.audienceSize === size ? "" : size)}
                />
              ))}
            </div>
          </Field>
        </SectionCard>
        </div>

        {/* ── Social links ── */}
        <div style={{ animationName: "card-enter", animationDuration: "0.55s", animationTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)", animationFillMode: "both", animationDelay: "270ms" }}>
        <SectionCard
          title="Social links"
          description="Connect your platforms so brands can see your presence."
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-900">
              <path fillRule="evenodd" d="M15.75 4.5a3 3 0 1 1 .825 2.066l-8.421 4.679a3.002 3.002 0 0 1 0 1.51l8.421 4.679a3 3 0 1 1-.729 1.31l-8.421-4.678a3 3 0 1 1 0-4.132l8.421-4.679a3 3 0 0 1-.096-.755Z" clipRule="evenodd" />
            </svg>
          }
        >
          {SOCIAL_PLATFORMS.map(({ key, label, placeholder, icon }) => (
            <div key={key} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-500">
                {icon}
              </div>
              <input
                type="url"
                value={profile[key as SocialKey]}
                onChange={(e) => set(key as keyof Profile, e.target.value)}
                placeholder={placeholder}
                className={inputClass}
              />
            </div>
          ))}
        </SectionCard>
        </div>

        {/* ── Save ── */}
        <div className="flex flex-col gap-3 pt-2" style={{ animationName: "card-enter", animationDuration: "0.55s", animationTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)", animationFillMode: "both", animationDelay: "360ms" }}>
          <button
            onClick={handleSave}
            disabled={status === "saving"}
            className="w-full py-3.5 rounded-2xl bg-[#A3FF38] border border-[#82F200] shadow-[inset_3px_3px_6px_rgba(255,255,255,0.4)] text-gray-900 text-[15px] font-semibold hover:brightness-95 active:scale-[0.98] transition-all duration-[140ms] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "saving" ? "Saving…" : status === "saved" ? "Saved!" : "Save Profile"}
          </button>
          {status === "error" && (
            <p className="text-[13px] text-red-500 text-center">{errorMsg}</p>
          )}
        </div>

      </div>
    </div>
  );
}
