"use client";

import { ArrowUturnLeftIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import type { ReactNode } from "react";
import { Toaster as SonnerToaster, toast } from "sonner";

export type ToastIcon = "check" | "cross" | "undo";

export interface ToastContent {
  title: string;
  description?: string;
  /** Mirrors the swipe buttons: a lime check for approvals, a white cross for passes. */
  icon?: ToastIcon;
  action?: { label: string; href: string };
}

const BADGES: Record<ToastIcon, { className: string; glyph: ReactNode }> = {
  check: { className: "bg-[#A3FF38] text-neutral-950", glyph: <CheckIcon className="size-3" strokeWidth={3} /> },
  cross: { className: "bg-white text-neutral-950", glyph: <XMarkIcon className="size-3" strokeWidth={3} /> },
  undo: { className: "bg-white/15 text-white", glyph: <ArrowUturnLeftIcon className="size-3" strokeWidth={2.5} /> },
};

// The visible controls stay 32px to keep the toast compact; the pseudo-element pads the hit area to 40px.
const hitArea = "relative after:absolute after:-inset-1";

/** The toast body. Sonner owns position, stacking, timers, and swipe-to-dismiss; this is only the surface. */
export default function Toast({ title, description, icon = "check", action, onDismiss }: ToastContent & { onDismiss: () => void }) {
  const badge = BADGES[icon];
  return (
    // Collapsed, Sonner squeezes the toasts behind to the front one's height but only fades its own styled
    // toasts, so this surface fills that height and clips, and its contents fade until the stack expands.
    <div className="h-full w-full overflow-hidden rounded-2xl bg-neutral-950 text-white shadow-[0_12px_32px_rgba(0,0,0,0.2)]">
      <div className="flex items-start gap-3 p-2 pl-3.5 transition-opacity duration-300 motion-reduce:transition-none in-data-[front=false]:in-data-[expanded=false]:opacity-0">
        <span aria-hidden="true" className={`mt-1.5 grid size-5 shrink-0 place-items-center rounded-full ${badge.className}`}>
          {badge.glyph}
        </span>
        {/* The action sits under the text rather than beside it, so a deadline or sold-out note gets the full width. */}
        <div className="min-w-0 flex-1 py-1.5">
          <p className="text-sm font-medium">{title}</p>
          {description ? <p className="mt-0.5 text-[13px] leading-5 text-white/60">{description}</p> : null}
          {action ? (
            <Link
              href={action.href}
              onClick={onDismiss}
              className={`${hitArea} mt-2.5 inline-flex min-h-8 items-center rounded-lg bg-white/10 px-3 text-xs font-medium transition-[background-color,transform] duration-150 hover:bg-white/20 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white`}
            >
              {action.label}
            </Link>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className={`${hitArea} grid size-8 shrink-0 place-items-center rounded-lg text-white/60 transition-[background-color,color,transform] duration-150 hover:bg-white/10 hover:text-white active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white`}
        >
          <XMarkIcon aria-hidden="true" className="size-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

/** Mount once, in the root layout. Toasts rise from the bottom-right corner (full width on phones). */
export function Toaster() {
  return <SonnerToaster position="bottom-right" />;
}

/**
 * Shows a toast and returns its id. It stays for 5s, or 10s when it carries an action; hovering the
 * stack holds it on screen.
 */
export function showToast({ duration, ...content }: ToastContent & { duration?: number }) {
  return toast.custom((id) => <Toast {...content} onDismiss={() => toast.dismiss(id)} />, {
    duration: duration ?? (content.action ? 10_000 : 5_000),
    // Sonner nests custom JSX in these two wrappers; stretching them lets the surface fill a collapsed toast.
    classNames: { content: "h-full", title: "h-full" },
  });
}

export function dismissToast(id: string | number) {
  toast.dismiss(id);
}
