"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextScrambleProps extends React.HTMLAttributes<HTMLSpanElement> {
  text: string;
  /** Total time, in ms, for the whole string to resolve. */
  duration?: number;
  /** How long, in ms, a character keeps scrambling before it locks in. */
  scrambleDuration?: number;
  /** Pool of glyphs to scramble through before each character locks in. */
  chars?: string;
  /** Delay, in ms, before the scramble starts — for staggering multiple lines. */
  delay?: number;
  /**
   * Locks the element to its final rendered width so surrounding layout doesn't
   * reflow as substitute glyphs of different widths cycle through. Only use for
   * short, single-line labels (e.g. nav items) — not text that's meant to wrap.
   */
  lockWidth?: boolean;
}

export const SCRAMBLE_CHARS_SYMBOLS = "!<>-_\\/[]{}—=+*^?#";
export const SCRAMBLE_CHARS_ALPHANUMERIC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

// Softens the reveal from a perfectly linear sweep into something less metronomic.
const JITTER_RATIO = 0.3;

export default function TextScramble({
  text,
  duration = 700,
  scrambleDuration = 320,
  chars: charPool = SCRAMBLE_CHARS_SYMBOLS,
  delay = 0,
  lockWidth = false,
  className,
  ...props
}: TextScrambleProps) {
  const reduce = useReducedMotion();
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const nodeRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    if (reduce || !lockWidth || !wrapperRef.current) return;
    wrapperRef.current.style.width = `${wrapperRef.current.getBoundingClientRect().width}px`;
  }, [text, lockWidth, reduce]);

  useEffect(() => {
    if (reduce || !nodeRef.current) return;
    const node = nodeRef.current;

    const chars = text.split("");
    const revealAt = chars.map(
      (_, i) =>
        (i / chars.length) * (duration - scrambleDuration) +
        (Math.random() - 0.5) * scrambleDuration * JITTER_RATIO,
    );
    let frame: number;
    let start: number | undefined;

    const tick = (now: number) => {
      if (start === undefined) start = now;
      const elapsed = now - start;
      let done = true;

      node.textContent = chars
        .map((char, i) => {
          if (char === " ") return " ";
          if (elapsed >= revealAt[i] + scrambleDuration) return char;
          done = false;
          return charPool[Math.floor(Math.random() * charPool.length)];
        })
        .join("");

      if (!done) frame = requestAnimationFrame(tick);
    };

    const timeout = setTimeout(() => {
      frame = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(frame);
    };
  }, [text, duration, scrambleDuration, charPool, delay, reduce]);

  return (
    <span
      ref={wrapperRef}
      className={cn("inline-block", lockWidth && "overflow-hidden whitespace-nowrap align-bottom", className)}
      aria-label={text}
      {...props}
    >
      <span aria-hidden="true" ref={nodeRef}>
        {text}
      </span>
    </span>
  );
}
