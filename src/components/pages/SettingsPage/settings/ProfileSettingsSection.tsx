"use client";

import {
  CheckIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  PencilIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Button from "@/components/atoms/Button/Button";
import { PlatformIcon } from "@/components/atoms/PlatformIcon";
import { TerminalgraphShader } from "@/components/atoms/TerminalgraphShader";
import { Switch } from "@/components/ui/switch";
import type { CreatorProfile } from "@/lib/data/schema";
import { readImageAsDataUrl, validateImageFile } from "@/lib/image-upload";
import { getCoverStyle, UPLOADED_COVER_ID } from "@/lib/profile-covers";
import { normalizeHandle, SOCIAL_PLATFORMS } from "@/lib/socials";
import { creatorStore, useProfile } from "@/lib/store/creator-store";
import { AvatarCropDialog } from "./AvatarCropDialog";
import { CoverGallery } from "./CoverGallery";
import { NicheMultiSelect } from "./NicheMultiSelect";

const detailOptions = [
  [CurrencyDollarIcon, "showEarnings", "Total earned", "Show your verified earnings to brands"],
  [MapPinIcon, "showLocation", "Location", "Show your location on your public profile"],
  [UserCircleIcon, "discoverable", "Profile visibility", "Allow brands to discover and invite you"],
] as const;

export function ProfileSettingsSection() {
  const stored = useProfile();
  // Only the fields edited since the last save. Everything else reads through to the stored
  // profile, so the form shows the saved values as soon as the store hydrates.
  const [draft, setDraft] = useState<Partial<CreatorProfile>>({});
  const [saved, setSaved] = useState(false);
  const [coverPickerOpen, setCoverPickerOpen] = useState(false);
  const [coverError, setCoverError] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarDropping, setAvatarDropping] = useState(false);
  const coverPickerRef = useRef<HTMLDivElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const avatarButtonRef = useRef<HTMLButtonElement>(null);
  const profile = { ...stored, ...draft };
  const { displayName, username, niches, bio, coverId } = profile;
  const isDirty = Object.keys(draft).length > 0;
  const isValid = displayName.trim().length > 0 && username.length > 0;

  function edit(patch: Partial<CreatorProfile>) {
    setDraft((current) => ({ ...current, ...patch }));
    setSaved(false);
  }

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
    if (!saved) return;
    const timeout = window.setTimeout(() => setSaved(false), 2400);
    return () => window.clearTimeout(timeout);
  }, [saved]);

  function saveProfile() {
    if (!isDirty || !isValid) return;
    creatorStore.updateProfile({ ...draft, displayName: displayName.trim() });
    setDraft({});
    setSaved(true);
  }

  async function uploadCover(file: File) {
    setCoverPickerOpen(false);
    setCoverError(null);
    try {
      edit({ coverId: UPLOADED_COVER_ID, coverImage: await readImageAsDataUrl(file, { maxSize: 1600 }), coverImageName: file.name });
    } catch {
      setCoverError("That image couldn't be read. Try a different file.");
    }
  }

  function closeAvatarCrop() {
    setAvatarFile(null);
    avatarButtonRef.current?.focus();
  }

  function pickAvatar(file: File | undefined) {
    setAvatarError(null);
    if (!file) return;
    const error = validateImageFile(file);
    if (error) setAvatarError(error);
    else setAvatarFile(file);
  }

  const coverStyle = getCoverStyle(coverId, profile.coverImage);

  return (
    <section className="bg-white p-5 sm:p-7">
      <div ref={coverPickerRef} className="relative h-44 rounded-[20px] sm:h-56">
        <div className="absolute inset-0 overflow-hidden rounded-[20px] border border-neutral-200 bg-neutral-100">
          {!coverStyle ? (
            <TerminalgraphShader theme="light" background={{ dark: "#052e12", light: "#ffffff" }} className="absolute inset-0 size-full" />
          ) : (
            <>
              <div className="absolute inset-0 transition-[background] duration-300" style={coverStyle} />
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
            selectedId={coverId}
            uploadedFileName={profile.coverImageName}
            onSelect={(id) => {
              edit({ coverId: id });
              setCoverPickerOpen(false);
            }}
            onUpload={uploadCover}
            onClose={() => setCoverPickerOpen(false)}
          />
        ) : null}
      </div>
      {coverError ? <p role="alert" className="mt-2 text-right text-xs text-red-600">{coverError}</p> : null}

      <div className="relative z-10 -mt-12 ml-5 flex items-end sm:-mt-14 sm:ml-7">
        <div
          className="relative"
          onDragOver={(event) => {
            if (!event.dataTransfer.types.includes("Files")) return;
            event.preventDefault();
            event.dataTransfer.dropEffect = "copy";
            setAvatarDropping(true);
          }}
          onDragLeave={() => setAvatarDropping(false)}
          onDrop={(event) => {
            event.preventDefault();
            setAvatarDropping(false);
            pickAvatar(event.dataTransfer.files[0]);
          }}
        >
          {/* A bigger mouse target and drop zone; keyboard users get the pencil button below. */}
          <button
            type="button"
            tabIndex={-1}
            onClick={() => avatarInputRef.current?.click()}
            className={`block size-24 cursor-pointer rounded-full bg-white p-1 shadow-sm transition-[box-shadow] duration-150 sm:size-28 ${avatarDropping ? "ring-2 ring-neutral-900 ring-offset-2" : ""}`}
          >
            {/* Padding makes the white ring; see ShopperReviewCard for why it isn't a border. */}
            <span className="relative block size-full overflow-hidden rounded-full bg-neutral-100">
              <Image src={profile.avatar} alt={`${stored.displayName}'s profile photo`} fill sizes="112px" className="object-cover" draggable={false} />
              <span aria-hidden="true" className={`absolute inset-0 grid place-items-center bg-neutral-950/45 text-[11px] font-semibold text-white transition-opacity duration-150 ${avatarDropping ? "opacity-100" : "opacity-0"}`}>Drop photo</span>
            </span>
          </button>
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
            onChange={(event) => {
              pickAvatar(event.target.files?.[0]);
              // Lets the same file be picked again after a discard.
              event.target.value = "";
            }}
          />
          <button ref={avatarButtonRef} type="button" aria-label="Change profile image" onClick={() => avatarInputRef.current?.click()} className="absolute right-0 bottom-0 grid size-10 place-items-center rounded-full border-4 border-white bg-neutral-950 text-white transition-[background-color,transform] duration-150 hover:bg-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 active:scale-[0.96]"><PencilIcon className="size-4" /></button>
        </div>
        {avatarError ? <p role="alert" className="mb-1 ml-4 text-xs text-red-600">{avatarError}</p> : null}
      </div>
      {avatarFile ? (
        <AvatarCropDialog
          file={avatarFile}
          onApply={(avatar) => {
            edit({ avatar });
            closeAvatarCrop();
          }}
          onCancel={closeAvatarCrop}
          onError={(message) => {
            setAvatarError(message);
            closeAvatarCrop();
          }}
        />
      ) : null}

      <div className="mt-7 space-y-5">
        <label className="block text-[13px] font-medium text-neutral-700">Display name
          <input value={displayName} maxLength={100} onChange={(event) => edit({ displayName: event.target.value })} aria-invalid={!displayName.trim()} className="mt-2 min-h-11 w-full rounded-xl border border-neutral-200 bg-white px-3.5 text-sm font-medium text-neutral-950 outline-none transition-colors focus:border-neutral-900" />
          <span className="mt-1.5 block text-right text-[11px] font-normal tabular-nums text-neutral-400">{displayName.length}/100</span>
        </label>
        <label className="block text-[13px] font-medium text-neutral-700">Username
          <div className="relative mt-2"><span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-sm text-neutral-400">@</span><input value={username} maxLength={42} onChange={(event) => edit({ username: event.target.value.replace(/[\s@]/g, "") })} aria-invalid={!username} className="min-h-11 w-full rounded-xl border border-neutral-200 bg-white pr-3.5 pl-8 text-sm font-medium text-neutral-950 outline-none transition-colors focus:border-neutral-900" /></div>
          <span className="mt-1.5 block text-right text-[11px] font-normal tabular-nums text-neutral-400">{username.length}/42</span>
        </label>
        <div>
          <p id="niche-label" className="text-[13px] font-medium text-neutral-700">Niches</p>
          <NicheMultiSelect value={niches} onChange={(value) => edit({ niches: value })} />
          <p className="mt-1.5 text-[11px] font-normal text-neutral-400">Choose all the categories that describe your content.</p>
        </div>
        <label className="block text-[13px] font-medium text-neutral-700">Bio
          <textarea value={bio} maxLength={200} onChange={(event) => edit({ bio: event.target.value })} rows={4} className="mt-2 w-full resize-none rounded-xl border border-neutral-200 bg-white px-3.5 py-3 text-sm leading-6 font-medium text-neutral-950 outline-none transition-colors focus:border-neutral-900" />
          <span className="mt-1.5 block text-right text-[11px] font-normal tabular-nums text-neutral-400">{bio.length}/200</span>
        </label>
      </div>

      <div className="mt-8 border-t border-neutral-200 pt-7">
        <h2 className="text-lg font-bold tracking-[-0.025em] text-neutral-950">Socials</h2>
        <p className="mt-1 text-sm leading-6 text-neutral-500">Add your handles. Each one shows on your profile as a link to that account.</p>
        <div className="mt-5 space-y-4">
          {SOCIAL_PLATFORMS.map(({ name, prefix }) => (
            <label key={name} className="block text-[13px] font-medium text-neutral-700">
              <span className="flex items-center gap-2"><PlatformIcon platform={name} className="size-4" /> {name}</span>
              <div className="mt-2 flex min-h-11 items-center rounded-xl border border-neutral-200 bg-white transition-colors focus-within:border-neutral-900">
                <span className="pointer-events-none shrink-0 pl-3.5 text-sm text-neutral-400">{prefix}</span>
                <input
                  value={profile.socials[name]}
                  maxLength={60}
                  placeholder="handle"
                  autoComplete="off"
                  spellCheck={false}
                  onChange={(event) => edit({ socials: { ...profile.socials, [name]: normalizeHandle(name, event.target.value) } })}
                  className="min-h-11 w-full min-w-0 rounded-r-xl bg-transparent pr-3.5 text-sm font-medium text-neutral-950 outline-none placeholder:font-normal placeholder:text-neutral-300"
                />
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="mt-8 border-t border-neutral-200 pt-7">
        <h2 className="text-lg font-bold tracking-[-0.025em] text-neutral-950">More details</h2>
        <p className="mt-1 text-sm leading-6 text-neutral-500">Choose what appears on your public profile and discovery surfaces.</p>
        <div className="mt-5 divide-y divide-neutral-100">
          {detailOptions.map(([Icon, key, label, description]) => (
            <div key={label} className="flex min-h-[4.75rem] items-center gap-3 py-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-neutral-100 text-neutral-700"><Icon className="size-[19px]" /></span>
              <div className="min-w-0 flex-1"><p className="text-sm font-semibold text-neutral-900">{label}</p><p className="mt-0.5 text-xs text-neutral-500">{description}</p></div>
              <Switch checked={profile[key]} onCheckedChange={(checked) => edit({ [key]: checked })} aria-label={`${label}: ${profile[key] ? "visible" : "hidden"}`} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-7 flex items-center justify-between border-t border-neutral-100 pt-5">
        <p role="status" className="hidden text-xs text-neutral-400 sm:block">
          {!isValid ? "Add a display name and username to save." : isDirty ? "You have unsaved changes." : "Changes appear on your creator profile."}
        </p>
        <div className="ml-auto flex items-center gap-2">
          {isDirty ? (
            <Button variant="secondary" size="sm" onClick={() => setDraft({})} style={{ borderRadius: "8px", padding: "8px 14px" }}>Discard</Button>
          ) : null}
          <Button
            variant="dark"
            size="sm"
            onClick={saveProfile}
            disabled={(!isDirty && !saved) || !isValid}
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
      </div>
    </section>
  );
}
