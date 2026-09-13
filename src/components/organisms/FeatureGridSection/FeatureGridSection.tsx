"use client";

import { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Logo3D } from "@/components/atoms/Logo3D";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

/** Staggered fade/slide-up on scroll into view — matches the hero's entranceProps. */
function entranceProps(index: number, reduce: boolean | null) {
  if (reduce) {
    return {
      initial: { opacity: 0 },
      whileInView: { opacity: 1 },
      viewport: { once: true, margin: "-80px" },
      transition: { duration: 0.15, delay: index * 0.05 },
    };
  }
  return {
    initial: { opacity: 0, transform: "translateY(8px)" },
    whileInView: { opacity: 1, transform: "translateY(0px)" },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.35, ease: EASE_OUT, delay: index * 0.07 },
  };
}

interface FeatureTileProps {
  title: string;
  description: string;
  visual?: ReactNode;
}

function FeatureTile({ title, description, visual }: FeatureTileProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex aspect-square w-full items-center justify-center rounded-[24px] bg-[#FAFAFA]">
        {visual}
      </div>
      <div className="pt-6">
        <h3 className="text-xl leading-tight font-medium tracking-tight text-neutral-900">
          {title}
        </h3>
        <p className="mt-3 leading-relaxed text-neutral-500">{description}</p>
      </div>
    </div>
  );
}

export default function FeatureGridSection() {
  const reduce = useReducedMotion();

  return (
    <section className="bg-white px-6 pt-24 text-center sm:px-10 sm:pt-36 lg:px-16 lg:pt-56">
      <div className="mx-auto max-w-2xl">
        <motion.h2
          className="text-2xl leading-tight font-medium tracking-tight text-neutral-900 sm:text-3xl"
          {...entranceProps(0, reduce)}
        >
          Everything you need to run a campaign
        </motion.h2>
        <motion.p
          className="mx-auto mt-5 max-w-md leading-relaxed text-neutral-500"
          {...entranceProps(1, reduce)}
        >
          From listing your software to reviewing pitches and tracking
          delivery, manage the whole campaign in one place.
        </motion.p>
      </div>

      <div className="mx-auto mt-12 grid w-full max-w-5xl grid-cols-1 gap-10 sm:mt-24 sm:grid-cols-3">
        <FeatureTile
          title="List in minutes"
          description="Set your plan, seats, and how many posts you want back. Live the same day."
          visual={<Logo3D modelUrl="/symbl-3d (8).glb" className="h-44 w-44" spinSpeed={0.6} accentColor="#ffffff" />}
        />

        <FeatureTile
          title="You choose who gets in"
          description="Every pitch reviewed by you. Nothing goes out until you approve it."
          visual={<Logo3D modelUrl="/symbl-3d (11).glb" className="h-44 w-44" spinSpeed={0.6} accentColor="#ffffff" />}
        />

        <FeatureTile
          title="Pay in access, not cash"
          description="No affiliate cuts. No retainers. Just a subscription for the creator."
          visual={<Logo3D modelUrl="/models/deliver-symbol.glb" className="h-44 w-44" spinSpeed={0.6} accentColor="#ffffff" />}
        />
      </div>
    </section>
  );
}
