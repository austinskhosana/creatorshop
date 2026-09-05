"use client";

import { useState } from "react";

interface CreatorCardProps {
  isSelected?: boolean;
  onClick?: () => void;
}

export default function CreatorCard({ isSelected, onClick }: CreatorCardProps) {
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
        "relative h-[360px] w-[360px] cursor-pointer overflow-hidden rounded-3xl bg-white font-sans",
        "border border-gray-200",
        isSelected ? "ring-2 ring-black ring-offset-4" : "",
      ].join(" ")}
    >
      <div className="flex h-44 items-end justify-center bg-gradient-to-b from-[#A3FF38] to-white pb-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-[#82F200] bg-[#A3FF38] shadow-[inset_4px_4px_8px_rgba(255,255,255,0.3)]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-black">
            <path d="M12 .75a8.25 8.25 0 0 0-4.135 15.39c.686.398 1.115 1.008 1.134 1.623a.75.75 0 0 0 .577.706c.352.083.71.148 1.074.195.323.041.6-.218.6-.544v-4.661a6.714 6.714 0 0 1-.937-.171.75.75 0 1 1 .374-1.453 5.261 5.261 0 0 0 2.626 0 .75.75 0 1 1 .374 1.452 6.712 6.712 0 0 1-.937.172v4.66c0 .327.277.586.6.545.364-.047.722-.112 1.074-.195a.75.75 0 0 0 .577-.706c.02-.615.448-1.225 1.134-1.623A8.25 8.25 0 0 0 12 .75Z" />
            <path
              fillRule="evenodd"
              d="M9.013 19.9a.75.75 0 0 1 .877-.597 11.319 11.319 0 0 0 4.22 0 .75.75 0 1 1 .28 1.473 12.819 12.819 0 0 1-4.78 0 .75.75 0 0 1-.597-.876ZM9.754 22.344a.75.75 0 0 1 .824-.668 13.682 13.682 0 0 0 2.844 0 .75.75 0 1 1 .156 1.492 15.156 15.156 0 0 1-3.156 0 .75.75 0 0 1-.668-.824Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      <div className="px-12 pt-10 pb-1 text-center">
        <h2 className="mb-2 text-[20px] font-medium text-gray-900">I&apos;m a Creator</h2>
        <p className="text-[16px] leading-snug text-gray-400">
          I want to pay for products through bartering my services.
        </p>
      </div>
    </div>
  );
}
