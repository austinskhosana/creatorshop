"use client";

import { useState, type ReactNode } from "react";
import { CalendarIcon, EyeIcon, KeyIcon } from "@heroicons/react/24/outline";
import Button from "@/components/atoms/Button/Button";
import { darkGradientButtonStyle } from "@/components/atoms/Button/darkGradientStyle";
import PlatformIcon from "@/components/atoms/PlatformIcon/PlatformIcon";
import { EmptyBox } from "@/components/atoms/EmptyBox";
import { CreatorBreadcrumb } from "@/components/molecules/CreatorBreadcrumb";
import { EmptyState } from "@/components/molecules/EmptyState";
import { NoticeBanner } from "@/components/molecules/NoticeBanner";
import { PriceTierPicker } from "@/components/molecules/PriceTierPicker";
import { StatusPill } from "@/components/molecules/StatusPill";
import { StockMeter } from "@/components/molecules/StockMeter";
import { CreatorShell } from "@/components/templates/CreatorShell";
import { PRODUCT_STATUS, accessMethodLabel, formatMonths, formatUsd, productPlatform } from "@/lib/brand-format";
import { useBrandSession, useBrandState, useProductStats } from "@/lib/store/brand-store";

function Term({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <li className="flex gap-3">
      <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-xl bg-neutral-100 text-neutral-900">{icon}</span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-neutral-950">{title}</p>
        <p className="mt-0.5 text-[13px] leading-5 text-neutral-500">{children}</p>
      </div>
    </li>
  );
}

/**
 * B9 — one product page as creators see it: the full description, the tiers to pick from, and
 * the terms that stay off the card. The prototype only resolves the signed-in brand's own pages,
 * so it always carries the owner's banner with the way back into the editor.
 */
export default function StoreProductPage({ brandSlug, productSlug }: { brandSlug: string; productSlug: string }) {
  const { ready } = useBrandSession();
  const { account, products } = useBrandState();
  const stats = useProductStats();
  const product = account?.slug === brandSlug ? products.find((item) => item.slug === productSlug) : undefined;
  const [tierId, setTierId] = useState<string | null>(null);

  if (!ready) return <CreatorShell><div aria-busy="true" className="h-screen" /></CreatorShell>;

  if (!account || !product) {
    return (
      <CreatorShell>
        <div className="mx-auto max-w-xl px-5 py-12 sm:px-8">
          <EmptyState
            illustration={<EmptyBox />}
            title="Product not found"
            description="This page isn't in the store, or the link has changed."
            action={{ label: account?.slug === brandSlug ? "Back to storefront" : "Browse the shop", href: account?.slug === brandSlug ? `/store/${brandSlug}` : "/explore" }}
          />
        </div>
      </CreatorShell>
    );
  }

  const tier = product.tiers.find((item) => item.id === tierId) ?? product.tiers[0];
  const remaining = stats[product.id]?.remaining ?? product.stock;
  const platform = productPlatform(product);
  const onShelf = product.status === "live" || product.status === "sold_out";
  const soldOut = product.status === "sold_out" || remaining === 0;
  const status = PRODUCT_STATUS[product.status];

  return (
    <CreatorShell>
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
        <NoticeBanner
          icon={<EyeIcon className="size-5" strokeWidth={1.75} />}
          title={onShelf ? "This is your product page as creators see it" : `${status.label} — creators can't see this page yet`}
          description={onShelf ? "Edits apply to new shoppers. Shops you've already approved keep their terms." : "It shows up in your storefront once it's live."}
          action={{ label: "Edit product page", href: `/brand/products/${product.id}` }}
        />

        <div className="mt-7">
          <CreatorBreadcrumb items={[{ label: "Shop", href: "/explore" }, { label: account.companyName, href: `/store/${account.slug}` }, { label: product.name }]} />
        </div>

        <div className="mt-7 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-neutral-600">
                <PlatformIcon platform={platform} className="size-3.5" />
                {platform}
              </span>
              {product.status !== "live" ? <StatusPill tone={status.tone} label={status.label} /> : null}
            </div>
            <h1 className="mt-3 text-balance text-[28px] leading-tight font-bold tracking-[-0.03em] text-neutral-950">{product.name}</h1>
            <p className="mt-4 max-w-prose whitespace-pre-line text-pretty text-[15px] leading-7 text-neutral-600">{product.description}</p>

            <section className="mt-10">
              <h2 className="text-[16px] font-semibold text-neutral-900">Pick what you&apos;ll post</h2>
              <p className="mt-1 text-[13px] text-neutral-500">Each option is a post on {platform} and the access it unlocks.</p>
              <div className="mt-4">
                <PriceTierPicker name={`tier-${product.id}`} tiers={product.tiers} value={tier.id} onChange={setTierId} disabled={soldOut} />
              </div>
            </section>

            <section className="mt-10">
              <h2 className="text-[16px] font-semibold text-neutral-900">The terms</h2>
              <ul className="mt-4 space-y-4">
                <Term icon={<CalendarIcon className="size-4" strokeWidth={1.75} />} title={`Post within ${product.deadlineDays} days`}>
                  The clock starts when {account.companyName} approves you, not when you add it to your cart.
                </Term>
                <Term icon={<KeyIcon className="size-4" strokeWidth={1.75} />} title={`Access by ${accessMethodLabel(product.accessMethod).toLowerCase()}`}>
                  Revealed once your post is confirmed. Your access runs for the length of the option you picked.
                </Term>
              </ul>
            </section>
          </div>

          <aside>
            <div className="sticky top-8 rounded-[20px] border border-neutral-200 bg-white p-6">
              <p className="text-xs font-medium text-neutral-500">You post</p>
              <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-neutral-950">
                <PlatformIcon platform={tier.name} className="size-3.5" />
                {tier.name}
              </p>
              <p className="mt-4 text-xs font-medium text-neutral-500">You get</p>
              <p className="mt-1 text-sm font-semibold tabular-nums text-neutral-950">{formatMonths(tier.months)} of {product.name}</p>
              <p className="mt-4 text-[22px] font-bold tabular-nums tracking-tight text-neutral-950">{formatUsd(tier.retailValue)}</p>
              <p className="text-[11px] text-neutral-400">Retail value</p>
              <StockMeter remaining={remaining} total={product.stock} className="mt-6" />
              <div className="mt-6">
                <Button type="button" variant="dark" size="lg" fullWidth disabled aria-describedby="add-to-cart-note" style={{ ...darkGradientButtonStyle, padding: "13px 20px" }}>
                  {soldOut ? "Sold out" : "Add to cart"}
                </Button>
                <p id="add-to-cart-note" className="mt-2 text-center text-xs leading-5 text-neutral-500">
                  {soldOut ? "Creators can't shop this until you add stock." : "Creators add this to their cart here. It's off while you preview."}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </CreatorShell>
  );
}
