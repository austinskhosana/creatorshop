"use client";

import { ArrowUpTrayIcon, CameraIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import {
  BriefSection,
  BuilderFrame,
  captionProblem,
  CaptionField,
  defaultCaption,
  PayButton,
  PhoneFrame,
  PreviewNote,
  PreviewPill,
  SectionHeading,
  ShaderFill,
  type BuilderProps,
} from "./BuilderParts";
import { EmptyMedia, InstagramPost, TikTokFeed } from "./PlatformPreviews";

/** Images or short videos as one post; more than one slide makes it a carousel. Also the fallback layout. */
export default function CarouselBuilder({ shop, contentType, intro, onPay }: BuilderProps) {
  const platform = contentType.platform;
  const minSlides = contentType.range?.min ?? 1;
  const MAX_SLIDES = contentType.range?.max ?? 6;
  const [caption, setCaption] = useState(defaultCaption(shop));
  // Each entry is one carousel slide; more than one turns the post into a carousel.
  const [slides, setSlides] = useState<number[]>(minSlides > 1 ? [1, 2, 3] : [1]);
  const [active, setActive] = useState(0);
  const current = Math.min(active, Math.max(slides.length - 1, 0));
  const hasSlides = slides.length > 0;
  const problem = slides.length >= minSlides ? captionProblem(caption, contentType.textLimit) : `Add at least ${minSlides} ${minSlides === 1 ? "slide" : "slides"} to continue.`;

  function addSlide() {
    if (slides.length >= MAX_SLIDES) return;
    setSlides([...slides, Math.max(0, ...slides) + 1]);
    setActive(slides.length);
  }

  function removeSlide(index: number) {
    setSlides(slides.filter((_, i) => i !== index));
    setActive(Math.max(0, Math.min(index < current ? current - 1 : current, slides.length - 2)));
  }

  return (
    <BuilderFrame
      intro={intro}
      composer={
        <>
          <BriefSection />
          <CaptionField value={caption} onChange={setCaption} limit={contentType.textLimit} />
        <div className="mt-8">
          <SectionHeading icon={<CameraIcon className="size-3.5 text-black" />}>Creative</SectionHeading>
          <p className="mt-2 text-[13px] leading-5 text-neutral-500">Add the images or video that will accompany this post. Add more than one to make a carousel.</p>
          <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-3">
            {slides.map((id, index) => (
              <div
                key={id}
                className={`relative isolate aspect-[4/3] overflow-hidden rounded-xl border bg-[linear-gradient(135deg,#fafafa,#e5e5e5)] ${index === current ? "border-neutral-900 ring-1 ring-neutral-900" : "border-neutral-200"}`}
              >
                <button
                  type="button"
                  onClick={() => setActive(index)}
                  aria-label={`Show slide ${index + 1}`}
                  aria-pressed={index === current}
                  className="absolute inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-inset"
                />
                <span className="pointer-events-none absolute bottom-2 left-2 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-medium text-neutral-950 tabular-nums ring-1 ring-black/10">{index + 1}</span>
                <button
                  type="button"
                  onClick={() => removeSlide(index)}
                  aria-label={`Remove slide ${index + 1}`}
                  className="absolute top-2 right-2 z-10 grid size-6 place-items-center rounded-full bg-white/90 text-neutral-700 shadow-sm ring-1 ring-black/10 transition hover:bg-white hover:text-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
                >
                  <XMarkIcon className="size-3.5" strokeWidth={2} />
                </button>
              </div>
            ))}
            {slides.length < MAX_SLIDES ? (
              <button
                type="button"
                onClick={addSlide}
                className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-300 bg-neutral-50/60 text-center transition hover:border-neutral-500 hover:bg-neutral-50"
              >
                <span className="grid size-9 place-items-center rounded-full bg-white shadow-sm ring-1 ring-neutral-200">
                  <ArrowUpTrayIcon className="size-4 text-neutral-600" strokeWidth={2} />
                </span>
                <span className="text-[13px] font-medium text-neutral-500">{hasSlides ? "Add a slide" : "Upload your creative"}</span>
              </button>
            ) : null}
          </div>
        </div>
        </>
      }
      previewPill={<PreviewPill />}
      previewNote={<PreviewNote brand={shop.brand} />}
      preview={
        platform === "TikTok" ? (
          <PhoneFrame>
            {hasSlides ? <ShaderFill /> : <EmptyMedia dark />}
            <TikTokFeed caption={caption} brand={shop.brand} photos={hasSlides ? { count: slides.length, current, onSelect: setActive } : undefined} />
          </PhoneFrame>
        ) : (
          <InstagramPost caption={caption} brand={shop.brand} count={slides.length} current={current} onSelect={setActive}>
            {hasSlides ? <ShaderFill /> : <EmptyMedia />}
          </InstagramPost>
        )
      }
      action={<PayButton problem={problem} onPay={onPay} />}
    />
  );
}
