"use client";

import { useState } from "react";
import { EmptyBag } from "@/components/atoms/EmptyBag";
import { EmptyState } from "@/components/molecules/EmptyState";
import { FlashMessage, useFlash } from "@/components/molecules/FlashMessage";
import { PageHeader } from "@/components/molecules/PageHeader";
import { BrandShopCard } from "@/components/organisms/BrandShopCard";
import { ProofReviewModal } from "@/components/organisms/ProofReviewModal";
import { ShopReceiptModal } from "@/components/organisms/ShopReceiptModal";
import { BrandShell } from "@/components/templates/BrandShell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/lib/brand-format";
import type { BrandShop, BrandShopState } from "@/lib/data/brand-schema";
import { getShopper } from "@/lib/mock-brand";
import { brandStore, useBrandState } from "@/lib/store/brand-store";

const FILTERS: { label: string; states: BrandShopState[] }[] = [
  { label: "Needs you", states: ["posted", "overdue", "under_review"] },
  { label: "Awaiting post", states: ["approved"] },
  { label: "Access active", states: ["confirmed", "active"] },
  { label: "Completed", states: ["expired", "incomplete"] },
  { label: "All", states: ["posted", "overdue", "under_review", "approved", "confirmed", "active", "expired", "incomplete"] },
];

/** Most urgent first: proof to check, then overdue, then nearest deadline. */
const URGENCY: Record<BrandShopState, number> = { posted: 0, under_review: 1, overdue: 2, approved: 3, confirmed: 4, active: 5, expired: 6, incomplete: 7 };

/** B6/B7 — every approved shop: deadlines, overdue flags, proof confirmation, receipts. */
function Shops() {
  const { account, products, shops } = useBrandState();
  const [selected, setSelected] = useState(() => (shops.some((shop) => FILTERS[0].states.includes(shop.state)) ? 0 : 4));
  // The shop stays set through the exit animation; `open` is what toggles the dialog.
  const [proofShop, setProofShop] = useState<BrandShop | null>(null);
  const [proofOpen, setProofOpen] = useState(false);
  const [receiptShop, setReceiptShop] = useState<BrandShop | null>(null);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [flash, showFlash] = useFlash();

  if (!account) return null;
  const filter = FILTERS[selected];
  const visible = shops
    .filter((shop) => filter.states.includes(shop.state))
    .sort((a, b) => URGENCY[a.state] - URGENCY[b.state] || a.deadline.localeCompare(b.deadline));
  const proofShopper = proofShop && getShopper(proofShop.shopperId);
  const receiptShopper = receiptShop && getShopper(receiptShop.shopperId);

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
      <PageHeader title="Shops" description="Every creator you've approved. Approved shops are protected — they can't be cancelled." />

      {shops.length === 0 ? (
        <EmptyState
          className="mt-9"
          illustration={<EmptyBag />}
          title="No shops yet"
          description="Approve a shopper and their shop appears here with a delivery deadline."
          action={{ label: "Review shoppers", href: "/brand/review" }}
          secondaryAction={{ label: "Back to storefront", href: "/brand" }}
        />
      ) : (
        <Tabs value={String(selected)} onValueChange={(value) => setSelected(Number(value))} className="mt-9">
          <TabsList className="max-w-full overflow-x-auto [scrollbar-width:none]">
            {FILTERS.map((item, index) => (
              <TabsTrigger key={item.label} value={String(index)}>
                {item.label}
                <span className="ml-1.5 text-xs font-medium tabular-nums">{shops.filter((shop) => item.states.includes(shop.state)).length}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value={String(selected)} className="mt-7">
            {visible.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {visible.map((shop) => {
                  const shopper = getShopper(shop.shopperId);
                  return shopper ? <BrandShopCard key={shop.id} shop={shop} shopper={shopper} onReviewProof={(item) => { setProofShop(item); setProofOpen(true); }} onViewReceipt={(item) => { setReceiptShop(item); setReceiptOpen(true); }} /> : null;
                })}
              </div>
            ) : (
              <EmptyState
                illustration={<EmptyBag />}
                title={selected === 0 ? "Nothing needs you right now" : `No shops ${filter.label.toLowerCase()}`}
                description={selected === 0 ? "Proof to check and overdue posts show up here first." : "Shops move between tabs as creators post and you confirm."}
                action={{ label: "See all shops", onClick: () => setSelected(4) }}
              />
            )}
          </TabsContent>
        </Tabs>
      )}

      {proofShop && proofShopper ? (
        <ProofReviewModal
          open={proofOpen}
          onClosed={() => setProofShop(null)}
          shop={proofShop}
          shopper={proofShopper}
          accessMethod={products.find((product) => product.id === proofShop.productId)?.accessMethod}
          onClose={() => setProofOpen(false)}
          onConfirm={() => {
            brandStore.confirmProof(proofShop.id);
            setProofOpen(false);
            showFlash({ message: `Confirmed. ${proofShopper.name}'s access to ${proofShop.productName} is unlocked.` });
          }}
          onDecline={(reason) => {
            brandStore.declineProof(proofShop.id, reason);
            setProofOpen(false);
            showFlash({ message: `Sent back to ${proofShopper.name}. Still due ${formatDate(proofShop.deadline)}.`, action: { label: "Open thread", href: `/brand/messages?thread=${proofShopper.id}` } });
          }}
        />
      ) : null}
      {receiptShop && receiptShopper ? (
        <ShopReceiptModal open={receiptOpen} onClosed={() => setReceiptShop(null)} shop={receiptShop} shopper={receiptShopper} brandName={account.companyName} onClose={() => setReceiptOpen(false)} />
      ) : null}

      <FlashMessage {...flash} />
    </div>
  );
}

export default function BrandShopsPage() {
  return (
    <BrandShell>
      <Shops />
    </BrandShell>
  );
}
