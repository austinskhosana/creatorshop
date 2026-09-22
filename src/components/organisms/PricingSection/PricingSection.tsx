"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BoltIcon, ClipboardIcon, EnvelopeIcon } from "@heroicons/react/24/solid";
import { PricingCard } from "@/components/molecules/PricingCard";

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

export default function PricingSection() {
  const reduce = useReducedMotion();

  return (
    <section className="bg-white px-6 pt-40 text-center sm:px-10 sm:pt-56 lg:px-16 lg:pt-72">
      <motion.h2
        className="text-2xl leading-tight font-medium tracking-tight text-neutral-900 sm:text-3xl"
        {...entranceProps(0, reduce)}
      >
        Simple pricing for every brand
      </motion.h2>
      <motion.p
        className="mx-auto mt-4 max-w-md leading-relaxed text-neutral-500"
        {...entranceProps(1, reduce)}
      >
        Run your own drops for a flat monthly fee, or hand the whole campaign
        to us.
      </motion.p>

      <div className="mx-auto mt-16 grid max-w-3xl grid-cols-1 items-stretch gap-6 sm:grid-cols-2">
        <PricingCard
          badgeIcon={<BoltIcon width={14} height={14} />}
          badgeLabel="Subscription"
          description="List your own drops, review every pitch, and manage delivery yourself."
          price="$50"
          priceSuffix="/month"
          features={[
            "Unlimited drops",
            "Self-serve listing",
            "Review every pitch",
            "Delivery tracking",
            "Pay in access, not cash",
            "Email support",
          ]}
          buttonLabel="Get started"
          buttonVariant="dark"
          featured
        />

        <PricingCard
          badgeIcon={<ClipboardIcon width={14} height={14} />}
          badgeLabel="Custom"
          description="We run your drop end to end. Sourcing creators managing delivery."
          price="Custom"
          features={[
            "Dedicated campaign manager",
            "Creator sourcing & vetting",
            "Full pitch review on your behalf",
            "Delivery tracking & reporting",
            "Multiple concurrent drops",
            "Priority support",
          ]}
          buttonLabel="Contact us"
          buttonIcon={<EnvelopeIcon width={16} height={16} />}
          buttonVariant="secondary"
        />
      </div>
    </section>
  );
}
