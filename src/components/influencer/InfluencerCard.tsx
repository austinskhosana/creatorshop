import Link from "next/link";

interface InfluencerCardProps {
  id: string;
  name: string;
  bio: string;
  niches: string[];
  coverColor: string;
  avatarUrl?: string | null;
}

export default function InfluencerCard({
  id,
  name,
  bio,
  niches,
  coverColor,
  avatarUrl,
}: InfluencerCardProps) {
  return (
    <div className="card-shine flex flex-col rounded-3xl border border-gray-200 bg-white p-3 gap-3 h-full">

      {/* ── Cover image ── */}
      <div className="flex justify-center pt-2">
        <div
          className="relative h-52 w-52 shrink-0 overflow-hidden rounded-[20px] ring-2 ring-black/10"
          style={{ backgroundColor: coverColor }}
        >
          {avatarUrl && (
            <img
              src={avatarUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </div>

      {/* ── Niche tags ── */}
      <div className="flex flex-wrap gap-2 px-1">
        {niches.slice(0, 2).map((niche) => (
          <span
            key={niche}
            className="px-4 py-1.5 rounded-xl bg-[#EDFFD0] text-[#3A7A00] text-[13px] font-medium"
          >
            {niche}
          </span>
        ))}
      </div>

      {/* ── Info ── */}
      <div className="flex flex-col gap-1 px-1 flex-1">
        <p className="text-[18px] font-bold text-neutral-900 leading-snug">{name}</p>
        <p className="text-[14px] text-gray-400 leading-snug line-clamp-2">{bio}</p>
      </div>

      {/* ── Button ── */}
      <Link
        href={`/influencers/${id}`}
        className="w-full bg-neutral-900 text-white text-sm font-semibold text-center py-3 rounded-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] hover:opacity-90 transition-opacity"
      >
        View Profile
      </Link>

    </div>
  );
}
