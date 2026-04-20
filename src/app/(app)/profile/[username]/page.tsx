import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

const SOCIAL_PLATFORMS = [
  { key: "instagramUrl", label: "Instagram" },
  { key: "tiktokUrl",    label: "TikTok" },
  { key: "youtubeUrl",   label: "YouTube" },
  { key: "twitterUrl",   label: "X / Twitter" },
  { key: "linkedinUrl",  label: "LinkedIn" },
] as const;

export default async function PublicCreatorProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const user = await prisma.user.findUnique({
    where: { id: username },
    include: { creatorProfile: true },
  });

  if (!user?.creatorProfile) notFound();

  const p = user.creatorProfile;

  const socials = SOCIAL_PLATFORMS.filter(({ key }) => !!p[key]);

  return (
    <div className="min-h-full p-8 pb-24 flex flex-col">

      {/* ── Back ── */}
      <Link
        href="/explore"
        className="inline-flex items-center gap-2 text-[14px] text-gray-400 hover:text-gray-700 transition-colors duration-[120ms] mb-8 w-fit"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
        </svg>
        Back
      </Link>

      <div className="max-w-2xl mx-auto w-full flex flex-col gap-5">

        {/* ── Profile card ── */}
        <div className="rounded-3xl border border-gray-200 bg-white overflow-hidden">
          <div className="bg-gradient-to-b from-[#A3FF38]/40 to-white px-8 pt-8 pb-6">
            <div className="flex items-start justify-between gap-4">

              {/* Avatar + name */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#A3FF38]/30 border border-[#A3FF38]/40 flex items-center justify-center text-[24px] font-bold text-[#2A6000] flex-shrink-0">
                  {p.displayName[0]}
                </div>
                <div>
                  <h1 className="text-[20px] font-bold text-neutral-900 leading-tight">{p.displayName}</h1>
                  {p.location && (
                    <div className="flex items-center gap-1 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-gray-400">
                        <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 1 0 3 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 0 0 2.273 1.765 11.842 11.842 0 0 0 .976.544l.062.029.018.008.006.003ZM10 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" clipRule="evenodd" />
                      </svg>
                      <span className="text-[12px] text-gray-400">{p.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Audience size */}
              {p.audienceSize && (
                <span className="flex-shrink-0 px-3 py-1.5 rounded-full bg-[#A3FF38] border border-[#82F200] shadow-[inset_3px_3px_6px_rgba(255,255,255,0.4)] text-gray-900 text-[12px] font-semibold">
                  {p.audienceSize} followers
                </span>
              )}

            </div>
          </div>

          <div className="px-8 pb-6 flex flex-col gap-5">
            {p.bio && (
              <p className="text-[14px] text-gray-500 leading-relaxed">{p.bio}</p>
            )}

            {p.niches.length > 0 && (
              <div className="flex flex-col gap-2.5 pt-5 border-t border-gray-100">
                <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider">Niches</p>
                <div className="flex flex-wrap gap-2">
                  {p.niches.map((n) => (
                    <span key={n} className="px-3 py-1.5 rounded-xl bg-[#F6F6F6] text-gray-700 text-[13px] font-medium">
                      {n}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {p.services.length > 0 && (
              <div className="flex flex-col gap-2.5 pt-5 border-t border-gray-100">
                <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider">What they offer</p>
                <div className="flex flex-wrap gap-2">
                  {p.services.map((s) => (
                    <span key={s} className="px-3 py-1.5 rounded-xl bg-[#F6F6F6] text-gray-700 text-[13px] font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {socials.length > 0 && (
              <div className="flex flex-col gap-2.5 pt-5 border-t border-gray-100">
                <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider">Socials</p>
                <div className="flex flex-wrap gap-2">
                  {socials.map(({ key, label }) => (
                    <a
                      key={key}
                      href={p[key]!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-gray-200 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.03)] text-[13px] font-medium text-gray-600 hover:border-gray-300 hover:text-gray-900 transition-colors duration-[120ms]"
                    >
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
