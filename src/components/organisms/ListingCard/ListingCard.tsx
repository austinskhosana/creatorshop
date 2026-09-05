import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/atoms/Badge";

interface ListingCardProps {
  slug: string;
  name: string;
  logoUrl?: string | null;
  planName: string;
  months: number;
  postsRequired: number;
  slotsRemaining: number;
  category?: string | null;
}

export default function ListingCard({
  slug,
  name,
  logoUrl,
  planName,
  months,
  postsRequired,
  slotsRemaining,
}: ListingCardProps) {
  const noSlots = slotsRemaining === 0;

  return (
    <article className="flex h-full flex-col gap-3 rounded-3xl border border-gray-200 bg-white p-3">
      <div
        className="relative flex h-36 items-center justify-center overflow-hidden rounded-2xl border border-[#EFEFEF]"
        style={{ background: "radial-gradient(ellipse at 0% 0%, rgba(163,255,56,0.32) 0%, #ffffff 65%)" }}
      >
        {logoUrl ? (
          <Image src={logoUrl} alt={`${name} logo`} width={80} height={80} className="object-contain" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-200" aria-hidden="true">
            <span className="text-2xl font-bold text-gray-400">{name[0]}</span>
          </div>
        )}
        {noSlots && (
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/60">
            <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-500">
              Full
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 px-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-lg font-semibold leading-snug text-neutral-900">{name}</p>
          <Badge variant="count" label={`${postsRequired} ${postsRequired === 1 ? "post" : "posts"}`} />
        </div>
        <p className="text-sm leading-snug text-gray-400">
          Get {months} {months === 1 ? "month" : "months"} of {name} {planName}
        </p>
      </div>

      <Link
        href={noSlots ? "#" : `/software/${slug}`}
        aria-disabled={noSlots}
        tabIndex={noSlots ? -1 : undefined}
        className={[
          "w-full rounded-xl py-3 text-center text-sm font-semibold transition-opacity",
          noSlots
            ? "pointer-events-none cursor-not-allowed bg-gray-100 text-gray-400"
            : "bg-neutral-900 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] hover:opacity-90",
        ].join(" ")}
      >
        {noSlots ? "No slots" : "View Brief"}
      </Link>
    </article>
  );
}
