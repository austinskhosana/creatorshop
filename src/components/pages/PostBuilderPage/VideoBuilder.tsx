"use client";

import { ArrowUpTrayIcon, CameraIcon, PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
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
  type BuilderProps,
  VideoFill,
} from "./BuilderParts";
import { EmptyMedia, ReelsFeed, TikTokFeed } from "./PlatformPreviews";

function EmptyFrame() {
  return (
    <div className="grid size-full place-items-center bg-neutral-50/60">
      <span className="grid size-11 place-items-center rounded-full bg-white shadow-sm ring-1 ring-neutral-200">
        <PhotoIcon className="size-4.5 text-neutral-400" strokeWidth={2} />
      </span>
    </div>
  );
}

/** One vertical (9:16) video — TikTok videos and Instagram Reels. */
export default function VideoBuilder({ shop, contentType, intro, onPay }: BuilderProps) {
  const [caption, setCaption] = useState(defaultCaption(shop));
  const [hasVideo, setHasVideo] = useState(true);
  const problem = hasVideo ? captionProblem(caption, contentType.textLimit) : "Add a video to continue.";

  return (
    <BuilderFrame
      intro={intro}
      composer={
        <>
          <BriefSection />
          <CaptionField value={caption} onChange={setCaption} limit={contentType.textLimit} />
          <div className="mt-8">
            <SectionHeading icon={<CameraIcon className="size-3.5 text-black" />}>Video</SectionHeading>
            <p className="mt-2 text-[13px] leading-5 text-neutral-500">Add one vertical video (9:16). It should match what you&apos;ll post on {contentType.platform}.</p>
            <div className="mt-4 flex items-stretch gap-3">
              {hasVideo ? (
                <div className="relative isolate aspect-[9/16] w-24 shrink-0 overflow-hidden rounded-xl border border-neutral-200 bg-white">
                  <VideoFill playing={false} />
                  <button
                    type="button"
                    onClick={() => setHasVideo(false)}
                    aria-label="Remove uploaded video"
                    className="absolute top-2 right-2 z-10 grid size-6 place-items-center rounded-full bg-white/90 text-neutral-700 shadow-sm ring-1 ring-black/10 transition hover:bg-white hover:text-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
                  >
                    <XMarkIcon className="size-3.5" strokeWidth={2} />
                  </button>
                </div>
              ) : (
                <div className="aspect-[9/16] w-24 shrink-0 rounded-xl border border-neutral-200 bg-neutral-50/60">
                  <EmptyFrame />
                </div>
              )}
              <button
                type="button"
                onClick={() => setHasVideo(true)}
                className="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50/60 py-10 text-center transition hover:border-neutral-500 hover:bg-neutral-50"
              >
                <span className="grid size-11 place-items-center rounded-full bg-white shadow-sm ring-1 ring-neutral-200">
                  <ArrowUpTrayIcon className="size-4.5 text-neutral-600" strokeWidth={2} />
                </span>
                <span className="text-sm font-medium text-neutral-500">Upload your video</span>
              </button>
            </div>
          </div>
        </>
      }
      previewPill={<PreviewPill />}
      previewNote={<PreviewNote brand={shop.brand} />}
      preview={
        <PhoneFrame>
          {hasVideo ? <VideoFill /> : <EmptyMedia dark />}
          {contentType.platform === "TikTok" ? (
            <TikTokFeed caption={caption} brand={shop.brand} />
          ) : (
            <ReelsFeed caption={caption} brand={shop.brand} />
          )}
        </PhoneFrame>
      }
      action={<PayButton problem={problem} onPay={onPay} />}
    />
  );
}
