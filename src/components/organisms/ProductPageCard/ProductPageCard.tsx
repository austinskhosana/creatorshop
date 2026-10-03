"use client";

import Link from "next/link";
import { InboxStackIcon } from "@heroicons/react/24/outline";
import Badge from "@/components/atoms/Badge/Badge";
import { darkGradientButtonStyle } from "@/components/atoms/Button/darkGradientStyle";
import PlatformIcon from "@/components/atoms/PlatformIcon/PlatformIcon";
import { ActionMenu, type ActionMenuItem } from "@/components/molecules/ActionMenu";
import { StatusPill } from "@/components/molecules/StatusPill";
import { StockMeter } from "@/components/molecules/StockMeter";
import { PRODUCT_STATUS, formatAccessRange, formatUsd } from "@/lib/brand-format";
import type { ProductPage } from "@/lib/data/brand-schema";
import { cn } from "@/lib/utils";

interface ProductPageCardProps {
  product: ProductPage;
  remaining: number;
  /** Shoppers waiting for review. Manage variant only. */
  pending?: number;
  /** "manage" is the merchant's own view; "storefront" is what creators see. */
  variant?: "manage" | "storefront";
  /** Where the whole card leads — the page as creators see it. Unset for previews. */
  href?: string;
  actions?: ActionMenuItem[];
}

const ACTION_CLASS =
  "inline-flex min-h-9 items-center gap-1.5 rounded-lg px-3.5 text-xs font-medium transition-[background-color,border-color,filter,transform] duration-150 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2";

const TITLE_CLASS = "min-w-0 text-balance text-[16px] leading-snug font-semibold tracking-[-0.025em] text-neutral-950";

/**
 * A product page as a card, in the same geometry as the shop's ListingCard. It stays a summary —
 * the delivery window, access method and full terms live on the page `href` opens.
 */
export default function ProductPageCard({ product, remaining, pending = 0, variant = "manage", href, actions = [] }: ProductPageCardProps) {
  const status = PRODUCT_STATUS[product.status];
  const lowestValue = Math.min(...product.tiers.map((tier) => tier.retailValue));
  const manage = variant === "manage";

  return (
    <article
      className={cn(
        "relative flex h-full min-h-[300px] flex-col rounded-[20px] border border-neutral-200 bg-white p-6 text-left",
        product.status === "draft" && manage && "border-dashed",
        href && "transition-[border-color,box-shadow] duration-150 hover:border-neutral-300 hover:shadow-[0_2px_12px_rgba(0,0,0,0.05)]",
      )}
    >
      <div className="pb-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className={TITLE_CLASS}>
            {href ? (
              // Stretched link: the whole card opens the page; footer actions sit above it.
              <Link
                href={href}
                className="outline-none after:absolute after:inset-0 after:rounded-[20px] focus-visible:after:ring-2 focus-visible:after:ring-neutral-900 focus-visible:after:ring-offset-2"
              >
                {product.name}
              </Link>
            ) : (
              product.name
            )}
          </h3>
          {manage || product.status !== "live" ? <StatusPill tone={status.tone} label={status.label} /> : null}
        </div>
        <p className="mt-2.5 line-clamp-2 text-pretty text-[13px] leading-[1.55] text-neutral-500">{product.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {product.tiers.map((tier) => (
            <Badge key={tier.id} variant="tag" label={tier.name} icon={<PlatformIcon platform={tier.name} className="h-3 w-3" />} />
          ))}
        </div>
        <StockMeter remaining={remaining} total={product.stock} className="mt-6" />
      </div>

      <div className="mt-auto flex items-end justify-between gap-3 border-t border-neutral-100 pt-5">
        <div>
          <p className="text-[15px] font-semibold tabular-nums text-neutral-900">
            {product.tiers.length > 1 ? "From " : ""}
            {formatUsd(lowestValue)}
          </p>
          <p className="mt-0.5 text-[11px] text-neutral-400">Retail value</p>
          <p className="mt-0.5 text-[11px] tabular-nums text-neutral-500">{formatAccessRange(product.tiers)} access</p>
        </div>
        {manage ? (
          <div className="relative z-10 flex items-center gap-2">
            {pending > 0 && product.status === "live" ? (
              <Link href={`/brand/review?product=${product.id}`} className={cn(ACTION_CLASS, "text-white hover:brightness-125")} style={darkGradientButtonStyle}>
                <InboxStackIcon aria-hidden="true" className="size-3.5" strokeWidth={1.75} />
                Review <span className="tabular-nums">{pending}</span>
              </Link>
            ) : null}
            {actions.length > 0 ? <ActionMenu items={actions} label={`More actions for ${product.name}`} /> : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}
