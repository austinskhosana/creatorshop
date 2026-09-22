"use client";

import { useCallback, useRef } from "react";

/**
 * Aceternity-style 3D tilt: writes `transform` straight to the DOM node on
 * every mousemove instead of going through React state (which re-renders on
 * every move) or a spring (which adds lag and, if misconfigured, silently
 * stops tracking — see FlipCard's history). A CSS transition on the element
 * itself does the smoothing instead. The element needs its own
 * `transition: transform ...` class and a `perspective` ancestor.
 */
export function useDirectTilt<T extends HTMLElement>(maxDeg = 15, liftPx = 12) {
  const ref = useRef<T>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `rotateX(${(-y * maxDeg).toFixed(2)}deg) rotateY(${(x * maxDeg).toFixed(2)}deg) translateZ(${liftPx}px)`;
    },
    [maxDeg, liftPx],
  );

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "rotateX(0deg) rotateY(0deg) translateZ(0px)";
  }, []);

  return { ref, handleMouseMove, handleMouseLeave };
}
