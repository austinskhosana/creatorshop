"use client";

import { FormEvent, useRef, useState } from "react";
import Link from "next/link";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import Button from "@/components/atoms/Button/Button";
import { GenieLamp } from "@/components/atoms/GenieLamp";
import { TicketCard } from "@/components/molecules/TicketCard";
import { MOCK_LISTINGS } from "@/lib/mock-listings";
import { toBrandKey } from "@/lib/mock-genie-index";
import { creatorStore, type GenieIndexRow } from "@/lib/store/creator-store";

interface MakeAWishFormProps {
  /** The current index, so a repeat wish is caught before it's made. */
  rows: GenieIndexRow[];
}

type Outcome =
  | { kind: "empty" }
  | { kind: "made"; brandName: string }
  | { kind: "already-wished"; brandName: string }
  | { kind: "on-creatorshop"; brandName: string; slug: string };

/** "figma.com" or "https://www.figma.com/pricing" → { brandName: "Figma", website: "figma.com" }. */
function parseWish(input: string) {
  const value = input.trim();
  const looksLikeUrl = /^https?:\/\//i.test(value) || /^[^\s]+\.[a-z]{2,}(\/.*)?$/i.test(value);
  if (!looksLikeUrl) return { brandName: value, website: undefined };
  const host = value.replace(/^https?:\/\//i, "").replace(/^www\./i, "").split("/")[0].toLowerCase();
  const label = host.split(".")[0];
  return { brandName: label.charAt(0).toUpperCase() + label.slice(1), website: host };
}

const LINK_CLASS =
  "rounded font-medium text-neutral-950 underline underline-offset-2 transition-colors duration-150 hover:text-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900";

export default function MakeAWishForm({ rows }: MakeAWishFormProps) {
  const [value, setValue] = useState("");
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    // The button stays enabled so it reads clearly on the banner; an empty wish gets a nudge instead.
    if (value.trim().length < 2) {
      setOutcome({ kind: "empty" });
      inputRef.current?.focus();
      return;
    }
    const { brandName, website } = parseWish(value);
    const brandKey = toBrandKey(brandName);

    const listing = MOCK_LISTINGS.find((item) => toBrandKey(item.brandName ?? item.title) === brandKey);
    if (listing) {
      setOutcome({ kind: "on-creatorshop", brandName: listing.brandName ?? listing.title, slug: listing.slug });
      return;
    }

    const existing = rows.find((row) => row.brandKey === brandKey);
    if (existing?.wished) {
      setOutcome({ kind: "already-wished", brandName: existing.brandName });
      return;
    }

    // Wishing for a brand already on the index adds a vote under its existing name.
    creatorStore.makeWish(existing?.brandName ?? brandName, existing?.website ?? website);
    setOutcome({ kind: "made", brandName: existing?.brandName ?? brandName });
    setValue("");
  }

  return (
    <TicketCard
      icon={<SparklesIcon strokeWidth={1.75} />}
      eyebrow="Can’t find it in the shop?"
      title="Welcome to the Genie Index"
      description="Tell us the software you want to pay for with a post. Every wish goes into our pitch to the brand."
      admit="Make a wish"
      serial="NO. 000777"
      art={<GenieLamp />}
      sansLabels
    >
      {/* Beside the stub, the status hangs below the form so the empty line doesn't pull the copy off centre. */}
      <div className="relative mt-6 max-w-xl">
        <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-2 sm:flex-row">
          <label htmlFor="make-a-wish" className="sr-only">
            Software name or website
          </label>
          <input
            ref={inputRef}
            id="make-a-wish"
            type="text"
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              setOutcome(null);
            }}
            placeholder="Name or website, e.g. figma.com"
            autoComplete="off"
            aria-describedby="make-a-wish-status"
            aria-invalid={outcome?.kind === "empty" || undefined}
            className="min-h-11 flex-1 rounded-[9px] border border-neutral-200 bg-white px-3.5 text-[14px] text-neutral-900 placeholder:text-neutral-400 transition-[border-color,box-shadow] duration-150 focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200 focus:outline-none aria-[invalid]:border-red-300 aria-[invalid]:focus:ring-red-100"
          />
          <Button
            type="submit"
            variant="premium"
            iconLeft={<SparklesIcon aria-hidden="true" className="size-4" strokeWidth={1.75} />}
            className="min-h-11"
            style={{ borderRadius: "9px", padding: "8px 16px", fontWeight: 500, letterSpacing: "normal" }}
          >
            Make a wish
          </Button>
        </form>

        <p id="make-a-wish-status" aria-live="polite" className="mt-3 min-h-5 sm:absolute sm:inset-x-0 sm:top-full text-[13px] text-neutral-600">
          {outcome?.kind === "empty" && <span className="text-red-600">Type a software name or paste its website first.</span>}
          {outcome?.kind === "made" && (
            <span className="inline-flex flex-wrap items-center gap-x-1.5 gap-y-1">
              <CheckCircleIcon aria-hidden="true" className="size-4 text-neutral-950" />
              <span className="font-medium text-neutral-950">Wish made for {outcome.brandName}.</span>
            </span>
          )}
          {outcome?.kind === "already-wished" && <>You&rsquo;ve already wished for {outcome.brandName}.</>}
          {outcome?.kind === "on-creatorshop" && (
            <>
              Good news: {outcome.brandName} is already on Creatorshop.{" "}
              <Link href={`/software/${outcome.slug}`} className={LINK_CLASS}>
                View it
              </Link>
            </>
          )}
        </p>
      </div>
    </TicketCard>
  );
}
