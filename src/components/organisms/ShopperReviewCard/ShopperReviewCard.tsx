"use client";

import Image from "next/image";
import { useRef, type MouseEvent, type PointerEvent } from "react";
import { StarIcon, UserIcon } from "@heroicons/react/24/solid";
import { PlatformIcon } from "@/components/atoms/PlatformIcon";
import { TerminalgraphShader } from "@/components/atoms/TerminalgraphShader";
import { toProfileCard } from "@/lib/brand-format";
import type { Shopper } from "@/lib/data/brand-schema";
import { getCoverStyle } from "@/lib/profile-covers";

interface ShopperReviewCardProps {
  shopper: Shopper;
  /** Disable the animated WebGL banner for off-screen/ghost copies to save GPU work. */
  showShader?: boolean;
  /** The whole bio and every example post — for profile pages, where nothing needs to fit a deck. */
  full?: boolean;
  /** `h1` when the card is the page, as on a profile. */
  titleAs?: "h1" | "h2";
  className?: string;
}

/**
 * The creator profile card — the one card a creator's public profile renders in, everywhere: their
 * own profile page, a brand's view of them, shopper review, the directory deck, and the brand
 * landing demo. Sized to fit one viewport: the track record sits beside the avatar, niches and
 * audience share a row, and only the first two example posts show (`full` lifts the limits).
 * The banner is a fixed height everywhere; give the card a height (e.g. `h-full`) and the panel
 * grows into it. Social and post links stay
 * clickable even when the card is wrapped in a swipe container that disables pointer events on its face.
 */
export default function ShopperReviewCard({ shopper, showShader = true, full = false, titleAs: Title = "h2", className = "" }: ShopperReviewCardProps) {
  const profile = toProfileCard(shopper);
  const coverStyle = shopper.coverId ? getCoverStyle(shopper.coverId, shopper.coverImage ?? null) : null;
  // Links sit inside the swipeable card, so a drag that starts on one must not also open it.
  const pressStart = useRef<{ x: number; y: number } | null>(null);
  function onPostPointerDown(event: PointerEvent) {
    pressStart.current = { x: event.clientX, y: event.clientY };
  }
  function onPostClick(event: MouseEvent) {
    const start = pressStart.current;
    if (start && Math.hypot(event.clientX - start.x, event.clientY - start.y) > 6) event.preventDefault();
  }

  const initials = shopper.name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase();

  const stats = [
    { label: "Followers", value: profile.followers, icon: <UserIcon aria-hidden="true" className="size-3.5" /> },
    {
      label: "Rating",
      value: shopper.rating !== null ? shopper.rating.toFixed(1) : "New",
      icon: shopper.rating !== null ? <StarIcon aria-hidden="true" className="size-3.5" /> : null,
    },
    { label: "Completed shops", value: String(shopper.completedShops), icon: null },
  ];

  return (
    <article
      aria-labelledby={`review-name-${shopper.id}`}
      className={`@container flex w-full flex-col rounded-[32px] border border-neutral-200 bg-white p-3 text-left ${className}`}
    >
      {/* A fixed height, so the banner reads the same on every surface. Given a taller slot, the
          panel takes the extra instead, so the card never ends in dead space. */}
      <div className="relative h-36 shrink-0 overflow-hidden rounded-[24px] border border-neutral-200 bg-white @lg:h-40">
        {coverStyle ? (
          <div className="absolute inset-0 size-full" style={coverStyle} />
        ) : showShader ? (
          <TerminalgraphShader theme="light" background={{ dark: "#052e12", light: "#ffffff" }} className="absolute inset-0 size-full" />
        ) : (
          <div className="absolute inset-0 size-full bg-gradient-to-br from-[#EDFFD0] to-white" />
        )}
      </div>

      <div className="relative mt-3 flex flex-[1_0_auto] flex-col rounded-[24px] border border-neutral-200 bg-white px-5 pt-[68px] pb-5 @lg:px-6">
        {/* The white ring is padding on a wrapper so the photo's edge pixels can't leak past it. */}
        <div className="absolute -top-14 left-5 size-[104px] rounded-full bg-white p-[5px] shadow-sm @lg:left-6">
          <div className="relative size-full overflow-hidden rounded-full bg-neutral-100">
            {shopper.avatar ? (
              <Image src={shopper.avatar} alt={`${shopper.name}'s profile photo`} fill sizes="104px" className="object-cover" draggable={false} />
            ) : (
              <span aria-hidden="true" className="grid size-full place-items-center text-3xl font-bold tracking-[-0.04em] text-neutral-900">
                {initials}
              </span>
            )}
          </div>
        </div>

        <Title id={`review-name-${shopper.id}`} className="text-2xl font-bold tracking-[-0.035em] text-neutral-950">
          {shopper.name}
        </Title>
        <p className="text-base tracking-[-0.02em] text-neutral-500">{profile.handle}</p>

        {/* Beside the avatar on a wide card; under the handle on a narrow one. */}
        <dl className="mt-4 grid grid-cols-3 gap-2 @lg:absolute @lg:top-3 @lg:right-3 @lg:mt-0 @lg:flex">
          {stats.map((stat) => (
            <div key={stat.label} className="flex min-w-0 flex-col-reverse justify-end rounded-xl bg-neutral-100 px-3 py-1.5 @lg:min-w-[76px]">
              <dt className="text-[11px] leading-4 text-neutral-500">{stat.label}</dt>
              <dd className="flex items-center gap-1 text-base font-bold tabular-nums text-neutral-950">
                {stat.icon}
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>

        <p className={`mt-2 text-[15px] leading-6 text-pretty text-neutral-600 ${full ? "" : "line-clamp-2"}`}>{shopper.bio}</p>

        <div className="mt-4 mb-4 flex flex-wrap items-center justify-between gap-2">
          <ul className="flex flex-wrap gap-2" aria-label={`${shopper.name}'s niches`}>
            {shopper.niches.map((niche) => (
              <li key={niche} className="inline-flex h-9 items-center rounded-xl bg-neutral-100 px-3 text-sm font-medium text-neutral-900">
                {niche}
              </li>
            ))}
          </ul>
          {profile.platforms.length > 0 ? (
            <ul className="flex flex-wrap gap-2" aria-label={`${shopper.name}'s audience by platform`}>
              {profile.platforms.map((platform) => (
                <li key={platform.name}>
                  <a
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    draggable={false}
                    onPointerDown={onPostPointerDown}
                    onClick={onPostClick}
                    aria-label={`${platform.name}: ${platform.handle}, ${platform.audience} followers (opens in a new tab)`}
                    className="pointer-events-auto inline-flex h-9 items-center gap-2 rounded-xl border border-neutral-300 bg-white px-3 text-sm font-medium text-neutral-900 shadow-[0_1px_2px_rgba(0,0,0,0.06)] transition-[background-color,border-color] duration-150 hover:border-neutral-400 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                  >
                    <PlatformIcon platform={platform.name} className="size-[18px]" />
                    <span className="tabular-nums">{platform.audience}</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <section aria-labelledby={`review-posts-${shopper.id}`} className="mt-auto border-t border-neutral-200 pt-4">
          <h3 id={`review-posts-${shopper.id}`} className="text-xs text-neutral-500">
            Example posts
          </h3>
          {shopper.examplePosts.length > 0 ? (
            <ul className="mt-2 space-y-2">
              {(full ? shopper.examplePosts : shopper.examplePosts.slice(0, 2)).map((post) => (
                <li key={post.url} className="min-w-0">
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    draggable={false}
                    onPointerDown={onPostPointerDown}
                    onClick={onPostClick}
                    className="pointer-events-auto flex min-h-11 items-center gap-3 rounded-xl bg-neutral-100 px-3.5 text-sm font-medium text-neutral-900 transition-[background-color] duration-150 hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                  >
                    <PlatformIcon platform={post.platform} className="size-4 shrink-0 text-neutral-500" />
                    <span className="truncate">{post.title}</span>
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-neutral-500">No example posts yet.</p>
          )}
        </section>
      </div>
    </article>
  );
}
