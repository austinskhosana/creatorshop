"use client";

import { useState } from "react";

type Profile = {
  brandName: string;
  bio: string;
  websiteUrl: string;
};

const INITIAL: Profile = {
  brandName: "",
  bio: "",
  websiteUrl: "",
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

export default function BrandProfilePage() {
  const [profile, setProfile] = useState<Profile>(INITIAL);
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
      setTimeout(() => setStatus("idle"), 2000);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong — please try again.");
      setStatus("error");
    }
  }

  return (
    <div className="p-10 max-w-2xl mx-auto pb-24">

      {/* ── Header ── */}
      <div className="flex flex-col gap-1 mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Brand Profile</h1>
        <p className="text-[15px] text-gray-400">This is what creators see when browsing your listings.</p>
      </div>

      <div className="flex flex-col gap-4">

        {/* ── Identity ── */}
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
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-2xl font-bold text-gray-300 flex-shrink-0">
              {profile.brandName ? profile.brandName[0].toUpperCase() : "?"}
            </div>
            <div className="flex flex-col gap-1">
              <button className="px-4 py-2 rounded-xl border border-gray-200 text-[13px] font-medium text-gray-600 hover:bg-gray-50 transition-colors duration-[120ms] w-fit">
                Upload logo
              </button>
              <p className="text-[12px] text-gray-300">PNG or SVG, max 2MB</p>
            </div>
          </div>

          <Field label="Brand name">
            <input
              type="text"
              value={profile.brandName}
              onChange={(e) => set("brandName", e.target.value)}
              placeholder="Your company or product name"
              className={inputClass}
            />
          </Field>
        </SectionCard>

        {/* ── About ── */}
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
            <textarea
              value={profile.bio}
              onChange={(e) => set("bio", e.target.value)}
              placeholder="Describe your product and the kind of creators you're looking for"
              rows={4}
              className={inputClass + " resize-none"}
            />
          </Field>

          <Field label="Website" hint="optional">
            <input
              type="url"
              value={profile.websiteUrl}
              onChange={(e) => set("websiteUrl", e.target.value)}
              placeholder="https://yourproduct.com"
              className={inputClass}
            />
          </Field>
        </SectionCard>

        {/* ── Save ── */}
        <div className="flex flex-col gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={status === "saving"}
            className="w-full py-3.5 rounded-2xl bg-[#A3FF38] text-gray-900 text-[15px] font-semibold hover:brightness-95 active:scale-[0.98] transition-all duration-[140ms] disabled:opacity-50 disabled:cursor-not-allowed"
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
