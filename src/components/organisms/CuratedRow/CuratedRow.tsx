import { ReactNode } from "react";
import ListingCard from "@/components/organisms/ListingCard/ListingCard";
import type { Listing } from "@/components/organisms/ListingGrid/ListingGrid";

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
            className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 transition-[background-color,color,transform] duration-150 hover:bg-neutral-100 hover:text-neutral-700 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          >
            <ChevronLeftIcon />
          </button>
          <button
            type="button"
            aria-label="Scroll right"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 transition-[background-color,color,transform] duration-150 hover:bg-neutral-100 hover:text-neutral-700 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          >
            <ChevronRightIcon />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((listing) => (
          <ListingCard key={listing.slug} {...listing} />
        ))}
      </div>
    </section>
  );
}
