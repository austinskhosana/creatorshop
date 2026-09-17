"use client";

import { useEffect, useState } from "react";
import { motion, useAnimationControls, useReducedMotion } from "framer-motion";
import { ArrowTopRightOnSquareIcon, BanknotesIcon, BookmarkIcon as BookmarkOutlineIcon } from "@heroicons/react/24/outline";
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

function CampaignBrief({ listing }: { listing: Listing }) {
  const softwareUrl = listing.websiteUrl ?? `/software/${listing.slug}`;

  return (
    <section aria-labelledby="campaign-brief-heading">
      <div className="flex items-center justify-between gap-4">
        <h2 id="campaign-brief-heading" className="flex items-center gap-2 text-[17px] leading-5 font-semibold tracking-[-0.02em] text-neutral-950">
          <BanknotesIcon aria-hidden="true" className="h-[19px] w-[19px] text-neutral-600" strokeWidth={1.8} />
          Campaign brief
        </h2>
        <a
          href={softwareUrl}
          target={listing.websiteUrl ? "_blank" : undefined}
          rel={listing.websiteUrl ? "noreferrer" : undefined}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-neutral-200 px-2.5 py-1.5 text-[12px] font-medium text-neutral-600 transition-colors hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
        >
          Visit site
          <ArrowTopRightOnSquareIcon aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.8} />
        </a>
      </div>

      <div aria-hidden="true" className="mt-5 h-px bg-neutral-200" />

      <dl className="mt-5 space-y-4">
        <div className="grid items-start gap-1.5 sm:grid-cols-[128px_1fr] sm:gap-3">
          <dt className="text-[11px] leading-5 font-semibold tracking-[0.1em] text-neutral-400 uppercase">
            Campaign goal
          </dt>
          <dd className="text-[14px] leading-6 font-normal tracking-[-0.01em] text-neutral-700">Show your audience how {listing.brandName} turns a design idea into a real, publishable website.</dd>
        </div>
        <div className="grid items-start gap-1.5 sm:grid-cols-[128px_1fr] sm:gap-3">
          <dt className="text-[11px] leading-5 font-semibold tracking-[0.1em] text-neutral-400 uppercase">
            Timeline
          </dt>
          <dd className="text-[14px] leading-6 font-medium tracking-[-0.01em] text-neutral-700">7 days</dd>
        </div>
        <div className="grid items-start gap-1.5 sm:grid-cols-[128px_1fr] sm:gap-3">
          <dt className="text-[11px] leading-5 font-semibold tracking-[0.1em] text-neutral-400 uppercase">
            Access
          </dt>
          <dd className="text-[14px] leading-6 font-medium tracking-[-0.01em] text-neutral-700">{listing.months} month{listing.months === 1 ? "" : "s"}</dd>
        </div>
        <div className="grid items-start gap-1.5 sm:grid-cols-[128px_1fr] sm:gap-3">
          <dt className="text-[11px] leading-5 font-semibold tracking-[0.1em] text-neutral-400 uppercase">
            Retail value
          </dt>
          <dd className="text-[14px] leading-6 font-medium tracking-[-0.01em] text-neutral-700">${listing.retailValue}</dd>
        </div>
      </dl>
    </section>
  );
}

function CartIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
      <circle cx="9" cy="20" r="1.1" />
      <circle cx="17" cy="20" r="1.1" />
      <path d="M2.5 3.5h2.1l1.8 10.9a1.75 1.75 0 0 0 1.73 1.47h8.6a1.75 1.75 0 0 0 1.73-1.47L19.9 7.5H5.9" />
    </svg>
  );
}

export default function PayWithCard({ listing, saved = false, onAddToCart, onToggleSave }: PayWithCardProps) {
  const { deliverables, slotsRemaining } = listing;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(saved);
  const [justAdded, setJustAdded] = useState(false);
  const soldOut = slotsRemaining === 0;
  const cartIconControls = useAnimationControls();
  const reduceMotion = useReducedMotion();

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

  async function handleAddToCart() {
    if (reduceMotion) {
      await cartIconControls.start({ opacity: [1, 0.4, 1], transition: { duration: 0.3, ease: "easeOut" } });
    } else {
      await cartIconControls.start({ scale: 1.3, rotate: -12, transition: { duration: 0.12, ease: [0.23, 1, 0.32, 1] } });
      await cartIconControls.start({ scale: 1, rotate: 0, transition: { type: "spring", duration: 0.4, bounce: 0.3 } });
    }
    setJustAdded(true);
    onAddToCart?.(selectedIndex);
  }

  return (
    <div className="w-full rounded-[14px] border border-neutral-200 bg-white p-5 sm:p-[22px]">
      <CampaignBrief listing={listing} />

      <p className="mt-6 text-[11px] font-semibold tracking-[0.1em] text-neutral-400 uppercase">Pay with</p>

      <div role="radiogroup" aria-label="Pay with" className="mt-2.5 flex flex-col gap-2">
        {deliverables.map((deliverable, index) => {
          const { label, months } = parseDeliverable(deliverable);
          return (
            <PaymentOptionRow
              key={deliverable}
              label={label}
              meta={`Access for ${months} month${months === 1 ? "" : "s"}`}
              selected={selectedIndex === index}
              onSelect={() => setSelectedIndex(index)}
              showPrice={false}
            />
          );
        })}
      </div>

      <div className="mt-5 flex items-center gap-2">
        <Button
          variant="dark"
          size="lg"
          fullWidth
          disabled={soldOut}
          onClick={handleAddToCart}
          iconLeft={
            justAdded ? (
              <CheckIcon aria-hidden="true" className="h-4 w-4" />
            ) : (
              <motion.span className="inline-flex" animate={cartIconControls}>
                <CartIcon />
              </motion.span>
            )
          }
          className="min-h-[48px] rounded-[9px] text-[14px] tracking-[-0.01em]"
          style={{
            borderRadius: "9px",
            padding: "8px 14px",
            fontWeight: 500,
            letterSpacing: "normal",
            background: "linear-gradient(180deg, #323232 0%, #222222 100%)",
            boxShadow: [
              "inset 0 0.5px 1px rgba(255,255,255,0.15)",
              "inset 0 -1px 1.2px 0.35px rgba(18,18,18,1)",
              "0 2px 3px -1px rgba(13,13,13,0.5)",
              "0 0 0 1px rgba(51,51,51,1)",
            ].join(", "),
          }}
        >
          {soldOut ? "Sold out" : justAdded ? "Added to cart" : "Add to cart"}
        </Button>
        <button
          type="button"
          onClick={toggleSave}
          aria-pressed={isSaved}
          aria-label={isSaved ? "Remove from saved" : "Save for later"}
          className={cn(
            "flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-[9px] border border-neutral-200 transition-colors duration-150 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900",
            isSaved ? "text-neutral-950" : "text-neutral-400 hover:text-neutral-600",
          )}
        >
          {isSaved ? <BookmarkSolidIcon aria-hidden="true" className="h-5 w-5" /> : <BookmarkOutlineIcon aria-hidden="true" className="h-5 w-5" strokeWidth={1.75} />}
        </button>
      </div>
    </div>
  );
}
