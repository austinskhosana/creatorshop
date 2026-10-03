"use client";

import Link from "next/link";
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline";
import { darkGradientButtonStyle } from "@/components/atoms/Button/darkGradientStyle";
import { CreatorBreadcrumb } from "@/components/molecules/CreatorBreadcrumb";
import { ShopperReviewCard } from "@/components/organisms/ShopperReviewCard";
import { BrandShell } from "@/components/templates/BrandShell";
import type { Shopper } from "@/lib/data/brand-schema";

/**
 * A creator's public profile as a brand sees it — the review card at full length — with a way to
 * start (or reopen) the thread.
 */
export default function BrandCreatorProfilePage({ shopper }: { shopper: Shopper }) {
  return (
    <BrandShell>
      <div className="mx-auto w-full max-w-[34rem] px-4 py-8 sm:px-0 sm:py-12">
        <div className="flex items-center justify-between gap-4">
          <CreatorBreadcrumb items={[{ label: "Creators", href: "/brand/creators" }, { label: shopper.name }]} />
          <Link
            href={`/brand/messages?thread=${shopper.id}`}
            className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-[9px] px-4 text-[13px] font-medium text-white transition-[filter,transform] duration-150 hover:brightness-125 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
            style={darkGradientButtonStyle}
          >
            <ChatBubbleLeftEllipsisIcon aria-hidden="true" className="size-4" />
            Message
          </Link>
        </div>
        <ShopperReviewCard shopper={shopper} full titleAs="h1" className="mt-5" />
      </div>
    </BrandShell>
  );
}
