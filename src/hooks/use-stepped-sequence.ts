"use client";

import { type RefObject, useCallback, useRef, useState } from "react";
import { useSteppedFrames } from "@/hooks/use-stepped-frames";

/**
 * Plays a sequence of `length` steps once, at `fps`, from the moment the element first comes on
 * screen, calling show(step) for each, then stops — for motion with a cause that settles, like a bag
 * being set down. With autoplay off it waits for the first replay() instead. replay() plays it again
 * from the top. Does nothing while `enabled` is false (e.g. under reduced motion), so the element
 * keeps its resting frame.
 */
export function useSteppedSequence(
  target: RefObject<Element | null>,
  fps: number,
  length: number,
  show: (step: number) => void,
  enabled = true,
  autoplay = true,
) {
  const [playing, setPlaying] = useState(autoplay);
  // When the current play began, in seconds on the page's clock — set on its first frame, so a
  // sequence that starts off screen waits to be seen. The page's clock rather than the frame loop's,
  // which restarts whenever the loop does.
  const start = useRef<number | null>(null);

  useSteppedFrames(
    target,
    fps,
    () => {
      const now = performance.now() / 1000;
      if (start.current === null) start.current = now;
      const step = Math.max(0, Math.floor((now - start.current) * fps));
      if (step >= length) {
        show(length - 1);
        setPlaying(false);
        return;
      }
      show(step);
    },
    enabled && playing,
  );

  return useCallback(() => {
    start.current = null;
    setPlaying(true);
  }, []);
}
