"use client";

import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState } from "react";
import { PrintedReceipt } from "@/components/organisms/PrintedReceipt";
import { CreatorShell } from "@/components/templates/CreatorShell";
import { CONTENT_TYPES, resolveContentType, type ContentTypeId } from "@/lib/content-types";
import type { CreatorShop } from "@/lib/mock-creator";
import CarouselBuilder from "./CarouselBuilder";
import StoryBuilder from "./StoryBuilder";
import ThreadBuilder from "./ThreadBuilder";
import VideoBuilder from "./VideoBuilder";

/**
 * The post builder. What the creator pays with decides the layout: a video for
 * TikTok videos and Reels, a slide strip for carousels, story frames and
 * stickers for Stories, a multi-post composer for X threads. This step is only
 * the draft, which the brand approves. Proof of payment comes later, from My
 * Shops. `contentTypeId` overrides the shop's own type, for previewing.
 */
export default function PostBuilderPage({ shop, contentTypeId }: { shop: CreatorShop; contentTypeId?: ContentTypeId }) {
  const contentType = contentTypeId ? CONTENT_TYPES[contentTypeId] : resolveContentType(shop.tier);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <CreatorShell>
        <PrintedReceipt
          title="Draft receipt"
          statusLabels={{ processing: "Sending your draft", printing: "Printing your receipt", complete: "Draft sent for review" }}
          screenLabel="Draft"
          screenValue={`1 post · $${shop.value}`}
          items={[shop]}
          paidWith="To be paid with a post."
          reviewTitle="Draft in review"
          reviewNote={`${shop.brand} reviews your draft first. Once it's approved, post it yourself and add your proof of payment in My Shops.`}
          backHref="/shops"
        />
      </CreatorShell>
    );
  }

  const intro = (
    <>
      <Link
        href="/shops"
        aria-label="Back to My Shops"
        className="grid size-10 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-950 outline-none transition-[background-color,border-color,transform] duration-150 hover:bg-neutral-50 active:scale-[0.96] focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2"
      >
        <ChevronLeftIcon aria-hidden="true" className="size-5" strokeWidth={2} />
      </Link>
      <header className="mt-8">
        <h1 className="text-4xl font-bold tracking-tight">Upload your draft</h1>
        <p className="mt-3 text-sm text-neutral-500">Upload a draft of your post, then send it for approval.</p>
      </header>
    </>
  );
  const builderProps = { shop, contentType, intro, onPay: () => setSubmitted(true) };

  return (
    <CreatorShell>
      {contentType.layout === "video" ? <VideoBuilder {...builderProps} /> : null}
      {contentType.layout === "story" ? <StoryBuilder {...builderProps} /> : null}
      {contentType.layout === "thread" ? <ThreadBuilder {...builderProps} /> : null}
      {contentType.layout === "carousel" ? <CarouselBuilder {...builderProps} /> : null}
    </CreatorShell>
  );
}
