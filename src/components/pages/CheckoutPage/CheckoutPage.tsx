"use client";

import { ShieldCheckIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import BrandLogo from "@/components/atoms/BrandLogo/BrandLogo";
import Button from "@/components/atoms/Button/Button";
import { darkGradientButtonStyle } from "@/components/atoms/Button/darkGradientStyle";
import { CreatorBreadcrumb } from "@/components/molecules/CreatorBreadcrumb";
import { EmptyState } from "@/components/molecules/EmptyState";
import { PrintedReceipt } from "@/components/organisms/PrintedReceipt";
import { CreatorShell } from "@/components/templates/CreatorShell";
import type { Shop } from "@/lib/data/schema";
import { formatAccess } from "@/lib/listings/offers";
import { creatorStore, useCart } from "@/lib/store/creator-store";

export default function CheckoutPage() {
  const { lines, total } = useCart();
  // The shops this checkout created. The cart is empty once they exist, so the receipt reads from these.
  const [placed, setPlaced] = useState<Shop[] | null>(null);

  if (placed) {
    const placedTotal = placed.reduce((sum, shop) => sum + shop.value, 0);
    return (
      <CreatorShell>
        <PrintedReceipt
          title="Shop receipt"
          statusLabels={{ processing: "Sending your requests", printing: "Printing your receipt", complete: "Waiting for brand approval" }}
          screenLabel="Shop requests"
          screenValue={`${placed.length} ${placed.length === 1 ? "product" : "products"} · $${placedTotal}`}
          items={placed}
          paidWith="Paid with content."
          reviewTitle="Pending approval"
          reviewNote="Brands review your profile first. Approved content payments get a delivery deadline."
          backHref="/shops"
        />
      </CreatorShell>
    );
  }

  const breadcrumb = <CreatorBreadcrumb items={[{ label: "Shop", href: "/explore" }, { label: "Cart", href: "/cart" }, { label: "Checkout" }]} />;

  if (lines.length === 0) {
    return (
      <CreatorShell>
        <div className="mx-auto w-full max-w-xl px-5 py-8 sm:px-8 sm:py-12">
          {breadcrumb}
          <EmptyState
            className="mt-9"
            icon={<ShoppingCartIcon className="size-5" strokeWidth={1.75} />}
            title="Nothing to check out"
            description="Your cart is empty. Add software from the shop first."
            action={{ label: "Browse the shop", href: "/explore" }}
            secondaryAction={{ label: "My Shops", href: "/shops" }}
          />
        </div>
      </CreatorShell>
    );
  }

  return (
    <CreatorShell>
      <div className="mx-auto w-full max-w-xl px-5 py-8 sm:px-8 sm:py-12">
        {breadcrumb}
        <header className="mt-7">
          <h1 className="text-4xl font-bold tracking-tight">Confirm your shop</h1>
          <p className="mt-2 text-sm text-neutral-500">No payment details. Your profile is your pitch.</p>
        </header>
        <div className="mt-9 divide-y divide-neutral-100 overflow-hidden rounded-[1.75rem] border border-neutral-200 bg-white">
          {lines.map(({ listing, offer }) => (
            <div key={listing.slug} className="flex items-center gap-4 p-5">
              <BrandLogo slug={listing.slug} name={listing.brandName} size={48} className="shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-neutral-500">{listing.brandName}</p>
                <p className="font-bold">{listing.title}</p>
                <p className="mt-0.5 text-xs text-neutral-500">{offer.label} · {formatAccess(offer.months)} access</p>
              </div>
              <p className="font-bold tabular-nums">${listing.retailValue}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold text-neutral-950">Total retail value</p>
            <p className="mt-0.5 text-xs text-neutral-500">Paid with your chosen content</p>
          </div>
          <p className="text-3xl font-bold tracking-tight tabular-nums">${total}</p>
        </div>
        <div className="mt-7 flex items-start gap-3 rounded-2xl bg-neutral-100 p-4">
          <ShieldCheckIcon className="mt-0.5 size-5 shrink-0 text-[#73b61f]" />
          <p className="text-sm leading-6 text-neutral-600">By confirming, you’re asking each brand to review your public profile. Approved shops give you a delivery deadline and unlock access once your proof is confirmed.</p>
        </div>
        <Button onClick={() => setPlaced(creatorStore.checkout())} variant="dark" size="lg" fullWidth iconLeft={<ShoppingCartIcon className="size-4" />} className="mt-7" style={{ ...darkGradientButtonStyle, padding: "14px 20px" }}>
          Confirm
        </Button>
      </div>
    </CreatorShell>
  );
}
