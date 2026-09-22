"use client";

import { useEffect, useState } from "react";
import { motion, useAnimation, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { ArrowUturnLeftIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { CreatorProfileCard } from "@/components/molecules/CreatorProfileCard";
import type { CreatorProfileCardData } from "@/components/molecules/CreatorProfileCard";

const CREATOR_ARMY: CreatorProfileCardData[] = [
  {
    name: "Theo Bramm",
    handle: "@theobramm",
    avatar: "/creators/theo-bramm.png",
    followers: "112K",
    bio: "Notion templates and productivity systems for indie hackers.",
    niches: ["Productivity", "Notion"],
    platforms: [{ name: "Instagram", handle: "@theobramm", audience: "112K" }],
  },
  {
    name: "Nova Reyes",
    handle: "@novareyes",
    avatar: "/creators/nova-reyes.png",
    followers: "64K+",
    bio: "Streetwear fits and vintage flips, one thrift run at a time.",
    niches: ["Fashion", "Streetwear"],
    platforms: [
      { name: "Instagram", handle: "@novareyes", audience: "41.2K" },
      { name: "TikTok", handle: "@novareyes", audience: "23.6K" },
    ],
  },
  {
    name: "Marcus Vale",
    handle: "@marcusvale",
    avatar: "/creators/marcus-vale.png",
    followers: "18K",
    bio: "Strength training and mindset coaching for people rebuilding their routine.",
    niches: ["Fitness", "Mindset"],
    platforms: [{ name: "YouTube", handle: "Marcus Vale", audience: "18K" }],
  },
];

const OFFSET_THRESHOLD = 120;
const VELOCITY_THRESHOLD = 500;
const DRAG_RANGE = 180;

interface TopCardProps {
  creator: CreatorProfileCardData;
  onSwiped: (direction: 1 | -1) => void;
  enterAfterSwipe: boolean;
  /** Set by the approve/deny buttons to fling the card the same way a drag release would. */
  programmaticDirection: 1 | -1 | null;
  disabled: boolean;
}

function TopCard({ creator, onSwiped, enterAfterSwipe, programmaticDirection, disabled }: TopCardProps) {
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
        transition: { type: "spring", velocity, stiffness: 180, damping: 24 },
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
      className="absolute inset-x-0 top-0 cursor-grab touch-pan-y [transform-origin:50%_110%] select-none active:cursor-grabbing"
      style={{ x, rotate }}
    >
      <CreatorProfileCard creator={creator} className="pointer-events-none" />
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
            <span className="text-2xl font-bold tracking-tight text-white">Pass</span>
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
            <span className="text-2xl font-bold tracking-tight text-white">Approved</span>
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
function ActionButtons({
  onDeny,
  onUndo,
  onApprove,
  canUndo,
  disabled,
}: {
  onDeny: () => void;
  onUndo: () => void;
  onApprove: () => void;
  canUndo: boolean;
  disabled: boolean;
}) {
  return (
    <div className="mt-10 flex items-center justify-center gap-5 sm:mt-12">
      <span className="relative inline-flex">
        <ButtonRing />
        <button
          type="button"
          onClick={onDeny}
          disabled={disabled}
          aria-label="Pass on this creator"
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
          aria-label="Approve this creator"
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

export default function CreatorArmySection() {
  const [queue, setQueue] = useState(CREATOR_ARMY);
  const [hasSwiped, setHasSwiped] = useState(false);
  const [programmaticDirection, setProgrammaticDirection] = useState<1 | -1 | null>(null);
  // isAnimating and history both track by-button decisions (not drags): isAnimating
  // blocks a second button press mid-fling, history is what "undo" restores.
  const [isAnimating, setIsAnimating] = useState(false);
  const [history, setHistory] = useState<CreatorProfileCardData[][]>([]);

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
      <h2 className="max-w-xl text-center text-2xl leading-tight font-medium text-neutral-900 sm:text-3xl">
        Swipe left or right to manage your creator army
      </h2>
      <p className="mt-4 max-w-md text-center text-base leading-6 text-neutral-500 [text-wrap:pretty]">
        Review creators one by one, keep the right fit, and quickly pass on anyone who is not a match.
      </p>

      <div className="relative mt-14 w-full max-w-[650px] sm:mt-16">
        {/* Invisible spacer: reserves the active card's natural height while the real card sits on top. */}
        <div aria-hidden className="invisible">
          <CreatorProfileCard creator={activeCreator} showShader={false} />
        </div>

        <div key={activeCreator.handle} className="absolute inset-x-0 top-0">
          <TopCard
            creator={activeCreator}
            onSwiped={handleSwiped}
            enterAfterSwipe={hasSwiped}
            programmaticDirection={programmaticDirection}
            disabled={isAnimating}
          />
        </div>
      </div>

      <ActionButtons
        onDeny={() => triggerSwipe(-1)}
        onUndo={handleUndo}
        onApprove={() => triggerSwipe(1)}
        canUndo={history.length > 0}
        disabled={isAnimating}
      />
    </section>
  );
}
