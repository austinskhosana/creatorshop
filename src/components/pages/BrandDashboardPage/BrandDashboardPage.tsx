"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowTopRightOnSquareIcon, DocumentDuplicateIcon, LinkIcon, PauseIcon, PencilSquareIcon, PlayIcon, PlusIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { darkGradientButtonStyle } from "@/components/atoms/Button/darkGradientStyle";
import { EmptyStorefront } from "@/components/atoms/EmptyStorefront";
import type { ActionMenuItem } from "@/components/molecules/ActionMenu";
import { AddItemCard } from "@/components/molecules/AddItemCard";
import { AttentionStats, type AttentionStat } from "@/components/molecules/AttentionStats";
import { ConfirmDialog } from "@/components/molecules/ConfirmDialog";
import { EmptyState } from "@/components/molecules/EmptyState";
import { FlashMessage, useFlash } from "@/components/molecules/FlashMessage";
import { PageHeader } from "@/components/molecules/PageHeader";
import { ReviewQueueCard } from "@/components/molecules/ReviewQueueCard";
import { ProductPageCard } from "@/components/organisms/ProductPageCard";
import { SellingReadiness } from "@/components/organisms/SellingReadiness";
import { StorefrontCard } from "@/components/organisms/StorefrontCard";
import { BrandShell } from "@/components/templates/BrandShell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { BrandShop, Pitch, ProductPage, ProductPageStatus } from "@/lib/data/brand-schema";
import { getShopper } from "@/lib/mock-brand";
import { brandStore, useBrandState, usePendingPitches, useProductStats } from "@/lib/store/brand-store";

const FILTERS: { label: string; statuses: ProductPageStatus[] }[] = [
  { label: "All", statuses: ["live", "draft", "paused", "sold_out", "closed"] },
  { label: "Live", statuses: ["live"] },
  { label: "Drafts", statuses: ["draft"] },
  { label: "Paused", statuses: ["paused"] },
  { label: "Ended", statuses: ["sold_out", "closed"] },
];

/** The counts behind the attention row. Details live on the screen each card opens. */
function attentionStats(shops: BrandShop[]): AttentionStat[] {
  const count = (state: BrandShop["state"]) => shops.filter((shop) => shop.state === state).length;
  const posted = count("posted");
  const overdue = count("overdue");
  const inFlight = posted + overdue + count("approved") + count("active");

  return [
    { label: "Proof to review", value: posted, href: "/brand/shops" },
    { label: "Shops in progress", value: inFlight, href: "/brand/shops" },
    { label: "Overdue posts", value: overdue, href: "/brand/shops", tone: "alert" },
  ];
}

/** Waiting shoppers as faces, newest pitch first. */
function waitingPeople(pending: Pitch[]) {
  return [...pending]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((pitch) => getShopper(pitch.shopperId))
    .filter((shopper) => shopper !== undefined)
    .map((shopper) => ({ name: shopper.name, avatar: shopper.avatar }));
}

const LINK_BASE =
  "inline-flex min-h-10 items-center gap-2 rounded-[9px] px-4 text-[13px] font-medium transition-[background-color,border-color,filter,transform] duration-150 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2";

/** B4 — the storefront management view: account readiness, what needs attention, and every product page. */
function Dashboard() {
  const router = useRouter();
  const { account, products, shops } = useBrandState();
  const stats = useProductStats();
  const pending = usePendingPitches();
  const [selected, setSelected] = useState(0);
  const [flash, showFlash] = useFlash();
  // The target outlives the dialog so its copy doesn't change mid-exit.
  const [closing, setClosing] = useState<ProductPage | null>(null);
  const [closeOpen, setCloseOpen] = useState(false);

  if (!account) return null;
  const filter = FILTERS[selected];
  const visible = products.filter((product) => filter.statuses.includes(product.status));
  const liveCount = products.filter((product) => product.status === "live" || product.status === "sold_out").length;
  const storefrontHref = `/store/${account.slug}`;

  function actionsFor(product: ProductPage): ActionMenuItem[] {
    const items: ActionMenuItem[] = [{ label: "Edit", icon: <PencilSquareIcon className="size-4" />, onSelect: () => router.push(`/brand/products/${product.id}`) }];
    if (product.status !== "draft") {
      items.push({
        label: "Copy link",
        icon: <LinkIcon className="size-4" />,
        onSelect: () => {
          const url = `${window.location.origin}${storefrontHref}/${product.slug}`;
          navigator.clipboard?.writeText(url).then(
            () => showFlash({ message: "Product link copied." }),
            () => showFlash({ message: url }),
          );
        },
      });
    }
    items.push({
      label: "Duplicate",
      icon: <DocumentDuplicateIcon className="size-4" />,
      onSelect: () => {
        brandStore.duplicateProduct(product.id);
        showFlash({ message: `Duplicated ${product.name} as a draft.` });
      },
    });
    if (product.status === "live" || product.status === "sold_out") {
      items.push({ label: "Pause", icon: <PauseIcon className="size-4" />, onSelect: () => { brandStore.pauseProduct(product.id); showFlash({ message: `${product.name} is paused and hidden from the store.` }); } });
    }
    if (product.status === "paused" || product.status === "closed") {
      items.push({
        label: account?.subscription === "active" ? "Reopen" : "Reopen · subscribe first",
        icon: <PlayIcon className="size-4" />,
        disabled: account?.subscription !== "active",
        onSelect: () => { brandStore.reopenProduct(product.id); showFlash({ message: `${product.name} is back in the store.` }); },
      });
    }
    if (product.status !== "closed" && product.status !== "draft") {
      items.push({
        label: "Close",
        icon: <XCircleIcon className="size-4" />,
        tone: "danger",
        onSelect: () => { setClosing(product); setCloseOpen(true); },
      });
    }
    return items;
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
      <PageHeader
        title="Storefront"
        description="Your product pages, stock, and shoppers in one place."
        actions={
          <>
            <Link href={storefrontHref} className={`${LINK_BASE} border border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-950`}>
              <ArrowTopRightOnSquareIcon aria-hidden="true" className="size-4" />
              View storefront
            </Link>
            <Link href="/brand/products/new" className={`${LINK_BASE} text-white hover:brightness-125`} style={darkGradientButtonStyle}>
              <PlusIcon aria-hidden="true" className="size-4" />
              List a product
            </Link>
          </>
        }
      />

      <div className="mt-7 space-y-3">
        <SellingReadiness account={account} />
        <StorefrontCard account={account} liveCount={liveCount} />
      </div>

      {products.length > 0 ? (
        <section aria-label="What needs attention" className="mt-3 grid gap-3 xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <ReviewQueueCard people={waitingPeople(pending)} href="/brand/review" emptyHref="/brand/creators" />
          <AttentionStats stats={attentionStats(shops)} />
        </section>
      ) : null}

      <section className="mt-10">
        <h2 className="text-[16px] font-semibold text-neutral-900">Product pages</h2>
        {products.length === 0 ? (
          <EmptyState
            className="mt-5"
            illustration={<EmptyStorefront />}
            title="You're setting up your storefront"
            description="List your first product: what it is, the posts you'll accept as payment, and how many spots you have."
            action={{ label: "List a product", href: "/brand/products/new" }}
          />
        ) : (
          <Tabs value={String(selected)} onValueChange={(value) => setSelected(Number(value))} className="mt-4">
            <TabsList className="max-w-full overflow-x-auto [scrollbar-width:none]">
              {FILTERS.map((item, index) => (
                <TabsTrigger key={item.label} value={String(index)}>
                  {item.label}
                  <span className="ml-1.5 text-xs font-medium tabular-nums">{products.filter((product) => item.statuses.includes(product.status)).length}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value={String(selected)} className="mt-6">
              {visible.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {visible.map((product) => (
                    <ProductPageCard
                      key={product.id}
                      product={product}
                      remaining={stats[product.id]?.remaining ?? product.stock}
                      pending={stats[product.id]?.pending ?? 0}
                      href={`${storefrontHref}/${product.slug}`}
                      actions={actionsFor(product)}
                    />
                  ))}
                  {selected === 0 ? <AddItemCard href="/brand/products/new" label="List a product" description="Set the posts you accept and how many spots you have." /> : null}
                </div>
              ) : (
                <EmptyState
                  illustration={<EmptyStorefront />}
                  title={`No ${filter.label.toLowerCase()} product pages`}
                  description="Pages move between tabs as you publish, pause, and sell out."
                  action={{ label: "See all product pages", onClick: () => setSelected(0) }}
                />
              )}
            </TabsContent>
          </Tabs>
        )}
      </section>

      <ConfirmDialog
        open={closeOpen}
        onOpenChange={setCloseOpen}
        title={`Close ${closing?.name ?? "this product page"}?`}
        description={`It leaves the store and ${closing ? (stats[closing.id]?.pending ?? 0) : 0} waiting ${(closing && stats[closing.id]?.pending) === 1 ? "shopper is" : "shoppers are"} declined. Approved shops carry on, and you can reopen the page later.`}
        confirmLabel="Close product page"
        destructive
        onConfirm={() => {
          if (!closing) return;
          brandStore.closeProduct(closing.id);
          showFlash({ message: `${closing.name} is closed. Approved shops carry on.` });
        }}
      />

      <FlashMessage {...flash} />
    </div>
  );
}

export default function BrandDashboardPage() {
  return (
    <BrandShell>
      <Dashboard />
    </BrandShell>
  );
}
