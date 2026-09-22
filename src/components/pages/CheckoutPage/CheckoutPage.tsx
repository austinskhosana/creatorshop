"use client";

import Image from "next/image";
import { ShieldCheckIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { CART_ITEMS } from "@/lib/mock-creator";
import Button from "@/components/atoms/Button/Button";
import { darkGradientButtonStyle } from "@/components/atoms/Button/darkGradientStyle";
import { CreatorBreadcrumb } from "@/components/molecules/CreatorBreadcrumb";
import { PrintedReceipt } from "@/components/organisms/PrintedReceipt";
import { CreatorShell } from "@/components/templates/CreatorShell";

export default function CheckoutPage() {
  const [confirmed, setConfirmed] = useState(false);
  const total = CART_ITEMS.reduce((sum, item) => sum + item.value, 0);

  if (confirmed) {
    return (
      <CreatorShell>
        <PrintedReceipt
          title="Shop receipt"
          statusLabels={{ processing: "Sending your requests", printing: "Printing your receipt", complete: "Waiting for brand approval" }}
          screenLabel="Shop requests"
          screenValue={`${CART_ITEMS.length} ${CART_ITEMS.length === 1 ? "product" : "products"} · $${total}`}
          items={CART_ITEMS}
          paidWith="Paid with content."
          reviewTitle="Pending approval"
          reviewNote="Brands review your profile first. Approved content payments get a delivery deadline."
          backHref="/shops"
        />
      </CreatorShell>
    );
  }

  return <CreatorShell><div className="mx-auto w-full max-w-xl px-5 py-8 sm:px-8 sm:py-12"><CreatorBreadcrumb items={[{ label: "Shop", href: "/explore" }, { label: "Cart", href: "/cart" }, { label: "Checkout" }]} /><header className="mt-7"><h1 className="text-4xl font-bold tracking-tight">Confirm your shop</h1><p className="mt-2 text-sm text-neutral-500">No payment details. Your profile is your pitch.</p></header><div className="mt-9 divide-y divide-neutral-100 overflow-hidden rounded-[1.75rem] border border-neutral-200 bg-white">{CART_ITEMS.map(item => <div key={item.id} className="flex items-center gap-4 p-5"><div className="grid size-12 place-items-center rounded-xl bg-neutral-50"><Image src={item.logo} alt="" width={26} height={26} className="size-7 object-contain" /></div><div className="min-w-0 flex-1"><p className="text-xs text-neutral-500">{item.brand}</p><p className="font-bold">{item.product}</p><p className="mt-0.5 text-xs text-neutral-500">{item.tier} · {item.access} access</p></div><p className="font-bold">${item.value}</p></div>)}</div><div className="mt-6 flex items-end justify-between"><div><p className="text-sm font-semibold text-neutral-950">Total retail value</p><p className="mt-0.5 text-xs text-neutral-500">Paid with your chosen content</p></div><p className="text-3xl font-bold tracking-tight">${total}</p></div><div className="mt-7 flex items-start gap-3 rounded-2xl bg-neutral-100 p-4"><ShieldCheckIcon className="mt-0.5 size-5 shrink-0 text-[#73b61f]" /><p className="text-sm leading-6 text-neutral-600">By confirming, you’re asking each brand to review your public profile. Approved shops give you a delivery deadline and unlock access once your proof is confirmed.</p></div><Button onClick={() => setConfirmed(true)} variant="dark" size="lg" fullWidth iconLeft={<ShoppingCartIcon className="size-4" />} className="mt-7" style={{ ...darkGradientButtonStyle, padding: "14px 20px" }}>Confirm</Button></div></CreatorShell>;
}
