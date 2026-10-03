"use client";

import { useEffect, useEffectEvent, useState } from "react";
import { EmptyBag } from "@/components/atoms/EmptyBag";
import { EmptyState } from "@/components/molecules/EmptyState";
import { Dropdown } from "@/components/molecules/Dropdown";
import { dismissToast, showToast } from "@/components/molecules/Toast";
import { CreatorSwipeStage } from "@/components/organisms/CreatorSwipeStage";
import { BrandShell } from "@/components/templates/BrandShell";
import { formatDate } from "@/lib/brand-format";
import type { BrandState } from "@/lib/data/brand-schema";
import { getShopper } from "@/lib/mock-brand";
import { brandStore, useBrandState, usePendingPitches, useProductStats } from "@/lib/store/brand-store";

/** One decision on the undo stack, with the toast that announced it so undoing can take it down. */
interface Decision {
  before: BrandState;
  shopperName: string;
  toastId: string | number;
}

/** B5 — one shopper at a time. Their profile is the pitch; approving creates a protected shop. */
function Review({ initialProductId }: { initialProductId?: string }) {
  const { products } = useBrandState();
  const stats = useProductStats();
  const pending = usePendingPitches();
  const [productId, setProductId] = useState(initialProductId && products.some((product) => product.id === initialProductId) ? initialProductId : "all");
  const [programmaticDirection, setProgrammaticDirection] = useState<1 | -1 | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasSwiped, setHasSwiped] = useState(false);
  const [history, setHistory] = useState<Decision[]>([]);

  const queue = pending.filter((pitch) => productId === "all" || pitch.productId === productId).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const pitch = queue[0];
  const product = pitch && products.find((item) => item.id === pitch.productId);
  const shopper = pitch && getShopper(pitch.shopperId);
  const productsWithPending = products.filter((item) => pending.some((entry) => entry.productId === item.id));

  function decide(direction: 1 | -1) {
    if (!pitch || isAnimating) return;
    setIsAnimating(true);
    setProgrammaticDirection(direction);
  }

  // An effect event always sees this render's queue, so the listener never goes stale.
  const onKey = useEffectEvent((event: KeyboardEvent) => {
    const target = event.target as HTMLElement;
    if (target.closest("input, textarea, [role=menu], [role=listbox], [role=dialog]")) return;
    if (event.key === "ArrowRight") decide(1);
    if (event.key === "ArrowLeft") decide(-1);
  });

  useEffect(() => {
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function handleSwiped(direction: 1 | -1) {
    if (!pitch || !product || !shopper) return;
    const before = brandStore.getState();
    brandStore.decidePitch(pitch.id, direction === 1);
    setHasSwiped(true);
    setProgrammaticDirection(null);
    setIsAnimating(false);

    const after = brandStore.getState();
    const shop = after.shops.find((item) => item.pitchId === pitch.id);
    const soldOut = after.products.find((item) => item.id === product.id)?.status === "sold_out";
    const toastId =
      direction === 1 && shop
        ? showToast({
            icon: "check",
            title: `Approved ${shopper.name}`,
            description: soldOut
              ? `${product.name} is now sold out — everyone else waiting was declined.`
              : `Their post is due ${formatDate(shop.deadline)}.`,
            action: { label: "Open thread", href: `/brand/messages?thread=${shopper.id}` },
          })
        : showToast({ icon: "cross", title: `Passed on ${shopper.name}` });
    setHistory((stack) => [...stack, { before, shopperName: shopper.name, toastId }]);
  }

  function undo() {
    if (isAnimating || history.length === 0) return;
    const last = history[history.length - 1];
    brandStore.restore(last.before);
    setHistory((stack) => stack.slice(0, -1));
    dismissToast(last.toastId);
    showToast({ icon: "undo", title: "Decision undone", description: `${last.shopperName} is back in the queue.` });
  }

  const showFilter = pending.length > 0 && (productsWithPending.length > 1 || productId !== "all");

  // The page fills the viewport so a brand sees the whole pitch and both buttons at once; too short a
  // window falls back to scrolling. The title is a quiet corner label so the card owns the screen.
  return (
    <div className="flex h-full flex-col px-5 pt-3 sm:px-6">
      <header className="flex min-h-10 items-center justify-between gap-4">
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-3">
          <h1 className="text-base font-semibold tracking-tight text-neutral-950">Review shoppers</h1>
          {pitch && product ? (
            <p className="truncate text-sm tabular-nums text-neutral-500">
              {product.name} · {stats[product.id]?.remaining ?? product.stock} of {product.stock} spots left · {queue.length} waiting
            </p>
          ) : null}
        </div>
        {showFilter ? (
          <div className="shrink-0">
            <Dropdown
              ariaLabel="Filter by product"
              align="end"
              value={productId}
              onChange={setProductId}
              options={[
                { value: "all", label: `All products · ${pending.length}` },
                ...products
                  .filter((item) => item.status === "live" && (stats[item.id]?.pending ?? 0) > 0)
                  .map((item) => ({ value: item.id, label: `${item.name} · ${stats[item.id].pending}` })),
              ]}
            />
          </div>
        ) : null}
      </header>

      {pitch && product && shopper ? (
        // Shared with the creator directory's swipe mode, so both decks look and size the same.
        <>
          <CreatorSwipeStage
            shopper={shopper}
            cardKey={pitch.id}
            onSwiped={handleSwiped}
            enterAfterSwipe={hasSwiped}
            programmaticDirection={programmaticDirection}
            disabled={isAnimating}
            onDeny={() => decide(-1)}
            onUndo={undo}
            onApprove={() => decide(1)}
            canUndo={history.length > 0}
            approveVerb="approve"
            approveLabel={`Approve ${shopper.name}`}
          />
          {/* Mirrors the header's height (12px padding + 40px row) so the card and buttons center on
              the page, not just the space under the header. The page is a fixed height, so this
              shrinks away first when the window is short. */}
          <div aria-hidden className="shrink basis-13" />
        </>
      ) : (
        <EmptyState
          className="mx-auto mt-8 w-full max-w-[34rem]"
          illustration={<EmptyBag />}
          title="You're all caught up"
          description={
            history.length > 0
              ? "Every shopper has a decision. Approved creators are in Shops with their delivery deadlines."
              : "No one is waiting. New shoppers appear here when creators check out your product pages."
          }
          action={history.length > 0 ? { label: "Go to Shops", href: "/brand/shops" } : { label: "Back to storefront", href: "/brand" }}
          secondaryAction={history.length > 0 ? { label: "Undo last decision", onClick: undo } : { label: "Browse creators", href: "/brand/creators" }}
        />
      )}
    </div>
  );
}

export default function ShopperReviewPage({ productId }: { productId?: string }) {
  return (
    <BrandShell>
      <Review initialProductId={productId} />
    </BrandShell>
  );
}
