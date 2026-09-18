"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/atoms/Button";
import { TextScramble, SCRAMBLE_CHARS_ALPHANUMERIC } from "@/components/atoms/TextScramble";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "For creators", href: "/" },
  { label: "For brands", href: "/brands" },
];

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

function MenuIcon({ open }: { open: boolean }) {
  const reduce = useReducedMotion();
  const lineTransition = { duration: reduce ? 0 : 0.2, ease: EASE_OUT };

  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <motion.line
        x1="4"
        y1="7"
        x2="20"
        y2="7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        style={{ transformOrigin: "12px 7px" }}
        animate={{ transform: open ? "translateY(5px) rotate(45deg)" : "translateY(0px) rotate(0deg)" }}
        transition={lineTransition}
      />
      <motion.line
        x1="4"
        y1="12"
        x2="20"
        y2="12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        initial={false}
        animate={{ opacity: open ? 0 : 1 }}
        transition={{ duration: reduce ? 0 : 0.15, ease: EASE_OUT }}
      />
      <motion.line
        x1="4"
        y1="17"
        x2="20"
        y2="17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        style={{ transformOrigin: "12px 17px" }}
        animate={{ transform: open ? "translateY(-5px) rotate(-45deg)" : "translateY(0px) rotate(0deg)" }}
        transition={lineTransition}
      />
    </svg>
  );
}

const panelVariants = {
  hidden: { opacity: 0, transform: "scale(0.98)" },
  visible: {
    opacity: 1,
    transform: "scale(1)",
    transition: { duration: 0.25, ease: EASE_OUT, when: "beforeChildren", staggerChildren: 0.04, delayChildren: 0.05 },
  },
  exit: { opacity: 0, transform: "scale(0.98)", transition: { duration: 0.2, ease: EASE_OUT } },
};

const panelVariantsReduced = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15, when: "beforeChildren", staggerChildren: 0.04 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const linkVariants = {
  hidden: { opacity: 0, transform: "translateY(8px)" },
  visible: { opacity: 1, transform: "translateY(0px)", transition: { duration: 0.2, ease: EASE_OUT } },
};

const linkVariantsReduced = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } },
};

const ENTRANCE_BASE_DELAY_MS = 100;
const ENTRANCE_STAGGER_MS = 70;

/** Delay, in ms, before item `index` starts entering — shared with TextScramble so the scramble starts as the item fades in. */
function entranceDelayMs(index: number) {
  return ENTRANCE_BASE_DELAY_MS + index * ENTRANCE_STAGGER_MS;
}

/** Staggered mount-in for the desktop nav row (logo, links, CTA) — runs once on load. */
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
    transition: { duration: 0.35, ease: EASE_OUT, delay: entranceDelayMs(index) / 1000 },
  };
}

interface NavbarProps {
  variant?: "default" | "compact";
  className?: string;
}

export default function Navbar({ variant = "default", className }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  const mobileOverlay = (
    <AnimatePresence>
      {open && (
        <motion.nav
          variants={reduce ? panelVariantsReduced : panelVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-2 bg-white sm:hidden"
        >
          {NAV_LINKS.map((link) => (
            <motion.div
              key={link.label}
              variants={reduce ? linkVariantsReduced : linkVariants}
              className="w-full max-w-xs"
            >
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="block w-full rounded-lg px-2 py-3 text-center text-2xl font-medium text-neutral-900 transition-colors hover:bg-neutral-100"
              >
                {link.label}
              </Link>
            </motion.div>

          ))}
        </motion.nav>
      )}
    </AnimatePresence>
  );

  if (variant === "compact") {
    return (
      <div className={cn("relative z-50 flex items-center justify-end", className)}>
        <nav className="hidden items-center gap-8 font-geist-mono text-xs text-neutral-700 sm:flex">
          {NAV_LINKS.map((link, index) => (
            <motion.div key={link.label} {...entranceProps(index, reduce)}>
              <Link href={link.href} className="transition-colors hover:text-neutral-900">
                <TextScramble
                  text={link.label}
                  chars={SCRAMBLE_CHARS_ALPHANUMERIC}
                  delay={entranceDelayMs(index)}
                  duration={450}
                  scrambleDuration={180}
                  lockWidth
                />
              </Link>
            </motion.div>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="pointer-events-auto relative z-50 flex h-10 w-10 items-center justify-center rounded-full text-neutral-900 transition-colors hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 sm:hidden"
        >
          <MenuIcon open={open} />
        </button>

        {mobileOverlay}
      </div>
    );
  }

  return (
    <header className={cn("relative z-50 px-6 py-6 sm:px-10 lg:px-16", className)}>
      <div className="flex items-center justify-between">
        <motion.div {...entranceProps(0, reduce)}>
          <Link href="/" onClick={() => setOpen(false)}>
            <Image src="/Logo.svg" alt="Creatorshop" width={142} height={41} className="h-9 w-auto" priority />
          </Link>
        </motion.div>

        <nav className="hidden items-center gap-8 text-sm text-neutral-700 sm:flex">
          {NAV_LINKS.map((link, index) => (
            <motion.div key={link.label} {...entranceProps(index + 1, reduce)}>
              <Link href={link.href} className="transition-colors hover:text-neutral-900">
                {link.label}
              </Link>
            </motion.div>
          ))}
        </nav>

        <motion.div className="hidden sm:block" {...entranceProps(NAV_LINKS.length + 1, reduce)}>
          <Button variant="primary" size="md" pill style={{ border: "none", boxShadow: "none" }}>
            Sign Up
          </Button>
        </motion.div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="relative z-50 flex h-10 w-10 items-center justify-center rounded-full text-neutral-900 transition-colors hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 sm:hidden"
        >
          <MenuIcon open={open} />
        </button>
      </div>

      {mobileOverlay}
    </header>
  );
}
