"use client";

import Image from "next/image";
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
      <span className="absolute inset-3 rounded-full bg-[#A3FF38]" />
      <Image
        src="/Creatorshop Brand Symbol.webp"
        alt=""
        width={40}
        height={40}
        className="pointer-events-none absolute inset-0 m-auto h-10 w-10"
      />
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
