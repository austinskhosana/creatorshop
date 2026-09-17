"use client";

import Image from "next/image";
import Link from "next/link";
import { PencilSquareIcon, UserIcon } from "@heroicons/react/24/solid";
import { TerminalgraphShader } from "@/components/atoms/TerminalgraphShader";
import { CreatorShell } from "@/components/templates/CreatorShell";
import { CREATOR } from "@/lib/mock-creator";

function InstagramIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-5">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.4" cy="6.7" r="1" fill="currentColor" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="size-5">
      <path d="M14.4 3c.2 1.7 1.15 3.15 2.55 4.05A6.6 6.6 0 0 0 20 8v3.05a9.55 9.55 0 0 1-5.55-1.8v6.1a5.35 5.35 0 1 1-4.6-5.3v3.08a2.36 2.36 0 1 0 1.55 2.22V3h3Z" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="size-5">
      <path d="M21.6 7.2a2.9 2.9 0 0 0-2.05-2.05C17.75 4.65 12 4.65 12 4.65s-5.75 0-7.55.5A2.9 2.9 0 0 0 2.4 7.2 30 30 0 0 0 1.9 12a30 30 0 0 0 .5 4.8 2.9 2.9 0 0 0 2.05 2.05c1.8.5 7.55.5 7.55.5s5.75 0 7.55-.5a2.9 2.9 0 0 0 2.05-2.05 30 30 0 0 0 .5-4.8 30 30 0 0 0-.5-4.8ZM10 15.15v-6.3L15.45 12 10 15.15Z" />
    </svg>
  );
}

const SOCIAL_ICONS = {
  Instagram: <InstagramIcon />,
  TikTok: <TikTokIcon />,
  YouTube: <YoutubeIcon />,
} as const;

export default function CreatorProfilePage() {
  return (
    <CreatorShell>
      <main className="relative min-h-screen w-full px-4 py-6 sm:px-5 sm:py-8">
        <div className="absolute top-6 right-4 left-4 z-10 mx-auto flex max-w-[760px] justify-end sm:top-8 sm:right-5 sm:left-5">
          <Link
            href="/settings"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 text-sm font-semibold text-neutral-900 transition-[background-color,border-color,transform] duration-150 hover:border-neutral-300 hover:bg-neutral-50 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          >
            <PencilSquareIcon aria-hidden="true" className="size-4" />
            Edit profile
          </Link>
        </div>

        <div className="flex min-h-[calc(100vh-3rem)] w-full items-center justify-center sm:min-h-[calc(100vh-4rem)]">
          <section
            aria-labelledby="profile-name"
            className="w-full max-w-[760px] overflow-hidden rounded-[28px] border border-neutral-200 bg-white p-3 sm:p-4"
          >
            <div className="relative h-44 overflow-hidden rounded-[20px] border border-neutral-200 bg-white sm:h-[190px] sm:rounded-[22px]">
              <TerminalgraphShader
                theme="light"
                background={{ dark: "#052e12", light: "#ffffff" }}
                className="absolute inset-0 size-full"
              />
            </div>

            <div className="relative mt-4 rounded-[20px] border border-neutral-200 bg-white px-5 pt-24 pb-7 sm:rounded-[22px] sm:px-8 sm:pt-[108px] sm:pb-8">
              <div className="absolute -top-[68px] left-5 size-[116px] overflow-hidden rounded-full bg-neutral-100 ring-[5px] ring-white sm:-top-[76px] sm:left-8 sm:size-[140px] sm:ring-[6px]">
                <Image
                  src={CREATOR.avatar}
                  alt={`${CREATOR.name}'s profile photo`}
                  fill
                  priority
                  sizes="(min-width: 640px) 140px, 116px"
                  className="object-cover"
                />
              </div>

              <div className="absolute top-4 right-4 inline-flex h-11 items-center gap-2 rounded-xl bg-neutral-100 px-3.5 text-sm font-medium text-neutral-900 sm:top-[18px] sm:right-[18px] sm:h-11 sm:px-4 sm:text-base">
                <UserIcon aria-hidden="true" className="size-4" />
                <span>{CREATOR.followers} Followers</span>
              </div>

              <div className="max-w-4xl">
                <h1 id="profile-name" className="text-[28px] font-bold tracking-[-0.035em] text-neutral-950 sm:text-[26px]">
                  {CREATOR.name}
                </h1>
                <p className="mt-1 text-lg tracking-[-0.025em] text-neutral-900 sm:text-xl">{CREATOR.handle}</p>
                <p className="mt-5 max-w-4xl text-[16px] leading-7 text-neutral-500 sm:mt-4 sm:text-[17px] sm:leading-7">
                  {CREATOR.bio}
                </p>
              </div>

              <div className="mt-8 sm:mt-6">
                <h2 className="text-lg font-bold tracking-tight text-neutral-900 sm:text-xl">Niches</h2>
                <ul className="mt-4 flex flex-wrap gap-2.5 sm:mt-4 sm:gap-3" aria-label="Creator niches">
                  {CREATOR.niches.map((niche) => (
                    <li key={niche} className="rounded-xl bg-neutral-100 px-5 py-2.5 text-sm font-medium text-neutral-900 sm:min-w-28 sm:px-5 sm:py-2.5 sm:text-center sm:text-base">
                      {niche}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 sm:mt-7">
                <h2 className="text-lg font-bold tracking-tight text-neutral-900 sm:text-xl">Socials</h2>
                <ul className="mt-4 flex flex-wrap gap-2.5 sm:mt-4 sm:gap-3" aria-label="Creator social profiles">
                  {CREATOR.platforms.map((platform) => (
                    <li
                      key={platform.name}
                      className="inline-flex h-11 items-center gap-2.5 rounded-xl border border-neutral-300 bg-white px-4 text-sm font-medium text-neutral-900 shadow-[0_1px_2px_rgba(0,0,0,0.06)] sm:h-10 sm:px-3.5"
                    >
                      {SOCIAL_ICONS[platform.name as keyof typeof SOCIAL_ICONS]}
                      {platform.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </div>
      </main>
    </CreatorShell>
  );
}
