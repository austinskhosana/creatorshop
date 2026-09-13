"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "For creators", href: "/" },
  { label: "For brands", href: "/brands" },
];

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className={cn("transition-opacity duration-150", open && "opacity-0")}
      />
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className={cn(
          "origin-center opacity-0 transition-opacity duration-150",
          open && "opacity-100",
        )}
      />
    </svg>
  );
}

interface NavbarProps {
  variant?: "default" | "compact";
  className?: string;
}

export default function Navbar({ variant = "default", className }: NavbarProps) {
  const [open, setOpen] = useState(false);

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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-2 bg-white sm:hidden"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="w-full max-w-xs rounded-lg px-2 py-3 text-center text-2xl font-medium text-neutral-900 transition-colors hover:bg-neutral-100"
            >
              {link.label}
            </Link>
          ))}
        </motion.nav>
      )}
    </AnimatePresence>
  );

  if (variant === "compact") {
    return (
      <div className={cn("relative z-50 flex items-center justify-end", className)}>
        <nav className="hidden items-center gap-8 text-sm text-neutral-700 sm:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.label} href={link.href} className="transition-colors hover:text-neutral-900">
              {link.label}
            </Link>
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
        <Link href="/" onClick={() => setOpen(false)}>
          <Image src="/Logo.svg" alt="Creatorshop" width={142} height={41} className="h-9 w-auto" priority />
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-neutral-700 sm:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.label} href={link.href} className="transition-colors hover:text-neutral-900">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden sm:block">
          <Button variant="primary" size="md" pill style={{ border: "none", boxShadow: "none" }}>
            Join Waitlist
          </Button>
        </div>

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
