import type { Listing } from "@/lib/listings/types";

export const CATEGORY_LABELS = ["AI Tools", "Design", "Marketing", "Dev Tools", "Productivity"] as const;

export type ExploreSort = "newest" | "popular" | "ending";

export interface ExploreFilters {
  search: string;
  category: string;
  platform: string;
  priceTier: string;
  accessLength: string;
  sort: ExploreSort;
  inStockOnly: boolean;
}

export const DEFAULT_EXPLORE_FILTERS: ExploreFilters = {
  search: "",
  category: "all",
  platform: "all",
  priceTier: "all",
  accessLength: "all",
  sort: "newest",
  inStockOnly: false,
};

function priceTierMatches(tier: string, retailValue: number) {
  if (tier === "all") return true;
  if (tier === "under-150") return retailValue < 150;
  if (tier === "150-250") return retailValue >= 150 && retailValue <= 250;
  return tier === "over-250" && retailValue > 250;
}

function matchesFilters(listing: Listing, filters: ExploreFilters) {
  const query = filters.search.trim().toLocaleLowerCase();
  return (
    (!query || listing.title.toLocaleLowerCase().includes(query) || listing.brandName.toLocaleLowerCase().includes(query)) &&
    (filters.category === "all" || listing.category === filters.category) &&
    (filters.platform === "all" || listing.platform === filters.platform) &&
    (filters.accessLength === "all" || listing.months === Number(filters.accessLength)) &&
    priceTierMatches(filters.priceTier, listing.retailValue) &&
    (!filters.inStockOnly || listing.slotsRemaining > 0)
  );
}

export function filterListings(listings: Listing[], filters: ExploreFilters) {
  const filtered = listings.filter((listing) => matchesFilters(listing, filters));

  if (filters.sort === "ending") return [...filtered].sort((a, b) => a.slotsRemaining - b.slotsRemaining);
  if (filters.sort === "popular") return [...filtered].sort((a, b) => b.totalSlots - b.slotsRemaining - (a.totalSlots - a.slotsRemaining));
  return filtered;
}

/** Counts per category under every active filter except category itself. */
export function countListingsByCategory(listings: Listing[], filters: ExploreFilters) {
  const matching = listings.filter((listing) => matchesFilters(listing, { ...filters, category: "all" }));
  const counts: Record<string, number> = { all: matching.length };
  for (const label of CATEGORY_LABELS) counts[label] = matching.filter((listing) => listing.category === label).length;
  return counts;
}
