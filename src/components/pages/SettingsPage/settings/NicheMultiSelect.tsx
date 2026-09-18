"use client";

import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";

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

export function NicheMultiSelect({ value, onChange }: { value: string[]; onChange: (value: string[]) => void }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function closeOnOutsidePress(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", closeOnOutsidePress);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePress);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  function toggle(option: string) {
    onChange(value.includes(option) ? value.filter((item) => item !== option) : [...value, option]);
  }

  return (
    <div ref={rootRef} className="relative mt-2">
      <button
        type="button"
        aria-labelledby="niche-label niche-selection"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="niche-options"
        onClick={() => setOpen((current) => !current)}
        className="flex min-h-11 w-full items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-left outline-none transition-[border-color,box-shadow] hover:border-neutral-300 focus-visible:border-neutral-900 focus-visible:ring-2 focus-visible:ring-neutral-900/10"
      >
        <span id="niche-selection" className="flex min-w-0 flex-1 flex-wrap gap-1.5">
          {value.length > 0 ? value.map((item) => (
            <span key={item} className="rounded-md bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-950">{item}</span>
          )) : <span className="text-sm font-normal text-neutral-400">Select your niches</span>}
        </span>
        <ChevronUpDownIcon aria-hidden="true" className="size-4 shrink-0 text-neutral-400" />
      </button>

      {open ? (
        <div id="niche-options" role="listbox" aria-multiselectable="true" aria-labelledby="niche-label" className="absolute top-[calc(100%+0.5rem)] right-0 left-0 z-20 max-h-72 overflow-y-auto rounded-xl border border-neutral-200 bg-white p-1.5 shadow-[0_14px_40px_rgba(0,0,0,0.12)]">
          {NICHE_OPTIONS.map((option) => {
            const selected = value.includes(option);
            return (
              <button
                key={option}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => toggle(option)}
                className={`flex min-h-10 w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-inset ${selected ? "bg-neutral-100 font-medium text-neutral-950" : "text-neutral-700 hover:bg-neutral-50"}`}
              >
                <span className={`grid size-4 shrink-0 place-items-center rounded border transition-colors ${selected ? "border-neutral-950 bg-neutral-950 text-white" : "border-neutral-300 bg-white"}`}>
                  {selected ? <CheckIcon className="size-3 stroke-[2.5]" /> : null}
                </span>
                <span>{option}</span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

