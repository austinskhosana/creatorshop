"use client";

import { useState } from "react";
import Link from "next/link";
import Badge from "@/components/atoms/Badge/Badge";
import Button from "@/components/atoms/Button/Button";

interface ListingCardProps {
  slug: string;
  brandName: string;
  title: string;
  description: string;
  deliverables: string[];
  retailValue: number;
  slotsRemaining: number;
  totalSlots: number;
  verified?: boolean;
  saved?: boolean;
}

function ImagePlaceholderIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-neutral-300">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  );
}

function VerifiedIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 flex-shrink-0 text-neutral-400">
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.5l2.25 2.25L15.5 9.5" />
    </svg>
  );
}

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <span className="relative block h-4 w-4">
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={[
          "absolute inset-0 h-4 w-4 transition-opacity duration-150 ease-[cubic-bezier(0.2,0,0,1)]",
          filled ? "opacity-0" : "opacity-100",
        ].join(" ")}
      >
        <path d="M6 3.75A1.75 1.75 0 0 1 7.75 2h8.5A1.75 1.75 0 0 1 18 3.75V21l-6-3.75L6 21V3.75Z" />
      </svg>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={[
          "absolute inset-0 h-4 w-4 transition-opacity duration-150 ease-[cubic-bezier(0.2,0,0,1)]",
          filled ? "opacity-100" : "opacity-0",
        ].join(" ")}
      >
        <path d="M6 3.75A1.75 1.75 0 0 1 7.75 2h8.5A1.75 1.75 0 0 1 18 3.75V21l-6-3.75L6 21V3.75Z" />
      </svg>
    </span>
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

export default function ListingCard({
  slug,
  brandName,
  title,
  description,
  deliverables,
  retailValue,
  slotsRemaining,
  totalSlots,
  verified = true,
  saved = false,
}: ListingCardProps) {
  const [isSaved, setIsSaved] = useState(saved);
  const soldOut = slotsRemaining === 0;

  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-neutral-200 p-3">
      <div className="relative">
        <Link href={soldOut ? "#" : `/software/${slug}`} aria-disabled={soldOut} tabIndex={soldOut ? -1 : undefined} className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2">
          <div className="flex aspect-[16/10] items-center justify-center rounded-lg border border-neutral-200 bg-neutral-100">
            <ImagePlaceholderIcon />
          </div>
        </Link>

        <span
          className={[
            "pointer-events-none absolute top-2 left-2 rounded-full px-2 py-0.5 text-[11px] font-medium",
            soldOut ? "bg-neutral-900 text-white" : "bg-white/90 text-neutral-600 ring-1 ring-neutral-200",
          ].join(" ")}
        >
          {soldOut ? "Sold out" : `${slotsRemaining} of ${totalSlots} spots left`}
        </span>

        <button
          type="button"
          onClick={() => setIsSaved((v) => !v)}
          aria-pressed={isSaved}
          aria-label={isSaved ? "Remove from saved" : "Save for later"}
          className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-neutral-500 ring-1 ring-neutral-200 transition-[color,transform] duration-150 hover:text-neutral-900 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
        >
          <BookmarkIcon filled={isSaved} />
        </button>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1 text-[12px] text-neutral-400">
          <span className="truncate">{brandName}</span>
          {verified && <VerifiedIcon />}
        </div>

        <Link href={soldOut ? "#" : `/software/${slug}`} tabIndex={soldOut ? -1 : undefined} className="mt-1 focus-visible:outline-none">
          <p className="text-balance text-[14px] leading-snug font-semibold text-neutral-900">{title}</p>
        </Link>

        <p className="text-pretty mt-1 line-clamp-2 text-[13px] leading-relaxed text-neutral-400">{description}</p>

        <div className="mt-2 flex flex-wrap gap-1.5">
          {deliverables.map((deliverable) => (
            <Badge key={deliverable} variant="tag" label={deliverable} />
          ))}
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-[15px] font-semibold tabular-nums text-neutral-900">${retailValue}</p>
          <p className="text-[11px] text-neutral-400">retail value</p>
        </div>
        <Button
          variant="dark"
          size="sm"
          iconLeft={<CartIcon />}
          disabled={soldOut}
          style={{ borderRadius: "8px", boxShadow: "none" }}
        >
          {soldOut ? "Sold out" : "Add to cart"}
        </Button>
      </div>
    </article>
  );
}
