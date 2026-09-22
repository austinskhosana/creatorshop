"use client";

import {
  ArrowTopRightOnSquareIcon,
  CalendarDaysIcon,
  CheckIcon,
  ChevronLeftIcon,
  ClipboardDocumentIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { Fragment, useState } from "react";
import BrandLogo from "@/components/atoms/BrandLogo/BrandLogo";
import Button from "@/components/atoms/Button/Button";
import { darkGradientButtonStyle } from "@/components/atoms/Button/darkGradientStyle";
import { Fire } from "@/components/atoms/Fire";
import { MeshGradientPanel } from "@/components/atoms/MeshGradientPanel";
import { SCRAMBLE_CHARS_ALPHANUMERIC, TextScramble } from "@/components/atoms/TextScramble";
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

  // Each part of the code scrambles in left to right, starting once the card has settled.
  const codeSegments = (shop.accessCode?.split("-") ?? []).map((part, index, parts) => ({
    part,
    delay: 350 + parts.slice(0, index).join("").length * 55,
  }));

  const enter = reduceMotion
    ? { opacity: 1 }
    : { opacity: 1, transform: "translateY(0px) scale(1)" };
  const initial = reduceMotion
    ? { opacity: 0 }
    : { opacity: 0, transform: "translateY(10px) scale(0.98)" };

  return (
    <CreatorShell>
      <div className="relative isolate flex min-h-screen flex-col overflow-hidden">
        <Fire
          background="#ffffff"
          rows={32}
          widthPercent={100}
          playing={!reduceMotion}
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-80 w-full [mask-image:linear-gradient(to_top,rgba(0,0,0,0.6)_0%,rgba(0,0,0,0.3)_50%,transparent_100%)]"
        />
        <Link
          href="/shops"
          aria-label="Back to My Shops"
          className="absolute top-5 left-5 z-10 grid size-10 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-950 outline-none transition-[background-color,border-color,transform] duration-150 hover:bg-neutral-50 active:scale-[0.96] focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 sm:top-8 sm:left-8"
        >
          <ChevronLeftIcon aria-hidden="true" className="size-5" strokeWidth={2} />
        </Link>
        <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-5 pt-8 pb-28 sm:px-8 sm:pt-12 sm:pb-36">

          <section className="text-neutral-950">
            <motion.div
              initial={initial}
              animate={enter}
              transition={{ duration: 0.3, ease: easeOut }}
              className="mx-auto flex max-w-lg flex-col items-center gap-8 text-center sm:gap-10 sm:px-8"
            >
              <header className="flex flex-col items-center">
                <div className="mb-5 flex items-center justify-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3.5 py-2 whitespace-nowrap">
                  <CalendarDaysIcon aria-hidden="true" className="size-4 shrink-0 text-neutral-950" />
                  <p className="text-[13px] font-semibold text-neutral-950">Valid until:</p>
                  <p className="text-[13px] text-neutral-500 tabular-nums">{shop.accessEnd}</p>
                </div>
                <h1 className="text-[clamp(1.5rem,6vw,2rem)] text-center leading-[1.15] font-semibold tracking-[-0.025em] text-neutral-950">Your content payment was<br />totally fire!</h1>
                <p className="mx-auto mt-3 max-w-sm text-[15px] leading-6 text-pretty text-neutral-500">You&apos;ve been approved. So here&apos;s your access.</p>
              </header>

              <MeshGradientPanel radius={20} borderWidth={6} shaded={false} className="w-full p-1.5 text-left shadow-[0_20px_45px_-15px_rgba(0,0,0,0.18)]">
                <div className="rounded-[14px] border border-neutral-200 bg-white p-5 text-neutral-950 sm:p-6">
                  <div className="flex items-center gap-3">
                    <BrandLogo slug={shop.id} name={shop.brand} size={36} className="shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[15px] font-semibold leading-snug">{shop.brand}</p>
                      <p className="mt-0.5 text-[13px] leading-4 text-neutral-500">{shop.access.replace(/months$/, "month")} subscription</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={copyCode}
                    className="group mt-5 flex w-full items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-4 text-left outline-none transition-[background-color,border-color,transform] duration-150 hover:bg-white active:scale-[0.96] focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2"
                    aria-label="Copy access code"
                  >
                    <span className="min-w-0 font-mono text-[15px] leading-6 font-normal tracking-[0.05em] break-all text-neutral-950 sm:text-base">
                      {codeSegments.map(({ part, delay }, index) => (
                        <Fragment key={index}>
                          {index > 0 && <span aria-hidden="true" className="text-neutral-300">-</span>}
                          <TextScramble
                            text={part}
                            chars={SCRAMBLE_CHARS_ALPHANUMERIC}
                            delay={delay}
                            duration={260 + part.length * 55}
                            scrambleDuration={220}
                          />
                        </Fragment>
                      ))}
                    </span>
                    <span className="inline-flex shrink-0 items-center gap-1.5 text-[13px] font-medium text-neutral-500">
                      {copied ? <CheckIcon className="size-4 text-neutral-950" /> : <ClipboardDocumentIcon className="size-4" />}
                      {copied ? "Copied" : "Copy"}
                    </span>
                  </button>
                  <span className="sr-only" aria-live="polite">{copied ? "Access code copied" : ""}</span>
                  <p className="mt-2.5 flex items-center justify-center gap-1.5 text-center text-xs leading-4 text-neutral-400"><InformationCircleIcon aria-hidden="true" className="size-3.5 shrink-0" />Copy your code first, then paste it during redemption.</p>

                  <a href={shop.redemptionUrl} target="_blank" rel="noreferrer" className="mt-5 block">
                    <Button
                      fullWidth
                      variant="dark"
                      iconRight={<ArrowTopRightOnSquareIcon className="size-4" />}
                      style={{ ...darkGradientButtonStyle, padding: "12px 16px" }}
                    >
                      Redeem with {shop.brand}
                    </Button>
                  </a>
                </div>
              </MeshGradientPanel>
            </motion.div>
          </section>
        </main>
      </div>
    </CreatorShell>
  );
}
