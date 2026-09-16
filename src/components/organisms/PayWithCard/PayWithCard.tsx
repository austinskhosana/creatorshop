"use client";

import { useEffect, useState } from "react";
import { BookmarkIcon as BookmarkOutlineIcon } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolidIcon } from "@heroicons/react/24/solid";
import { CheckIcon } from "@heroicons/react/24/solid";
import Button from "@/components/atoms/Button/Button";
import PaymentOptionRow from "@/components/molecules/PaymentOptionRow/PaymentOptionRow";
import { cn } from "@/lib/utils";
import type { Listing } from "@/lib/listings/types";

interface PayWithCardProps {
  listing: Listing;
  saved?: boolean;
  onAddToCart?: (deliverableIndex: number) => void;
  onToggleSave?: (saved: boolean) => void;
}

function parseDeliverable(deliverable: string) {
  const [label, durationPart] = deliverable.split(" · ");
  const months = parseInt(durationPart ?? "", 10) || 1;
  return { label, months };
}

export default function PayWithCard({ listing, saved = false, onAddToCart, onToggleSave }: PayWithCardProps) {
  const { slug, deliverables, retailValue, months: totalMonths, slotsRemaining, totalSlots } = listing;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(saved);
  const [justAdded, setJustAdded] = useState(false);
  const soldOut = slotsRemaining === 0;
  const ratePerMonth = retailValue / totalMonths;

  useEffect(() => {
    if (!justAdded) return;
    const timeout = setTimeout(() => setJustAdded(false), 1800);
    return () => clearTimeout(timeout);
  }, [justAdded]);

  function toggleSave() {
    const next = !isSaved;
    setIsSaved(next);
    onToggleSave?.(next);
  }

  function handleAddToCart() {
    setJustAdded(true);
    onAddToCart?.(selectedIndex);
  }

  return (
    <div className="w-full rounded-[24px] border border-neutral-200 bg-white p-6">
      <p className="text-[12px] font-medium tracking-wide text-neutral-400 uppercase">Pay with</p>

      <div role="radiogroup" aria-label="Pay with" className="mt-3 flex flex-col gap-2">
        {deliverables.map((deliverable, index) => {
          const { label, months } = parseDeliverable(deliverable);
          const price = Math.round(ratePerMonth * months);
          return (
            <PaymentOptionRow
              key={deliverable}
              label={label}
              meta={`Access for ${months} month${months === 1 ? "" : "s"}`}
              price={price}
              selected={selectedIndex === index}
              onSelect={() => setSelectedIndex(index)}
            />
          );
        })}
      </div>

      <div className="mt-5 flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-100">
          <div
            className="h-full rounded-full bg-neutral-900"
            style={{ width: `${(slotsRemaining / totalSlots) * 100}%` }}
          />
        </div>
        <p className="shrink-0 text-[12px] text-neutral-400">
          {slotsRemaining} of {totalSlots} spots left
        </p>
      </div>

      <div className="mt-5 flex items-center gap-2">
        <Button
          variant="dark"
          size="lg"
          fullWidth
          disabled={soldOut}
          onClick={handleAddToCart}
          iconLeft={justAdded ? <CheckIcon aria-hidden="true" className="h-4 w-4" /> : undefined}
        >
          {soldOut ? "Sold out" : justAdded ? "Added to cart" : "Add to cart"}
        </Button>
        <button
          type="button"
          onClick={toggleSave}
          aria-pressed={isSaved}
          aria-label={isSaved ? "Remove from saved" : "Save for later"}
          className={cn(
            "flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-xl border border-neutral-200 transition-colors duration-150 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900",
            isSaved ? "text-neutral-950" : "text-neutral-400 hover:text-neutral-600",
          )}
        >
          {isSaved ? <BookmarkSolidIcon aria-hidden="true" className="h-5 w-5" /> : <BookmarkOutlineIcon aria-hidden="true" className="h-5 w-5" strokeWidth={1.75} />}
        </button>
      </div>

      <p className="mt-5 text-center text-[12px] text-neutral-400">
        Share this product page — <span className="rounded-md bg-neutral-50 px-1.5 py-0.5 font-mono text-neutral-500">creatorshop.com/store/{slug}</span>
      </p>
    </div>
  );
}
