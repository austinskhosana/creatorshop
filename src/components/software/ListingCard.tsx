import Link from "next/link";
import Image from "next/image";
import Badge from "@/components/ui/Badge";

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
    <article className="card-shine flex flex-col rounded-3xl border border-gray-200 bg-white p-3 gap-3 h-full">

      <div
        className="relative flex items-center justify-center h-36 rounded-2xl border border-[#EFEFEF] overflow-hidden"
        style={{ background: "radial-gradient(ellipse at 0% 0%, rgba(163,255,56,0.32) 0%, #ffffff 65%)" }}
      >
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt={`${name} logo`}
            width={80}
            height={80}
            className="object-contain"
          />
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-gray-200 flex items-center justify-center" aria-hidden="true">
            <span className="text-2xl font-bold text-gray-400">{name[0]}</span>
          </div>
        )}
        {noSlots && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-2xl">
            <span className="text-xs font-semibold text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
              Full
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 px-1 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-lg font-semibold text-neutral-900 leading-snug truncate">{name}</p>
          <Badge
            variant="count"
            label={`${postsRequired} ${postsRequired === 1 ? "post" : "posts"}`}
          />
        </div>
        <p className="text-sm text-gray-400 leading-snug">
          Get {months} {months === 1 ? "month" : "months"} of {name} {planName}
        </p>
      </div>

      <Link
        href={noSlots ? "#" : `/software/${slug}`}
        aria-disabled={noSlots}
        tabIndex={noSlots ? -1 : undefined}
        className={[
          "w-full text-sm font-semibold text-center py-3 rounded-xl transition-opacity",
          noSlots
            ? "bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none"
            : "bg-neutral-900 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] hover:opacity-90",
        ].join(" ")}
      >
        {noSlots ? "No slots" : "View Brief"}
      </Link>

    </article>
  );
}
