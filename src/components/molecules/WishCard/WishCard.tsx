"use client";

import type { ComponentType, SVGProps } from "react";
import { motion, useAnimationControls, useReducedMotion } from "framer-motion";
import {
  ArrowTopRightOnSquareIcon,
  BoltIcon,
  CpuChipIcon,
  PaintBrushIcon,
  PhotoIcon,
  SparklesIcon as SparklesOutlineIcon,
  UserIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";
import { SparklesIcon as SparklesSolidIcon } from "@heroicons/react/24/solid";
import Badge from "@/components/atoms/Badge/Badge";
import BrandLogo from "@/components/atoms/BrandLogo/BrandLogo";
import Button from "@/components/atoms/Button/Button";

interface WishCardProps {
  brandKey: string;
  brandName: string;
  website?: string;
  description?: string;
  category?: string;
  wished: boolean;
  onToggle: () => void;
}

const CATEGORY_ICONS: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  Video: VideoCameraIcon,
  Design: PaintBrushIcon,
  Photo: PhotoIcon,
  Productivity: BoltIcon,
  "AI Tools": CpuChipIcon,
};

const BUTTON_STYLE = { borderRadius: "8px", padding: "8px 14px", fontWeight: 500, letterSpacing: "normal" };

/** A brand on the Genie Index, built like a listing card: logo and website link up top, what it is, then its category and the wish toggle. */
export default function WishCard({ brandKey, brandName, website, description, category, wished, onToggle }: WishCardProps) {
  const iconControls = useAnimationControls();
  const reduceMotion = useReducedMotion();
  // Brands a creator typed in themselves have no category, so they're tagged as their own wish.
  const CategoryIcon = category ? CATEGORY_ICONS[category] : UserIcon;

  async function handleToggle() {
    onToggle();
    if (wished) return;
    // Same press flourish as View Campaign: a quick tilt and settle on the icon.
    if (reduceMotion) {
      await iconControls.start({ opacity: [1, 0.4, 1], transition: { duration: 0.3, ease: "easeOut" } });
    } else {
      await iconControls.start({ scale: 1.3, rotate: -12, transition: { duration: 0.12, ease: [0.23, 1, 0.32, 1] } });
      await iconControls.start({ scale: 1, rotate: 0, transition: { type: "spring", duration: 0.4, bounce: 0.3 } });
    }
  }

  return (
    <article className="flex h-full min-h-[240px] flex-col rounded-[20px] border border-neutral-200 bg-white p-4">
      <div className="flex items-start justify-between">
        <BrandLogo slug={brandKey} name={brandName} />
        {website && (
          <a
            href={`https://${website}`}
            target="_blank"
            rel="noreferrer"
            aria-label={`Visit ${brandName} website`}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-200 text-neutral-400 transition-[color,border-color] duration-150 hover:border-neutral-300 hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
          >
            <ArrowTopRightOnSquareIcon aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.75} />
          </a>
        )}
      </div>

      <div className="mt-auto pt-5">
        <h3 className="truncate text-[16px] leading-snug font-semibold tracking-[-0.025em] text-neutral-950">{brandName}</h3>
        <p className="text-pretty mt-2 line-clamp-2 text-[13px] leading-[1.55] text-neutral-500">
          {description ?? (website ? `You wished for ${website}.` : "You added this wish.")}
        </p>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 border-t border-neutral-100 pt-3">
        <Badge variant="tag" label={category ?? "Your wish"} icon={CategoryIcon ? <CategoryIcon className="h-3 w-3" strokeWidth={1.75} /> : undefined} />
        <Button
          variant={wished ? "secondary" : "premium"}
          size="sm"
          onClick={handleToggle}
          aria-pressed={wished}
          aria-label={wished ? `Take back your wish for ${brandName}` : `Wish for ${brandName}`}
          iconLeft={
            <motion.span className="inline-flex" animate={iconControls}>
              {wished ? <SparklesSolidIcon aria-hidden="true" className="size-3.5" /> : <SparklesOutlineIcon aria-hidden="true" className="size-3.5" strokeWidth={1.75} />}
            </motion.span>
          }
          style={BUTTON_STYLE}
        >
          {wished ? "Wished" : "Wish for it"}
        </Button>
      </div>
    </article>
  );
}
