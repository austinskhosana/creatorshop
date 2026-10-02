import Image from "next/image";
import type { CSSProperties } from "react";
import { UserIcon } from "@heroicons/react/24/solid";
import { PlatformIcon } from "@/components/atoms/PlatformIcon";
import { TerminalgraphShader } from "@/components/atoms/TerminalgraphShader";

export interface CreatorProfileCardData {
  name: string;
  handle: string;
  avatar: string;
  followers: string;
  bio: string;
  niches: string[];
  /** With a `url`, the pill links to that profile. */
  platforms: { name: string; handle: string; audience?: string; url?: string }[];
}

interface CreatorProfileCardProps {
  creator: CreatorProfileCardData;
  /** A preset or uploaded cover. Leave unset for the shader banner. */
  coverStyle?: CSSProperties | null;
  /** Disable the animated WebGL banner for off-screen/background cards to save GPU work. */
  showShader?: boolean;
  className?: string;
}

export default function CreatorProfileCard({ creator, coverStyle, showShader = true, className = "" }: CreatorProfileCardProps) {
  return (
    <section
      aria-labelledby={`profile-name-${creator.handle}`}
      className={`w-full overflow-hidden rounded-[32px] border border-neutral-200 bg-white p-3 sm:p-3.5 ${className}`}
    >
      <div className="relative h-36 overflow-hidden rounded-[24px] border border-neutral-200 bg-white sm:h-40 sm:rounded-[26px]">
        {coverStyle ? (
          <div className="absolute inset-0 size-full" style={coverStyle} />
        ) : showShader ? (
          <TerminalgraphShader
            theme="light"
            background={{ dark: "#052e12", light: "#ffffff" }}
            className="absolute inset-0 size-full"
          />
        ) : (
          <div className="absolute inset-0 size-full bg-gradient-to-br from-[#EDFFD0] to-white" />
        )}
      </div>

      <div className="relative mt-3.5 rounded-[24px] border border-neutral-200 bg-white px-5 pt-20 pb-5 sm:rounded-[26px] sm:px-7 sm:pt-[88px] sm:pb-6">
        {/* The white ring is padding on a wrapper, not a border on the clipping circle, which would
            let the photo's edge pixels leak past it. */}
        <div className="absolute -top-[58px] left-5 size-[104px] rounded-full bg-white p-[5px] shadow-sm sm:-top-16 sm:left-7 sm:size-[120px] sm:p-[6px]">
          <div className="relative size-full overflow-hidden rounded-full bg-neutral-100">
            <Image
              src={creator.avatar}
              alt={`${creator.name}'s profile photo`}
              fill
              sizes="(min-width: 640px) 120px, 104px"
              className="object-cover"
              draggable={false}
            />
          </div>
        </div>

        <div className="absolute top-4 right-4 inline-flex h-10 items-center gap-2 rounded-xl bg-neutral-100 px-3.5 text-sm font-medium text-neutral-900 sm:top-4 sm:right-4">
          <UserIcon aria-hidden="true" className="size-4" />
          <span>{creator.followers} Followers</span>
        </div>

        <div className="max-w-4xl">
          <h1 id={`profile-name-${creator.handle}`} className="text-[26px] font-bold tracking-[-0.035em] text-neutral-950 sm:text-2xl">
            {creator.name}
          </h1>
          <p className="mt-1 text-base tracking-[-0.025em] text-neutral-900 sm:text-lg">{creator.handle}</p>
          <p className="mt-4 max-w-4xl text-[15px] leading-6 text-neutral-500 sm:text-base sm:leading-6">{creator.bio}</p>
        </div>

        <div className="mt-6 sm:mt-5">
          <h2 className="text-lg font-bold tracking-tight text-neutral-900">Niches</h2>
          <ul className="mt-3 flex flex-wrap gap-2.5" aria-label={`${creator.name}'s niches`}>
            {creator.niches.map((niche) => (
              <li key={niche} className="rounded-xl bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 sm:min-w-24 sm:text-center">
                {niche}
              </li>
            ))}
          </ul>
        </div>

        {creator.platforms.length > 0 ? (
          <div className="mt-6">
            <h2 className="text-lg font-bold tracking-tight text-neutral-900">Socials</h2>
            <ul className="mt-3 flex flex-wrap gap-2.5" aria-label={`${creator.name}'s social profiles`}>
              {creator.platforms.map((platform) => {
                const content = (
                  <>
                    <PlatformIcon platform={platform.name} className="size-5" />
                    {platform.name}
                  </>
                );
                const pillClass = "inline-flex h-11 items-center gap-2.5 rounded-xl border border-neutral-300 bg-white px-4 text-sm font-medium text-neutral-900 shadow-[0_1px_2px_rgba(0,0,0,0.06)] sm:h-10 sm:px-3.5";
                return (
                  <li key={platform.name}>
                    {platform.url ? (
                      <a
                        href={platform.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${platform.name}: ${platform.handle} (opens in a new tab)`}
                        className={`${pillClass} transition-[background-color,border-color,transform] duration-150 hover:border-neutral-400 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 active:scale-[0.97]`}
                      >
                        {content}
                      </a>
                    ) : (
                      <span className={pillClass}>{content}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
