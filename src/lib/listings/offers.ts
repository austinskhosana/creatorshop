import type { ListingOffer } from "@/lib/data/schema";
import type { Listing } from "@/lib/listings/types";
import { MOCK_LISTINGS } from "@/lib/mock-listings";

/**
 * The mock catalog stores offers as display strings ("IG carousel · 3mo"). This turns them into
 * `listing_offers` rows. Ids are derived from the label until the table hands out real ones.
 */
export function getListingOffers(listing: Listing): ListingOffer[] {
  return listing.deliverables.map((deliverable) => {
    const [label, durationPart] = deliverable.split(" · ");
    const months = parseInt(durationPart ?? "", 10) || listing.months;
    const key = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return { id: `${listing.slug}--${key}-${months}mo`, listingSlug: listing.slug, label, months };
  });
}

export function getListing(slug: string) {
  return MOCK_LISTINGS.find((listing) => listing.slug === slug);
}

/** The listing and offer an id points at, falling back to the first offer if the id is stale. */
export function resolveOffer(listingSlug: string, offerId: string) {
  const listing = getListing(listingSlug);
  if (!listing) return null;
  const offers = getListingOffers(listing);
  const offer = offers.find((candidate) => candidate.id === offerId) ?? offers[0];
  return offer ? { listing, offer } : null;
}

export function formatAccess(months: number) {
  return `${months} month${months === 1 ? "" : "s"}`;
}
