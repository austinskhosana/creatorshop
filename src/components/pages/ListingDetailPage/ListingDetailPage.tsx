"use client";

import Link from "next/link";
import AppShell from "@/components/templates/AppShell/AppShell";
import ListingHeader from "@/components/organisms/ListingHeader/ListingHeader";
import PayWithCard from "@/components/organisms/PayWithCard/PayWithCard";
import type { Listing } from "@/lib/listings/types";

interface ListingDetailPageProps {
  listing: Listing;
}

export default function ListingDetailPage({ listing }: ListingDetailPageProps) {
  return (
    <AppShell activeHref="/explore" userName="Jordan Lee" cartCount={2} savedCount={7} messagesCount={3}>
      <div className="flex h-full flex-col px-5 py-6 sm:px-8 sm:py-8">
        <nav aria-label="Breadcrumb" className="text-[13px] text-neutral-400">
          <Link href="/explore" className="hover:text-neutral-600">
            All products
          </Link>{" "}
          / <span className="text-neutral-600">{listing.title}</span>
        </nav>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="flex w-full max-w-md flex-col items-center gap-8">
            <ListingHeader
              slug={listing.slug}
              brandName={listing.brandName}
              title={listing.title}
              description={listing.description}
              category={listing.category}
            />
            <PayWithCard listing={listing} saved={listing.saved} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
