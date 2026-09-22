"use client";

import { ArrowUpTrayIcon, CameraIcon, LinkIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  BriefSection,
  BuilderFrame,
  PayButton,
  PhoneFrame,
  PreviewNote,
  PreviewPill,
  SectionHeading,
  ShaderFill,
  type BuilderProps,
} from "./BuilderParts";
import { StoryViewer } from "./PlatformPreviews";

const inputClassName =
  "mt-3 w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-sm text-neutral-700 outline-none placeholder:text-neutral-300 focus:border-neutral-900";

function isLink(value: string) {
  return /^https?:\/\/\S+\.\S+/.test(value.trim());
}

function linkHost(value: string) {
  try {
    return new URL(value.trim()).host;
  } catch {
    return value.trim();
  }
}

/** An Instagram Story: one or more 9:16 frames, a brand mention and an optional link sticker — no caption. */
export default function StoryBuilder({ shop, contentType, intro, onPay }: BuilderProps) {
  const min = contentType.range?.min ?? 1;
  const max = contentType.range?.max ?? 5;
  const [frames, setFrames] = useState<number[]>([1]);
  const nextId = useRef(2);
  const [active, setActive] = useState(0);
  const [brandTag, setBrandTag] = useState(`@${shop.brand.toLowerCase().replace(/[^a-z0-9._]/g, "")}`);
  const [link, setLink] = useState("");
  const current = Math.min(active, frames.length - 1);
  const linkProblem = link.trim() !== "" && !isLink(link);
  const problem = frames.length < min ? `Add at least ${min} ${min === 1 ? "frame" : "frames"} to continue.` : linkProblem ? "Enter a full link, like https://example.com." : null;

  function addFrame() {
    if (frames.length >= max) return;
    setFrames([...frames, nextId.current++]);
    setActive(frames.length);
  }

  function removeFrame(index: number) {
    if (frames.length <= min) return;
    setFrames(frames.filter((_, i) => i !== index));
    setActive(Math.max(0, Math.min(index < current ? current - 1 : current, frames.length - 2)));
  }

  return (
    <BuilderFrame
      intro={intro}
      composer={
        <>
          <BriefSection />
          <div className="mt-8">
            <div className="flex items-center justify-between gap-3">
              <SectionHeading icon={<CameraIcon className="size-3.5 text-black" />}>Frames</SectionHeading>
              <span className="text-xs tabular-nums text-neutral-400">
                {frames.length} / {max}
                <span className="sr-only"> frames</span>
              </span>
            </div>
            <p className="mt-2 text-[13px] leading-5 text-neutral-500">
              Stories are vertical (9:16) and disappear after 24 hours. Add up to {max} frames.
            </p>
            <ul className="mt-4 flex flex-wrap gap-3">
              {frames.map((id, index) => (
                <li
                  key={id}
                  className={cn(
                    "relative isolate aspect-[9/16] w-20 overflow-hidden rounded-xl border bg-[linear-gradient(135deg,#fafafa,#e5e5e5)]",
                    index === current ? "border-neutral-900 ring-1 ring-neutral-900" : "border-neutral-200",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setActive(index)}
                    aria-label={`Show frame ${index + 1}`}
                    aria-pressed={index === current}
                    className="absolute inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-inset"
                  />
                  <span className="pointer-events-none absolute bottom-2 left-2 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-medium text-neutral-950 tabular-nums ring-1 ring-black/10">{index + 1}</span>
                  {frames.length > min ? (
                    <button
                      type="button"
                      onClick={() => removeFrame(index)}
                      aria-label={`Remove frame ${index + 1}`}
                      className="absolute top-1.5 right-1.5 z-10 grid size-6 place-items-center rounded-full bg-white/90 text-neutral-700 shadow-sm ring-1 ring-black/10 transition hover:bg-white hover:text-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
                    >
                      <XMarkIcon className="size-3.5" strokeWidth={2} />
                    </button>
                  ) : null}
                </li>
              ))}
              {frames.length < max ? (
                <li>
                  <button
                    type="button"
                    onClick={addFrame}
                    className="flex aspect-[9/16] w-20 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-300 bg-neutral-50/60 text-center transition hover:border-neutral-500 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
                  >
                    <span className="grid size-9 place-items-center rounded-full bg-white shadow-sm ring-1 ring-neutral-200">
                      <ArrowUpTrayIcon className="size-4 text-neutral-600" strokeWidth={2} />
                    </span>
                    <span className="text-[11px] font-medium text-neutral-500">Add frame</span>
                  </button>
                </li>
              ) : null}
            </ul>
          </div>
          <label className="mt-8 block">
            <SectionHeading icon={<span className="text-[11px] font-semibold text-black">@</span>}>Brand tag</SectionHeading>
            <input value={brandTag} onChange={(event) => setBrandTag(event.target.value)} placeholder="@brand" className={inputClassName} />
            <span className="mt-2 block text-[13px] leading-5 text-neutral-500">Shown as a mention sticker, so {shop.brand} is tagged.</span>
          </label>
          <label className="mt-8 block">
            <SectionHeading icon={<LinkIcon className="size-3.5 text-black" />}>Link sticker</SectionHeading>
            <input
              value={link}
              onChange={(event) => setLink(event.target.value)}
              placeholder="https://"
              inputMode="url"
              aria-invalid={linkProblem}
              className={cn(inputClassName, linkProblem && "border-red-400 focus:border-red-500")}
            />
            <span className="mt-2 block text-[13px] leading-5 text-neutral-500">Optional. Adds a tappable link to the story.</span>
          </label>
        </>
      }
      previewPill={<PreviewPill />}
      previewNote={<PreviewNote brand={shop.brand} />}
      preview={
        <PhoneFrame>
          <ShaderFill />
          <StoryViewer count={frames.length} current={current} brandTag={brandTag} link={link.trim() !== "" && !linkProblem ? linkHost(link) : null} />
        </PhoneFrame>
      }
      action={<PayButton problem={problem} onPay={onPay} />}
    />
  );
}
