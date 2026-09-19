"use client";

import {
  ArrowTopRightOnSquareIcon,
  CalendarDaysIcon,
  CheckIcon,
  ClipboardDocumentIcon,
  KeyIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { AccessTicket } from "@/components/molecules/AccessTicket";
import Button from "@/components/atoms/Button/Button";
import CreatorBreadcrumb from "@/components/molecules/CreatorBreadcrumb/CreatorBreadcrumb";
import { CreatorShell } from "@/components/templates/CreatorShell";
import type { CreatorShop } from "@/lib/mock-creator";

const easeOut = [0.23, 1, 0.32, 1] as const;

export default function AccessRevealPage({ shop }: { shop: CreatorShop }) {
  const [copied, setCopied] = useState(false);
  const reduceMotion = useReducedMotion();

  async function copyCode() {
    if (!shop.accessCode) return;
    await navigator.clipboard.writeText(shop.accessCode);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  const enter = reduceMotion
    ? { opacity: 1 }
    : { opacity: 1, transform: "translateY(0px) scale(1)" };
  const initial = reduceMotion
    ? { opacity: 0 }
    : { opacity: 0, transform: "translateY(10px) scale(0.98)" };

  return (
    <CreatorShell>
      <main className="mx-auto flex min-h-dvh max-w-5xl flex-col justify-center px-5 py-8 sm:px-8 sm:py-12">
        <CreatorBreadcrumb items={[{ label: "My Shops", href: "/shops" }, { label: `${shop.product} access` }]} />

        <section className="mt-7 overflow-hidden rounded-[20px] bg-white text-neutral-950">
          <motion.div
            initial={initial}
            animate={enter}
            transition={{ duration: 0.3, ease: easeOut }}
            className="mx-auto flex max-w-md flex-col items-center gap-10 px-5 py-12 text-center sm:gap-12 sm:px-8 sm:py-16"
          >
            <AccessTicket brand={shop.brand} product={shop.product} slug={shop.id} access={shop.access} />

            <div className="grid w-full gap-3.5 sm:grid-cols-2">
              <div className="flex gap-2.5">
                <CalendarDaysIcon className="mt-0.5 size-4 shrink-0 text-neutral-400" />
                <div><p className="text-[13px] font-semibold leading-snug">Valid until</p><p className="mt-0.5 text-[13px] text-neutral-500">{shop.accessEnd}</p></div>
              </div>
              <div className="flex gap-2.5">
                <ShieldCheckIcon className="mt-0.5 size-4 shrink-0 text-neutral-400" />
                <div><p className="text-[13px] font-semibold leading-snug">Assigned to you</p><p className="mt-0.5 text-[13px] text-neutral-500">Not transferable</p></div>
              </div>
            </div>

            <div className="w-full rounded-[18px] border border-neutral-200 bg-neutral-50 p-2 text-left">
              <div className="rounded-[14px] border border-neutral-200 bg-white p-5 text-neutral-950 sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-medium tracking-[0.1em] text-neutral-400 uppercase">Your access code</p>
                    <p className="mt-1.5 text-[15px] font-semibold leading-snug">{shop.access} of {shop.product}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={copyCode}
                  className="group mt-5 flex w-full items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-4 text-left outline-none transition-[background-color,border-color,transform] duration-150 hover:bg-white active:scale-[0.96] focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2"
                  aria-label="Copy access code"
                >
                  <span className="min-w-0 overflow-hidden font-mono text-[15px] font-bold tracking-[0.06em] text-ellipsis whitespace-nowrap sm:text-base">{shop.accessCode}</span>
                  <span className="inline-flex shrink-0 items-center gap-1.5 text-[13px] font-medium text-neutral-500">
                    {copied ? <CheckIcon className="size-4 text-neutral-950" /> : <ClipboardDocumentIcon className="size-4" />}
                    {copied ? "Copied" : "Copy"}
                  </span>
                </button>
                <span className="sr-only" aria-live="polite">{copied ? "Access code copied" : ""}</span>

                <a href={shop.redemptionUrl} target="_blank" rel="noreferrer" className="mt-6 block">
                  <Button fullWidth size="lg" variant="premium" className="min-h-11 rounded-[10px] tracking-normal" iconRight={<ArrowTopRightOnSquareIcon className="size-4" />}>Redeem with {shop.brand}</Button>
                </a>
                <p className="mt-3 text-center text-xs leading-4 text-neutral-400">Copy your code first, then paste it during redemption.</p>
              </div>
            </div>
          </motion.div>
        </section>
      </main>
    </CreatorShell>
  );
}
