"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useAnimationControls, useReducedMotion } from "framer-motion";
import Badge from "@/components/atoms/Badge/Badge";
import Button from "@/components/atoms/Button/Button";

interface ListingCardProps {
  slug: string;
  title: string;
  description: string;
  deliverables: string[];
  retailValue: number;
  slotsRemaining: number;
  totalSlots: number;
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

function InstagramIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3">
      <path d="M16.5 3c.3 1.9 1.6 3.4 3.5 3.7v2.6c-1.3 0-2.5-.4-3.5-1.1v6.4c0 3-2.4 5.4-5.4 5.4S5.7 17.6 5.7 14.6c0-2.8 2.1-5.1 4.8-5.4v2.7c-1.3.2-2.3 1.4-2.3 2.7 0 1.5 1.2 2.7 2.7 2.7s2.7-1.2 2.7-2.7V3h3Z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-3 w-3">
      <rect x="2" y="5" width="20" height="14" rx="4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M10 9.5v5l4.5-2.5Z" fill="currentColor" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-3 w-3">
      <path d="M4 4l16 16M20 4L4 20" />
    </svg>
  );
}

function getDeliverableIcon(deliverable: string) {
  const platform = deliverable.split(" ")[0];
  if (platform === "IG") return <InstagramIcon />;
  if (platform === "TikTok") return <TikTokIcon />;
  if (platform === "YouTube") return <YouTubeIcon />;
  if (platform === "X") return <XIcon />;
  return undefined;
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
  title,
  description,
  deliverables,
  retailValue,
  slotsRemaining,
  totalSlots,
  saved = false,
}: ListingCardProps) {
  const [isSaved, setIsSaved] = useState(saved);
  const soldOut = slotsRemaining === 0;
  const cartIconControls = useAnimationControls();
  const reduceMotion = useReducedMotion();

  function handleAddToCart() {
    if (reduceMotion) {
      cartIconControls.start({ opacity: [1, 0.4, 1], transition: { duration: 0.3, ease: "easeOut" } });
      return;
    }
    cartIconControls
      .start({ scale: 1.3, rotate: -12, transition: { duration: 0.12, ease: [0.23, 1, 0.32, 1] } })
      .then(() => cartIconControls.start({ scale: 1, rotate: 0, transition: { type: "spring", duration: 0.4, bounce: 0.3 } }));
  }

  return (
    <article className="flex flex-col gap-3 rounded-3xl border border-neutral-200 p-4">
      <div className="relative">
        {soldOut ? (
          <div className="flex aspect-[16/10] items-center justify-center rounded-xl border border-neutral-200 bg-neutral-100" aria-label={`${title} is sold out`}>
            <ImagePlaceholderIcon />
          </div>
        ) : (
          <Link href={`/software/${slug}`} className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2">
            <div className="flex aspect-[16/10] items-center justify-center rounded-xl border border-neutral-200 bg-neutral-100">
              <ImagePlaceholderIcon />
            </div>
          </Link>
        )}

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
        {soldOut ? (
          <p className="text-balance text-[14px] leading-snug font-semibold text-neutral-900">{title}</p>
        ) : (
          <Link href={`/software/${slug}`} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2">
            <p className="text-balance text-[14px] leading-snug font-semibold text-neutral-900">{title}</p>
          </Link>
        )}

        <p className="text-pretty mt-1 line-clamp-2 text-[13px] leading-relaxed text-neutral-400">{description}</p>

        <div className="mt-2 flex flex-wrap gap-1.5">
          {deliverables.map((deliverable) => (
            <Badge key={deliverable} variant="tag" label={deliverable} icon={getDeliverableIcon(deliverable)} />
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
          iconLeft={
            <motion.span className="inline-flex" animate={cartIconControls}>
              <CartIcon />
            </motion.span>
          }
          onClick={handleAddToCart}
          disabled={soldOut}
          style={{
            borderRadius: "8px",
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
          {soldOut ? "Sold out" : "Add to cart"}
        </Button>
      </div>
    </article>
  );
}
