"use client";

import { ArrowUpTrayIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useCallback, useEffect, useRef, useState } from "react";
import { TerminalgraphShader } from "@/components/atoms/TerminalgraphShader";
import { validateImageFile } from "@/lib/image-upload";
import { COVER_OPTIONS } from "@/lib/profile-covers";

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
    const error = validateImageFile(file);
    if (error) {
      setUploadError(error);
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

