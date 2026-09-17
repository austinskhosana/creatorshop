"use client";

import ListingGrid from "@/components/organisms/ListingGrid/ListingGrid";
import { CreatorShell } from "@/components/templates/CreatorShell";
import { MOCK_LISTINGS } from "@/lib/mock-listings";

export default function WishlistPage() {
  return (
    <CreatorShell>
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-8 py-8">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Wishlist</h1>
          <p className="mt-1 text-sm text-neutral-400">Your collection of products to explore and shop next.</p>
        </div>

        <ListingGrid listings={MOCK_LISTINGS} />
      </div>
    </CreatorShell>
  );
}
