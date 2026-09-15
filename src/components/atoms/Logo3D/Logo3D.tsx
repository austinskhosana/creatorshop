"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const MODEL_URL = "/models/symbol-3d.glb";

// three.js + @react-three/fiber + drei weigh in over 1MB — split them into their
// own chunk so it's only ever fetched once a symbol is about to be seen, instead
// of shipping with every page that renders one.
const Logo3DCanvas = dynamic(() => import("./Logo3DCanvas"), { ssr: false });

interface Logo3DProps {
  className?: string;
  /** Which .glb to render — defaults to the Creatorshop symbol. */
  modelUrl?: string;
  /** Ties rotation to page scroll position instead of idle auto-spin. */
  spinWithScroll?: boolean;
  /** Idle auto-spin speed in radians/second. Ignored when spinWithScroll is true. */
  spinSpeed?: number;
  /** Color of the accent point light and lightformer — defaults to the brand green. */
  accentColor?: string;
}

export default function Logo3D({
  className,
  modelUrl = MODEL_URL,
  spinWithScroll = false,
  spinSpeed = 0.15,
  accentColor = "#A3FF38",
}: Logo3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [ready, setReady] = useState(false);

  // Every instance spins up its own WebGL context + PMREM environment map,
  // which is expensive to create several of at once (the stacked sticky
  // sections on this page keep every prior <Canvas> mounted). Deferring
  // mount until the model is about to be seen keeps concurrent contexts low
  // so later ones don't silently fail to render — but on this page sections
  // are full-viewport sticky panels, so "about to be seen" needs to mean
  // "roughly a screen away", not 200px, or the fetch+decode is still running
  // by the time the section is actually on screen. A full viewport of lead
  // time (rootMargin: "100%") starts it while the user is still scrolling
  // through the previous section instead.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={cn("relative h-28 w-28", className)}>
      {inView && !ready && (
        <div className="absolute inset-[15%] animate-pulse rounded-full bg-black/10" aria-hidden="true" />
      )}
      {inView && (
        <Logo3DCanvas
          modelUrl={modelUrl}
          spinWithScroll={spinWithScroll}
          spinSpeed={spinSpeed}
          accentColor={accentColor}
          onReady={() => setReady(true)}
        />
      )}
    </div>
  );
}
