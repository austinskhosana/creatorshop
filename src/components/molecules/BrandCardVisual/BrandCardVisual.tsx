"use client";

import { useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useDirectTilt } from "@/hooks/use-direct-tilt";
import { cn } from "@/lib/utils";

interface BrandCardVisualProps {
  className?: string;
}

// Bank Card.webp bakes in its own rounded corners — measured from the asset
// (a true 60px circle on a 1440x909 image).
const CARD_RADIUS = "4.2% / 6.6%";

/**
 * Static (no flip): the brand hero already sits inside a MeshGradientPanel
 * with a continuously animated shader background, so an autoplaying flip on
 * top of that would be competing motion rather than adding to it. Just the
 * mouse-tilt, written straight to the DOM on mousemove (Aceternity's 3d-card
 * technique) rather than through a spring, so it tracks the cursor directly
 * instead of lagging behind it. See BrandCardVisualFlip for the flip version.
 */
export default function BrandCardVisual({ className }: BrandCardVisualProps) {
  const reduceMotion = useReducedMotion();
  const { ref: tiltRef, handleMouseMove, handleMouseLeave } = useDirectTilt<HTMLDivElement>(10, 14);

  return (
    <div className={cn("w-full max-w-md", className)} style={{ perspective: 1000 }}>
      <div
        ref={tiltRef}
        onMouseMove={reduceMotion ? undefined : handleMouseMove}
        onMouseLeave={reduceMotion ? undefined : handleMouseLeave}
        style={{
          borderRadius: CARD_RADIUS,
          transition: reduceMotion ? "none" : "transform 200ms ease-out",
        }}
        className="w-full overflow-hidden border border-neutral-200 bg-white"
      >
        <Image
          src="/Bank Card.webp"
          alt="Creatorshop brand card — 4000 1234 5678 9010, A. Skhosana, expires 07/29"
          width={1440}
          height={909}
          sizes="(min-width: 640px) 448px, calc(100vw - 48px)"
          className="w-full"
        />
      </div>
    </div>
  );
}
