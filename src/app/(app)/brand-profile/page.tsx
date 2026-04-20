"use client";

import { useState } from "react";

type Profile = {
  brandName: string;
  bio: string;
  websiteUrl: string;
};

const INITIAL: Profile = {
  brandName: "Notion",
  bio: "Notion is the connected workspace where better, faster work happens. We're looking for creators who genuinely use productivity tools and can speak authentically to their audience about how Notion fits into their workflow.",
  websiteUrl: "https://notion.so",
};

const inputClass =
  "w-full px-4 py-3 rounded-xl border border-gray-200 text-[14px] text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-gray-400 transition-colors duration-[120ms] bg-white";

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

function SectionCard({ icon, title, description, children }: {
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
      <div className="px-6 pb-6 flex flex-col gap-5">{children}</div>
    </div>
  );
}

// ── Brand profile card (read view) ────────────────────────────────────────────

function BrandProfileCard({ profile, onEdit }: { profile: Profile; onEdit: () => void }) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white overflow-hidden">

      {/* Header */}
      <div className="bg-gradient-to-b from-[#A3FF38]/40 to-white px-8 pt-8 pb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#A3FF38]/30 border border-[#A3FF38]/40 flex items-center justify-center text-[24px] font-bold text-[#2A6000] flex-shrink-0">
              {profile.brandName ? profile.brandName[0].toUpperCase() : "?"}
            </div>
            <div>
              <h1 className="text-[20px] font-bold text-neutral-900 leading-tight">
                {profile.brandName || <span className="text-gray-300">Your brand name</span>}
              </h1>
              {profile.websiteUrl && (
                <a
                  href={profile.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[12px] text-gray-400 hover:text-gray-700 transition-colors duration-[120ms] mt-0.5 block"
                >
                  {profile.websiteUrl.replace(/^https?:\/\//, "")}
                </a>
              )}
            </div>
          </div>
          <button
            onClick={onEdit}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-gray-200 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.03)] text-[13px] font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors duration-[120ms] flex-shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-gray-400">
              <path d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z" />
              <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z" />
            </svg>
            Edit
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="px-8 pb-8 flex flex-col gap-5">
        {profile.bio && (
          <p className="text-[14px] text-gray-500 leading-relaxed">{profile.bio}</p>
        )}
      </div>

    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function BrandProfilePage() {
  const [profile, setProfile] = useState<Profile>(INITIAL);
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function set(key: keyof Profile, value: string) {
    setProfile((p) => ({ ...p, [key]: value }));
  }

  async function handleSave() {
    if (!profile.brandName.trim()) {
      setErrorMsg("Brand name is required.");
      setStatus("error");
      return;
    }
    setStatus("saving");
    setErrorMsg("");
    try {
      const res = await fetch("/api/brand-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Something went wrong");
      }
      setStatus("saved");
      setTimeout(() => { setStatus("idle"); setIsEditing(false); }, 1000);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong — please try again.");
      setStatus("error");
    }
  }

  return (
    <div className="min-h-full flex flex-col justify-center p-10 max-w-2xl mx-auto pb-24">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-neutral-900">Brand Profile</h1>
          <p className="text-[15px] text-gray-400">This is what creators see when browsing your listings.</p>
        </div>
        {isEditing && (
          <button
            onClick={() => { setIsEditing(false); setStatus("idle"); setErrorMsg(""); }}
            className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.03)] text-[13px] font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors duration-[120ms]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-400">
              <path fillRule="evenodd" d="M4.72 9.47a.75.75 0 0 0 0 1.06l4.25 4.25a.75.75 0 1 0 1.06-1.06L7.06 10.75h8.19a.75.75 0 0 0 0-1.5H7.06l2.97-2.97a.75.75 0 0 0-1.06-1.06L4.72 9.47Z" clipRule="evenodd" />
            </svg>
            Back to profile
          </button>
        )}
      </div>

      {!isEditing ? (
        <BrandProfileCard profile={profile} onEdit={() => setIsEditing(true)} />
      ) : (
        <div className="flex flex-col gap-4">

          {/* Identity */}
          <div style={{ animationName: "card-enter", animationDuration: "0.55s", animationTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)", animationFillMode: "both", animationDelay: "0ms" }}>
            <SectionCard
              title="Identity"
              description="Your brand name and logo as creators will see it."
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-900">
                  <path fillRule="evenodd" d="M4.5 7.5a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3v-9Z" clipRule="evenodd" />
                </svg>
              }
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#A3FF38]/30 border border-[#A3FF38]/40 flex items-center justify-center text-[24px] font-bold text-[#2A6000] flex-shrink-0">
                  {profile.brandName ? profile.brandName[0].toUpperCase() : "?"}
                </div>
                <div className="flex flex-col gap-1">
                  <button className="px-4 py-2 rounded-xl border border-gray-200 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.03)] text-[13px] font-medium text-gray-600 hover:bg-gray-50 transition-colors duration-[120ms] w-fit">
                    Upload logo
                  </button>
                  <p className="text-[12px] text-gray-300">PNG or SVG, max 2MB</p>
                </div>
              </div>
              <Field label="Brand name">
                <input type="text" value={profile.brandName} onChange={(e) => set("brandName", e.target.value)} placeholder="Your company or product name" className={inputClass} />
              </Field>
            </SectionCard>
          </div>

          {/* About */}
          <div style={{ animationName: "card-enter", animationDuration: "0.55s", animationTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)", animationFillMode: "both", animationDelay: "90ms" }}>
            <SectionCard
              title="About"
              description="Help creators understand what your product does and who you're looking for."
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-900">
                  <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97Z" clipRule="evenodd" />
                </svg>
              }
            >
              <Field label="Bio">
                <textarea value={profile.bio} onChange={(e) => set("bio", e.target.value)} placeholder="Describe your product and the kind of creators you're looking for" rows={4} className={inputClass + " resize-none"} />
              </Field>
              <Field label="Website" hint="optional">
                <input type="url" value={profile.websiteUrl} onChange={(e) => set("websiteUrl", e.target.value)} placeholder="https://yourproduct.com" className={inputClass} />
              </Field>
            </SectionCard>
          </div>

          {/* Save */}
          <div className="flex flex-col gap-3 pt-2" style={{ animationName: "card-enter", animationDuration: "0.55s", animationTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)", animationFillMode: "both", animationDelay: "180ms" }}>
            <button
              onClick={handleSave}
              disabled={status === "saving"}
              className="w-full py-3.5 rounded-2xl bg-[#A3FF38] border border-[#82F200] shadow-[inset_3px_3px_6px_rgba(255,255,255,0.4)] text-gray-900 text-[15px] font-semibold hover:brightness-95 active:scale-[0.98] transition-all duration-[140ms] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "saving" ? "Saving…" : status === "saved" ? "Saved!" : "Save Profile"}
            </button>
            {status === "error" && <p className="text-[13px] text-red-500 text-center">{errorMsg}</p>}
          </div>

        </div>
      )}

    </div>
  );
}
