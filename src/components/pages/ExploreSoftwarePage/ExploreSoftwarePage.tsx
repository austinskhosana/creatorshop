"use client";

import { useMemo, useState } from "react";
import AppShell from "@/components/templates/AppShell/AppShell";
import ListingsToolbar from "@/components/organisms/ListingsToolbar/ListingsToolbar";
import ListingGrid from "@/components/organisms/ListingGrid/ListingGrid";
import CategoryNavList from "@/components/molecules/CategoryNavList/CategoryNavList";
import PromoBanner from "@/components/organisms/PromoBanner/PromoBanner";
import CuratedRow from "@/components/organisms/CuratedRow/CuratedRow";
import { MOCK_LISTINGS } from "@/lib/mock-listings";

function SparkleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-[15px] w-[15px]">
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />
    </svg>
  );
}

function DesignIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-[15px] w-[15px]">
      <path d="M4 20l4.5-1.5L19 8a2.12 2.12 0 0 0-3-3L5.5 15.5 4 20Z" />
    </svg>
  );
}

function MarketingIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-[15px] w-[15px]">
      <path d="M3.5 10v4a1 1 0 0 0 1 1h2l7 4V5l-7 4h-2a1 1 0 0 0-1 1Z" />
      <path d="M17 9.5a3.5 3.5 0 0 1 0 5" />
    </svg>
  );
}

function DevToolsIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-[15px] w-[15px]">
      <path d="M9 18l-6-6 6-6M15 6l6 6-6 6" />
    </svg>
  );
}

function ProductivityIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-[15px] w-[15px]">
      <path d="M13 3 4 14h6l-1 7 9-11h-6l1-7Z" />
    </svg>
  );
}

function FeaturedIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-neutral-900">
      <path d="M13 3 4 14h6l-1 7 9-11h-6l1-7Z" />
    </svg>
  );
}

const CATEGORY_META: { label: string; icon: React.ReactNode }[] = [
  { label: "AI Tools", icon: <SparkleIcon /> },
  { label: "Design", icon: <DesignIcon /> },
  { label: "Marketing", icon: <MarketingIcon /> },
  { label: "Dev Tools", icon: <DevToolsIcon /> },
  { label: "Productivity", icon: <ProductivityIcon /> },
];

function priceTierMatch(tier: string, retailValue: number) {
  if (tier === "all") return true;
  if (tier === "under-150") return retailValue < 150;
  if (tier === "150-250") return retailValue >= 150 && retailValue <= 250;
  return retailValue > 250;
}

export default function ExploreSoftwarePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [platform, setPlatform] = useState("all");
  const [priceTier, setPriceTier] = useState("all");
  const [accessLength, setAccessLength] = useState("all");
  const [sort, setSort] = useState("newest");
  const [inStockOnly, setInStockOnly] = useState(false);

  const searchMatches = useMemo(
    () =>
      MOCK_LISTINGS.filter(
        (listing) =>
          listing.title.toLowerCase().includes(search.toLowerCase()) ||
          listing.brandName.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  );

  const categories = useMemo(
    () => [
      { id: "all", label: "All products", count: searchMatches.length },
      ...CATEGORY_META.map(({ label, icon }) => ({
        id: label,
        label,
        icon,
        count: searchMatches.filter((listing) => listing.category === label).length,
      })),
    ],
    [searchMatches],
  );

  const listings = useMemo(() => {
    const filtered = searchMatches.filter(
      (listing) =>
        (category === "all" || listing.category === category) &&
        (platform === "all" || listing.platform === platform) &&
        (accessLength === "all" || listing.months === Number(accessLength)) &&
        priceTierMatch(priceTier, listing.retailValue) &&
        (!inStockOnly || listing.slotsRemaining > 0),
    );

    if (sort === "ending") {
      return [...filtered].sort((a, b) => a.slotsRemaining - b.slotsRemaining);
    }
    if (sort === "popular") {
      return [...filtered].sort((a, b) => b.totalSlots - b.slotsRemaining - (a.totalSlots - a.slotsRemaining));
    }
    return filtered;
  }, [searchMatches, category, platform, accessLength, priceTier, inStockOnly, sort]);

  const featured = MOCK_LISTINGS.slice(0, 3);
  const recentlyAdded = MOCK_LISTINGS.slice(3, 6);

  return (
    <AppShell
      activeHref="/explore"
      userName="Jordan Lee"
      searchValue={search}
      onSearchChange={setSearch}
      cartCount={2}
      savedCount={7}
      messagesCount={3}
      sidebarChildren={<CategoryNavList categories={categories} activeId={category} onChange={setCategory} />}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-8 py-8">
        <div>
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-neutral-900">Store</h1>
          </div>

          <ListingsToolbar
            resultCount={listings.length}
            platform={platform}
            onPlatformChange={setPlatform}
            priceTier={priceTier}
            onPriceTierChange={setPriceTier}
            accessLength={accessLength}
            onAccessLengthChange={setAccessLength}
            sort={sort}
            onSortChange={setSort}
            inStockOnly={inStockOnly}
            onInStockOnlyChange={setInStockOnly}
          />
        </div>

        <PromoBanner
          eyebrow="No cash. No gifting. A real transaction."
          title="Pay with a post."
          description="Shop vetted software from real brands and pay with content. Add products to your cart, check out in one tap, and unlock access when your post goes live."
        />

        <CuratedRow icon={<FeaturedIcon />} title="Featured products" subtitle="Hand-picked this week" listings={featured} />

        <CuratedRow title="Recently added" subtitle="Fresh on the shelves" listings={recentlyAdded} />

        <section>
          <h2 className="mb-4 text-[16px] font-semibold text-neutral-900">All products</h2>
          <ListingGrid listings={listings} />
        </section>
      </div>
    </AppShell>
  );
}
