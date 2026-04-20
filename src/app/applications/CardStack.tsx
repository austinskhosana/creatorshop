"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import SwipeCard from "./SwipeCard";
import type { Application } from "./types";

interface CardStackProps {
  queue: Application[];
  onSwipe: (decision: "approve" | "deny") => void;
  programmaticDirection: "approve" | "deny" | null;
  onProgrammaticAnimationDone: () => void;
}

export default function CardStack({
  queue,
  onSwipe,
  programmaticDirection,
  onProgrammaticAnimationDone,
}: CardStackProps) {
  const [isExiting, setIsExiting] = useState(false);

  function handleSwipe(decision: "approve" | "deny") {
    if (isExiting) return;
    setIsExiting(true);
    onSwipe(decision);
    setTimeout(() => setIsExiting(false), 420);
  }

  function handleProgrammaticDone() {
    onProgrammaticAnimationDone();
    setTimeout(() => setIsExiting(false), 100);
  }

  const visibleCards = queue.slice(0, 3);

  return (
    // Outer container establishes the stacking context — all cards are absolute inside it.
    <div className="relative w-[360px] h-[410px]">

      {/* Ghost cards — rendered back-to-front so lower z-index = further back */}
      {visibleCards.slice(1).reverse().map((app, reversedIndex) => {
        // reversedIndex 0 = furthest back (index 2 in original), 1 = middle (index 1)
        const depth = visibleCards.slice(1).length - reversedIndex; // 1 or 2
        const scale = 1 - depth * 0.05;
        const translateY = depth * 12;

        return (
          <div
            key={app.id}
            className="absolute inset-0 pointer-events-none transition-transform duration-300 ease-out"
            style={{
              transform: `translateY(${translateY}px) scale(${scale})`,
              zIndex: 30 - depth * 10,
              filter: `brightness(${1 - depth * 0.02})`,
            }}
          >
            <SwipeCard app={app} isGhost />
          </div>
        );
      })}

      {/* Active card — wrapped in AnimatePresence so exit animations fire on unmount */}
      <AnimatePresence mode="wait">
        {queue[0] && (
          <div key={queue[0].id} className="absolute inset-0" style={{ zIndex: 30 }}>
            <SwipeCard
              app={queue[0]}
              onSwipe={handleSwipe}
              programmaticDirection={
                // Only forward the direction if we're not already mid-drag-exit
                !isExiting ? programmaticDirection : null
              }
              onProgrammaticAnimationDone={handleProgrammaticDone}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
