"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BrandFAQItem } from "@/components/molecules/BrandFAQItem";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

/** Fade/slide-up on scroll into view — matches the hero's entranceProps. */
function entranceProps(reduce: boolean | null) {
  if (reduce) {
    return {
      initial: { opacity: 0 },
      whileInView: { opacity: 1 },
      viewport: { once: true, margin: "-80px" },
      transition: { duration: 0.15 },
    };
  }
  return {
    initial: { opacity: 0, transform: "translateY(8px)" },
    whileInView: { opacity: 1, transform: "translateY(0px)" },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.35, ease: EASE_OUT },
  };
}

const FAQS = [
  {
    question: "How is this different from an affiliate program?",
    answer:
      "No commissions, no cash payouts. Creators get access to your software in exchange for content. You get the campaign, they get the tool.",
  },
  {
    question: "How do I pick which creators get access?",
    answer:
      "You review every pitch and approve who fits your drop. Nothing goes out until you say yes.",
  },
  {
    question: "What do I need to provide?",
    answer:
      "Just your software access and a clear brief: plan, seats, and how many posts you want in return.",
  },
  {
    question: "Is there a cost to list a drop?",
    answer:
      "Listing is free while we're in early access. Pricing for brands is being finalized as we launch.",
  },
];

export default function BrandFAQSection() {
  const reduce = useReducedMotion();

  return (
    <section className="bg-white px-6 pt-40 pb-40 text-center sm:px-10 sm:pt-56 sm:pb-56 lg:px-16 lg:pt-72 lg:pb-72">
      <motion.h2
        className="text-2xl leading-tight font-medium text-neutral-900 sm:text-3xl"
        {...entranceProps(reduce)}
      >
        FAQ
      </motion.h2>
      <div className="mx-auto mt-10 flex w-full max-w-lg flex-col gap-4 text-left">
        {FAQS.map((faq) => (
          <BrandFAQItem key={faq.question} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </section>
  );
}
