import Link from "next/link";
import Badge from "@/components/ui/Badge";

interface ListingCardProps {
  slug: string;
  name: string;
  logoUrl?: string | null;
  tagline?: string | null;
  planName: string;
  slotsRemaining: number;
  category?: string | null;
}

export default function ListingCard({
  slug,
  name,
  logoUrl,
  tagline,
  planName,
  slotsRemaining,
}: ListingCardProps) {
  return (
    <div className="flex flex-col rounded-2xl border border-gray-200 overflow-hidden bg-white">

      {/* ── Logo area ── */}
      <div className="flex items-center justify-center h-44 bg-gray-50">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={name}
            className="w-20 h-20 object-contain"
          />
        ) : (
          <div className="w-20 h-20 rounded-2xl bg-gray-200 flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-400">
              {name[0]}
            </span>
          </div>
        )}
      </div>

      {/* ── Info ── */}
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-neutral-900 leading-snug">{name}</p>
            <p className="text-xs text-gray-400 mt-0.5">{planName}</p>
          </div>
          <Badge
            variant="count"
            label={`${slotsRemaining} slot${slotsRemaining !== 1 ? "s" : ""}`}
          />
        </div>

        {tagline && (
          <p className="text-sm text-gray-400 leading-snug line-clamp-2">{tagline}</p>
        )}

        <Link
          href={`/software/${slug}`}
          className="w-full bg-neutral-900 text-white text-sm font-semibold text-center py-2.5 rounded-xl hover:opacity-90 transition-opacity"
        >
          View Listing
        </Link>
      </div>

    </div>
  );
}
