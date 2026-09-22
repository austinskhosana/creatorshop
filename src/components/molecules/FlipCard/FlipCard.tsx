"use client";

import { motion, useAnimationControls, useReducedMotion, type Transition } from "framer-motion";
import { type CSSProperties, type ReactNode, useEffect, useState } from "react";
import { useDirectTilt } from "@/hooks/use-direct-tilt";
import { cn } from "@/lib/utils";

interface FlipCardProps {
  id?: string;
  className?: string;
  /** Elliptical corner radius, e.g. "4.2% / 6.6%" — must match the front image's own baked-in rounding. */
  radius: string;
  front: ReactNode;
  back: ReactNode;
  frontStyle?: CSSProperties;
  backStyle?: CSSProperties;
}

// Apple's duration+bounce spring API — easier to reason about than raw
// stiffness/damping, and keeps the bounce in the "subtle" 0.1-0.3 range so
// the flip reads as a deliberate turn-over, not a toy.
const FLIP_TRANSITION = { type: "spring", duration: 0.6, bounce: 0.18 } as const;
const SHEEN_TRANSITION = { duration: 0.6, ease: "easeInOut" } as const;
// A restrained version of a lift-off arc: rises and eases back down across
// the same 0.6s the flip takes.
const LIFT_TRANSITION: Transition = { duration: 0.6, ease: [0.4, 0, 0.2, 1], times: [0, 0.5, 1] };

// How long each face stays showing before it turns over on its own.
const AUTOPLAY_INTERVAL_MS = 3200;

// Parked fully off to the side, then swept across the face on every flip.
const SHEEN_GRADIENT =
  "linear-gradient(105deg, transparent 38%, rgba(255,255,255,0.32) 48%, rgba(255,255,255,0.08) 53%, transparent 62%)";

function Sheen({ play, reduceMotion }: { play: number; reduceMotion: boolean | null }) {
  if (reduceMotion) return null;
  return (
    <motion.div
      key={play}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{ backgroundImage: SHEEN_GRADIENT, backgroundSize: "260% 100%" }}
      initial={{ backgroundPositionX: "135%" }}
      animate={{ backgroundPositionX: "-35%" }}
      transition={SHEEN_TRANSITION}
    />
  );
}

/**
 * An autoplaying double-sided card: hover-tilts on mouse move, then turns
 * itself over every few seconds with a springy lift-off and a light sheen
 * sweeping across whichever face is landing. Used for the creator and brand
 * hero cards — front/back content is fully caller-supplied.
 *
 * The tilt writes `transform` straight to the DOM on every mousemove (no
 * React state, no spring) — see use-direct-tilt for why: a spring fed by
 * React state re-renders on every move and, if wired wrong, can silently
 * stop tracking entirely. A plain CSS transition does the smoothing instead,
 * closer to how Aceternity's 3d-card does it.
 */
export default function FlipCard({ id, className, radius, front, back, frontStyle, backStyle }: FlipCardProps) {
  const reduceMotion = useReducedMotion();
  const { ref: tiltRef, handleMouseMove, handleMouseLeave } = useDirectTilt<HTMLDivElement>(10, 14);

  const [flipped, setFlipped] = useState(false);
  // Bumped on every flip (either direction) so the sheen restarts each time,
  // the way crd-ui's `.crd--flipping` class re-triggers it on every turn.
  const [flipCount, setFlipCount] = useState(0);
  // Imperative controls for the lift arc: its target (["0%","-3%","0%"]) is
  // identical on every flip, so a declarative `animate` prop wouldn't notice
  // anything changed and skip replaying it. `.start()` always plays.
  const liftControls = useAnimationControls();

  useEffect(() => {
    // Freeze on the front and skip the loop entirely when the visitor has
    // asked for reduced motion, same as the access pass's auto-spin.
    if (reduceMotion) return;
    const id = setInterval(() => {
      setFlipped((value) => !value);
      setFlipCount((value) => value + 1);
      liftControls.start({ y: ["0%", "-3%", "0%"], scale: [1, 1.015, 1] }, LIFT_TRANSITION);
    }, AUTOPLAY_INTERVAL_MS);
    return () => clearInterval(id);
  }, [reduceMotion, liftControls]);

  return (
    <div id={id} className={cn("relative w-full max-w-md", className)}>
      <motion.div
        className="aspect-[1440/909] w-full"
        style={{ containerType: "inline-size", perspective: 1000 }}
        animate={liftControls}
      >
        <div
          ref={tiltRef}
          aria-hidden="true"
          onMouseMove={reduceMotion ? undefined : handleMouseMove}
          onMouseLeave={reduceMotion ? undefined : handleMouseLeave}
          className="pointer-events-auto size-full"
          style={{
            transformStyle: "preserve-3d",
            transition: reduceMotion ? "none" : "transform 200ms ease-out",
          }}
        >
          <motion.div
            className="relative size-full"
            style={{ transformStyle: "preserve-3d" }}
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={reduceMotion ? { duration: 0 } : FLIP_TRANSITION}
          >
            <div
              className="absolute inset-0 overflow-hidden [backface-visibility:hidden]"
              style={{ borderRadius: radius, ...frontStyle }}
            >
              {front}
              <Sheen play={flipCount} reduceMotion={reduceMotion} />
            </div>

            <div
              className="absolute inset-0 overflow-hidden [backface-visibility:hidden]"
              style={{ borderRadius: radius, transform: "rotateY(180deg)", ...backStyle }}
            >
              {back}
              <Sheen play={flipCount} reduceMotion={reduceMotion} />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
