"use client";

import { type RefObject, useEffect, useRef } from "react";

/**
 * Calls draw(seconds) about `fps` times a second while the element is on screen — the stepped
 * cadence the dithered stub art animates at. Does nothing while `enabled` is false (e.g. under
 * reduced motion). Time keeps counting while paused off screen.
 */
export function useSteppedFrames(target: RefObject<Element | null>, fps: number, draw: (seconds: number) => void, enabled = true) {
  const latestDraw = useRef(draw);

  useEffect(() => {
    latestDraw.current = draw;
  });

  useEffect(() => {
    const element = target.current;
    if (!element || !enabled) return;

    let frame = 0;
    let last = -Infinity;
    const start = performance.now();
    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      if (now - last < 1000 / fps) return;
      last = now;
      latestDraw.current((now - start) / 1000);
    };
    const observer = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(frame);
      if (entry?.isIntersecting) frame = requestAnimationFrame(tick);
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [target, fps, enabled]);
}
