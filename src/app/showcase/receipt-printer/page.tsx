"use client";

import { useEffect, useState } from "react";
import { ClockIcon } from "@heroicons/react/24/outline";
import { useReducedMotion } from "framer-motion";
import { CART_ITEMS } from "@/lib/mock-creator";
import { ReceiptPrinter, type ReceiptPrinterStage } from "@/components/organisms/ReceiptPrinter";

const PROCESSING_MS = 1300;
const PRINTING_MS = 1900;
const COMPLETE_HOLD_MS = 3200;

const STATUS_LABELS: Record<ReceiptPrinterStage, string> = {
  processing: "Sending your requests",
  printing: "Printing your receipt",
  complete: "Waiting for brand approval",
};

function Divider() {
  return <div aria-hidden="true" className="my-3 border-t border-dashed border-neutral-300" />;
}

/**
 * Standalone, looping demo of the ReceiptPrinter component for portfolio
 * showcase — same visual composition as PrintedReceipt (used in the
 * Creatorshop checkout flow), staged on a plain white page with no app chrome.
 */
export default function ReceiptPrinterShowcasePage() {
  const reduceMotion = useReducedMotion();
  const [timedStage, setTimedStage] = useState<ReceiptPrinterStage>("processing");
  const stage: ReceiptPrinterStage = reduceMotion ? "complete" : timedStage;
  const total = CART_ITEMS.reduce((sum, item) => sum + item.value, 0);

  useEffect(() => {
    if (reduceMotion) return;

    let timeouts: number[] = [];

    const run = () => {
      setTimedStage("processing");
      timeouts.push(
        window.setTimeout(() => setTimedStage("printing"), PROCESSING_MS),
        window.setTimeout(() => setTimedStage("complete"), PROCESSING_MS + PRINTING_MS),
        window.setTimeout(run, PROCESSING_MS + PRINTING_MS + COMPLETE_HOLD_MS),
      );
    };

    run();

    return () => {
      timeouts.forEach(window.clearTimeout);
      timeouts = [];
    };
  }, [reduceMotion]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6 py-16">
      <ReceiptPrinter.Root aria-label="Shop receipt printer" stage={stage} tone="light">
        <ReceiptPrinter.Machine>
          <ReceiptPrinter.Header className="pt-1.5">
            <ReceiptPrinter.Status>{STATUS_LABELS[stage]}</ReceiptPrinter.Status>
          </ReceiptPrinter.Header>
          <ReceiptPrinter.Screen className="bg-[#fafafa]! [background-image:repeating-linear-gradient(to_bottom,rgba(10,10,10,0.025)_0,rgba(10,10,10,0.025)_1px,transparent_1px,transparent_3px)]">
            <p className="font-mono text-xs text-neutral-500">Shop requests</p>
            <p className="mt-1 font-mono text-sm text-neutral-950 tabular-nums">
              {CART_ITEMS.length} {CART_ITEMS.length === 1 ? "product" : "products"} · ${total}
              <span aria-hidden="true" className="ml-1.5 inline-block h-[13px] w-[7px] bg-[#A3FF38] align-[-2px] ring-1 ring-[#82F200]" />
            </p>
          </ReceiptPrinter.Screen>
        </ReceiptPrinter.Machine>

        <ReceiptPrinter.Output>
          <ReceiptPrinter.Paper className="text-xs leading-5">
            <p className="text-center text-[11px] tracking-[0.14em] text-neutral-500 uppercase">Shop receipt</p>

            <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 text-neutral-500">
              <dt>Date</dt>
              <dd className="text-right text-neutral-950">
                {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </dd>
              <dt>Creator</dt>
              <dd className="text-right text-neutral-950">Jordan Lee</dd>
            </dl>

            <Divider />

            <ul className="flex flex-col gap-3">
              {CART_ITEMS.map((item) => (
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
            <p className="mt-1 text-neutral-500">Paid with content.</p>

            <Divider />

            <div className="flex items-center gap-2 font-bold uppercase">
              <ClockIcon aria-hidden="true" className="size-4 shrink-0" strokeWidth={2} />
              Pending approval
            </div>
            <p className="mt-2 leading-[1.45] text-neutral-500">
              Brands review your profile first. Approved content payments get a delivery deadline.
            </p>

            <div
              aria-hidden="true"
              className="mt-4 h-8 [background:repeating-linear-gradient(90deg,#0a0a0a_0_2px,transparent_2px_4px,#0a0a0a_4px_5px,transparent_5px_8px,#0a0a0a_8px_11px,transparent_11px_13px)]"
            />
          </ReceiptPrinter.Paper>
        </ReceiptPrinter.Output>
      </ReceiptPrinter.Root>
    </main>
  );
}
