"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-medium text-gray-600">{label}</label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full px-4 py-3 rounded-xl border border-gray-200 text-[14px] text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-gray-400 transition-colors duration-[120ms]";

export default function BrandProfilePage() {
  const router = useRouter();
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
      setTimeout(() => router.push("/campaigns"), 800);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong — please try again.");
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16 bg-white">
      <div className="w-full max-w-lg">

        {/* ── Header ── */}
        <div className="flex flex-col gap-1 mb-10">
          <p className="text-xs font-medium tracking-widest uppercase text-neutral-400 mb-1">
            One last step
          </p>
          <h1 className="text-3xl font-bold text-neutral-900">Set up your brand</h1>
          <p className="text-[15px] text-gray-400">
            Creators will see this when browsing your listings.
          </p>
        </div>

        <div className="flex flex-col gap-7">

          {/* ── Logo placeholder ── */}
          <Field label="Logo">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-2xl font-bold text-gray-300 flex-shrink-0">
                {profile.brandName ? profile.brandName[0].toUpperCase() : "?"}
              </div>
              <button className="px-4 py-2 rounded-xl border border-gray-200 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.03)] text-[13px] font-medium text-gray-600 hover:bg-gray-50 transition-colors duration-[120ms]">
                Upload logo
              </button>
            </div>
          </Field>

          {/* ── Brand name ── */}
          <Field label="Brand name">
            <input
              type="text"
              value={profile.brandName}
              onChange={(e) => set("brandName", e.target.value)}
              placeholder="Your company or product name"
              className={inputClass}
            />
          </Field>

          {/* ── Bio ── */}
          <Field label="About">
            <textarea
              value={profile.bio}
              onChange={(e) => set("bio", e.target.value)}
              placeholder="Describe your product and the kind of creators you're looking for"
              rows={4}
              className={inputClass + " resize-none"}
            />
          </Field>

          {/* ── Website ── */}
          <Field label="Website">
            <input
              type="url"
              value={profile.websiteUrl}
              onChange={(e) => set("websiteUrl", e.target.value)}
              placeholder="https://yourproduct.com"
              className={inputClass}
            />
          </Field>

          {/* ── Save ── */}
          <div className="pt-2 pb-10 flex flex-col gap-3">
            <button
              onClick={handleSave}
              disabled={status === "saving"}
              className="w-full py-3 rounded-xl bg-neutral-900 text-white text-[14px] font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] hover:opacity-90 active:scale-[0.98] transition-all duration-[140ms] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "saving"
                ? "Saving…"
                : status === "saved"
                ? "Done!"
                : "Save and continue"}
            </button>
            {status === "error" && (
              <p className="text-[13px] text-red-500">{errorMsg}</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
