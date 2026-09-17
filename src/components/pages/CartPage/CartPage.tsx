"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCartIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useMemo, useState } from "react";
import { CART_ITEMS } from "@/lib/mock-creator";
import Button from "@/components/atoms/Button/Button";
import { CreatorBreadcrumb } from "@/components/molecules/CreatorBreadcrumb";
import { CreatorShell } from "@/components/templates/CreatorShell";

export default function CartPage() {
  const [items, setItems] = useState(CART_ITEMS);
  const total = useMemo(() => items.reduce((sum, item) => sum + item.value, 0), [items]);

  return (
    <CreatorShell>
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
        <CreatorBreadcrumb items={[{ label: "Shop", href: "/explore" }, { label: "Cart" }]} />
        <div className="mt-6 flex items-end justify-between"><div><p className="text-xs font-bold tracking-[0.15em] text-[#73b61f] uppercase">Your basket</p><h1 className="mt-1 text-4xl font-bold tracking-tight">Cart <span className="text-neutral-300">({items.length})</span></h1></div></div>

        {items.length ? <div className="mt-9 grid items-start gap-7 lg:grid-cols-[1.45fr_.7fr]"><div className="overflow-hidden rounded-[1.75rem] border border-neutral-200 bg-white">{items.map(item => <div key={item.id} className="flex gap-4 p-5 sm:gap-5 sm:p-6"><div className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-2xl border border-neutral-100 bg-neutral-50"><Image src={item.logo} alt="" width={32} height={32} className="size-8 object-contain" /></div><div className="min-w-0 flex-1"><p className="text-xs font-medium text-neutral-500">{item.brand}</p><h2 className="truncate text-base font-bold">{item.product}</h2><div className="mt-3 flex flex-wrap items-center gap-2"><span className="rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1.5 text-xs font-medium text-neutral-700">{item.tier}</span><span className="text-xs text-neutral-500">{item.access} access</span></div></div><div className="flex flex-col items-end justify-between"><p className="font-bold">${item.value}</p><button onClick={() => setItems(current => current.filter(candidate => candidate.id !== item.id))} aria-label={`Remove ${item.product}`} className="grid size-8 place-items-center rounded-full text-neutral-400 transition hover:bg-red-50 hover:text-red-600"><TrashIcon className="size-4" /></button></div></div>)}</div><aside className="sticky top-7 overflow-hidden rounded-[1.75rem] border border-neutral-200 bg-white p-5 sm:p-6"><p className="text-xs font-bold tracking-[0.14em] text-neutral-500 uppercase">Your transaction</p><h2 className="mt-2.5 text-2xl font-bold leading-tight text-neutral-950">You’re shopping <span>${total}</span> worth of software.</h2><p className="mt-4 text-sm leading-6 text-neutral-500">You pay with each brand’s required content, never money.</p><div className="mt-7 border-t border-neutral-200 pt-4"><div className="flex justify-between text-sm"><span className="text-neutral-500">Retail value</span><span className="font-semibold text-neutral-950">${total}</span></div></div><Link href="/checkout" className="mt-5 block"><Button variant="accent" size="lg" fullWidth iconLeft={<ShoppingCartIcon className="size-4" />} style={{ borderRadius: "8px" }}>Confirm your shop</Button></Link></aside></div> : <div className="mt-9 rounded-[2rem] border border-dashed border-neutral-300 bg-white px-6 py-20 text-center"><div className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#efffdc]"><span className="text-2xl">✦</span></div><h2 className="mt-5 text-xl font-bold">Your cart is waiting.</h2><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-neutral-500">Find software you love and pay with the campaign’s required post.</p><Link href="/explore" className="mt-6 inline-block"><Button>Browse the store</Button></Link></div>}
      </div>
    </CreatorShell>
  );
}
