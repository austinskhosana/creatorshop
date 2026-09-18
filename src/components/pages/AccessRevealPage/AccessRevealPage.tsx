"use client";

import {
  ArrowTopRightOnSquareIcon,
  CalendarDaysIcon,
  CheckIcon,
  ClipboardDocumentIcon,
  KeyIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import BrandLogo from "@/components/atoms/BrandLogo/BrandLogo";
import Button from "@/components/atoms/Button/Button";
import CreatorBreadcrumb from "@/components/molecules/CreatorBreadcrumb/CreatorBreadcrumb";
import { CreatorShell } from "@/components/templates/CreatorShell";
import type { CreatorShop } from "@/lib/mock-creator";

const easeOut = [0.23, 1, 0.32, 1] as const;

export default function AccessRevealPage({ shop }: { shop: CreatorShop }) {
  const [revealed, setRevealed] = useState(false);
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
      <main className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-12">
        <CreatorBreadcrumb items={[{ label: "My Shops", href: "/shops" }, { label: `${shop.product} access` }]} />

        <section className="mt-7 overflow-hidden rounded-[20px] border border-neutral-200 bg-white text-neutral-950">
          <div className="flex min-h-[550px] flex-col p-5 sm:p-8 lg:min-h-[570px]">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-[11px] font-semibold tracking-[0.12em] text-neutral-500 uppercase">
                <span className="size-1.5 rounded-full bg-[#A3FF38] ring-2 ring-[#A3FF38]/20" />
                Post approved
              </span>
              <span className="hidden font-mono text-[10px] tracking-[0.16em] text-neutral-400 uppercase sm:inline">Issued to Jordan Lee</span>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              {!revealed ? (
                <motion.div
                  key="sealed"
                  initial={initial}
                  animate={enter}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, transform: "translateY(-8px) scale(0.98)" }}
                  transition={{ duration: 0.25, ease: easeOut }}
                  className="my-auto flex flex-col items-center py-14 text-center"
                >
                  <div className="relative">
                    <div className="rounded-[24px] border border-neutral-200 bg-neutral-50 p-3">
                      <BrandLogo slug={shop.id} name={shop.brand} size={76} className="rounded-[18px]" />
                    </div>
                    <span className="absolute -right-3 -bottom-3 grid size-9 place-items-center rounded-full border-4 border-white bg-[#A3FF38] text-neutral-950">
                      <KeyIcon className="size-4" />
                    </span>
                  </div>
                  <p className="mt-8 text-[11px] font-semibold tracking-[0.16em] text-neutral-400 uppercase">A fair trade, completed</p>
                  <h1 className="mt-3 max-w-2xl text-4xl leading-[1.05] font-bold tracking-[-0.04em] sm:text-5xl">Your access has landed.</h1>
                  <p className="mt-4 max-w-md text-sm leading-6 text-neutral-500">Your {shop.tier} was approved. One last tap unlocks {shop.access} of {shop.product}.</p>
                  <Button
                    size="lg"
                    variant="premium"
                    iconLeft={<SparklesIcon className="size-4" />}
                    onClick={() => setRevealed(true)}
                    className="mt-8 min-h-11 min-w-52 rounded-[10px] tracking-normal"
                  >
                    Reveal my access
                  </Button>
                  <p className="mt-4 flex items-center gap-1.5 text-[11px] text-neutral-400"><ShieldCheckIcon className="size-3.5" /> Only you can view this code</p>
                </motion.div>
              ) : (
                <motion.div
                  key="revealed"
                  initial={initial}
                  animate={enter}
                  transition={{ duration: 0.3, ease: easeOut }}
                  className="my-auto grid items-center gap-9 py-9 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <BrandLogo slug={shop.id} name={shop.brand} size={52} />
                      <div>
                        <p className="text-sm font-semibold">{shop.product}</p>
                        <p className="mt-0.5 text-xs text-neutral-400">Complimentary creator access</p>
                      </div>
                    </div>
                    <p className="mt-8 text-[11px] font-semibold tracking-[0.16em] text-neutral-400 uppercase">It’s officially yours</p>
                    <h1 className="mt-2 text-4xl leading-[1.05] font-bold tracking-[-0.04em]">Make something great with it.</h1>
                    <p className="mt-4 max-w-sm text-sm leading-6 text-neutral-500">Thanks for creating with {shop.brand}. Your access is active through {shop.accessEnd}.</p>
                  </div>

                  <div className="rounded-[18px] border border-neutral-200 bg-neutral-50 p-2">
                    <div className="rounded-[14px] border border-neutral-200 bg-white p-5 text-neutral-950 sm:p-6">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-[10px] font-semibold tracking-[0.16em] text-neutral-400 uppercase">Your access code</p>
                          <p className="mt-1 text-sm font-semibold">{shop.access} of {shop.product}</p>
                        </div>
                        <span className="grid size-9 place-items-center rounded-xl bg-[#efffdc]"><KeyIcon className="size-4" /></span>
                      </div>

                      <button
                        type="button"
                        onClick={copyCode}
                        className="group mt-5 flex w-full items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-4 text-left outline-none transition-[background-color,border-color,transform] duration-150 hover:bg-white active:scale-[0.96] focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2"
                        aria-label="Copy access code"
                      >
                        <span className="min-w-0 overflow-hidden font-mono text-sm font-bold tracking-[0.08em] text-ellipsis whitespace-nowrap sm:text-[15px]">{shop.accessCode}</span>
                        <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-neutral-500">
                          {copied ? <CheckIcon className="size-4 text-neutral-950" /> : <ClipboardDocumentIcon className="size-4" />}
                          {copied ? "Copied" : "Copy"}
                        </span>
                      </button>
                      <span className="sr-only" aria-live="polite">{copied ? "Access code copied" : ""}</span>

                      <div className="mt-5 grid gap-3 border-t border-neutral-100 pt-5 sm:grid-cols-2">
                        <div className="flex gap-2.5">
                          <CalendarDaysIcon className="mt-0.5 size-4 shrink-0 text-neutral-400" />
                          <div><p className="text-xs font-semibold">Valid until</p><p className="mt-0.5 text-xs text-neutral-500">{shop.accessEnd}</p></div>
                        </div>
                        <div className="flex gap-2.5">
                          <ShieldCheckIcon className="mt-0.5 size-4 shrink-0 text-neutral-400" />
                          <div><p className="text-xs font-semibold">Assigned to you</p><p className="mt-0.5 text-xs text-neutral-500">Not transferable</p></div>
                        </div>
                      </div>

                      <a href={shop.redemptionUrl} target="_blank" rel="noreferrer" className="mt-5 block">
                        <Button fullWidth size="lg" variant="premium" className="min-h-11 rounded-[10px] tracking-normal" iconRight={<ArrowTopRightOnSquareIcon className="size-4" />}>Redeem with {shop.brand}</Button>
                      </a>
                      <p className="mt-3 text-center text-[11px] leading-4 text-neutral-400">Copy your code first, then paste it during redemption.</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between border-t border-neutral-100 pt-4 text-[11px] text-neutral-400">
              <span>Creatorshop × {shop.brand}</span>
              <Link href="/messages" className="transition-colors duration-150 hover:text-neutral-950 focus-visible:text-neutral-950 focus-visible:outline-none">Need help?</Link>
            </div>
          </div>
        </section>
      </main>
    </CreatorShell>
  );
}
