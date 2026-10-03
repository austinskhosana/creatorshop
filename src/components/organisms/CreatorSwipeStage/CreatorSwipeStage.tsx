"use client";

import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/16/solid";
import { ShopperReviewCard } from "@/components/organisms/ShopperReviewCard";
import { SwipeReviewActions, SwipeReviewCard } from "@/components/organisms/SwipeReview";
import type { Shopper } from "@/lib/data/brand-schema";

/** A key cap with the arrow drawn as an icon, so it sits dead centre — text arrows ride high in most fonts. */
const KEY_CLASS = "inline-grid size-5 place-items-center rounded-md border border-neutral-200 bg-white align-middle text-neutral-600 shadow-[0_1px_0_rgba(0,0,0,0.05)]";

interface CreatorSwipeStageProps {
  shopper: Shopper;
  /** Remounts the draggable card per decision — the pitch id in review, the creator id in the directory. */
  cardKey: string;
  onSwiped: (direction: 1 | -1) => void;
  /** After the first decision, each new card eases in instead of appearing. */
  enterAfterSwipe: boolean;
  programmaticDirection: 1 | -1 | null;
  disabled: boolean;
  onDeny: () => void;
  onUndo: () => void;
  onApprove: () => void;
  canUndo: boolean;
  /** What a right swipe does, lowercase, for the keyboard hint: "approve", "invite". */
  approveVerb: string;
  /** Stamped over the card while it's dragged right. */
  approveStamp?: string;
  approveLabel: string;
}

/**
 * A creator's card, the pass / undo / approve row, and the keyboard hint — the one swipe screen
 * brands use, whether they're reviewing shoppers or browsing the directory. Lives in a flex column
 * that fills the viewport: the buttons keep a fixed distance from the card, spare height goes to
 * the card first (capped), then splits evenly above and below so the group sits centered.
 */
export default function CreatorSwipeStage({
  shopper,
  cardKey,
  onSwiped,
  enterAfterSwipe,
  programmaticDirection,
  disabled,
  onDeny,
  onUndo,
  onApprove,
  canUndo,
  approveVerb,
  approveStamp,
  approveLabel,
}: CreatorSwipeStageProps) {
  return (
    <div className="mx-auto flex w-full max-w-[34rem] flex-1 flex-col">
      {/* Starts at 12px to match the padding under the hint, so the visible group centers exactly. */}
      <div aria-hidden className="min-h-3 grow basis-3" />
      {/* The invisible copy sets the minimum height; the draggable card fills the whole stage. */}
      <div className="relative grid grow-[6] lg:max-h-[36rem]">
        <div aria-hidden className="invisible [grid-area:1/1]">
          <ShopperReviewCard shopper={shopper} showShader={false} />
        </div>
        <SwipeReviewCard
          key={cardKey}
          fill
          onSwiped={onSwiped}
          enterAfterSwipe={enterAfterSwipe}
          programmaticDirection={programmaticDirection}
          disabled={disabled}
          approveText={approveStamp}
        >
          <ShopperReviewCard shopper={shopper} className="h-full" />
        </SwipeReviewCard>
      </div>
      <div aria-hidden className="h-9 shrink-0" />

      {/* Sticky so the decision stays in reach if the window is too short for the whole card. The
          hint gap tightens on short screens so the whole deck still fits without scrolling. */}
      <div className="sticky bottom-0 z-10 -mx-4 bg-gradient-to-t from-white from-75% to-white/0 px-4 pt-4 pb-3">
        <SwipeReviewActions
          className=""
          onDeny={onDeny}
          onUndo={onUndo}
          onApprove={onApprove}
          canUndo={canUndo}
          disabled={disabled}
          denyLabel={`Pass on ${shopper.name}`}
          approveLabel={approveLabel}
        />
        <p className="mt-6 text-center text-xs leading-5 text-neutral-500 [@media(min-height:800px)]:mt-10">
          <span className="hidden sm:inline">
            Drag the card, or press{" "}
            <kbd className={KEY_CLASS}>
              <ArrowLeftIcon aria-hidden="true" className="size-3" />
              <span className="sr-only">Left arrow</span>
            </kbd>{" "}
            to pass and{" "}
            <kbd className={KEY_CLASS}>
              <ArrowRightIcon aria-hidden="true" className="size-3" />
              <span className="sr-only">Right arrow</span>
            </kbd>{" "}
            to {approveVerb} ·{" "}
          </span>
          <Link
            href={`/brand/creators/${shopper.handle}`}
            className="rounded-sm font-medium text-neutral-700 underline decoration-neutral-300 underline-offset-4 transition-[text-decoration-color] duration-150 hover:decoration-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          >
            Open full profile
          </Link>
        </p>
      </div>
      <div aria-hidden className="grow" />
    </div>
  );
}
