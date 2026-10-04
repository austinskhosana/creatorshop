"use client";

import { CheckIcon, ClipboardDocumentIcon, KeyIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import type { ShopCreatorAccess } from "@/lib/data/schema";

interface CreatorAccessCardProps {
  brand: string;
  product: string;
  /** When the post is due, e.g. "Oct 3". The access lasts until then. */
  deadline?: string;
  /** Unset when the product's free plan covers the post. */
  access?: ShopCreatorAccess;
}

/**
 * What the creator uses to make the post, shown once a brand approves them: the brand's creator
 * access for products with no free plan, or a pointer to the free plan when that's enough. It
 * isn't a trial — full access still unlocks after the brand confirms the post.
 */
export default function CreatorAccessCard({ brand, product, deadline, access }: CreatorAccessCardProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  if (!access) {
    return (
      <p className="flex items-start gap-2.5 rounded-xl bg-neutral-50 px-3.5 py-3 text-[13px] leading-5 text-neutral-600">
        <KeyIcon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-neutral-400" />
        <span>Use {product}&apos;s free plan to make your post. Full access unlocks once {brand} confirms it.</span>
      </p>
    );
  }

  async function copy() {
    if (!access?.value) return;
    try {
      await navigator.clipboard.writeText(access.value);
      setCopied(true);
    } catch {
      // Clipboard can be blocked; the value stays selectable by hand.
    }
  }

  return (
    <section aria-labelledby="creator-access-heading" className="rounded-2xl border border-neutral-200 bg-white p-4 text-left sm:p-5">
      <div className="flex items-start gap-3">
        <span className="grid size-7 shrink-0 place-items-center rounded-md bg-[#A3FF38]">
          <KeyIcon aria-hidden="true" className="size-3.5 text-black" />
        </span>
        <div className="min-w-0">
          <h2 id="creator-access-heading" className="text-base font-semibold text-neutral-950">
            Creator access
          </h2>
          <p className="mt-0.5 text-[13px] leading-5 text-neutral-500">
            {brand} unlocked {product} so you can make your post
            {deadline ? (
              <>
                . It lasts until your post is due on <span className="tabular-nums">{deadline}</span>.
              </>
            ) : (
              "."
            )}
          </p>
        </div>
      </div>

      {access.value ? (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-neutral-50 py-1.5 pr-1.5 pl-3.5">
          <div className="min-w-0 flex-1">
            {access.label ? <p className="text-[11px] font-medium text-neutral-400">{access.label}</p> : null}
            <p className="truncate font-mono text-sm font-semibold tracking-wide text-neutral-950 select-all">{access.value}</p>
          </div>
          <button
            type="button"
            onClick={copy}
            className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 text-[13px] font-medium text-neutral-950 outline-none transition-[background-color,border-color,transform] duration-150 hover:bg-neutral-100 active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2"
          >
            {copied ? <CheckIcon aria-hidden="true" className="size-4" strokeWidth={2} /> : <ClipboardDocumentIcon aria-hidden="true" className="size-4" strokeWidth={2} />}
            <span aria-live="polite">
              {copied ? "Copied" : "Copy"}
              <span className="sr-only"> {access.label?.toLowerCase() ?? "creator access"}</span>
            </span>
          </button>
        </div>
      ) : null}

      {access.instructions ? <p className="mt-3 text-[13px] leading-5 text-neutral-600">{access.instructions}</p> : null}
    </section>
  );
}
