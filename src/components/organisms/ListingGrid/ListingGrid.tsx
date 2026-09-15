import ListingCard from "@/components/organisms/ListingCard/ListingCard";
import EmptyState from "@/components/molecules/EmptyState/EmptyState";

export interface Listing {
  slug: string;
  brandName: string;
  title: string;
  description: string;
  deliverables: string[];
  retailValue: number;
  months: number;
  slotsRemaining: number;
  totalSlots: number;
  category?: string | null;
  platform?: string | null;
  verified?: boolean;
  saved?: boolean;
}

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
  if (listings.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} action={emptyAction} />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {listings.map((listing) => (
        <ListingCard key={listing.slug} {...listing} />
      ))}
    </div>
  );
}
