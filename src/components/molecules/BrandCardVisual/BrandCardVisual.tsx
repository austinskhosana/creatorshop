"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useTilt } from "@/hooks/use-tilt";

interface BrandCardVisualProps {
  className?: string;
}

export default function BrandCardVisual({ className }: BrandCardVisualProps) {
  const { rotateX, rotateY, handleMouseMove, handleMouseLeave } = useTilt(10);

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: "transform 0.15s ease-out",
      }}
      className={cn(
        "w-full max-w-md overflow-hidden rounded-2xl border border-neutral-200 bg-white",
        className,
      )}
    >
      <Image
        src="/Bank Card.webp"
        alt="Creatorshop brand card — 4000 1234 5678 9010, A. Skhosana, expires 07/29"
        width={1440}
        height={909}
        className="w-full"
      />
    </div>
  );
}
