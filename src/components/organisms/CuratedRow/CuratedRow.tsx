"use client";

import { ReactNode, useRef } from "react";
import ListingCard from "@/components/organisms/ListingCard/ListingCard";
import type { Listing } from "@/lib/listings/types";

function ChevronLeftIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

interface CuratedRowProps {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  listings: Listing[];
}

export default function CuratedRow({ icon, title, subtitle, listings }: CuratedRowProps) {
  const railRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "left" | "right") {
    railRef.current?.scrollBy({ left: direction === "left" ? -320 : 320, behavior: "smooth" });
  }

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <h2 className="flex items-center gap-1.5 text-[16px] font-semibold text-neutral-900">
            {icon}
            {title}
          </h2>
          {subtitle && <span className="text-[13px] text-neutral-400">{subtitle}</span>}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Scroll left"
            onClick={() => scroll("left")}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 transition-[background-color,color,transform] duration-150 hover:bg-neutral-100 hover:text-neutral-700 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          >
            <ChevronLeftIcon />
          </button>
          <button
            type="button"
            aria-label="Scroll right"
            onClick={() => scroll("right")}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 transition-[background-color,color,transform] duration-150 hover:bg-neutral-100 hover:text-neutral-700 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          >
            <ChevronRightIcon />
          </button>
        </div>
      </div>

      <div ref={railRef} className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 scroll-smooth [scrollbar-width:thin]">
        {listings.map((listing) => (
          <div key={listing.slug} className="w-[min(82vw,320px)] flex-none snap-start sm:w-[calc((100%-16px)/2)] lg:w-[calc((100%-32px)/3)]">
            <ListingCard {...listing} />
          </div>
        ))}
      </div>
    </section>
  );
}
