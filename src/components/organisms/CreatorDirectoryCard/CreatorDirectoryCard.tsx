import Link from "next/link";
import { StarIcon } from "@heroicons/react/24/solid";
import { UserIcon } from "@heroicons/react/24/outline";
import Avatar from "@/components/atoms/Avatar/Avatar";
import Badge from "@/components/atoms/Badge/Badge";
import PlatformIcon from "@/components/atoms/PlatformIcon/PlatformIcon";

interface CreatorDirectoryCardProps {
  href: string;
  name: string;
  handle: string;
  avatar?: string;
  bio: string;
  niches: string[];
  platforms: string[];
  /** Self-reported total, already compact: "64.8K". */
  audience: string;
  rating: number | null;
  completedShops: number;
}

/**
 * A creator in the brand's directory — the shop's ListingCard geometry, with a person in place of
 * a product. Discovery only: no notes, tags, or private counts.
 */
export default function CreatorDirectoryCard({ href, name, handle, avatar, bio, niches, platforms, audience, rating, completedShops }: CreatorDirectoryCardProps) {
  return (
    <article className="relative flex h-full min-h-[260px] flex-col rounded-[20px] border border-neutral-200 bg-white p-4 transition-[border-color] duration-150 has-[a:hover]:border-neutral-300">
      <div className="flex items-start justify-between gap-3">
        <Avatar src={avatar} name={name} size="xl" className="size-[52px] border-neutral-200 ring-0" />
        <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium tabular-nums text-neutral-900">
          <UserIcon aria-hidden="true" className="size-3.5" />
          {audience}
        </span>
      </div>

      <div className="mt-auto pt-5">
        <Link
          href={href}
          className="rounded-sm text-[16px] leading-snug font-semibold tracking-[-0.025em] text-neutral-950 after:absolute after:inset-0 after:rounded-[20px] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-neutral-900"
        >
          {name}
        </Link>
        <p className="text-[13px] text-neutral-500">@{handle}</p>
        <p className="mt-2 line-clamp-2 text-pretty text-[13px] leading-[1.55] text-neutral-500">{bio}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {niches.slice(0, 2).map((niche) => (
            <Badge key={niche} variant="tag" label={niche} />
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-neutral-100 pt-3">
        <div className="flex items-center gap-2 text-neutral-500" aria-label={`On ${platforms.join(", ")}`}>
          {platforms.map((platform) => (
            <PlatformIcon key={platform} platform={platform} className="size-4" />
          ))}
        </div>
        <p className="flex items-center gap-1 text-xs text-neutral-500">
          {rating !== null ? (
            <>
              <StarIcon aria-hidden="true" className="size-3.5 text-neutral-900" />
              <span className="font-semibold tabular-nums text-neutral-900">{rating.toFixed(1)}</span>
              <span aria-hidden="true">·</span>
            </>
          ) : null}
          <span className="tabular-nums">{completedShops}</span> {completedShops === 1 ? "shop" : "shops"}
        </p>
      </div>
    </article>
  );
}
