"use client";

import {
  ArrowUpTrayIcon,
  BellAlertIcon,
  ChatBubbleLeftRightIcon,
  CheckIcon,
  ChevronUpDownIcon,
  ClockIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  KeyIcon,
  LinkIcon,
  LockClosedIcon,
  MapPinIcon,
  PencilIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  StarIcon,
  TrashIcon,
  UserCircleIcon,
  CurrencyDollarIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useCallback, useEffect, useRef, useState, type ComponentType, type CSSProperties } from "react";
import Button from "@/components/atoms/Button/Button";
import { CreatorShell } from "@/components/templates/CreatorShell";
import { Switch } from "@/components/ui/switch";

const preferenceCopy = [
  [ShoppingBagIcon, "Shop updates", "Approvals, declines, and access unlocks"],
  [ChatBubbleLeftRightIcon, "Messages", "A creator or brand writes in your thread"],
  [ClockIcon, "Deadline nudges", "Three days, one day, and on the delivery day"],
  [StarIcon, "Ratings & receipts", "Completed-shop records and rating prompts"],
] as const;

const NICHE_OPTIONS = [
  "Design & creative tools",
  "Tech & software",
  "Business & finance",
  "Beauty & lifestyle",
  "Fashion & style",
  "Fitness & wellness",
  "Food & drink",
  "Gaming",
  "Travel",
  "Education",
] as const;

type Section = "profile" | "notifications" | "account";

type CoverOption = {
  id: string;
  name: string;
  group: "Color & gradient" | "Textures";
  style: CSSProperties;
};

const COVER_OPTIONS: CoverOption[] = [
  { id: "lime-haze", name: "Lime haze", group: "Color & gradient", style: { background: "radial-gradient(circle at 18% 20%, #c8ff7a 0%, rgba(200,255,122,.44) 27%, transparent 48%), radial-gradient(circle at 82% 78%, #fff 0%, rgba(255,255,255,.92) 25%, transparent 52%), #f5f5f2" } },
  { id: "papaya", name: "Papaya", group: "Color & gradient", style: { background: "#f26b55" } },
  { id: "butter", name: "Butter", group: "Color & gradient", style: { background: "#f8bf4d" } },
  { id: "pool", name: "Pool", group: "Color & gradient", style: { background: "#269bc3" } },
  { id: "mineral", name: "Mineral", group: "Color & gradient", style: { background: "linear-gradient(135deg, #50b9bd 0%, #aad9d1 52%, #b8967d 100%)" } },
  { id: "punch", name: "Punch", group: "Color & gradient", style: { background: "#f22f86" } },
  { id: "ember", name: "Ember", group: "Color & gradient", style: { background: "linear-gradient(135deg, #d75c42 0%, #f02b16 68%, #ff9f58 100%)" } },
  { id: "porcelain", name: "Porcelain", group: "Color & gradient", style: { background: "linear-gradient(125deg, #eaf8fb 0%, #eebaae 48%, #faf2e7 74%, #8dd4d4 100%)" } },
  { id: "afterglow", name: "Afterglow", group: "Textures", style: { background: "linear-gradient(145deg, #246993 0%, #e5a0be 43%, #29484c 67%, #ff3a1d 100%)" } },
  { id: "berry-film", name: "Berry film", group: "Textures", style: { background: "linear-gradient(180deg, #394c9e 0%, #8f397d 47%, #d42e61 100%)" } },
  { id: "storm-glass", name: "Storm glass", group: "Textures", style: { background: "radial-gradient(circle at 78% 23%, rgba(255,196,160,.8), transparent 32%), linear-gradient(135deg, #243c52, #82afbd 55%, #d9cec0)" } },
  { id: "graphite", name: "Graphite", group: "Textures", style: { background: "repeating-linear-gradient(115deg, rgba(255,255,255,.06) 0 1px, transparent 1px 6px), linear-gradient(140deg, #161918, #555b53)" } },
  { id: "linen", name: "Linen", group: "Textures", style: { background: "repeating-linear-gradient(0deg, rgba(76,61,48,.12) 0 1px, transparent 1px 4px), repeating-linear-gradient(90deg, rgba(76,61,48,.09) 0 1px, transparent 1px 5px), #c4b39f" } },
  { id: "moss", name: "Moss", group: "Textures", style: { background: "radial-gradient(circle at 20% 30%, rgba(232,229,179,.42) 0 1px, transparent 2px), radial-gradient(circle at 70% 60%, rgba(13,57,42,.35) 0 1px, transparent 2px), linear-gradient(135deg, #6e7c68, #b5b790)" } },
  { id: "newsprint", name: "Newsprint", group: "Textures", style: { background: "radial-gradient(circle, rgba(27,25,23,.23) 0 1px, transparent 1.5px) 0 0/5px 5px, #d7d0c6" } },
  { id: "midnight", name: "Midnight", group: "Textures", style: { background: "radial-gradient(circle at 32% 20%, rgba(140,170,184,.3), transparent 35%), repeating-linear-gradient(135deg, rgba(255,255,255,.035) 0 1px, transparent 1px 5px), #263642" } },
];

function CoverGallery({ selectedId, uploadedFileName, onSelect, onUpload, onClose }: { selectedId: string; uploadedFileName: string | null; onSelect: (id: string) => void; onUpload: (file: File) => void; onClose: () => void }) {
  const groups = ["Color & gradient", "Textures"] as const;
  const [mode, setMode] = useState<"gallery" | "upload">(selectedId === "upload" ? "upload" : "gallery");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File | undefined) => {
    setUploadError(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setUploadError("Choose a PNG, JPG, WebP, GIF, or other image file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("That image is over 10 MB. Choose a smaller file.");
      return;
    }
    onUpload(file);
  }, [onUpload]);

  useEffect(() => {
    if (mode !== "upload") return;

    function handlePaste(event: ClipboardEvent) {
      const image = Array.from(event.clipboardData?.files ?? []).find((file) => file.type.startsWith("image/"));
      if (image) {
        event.preventDefault();
        handleFile(image);
      }
    }

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [handleFile, mode]);

  return (
    <div id="cover-gallery" role="dialog" aria-label="Choose a profile cover" className="absolute top-14 right-3 left-3 z-30 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_18px_50px_rgba(0,0,0,0.14)] sm:left-auto sm:w-[31rem]">
      <div className="flex h-12 items-center justify-between border-b border-neutral-100 px-4">
        <div className="flex h-full items-center gap-5">
          <button type="button" onClick={() => { setMode("gallery"); setUploadError(null); }} className={`flex h-full items-center border-b-2 text-sm transition-colors focus-visible:outline-none ${mode === "gallery" ? "border-neutral-950 font-semibold text-neutral-950" : "border-transparent font-medium text-neutral-500 hover:text-neutral-900"}`}>Gallery</button>
          <button type="button" onClick={() => { setMode("upload"); setUploadError(null); }} className={`flex h-full items-center border-b-2 text-sm transition-colors focus-visible:outline-none ${mode === "upload" ? "border-neutral-950 font-semibold text-neutral-950" : "border-transparent font-medium text-neutral-500 hover:text-neutral-900"}`}>Upload</button>
        </div>
        <button type="button" onClick={onClose} aria-label="Close cover gallery" className="grid size-8 place-items-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900">
          <XMarkIcon className="size-4" />
        </button>
      </div>

      {mode === "gallery" ? (
        <div className="max-h-[25rem] space-y-5 overflow-y-auto p-4">
          {groups.map((group) => (
            <fieldset key={group}>
              <legend className="mb-2.5 text-[11px] font-medium text-neutral-500">{group}</legend>
              <div className="grid grid-cols-4 gap-1.5" role="radiogroup" aria-label={group}>
                {COVER_OPTIONS.filter((option) => option.group === group).map((option) => {
                  const selected = option.id === selectedId;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      aria-label={option.name}
                      title={option.name}
                      onClick={() => onSelect(option.id)}
                      className={`relative h-[4.15rem] overflow-hidden rounded-lg outline-none transition-[transform,box-shadow] duration-150 hover:scale-[1.025] focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 ${selected ? "ring-2 ring-neutral-950 ring-offset-2" : "ring-1 ring-black/5"}`}
                      style={option.style}
                    >
                      {selected ? <span className="absolute right-2 bottom-2 grid size-5 place-items-center rounded-full bg-neutral-950 text-white shadow-sm"><CheckIcon className="size-3.5 stroke-[2.5]" /></span> : null}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ))}
        </div>
      ) : (
        <div className="p-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(event) => {
              handleFile(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 text-sm font-semibold text-neutral-800 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-[background-color,border-color,transform] hover:border-neutral-300 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 active:scale-[0.99]"
          >
            <ArrowUpTrayIcon className="size-4" />
            Upload file
          </button>
          <div className="py-4 text-center">
            {uploadedFileName ? <p className="truncate text-xs font-medium text-neutral-700">Current: {uploadedFileName}</p> : <p className="text-xs text-neutral-400">or press <kbd className="rounded border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 font-sans text-[10px] text-neutral-500">⌘V</kbd> to paste an image</p>}
            <p className="mt-2 text-[11px] text-neutral-400">Wide images at least 1500 pixels across work best · 10 MB max</p>
            {uploadError ? <p role="alert" className="mt-2 text-xs font-medium text-red-600">{uploadError}</p> : null}
          </div>
        </div>
      )}
    </div>
  );
}

function SettingsNav({ active, onChange }: { active: Section; onChange: (section: Section) => void }) {
  const links: [Section, string, ComponentType<{ className?: string }>][] = [
    ["profile", "Profile", UserCircleIcon],
    ["notifications", "Notifications", BellAlertIcon],
    ["account", "Account & security", ShieldCheckIcon],
  ];

  return (
    <aside className="lg:sticky lg:top-8 lg:self-start lg:pt-7">
      <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
        {links.map(([id, label, Icon]) => (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`group relative flex min-h-10 shrink-0 items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-medium transition-[background-color,color,transform] duration-150 active:scale-[0.96] lg:w-full ${active === id ? "bg-neutral-100 text-neutral-950" : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-950"}`}
          >
            <Icon className="size-[18px]" />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}

function SectionTitle({ title, description }: { title: string; description: string }) {
  return <header><h2 className="text-2xl font-bold tracking-[-0.035em] text-neutral-950">{title}</h2><p className="mt-1.5 max-w-xl text-sm leading-6 text-neutral-500">{description}</p></header>;
}

function SettingRow({ icon: Icon, label, value, actionLabel, onClick }: { icon: ComponentType<{ className?: string }>; label: string; value?: string; actionLabel?: string; onClick?: () => void }) {
  return <div className="flex min-h-[4.5rem] w-full items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-neutral-100 text-neutral-700"><Icon className="size-[19px]" /></span>
    <span className="min-w-0 flex-1">
      <span className="block truncate text-sm font-semibold text-neutral-900">{label}</span>
      {value ? <span className="mt-0.5 block truncate text-xs text-neutral-500">{value}</span> : null}
    </span>
    {actionLabel && onClick ? <button type="button" aria-label={`${actionLabel} ${label.toLowerCase()}`} onClick={onClick} className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white px-3.5 text-xs font-semibold text-neutral-800 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-[background-color,transform] duration-150 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 active:scale-[0.96]">{actionLabel}</button> : null}
  </div>;
}

function ModalSecondaryAction({ children, onClick }: { children: string; onClick: () => void }) {
  return <button type="button" onClick={onClick} className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white px-3.5 text-xs font-semibold text-neutral-800 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-[background-color,border-color,transform] duration-150 hover:border-neutral-300 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 active:scale-[0.96]">{children}</button>;
}

export default function SettingsPage() {
  const [section, setSection] = useState<Section>("profile");
  const [saved, setSaved] = useState(false);
  const [coverPickerOpen, setCoverPickerOpen] = useState(false);
  const [selectedCoverId, setSelectedCoverId] = useState("lime-haze");
  const [uploadedCoverUrl, setUploadedCoverUrl] = useState<string | null>(null);
  const [uploadedCoverName, setUploadedCoverName] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("Jordan Lee");
  const [username, setUsername] = useState("jordanlee");
  const [niche, setNiche] = useState("Design & creative tools");
  const [bio, setBio] = useState("Designing a calmer, more capable internet — one tool at a time.");
  const [profileDetails, setProfileDetails] = useState([true, true, true]);
  const [preferences, setPreferences] = useState([true, true, true, false]);
  const [emailMode, setEmailMode] = useState(false);
  const [emailRequested, setEmailRequested] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [deleteMode, setDeleteMode] = useState(false);
  const [deleteText, setDeleteText] = useState("");
  const [passkeyAdded, setPasskeyAdded] = useState(false);
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

  useEffect(() => {
    return () => {
      if (uploadedCoverUrl) URL.revokeObjectURL(uploadedCoverUrl);
    };
  }, [uploadedCoverUrl]);

  function saveProfile() { setSaved(true); window.setTimeout(() => setSaved(false), 2400); }
  function closePasswordModal() {
    setPasswordMode(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }
  const initials = displayName.split(" ").filter(Boolean).slice(0, 2).map(part => part[0]).join("").toUpperCase() || "JL";
  const selectedCover = COVER_OPTIONS.find((option) => option.id === selectedCoverId) ?? COVER_OPTIONS[0];
  const selectedCoverStyle: CSSProperties = selectedCoverId === "upload" && uploadedCoverUrl
    ? { backgroundImage: `url(${uploadedCoverUrl})`, backgroundPosition: "center", backgroundSize: "cover" }
    : selectedCover.style;
  const passwordIsValid = currentPassword.length > 0 && newPassword.length >= 8 && newPassword === confirmPassword;

  return <CreatorShell><div className="min-h-[calc(100vh-5rem)] bg-white px-5 py-8 sm:px-8 sm:py-12">
    <div className="mx-auto max-w-6xl">
      <header>
        <h1 className="text-4xl font-bold tracking-tight text-neutral-950">Settings</h1>
        <p className="mt-2 text-sm text-neutral-500">Manage your profile, preferences, and account security.</p>
      </header>

      <div className="mt-7 grid gap-7 lg:grid-cols-[15.5rem_minmax(0,1fr)]">
        <SettingsNav active={section} onChange={setSection} />
        <main className="min-w-0">
          {section === "profile" ? <section className="bg-white p-5 sm:p-7">
            <div ref={coverPickerRef} className="relative h-44 rounded-[20px] sm:h-56">
              <div className="absolute inset-0 overflow-hidden rounded-[20px] bg-neutral-100">
                <div className="absolute inset-0 transition-[background] duration-300" style={selectedCoverStyle} />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/5 to-black/[0.03]" />
              </div>
              <button
                type="button"
                aria-expanded={coverPickerOpen}
                aria-controls="cover-gallery"
                onClick={() => setCoverPickerOpen((open) => !open)}
                className="absolute top-3 right-3 inline-flex min-h-10 items-center gap-2 rounded-xl border border-neutral-200 bg-white/90 px-3.5 text-xs font-semibold text-neutral-800 shadow-sm backdrop-blur-sm transition-[background-color,transform] duration-150 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 active:scale-[0.96]"
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
                <button aria-label="Change profile image" className="absolute bottom-0 right-0 grid size-10 place-items-center rounded-full border-4 border-white bg-neutral-950 text-white transition-[background-color,transform] duration-150 hover:bg-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 active:scale-[0.96]"><PencilIcon className="size-4" /></button>
              </div>
            </div>

            <div className="mt-7 space-y-5">
              <label className="block text-xs font-semibold text-neutral-700">Display name
                <input value={displayName} maxLength={100} onChange={event => setDisplayName(event.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-neutral-200 bg-white px-3.5 text-sm font-medium text-neutral-950 outline-none transition-colors focus:border-neutral-900" />
                <span className="mt-1.5 block text-right text-[11px] font-normal tabular-nums text-neutral-400">{displayName.length}/100</span>
              </label>
              <label className="block text-xs font-semibold text-neutral-700">Username
                <div className="relative mt-2"><span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-sm text-neutral-400">@</span><input value={username} maxLength={42} onChange={event => setUsername(event.target.value.replace(/\s/g, ""))} className="min-h-11 w-full rounded-xl border border-neutral-200 bg-white pl-8 pr-3.5 text-sm font-medium text-neutral-950 outline-none transition-colors focus:border-neutral-900" /></div>
                <span className="mt-1.5 block text-right text-[11px] font-normal tabular-nums text-neutral-400">{username.length}/42</span>
              </label>
              <label className="block text-xs font-semibold text-neutral-700">Niche
                <span className="relative mt-2 block">
                  <select
                    value={niche}
                    onChange={(event) => setNiche(event.target.value)}
                    className="min-h-11 w-full appearance-none rounded-xl border border-neutral-200 bg-white px-3.5 pr-11 text-sm font-medium text-neutral-950 outline-none transition-[border-color,box-shadow] hover:border-neutral-300 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
                  >
                    {NICHE_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                  <ChevronUpDownIcon aria-hidden="true" className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-neutral-400" />
                </span>
                <span className="mt-1.5 block text-[11px] font-normal text-neutral-400">Choose the category that best describes your content.</span>
              </label>
              <label className="block text-xs font-semibold text-neutral-700">Bio
                <textarea value={bio} maxLength={200} onChange={event => setBio(event.target.value)} rows={4} className="mt-2 w-full resize-none rounded-xl border border-neutral-200 bg-white px-3.5 py-3 text-sm font-medium leading-6 text-neutral-950 outline-none transition-colors focus:border-neutral-900" />
                <span className="mt-1.5 block text-right text-[11px] font-normal tabular-nums text-neutral-400">{bio.length}/200</span>
              </label>
            </div>

            <div className="mt-8 border-t border-neutral-200 pt-7">
              <h2 className="text-lg font-bold tracking-[-0.025em] text-neutral-950">More details</h2>
              <p className="mt-1 text-sm leading-6 text-neutral-500">Choose what appears on your public profile and discovery surfaces.</p>
              <div className="mt-5 divide-y divide-neutral-100">
                {[
                  [CurrencyDollarIcon, "Total earned", "Show your verified earnings to brands"],
                  [MapPinIcon, "Location", "Show your location on your public profile"],
                  [UserCircleIcon, "Profile visibility", "Allow brands to discover and invite you"],
                ].map(([Icon, label, description], index) => <div key={label as string} className="flex min-h-[4.75rem] items-center gap-3 py-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-neutral-100 text-neutral-700"><Icon className="size-[19px]" /></span><div className="min-w-0 flex-1"><p className="text-sm font-semibold text-neutral-900">{label as string}</p><p className="mt-0.5 text-xs text-neutral-500">{description as string}</p></div><Switch checked={profileDetails[index]} onCheckedChange={(checked) => setProfileDetails(current => current.map((value, i) => i === index ? checked : value))} aria-label={`${label as string}: ${profileDetails[index] ? "visible" : "hidden"}`} /></div>)}
              </div>
            </div>

            <div className="mt-7 flex items-center justify-between border-t border-neutral-100 pt-5"><p className="hidden text-xs text-neutral-400 sm:block">Changes appear on your creator profile.</p><Button
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
            >{saved ? <><CheckIcon className="size-4" /> Saved</> : "Save changes"}</Button></div>
          </section> : null}

          {section === "notifications" ? <section className="rounded-[20px] bg-white p-5 sm:p-7"><SectionTitle title="Stay in the loop, selectively" description="Switch on the updates that keep projects moving and leave the rest behind." /><div className="mt-6 space-y-3">{preferenceCopy.map(([Icon, label, description], index) => <div key={label} className="flex min-h-[4.5rem] items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-neutral-100 text-neutral-700"><Icon className="size-[19px]" /></span><div id={`preference-${index}`} className="min-w-0 flex-1"><p className="text-sm font-semibold">{label}</p><p className="mt-0.5 text-xs text-neutral-500">{description}</p></div><Switch checked={preferences[index]} onCheckedChange={(checked) => setPreferences(current => current.map((value, i) => i === index ? checked : value))} aria-labelledby={`preference-${index}`} /></div>)}</div></section> : null}

          {section === "account" ? <div className="space-y-5"><section className="rounded-[20px] bg-white p-5 sm:p-7"><SectionTitle title="Account & security" description="Keep your account secure and make it easy to access from the devices you trust." /><div className="mt-6 space-y-3"><SettingRow icon={EnvelopeIcon} label="Email address" value="jordan@jordanlee.co" actionLabel="Change" onClick={() => { setEmailMode(true); setEmailRequested(false); }} /><SettingRow icon={KeyIcon} label="Password" value={passwordChanged ? "Changed just now" : "Changed 4 months ago"} actionLabel="Change" onClick={() => setPasswordMode(true)} /><SettingRow icon={LockClosedIcon} label="Passkey" value={passkeyAdded ? "1 passkey added" : "Use a passkey for faster, more secure sign-in"} actionLabel={passkeyAdded ? undefined : "Add"} onClick={() => setPasskeyAdded(true)} /></div></section>
            <section className="rounded-[20px] bg-white p-5 sm:p-7"><SectionTitle title="Apps and sessions" description="Review the services and devices that can access your account." /><div className="mt-6 space-y-3"><SettingRow icon={LinkIcon} label="Connected apps" value="None" /><SettingRow icon={ShieldCheckIcon} label="Login activity" value="This device" /></div></section>
            <section className="rounded-[20px] bg-white p-5 sm:p-7"><SectionTitle title="Delete your account" description="Remove your Creatorshop profile and account. Completed-shop receipts remain available to the other party for record-keeping." /><button onClick={() => setDeleteMode(true)} className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-xl px-1 text-sm font-semibold text-red-600 underline decoration-red-200 underline-offset-4 transition-colors hover:text-red-700"><TrashIcon className="size-4" /> Delete account</button></section>
          </div> : null}
        </main>
      </div>
    </div>
  </div>
  {emailMode ? (
    <div className="fixed inset-0 z-50 grid place-items-center bg-neutral-950/35 p-4 sm:p-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="change-email-title"
        aria-describedby="change-email-description"
        className="w-full max-w-[27rem] rounded-[1.5rem] bg-white px-5 py-6 shadow-[0_24px_80px_rgba(0,0,0,0.18)] sm:p-7"
      >
        <header>
          <h2 id="change-email-title" className="text-[1.375rem] leading-7 font-bold tracking-[-0.03em] text-neutral-950">
            Change email address
          </h2>
          {!emailRequested ? (
            <p id="change-email-description" className="mt-2 text-pretty text-sm leading-6 text-neutral-500">
              For your security, we’ll verify the new email before changing your sign-in.
            </p>
          ) : null}
        </header>

        {emailRequested ? (
          <div id="change-email-description" className="mt-6 flex items-start gap-3 rounded-2xl bg-[#eef4e4] p-4">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white/80 text-neutral-900">
              <CheckIcon className="size-4 stroke-2" />
            </span>
            <div className="pt-0.5">
              <p className="text-sm leading-5 font-semibold text-neutral-950">Check your inbox</p>
              <p className="mt-1.5 text-pretty text-sm leading-6 text-neutral-600">
                We sent a verification link to your new address. Your sign-in email will not change until you confirm it.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-5">
            <label className="block text-[13px] leading-5 font-semibold text-neutral-800">
              New email address
              <input
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="mt-2 h-12 w-full rounded-xl border border-neutral-200 bg-white px-3.5 text-[15px] font-normal text-neutral-950 outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-neutral-400 hover:border-neutral-300 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
              />
            </label>
            <label className="block text-[13px] leading-5 font-semibold text-neutral-800">
              Current password
              <input
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="mt-2 h-12 w-full rounded-xl border border-neutral-200 bg-white px-3.5 text-[15px] font-normal text-neutral-950 outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-neutral-400 hover:border-neutral-300 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
              />
            </label>
          </div>
        )}

        <div className="mt-7 flex justify-end gap-2 pt-5">
          <ModalSecondaryAction onClick={() => setEmailMode(false)}>Cancel</ModalSecondaryAction>
          {!emailRequested ? <Button size="sm" onClick={() => setEmailRequested(true)}>Send verification</Button> : null}
        </div>
      </div>
    </div>
  ) : null}
  {passwordMode ? <div className="fixed inset-0 z-50 grid place-items-center bg-neutral-950/35 p-4"><div role="dialog" aria-modal="true" aria-labelledby="change-password-title" className="w-full max-w-md rounded-[1.5rem] bg-white p-6 shadow-2xl"><h2 id="change-password-title" className="text-xl font-bold tracking-tight">Change password</h2><p className="mt-2 text-sm leading-6 text-neutral-500">Use at least eight characters and choose something you do not use elsewhere.</p><label className="mt-5 block text-xs font-semibold text-neutral-600">Current password<input value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} type="password" autoComplete="current-password" placeholder="••••••••" className="mt-2 min-h-11 w-full rounded-xl border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-900" /></label><label className="mt-4 block text-xs font-semibold text-neutral-600">New password<input value={newPassword} onChange={(event) => setNewPassword(event.target.value)} type="password" autoComplete="new-password" placeholder="At least 8 characters" className="mt-2 min-h-11 w-full rounded-xl border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-900" /></label><label className="mt-4 block text-xs font-semibold text-neutral-600">Confirm new password<input value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} type="password" autoComplete="new-password" placeholder="Repeat your new password" className="mt-2 min-h-11 w-full rounded-xl border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-900" /></label>{confirmPassword && newPassword !== confirmPassword ? <p role="alert" className="mt-2 text-xs font-medium text-red-600">Passwords do not match.</p> : null}<div className="mt-6 flex justify-end gap-2"><ModalSecondaryAction onClick={closePasswordModal}>Cancel</ModalSecondaryAction><Button size="sm" disabled={!passwordIsValid} onClick={() => { setPasswordChanged(true); closePasswordModal(); }}>Update password</Button></div></div></div> : null}
  {deleteMode ? <div className="fixed inset-0 z-50 grid place-items-center bg-neutral-950/35 p-4"><div role="dialog" aria-modal="true" aria-labelledby="delete-account-title" className="w-full max-w-md rounded-[1.5rem] bg-white p-6 shadow-2xl"><span className="grid size-11 place-items-center rounded-2xl bg-red-50 text-red-600"><ExclamationTriangleIcon className="size-6" /></span><h2 id="delete-account-title" className="mt-5 text-xl font-bold tracking-tight">Delete your account?</h2><p className="mt-2 text-sm leading-6 text-neutral-500">This cannot be undone. You will lose access to your profile, saved products, messages, and shops. Type <strong className="font-semibold text-neutral-900">DELETE</strong> to continue.</p><input value={deleteText} onChange={event => setDeleteText(event.target.value)} placeholder="DELETE" className="mt-5 min-h-11 w-full rounded-xl border border-neutral-200 px-3 text-sm outline-none focus:border-red-500" /><div className="mt-6 flex justify-end gap-2"><ModalSecondaryAction onClick={() => { setDeleteMode(false); setDeleteText(""); }}>Keep account</ModalSecondaryAction><Button variant="danger" size="sm" disabled={deleteText !== "DELETE"}>Delete account</Button></div></div></div> : null}
  </CreatorShell>;
}
