"use client";

import { useState } from "react";

const SOCIAL_PLATFORMS = [
  { key: "instagramUrl", label: "Instagram", placeholder: "https://instagram.com/yourhandle" },
  { key: "tiktokUrl",    label: "TikTok",    placeholder: "https://tiktok.com/@yourhandle" },
  { key: "youtubeUrl",   label: "YouTube",   placeholder: "https://youtube.com/@yourchannel" },
  { key: "twitterUrl",   label: "X / Twitter", placeholder: "https://x.com/yourhandle" },
  { key: "linkedinUrl",  label: "LinkedIn",  placeholder: "https://linkedin.com/in/yourhandle" },
] as const;

const AUDIENCE_SIZES = ["Under 1K", "1K–10K", "10K–50K", "50K–100K", "100K–500K", "500K+"];

const NICHES = ["Lifestyle", "Tech", "Fashion", "Beauty", "Food", "Travel", "Fitness", "Gaming", "Finance", "Education", "Other"];

type SocialKey = typeof SOCIAL_PLATFORMS[number]["key"];

type Profile = {
  displayName: string;
  bio: string;
  location: string;
  niche: string;
  audienceSize: string;
  services: string[];
  instagramUrl: string;
  tiktokUrl: string;
  youtubeUrl: string;
  twitterUrl: string;
  linkedinUrl: string;
};

const INITIAL: Profile = {
  displayName:  "",
  bio:          "",
  location:     "",
  niche:        "",
  audienceSize: "",
  services:     [],
  instagramUrl: "",
  tiktokUrl:    "",
  youtubeUrl:   "",
  twitterUrl:   "",
  linkedinUrl:  "",
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-medium text-gray-600">{label}</label>
      {children}
    </div>
  );
}

const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 text-[14px] text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-gray-400 transition-colors duration-[120ms]";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>(INITIAL);
  const [serviceInput, setServiceInput] = useState("");
  const [saved, setSaved] = useState(false);

  function set(key: keyof Profile, value: string) {
    setProfile((p) => ({ ...p, [key]: value }));
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

  function handleSave() {
    // TODO: persist to DB
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="p-10 max-w-2xl mx-auto">

      {/* ── Header ── */}
      <div className="flex flex-col gap-1 mb-10">
        <h1 className="text-3xl font-bold text-neutral-900">My Profile</h1>
        <p className="text-[15px] text-gray-400">This is what brands see when they review your application.</p>
      </div>

      <div className="flex flex-col gap-7">

        {/* ── Avatar ── */}
        <Field label="Photo">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-2xl font-bold text-gray-300 flex-shrink-0">
              {profile.displayName ? profile.displayName[0].toUpperCase() : "?"}
            </div>
            <button className="px-4 py-2 rounded-xl border border-gray-200 text-[13px] font-medium text-gray-600 hover:bg-gray-50 transition-colors duration-[120ms]">
              Upload photo
            </button>
          </div>
        </Field>

        {/* ── Basic info ── */}
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

        <Field label="Location">
          <input
            type="text"
            value={profile.location}
            onChange={(e) => set("location", e.target.value)}
            placeholder="City, Country"
            className={inputClass}
          />
        </Field>

        <Field label="Niche">
          <select
            value={NICHES.slice(0, -1).includes(profile.niche as never) || profile.niche === "" ? profile.niche : "Other"}
            onChange={(e) => set("niche", e.target.value)}
            className={inputClass + " bg-white"}
          >
            <option value="">Select a niche</option>
            {NICHES.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          {(profile.niche === "Other" || (!NICHES.slice(0, -1).includes(profile.niche as never) && profile.niche !== "")) && (
            <input
              type="text"
              value={profile.niche === "Other" ? "" : profile.niche}
              placeholder="Describe your niche"
              className={inputClass}
              onChange={(e) => set("niche", e.target.value || "Other")}
            />
          )}
        </Field>

        <Field label="Audience size">
          <div className="flex flex-wrap gap-2">
            {AUDIENCE_SIZES.map((size) => (
              <button
                key={size}
                onClick={() => set("audienceSize", size)}
                className={[
                  "px-4 py-2 rounded-xl border text-[13px] font-medium transition-all duration-[120ms]",
                  profile.audienceSize === size
                    ? "bg-gray-900 border-gray-900 text-white"
                    : "border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700",
                ].join(" ")}
              >
                {size}
              </button>
            ))}
          </div>
        </Field>

        {/* ── Services ── */}
        <Field label="What you offer">
          <div className="flex gap-2">
            <input
              type="text"
              value={serviceInput}
              onChange={(e) => setServiceInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addService()}
              placeholder="e.g. Instagram Reels, YouTube Reviews…"
              className={inputClass}
            />
            <button
              onClick={addService}
              className="px-4 py-3 rounded-xl bg-gray-900 text-white text-[13px] font-medium hover:opacity-90 transition-opacity flex-shrink-0"
            >
              Add
            </button>
          </div>
          {profile.services.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {profile.services.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-[13px] text-gray-700"
                >
                  {s}
                  <button onClick={() => removeService(s)} className="text-gray-400 hover:text-gray-600 leading-none">×</button>
                </span>
              ))}
            </div>
          )}
        </Field>

        {/* ── Social links ── */}
        <div className="flex flex-col gap-4">
          <label className="text-[13px] font-medium text-gray-600">Social links</label>
          {SOCIAL_PLATFORMS.map(({ key, label, placeholder }) => (
            <div key={key} className="flex items-center gap-3">
              <span className="text-[13px] text-gray-400 w-24 flex-shrink-0">{label}</span>
              <input
                type="url"
                value={profile[key as SocialKey]}
                onChange={(e) => set(key as keyof Profile, e.target.value)}
                placeholder={placeholder}
                className={inputClass}
              />
            </div>
          ))}
        </div>

        {/* ── Save ── */}
        <div className="pt-2 pb-10">
          <button
            onClick={handleSave}
            className="px-8 py-3 rounded-xl bg-[#A3FF38] text-gray-900 text-[14px] font-semibold hover:brightness-95 active:scale-[0.98] transition-all duration-[140ms]"
          >
            {saved ? "Saved!" : "Save Profile"}
          </button>
        </div>

      </div>
    </div>
  );
}
