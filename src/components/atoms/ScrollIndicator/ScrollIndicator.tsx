"use client";

import { cn } from "@/lib/utils";
import { SpinningText } from "@/components/atoms/SpinningText";

interface ScrollIndicatorProps {
  className?: string;
  onClick?: () => void;
}

export default function ScrollIndicator({ className, onClick }: ScrollIndicatorProps) {
  const handleClick = () => {
    onClick?.();
    window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Scroll down"
      className={cn(
        "relative flex h-32 w-32 items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2",
        className,
      )}
    >
      <SpinningText
        radius={6.5}
        duration={9}
        className="pointer-events-none absolute inset-0 font-pixel text-[10.5px] tracking-widest text-neutral-900"
      >
        Scroll down • Scroll down •
      </SpinningText>
    </button>
  );
}
