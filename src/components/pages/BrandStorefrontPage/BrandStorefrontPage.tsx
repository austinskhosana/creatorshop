"use client";

import { EyeIcon } from "@heroicons/react/24/outline";
import { EmptyStorefront } from "@/components/atoms/EmptyStorefront";
import { CreatorBreadcrumb } from "@/components/molecules/CreatorBreadcrumb";
import { EmptyState } from "@/components/molecules/EmptyState";
import { NoticeBanner } from "@/components/molecules/NoticeBanner";
import { ProductPageCard } from "@/components/organisms/ProductPageCard";
import { StorefrontCard } from "@/components/organisms/StorefrontCard";
import { CreatorShell } from "@/components/templates/CreatorShell";
import { useBrandSession, useBrandState, useProductStats } from "@/lib/store/brand-store";

/**
 * B8 — a brand's public store: who they are and every product page creators can shop.
 * The prototype reads the signed-in brand's own data, so only that storefront resolves.
 */
export default function BrandStorefrontPage({ slug }: { slug: string }) {
  const { ready } = useBrandSession();
  const { account, products } = useBrandState();
  const stats = useProductStats();

  if (!ready) return <CreatorShell><div aria-busy="true" className="h-screen" /></CreatorShell>;

  if (!account || account.slug !== slug) {
    return (
      <CreatorShell>
        <div className="mx-auto max-w-xl px-5 py-12 sm:px-8">
          <EmptyState
            illustration={<EmptyStorefront />}
            title="Storefront not found"
            description="This store isn't open, or the link has changed. Browse the shop for everything that's live."
            action={{ label: "Browse the shop", href: "/explore" }}
          />
        </div>
      </CreatorShell>
    );
  }

  const shelf = products.filter((product) => product.status === "live" || product.status === "sold_out");

  return (
    <CreatorShell>
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
        <NoticeBanner
          icon={<EyeIcon className="size-5" strokeWidth={1.75} />}
          title="This is your storefront as creators see it"
          description="Drafts and paused pages stay hidden. Share this page anywhere you talk to creators."
          action={{ label: "Back to manager", href: "/brand" }}
        />

        <div className="mt-7">
          <CreatorBreadcrumb items={[{ label: "Shop", href: "/explore" }, { label: account.companyName }]} />
        </div>

        <StorefrontCard account={account} liveCount={shelf.length} variant="public" titleAs="h1" className="mt-7" />

        <section className="mt-10">
          <h2 className="text-[16px] font-semibold text-neutral-900">Products</h2>
          <p className="mt-1 text-[13px] text-neutral-500">Pay with a post. Pick a price tier, add it to your cart, and unlock access when your post is confirmed.</p>
          {shelf.length > 0 ? (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {shelf.map((product) => (
                <div key={product.id} id={product.slug} className="scroll-mt-8">
                  <ProductPageCard product={product} remaining={stats[product.id]?.remaining ?? product.stock} variant="storefront" href={`/store/${account.slug}/${product.slug}`} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              className="mt-5"
              illustration={<EmptyStorefront />}
              title="Nothing in stock right now"
              description={`${account.companyName} hasn't listed a product yet. Check back soon.`}
              action={{ label: "Browse the shop", href: "/explore" }}
            />
          )}
        </section>
      </div>
    </CreatorShell>
  );
}
