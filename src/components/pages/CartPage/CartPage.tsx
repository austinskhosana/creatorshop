"use client";

import { useState } from "react";
import { EmptyCart } from "@/components/atoms/EmptyCart";
import { CreatorBreadcrumb } from "@/components/molecules/CreatorBreadcrumb";
import { CartLineItem, type CartLineItemData } from "@/components/molecules/CartLineItem";
import { EmptyState } from "@/components/molecules/EmptyState";
import { CartSummary } from "@/components/organisms/CartSummary";
import { CreatorShell } from "@/components/templates/CreatorShell";
import { formatAccess } from "@/lib/listings/offers";
import { creatorStore, useCart, type CartLine } from "@/lib/store/creator-store";

interface CartPageProps {
  /** Static items for design-system previews. Omit to show the creator's real cart. */
  items?: CartLineItemData[];
}

function toLineItem({ listing, offer }: CartLine): CartLineItemData {
  return { id: listing.slug, product: listing.title, brand: listing.brandName, tier: offer.label, value: listing.retailValue, access: formatAccess(offer.months) };
}

function ClearCartButton({ count }: { count: number }) {
  const [confirming, setConfirming] = useState(false);
  const base =
    "inline-flex min-h-10 items-center rounded-[9px] px-3 text-[13px] font-medium transition-[background-color,color,border-color] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

  if (!confirming) {
    return (
      <button type="button" onClick={() => setConfirming(true)} className={`${base} text-neutral-500 hover:bg-neutral-100 hover:text-neutral-950 focus-visible:ring-neutral-900`}>
        Clear cart
      </button>
    );
  }

  return (
    <div role="group" aria-label="Confirm clearing the cart" className="flex items-center gap-1.5">
      <span className="mr-1 text-[13px] text-neutral-500">
        Remove {count} {count === 1 ? "item" : "items"}?
      </span>
      <button type="button" onClick={() => setConfirming(false)} className={`${base} border border-neutral-200 text-neutral-700 hover:bg-neutral-50 focus-visible:ring-neutral-900`}>
        Keep
      </button>
      <button
        type="button"
        autoFocus
        onClick={() => {
          creatorStore.clearCart();
          setConfirming(false);
        }}
        className={`${base} bg-red-50 text-red-600 hover:bg-red-100 focus-visible:ring-red-500`}
      >
        Clear
      </button>
    </div>
  );
}

export default function CartPage({ items: previewItems }: CartPageProps) {
  const cart = useCart();
  const items = previewItems ?? cart.lines.map(toLineItem);
  const total = items.reduce((sum, item) => sum + item.value, 0);

  return (
    <CreatorShell>
      <div className="mx-auto flex min-h-full max-w-6xl flex-col px-5 py-8 sm:px-8 sm:py-12">
        <CreatorBreadcrumb items={[{ label: "Shop", href: "/explore" }, { label: "Cart" }]} />

        <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-neutral-950">Cart</h1>
            {items.length > 0 ? (
              <p className="mt-2 text-sm text-neutral-500">
                <span className="tabular-nums">{items.length}</span> {items.length === 1 ? "product" : "products"} ready to shop
              </p>
            ) : null}
          </div>
          {items.length > 0 && !previewItems ? <ClearCartButton count={items.length} /> : null}
        </div>

        {items.length ? (
          <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <div className="divide-y divide-neutral-100 overflow-hidden rounded-[1.75rem] border border-neutral-200 bg-white">
              {items.map((item) => (
                <CartLineItem key={item.id} item={item} onRemove={creatorStore.removeFromCart} />
              ))}
            </div>
            <CartSummary total={total} checkoutHref="/checkout" />
          </div>
        ) : (
          // Fills the rest of the page so the fixed-height empty state sits centred in it.
          <div className="mt-8 flex flex-1 flex-col justify-center">
            <EmptyState
              className="min-h-[28rem] sm:min-h-[36rem]"
              illustration={<EmptyCart />}
              title="Your cart is empty"
              description="Add software from the shop. You'll pay for each one with a post, not money."
              action={{ label: "Browse the shop", href: "/explore" }}
            />
          </div>
        )}
      </div>
    </CreatorShell>
  );
}
