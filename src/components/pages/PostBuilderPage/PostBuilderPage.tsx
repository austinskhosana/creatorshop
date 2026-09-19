"use client";

import Image from "next/image";
import Link from "next/link";
import { BanknotesIcon, CameraIcon, ChatBubbleBottomCenterTextIcon, CheckCircleIcon, ClipboardDocumentListIcon, EyeIcon, PhotoIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import Button from "@/components/atoms/Button/Button";
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
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <CreatorShell>
        <main className="mx-auto max-w-xl px-5 py-16 sm:py-24">
          <section className="rounded-[20px] border border-neutral-200 bg-white p-8 text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-full bg-[#efffdc]">
              <CheckCircleIcon className="size-7 text-neutral-950" />
            </span>
            <p className="mt-6 text-[13px] font-medium text-neutral-400">Sent for review</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">Your post is with {shop.brand}.</h1>
            <p className="mt-3 text-sm leading-6 text-neutral-500">
              They'll review your {shop.tier.toLowerCase()} before your {shop.access} access to {shop.product} is unlocked.
            </p>
            <Link href="/shops" className="mt-7 inline-block">
              <Button>Back to My Shops</Button>
            </Link>
          </section>
        </main>
      </CreatorShell>
    );
  }

  return (
    <CreatorShell>
      <main className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-12">
        <CreatorBreadcrumb items={[{ label: "My Shops", href: "/shops" }, { label: shop.product }]} />
        <header className="mt-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Build your {platform} post</h1>
            <p className="mt-2 text-sm text-neutral-500">
              Create the {shop.tier.toLowerCase()} for {shop.brand}, then send it for approval.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-3 py-2">
            <Image src={shop.logo} alt="" width={32} height={32} className="size-8 rounded-lg object-contain" />
            <div>
              <p className="text-sm font-semibold">{shop.product}</p>
              <p className="text-xs tabular-nums text-neutral-500">Due {shop.deadline}</p>
            </div>
          </div>
        </header>
        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="rounded-[20px] border border-neutral-200 bg-white p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-5">
              <div>
                <p className="flex items-center gap-2 text-[15px] font-semibold"><ClipboardDocumentListIcon className="size-4 text-neutral-400" />Post details</p>
                <p className="mt-1.5 text-xs leading-5 text-neutral-500">This is a draft preview. Nothing is published from Creatorshop.</p>
              </div>
              <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium">{platform}</span>
            </div>
            <label className="mt-7 block text-[15px] font-semibold">
              <span className="flex items-center gap-2"><ChatBubbleBottomCenterTextIcon className="size-4 text-neutral-400" />Caption</span>
              <textarea
                value={caption}
                onChange={event => setCaption(event.target.value)}
                rows={6}
                className="mt-3 w-full resize-none rounded-xl border border-neutral-200 p-3 text-sm leading-6 font-normal text-neutral-700 outline-none focus:border-neutral-900"
              />
            </label>
            <div className="mt-8">
              <p className="flex items-center gap-2 text-[15px] font-semibold"><CameraIcon className="size-4 text-neutral-400" />Creative</p>
              <p className="mt-1.5 text-xs leading-5 text-neutral-500">Add the images or video that will accompany this post.</p>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="grid aspect-square place-items-center rounded-xl border border-neutral-200 bg-white">
                  <PhotoIcon className="size-6 text-neutral-300" />
                </div>
                <button type="button" className="grid aspect-square place-items-center rounded-xl border border-dashed border-neutral-300 text-neutral-400 transition hover:border-neutral-500 hover:text-neutral-700">
                  <span className="grid size-9 place-items-center rounded-full bg-neutral-100">
                    <PlusIcon className="size-4" />
                  </span>
                </button>
                <button type="button" className="grid aspect-square place-items-center rounded-xl border border-dashed border-neutral-300 text-neutral-400 transition hover:border-neutral-500 hover:text-neutral-700">
                  <PhotoIcon className="size-5" />
                </button>
              </div>
            </div>
          </section>
          <aside className="h-fit rounded-[20px] bg-white p-4">
            <p className="flex items-center gap-2 text-[15px] font-semibold"><EyeIcon className="size-4 text-neutral-400" />Live preview</p>
            <div className="mt-4 overflow-hidden rounded-[16px] border border-neutral-200">
              <div className="flex items-center gap-2 p-3">
                <span className="grid size-8 place-items-center rounded-full bg-neutral-900 text-[10px] font-bold text-white">JL</span>
                <div>
                  <p className="text-xs font-semibold">jordanmakes</p>
                  <p className="text-[11px] text-neutral-400">{platform}</p>
                </div>
              </div>
              <div className="flex aspect-square flex-col items-center justify-center gap-3 bg-white">
                <PhotoIcon className="size-8 text-neutral-300" />
                <div className="flex flex-col items-center gap-1.5">
                  <span className="block h-1.5 w-16 rounded-full bg-neutral-100" />
                  <span className="block h-1.5 w-10 rounded-full bg-neutral-100" />
                </div>
              </div>
              <p className="line-clamp-4 p-3 text-xs leading-5 text-neutral-700">
                <strong className="font-semibold">jordanmakes </strong>{caption}
              </p>
            </div>
            <Button fullWidth variant="accent" className="mt-4 rounded-md" iconRight={<BanknotesIcon className="size-4" />} onClick={() => setSubmitted(true)}>
              Send payment
            </Button>
            <p className="mt-3 text-center text-[11px] leading-4 text-neutral-400">
              {shop.brand} reviews this draft before access is unlocked.
            </p>
          </aside>
        </div>
      </main>
    </CreatorShell>
  );
}
