"use client";

import Image from "next/image";
import { FlipCard, SharpieNote, SignatureStrip } from "@/components/molecules/FlipCard";

interface SocialCapitalCardProps {
  className?: string;
}

// bank-card.webp bakes in its own rounded corners — measured from the asset
// (a true 60px circle), expressed as a % of width/height so the back face's
// CSS radius lines up with it instead of the equal-both-ways guess that made
// the back look squarer.
const CARD_RADIUS = "4.2% / 6.6%";

// A flat green matching the front card's tint, with a faint top highlight
// for depth — no gradients loud enough to fight the front face.
const BACK_STYLE = {
  background: "linear-gradient(180deg, #AEFF52 0%, #A3FF38 100%)",
  boxShadow: "inset 0 1px 1px rgba(255,255,255,0.4), inset 0 -1px 2px rgba(0,0,0,0.06)",
};

// Hand-drawn sparkle scribble, exported straight from the Pencil design
// (Export → html-css) rather than hand-traced, so the paths are exact.
const DOODLE_PATHS: { d: string; x: number; y: number }[] = [
  { d: "M89.38498 3.10633c4.17659-1.15216 31.39638-8.06512 40.9017 3.45647 4.3206 5.18472 5.76079 17.13839-11.80964 33.98873-9.07326 9.21728-22.1791 18.14653-34.4208 25.05949-19.73074 10.94552-38.02128 19.73074-59.62428 21.31497-8.6412 0.57607-20.01879-0.43207-23.33125-8.35317-5.61678-12.52975 11.23356-30.38823 28.51596-43.63807", x: 49.018, y: 25.313 },
  { d: "M19.58672 23.76331l-0.14402-0.57608c-4.75266 0.14402-15.69818-2.8804-17.42642-2.44834-0.28805 1.29618 14.97809 7.201 14.69004 8.92924-3.88854 3.6005-15.55416 10.94551-16.70632 12.52974 1.29618 0.7201 15.55417-4.89668 19.73074-5.61678l0 0c-0.28804 6.76894-3.6005 22.61115-3.31245 23.61928 1.00813 1.58422 7.63305-15.55416 10.22542-22.17908l14.69003 14.11396c3.16846 2.44834-2.01627-5.90482-7.9211-18.14652l24.05135-5.18472c3.31245-1.29618-15.69818-2.1603-23.90732-2.8804-2.1603-0.28804 4.75265-5.32874 12.38573-17.85849l-0.28806-0.28804c-2.30432 0.7201-15.1221 10.65748-18.0025 13.53789l-3.6005-16.13025-1.15215-5.18472-0.14402 0c-1.00815 1.72824-2.30433 24.62743-3.16845 23.76331z", x: 90.733, y: 28.707 },
  { d: "M0.29525 14.83406c-1.72824-9.79336 4.60864-14.402 6.62492-14.83406", x: 86.837, y: 22.658 },
  { d: "M11.52161 8.78522c-2.1603 0.28804-7.9211-1.00814-11.52161-8.78522", x: 82.812, y: 15.601 },
  { d: "M0 0.3133c3.02442-0.43206 8.49718-1.72824 12.52974 7.63306", x: 76.043, y: 26.953 },
  { d: "M0 13.82592c6.91296-2.44834 7.34502-7.34502 8.06512-13.82592", x: 77.051, y: 14.305 },
  { d: "M0 0l4.03256 3.60051", x: 151.221, y: 93.516 },
  { d: "M0 4.60864c1.15216-1.00814 3.31245-4.03256 4.03255-4.60864l-4.03255 4.60864z", x: 150.933, y: 92.94 },
  { d: "M0 0.43206l5.47276-0.43206-5.47276 0.43206z", x: 169.944, y: 76.954 },
  { d: "M0 0l0 5.0407 0-5.0407z", x: 172.392, y: 74.793 },
];

function ScribbleDoodle() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 230 130"
      className="absolute"
      style={{ left: "37.5%", top: "49.9%", width: "51.3%", height: "46%" }}
    >
      {DOODLE_PATHS.map((path, index) => (
        <path
          key={index}
          d={path.d}
          transform={`translate(${path.x} ${path.y})`}
          fill="none"
          stroke="#0F0F0F"
          strokeWidth={1}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}

export default function SocialCapitalCard({ className }: SocialCapitalCardProps) {
  return (
    <FlipCard
      id="social-capital-card"
      className={className}
      radius={CARD_RADIUS}
      backStyle={BACK_STYLE}
      front={
        <Image
          src="/bank-card.webp"
          alt="Creatorshop social capital card — 4000 1234 5678 9010, A. Skhosana, expires 07/29"
          width={1440}
          height={909}
          className="size-full"
          priority
        />
      }
      back={
        <>
          <div className="mt-[9%] h-[16%] w-full bg-black" />

          <SignatureStrip text="Built for Creators" left="5.8%" top="34.3%" width="87.9%" height="14%" />
          <ScribbleDoodle />
          <SharpieNote lines={["A NEW WAY", "TO SHOP <3"]} left="7.7%" top="63%" />

          <div className="absolute" style={{ left: "86.4%", top: "77.8%", width: "7.4%" }}>
            <Image
              src="/Creatorshop Brand Symbol - Combined.webp"
              alt="Creatorshop"
              width={1202}
              height={1202}
              className="size-full"
            />
          </div>
        </>
      }
    />
  );
}
