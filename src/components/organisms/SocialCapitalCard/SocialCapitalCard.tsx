"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useTilt } from "@/hooks/use-tilt";

interface SocialCapitalCardProps {
  className?: string;
}

export default function SocialCapitalCard({ className }: SocialCapitalCardProps) {
  const { rotateX, rotateY, handleMouseMove, handleMouseLeave } = useTilt(10);

  return (
    <div className={cn("relative w-full max-w-md", className)}>
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="pointer-events-auto"
        style={{
          transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: "transform 0.15s ease-out",
        }}
      >
        <Image
          src="/bank-card.webp"
          alt="Creatorshop social capital card — 4000 1234 5678 9010, A. Skhosana, expires 07/29"
          width={1440}
          height={909}
          className="w-full"
          priority
        />
      </div>
    </div>
  );
}
