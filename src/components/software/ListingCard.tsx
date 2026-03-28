import Link from "next/link";
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
  return (
    <div className="card-shine flex flex-col rounded-3xl border border-gray-200 bg-white p-3 gap-3 h-full">

      {/* ── Logo area — inset rounded rectangle ── */}
      <div className="flex items-center justify-center h-36 bg-gray-100 rounded-2xl">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={name}
            className="w-20 h-20 object-contain"
          />
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-gray-200 flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-400">{name[0]}</span>
          </div>
        )}
      </div>

      {/* ── Info ── */}
      <div className="flex flex-col gap-2 px-1 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-lg font-semibold text-neutral-900 leading-snug">{name}</p>
          <Badge
            variant="count"
            label={`${postsRequired} ${postsRequired === 1 ? "post" : "posts"}`}
          />
        </div>

        <p className="text-sm text-gray-400 leading-snug">
          Get {months} {months === 1 ? "month" : "months"} of {name} {planName}
        </p>
      </div>

      {/* ── Button ── */}
      <Link
        href={`/software/${slug}`}
        className="w-full bg-neutral-900 text-white text-sm font-semibold text-center py-3 rounded-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] hover:opacity-90 transition-opacity"
      >
        View Brief
      </Link>

    </div>
  );
}
