"use client";

import { ArrowUpTrayIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { TerminalgraphShader } from "@/components/atoms/TerminalgraphShader";

export type CoverOption = {
  id: string;
  name: string;
  group: "Color & gradient" | "Textures" | "Shader";
  style?: CSSProperties;
  shader?: boolean;
};

export const COVER_OPTIONS: CoverOption[] = [
  { id: "shader", name: "Shader", group: "Shader", shader: true },
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

export function CoverGallery({
  selectedId,
  uploadedFileName,
  onSelect,
  onUpload,
  onClose,
}: {
  selectedId: string;
  uploadedFileName: string | null;
  onSelect: (id: string) => void;
  onUpload: (file: File) => void;
  onClose: () => void;
}) {
  const groups = ["Shader", "Color & gradient", "Textures"] as const;
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
                      {option.shader ? <TerminalgraphShader theme="light" background={{ dark: "#052e12", light: "#ffffff" }} className="absolute inset-0 size-full" /> : null}
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
          <button type="button" onClick={() => fileInputRef.current?.click()} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 text-sm font-semibold text-neutral-800 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-[background-color,border-color,transform] hover:border-neutral-300 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 active:scale-[0.99]">
            <ArrowUpTrayIcon className="size-4" /> Upload file
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

