"use client";

import { useMemo, useState } from "react";
import { CART_ITEMS } from "@/lib/mock-creator";
import { CreatorBreadcrumb } from "@/components/molecules/CreatorBreadcrumb";
import { CartLineItem, type CartLineItemData } from "@/components/molecules/CartLineItem";
import { EmptyState } from "@/components/molecules/EmptyState";
import { CartSummary } from "@/components/organisms/CartSummary";
import { CreatorShell } from "@/components/templates/CreatorShell";

interface CartPageProps {
  initialItems?: CartLineItemData[];
}

export default function CartPage({ initialItems = CART_ITEMS }: CartPageProps) {
  const [items, setItems] = useState(initialItems);
  const total = useMemo(() => items.reduce((sum, item) => sum + item.value, 0), [items]);

  const removeItem = (id: string) => setItems((current) => current.filter((item) => item.id !== id));

  return (
    <CreatorShell>
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
        <CreatorBreadcrumb items={[{ label: "Shop", href: "/explore" }, { label: "Cart" }]} />

        <div className="mt-6 flex items-end justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Cart</h1>
          </div>
        </div>

        {items.length ? (
          <div className="mt-9 grid items-start gap-7 lg:grid-cols-[1.45fr_.7fr]">
            <div className="divide-y divide-neutral-100 overflow-hidden rounded-[1.75rem] border border-neutral-200 bg-white">
              {items.map((item) => (
                <CartLineItem key={item.id} item={item} onRemove={removeItem} />
              ))}
            </div>
            <CartSummary total={total} checkoutHref="/checkout" />
          </div>
        ) : (
          <div className="mt-9 rounded-[2rem] border border-dashed border-neutral-300 bg-white">
            <EmptyState
              title="Your cart is waiting."
              description="Find software you love and pay with the campaign's required post."
              action={{ label: "Browse the store", href: "/explore" }}
            />
          </div>
        )}
      </div>
    </CreatorShell>
  );
}
