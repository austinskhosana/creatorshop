"use client";

import Toast, { showToast, type ToastContent } from "./Toast";

const buttonClass =
  "inline-flex min-h-10 items-center rounded-xl border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-800 transition-[background-color,transform] duration-150 hover:bg-neutral-50 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2";

/** Fires real toasts into the root Toaster so the stacking and swipe can be tried. */
export default function ToastDemo() {
  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        className={buttonClass}
        onClick={() =>
          showToast({
            icon: "check",
            title: "Approved Lerato Dube",
            description: "Their post is due 17 Oct 2026.",
            action: { label: "Open thread", href: "#" },
          })
        }
      >
        Approve
      </button>
      <button type="button" className={buttonClass} onClick={() => showToast({ icon: "cross", title: "Passed on Lerato Dube" })}>
        Pass
      </button>
    </div>
  );
}

/** A static toast at Sonner's default width, for the catalog. */
export function ToastPreview(props: ToastContent) {
  return (
    <div className="w-[356px] max-w-full">
      <Toast {...props} onDismiss={() => {}} />
    </div>
  );
}
