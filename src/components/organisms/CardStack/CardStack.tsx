"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { SwipeCard } from "@/components/organisms/SwipeCard";
import type { Application } from "@/components/organisms/SwipeCard";

interface CardStackProps {
  queue: Application[];
  onSwipe: (decision: "approve" | "deny") => void;
  programmaticDirection: "approve" | "deny" | null;
  onProgrammaticAnimationDone: () => void;
}

export default function CardStack({ queue, onSwipe, programmaticDirection, onProgrammaticAnimationDone }: CardStackProps) {
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
    <div className="relative h-[410px] w-[360px]">
      {visibleCards
        .slice(1)
        .reverse()
        .map((app, reversedIndex) => {
          const depth = visibleCards.slice(1).length - reversedIndex;
          const scale = 1 - depth * 0.05;
          const translateY = depth * 12;

          return (
            <div
              key={app.id}
              className="pointer-events-none absolute inset-0 transition-transform duration-300 ease-out"
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

      <AnimatePresence mode="wait">
        {queue[0] && (
          <div key={queue[0].id} className="absolute inset-0" style={{ zIndex: 30 }}>
            <SwipeCard
              app={queue[0]}
              onSwipe={handleSwipe}
              programmaticDirection={!isExiting ? programmaticDirection : null}
              onProgrammaticAnimationDone={handleProgrammaticDone}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
