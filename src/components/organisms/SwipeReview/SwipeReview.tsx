"use client";

import { useEffect, type ReactNode } from "react";
import { motion, useAnimation, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { ArrowUturnLeftIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";

/**
 * The swipe-to-decide card and its deny / undo / approve buttons. The brand landing page demos it
 * and the brand's real shopper review uses it, so the promise and the product feel identical.
 * Drag right or tap approve to keep a card, left or tap deny to pass.
 */

const OFFSET_THRESHOLD = 120;
const VELOCITY_THRESHOLD = 500;
const DRAG_RANGE = 180;

interface SwipeReviewCardProps {
  /** The card face. Rendered non-interactive while it can be dragged. */
  children: ReactNode;
  onSwiped: (direction: 1 | -1) => void;
  enterAfterSwipe: boolean;
  /** Set by the approve/deny buttons to fling the card the same way a drag release would. */
  programmaticDirection: 1 | -1 | null;
  disabled: boolean;
  /** Stretch to the positioned parent's full height instead of sizing to the card face. */
  fill?: boolean;
  /** The word stamped over the card as it's dragged right / left. */
  approveText?: string;
  denyText?: string;
}

export function SwipeReviewCard({ children, onSwiped, enterAfterSwipe, programmaticDirection, disabled, fill = false, approveText = "Approved", denyText = "Pass" }: SwipeReviewCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const controls = useAnimation();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], shouldReduceMotion ? [0, 0] : [-14, 14]);
  const approveOpacity = useTransform(x, [24, DRAG_RANGE], [0, 1]);
  const approveScale = useTransform(x, [24, DRAG_RANGE], [0.9, 1]);
  const denyOpacity = useTransform(x, [-DRAG_RANGE, -24], [1, 0]);
  const denyScale = useTransform(x, [-DRAG_RANGE, -24], [1, 0.9]);

  useEffect(() => {
    if (!enterAfterSwipe) return;

    controls.start(
      shouldReduceMotion
        ? { opacity: 1, transition: { duration: 0.16 } }
        : {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { type: "spring", duration: 0.34, bounce: 0.08 },
          },
    );
  }, [controls, enterAfterSwipe, shouldReduceMotion]);

  // Carries the release velocity into the exit so the card keeps the momentum
  // the drag already built up, instead of restarting motion from zero.
  function fling(direction: 1 | -1, velocity: number) {
    if (shouldReduceMotion) {
      controls.start({ opacity: 0, transition: { duration: 0.15 } }).then(() => onSwiped(direction));
      return;
    }
    controls
      .start({
        x: direction * 700,
        rotate: direction * 20,
        opacity: 0,
        // A button press has no momentum to carry, so it gets a short ease-in. A drag release keeps
        // its velocity, and the loose rest thresholds end the spring once the card is off-screen
        // rather than waiting for it to settle, so the next card isn't held back.
        transition:
          velocity === 0
            ? { duration: 0.3, ease: [0.4, 0, 1, 1] }
            : { type: "spring", velocity, stiffness: 180, damping: 24, restDelta: 40, restSpeed: 200 },
      })
      .then(() => onSwiped(direction));
  }

  // The approve/deny buttons drive the same fling a drag release would, just with no
  // release velocity of its own. The parent clears programmaticDirection back to null
  // once the fling's onSwiped fires (see handleSwiped), not here — this card instance
  // stays mounted for the whole animation, so a bare state flip wouldn't survive to
  // let a second button click retrigger it.
  useEffect(() => {
    if (!programmaticDirection) return;
    fling(programmaticDirection, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programmaticDirection]);

  return (
    <motion.div
      drag={disabled ? false : "x"}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      whileDrag={{ scale: 0.98 }}
      animate={controls}
      initial={
        enterAfterSwipe
          ? shouldReduceMotion
            ? { opacity: 0 }
            : { opacity: 0, y: 14, scale: 0.98 }
          : false
      }
      onDragEnd={(_, info) => {
        if (disabled) return;
        if (info.offset.x > OFFSET_THRESHOLD || info.velocity.x > VELOCITY_THRESHOLD) {
          fling(1, info.velocity.x);
        } else if (info.offset.x < -OFFSET_THRESHOLD || info.velocity.x < -VELOCITY_THRESHOLD) {
          fling(-1, info.velocity.x);
        }
      }}
      className={`absolute ${fill ? "inset-0" : "inset-x-0 top-0"} cursor-grab touch-pan-y [transform-origin:50%_110%] select-none active:cursor-grabbing`}
      style={{ x, rotate }}
    >
      <div className={`pointer-events-none ${fill ? "h-full" : ""}`}>{children}</div>
      {!shouldReduceMotion && (
        <>
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4 overflow-hidden rounded-[32px] bg-neutral-900/60"
            style={{ opacity: denyOpacity }}
          >
            <motion.div
              className="grid size-16 place-items-center rounded-full bg-white shadow-lg"
              style={{ scale: denyScale }}
            >
              <XMarkIcon className="size-8 text-neutral-900" />
            </motion.div>
            <span className="text-2xl font-bold tracking-tight text-white">{denyText}</span>
          </motion.div>
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4 overflow-hidden rounded-[32px] bg-[#4C7A00]/75"
            style={{ opacity: approveOpacity }}
          >
            <motion.div
              className="grid size-16 place-items-center rounded-full bg-white shadow-lg"
              style={{ scale: approveScale }}
            >
              <CheckIcon className="size-8 text-[#4C7A00]" />
            </motion.div>
            <span className="text-2xl font-bold tracking-tight text-white">{approveText}</span>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}

/** The faint halo ring Figma places around the deny/approve buttons, sized to the same 1.175× proportion as the source file. */
function ButtonRing() {
  return <span aria-hidden className="pointer-events-none absolute -inset-1.5 rounded-full border border-neutral-200" />;
}

/** The deny / undo / approve row beneath the card. */
export function SwipeReviewActions({
  onDeny,
  onUndo,
  onApprove,
  canUndo,
  disabled,
  denyLabel = "Pass on this creator",
  approveLabel = "Approve this creator",
  className = "mt-10 sm:mt-12",
}: {
  onDeny: () => void;
  onUndo: () => void;
  onApprove: () => void;
  canUndo: boolean;
  disabled: boolean;
  denyLabel?: string;
  approveLabel?: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-center gap-5 ${className}`}>
      <span className="relative inline-flex">
        <ButtonRing />
        <button
          type="button"
          onClick={onDeny}
          disabled={disabled}
          aria-label={denyLabel}
          className="grid size-[72px] place-items-center rounded-full border border-[#BDBDBD] bg-[#181818] shadow-[inset_4px_4px_8.6px_0_rgba(255,255,255,0.3)] transition-[filter,transform] duration-150 hover:brightness-125 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span className="grid size-4 place-items-center rounded-full bg-white">
            <XMarkIcon className="size-2.5 text-neutral-950" />
          </span>
        </button>
      </span>

      <button
        type="button"
        onClick={onUndo}
        disabled={disabled || !canUndo}
        aria-label="Undo last decision"
        className="grid size-14 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-500 transition-[background-color,color,transform] duration-150 hover:bg-neutral-50 hover:text-neutral-900 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ArrowUturnLeftIcon className="size-5" strokeWidth={2} />
      </button>

      <span className="relative inline-flex">
        <ButtonRing />
        <button
          type="button"
          onClick={onApprove}
          disabled={disabled}
          aria-label={approveLabel}
          className="grid size-[72px] place-items-center rounded-full border border-[#71D200] bg-[#A3FF38] shadow-[inset_2px_4px_4px_0_rgba(255,255,255,0.6)] transition-[filter,transform] duration-150 hover:brightness-95 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#82F200] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span className="grid size-4 place-items-center rounded-full bg-[#181818]">
            <CheckIcon className="size-2.5 text-white" />
          </span>
        </button>
      </span>
    </div>
  );
}
