import {
  ArrowPathRoundedSquareIcon,
  BookmarkIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  EllipsisHorizontalIcon,
  HeartIcon,
  MegaphoneIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import type { Listing } from "@/lib/listings/types";

const REFERENCE_POSTS = [
  {
    author: "Meng To",
    handle: "@MengTo",
    avatar: "/creators/meng-to.png",
    copy: "I took a loose sketch from this morning and made it into a real page before lunch. Paper is absurdly good at closing the gap between idea and live link.",
    timestamp: "11:46 AM · Sep 17, 2026",
    views: "12.4K",
    replies: 42,
    reposts: 11,
    likes: 178,
  },
  {
    author: "Easlo",
    handle: "@heyeaslo",
    avatar: "/creators/easlo.jpg",
    copy: "The best part: I didn’t have to rebuild the design when it was time to ship. The canvas is the website.",
    timestamp: "10:18 AM · Sep 17, 2026",
    views: "8,902",
    replies: 28,
    reposts: 6,
    likes: 94,
  },
  {
    author: "Darius Dan",
    handle: "@dariusdan",
    avatar: "/creators/darius-dan.jpg",
    copy: "If your notes are full of half-made landing pages, try taking one all the way through in Paper. Link in bio.",
    timestamp: "9:03 AM · Sep 17, 2026",
    views: "6,315",
    replies: 19,
    reposts: 4,
    likes: 67,
  },
];

function ActionRow({ replies, reposts, likes }: Pick<(typeof REFERENCE_POSTS)[number], "replies" | "reposts" | "likes">) {
  return (
    <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-4 text-[11px] font-medium text-neutral-400">
      <span className="inline-flex items-center gap-1.5"><ChatBubbleOvalLeftEllipsisIcon className="h-3.5 w-3.5" /> {replies}</span>
      <span className="inline-flex items-center gap-1.5"><ArrowPathRoundedSquareIcon className="h-3.5 w-3.5" /> {reposts}</span>
      <span className="inline-flex items-center gap-1.5"><HeartIcon className="h-3.5 w-3.5" /> {likes}</span>
      <BookmarkIcon className="h-3.5 w-3.5" />
      <ShareIcon className="h-3.5 w-3.5" />
    </div>
  );
}

export default function CampaignReferences({ listing }: { listing: Listing }) {
  const name = listing.brandName || listing.title;

  return (
    <aside aria-labelledby="campaign-references-heading" className="mx-auto flex w-full max-w-[460px] flex-col items-start">
      <p className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-[11px] font-medium tracking-[0.08em] text-neutral-700">
        <MegaphoneIcon aria-hidden="true" className="h-3.5 w-3.5" />
        Campaign references
      </p>
      <h2 id="campaign-references-heading" className="mt-2 text-[22px] font-semibold tracking-[-0.025em] text-neutral-950">
        What great looks like
      </h2>
      <p className="mt-2 max-w-md text-[14px] leading-[1.55] text-neutral-500">
        Realistic post examples that clarify the voice, pace, and product story without prescribing an exact script.
      </p>

      <div className="mt-6 w-full space-y-3 text-left">
        {REFERENCE_POSTS.map((post) => (
          <article key={post.timestamp} className="rounded-[16px] border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <Image src={post.avatar} alt={`${post.author} profile photo`} width={40} height={40} className="h-10 w-10 shrink-0 rounded-full object-cover" />
                <div className="min-w-0">
                  <p className="flex min-w-0 items-center gap-1 truncate text-[14px] font-semibold text-neutral-900">
                    <span className="truncate">{post.author}</span>
                    <CheckBadgeIcon aria-label="Verified" className="h-4 w-4 shrink-0 text-sky-500" />
                  </p>
                  <p className="text-[12px] text-neutral-400">{post.handle}</p>
                </div>
              </div>
              <EllipsisHorizontalIcon aria-label="More post options" className="h-5 w-5 shrink-0 text-neutral-400" />
            </div>

            <p className="mt-4 text-[14px] leading-[1.45] text-neutral-800">{post.copy.replaceAll("Paper", name)}</p>
            <p className="mt-4 text-[12px] text-neutral-400">{post.timestamp} · <span className="font-medium text-neutral-500">{post.views} Views</span></p>
            <ActionRow replies={post.replies} reposts={post.reposts} likes={post.likes} />
          </article>
        ))}
      </div>
    </aside>
  );
}
