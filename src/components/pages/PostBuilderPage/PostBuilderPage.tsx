"use client";

import Link from "next/link";
import { ArrowUpTrayIcon, BanknotesIcon, CameraIcon, ChatBubbleBottomCenterTextIcon, CheckCircleIcon, ClipboardDocumentListIcon, PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import Button from "@/components/atoms/Button/Button";
import { TerminalgraphShader } from "@/components/atoms/TerminalgraphShader";
import { CreatorBreadcrumb } from "@/components/molecules/CreatorBreadcrumb";
import { CreatorShell } from "@/components/templates/CreatorShell";
import type { CreatorShop } from "@/lib/mock-creator";

function getPlatform(tier: string) {
  if (tier.startsWith("Instagram")) return "Instagram";
  if (tier.startsWith("YouTube")) return "YouTube";
  if (tier.startsWith("TikTok")) return "TikTok";
  return "X";
}

export default function PostBuilderPage({ shop }: { shop: CreatorShop }) {
  const platform = getPlatform(shop.tier);
  const [caption, setCaption] = useState(`I've been using ${shop.product} to make my creative work feel more focused. Here are a few things I'm loving so far. #ad`);
  const [hasCreative, setHasCreative] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <CreatorShell>
        <main className="mx-auto max-w-xl px-5 py-16 sm:py-24">
          <section className="rounded-[20px] border border-neutral-200 bg-white p-10 text-center sm:p-12">
            <span className="mx-auto grid size-14 place-items-center rounded-full bg-[#efffdc]">
              <CheckCircleIcon className="size-7 text-neutral-950" />
            </span>
            <p className="mt-6 text-[13px] font-medium text-neutral-400">Sent for review</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">Your post is with {shop.brand}.</h1>
            <p className="mt-3 text-sm leading-6 text-neutral-500">
              They&apos;ll review your {shop.tier.toLowerCase()} before your {shop.access} access to {shop.product} is unlocked.
            </p>
            <Link href="/shops" className="mt-8 inline-block">
              <Button>Back to My Shops</Button>
            </Link>
          </section>
        </main>
      </CreatorShell>
    );
  }

  return (
    <CreatorShell>
      <main className="px-5 py-8 sm:px-8 sm:py-12">
        <div className="flex justify-start">
          <CreatorBreadcrumb items={[{ label: "My Shops", href: "/shops" }, { label: shop.product }]} />
        </div>
        <header className="mx-auto mt-8 max-w-5xl text-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight">Upload your payment</h1>
            <p className="mt-3 text-sm text-neutral-500">
              Upload a draft of your post, then send it for approval.
            </p>
          </div>
        </header>
        <div className="mx-auto mt-10 grid max-w-5xl items-center gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
          <section className="h-fit rounded-[20px] border border-neutral-200 bg-white p-6 sm:p-8">
            <div className="border-b border-neutral-100 pb-8">
              <p className="flex items-center gap-2.5 text-base font-semibold"><span className="grid size-7 place-items-center rounded-lg border border-neutral-200 bg-white"><ClipboardDocumentListIcon className="size-3.5 text-neutral-600" /></span>Brief</p>
              <p className="mt-2 text-[13px] leading-5 text-neutral-500">This is a draft preview. Nothing is published from Creatorshop.</p>
            </div>
            <label className="mt-8 block">
              <span className="flex items-center gap-2.5 text-base font-semibold"><span className="grid size-7 place-items-center rounded-lg border border-neutral-200 bg-white"><ChatBubbleBottomCenterTextIcon className="size-3.5 text-neutral-600" /></span>Caption</span>
              <textarea
                value={caption}
                onChange={event => setCaption(event.target.value)}
                rows={6}
                className="mt-3 w-full resize-none rounded-xl border border-neutral-200 p-3.5 text-sm leading-6 font-normal text-neutral-700 outline-none focus:border-neutral-900"
              />
            </label>
            <div className="mt-8">
              <p className="flex items-center gap-2.5 text-base font-semibold"><span className="grid size-7 place-items-center rounded-lg border border-neutral-200 bg-white"><CameraIcon className="size-3.5 text-neutral-600" /></span>Creative</p>
              <p className="mt-2 text-[13px] leading-5 text-neutral-500">Add the images or video that will accompany this post.</p>
              <div className="mt-4 flex items-stretch gap-3">
                {hasCreative ? (
                  <div className="relative isolate aspect-[4/3] w-40 shrink-0 overflow-hidden rounded-xl border border-neutral-200 bg-white">
                    <TerminalgraphShader
                      theme="light"
                      background={{ dark: "#052e12", light: "#ffffff" }}
                      className="pointer-events-none absolute inset-0 size-full"
                    />
                    <button
                      type="button"
                      onClick={() => setHasCreative(false)}
                      aria-label="Remove uploaded creative"
                      className="absolute top-2 right-2 z-10 grid size-6 place-items-center rounded-full bg-white/90 text-neutral-700 shadow-sm ring-1 ring-black/10 transition hover:bg-white hover:text-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
                    >
                      <XMarkIcon className="size-3.5" strokeWidth={2} />
                    </button>
                  </div>
                ) : (
                  <div className="flex aspect-[4/3] w-40 shrink-0 flex-col items-center justify-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50/60 text-center">
                    <span className="grid size-11 place-items-center rounded-full bg-white shadow-sm ring-1 ring-neutral-200">
                      <PhotoIcon className="size-4.5 text-neutral-400" strokeWidth={2} />
                    </span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setHasCreative(true)}
                  className="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50/60 py-10 text-center transition hover:border-neutral-500 hover:bg-neutral-50"
                >
                  <span className="grid size-11 place-items-center rounded-full bg-white shadow-sm ring-1 ring-neutral-200">
                    <ArrowUpTrayIcon className="size-4.5 text-neutral-600" strokeWidth={2} />
                  </span>
                  <span className="text-sm font-medium text-neutral-500">Upload your creative</span>
                </button>
              </div>
            </div>
          </section>
          <aside className="h-fit rounded-[20px] bg-white p-5 sm:p-6">
            <div className="text-center">
              <p className="text-[15px] font-normal">Live preview</p>
              <p className="mt-1.5 text-[11px] leading-4 text-neutral-400">
                Paper reviews this draft before access is unlocked.
              </p>
            </div>
            <div className="mt-5 divide-y divide-neutral-200 overflow-hidden rounded-[16px] border border-neutral-200">
              <div className="flex items-center gap-2.5 px-4 py-3.5">
                <span className="grid size-8 place-items-center rounded-full bg-neutral-900 text-[10px] font-bold text-white">JL</span>
                <div>
                  <p className="text-xs font-semibold">jordanmakes</p>
                  <p className="text-[11px] text-neutral-400">{platform}</p>
                </div>
              </div>
              <div className="relative isolate grid aspect-square place-items-center overflow-hidden bg-white">
                {hasCreative ? (
                  <TerminalgraphShader
                    theme="light"
                    background={{ dark: "#052e12", light: "#ffffff" }}
                    className="pointer-events-none absolute inset-0 size-full"
                  />
                ) : (
                  <div className="grid size-full place-items-center bg-neutral-50/60">
                    <span className="grid size-11 place-items-center rounded-full bg-white shadow-sm ring-1 ring-neutral-200">
                      <PhotoIcon className="size-4.5 text-neutral-400" strokeWidth={2} />
                    </span>
                  </div>
                )}
              </div>
              <p className="line-clamp-4 px-4 py-3.5 text-xs leading-5 text-neutral-700">
                <strong className="font-semibold">jordanmakes </strong>{caption}
              </p>
            </div>
            <Button fullWidth variant="accent" className="mt-5 rounded-none" iconRight={<BanknotesIcon className="size-4" />} onClick={() => setSubmitted(true)}>
              Send payment
            </Button>
          </aside>
        </div>
      </main>
    </CreatorShell>
  );
}
