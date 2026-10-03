"use client";

import Link from "next/link";
import { CalendarIcon, ChatBubbleLeftEllipsisIcon, DocumentTextIcon, LinkIcon } from "@heroicons/react/24/outline";
import Avatar from "@/components/atoms/Avatar/Avatar";
import Badge from "@/components/atoms/Badge/Badge";
import Button from "@/components/atoms/Button/Button";
import { darkGradientButtonStyle } from "@/components/atoms/Button/darkGradientStyle";
import PlatformIcon from "@/components/atoms/PlatformIcon/PlatformIcon";
import { StatusPill } from "@/components/molecules/StatusPill";
import { BRAND_SHOP_STATE, formatDate, formatMonths, formatUsd, relativeDays } from "@/lib/brand-format";
import type { BrandShop, Shopper } from "@/lib/data/brand-schema";

interface BrandShopCardProps {
  shop: BrandShop;
  shopper: Shopper;
  onReviewProof: (shop: BrandShop) => void;
  onViewReceipt: (shop: BrandShop) => void;
}

/** The one line that says what this shop is waiting on. */
function nextStep(shop: BrandShop, shopper: Shopper) {
  const first = shopper.name.split(" ")[0];
  switch (shop.state) {
    case "approved":
      return shop.proofDeclineReason
        ? `You sent proof back: “${shop.proofDeclineReason}” Still due ${formatDate(shop.deadline)}.`
        : `${first}'s post is due ${formatDate(shop.deadline)}, ${relativeDays(shop.deadline)}.`;
    case "posted":
      return `${first} posted. Check the post, then confirm to release access.`;
    case "overdue":
      return `Post was due ${formatDate(shop.deadline)}, ${relativeDays(shop.deadline)}. The shop stays open — nudge ${first} in your thread.`;
    case "active":
      return shop.accessEnd ? `Access runs until ${formatDate(shop.accessEnd)}.` : "Access is active.";
    case "expired":
      return shop.accessEnd ? `Access ended ${formatDate(shop.accessEnd)}.` : "Access has ended.";
    case "under_review":
      return "A report is open. Creatorshop will be in touch.";
    default:
      return null;
  }
}

/** A brand's view of one protected shop — same geometry as the creator's My Shops card. */
export default function BrandShopCard({ shop, shopper, onReviewProof, onViewReceipt }: BrandShopCardProps) {
  const state = BRAND_SHOP_STATE[shop.state];
  const step = nextStep(shop, shopper);
  const receipt = shop.state === "active" || shop.state === "expired" || shop.state === "confirmed";

  return (
    <article className="flex min-h-[260px] flex-col rounded-[20px] border border-neutral-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <Link
          href={`/brand/creators/${shopper.handle}`}
          className="group flex min-w-0 items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
        >
          <Avatar src={shopper.avatar} name={shopper.name} size="lg" className="shrink-0 border-neutral-200 ring-0" />
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-neutral-950 group-hover:underline group-hover:decoration-neutral-300 group-hover:underline-offset-4">{shopper.name}</span>
            <span className="block truncate text-xs text-neutral-500">@{shopper.handle}</span>
          </span>
        </Link>
        <StatusPill tone={state.tone} label={state.label} />
      </div>

      <div className="mt-auto pt-5">
        <h2 className="text-[16px] leading-snug font-semibold tracking-[-0.025em] text-neutral-950">{shop.productName}</h2>
        {step ? <p className="mt-2 text-[13px] leading-5 font-medium text-neutral-950">{step}</p> : null}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge variant="tag" label={shop.tierName} icon={<PlatformIcon platform={shop.tierName} className="size-3" />} />
          <Badge variant="tag" label={`${formatMonths(shop.months)} access`} icon={<CalendarIcon className="size-3" />} />
        </div>
      </div>

      <div className="mt-3 flex items-end justify-between border-t border-neutral-100 pt-3">
        <div>
          <p className="text-[15px] font-semibold tabular-nums text-neutral-900">{formatUsd(shop.retailValue)}</p>
          <p className="text-[11px] text-neutral-400">Retail value</p>
        </div>
        {shop.state === "posted" ? (
          <Button variant="dark" size="sm" iconLeft={<LinkIcon className="size-3.5" />} onClick={() => onReviewProof(shop)} style={{ ...darkGradientButtonStyle, padding: "8px 14px" }}>
            Review proof
          </Button>
        ) : receipt ? (
          <Button variant="secondary" size="sm" iconLeft={<DocumentTextIcon className="size-3.5" />} onClick={() => onViewReceipt(shop)} style={{ borderRadius: "8px", padding: "8px 14px", letterSpacing: "normal" }}>
            Receipt
          </Button>
        ) : (
          <Link
            href={`/brand/messages?thread=${shopper.id}`}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3.5 text-xs font-medium text-neutral-800 transition-[background-color,border-color,transform] duration-150 hover:border-neutral-300 hover:bg-neutral-50 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          >
            <ChatBubbleLeftEllipsisIcon aria-hidden="true" className="size-3.5" />
            Message
          </Link>
        )}
      </div>
    </article>
  );
}
