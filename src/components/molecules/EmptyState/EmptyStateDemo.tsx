"use client";

import EmptyState from "./EmptyState";

export default function EmptyStateWithActionDemo() {
  return (
    <EmptyState
      title="No listings match this category"
      description="Try a different category or check back later."
      action={{ label: "Clear filter", onClick: () => {} }}
    />
  );
}
