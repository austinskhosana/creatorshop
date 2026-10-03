"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

export interface Flash {
  message: string;
  action?: { label: string; href: string };
}

interface FlashMessageProps {
  flash: Flash | null;
  onDismiss: () => void;
  /** Hovering or focusing the flash holds it on screen, so its action can't expire under the pointer. */
  onPause: () => void;
  onResume: () => void;
  /** Top keeps it clear of controls pinned to the bottom of the screen, like the review buttons. */
  position?: "bottom" | "top";
}

/** A short-lived confirmation pinned to the bottom (or top) of the screen, announced to screen readers. */
export default function FlashMessage({ flash, onDismiss, onPause, onResume, position = "bottom" }: FlashMessageProps) {
  const reduceMotion = useReducedMotion();
  // Enters from, and leaves toward, the edge it's pinned to.
  const edge = position === "top" ? -1 : 1;
  return (
    <div aria-live="polite" className={`pointer-events-none fixed inset-x-0 ${position === "top" ? "top-6" : "bottom-6"} z-50 flex justify-center px-4`}>
      <AnimatePresence>
        {flash ? (
          <motion.div
            key={flash.message}
            onPointerEnter={onPause}
            onPointerLeave={onResume}
            onFocus={onPause}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node)) onResume();
            }}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 * edge, scale: 0.98 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 * edge, transition: { duration: 0.15 } }}
            transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
            className="pointer-events-auto flex max-w-md items-center gap-3 rounded-2xl bg-neutral-950 py-2 pr-2 pl-3.5 text-sm text-white shadow-[0_12px_32px_rgba(0,0,0,0.2)]"
          >
            <CheckCircleIcon aria-hidden="true" className="size-5 shrink-0 text-[#A3FF38]" />
            <span className="min-w-0 flex-1 py-0.5">{flash.message}</span>
            {flash.action ? (
              <Link
                href={flash.action.href}
                className="flex min-h-8 shrink-0 items-center rounded-lg bg-white/10 px-3 text-xs font-medium transition-colors duration-150 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                {flash.action.label}
              </Link>
            ) : null}
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Dismiss"
              className="grid size-8 shrink-0 place-items-center rounded-lg text-white/60 transition-colors duration-150 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <XMarkIcon aria-hidden="true" className="size-4" strokeWidth={2} />
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/**
 * Shows a flash for a few seconds — longer when it carries an action. Calling it again replaces
 * the current one. Spread `props` onto FlashMessage.
 */
export function useFlash(duration = 4000) {
  const [flash, setFlash] = useState<Flash | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const remaining = useRef(0);
  const startedAt = useRef(0);

  const clear = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };
  const run = useCallback((ms: number) => {
    clear();
    remaining.current = ms;
    startedAt.current = Date.now();
    timer.current = setTimeout(() => setFlash(null), ms);
  }, []);

  useEffect(() => clear, []);

  const show = useCallback(
    (next: Flash) => {
      setFlash(next);
      run(next.action ? duration * 2 : duration);
    },
    [duration, run],
  );

  const props = {
    flash,
    onDismiss: () => {
      clear();
      setFlash(null);
    },
    onPause: () => {
      if (!timer.current) return;
      clear();
      remaining.current -= Date.now() - startedAt.current;
    },
    onResume: () => {
      if (flash && !timer.current) run(Math.max(remaining.current, 1500));
    },
  };

  return [props, show] as const;
}
