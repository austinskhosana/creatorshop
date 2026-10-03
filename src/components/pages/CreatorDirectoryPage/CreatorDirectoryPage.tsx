"use client";

import { useMemo, useState } from "react";
import { EmptySearch } from "@/components/atoms/EmptySearch";
import { EmptyState } from "@/components/molecules/EmptyState";
import { PageHeader } from "@/components/molecules/PageHeader";
import { CreatorDirectoryCard } from "@/components/organisms/CreatorDirectoryCard";
import { CreatorSwipeDeck } from "@/components/organisms/CreatorSwipeDeck";
import { BrandShell } from "@/components/templates/BrandShell";
import { SHOPPERS, formatAudience, totalAudience } from "@/lib/mock-brand";
import { AUDIENCE_BUCKETS, CreatorFilterBar, CreatorFilterPopover, NO_FILTERS, activeFilterCount, type CreatorFilterValues } from "./directory/CreatorFilters";
import { ViewToggle, type DirectoryView } from "./directory/ViewToggle";

export type { DirectoryView };

/**
 * B9 — discovery, not a CRM. Opens in swipe mode: one creator at a time, where a right swipe sends
 * an intro and a campaign. The grid runs the same filtered list for scanning and opening profiles.
 */
export default function CreatorDirectoryPage({ initialQuery = "", initialView = "swipe" }: { initialQuery?: string; initialView?: DirectoryView }) {
  const [view, setView] = useState<DirectoryView>(initialView);
  const [filters, setFilters] = useState<CreatorFilterValues>({ ...NO_FILTERS, query: initialQuery });

  const niches = useMemo(() => [...new Set(SHOPPERS.flatMap((shopper) => shopper.niches))].sort(), []);
  const bucket = AUDIENCE_BUCKETS.find((item) => item.value === filters.audience)!;
  const needle = filters.query.trim().toLowerCase();
  const visible = SHOPPERS.filter((shopper) => {
    const total = totalAudience(shopper);
    return (
      (!needle || `${shopper.name} ${shopper.handle} ${shopper.bio} ${shopper.niches.join(" ")}`.toLowerCase().includes(needle)) &&
      (filters.niche === "all" || shopper.niches.includes(filters.niche)) &&
      (filters.platform === "all" || shopper.platforms.some((item) => item.name === filters.platform)) &&
      total >= bucket.min &&
      total < bucket.max
    );
  });
  const filtered = activeFilterCount(filters) > 0;

  // Kept in the URL so opening a profile from the grid and coming back lands in the grid again.
  function changeView(next: DirectoryView) {
    setView(next);
    const params = new URLSearchParams(window.location.search);
    if (next === "grid") params.set("view", "grid");
    else params.delete("view");
    const search = params.toString();
    window.history.replaceState(null, "", search ? `?${search}` : window.location.pathname);
  }

  const filterProps = {
    values: filters,
    onChange: (patch: Partial<CreatorFilterValues>) => setFilters((current) => ({ ...current, ...patch })),
    niches,
    count: visible.length,
    onClear: () => setFilters(NO_FILTERS),
  };

  if (view === "swipe") {
    // Fills the viewport like shopper review: no bottom padding, so the buttons rest at the foot of the screen.
    return (
      <BrandShell>
        <div className="flex min-h-full flex-col px-5 pt-4 sm:px-6">
          <CreatorSwipeDeck
            title="Creators"
            creators={visible}
            onClearFilters={filtered ? filterProps.onClear : undefined}
            onShowGrid={() => changeView("grid")}
            toolbar={
              <>
                <CreatorFilterPopover {...filterProps} />
                <ViewToggle value={view} onChange={changeView} />
              </>
            }
          />
        </div>
      </BrandShell>
    );
  }

  return (
    <BrandShell>
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
        <PageHeader
          title="Creators"
          description="Browse creator profiles. When one fits, message them about your products."
          actions={<ViewToggle value={view} onChange={changeView} />}
        />

        <div className="mt-7">
          <CreatorFilterBar {...filterProps} />
        </div>

        {visible.length > 0 ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((shopper) => (
              <CreatorDirectoryCard
                key={shopper.id}
                href={`/brand/creators/${shopper.handle}`}
                name={shopper.name}
                handle={shopper.handle}
                avatar={shopper.avatar}
                bio={shopper.bio}
                niches={shopper.niches}
                platforms={shopper.platforms.map((item) => item.name)}
                audience={formatAudience(totalAudience(shopper))}
                rating={shopper.rating}
                completedShops={shopper.completedShops}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            className="mt-6"
            illustration={<EmptySearch />}
            title="No creators match"
            description="Try a different niche or platform, or widen the audience range."
            action={filtered ? { label: "Clear filters", onClick: filterProps.onClear } : undefined}
          />
        )}
      </div>
    </BrandShell>
  );
}
