"use client";

import { useState } from "react";

interface BrandCardProps {
  isSelected?: boolean;
  onClick?: () => void;
}

export default function BrandCard({ isSelected, onClick }: BrandCardProps) {
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
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: "transform 0.15s ease-out",
        transformStyle: "preserve-3d",
      }}
      className={[
        "relative w-[360px] h-[360px] rounded-3xl bg-white overflow-hidden font-sans cursor-pointer",
        "border border-gray-200",
        isSelected ? "ring-2 ring-black ring-offset-4" : "",
      ].join(" ")}
    >
      {/* ── Top section: lime green gradient ──────────────────────────────── */}
      <div className="flex items-end justify-center h-44 pb-4 bg-gradient-to-b from-[#A3FF38] to-white">

        {/* Icon tile */}
        <div className="w-16 h-16 rounded-xl bg-[#A3FF38] border border-[#82F200] flex items-center justify-center shadow-[inset_4px_4px_8px_rgba(255,255,255,0.3)]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-black">
            <path fillRule="evenodd" d="M3 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5H15v-18a.75.75 0 0 0 0-1.5H3ZM6.75 19.5v-2.25a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75ZM6 6.75A.75.75 0 0 1 6.75 6h.75a.75.75 0 0 1 0 1.5h-.75A.75.75 0 0 1 6 6.75ZM6.75 9a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM6 12.75a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 6a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75Zm-.75 3.75A.75.75 0 0 1 10.5 9h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 12a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM16.5 6.75v15h5.25a.75.75 0 0 0 0-1.5H21v-12a.75.75 0 0 0 0-1.5h-4.5Zm1.5 4.5a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 0 1.5H18.75a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5h.008a.75.75 0 0 0 0-1.5H18.75Zm-.75 4.5a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 0 1.5H18.75a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
          </svg>
        </div>

      </div>

      {/* ── Bottom section: title + description ───────────────────────────── */}
      <div className="px-12 pb-1 pt-10 text-center">
        <h2 className="text-[20px] font-medium text-gray-900 mb-2">
          I&apos;m a Brand
        </h2>
        <p className="text-[16px] text-gray-400 leading-snug">
          I want to offer software in exchange for content from creators.
        </p>
      </div>

    </div>
  );
}
