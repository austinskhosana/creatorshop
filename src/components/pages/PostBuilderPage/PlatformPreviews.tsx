"use client";

import {
  ArrowPathRoundedSquareIcon,
  ArrowUpTrayIcon,
  BookmarkIcon,
  CameraIcon,
  ChartBarIcon,
  ChatBubbleOvalLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
  FilmIcon,
  HeartIcon,
  HomeIcon,
  InboxIcon,
  LinkIcon,
  MagnifyingGlassIcon,
  MusicalNoteIcon,
  PaperAirplaneIcon,
  PhotoIcon,
  PlusIcon,
  UserIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  ArrowUturnRightIcon as ShareSolidIcon,
  BookmarkIcon as BookmarkSolidIcon,
  ChatBubbleOvalLeftEllipsisIcon as CommentSolidIcon,
  HeartIcon as HeartSolidIcon,
  HomeIcon as HomeSolidIcon,
} from "@heroicons/react/24/solid";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Previews that look like the apps a post will end up in. They're drawn with plain,
 * flat surfaces — no blur — the way each app draws them. Media is whatever the parent
 * puts behind them; every count is 0, since a draft has no engagement.
 */

/** Each platform's own system-font stack, so text looks native. */
const platformFont = "font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,Helvetica,Arial,sans-serif]";

export const HANDLE = "jordanmakes";
const NAME = "Jordan Lee";

const scrimTop = "bg-[linear-gradient(to_bottom,rgba(0,0,0,0.5),rgba(0,0,0,0))]";
const scrimBottom = "bg-[linear-gradient(to_top,rgba(0,0,0,0.72),rgba(0,0,0,0.3)_55%,rgba(0,0,0,0))]";

/** Hashtags and @mentions read bold in every app's caption. */
function Caption({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\s+)/).map((part, index) =>
        part.startsWith("#") || part.startsWith("@") ? (
          <strong key={index} className="font-semibold">
            {part}
          </strong>
        ) : (
          part
        ),
      )}
    </>
  );
}

export function EmptyMedia({ dark = false }: { dark?: boolean }) {
  return (
    <div className={cn("grid size-full place-items-center", dark ? "bg-neutral-900" : "bg-neutral-100")}>
      <PhotoIcon aria-hidden="true" className={cn("size-9", dark ? "text-neutral-600" : "text-neutral-300")} strokeWidth={1.5} />
    </div>
  );
}

function PhotoCounter({ count, current, className }: { count: number; current: number; className?: string }) {
  return (
    <span className={cn("rounded-full bg-neutral-950/65 px-2.5 py-1 text-[11px] font-medium text-white tabular-nums", className)}>
      {current + 1}/{count}
    </span>
  );
}

/** Invisible left/right halves so a photo post can be flipped through with the mouse. */
function FlipZones({ count, current, onSelect, what }: { count: number; current: number; onSelect: (index: number) => void; what: string }) {
  if (count < 2) return null;
  return (
    <>
      <button
        type="button"
        aria-label={`Previous ${what}`}
        disabled={current === 0}
        onClick={() => onSelect(current - 1)}
        className="absolute inset-y-0 left-0 z-10 w-1/3 cursor-default focus-visible:outline-none"
      />
      <button
        type="button"
        aria-label={`Next ${what}`}
        disabled={current === count - 1}
        onClick={() => onSelect(current + 1)}
        className="absolute inset-y-0 right-0 z-10 w-1/3 cursor-default focus-visible:outline-none"
      />
    </>
  );
}

/* ------------------------------------------------------------------ TikTok */

function TikTokRailItem({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <span className="flex flex-col items-center gap-0.5">
      {icon}
      <span className="text-[10px] leading-3 font-semibold">{label}</span>
    </span>
  );
}

/** TikTok's For You screen drawn over the media: tabs, the icon rail, caption and sound, and the nav bar. */
export function TikTokFeed({ caption, brand, photos }: { caption: string; brand: string; photos?: { count: number; current: number; onSelect: (index: number) => void } }) {
  return (
    <div className={cn("absolute inset-0 z-10 text-white", platformFont)}>
      <div aria-hidden="true" className={cn("absolute inset-x-0 top-0 h-28", scrimTop)} />
      <div aria-hidden="true" className={cn("absolute inset-x-0 bottom-0 h-80", scrimBottom)} />
      {photos ? <FlipZones count={photos.count} current={photos.current} onSelect={photos.onSelect} what="photo" /> : null}

      <div aria-hidden="true" className="absolute inset-x-0 top-[46px] flex items-center justify-center gap-4 text-[13px] font-semibold">
        <span className="text-white/65">Following</span>
        <span className="relative">
          For You
          <span className="absolute -bottom-1 left-1/2 h-[2px] w-4 -translate-x-1/2 rounded-full bg-white" />
        </span>
      </div>
      <MagnifyingGlassIcon aria-hidden="true" className="absolute top-[45px] right-3 size-[18px]" strokeWidth={2.2} />

      <div aria-hidden="true" className="absolute right-2 bottom-[72px] flex flex-col items-center gap-3">
        <span className="relative mb-1">
          <span className="grid size-[38px] place-items-center rounded-full border-[1.5px] border-white bg-neutral-800 text-[11px] font-bold">JL</span>
          <span className="absolute -bottom-2 left-1/2 grid size-[18px] -translate-x-1/2 place-items-center rounded-full bg-[#fe2c55]">
            <PlusIcon className="size-3" strokeWidth={3} />
          </span>
        </span>
        <TikTokRailItem icon={<HeartSolidIcon className="size-[30px] drop-shadow" />} label="0" />
        <TikTokRailItem icon={<CommentSolidIcon className="size-[30px] drop-shadow" />} label="0" />
        <TikTokRailItem icon={<BookmarkSolidIcon className="size-[30px] drop-shadow" />} label="0" />
        <TikTokRailItem icon={<ShareSolidIcon className="size-[30px] drop-shadow" />} label="0" />
        <span className="mt-1 grid size-8 place-items-center rounded-full border-[6px] border-neutral-800 bg-neutral-600">
          <span className="size-2 rounded-full bg-white/80" />
        </span>
      </div>

      <div aria-hidden="true" className={cn("absolute right-14 left-3", photos ? "bottom-[88px]" : "bottom-[66px]")}>
        <p className="text-[13px] leading-4 font-bold">@{HANDLE}</p>
        <span className="mt-1 inline-block rounded bg-black/35 px-1.5 py-0.5 text-[10px] leading-3 font-medium">Paid partnership · {brand}</span>
        <p className="mt-1.5 line-clamp-2 text-[12px] leading-4">
          <Caption text={caption} />
        </p>
        <p className="mt-1.5 flex items-center gap-1 text-[11px] leading-4">
          <MusicalNoteIcon className="size-3.5 shrink-0" strokeWidth={2} />
          <span className="truncate">original sound - {HANDLE}</span>
        </p>
      </div>

      {photos ? (
        <PhotoCounter count={photos.count} current={photos.current} className="absolute bottom-[62px] left-1/2 -translate-x-1/2 bg-black/45" />
      ) : null}

      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 flex h-[58px] items-start justify-around bg-black px-1 pt-2">
        <span className="flex w-10 flex-col items-center gap-0.5">
          <HomeSolidIcon className="size-[22px]" />
          <span className="text-[9px] leading-3 font-semibold">Home</span>
        </span>
        <span className="flex w-10 flex-col items-center gap-0.5 text-white/65">
          <UsersIcon className="size-[22px]" strokeWidth={1.8} />
          <span className="text-[9px] leading-3 font-medium">Friends</span>
        </span>
        <span className="relative mt-0.5 h-[28px] w-[38px]">
          <span className="absolute inset-y-0 left-0 w-[30px] rounded-md bg-[#25f4ee]" />
          <span className="absolute inset-y-0 right-0 w-[30px] rounded-md bg-[#fe2c55]" />
          <span className="absolute inset-y-0 left-[4px] right-[4px] grid place-items-center rounded-md bg-white text-black">
            <PlusIcon className="size-4" strokeWidth={3} />
          </span>
        </span>
        <span className="flex w-10 flex-col items-center gap-0.5 text-white/65">
          <InboxIcon className="size-[22px]" strokeWidth={1.8} />
          <span className="text-[9px] leading-3 font-medium">Inbox</span>
        </span>
        <span className="flex w-10 flex-col items-center gap-0.5 text-white/65">
          <UserIcon className="size-[22px]" strokeWidth={1.8} />
          <span className="text-[9px] leading-3 font-medium">Profile</span>
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- Instagram */

function ReelsRailItem({ icon, label }: { icon: ReactNode; label?: string }) {
  return (
    <span className="flex flex-col items-center gap-1">
      {icon}
      {label ? <span className="text-[10px] leading-3 font-semibold">{label}</span> : null}
    </span>
  );
}

/** The Reels viewer drawn over the video: header, icon rail, creator and audio, and the nav bar. */
export function ReelsFeed({ caption, brand }: { caption: string; brand: string }) {
  return (
    <div className={cn("absolute inset-0 z-10 text-white", platformFont)}>
      <div aria-hidden="true" className={cn("absolute inset-x-0 top-0 h-28", scrimTop)} />
      <div aria-hidden="true" className={cn("absolute inset-x-0 bottom-0 h-72", scrimBottom)} />

      <p aria-hidden="true" className="absolute top-[46px] left-3 text-[18px] leading-5 font-bold tracking-tight">Reels</p>
      <CameraIcon aria-hidden="true" className="absolute top-[45px] right-3 size-[22px]" strokeWidth={1.8} />

      <div aria-hidden="true" className="absolute right-2.5 bottom-[66px] flex flex-col items-center gap-4">
        <ReelsRailItem icon={<HeartIcon className="size-[26px]" strokeWidth={1.8} />} label="0" />
        <ReelsRailItem icon={<ChatBubbleOvalLeftIcon className="size-[26px]" strokeWidth={1.8} />} label="0" />
        <ReelsRailItem icon={<PaperAirplaneIcon className="size-[24px] -rotate-[25deg]" strokeWidth={1.8} />} />
        <ReelsRailItem icon={<EllipsisHorizontalIcon className="size-6" strokeWidth={2} />} />
        <span className="size-[22px] rounded-md border-[1.5px] border-white bg-neutral-700" />
      </div>

      <div aria-hidden="true" className="absolute right-14 bottom-[64px] left-3">
        <div className="flex items-center gap-2">
          <span className="grid size-[26px] shrink-0 place-items-center rounded-full bg-neutral-800 text-[9px] font-bold ring-1 ring-white/40">JL</span>
          <span className="text-[12px] leading-4 font-semibold">{HANDLE}</span>
          <span className="rounded-md border border-white px-2 py-[3px] text-[10px] leading-3 font-semibold">Follow</span>
        </div>
        <p className="mt-1.5 text-[10px] leading-3 text-white/80">Paid partnership with {brand.toLowerCase().replace(/\s+/g, "")}</p>
        <p className="mt-1.5 line-clamp-2 text-[12px] leading-4">
          <Caption text={caption} />
        </p>
        <p className="mt-2 inline-flex max-w-full items-center gap-1 rounded-full bg-black/35 px-2 py-1 text-[10px] leading-3">
          <MusicalNoteIcon className="size-3 shrink-0" strokeWidth={2} />
          <span className="truncate">{HANDLE} · Original audio</span>
        </p>
      </div>

      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 flex h-[52px] items-start justify-around bg-black px-2 pt-3">
        <HomeIcon className="size-6" strokeWidth={1.8} />
        <FilmIcon className="size-6" strokeWidth={2.4} />
        <PaperAirplaneIcon className="size-[22px] -rotate-[25deg]" strokeWidth={1.8} />
        <MagnifyingGlassIcon className="size-6" strokeWidth={1.8} />
        <span className="grid size-6 place-items-center rounded-full bg-neutral-700 text-[8px] font-bold ring-1 ring-white/40">JL</span>
      </div>
    </div>
  );
}

/** An Instagram feed post: header, media, the action row with carousel dots, and the caption. */
export function InstagramPost({
  caption,
  brand,
  count,
  current,
  onSelect,
  children,
}: {
  caption: string;
  brand: string;
  count: number;
  current: number;
  onSelect: (index: number) => void;
  /** The media, drawn behind the slide counter and arrows. */
  children: ReactNode;
}) {
  const isCarousel = count > 1;
  return (
    <div className={cn("overflow-hidden rounded-[16px] border border-neutral-200 bg-white text-neutral-950", platformFont)}>
      <div className="flex items-center gap-2.5 px-3 py-2.5">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-neutral-900 text-[10px] font-bold text-white">JL</span>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] leading-4 font-semibold">{HANDLE}</p>
          <p className="truncate text-[11px] leading-3.5 text-neutral-500">Paid partnership with {brand.toLowerCase().replace(/\s+/g, "")}</p>
        </div>
        <EllipsisHorizontalIcon aria-hidden="true" className="size-5 shrink-0" strokeWidth={2} />
      </div>

      <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
        {children}
        {isCarousel ? (
          <>
            <PhotoCounter count={count} current={current} className="absolute top-3 right-3" />
            {current > 0 ? (
              <button
                type="button"
                onClick={() => onSelect(current - 1)}
                aria-label="Previous slide"
                className="absolute top-1/2 left-2 grid size-7 -translate-y-1/2 place-items-center rounded-full bg-white text-neutral-950 shadow-[0_1px_4px_rgba(0,0,0,0.3)] transition-transform duration-150 after:absolute after:-inset-1.5 after:content-[''] active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
              >
                <ChevronLeftIcon aria-hidden="true" className="size-4" strokeWidth={2.2} />
              </button>
            ) : null}
            {current < count - 1 ? (
              <button
                type="button"
                onClick={() => onSelect(current + 1)}
                aria-label="Next slide"
                className="absolute top-1/2 right-2 grid size-7 -translate-y-1/2 place-items-center rounded-full bg-white text-neutral-950 shadow-[0_1px_4px_rgba(0,0,0,0.3)] transition-transform duration-150 after:absolute after:-inset-1.5 after:content-[''] active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
              >
                <ChevronRightIcon aria-hidden="true" className="size-4" strokeWidth={2.2} />
              </button>
            ) : null}
          </>
        ) : null}
      </div>

      <div className="relative flex items-center px-3 pt-2.5">
        <div aria-hidden="true" className="flex items-center gap-3.5">
          <HeartIcon className="size-6" strokeWidth={1.8} />
          <ChatBubbleOvalLeftIcon className="size-6" strokeWidth={1.8} />
          <PaperAirplaneIcon className="size-[22px] -rotate-[25deg]" strokeWidth={1.8} />
        </div>
        {isCarousel ? (
          <div className="absolute left-1/2 flex -translate-x-1/2 items-center">
            {Array.from({ length: count }, (_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => onSelect(index)}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === current}
                className="grid size-4 place-items-center focus-visible:outline-none"
              >
                <span className={cn("size-1.5 rounded-full transition-colors duration-150", index === current ? "bg-[#0095f6]" : "bg-neutral-300")} />
              </button>
            ))}
          </div>
        ) : null}
        <BookmarkIcon aria-hidden="true" className="ml-auto size-6" strokeWidth={1.8} />
      </div>

      <div className="px-3 pt-2 pb-3">
        <p className="line-clamp-3 text-[13px] leading-[18px]">
          <strong className="font-semibold">{HANDLE}</strong> <Caption text={caption} />
        </p>
        <p className="mt-1.5 text-[10px] tracking-wide text-neutral-500 uppercase">Just now</p>
      </div>
    </div>
  );
}

/** The Story viewer drawn over the frame: progress bars, author, stickers and the message bar. */
export function StoryViewer({ count, current, brandTag, link }: { count: number; current: number; brandTag: string; link: string | null }) {
  return (
    <div className={cn("absolute inset-0 z-10 text-white", platformFont)}>
      <div aria-hidden="true" className={cn("absolute inset-x-0 top-0 h-32", scrimTop)} />
      <div aria-hidden="true" className={cn("absolute inset-x-0 bottom-0 h-40", scrimBottom)} />

      <div aria-hidden="true" className="absolute inset-x-2.5 top-[44px] flex gap-[3px]">
        {Array.from({ length: count }, (_, index) => (
          <span key={index} className="h-[2px] flex-1 overflow-hidden rounded-full bg-white/35">
            <span className={cn("block h-full bg-white", index <= current ? "w-full" : "w-0")} />
          </span>
        ))}
      </div>
      <div aria-hidden="true" className="absolute inset-x-2.5 top-[54px] flex items-center gap-2">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-neutral-800 text-[10px] font-bold ring-1 ring-white/40">JL</span>
        <div className="min-w-0 flex-1">
          <p className="text-[12px] leading-4 font-semibold">
            {HANDLE} <span className="font-normal text-white/70">now</span>
          </p>
          <p className="text-[10px] leading-3 text-white/80">Paid partnership</p>
        </div>
        <EllipsisHorizontalIcon className="size-5 shrink-0" strokeWidth={2.4} />
        <XMarkIcon className="size-5 shrink-0" strokeWidth={2.2} />
      </div>

      <div aria-hidden="true" className="absolute inset-x-3 top-1/2 flex -translate-y-1/2 flex-col items-center gap-3">
        <span className="max-w-full -rotate-2 truncate rounded-xl bg-white px-3.5 py-2 text-[14px] leading-4 font-semibold text-neutral-950 shadow-[0_2px_8px_rgba(0,0,0,0.25)]">
          {brandTag || "@brand"}
        </span>
        {link ? (
          <span className="inline-flex max-w-full items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-[12px] leading-4 font-semibold text-[#0095f6] shadow-[0_2px_8px_rgba(0,0,0,0.25)]">
            <LinkIcon className="size-3.5 shrink-0" strokeWidth={2.4} />
            <span className="truncate">{link}</span>
          </span>
        ) : null}
      </div>

      <div aria-hidden="true" className="absolute inset-x-3 bottom-7 flex items-center gap-3">
        <span className="flex-1 rounded-full border border-white/70 px-3.5 py-2 text-[11px] leading-4">Send message</span>
        <HeartIcon className="size-6 shrink-0" strokeWidth={1.8} />
        <PaperAirplaneIcon className="size-[22px] shrink-0 -rotate-[25deg]" strokeWidth={1.8} />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- X */

/** One post in an X thread: avatar and the reply line, name and handle, the text, and the action row. */
export function XPost({ text, isLast }: { text: string; isLast: boolean }) {
  return (
    <li className={cn("flex gap-3 px-4 pt-3", platformFont)}>
      <div className="flex flex-col items-center">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-neutral-900 text-[12px] font-bold text-white">JL</span>
        {!isLast ? <span aria-hidden="true" className="mt-1 w-0.5 flex-1 rounded-full bg-neutral-200" /> : null}
      </div>
      <div className={cn("min-w-0 flex-1 text-neutral-950", isLast ? "pb-3" : "pb-2")}>
        <p className="flex items-center gap-1 text-[15px] leading-5">
          <span className="truncate font-bold">{NAME}</span>
          <span className="truncate text-neutral-500">
            @{HANDLE} · now
          </span>
        </p>
        <p className="mt-0.5 text-[15px] leading-5 break-words whitespace-pre-wrap">
          {text ? <Caption text={text} /> : <span className="text-neutral-300">Empty post</span>}
        </p>
        <div aria-hidden="true" className="mt-3 flex max-w-[92%] items-center justify-between text-neutral-500">
          <ChatBubbleOvalLeftIcon className="size-[18px]" strokeWidth={1.6} />
          <ArrowPathRoundedSquareIcon className="size-[18px]" strokeWidth={1.6} />
          <HeartIcon className="size-[18px]" strokeWidth={1.6} />
          <ChartBarIcon className="size-[18px]" strokeWidth={1.6} />
          <span className="flex items-center gap-3">
            <BookmarkIcon className="size-[18px]" strokeWidth={1.6} />
            <ArrowUpTrayIcon className="size-[18px]" strokeWidth={1.6} />
          </span>
        </div>
      </div>
    </li>
  );
}
