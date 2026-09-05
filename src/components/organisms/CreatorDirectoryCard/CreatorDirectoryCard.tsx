import Link from "next/link";

interface CreatorDirectoryCardProps {
  id: string;
  name: string;
  bio: string;
  niches: string[];
  coverColor: string;
  avatarUrl?: string | null;
}

export default function CreatorDirectoryCard({
  id,
  name,
  bio,
  niches,
  coverColor,
  avatarUrl,
}: CreatorDirectoryCardProps) {
  return (
    <div className="flex h-full flex-col gap-3 rounded-3xl border border-gray-200 bg-white p-3">
      <div className="flex justify-center pt-2">
        <div
          className="relative h-52 w-52 shrink-0 overflow-hidden rounded-[20px] ring-2 ring-black/10"
          style={{ backgroundColor: coverColor }}
        >
          {avatarUrl && (
            // eslint-disable-next-line @next/next/no-img-element -- faithful port of the prior build, not yet redesigned
            <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 px-1">
        {niches.slice(0, 2).map((niche) => (
          <span key={niche} className="rounded-xl bg-[#EDFFD0] px-4 py-1.5 text-[13px] font-medium text-[#3A7A00]">
            {niche}
          </span>
        ))}
      </div>

      <div className="flex flex-1 flex-col gap-1 px-1">
        <p className="text-[18px] font-bold leading-snug text-neutral-900">{name}</p>
        <p className="line-clamp-2 text-[14px] leading-snug text-gray-400">{bio}</p>
      </div>

      <Link
        href={`/influencers/${id}`}
        className="w-full rounded-xl bg-neutral-900 py-3 text-center text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] transition-opacity hover:opacity-90"
      >
        View Profile
      </Link>
    </div>
  );
}
