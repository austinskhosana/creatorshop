"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

export default function CampaignsPage() {
  return (
    <div className="h-[calc(100vh-0px)] flex flex-col items-center justify-center px-6">
      <div className="flex flex-col items-center w-full max-w-3xl">

        {/* Header */}
        <div className="mb-12 text-center">
          <p className="text-xs font-medium tracking-widest uppercase text-neutral-400 mb-3">
            Campaigns
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 leading-tight">
            What would you like to do?
          </h1>
          <p className="mt-3 text-neutral-500 text-sm leading-relaxed">
            Create a new campaign or pick up where you left off.
          </p>
        </div>

        {/* Option cards */}
        <div className="flex gap-6">
          <CampaignOptionCard
            href="/campaigns/new"
            title="Create a Campaign"
            description="Set up a new campaign and start receiving creator applications."
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-black">
                <path d="M16.881 4.345A23.112 23.112 0 0 1 8.25 6H7.5a5.25 5.25 0 0 0-.88 10.427 21.593 21.593 0 0 0 1.378 3.94c.464 1.004 1.674 1.32 2.582.796l.657-.379c.88-.508 1.165-1.593.73-2.477a19.665 19.665 0 0 1-.748-2.37 23.148 23.148 0 0 1 5.33 1.43 22.795 22.795 0 0 0 .97-6.308c0-1.833-.277-3.553-.78-5.148a.5.5 0 0 0-.11-.166Z" />
                <path d="M20.08 4.14a23.09 23.09 0 0 1 1.17 6.705 23.085 23.085 0 0 1-1.17 6.704 23.046 23.046 0 0 0 2.63-6.704 23.046 23.046 0 0 0-2.63-6.705Z" />
              </svg>
            }
          />
          <CampaignOptionCard
            href="/campaigns/list"
            title="Manage Campaigns"
            description="Browse your active and past campaigns and track their progress."
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-black">
                <path fillRule="evenodd" d="M1.5 5.625c0-1.036.84-1.875 1.875-1.875h17.25c1.035 0 1.875.84 1.875 1.875v12.75c0 1.035-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 0 1 1.5 18.375V5.625ZM21 9.375A.375.375 0 0 0 20.625 9h-7.5a.375.375 0 0 0-.375.375v1.5c0 .207.168.375.375.375h7.5A.375.375 0 0 0 21 10.875v-1.5Zm0 3.75a.375.375 0 0 0-.375-.375h-7.5a.375.375 0 0 0-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 0 0 .375-.375v-1.5Zm0 3.75a.375.375 0 0 0-.375-.375h-7.5a.375.375 0 0 0-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 0 0 .375-.375v-1.5ZM10.875 18.75a.375.375 0 0 0 .375-.375v-1.5a.375.375 0 0 0-.375-.375h-7.5a.375.375 0 0 0-.375.375v1.5c0 .207.168.375.375.375h7.5ZM3.375 15h7.5a.375.375 0 0 0 .375-.375v-1.5a.375.375 0 0 0-.375-.375h-7.5a.375.375 0 0 0-.375.375v1.5c0 .207.168.375.375.375Zm0-3.75h7.5a.375.375 0 0 0 .375-.375v-1.5A.375.375 0 0 0 10.875 9h-7.5A.375.375 0 0 0 3 9.375v1.5c0 .207.168.375.375.375Z" clipRule="evenodd" />
              </svg>
            }
          />
        </div>

      </div>
    </div>
  );
}
