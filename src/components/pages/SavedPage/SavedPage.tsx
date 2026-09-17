"use client";

import { CreatorShell } from "@/components/templates/CreatorShell";
import ListingGrid from "@/components/organisms/ListingGrid/ListingGrid";
import { MOCK_LISTINGS } from "@/lib/mock-listings";

export default function SavedPage() {
  const saved = MOCK_LISTINGS.filter((listing) => listing.saved);

  return (
    <CreatorShell>
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-8 py-8">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Saved</h1>
          <p className="mt-1 text-sm text-neutral-400">Products you&rsquo;ve bookmarked to shop later.</p>
        </div>

        <ListingGrid
          listings={saved}
          emptyTitle="Nothing saved yet"
          emptyDescription="Bookmark a product from the store and it'll show up here."
          emptyAction={{ label: "Browse the store", href: "/explore" }}
        />
      </div>
    </CreatorShell>
  );
}
