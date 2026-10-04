import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

// A fixed-radius fade, so the dots stay tucked into the corner however wide the card grows.
const FADE = "radial-gradient(circle 180px at 100% 100%, #000 15%, transparent 100%)";

const DOTS: CSSProperties = {
  backgroundImage: "radial-gradient(circle, #d4d4d4 1px, transparent 1.5px)",
  backgroundSize: "12px 12px",
  backgroundPosition: "100% 100%",
  maskImage: FADE,
  WebkitMaskImage: FADE,
};

/**
 * A dot grid that fades out from the bottom-right corner. Decorative: drop it into a card with
 * `relative isolate` and it sits behind the content, following the card's rounded corners.
 */
export default function CornerDots({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn("pointer-events-none absolute inset-0 -z-10 rounded-[inherit]", className)} style={DOTS} />;
}
