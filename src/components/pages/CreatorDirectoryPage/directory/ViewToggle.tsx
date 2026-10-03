"use client";

import { RectangleStackIcon, Squares2X2Icon } from "@heroicons/react/24/outline";

export type DirectoryView = "swipe" | "grid";

const VIEWS = [
  { value: "swipe", label: "Swipe", Icon: RectangleStackIcon },
  { value: "grid", label: "Grid", Icon: Squares2X2Icon },
] as const;

/** Swipe or grid — a two-button segmented control, the same in both layouts so it never jumps. */
export function ViewToggle({ value, onChange }: { value: DirectoryView; onChange: (view: DirectoryView) => void }) {
  return (
    <div role="group" aria-label="Layout" className="inline-flex h-10 items-center gap-0.5 rounded-xl bg-neutral-100 p-1">
      {VIEWS.map(({ value: view, label, Icon }) => (
        <button
          key={view}
          type="button"
          aria-pressed={value === view}
          onClick={() => onChange(view)}
          className={`inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[13px] font-medium transition-[background-color,color,box-shadow] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 ${
            value === view ? "bg-white text-neutral-950 shadow-sm" : "text-neutral-500 hover:text-neutral-800"
          }`}
        >
          <Icon aria-hidden="true" className="size-4" strokeWidth={1.75} />
          {/* Icons alone on a phone, so the header's controls fit one row. */}
          <span className="sr-only sm:not-sr-only">{label}</span>
        </button>
      ))}
    </div>
  );
}
