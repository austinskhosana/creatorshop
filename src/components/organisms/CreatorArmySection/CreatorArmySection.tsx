"use client";

import { useState } from "react";
import { ShopperReviewCard } from "@/components/organisms/ShopperReviewCard";
import { SwipeReviewActions, SwipeReviewCard } from "@/components/organisms/SwipeReview";
import type { Shopper } from "@/lib/data/brand-schema";
import { SHOPPERS } from "@/lib/mock-brand";

/** Fictional creators from the brand-side mock roster, in the same card brands review them with. */
const CREATOR_ARMY: Shopper[] = ["theo", "nova", "marcus"].flatMap((id) => SHOPPERS.filter((shopper) => shopper.id === id));

export default function CreatorArmySection() {
  const [queue, setQueue] = useState(CREATOR_ARMY);
  const [hasSwiped, setHasSwiped] = useState(false);
  const [programmaticDirection, setProgrammaticDirection] = useState<1 | -1 | null>(null);
  // isAnimating and history both track by-button decisions (not drags): isAnimating
  // blocks a second button press mid-fling, history is what "undo" restores.
  const [isAnimating, setIsAnimating] = useState(false);
  const [history, setHistory] = useState<Shopper[][]>([]);

  function handleSwiped() {
    setHistory((prev) => [...prev, queue]);
    setHasSwiped(true);
    setQueue((prev) => {
      const [first, ...rest] = prev;
      return [...rest, first];
    });
    setProgrammaticDirection(null);
    setIsAnimating(false);
  }

  function triggerSwipe(direction: 1 | -1) {
    if (isAnimating) return;
    setIsAnimating(true);
    setProgrammaticDirection(direction);
  }

  function handleUndo() {
    if (isAnimating || history.length === 0) return;
    setHistory((prev) => {
      const next = [...prev];
      const restored = next.pop();
      if (restored) setQueue(restored);
      return next;
    });
  }

  const activeCreator = queue[0];

  return (
    <section className="relative flex flex-col items-center bg-white px-6 pt-40 sm:px-10 sm:pt-56 lg:px-16 lg:pt-72">
      <h2 className="max-w-xl text-center text-2xl leading-[1.1] font-medium text-neutral-900 sm:text-3xl">
        Swipe left or right to build your
        <br />
        creator army
      </h2>
      <p className="mt-4 max-w-md text-center text-base leading-6 text-neutral-500 [text-wrap:pretty]">
        Review creators one by one, keep the right fit, and quickly pass on anyone who is not a match.
      </p>

      <div className="relative mt-14 w-full max-w-[34rem] sm:mt-16">
        {/* Invisible spacer: reserves the active card's natural height while the real card sits on top. */}
        <div aria-hidden className="invisible">
          <ShopperReviewCard shopper={activeCreator} showShader={false} />
        </div>

        <div key={activeCreator.id} className="absolute inset-x-0 top-0">
          <SwipeReviewCard
            onSwiped={handleSwiped}
            enterAfterSwipe={hasSwiped}
            programmaticDirection={programmaticDirection}
            disabled={isAnimating}
          >
            <ShopperReviewCard shopper={activeCreator} />
          </SwipeReviewCard>
        </div>
      </div>

      <SwipeReviewActions
        onDeny={() => triggerSwipe(-1)}
        onUndo={handleUndo}
        onApprove={() => triggerSwipe(1)}
        canUndo={history.length > 0}
        disabled={isAnimating}
      />
    </section>
  );
}
