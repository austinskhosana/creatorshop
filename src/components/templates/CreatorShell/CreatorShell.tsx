"use client";

import { usePathname, useRouter } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import AppShell from "@/components/templates/AppShell/AppShell";
import { StoreSidebarCategories } from "@/components/organisms/StoreSidebarCategories";

/**
 * Creator routes must use the same AppShell configuration as /explore.
 * This component only centralizes those exact props; it must not introduce
 * a separate navigation or sidebar variation.
 */
export default function CreatorShell({ children, breadcrumb }: { children: ReactNode; breadcrumb?: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <AppShell
      activeHref={pathname}
      userName="Jordan Lee"
      searchValue=""
      onSearchChange={(query) => router.push(query ? `/explore?q=${encodeURIComponent(query)}` : "/explore")}
      cartCount={2}
      savedCount={7}
      messagesCount={3}
      sidebarChildren={
        <Suspense fallback={<div className="h-40 animate-pulse rounded-xl bg-neutral-100" aria-label="Loading shop categories" />}>
          <StoreSidebarCategories />
        </Suspense>
      }
    >
      <div className="creator-page">
        {breadcrumb && <div className="px-5 py-4 sm:px-8">{breadcrumb}</div>}
        {children}
      </div>
    </AppShell>
  );
}
