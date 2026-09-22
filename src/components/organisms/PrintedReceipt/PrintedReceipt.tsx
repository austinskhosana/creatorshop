"use client";

import { ChevronLeftIcon, ClockIcon } from "@heroicons/react/24/outline";
import { useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PixelTrail } from "@/components/atoms/PixelTrail";
import { ReceiptPrinter, type ReceiptPrinterStage } from "@/components/organisms/ReceiptPrinter";

export interface PrintedReceiptItem {
  id: string;
  product: string;
  brand: string;
  tier: string;
  access: string;
  value: number;
}

interface PrintedReceiptProps {
  /** Paper heading, also the printer's accessible name — e.g. "Shop receipt". */
  title: string;
  /** Status line shown at each stage of the printer. */
  statusLabels: Record<ReceiptPrinterStage, string>;
  /** Small label above the display value — e.g. "Shop requests". */
  screenLabel: string;
  /** Text shown on the display — e.g. "2 products · $177". */
  screenValue: string;
  items: readonly PrintedReceiptItem[];
  /** Line under "Cash due" — e.g. "Paid with content." */
  paidWith: string;
  /** Heading for the status block at the foot of the paper. */
  reviewTitle: string;
  reviewNote: string;
  backHref: string;
  backLabel?: string;
}

const PROCESSING_MS = 1300;
const PRINTING_MS = 1900;

function Divider() {
  return <div aria-hidden="true" className="my-3 border-t border-dashed border-neutral-300" />;
}

/**
 * A full receipt screen: the printer feeding out an itemised receipt, the green
 * pixel trail behind it, and a white back button in the corner. Render it inside
 * `CreatorShell`. The content is click-through so the mouse reaches the trail.
 */
export default function PrintedReceipt({
  title,
  statusLabels,
  screenLabel,
  screenValue,
  items,
  paidWith,
  reviewTitle,
  reviewNote,
  backHref,
  backLabel = "Back to My Shops",
}: PrintedReceiptProps) {
  const reduceMotion = useReducedMotion();
  const [timedStage, setTimedStage] = useState<ReceiptPrinterStage>("processing");
  const [issuedOn] = useState(() =>
    new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  );
  const stage: ReceiptPrinterStage = reduceMotion ? "complete" : timedStage;
  const total = items.reduce((sum, item) => sum + item.value, 0);

  useEffect(() => {
    if (reduceMotion) return;
    const startPrinting = window.setTimeout(() => setTimedStage("printing"), PROCESSING_MS);
    const finish = window.setTimeout(() => setTimedStage("complete"), PROCESSING_MS + PRINTING_MS);
    return () => {
      window.clearTimeout(startPrinting);
      window.clearTimeout(finish);
    };
  }, [reduceMotion]);

  return (
    <div className="relative isolate flex min-h-screen flex-col overflow-hidden">
      <PixelTrail pixelSize={16} fadeDuration={500} delay={0} className="-z-10 motion-reduce:hidden" pixelClassName="bg-[#A3FF38]" />
      <Link
        href={backHref}
        className="absolute top-5 left-5 z-10 inline-flex h-10 items-center gap-1.5 rounded-full border border-neutral-200 bg-white pr-4 pl-3 text-sm font-medium text-neutral-950 outline-none transition-[background-color,border-color,transform] duration-150 hover:bg-neutral-50 active:scale-[0.96] focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 sm:top-8 sm:left-8"
      >
        <ChevronLeftIcon aria-hidden="true" className="size-4" strokeWidth={2} />
        {backLabel}
      </Link>

      <div className="pointer-events-none mx-auto flex min-h-screen w-full max-w-3xl items-center justify-center px-5 pt-20 pb-8 sm:px-8 sm:pt-20 sm:pb-12 xl:pt-12">
        <div className="flex w-full flex-col items-center">
          <ReceiptPrinter.Root aria-label={`${title} printer`} stage={stage} tone="light">
            <ReceiptPrinter.Machine>
              <ReceiptPrinter.Header className="pt-1.5">
                <ReceiptPrinter.Status>{statusLabels[stage]}</ReceiptPrinter.Status>
              </ReceiptPrinter.Header>
              <ReceiptPrinter.Screen className="bg-[#fafafa]! [background-image:repeating-linear-gradient(to_bottom,rgba(10,10,10,0.025)_0,rgba(10,10,10,0.025)_1px,transparent_1px,transparent_3px)]">
                <p className="font-mono text-xs text-neutral-500">{screenLabel}</p>
                <p className="mt-1 font-mono text-sm text-neutral-950 tabular-nums">
                  {screenValue}
                  <span aria-hidden="true" className="ml-1.5 inline-block h-[13px] w-[7px] bg-[#A3FF38] align-[-2px] ring-1 ring-[#82F200]" />
                </p>
              </ReceiptPrinter.Screen>
            </ReceiptPrinter.Machine>

            <ReceiptPrinter.Output>
              <ReceiptPrinter.Paper className="text-xs leading-5">
                <p className="text-center text-[11px] tracking-[0.14em] text-neutral-500 uppercase">{title}</p>

                <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 text-neutral-500">
                  <dt>Date</dt>
                  <dd className="text-right text-neutral-950">{issuedOn}</dd>
                  <dt>Creator</dt>
                  <dd className="text-right text-neutral-950">Jordan Lee</dd>
                </dl>

                <Divider />

                <ul className="flex flex-col gap-3">
                  {items.map((item) => (
                    <li key={item.id} className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-bold uppercase">{item.product}</p>
                        <p className="text-neutral-500">{item.brand} · {item.tier}</p>
                        <p className="text-neutral-500">{item.access} access</p>
                      </div>
                      <p className="shrink-0 tabular-nums">${item.value}</p>
                    </li>
                  ))}
                </ul>

                <Divider />

                <div className="flex justify-between text-neutral-500">
                  <span>Retail value</span>
                  <span className="tabular-nums">${total}</span>
                </div>
                <div className="mt-1 flex justify-between font-bold">
                  <span>Cash due</span>
                  <span className="tabular-nums">$0.00</span>
                </div>
                <p className="mt-1 text-neutral-500">{paidWith}</p>

                <Divider />

                <div className="flex items-center gap-2 font-bold uppercase">
                  <ClockIcon aria-hidden="true" className="size-4 shrink-0" strokeWidth={2} />
                  {reviewTitle}
                </div>
                <p className="mt-2 leading-[1.45] text-neutral-500">{reviewNote}</p>

                <div
                  aria-hidden="true"
                  className="mt-4 h-8 [background:repeating-linear-gradient(90deg,#0a0a0a_0_2px,transparent_2px_4px,#0a0a0a_4px_5px,transparent_5px_8px,#0a0a0a_8px_11px,transparent_11px_13px)]"
                />
              </ReceiptPrinter.Paper>
            </ReceiptPrinter.Output>
          </ReceiptPrinter.Root>
        </div>
      </div>
    </div>
  );
}
