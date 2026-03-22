"use client";

import { useState } from "react";
import Link from "next/link";

type Props = {
  name: string;
  description: string;
  href: string;
  icon: React.ReactNode;
};

export default function CategoryCard({ name, description, href, icon }: Props) {
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
    <Link href={href} className="block w-full h-full">
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: "transform 0.15s ease-out",
          transformStyle: "preserve-3d",
        }}
        className="group w-full h-full rounded-2xl bg-white border border-gray-100 overflow-hidden flex flex-col cursor-pointer"
      >
        {/* Top section — white by default, gradient fades in on hover */}
        <div className="relative flex items-start justify-start flex-1 bg-white p-10">
          {/* Gradient overlay — opacity-0 by default, fades in on card hover */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#A3FF38] to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {/* Icon tile — always lime green, sits above the overlay */}
          <div className="relative z-10 w-14 h-14 rounded-xl bg-[#A3FF38] border border-[#82F200] flex items-center justify-center shadow-[inset_4px_4px_8px_rgba(255,255,255,0.3)] text-gray-900">
            {icon}
          </div>
        </div>

        {/* White bottom — name + description */}
        <div className="px-10 pb-8 pt-3">
          <h3 className="text-[20px] font-semibold text-gray-900 mb-1">{name}</h3>
          <p className="text-[16px] text-gray-400 leading-snug">{description}</p>
        </div>
      </div>
    </Link>
  );
}
