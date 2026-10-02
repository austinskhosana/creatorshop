import type { ReactNode } from "react";
import ListingCard from "@/components/organisms/ListingCard/ListingCard";
import EmptyState from "@/components/molecules/EmptyState/EmptyState";
import type { Listing } from "@/lib/listings/types";

interface ListingGridProps {
  listings: Listing[];
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: ReactNode;
  emptyAction?: { label: string; href?: string; onClick?: () => void };
}

export default function ListingGrid({
  listings,
  emptyTitle = "No products match your filters",
  emptyDescription = "Try a different category, or clear your search.",
  emptyIcon,
  emptyAction,
}: ListingGridProps) {
  if (listings.length === 0) {
    return <EmptyState icon={emptyIcon} title={emptyTitle} description={emptyDescription} action={emptyAction} />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {listings.map((listing) => (
        <ListingCard key={listing.slug} {...listing} />
      ))}
    </div>
  );
}
