"use client";

import type { CSSProperties, ReactNode } from "react";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { CheckBadgeIcon, StarIcon } from "@heroicons/react/20/solid";
import BrandLogo from "@/components/atoms/BrandLogo/BrandLogo";
import { StatusPill, type StatusTone } from "@/components/molecules/StatusPill";
import { canPublish } from "@/components/organisms/SellingReadiness";
import type { BrandAccount } from "@/lib/data/brand-schema";
import { domainOf } from "@/lib/store/brand-store";
import { cn } from "@/lib/utils";

interface StorefrontCardProps {
  account: BrandAccount;
  /** Product pages creators can shop right now. */
  liveCount: number;
  /** "manage" is the merchant's own view, with store status; "public" is the store header creators see. */
  variant?: "manage" | "public";
  titleAs?: "h1" | "h2";
  className?: string;
}

function Fact({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("min-w-0", className)}>
      <dt className="text-[11px] font-medium tracking-[0.1em] text-neutral-400 uppercase">{label}</dt>
      <dd className="mt-1.5 flex min-w-0 items-center gap-1.5 text-sm font-semibold tabular-nums text-neutral-950">{children}</dd>
    </div>
  );
}

function storeStatus(account: BrandAccount, liveCount: number): { tone: StatusTone; label: string } {
  if (!canPublish(account)) return { tone: "muted", label: "Hidden from creators" };
  if (liveCount === 0) return { tone: "neutral", label: "Nothing live yet" };
  return { tone: "success", label: "Open" };
}

const NOTCH = 12;

/** Cuts half-circle notches into both corners of one edge, so the tear line reads as a real perforation. */
function notchMask(edge: "top" | "bottom"): CSSProperties {
  const y = edge === "top" ? "0" : "100%";
  const hole = (x: string) => `radial-gradient(circle ${NOTCH}px at ${x} ${y}, #0000 ${NOTCH - 0.5}px, #000 ${NOTCH}px)`;
  const mask = `${hole("0")}, ${hole("100%")}`;
  return { maskImage: mask, WebkitMaskImage: mask, maskComposite: "intersect", WebkitMaskComposite: "source-in" };
}

/** Decorative barcode, derived from the slug so each storefront prints its own. */
function Barcode({ seed }: { seed: string }) {
  const bars = Array.from({ length: 28 }, (_, i) => {
    const code = seed.charCodeAt(i % seed.length) + i * 7;
    return { width: (code % 3) + 1, gap: ((code >> 2) % 2) + 1 };
  });
  return (
    <div aria-hidden="true" className="flex h-9 items-stretch">
      {bars.map((bar, i) => (
        <span key={i} className="bg-neutral-900" style={{ width: bar.width, marginRight: bar.gap }} />
      ))}
    </div>
  );
}

/**
 * The brand's storefront as an object: logo, name, and the line creators read, over a dashed
 * tear line of ticket-style facts. The notches are masked out, so the card sits on any background.
 */
export default function StorefrontCard({ account, liveCount, variant = "manage", titleAs: Title = "h2", className }: StorefrontCardProps) {
  const manage = variant === "manage";
  const status = storeStatus(account, liveCount);

  return (
    <section
      aria-label={`${account.companyName} storefront`}
      className={cn("@container text-left [filter:drop-shadow(0_0_0.5px_rgb(0_0_0/0.3))_drop-shadow(0_1px_2px_rgb(0_0_0/0.05))]", className)}
    >
      <div style={notchMask("bottom")} className="flex items-center gap-4 rounded-t-[20px] bg-white p-5 @lg:gap-5 @lg:p-6">
        <BrandLogo slug={account.slug} name={account.companyName} size={64} className="shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
            <Title className="text-[22px] leading-tight font-semibold tracking-[-0.03em] text-neutral-950">{account.companyName}</Title>
            {account.verified ? (
              <span role="img" aria-label="Verified storefront" title="Verified: work email matches the website" className="inline-flex text-neutral-900">
                <CheckBadgeIcon aria-hidden="true" className="size-5" />
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-pretty text-sm leading-6 text-neutral-500">{account.tagline}</p>
        </div>
        {manage ? <StatusPill tone={status.tone} label={status.label} className="shrink-0 self-start" /> : null}
      </div>

      <div style={notchMask("top")} className="relative flex rounded-b-[20px] bg-white">
        <span
          aria-hidden="true"
          className="absolute inset-x-[18px] top-0 h-px bg-[repeating-linear-gradient(90deg,var(--color-neutral-300)_0_5px,transparent_5px_10px)]"
        />
        <dl className="grid min-w-0 flex-1 grid-cols-2 gap-x-6 gap-y-4 border-t border-dashed border-neutral-200 px-5 py-4 @lg:px-6 @xl:grid-cols-4">
          {manage ? (
            <Fact label="In store">
              {liveCount} product {liveCount === 1 ? "page" : "pages"}
            </Fact>
          ) : (
            <Fact label="Website">
              <a
                href={account.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-w-0 items-center gap-1 rounded-sm font-mono text-[13px] font-normal text-neutral-950 underline decoration-neutral-300 underline-offset-4 transition-[text-decoration-color] duration-150 hover:decoration-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
              >
                <span className="truncate">{domainOf(account.website)}</span>
                <ArrowTopRightOnSquareIcon aria-hidden="true" className="size-3.5 shrink-0" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </Fact>
          )}
          <Fact label="Category">{account.category}</Fact>
          <Fact label="Completed shops">{account.completedShops}</Fact>
          <Fact label="Rating">
            {account.rating !== null ? (
              <>
                <StarIcon aria-hidden="true" className="size-3.5 text-neutral-900" />
                {account.rating.toFixed(1)}
              </>
            ) : (
              <span className="font-normal text-neutral-500">No ratings yet</span>
            )}
          </Fact>
        </dl>
        <div className="relative hidden shrink-0 flex-col items-start justify-center gap-1.5 px-6 py-4 @2xl:flex">
          <span aria-hidden="true" className="absolute inset-y-4 left-0 w-px bg-[repeating-linear-gradient(180deg,var(--color-neutral-300)_0_5px,transparent_5px_10px)]" />
          <Barcode seed={account.slug} />
          <span className="font-mono text-[10px] tracking-[0.14em] text-neutral-400 uppercase">{account.slug}</span>
        </div>
      </div>
    </section>
  );
}
