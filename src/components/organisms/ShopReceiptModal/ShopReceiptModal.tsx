"use client";

import { ReceiptPercentIcon } from "@heroicons/react/24/outline";
import { ModalPanel } from "@/components/molecules/ModalPanel";
import { formatDate, formatMonths, formatUsd } from "@/lib/brand-format";
import type { BrandShop, Shopper } from "@/lib/data/brand-schema";

interface ShopReceiptModalProps {
  open: boolean;
  /** After the exit animation. */
  onClosed: () => void;
  shop: BrandShop;
  shopper: Shopper;
  brandName: string;
  onClose: () => void;
}

/** The paper record of a barter: what was bought, what paid for it, and what it was worth. */
export default function ShopReceiptModal({ open, onClosed, shop, shopper, brandName, onClose }: ShopReceiptModalProps) {
  const rows: [string, string][] = [
    ["Date", shop.accessStart ? formatDate(shop.accessStart) : formatDate(shop.approvedAt)],
    ["Merchant", brandName],
    ["Shopper", `${shopper.name} (@${shopper.handle})`],
    ["Product", shop.productName],
    ["Price tier", shop.tierName],
    ["Access", shop.accessStart && shop.accessEnd ? `${formatMonths(shop.months)} · ${formatDate(shop.accessStart)} – ${formatDate(shop.accessEnd)}` : formatMonths(shop.months)],
  ];

  return (
    <ModalPanel title="Receipt" icon={<ReceiptPercentIcon className="size-5" strokeWidth={1.75} />} description="Paid with a post. Emailed to you and the creator when proof was confirmed." open={open} onOpenChange={(next) => !next && onClose()} onClosed={onClosed}>
      <div className="mt-6 rounded-xl border border-dashed border-neutral-300 px-4 py-1">
        <dl className="divide-y divide-dashed divide-neutral-200 text-sm">
          {rows.map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 py-2.5">
              <dt className="shrink-0 text-neutral-500">{label}</dt>
              <dd className="text-right font-medium text-neutral-900">{value}</dd>
            </div>
          ))}
          {shop.proofUrl ? (
            <div className="flex justify-between gap-4 py-2.5">
              <dt className="shrink-0 text-neutral-500">Proof</dt>
              <dd className="min-w-0 truncate text-right">
                <a href={shop.proofUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-neutral-900 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-900">
                  {shop.proofUrl.replace(/^https?:\/\//, "")}
                </a>
              </dd>
            </div>
          ) : null}
          <div className="flex items-end justify-between gap-4 py-3">
            <dt className="font-semibold text-neutral-950">Retail value</dt>
            <dd className="text-2xl font-bold tracking-tight tabular-nums text-neutral-950">{formatUsd(shop.retailValue)}</dd>
          </div>
        </dl>
      </div>
      <p className="mt-3 font-mono text-[11px] text-neutral-400">Shop ID {shop.id}</p>
    </ModalPanel>
  );
}
