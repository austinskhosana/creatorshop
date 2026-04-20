"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function CampaignOptionCard({
  title,
  description,
  icon,
  href,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}) {
  const router = useRouter();
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setRotateY(x * 15);
    setRotateX(-y * 15);
  }

  function handleMouseLeave() {
    setRotateX(0);
    setRotateY(0);
  }

  return (
    <div
      onClick={() => router.push(href)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: "transform 0.15s ease-out",
        transformStyle: "preserve-3d",
      }}
      className="relative w-[360px] h-[360px] rounded-3xl bg-white overflow-hidden font-sans cursor-pointer border border-gray-200 hover:border-gray-300 hover:shadow-md transition-shadow duration-200"
    >
      {/* ── Top section: lime green gradient ── */}
      <div className="flex items-end justify-center h-44 pb-4 bg-gradient-to-b from-[#A3FF38] to-white">
        <div className="w-16 h-16 rounded-xl bg-[#A3FF38] border border-[#82F200] flex items-center justify-center shadow-[inset_4px_4px_8px_rgba(255,255,255,0.3)]">
          {icon}
        </div>
      </div>

      {/* ── Bottom section ── */}
      <div className="px-12 pb-1 pt-10 text-center">
        <h2 className="text-[20px] font-medium text-gray-900 mb-2">{title}</h2>
        <p className="text-[16px] text-gray-400 leading-snug">{description}</p>
      </div>
    </div>
  );
}

export default function ManageCampaignsPage() {
  return (
    <div className="h-screen flex flex-col items-center justify-center px-6">
      <div className="flex flex-col items-center w-full max-w-3xl">

        {/* Back */}
        <Link
          href="/campaigns"
          className="self-start mb-10 inline-flex items-center gap-2 text-[14px] text-gray-400 hover:text-gray-700 transition-colors duration-[120ms]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
          </svg>
          Back
        </Link>

        {/* Header */}
        <div className="mb-12 text-center">
          <p className="text-xs font-medium tracking-widest uppercase text-neutral-400 mb-3">
            Manage Campaigns
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 leading-tight">
            What would you like to review?
          </h1>
          <p className="mt-3 text-neutral-500 text-sm leading-relaxed">
            Check incoming creator posts or look back at past campaigns.
          </p>
        </div>

        {/* Option cards */}
        <div className="flex gap-6 flex-wrap justify-center">
          <CampaignOptionCard
            href="/campaigns/submissions"
            title="Submitted Posts"
            description="Review content submitted by creators across your active campaigns."
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-black">
                <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clipRule="evenodd" />
              </svg>
            }
          />
          <CampaignOptionCard
            href="/campaigns/listings"
            title="My Listings"
            description="View your active listings, track slots remaining, and top up access keys."
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-black">
                <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
              </svg>
            }
          />
          <CampaignOptionCard
            href="/campaigns/history"
            title="Campaign History"
            description="See all past and completed campaigns and their final outcomes."
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-black">
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clipRule="evenodd" />
              </svg>
            }
          />
        </div>

      </div>
    </div>
  );
}
