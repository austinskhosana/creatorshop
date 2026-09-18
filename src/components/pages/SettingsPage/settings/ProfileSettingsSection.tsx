"use client";

import {
  CheckIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  PencilIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import Button from "@/components/atoms/Button/Button";
import { TerminalgraphShader } from "@/components/atoms/TerminalgraphShader";
import { Switch } from "@/components/ui/switch";
import { CoverGallery, COVER_OPTIONS } from "./CoverGallery";
import { NicheMultiSelect } from "./NicheMultiSelect";

const detailOptions = [
  [CurrencyDollarIcon, "Total earned", "Show your verified earnings to brands"],
  [MapPinIcon, "Location", "Show your location on your public profile"],
  [UserCircleIcon, "Profile visibility", "Allow brands to discover and invite you"],
] as const;

export function ProfileSettingsSection() {
  const [saved, setSaved] = useState(false);
  const [coverPickerOpen, setCoverPickerOpen] = useState(false);
  const [selectedCoverId, setSelectedCoverId] = useState("shader");
  const [uploadedCoverUrl, setUploadedCoverUrl] = useState<string | null>(null);
  const [uploadedCoverName, setUploadedCoverName] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("Jordan Lee");
  const [username, setUsername] = useState("jordanlee");
  const [niches, setNiches] = useState<string[]>(["Design & creative tools"]);
  const [bio, setBio] = useState("Designing a calmer, more capable internet — one tool at a time.");
  const [profileDetails, setProfileDetails] = useState([true, true, true]);
  const coverPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!coverPickerOpen) return;

    function closeOnOutsidePress(event: PointerEvent) {
      if (!coverPickerRef.current?.contains(event.target as Node)) setCoverPickerOpen(false);
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setCoverPickerOpen(false);
    }

    document.addEventListener("pointerdown", closeOnOutsidePress);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePress);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [coverPickerOpen]);

  useEffect(() => () => {
    if (uploadedCoverUrl) URL.revokeObjectURL(uploadedCoverUrl);
  }, [uploadedCoverUrl]);

  function saveProfile() {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2400);
  }

  const initials = displayName.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "JL";
  const selectedCover = COVER_OPTIONS.find((option) => option.id === selectedCoverId) ?? COVER_OPTIONS[0];
  const selectedCoverStyle: CSSProperties = selectedCoverId === "upload" && uploadedCoverUrl
    ? { backgroundImage: `url(${uploadedCoverUrl})`, backgroundPosition: "center", backgroundSize: "cover" }
    : selectedCover.style ?? {};

  return (
    <section className="bg-white p-5 sm:p-7">
      <div ref={coverPickerRef} className="relative h-44 rounded-[20px] sm:h-56">
        <div className="absolute inset-0 overflow-hidden rounded-[20px] border border-neutral-200 bg-neutral-100">
          {selectedCoverId === "shader" ? (
            <TerminalgraphShader theme="light" background={{ dark: "#052e12", light: "#ffffff" }} className="absolute inset-0 size-full" />
          ) : (
            <>
              <div className="absolute inset-0 transition-[background] duration-300" style={selectedCoverStyle} />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/5 to-black/[0.03]" />
            </>
          )}
        </div>
        <button
          type="button"
          aria-expanded={coverPickerOpen}
          aria-controls="cover-gallery"
          onClick={() => setCoverPickerOpen((open) => !open)}
          className="absolute top-3 right-3 inline-flex min-h-10 items-center gap-2 rounded-xl border border-neutral-200 bg-white/90 px-3.5 text-xs font-semibold text-neutral-800 shadow-xs backdrop-blur-sm transition-[background-color,transform] duration-150 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 active:scale-[0.96]"
        >
          <PencilIcon className="size-3.5" /> Change cover
        </button>
        {coverPickerOpen ? (
          <CoverGallery
            selectedId={selectedCoverId}
            uploadedFileName={uploadedCoverName}
            onSelect={(id) => {
              setSelectedCoverId(id);
              setCoverPickerOpen(false);
            }}
            onUpload={(file) => {
              setUploadedCoverUrl(URL.createObjectURL(file));
              setUploadedCoverName(file.name);
              setSelectedCoverId("upload");
              setCoverPickerOpen(false);
            }}
            onClose={() => setCoverPickerOpen(false)}
          />
        ) : null}
      </div>

      <div className="relative z-10 -mt-12 ml-5 flex items-end sm:-mt-14 sm:ml-7">
        <div className="relative">
          <span className="grid size-24 place-items-center rounded-full border-4 border-white bg-neutral-800 text-2xl font-medium tracking-[-0.04em] text-white shadow-sm sm:size-28">{initials}</span>
          <button type="button" aria-label="Change profile image" className="absolute right-0 bottom-0 grid size-10 place-items-center rounded-full border-4 border-white bg-neutral-950 text-white transition-[background-color,transform] duration-150 hover:bg-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 active:scale-[0.96]"><PencilIcon className="size-4" /></button>
        </div>
      </div>

      <div className="mt-7 space-y-5">
        <label className="block text-[13px] font-medium text-neutral-700">Display name
          <input value={displayName} maxLength={100} onChange={(event) => setDisplayName(event.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-neutral-200 bg-white px-3.5 text-sm font-medium text-neutral-950 outline-none transition-colors focus:border-neutral-900" />
          <span className="mt-1.5 block text-right text-[11px] font-normal tabular-nums text-neutral-400">{displayName.length}/100</span>
        </label>
        <label className="block text-[13px] font-medium text-neutral-700">Username
          <div className="relative mt-2"><span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-sm text-neutral-400">@</span><input value={username} maxLength={42} onChange={(event) => setUsername(event.target.value.replace(/\s/g, ""))} className="min-h-11 w-full rounded-xl border border-neutral-200 bg-white pr-3.5 pl-8 text-sm font-medium text-neutral-950 outline-none transition-colors focus:border-neutral-900" /></div>
          <span className="mt-1.5 block text-right text-[11px] font-normal tabular-nums text-neutral-400">{username.length}/42</span>
        </label>
        <div>
          <p id="niche-label" className="text-[13px] font-medium text-neutral-700">Niches</p>
          <NicheMultiSelect value={niches} onChange={setNiches} />
          <p className="mt-1.5 text-[11px] font-normal text-neutral-400">Choose all the categories that describe your content.</p>
        </div>
        <label className="block text-[13px] font-medium text-neutral-700">Bio
          <textarea value={bio} maxLength={200} onChange={(event) => setBio(event.target.value)} rows={4} className="mt-2 w-full resize-none rounded-xl border border-neutral-200 bg-white px-3.5 py-3 text-sm leading-6 font-medium text-neutral-950 outline-none transition-colors focus:border-neutral-900" />
          <span className="mt-1.5 block text-right text-[11px] font-normal tabular-nums text-neutral-400">{bio.length}/200</span>
        </label>
      </div>

      <div className="mt-8 border-t border-neutral-200 pt-7">
        <h2 className="text-lg font-bold tracking-[-0.025em] text-neutral-950">More details</h2>
        <p className="mt-1 text-sm leading-6 text-neutral-500">Choose what appears on your public profile and discovery surfaces.</p>
        <div className="mt-5 divide-y divide-neutral-100">
          {detailOptions.map(([Icon, label, description], index) => (
            <div key={label} className="flex min-h-[4.75rem] items-center gap-3 py-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-neutral-100 text-neutral-700"><Icon className="size-[19px]" /></span>
              <div className="min-w-0 flex-1"><p className="text-sm font-semibold text-neutral-900">{label}</p><p className="mt-0.5 text-xs text-neutral-500">{description}</p></div>
              <Switch checked={profileDetails[index]} onCheckedChange={(checked) => setProfileDetails((current) => current.map((value, itemIndex) => itemIndex === index ? checked : value))} aria-label={`${label}: ${profileDetails[index] ? "visible" : "hidden"}`} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-7 flex items-center justify-between border-t border-neutral-100 pt-5">
        <p className="hidden text-xs text-neutral-400 sm:block">Changes appear on your creator profile.</p>
        <Button
          variant="dark"
          size="sm"
          onClick={saveProfile}
          className="ml-auto"
          style={{
            borderRadius: "8px",
            padding: "8px 14px",
            fontWeight: 500,
            letterSpacing: "normal",
            background: "linear-gradient(180deg, #323232 0%, #222222 100%)",
            boxShadow: [
              "inset 0 0.5px 1px rgba(255,255,255,0.15)",
              "inset 0 -1px 1.2px 0.35px rgba(18,18,18,1)",
              "0 2px 3px -1px rgba(13,13,13,0.5)",
              "0 0 0 1px rgba(51,51,51,1)",
            ].join(", "),
          }}
        >
          {saved ? <><CheckIcon className="size-4" /> Saved</> : "Save changes"}
        </Button>
      </div>
    </section>
  );
}
