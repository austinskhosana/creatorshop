"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import AppShell from "@/components/templates/AppShell/AppShell";
import { threadsFor } from "@/lib/mock-brand-messages";
import { brandStore, useBrandSession, usePendingPitches } from "@/lib/store/brand-store";

/**
 * The merchant side's frame: the same AppShell the creator routes use, with the brand nav.
 * The brand landing page is the only way in, so a signed-out visitor is sent back there.
 */
export default function BrandShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { ready, account } = useBrandSession();
  const pending = usePendingPitches();

  useEffect(() => {
    if (ready && !account) router.replace("/brands");
  }, [ready, account, router]);

  if (!ready || !account) {
    return <div aria-busy="true" aria-label="Loading your storefront" className="h-screen bg-white" />;
  }

  return (
    <AppShell
      role="BRAND"
      activeHref={pathname}
      userName={account.companyName}
      reviewCount={pending.length}
      messagesCount={threadsFor(account).filter((thread) => thread.unread).length}
      cartCount={0}
      searchValue=""
      onSearchChange={(query) => router.push(query ? `/brand/creators?q=${encodeURIComponent(query)}` : "/brand/creators")}
      onSignOut={() => {
        brandStore.signOut();
        router.push("/brands");
      }}
    >
      <div className="brand-page h-full">{children}</div>
    </AppShell>
  );
}
