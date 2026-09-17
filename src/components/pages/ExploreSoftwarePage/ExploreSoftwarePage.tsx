"use client";

import { useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import AppShell from "@/components/templates/AppShell/AppShell";
import ListingsToolbar from "@/components/organisms/ListingsToolbar/ListingsToolbar";
import ListingGrid from "@/components/organisms/ListingGrid/ListingGrid";
import { StoreSidebarCategoriesView } from "@/components/organisms/StoreSidebarCategories/StoreSidebarCategories";
import PromoBanner from "@/components/organisms/PromoBanner/PromoBanner";
import Pagination from "@/components/molecules/Pagination/Pagination";
import { CATEGORY_LABELS, DEFAULT_EXPLORE_FILTERS, filterListings, type ExploreFilters, type ExploreSort } from "@/lib/listings/explore";
import type { Listing } from "@/lib/listings/types";

const PAGE_SIZE = 9;

function SparkleIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-[15px] w-[15px]"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" /></svg>;
}

function DesignIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-[15px] w-[15px]"><path d="M4 20l4.5-1.5L19 8a2.12 2.12 0 0 0-3-3L5.5 15.5 4 20Z" /></svg>;
}

function MarketingIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-[15px] w-[15px]"><path d="M3.5 10v4a1 1 0 0 0 1 1h2l7 4V5l-7 4h-2a1 1 0 0 0-1 1Z" /><path d="M17 9.5a3.5 3.5 0 0 1 0 5" /></svg>;
}

function DevToolsIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-[15px] w-[15px]"><path d="M9 18l-6-6 6-6M15 6l6 6-6 6" /></svg>;
}

function ProductivityIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-[15px] w-[15px]"><path d="M13 3 4 14h6l-1 7 9-11h-6l1-7Z" /></svg>;
}

const CATEGORY_ICONS = {
  "AI Tools": <SparkleIcon />,
  Design: <DesignIcon />,
  Marketing: <MarketingIcon />,
  "Dev Tools": <DevToolsIcon />,
  Productivity: <ProductivityIcon />,
};

function getFilters(searchParams: URLSearchParams): ExploreFilters {
  const sort = searchParams.get("sort");

  return {
    search: searchParams.get("q") ?? DEFAULT_EXPLORE_FILTERS.search,
    category: searchParams.get("category") ?? DEFAULT_EXPLORE_FILTERS.category,
    platform: searchParams.get("platform") ?? DEFAULT_EXPLORE_FILTERS.platform,
    priceTier: searchParams.get("price") ?? DEFAULT_EXPLORE_FILTERS.priceTier,
    accessLength: searchParams.get("access") ?? DEFAULT_EXPLORE_FILTERS.accessLength,
    sort: sort === "popular" || sort === "ending" ? sort : "newest",
    inStockOnly: searchParams.get("inStock") === "1",
  };
}

interface ExploreSoftwarePageProps {
  listings: Listing[];
}

export default function ExploreSoftwarePage({ listings: allListings }: ExploreSoftwarePageProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filters = getFilters(searchParams);

  function updateFilter<Key extends keyof ExploreFilters>(key: Key, value: ExploreFilters[Key]) {
    const params = new URLSearchParams(searchParams.toString());
    const paramName: Record<keyof ExploreFilters, string> = {
      search: "q",
      category: "category",
      platform: "platform",
      priceTier: "price",
      accessLength: "access",
      sort: "sort",
      inStockOnly: "inStock",
    };
    const defaultValue = DEFAULT_EXPLORE_FILTERS[key];
    const serialized = typeof value === "boolean" ? (value ? "1" : "") : String(value);

    if (!serialized || value === defaultValue) params.delete(paramName[key]);
    else params.set(paramName[key], serialized);
    params.delete("page");

    window.history.replaceState(null, "", params.size ? `${pathname}?${params.toString()}` : pathname);
  }

  function goToPage(nextPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (nextPage <= 1) params.delete("page");
    else params.set("page", String(nextPage));

    window.history.replaceState(null, "", params.size ? `${pathname}?${params.toString()}` : pathname);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const visibleListings = useMemo(() => filterListings(allListings, filters), [allListings, filters]);
  const totalPages = Math.max(1, Math.ceil(visibleListings.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number(searchParams.get("page")) || 1), totalPages);
  const paginatedListings = visibleListings.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const categories = useMemo(
    () => [
      { id: "all", label: "All products", count: allListings.filter((listing) => listing.title.toLocaleLowerCase().includes(filters.search.trim().toLocaleLowerCase()) || listing.brandName.toLocaleLowerCase().includes(filters.search.trim().toLocaleLowerCase())).length },
      ...CATEGORY_LABELS.map((label) => ({
        id: label,
        label,
        icon: CATEGORY_ICONS[label],
        count: allListings.filter((listing) => (listing.title.toLocaleLowerCase().includes(filters.search.trim().toLocaleLowerCase()) || listing.brandName.toLocaleLowerCase().includes(filters.search.trim().toLocaleLowerCase())) && listing.category === label).length,
      })),
    ],
    [allListings, filters.search],
  );

  return (
    <AppShell
      activeHref="/explore"
      userName="Jordan Lee"
      searchValue={filters.search}
      onSearchChange={(value) => updateFilter("search", value)}
      cartCount={2}
      savedCount={7}
      messagesCount={3}
      sidebarChildren={<StoreSidebarCategoriesView categories={categories} activeId={filters.category} onChange={(value) => updateFilter("category", value)} />}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 py-6 sm:px-8 sm:py-8">
        <div>
          <div className="mb-6"><h1 className="text-balance text-2xl font-semibold text-neutral-900">Store</h1></div>
          <ListingsToolbar
            resultCount={visibleListings.length}
            platform={filters.platform}
            onPlatformChange={(value) => updateFilter("platform", value)}
            priceTier={filters.priceTier}
            onPriceTierChange={(value) => updateFilter("priceTier", value)}
            accessLength={filters.accessLength}
            onAccessLengthChange={(value) => updateFilter("accessLength", value)}
            sort={filters.sort}
            onSortChange={(value) => updateFilter("sort", value as ExploreSort)}
            inStockOnly={filters.inStockOnly}
            onInStockOnlyChange={(value) => updateFilter("inStockOnly", value)}
          />
        </div>
        <PromoBanner eyebrow="No cash. No gifting. A real transaction." title="Pay with a post." description="Shop vetted software from real brands and pay with content. Add products to your cart, check out in one tap, and unlock access when your post goes live." />
        <section>
          <h2 className="mb-4 text-[16px] font-semibold text-neutral-900">All products</h2>
          <ListingGrid listings={paginatedListings} />
          <div className="mt-8">
            <Pagination page={page} totalPages={totalPages} onPageChange={goToPage} />
          </div>
        </section>
      </div>
    </AppShell>
  );
}
