"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import ListingCard from "@/components/organisms/ListingCard/ListingCard";
import EmptyState from "@/components/molecules/EmptyState/EmptyState";
import type { Listing } from "@/lib/listings/types";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

interface ListingGridProps {
  listings: Listing[];
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: { label: string; href: string };
}

export default function ListingGrid({
  listings,
  emptyTitle = "No products match your filters",
  emptyDescription = "Try a different category, or clear your search.",
  emptyAction,
}: ListingGridProps) {
  const reduceMotion = useReducedMotion();

  if (listings.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} action={emptyAction} />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence mode="popLayout" initial={false}>
        {listings.map((listing, index) => (
          <motion.div
            key={listing.slug}
            layout
            initial={{ opacity: 0, y: reduceMotion ? 0 : 8, scale: reduceMotion ? 1 : 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.98, transition: { duration: 0.12, ease: "easeOut" } }}
            transition={{ duration: 0.22, ease: EASE_OUT, delay: reduceMotion ? 0 : Math.min(index, 6) * 0.025 }}
          >
            <ListingCard {...listing} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
