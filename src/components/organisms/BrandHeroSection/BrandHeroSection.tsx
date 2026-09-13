"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/atoms/Button";
import { MeshGradientPanel } from "@/components/atoms/MeshGradientPanel";
import { BrandCardVisual } from "@/components/molecules/BrandCardVisual";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

/** Staggered mount-in fade/slide — matches the navbar's entranceProps. */
function entranceProps(index: number, reduce: boolean | null) {
  if (reduce) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.15, delay: index * 0.05 },
    };
  }
  return {
    initial: { opacity: 0, transform: "translateY(8px)" },
    animate: { opacity: 1, transform: "translateY(0px)" },
    transition: { duration: 0.35, ease: EASE_OUT, delay: 0.1 + index * 0.07 },
  };
}

export default function BrandHeroSection() {
  const reduce = useReducedMotion();

  return (
    <section className="bg-white px-6 pb-6 text-center sm:px-10 sm:pb-10 lg:px-16">
      <div className="mx-auto max-w-3xl pt-16 sm:pt-20">
        <motion.h1
          className="text-4xl leading-tight font-medium text-neutral-900 sm:text-5xl"
          {...entranceProps(0, reduce)}
        >
          Trade subscription access for creator distribution
        </motion.h1>
        <motion.p
          className="mx-auto mt-6 max-w-xl text-neutral-500 sm:text-lg"
          {...entranceProps(1, reduce)}
        >
          Post a listing to your software subscription, review applications
          from creators, and pay in access instead of cash. No affiliate
          fees, no retainers.
        </motion.p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Button variant="primary" size="md" pill style={{ border: "none", boxShadow: "none" }}>
            Sign Up
          </Button>
          <Button variant="secondary" size="md" pill style={{ boxShadow: "none" }}>
            Book a Demo
          </Button>
        </div>
      </div>

      <MeshGradientPanel className="mx-auto mt-10 flex w-full max-w-5xl items-center justify-center px-6 py-12 sm:mt-16 sm:px-0 sm:py-24">
        <BrandCardVisual />
      </MeshGradientPanel>
    </section>
  );
}
