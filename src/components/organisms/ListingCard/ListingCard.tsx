"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useAnimationControls, useReducedMotion } from "framer-motion";
import { ArrowTopRightOnSquareIcon, BookmarkIcon as BookmarkOutlineIcon, MegaphoneIcon } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolidIcon } from "@heroicons/react/24/solid";
import Badge from "@/components/atoms/Badge/Badge";
import Button from "@/components/atoms/Button/Button";
import BrandLogo from "@/components/atoms/BrandLogo/BrandLogo";
import PlatformIcon from "@/components/atoms/PlatformIcon/PlatformIcon";
import { cn } from "@/lib/utils";

interface ListingCardProps {
  slug: string;
  brandName?: string;
  websiteUrl?: string;
  title: string;
  description: string;
  deliverables: string[];
  retailValue: number;
  slotsRemaining: number;
  totalSlots: number;
  saved?: boolean;
}

const CONTENT_TYPE_LABELS: Record<string, string> = {
  "IG Reel": "Reel",
  "IG carousel": "Carousel",
  "YouTube review": "Video Review",
  TikTok: "Video",
  "X thread": "Thread",
};

function formatDeliverable(deliverable: string) {
  const [base] = deliverable.split(" · ");
  return CONTENT_TYPE_LABELS[base] ?? base;
}

export default function ListingCard({
  slug,
  brandName,
  websiteUrl,
  title,
  description,
  deliverables,
  retailValue,
  slotsRemaining,
  saved = false,
}: ListingCardProps) {
  const [isSaved, setIsSaved] = useState(saved);
  const soldOut = slotsRemaining === 0;
  const displayBrandName = brandName ?? title.split(" ")[0];
  const destination = websiteUrl ?? `/software/${slug}`;
  const router = useRouter();
  const campaignIconControls = useAnimationControls();
  const reduceMotion = useReducedMotion();

  async function handleViewCampaign() {
    if (reduceMotion) {
      await campaignIconControls.start({ opacity: [1, 0.4, 1], transition: { duration: 0.3, ease: "easeOut" } });
    } else {
      await campaignIconControls.start({ scale: 1.3, rotate: -12, transition: { duration: 0.12, ease: [0.23, 1, 0.32, 1] } });
      await campaignIconControls.start({ scale: 1, rotate: 0, transition: { type: "spring", duration: 0.4, bounce: 0.3 } });
    }
    router.push(`/software/${slug}`);
  }

  return (
    <article className="flex h-full min-h-[260px] flex-col rounded-[20px] border border-neutral-200 bg-white p-4">
      <div className="flex items-start justify-between">
        <Link href={`/software/${slug}`} aria-label={`View ${title}`} className="rounded-[19px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2">
          <BrandLogo slug={slug} name={displayBrandName} />
        </Link>
        <div className="flex items-center gap-2">
          <a
            href={destination}
            target={websiteUrl ? "_blank" : undefined}
            rel={websiteUrl ? "noreferrer" : undefined}
            aria-label={websiteUrl ? `Visit ${displayBrandName} website` : `View ${title}`}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-200 text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
          >
            <ArrowTopRightOnSquareIcon aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.75} />
          </a>
          <button
            type="button"
            onClick={() => setIsSaved((v) => !v)}
            aria-pressed={isSaved}
            aria-label={isSaved ? "Remove from saved" : "Save for later"}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full border border-neutral-200 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900",
              isSaved ? "text-neutral-950" : "text-neutral-400",
            )}
          >
            {isSaved ? <BookmarkSolidIcon aria-hidden="true" className="h-4 w-4" /> : <BookmarkOutlineIcon aria-hidden="true" className="h-4 w-4" strokeWidth={1.75} />}
          </button>
        </div>
      </div>

      <div className="mt-auto pt-5">
        {soldOut ? (
          <p className="text-balance text-[16px] leading-snug font-semibold tracking-[-0.025em] text-neutral-950">{title}</p>
        ) : (
          <Link href={`/software/${slug}`} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2">
            <p className="text-balance text-[16px] leading-snug font-semibold tracking-[-0.025em] text-neutral-950">{title}</p>
          </Link>
        )}

        <p className="text-pretty mt-2 line-clamp-2 text-[13px] leading-[1.55] text-neutral-500">{description}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {deliverables.map((deliverable) => (
            <Badge key={deliverable} variant="tag" label={formatDeliverable(deliverable)} icon={<PlatformIcon platform={deliverable} className="h-3 w-3" />} />
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-end justify-between border-t border-neutral-100 pt-3">
        <div>
          <p className="text-[15px] font-semibold tabular-nums text-neutral-900">${retailValue}</p>
          <p className="text-[11px] text-neutral-400">Retail value</p>
        </div>
        <Button
          variant="dark"
          size="sm"
          iconLeft={
            <motion.span className="inline-flex" animate={campaignIconControls}>
              <MegaphoneIcon aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.75} />
            </motion.span>
          }
          onClick={handleViewCampaign}
          disabled={soldOut}
          style={{
            borderRadius: "8px",
            padding: "8px 14px",
            fontWeight: 500,
            letterSpacing: "normal",
            background: "linear-gradient(180deg, #323232 0%, #222222 100%)",
            boxShadow: [
              "inset 0 0.5px 1px rgba(255,255,255,0.15)",
              "inset 0 -1px 1.2px 0.35px rgba(18,18,18,1)",
              "0 2px 3px -1px rgba(13,13,13,0.5)",
              "0 0 0 1px rgba(51,51,51,1)",
            ].join(", "),
          }}
        >
          {soldOut ? "Sold out" : "View Campaign"}
        </Button>
      </div>
    </article>
  );
}
