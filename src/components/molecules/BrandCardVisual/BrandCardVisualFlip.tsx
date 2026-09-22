"use client";

import Image from "next/image";
import { BrandMark, FlipCard, SharpieNote, SignatureStrip } from "@/components/molecules/FlipCard";

interface BrandCardVisualFlipProps {
  className?: string;
}

// Bank Card.webp bakes in its own rounded corners — same asset dimensions
// and baked radius as the creator card's bank-card.webp (a true 60px circle
// on a 1440x909 image), so the back face's radius matches exactly.
const CARD_RADIUS = "4.2% / 6.6%";

// The card art is white-on-white against the page, so both faces keep the
// same subtle frame the original single-sided version had.
const CARD_FRAME_STYLE = { background: "#FFFFFF", border: "1px solid #E5E5E5" };

/**
 * Archived: the autoplaying flip/tilt/sheen treatment applied to the brand
 * card, matching the creator side's SocialCapitalCard. Not used live — the
 * brand hero sits inside a MeshGradientPanel with a continuously animated
 * shader background, and stacking an autoplaying flip on top of that reads
 * as too much motion competing for attention. Kept around for a case study.
 * See BrandCardVisual for what actually shipped (tilt-only, no flip).
 */
export default function BrandCardVisualFlip({ className }: BrandCardVisualFlipProps) {
  return (
    <FlipCard
      id="brand-card-visual-flip"
      className={className}
      radius={CARD_RADIUS}
      frontStyle={CARD_FRAME_STYLE}
      backStyle={CARD_FRAME_STYLE}
      front={
        <Image
          src="/Bank Card.webp"
          alt="Creatorshop brand card — 4000 1234 5678 9010, A. Skhosana, expires 07/29"
          width={1440}
          height={909}
          sizes="(min-width: 640px) 448px, calc(100vw - 48px)"
          className="size-full"
          priority
        />
      }
      back={
        <>
          <div className="mt-[9%] h-[16%] w-full bg-black" />

          <SignatureStrip text="Move from outreach to inbound" left="6%" top="35.7%" width="87.9%" height="14%" />
          <SharpieNote lines={["LESS SEARCHING", "MORE CURATING"]} left="7.5%" top="63%" rotate={6} />

          <BrandMark left="84.6%" top="72.9%" width="9.4%" />
        </>
      }
    />
  );
}
