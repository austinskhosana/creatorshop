"use client";

import { BanknotesIcon, ChatBubbleBottomCenterTextIcon, ClipboardDocumentListIcon } from "@heroicons/react/24/outline";
import { useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import Button from "@/components/atoms/Button/Button";
import { darkGradientButtonStyle } from "@/components/atoms/Button/darkGradientStyle";
import { PixelTrail } from "@/components/atoms/PixelTrail";
import { TerminalgraphShader } from "@/components/atoms/TerminalgraphShader";
import type { ContentType } from "@/lib/content-types";
import type { CreatorShop } from "@/lib/mock-creator";
import { cn } from "@/lib/utils";

export interface BuilderProps {
  shop: CreatorShop;
  contentType: ContentType;
  /** The back button and title, shown at the top of the left column. */
  intro: ReactNode;
  onPay: () => void;
}

export function defaultCaption(shop: CreatorShop) {
  return `I've been using ${shop.product} to make my creative work feel more focused. Here are a few things I'm loving so far. #ad`;
}

/** Why a caption blocks payment, or null when it's fine. */
export function captionProblem(caption: string, limit: number) {
  if (caption.trim().length === 0) return "Add a caption to continue.";
  if (caption.length > limit) return `Shorten your caption to ${limit.toLocaleString("en-US")} characters or fewer.`;
  return null;
}

export function SectionHeading({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <span className="flex items-center gap-2.5 text-base font-semibold">
      <span className="grid size-7 place-items-center rounded-md bg-[#A3FF38]">{icon}</span>
      {children}
    </span>
  );
}

export function BriefSection() {
  return (
    <div className="border-b border-neutral-100 pb-8">
      <SectionHeading icon={<ClipboardDocumentListIcon className="size-3.5 text-black" />}>Brief</SectionHeading>
      <p className="mt-2 text-[13px] leading-5 text-neutral-500">This is a draft preview. Nothing is published from Creatorshop.</p>
    </div>
  );
}

export function CharacterCount({ count, limit }: { count: number; limit: number }) {
  const over = count > limit;
  return (
    <span className={cn("text-xs tabular-nums", over ? "font-medium text-red-600" : "text-neutral-400")}>
      {count.toLocaleString("en-US")} / {limit.toLocaleString("en-US")}
      <span className="sr-only"> characters{over ? ", over the limit" : ""}</span>
    </span>
  );
}

export function CaptionField({ value, onChange, limit }: { value: string; onChange: (value: string) => void; limit: number }) {
  return (
    <label className="mt-8 block">
      <span className="flex items-center justify-between gap-3">
        <SectionHeading icon={<ChatBubbleBottomCenterTextIcon className="size-3.5 text-black" />}>Caption</SectionHeading>
        <CharacterCount count={value.length} limit={limit} />
      </span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={6}
        className="mt-3 w-full resize-none rounded-xl border border-neutral-200 p-3.5 text-sm leading-6 font-normal text-neutral-700 outline-none focus:border-neutral-900"
      />
    </label>
  );
}

/** The placeholder image every draft uses until real uploads exist. */
export function ShaderFill() {
  return (
    <TerminalgraphShader
      theme="light"
      background={{ dark: "#052e12", light: "#ffffff" }}
      className="pointer-events-none absolute inset-0 size-full"
    />
  );
}

/**
 * A phone around a preview: dark bezel, side buttons, dynamic island, status bar
 * and home indicator, drawn for the dark app UIs (TikTok, Reels, Stories) that go inside it. The screen is taller than 9:16, like a real phone, so the
 * video fills it edge to edge the way TikTok and Reels do.
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto w-full max-w-[280px]">
      <span aria-hidden="true" className="absolute top-[74px] -left-[3px] h-6 w-[3px] rounded-l-sm bg-neutral-800" />
      <span aria-hidden="true" className="absolute top-[112px] -left-[3px] h-10 w-[3px] rounded-l-sm bg-neutral-800" />
      <span aria-hidden="true" className="absolute top-[158px] -left-[3px] h-10 w-[3px] rounded-l-sm bg-neutral-800" />
      <span aria-hidden="true" className="absolute top-[124px] -right-[3px] h-14 w-[3px] rounded-r-sm bg-neutral-800" />
      <div className="rounded-[40px] bg-neutral-950 p-[7px] shadow-[0_0_0_1px_rgba(255,255,255,0.1)_inset,0_0_0_1.5px_#3f3f3f,0_28px_48px_-24px_rgba(10,10,10,0.55),0_10px_18px_-10px_rgba(10,10,10,0.35)]">
        <div className="relative isolate aspect-[9/19] overflow-hidden rounded-[33px] bg-white">
          {children}
          <div aria-hidden="true" className="absolute inset-x-0 top-0 z-20 h-11">
            <span className="absolute top-3 left-6 text-[10px] font-semibold text-white tabular-nums">9:41</span>
            <span className="absolute top-2.5 left-1/2 h-[22px] w-[68px] -translate-x-1/2 rounded-full bg-neutral-950" />
            <span className="absolute top-[13px] right-6 flex items-center gap-1">
              <span className="flex items-end gap-[1.5px]">
                <span className="h-[3px] w-[2px] rounded-[1px] bg-white" />
                <span className="h-[5px] w-[2px] rounded-[1px] bg-white" />
                <span className="h-[7px] w-[2px] rounded-[1px] bg-white" />
                <span className="h-[9px] w-[2px] rounded-[1px] bg-white" />
              </span>
              <span className="relative h-[9px] w-[17px] rounded-[3px] border border-white/70 p-[1px]">
                <span className="block size-full rounded-[1.5px] bg-white" />
              </span>
            </span>
          </div>
          <span aria-hidden="true" className="absolute bottom-2 left-1/2 z-20 h-1 w-[84px] -translate-x-1/2 rounded-full bg-white/85" />
        </div>
      </div>
    </div>
  );
}

/** The sample video a draft uses for now, in place of a real upload. */
const SAMPLE_VIDEO = "/videos/tiktok-sample.mp4";

/**
 * The uploaded video, filling its frame. It plays on a loop (muted) unless `playing` is
 * false or the viewer prefers reduced motion — then it rests on its first frame.
 */
export function VideoFill({ playing = true }: { playing?: boolean }) {
  const reduceMotion = useReducedMotion();
  return (
    <video
      // `#t=0.1` makes a paused video show a real frame instead of a blank box.
      src={`${SAMPLE_VIDEO}#t=0.1`}
      muted
      loop
      playsInline
      preload="auto"
      autoPlay={playing && !reduceMotion}
      aria-label="Your video"
      className="pointer-events-none absolute inset-0 size-full object-cover"
    />
  );
}

export function PreviewPill() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-950">
      <span aria-hidden="true" className="relative flex size-1.5">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#A3FF38] opacity-75 motion-reduce:animate-none" />
        <span className="relative inline-flex size-1.5 rounded-full bg-[#A3FF38]" />
      </span>
      Live preview
    </span>
  );
}

export function PreviewNote({ brand }: { brand: string }) {
  return <p className="max-w-[180px] text-right text-[11px] leading-4 text-neutral-400">{brand} reviews this draft before access is unlocked.</p>;
}

/** The two-column shell every layout shares: the composer and pay button on the left, the preview on the right. */
export function BuilderFrame({
  intro,
  composer,
  previewPill,
  previewNote,
  preview,
  action,
}: {
  intro: ReactNode;
  composer: ReactNode;
  /** Sits flush at the top-left of the preview pane, against the divider. */
  previewPill: ReactNode;
  /** Sits at the top-right of the preview pane, opposite the pill. */
  previewNote: ReactNode;
  preview: ReactNode;
  action: ReactNode;
}) {
  return (
    // Two equal halves. The preview half's left border is the divider, so it runs the full height of the page,
    // from the very top. Each half centres its own content.
    <div className="grid min-h-screen w-full lg:grid-cols-2">
      <div className="min-w-0 px-5 py-8 sm:px-8 sm:py-12">
        <div className="mx-auto w-full max-w-[520px]">
          {intro}
          <section className="mt-10">{composer}</section>
          <div className="mt-8">{action}</div>
        </div>
      </div>
      <aside className="relative isolate flex flex-col overflow-hidden border-t border-neutral-200 px-5 py-8 sm:px-8 lg:min-h-screen lg:border-t-0 lg:border-l lg:py-12">
        <PixelTrail
          pixelSize={16}
          fadeDuration={500}
          delay={0}
          className="-z-10 motion-reduce:hidden"
          pixelClassName="bg-[#A3FF38]"
        />
        <div className="pointer-events-none flex items-start justify-between gap-4">
          {previewPill}
          {previewNote}
        </div>
        <div className="pointer-events-none flex flex-1 items-center">
          <div className="pointer-events-auto mx-auto w-full max-w-[440px]">{preview}</div>
        </div>
      </aside>
    </div>
  );
}

export function PayButton({ problem, onPay }: { problem: string | null; onPay: () => void }) {
  return (
    <>
      <Button
        variant="dark"
        size="lg"
        fullWidth
        iconRight={<BanknotesIcon className="size-4" />}
        onClick={onPay}
        disabled={problem !== null}
        aria-describedby={problem !== null ? "pay-hint" : undefined}
        style={{ ...darkGradientButtonStyle, borderRadius: "10px", padding: "14px 20px" }}
      >
        Send draft for approval
      </Button>
      {problem !== null ? (
        <p id="pay-hint" className="mt-2.5 text-center text-xs leading-4 text-neutral-400">
          {problem}
        </p>
      ) : null}
    </>
  );
}
