"use client";

import { useState } from "react";
import Link from "next/link";
import { ReactNode } from "react";

interface CategoryCardProps {
  name: string;
  description: string;
  href: string;
  icon: ReactNode;
}

export default function CategoryCard({ name, description, href, icon }: CategoryCardProps) {
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
    <Link href={href} className="block h-full w-full">
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: "transform 0.15s ease-out",
          transformStyle: "preserve-3d",
        }}
        className="group flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white"
      >
        <div className="relative flex flex-1 items-start justify-start bg-white p-10">
          <div className="absolute inset-0 bg-gradient-to-b from-[#A3FF38] to-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-xl border border-[#82F200] bg-[#A3FF38] text-gray-900 shadow-[inset_4px_4px_8px_rgba(255,255,255,0.3)]">
            {icon}
          </div>
        </div>

        <div className="px-10 pt-3 pb-8">
          <h3 className="mb-1 text-[20px] font-semibold text-gray-900">{name}</h3>
          <p className="text-[16px] leading-snug text-gray-400">{description}</p>
        </div>
      </div>
    </Link>
  );
}
