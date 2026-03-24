"use client";
// "use client" tells Next.js this component runs in the browser (not on the server).
// We need it here because we're using mouse events and React state — both browser-only features.

import { useState } from "react";
// useState is a React hook — it lets us store and update values inside a component.
// When the value changes, React re-renders the component automatically.

interface CreatorCardProps {
  isSelected?: boolean;
  onClick?: () => void;
}

export default function CreatorCard({ isSelected, onClick }: CreatorCardProps) {
  // These two state values store the current tilt angle in degrees.
  // rotateX tilts forward/back, rotateY tilts left/right.
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    // getBoundingClientRect() gives us the card's position and size on screen.
    const rect = e.currentTarget.getBoundingClientRect();

    // Calculate where the mouse is relative to the card center (as a value from -1 to 1).
    const x = (e.clientX - rect.left) / rect.width - 0.5;   // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;   // -0.5 to 0.5

    // Multiply by the max tilt angle (15deg). Negate Y so it tilts the right way.
    setRotateY(x * 15);
    setRotateX(-y * 15);
  }

  function handleMouseLeave() {
    setRotateX(0);
    setRotateY(0);
  }

  return (
    // perspective() creates the 3D space — without it, rotateX/Y have no visible depth.
    // transition makes the tilt animate smoothly instead of jumping.
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
            <path d="M12 .75a8.25 8.25 0 0 0-4.135 15.39c.686.398 1.115 1.008 1.134 1.623a.75.75 0 0 0 .577.706c.352.083.71.148 1.074.195.323.041.6-.218.6-.544v-4.661a6.714 6.714 0 0 1-.937-.171.75.75 0 1 1 .374-1.453 5.261 5.261 0 0 0 2.626 0 .75.75 0 1 1 .374 1.452 6.712 6.712 0 0 1-.937.172v4.66c0 .327.277.586.6.545.364-.047.722-.112 1.074-.195a.75.75 0 0 0 .577-.706c.02-.615.448-1.225 1.134-1.623A8.25 8.25 0 0 0 12 .75Z" />
            <path fillRule="evenodd" d="M9.013 19.9a.75.75 0 0 1 .877-.597 11.319 11.319 0 0 0 4.22 0 .75.75 0 1 1 .28 1.473 12.819 12.819 0 0 1-4.78 0 .75.75 0 0 1-.597-.876ZM9.754 22.344a.75.75 0 0 1 .824-.668 13.682 13.682 0 0 0 2.844 0 .75.75 0 1 1 .156 1.492 15.156 15.156 0 0 1-3.156 0 .75.75 0 0 1-.668-.824Z" clipRule="evenodd" />
          </svg>
        </div>

      </div>

      {/* ── Bottom section: title + description ───────────────────────────── */}
      <div className="px-12 pb-1 pt-10 text-center">
        <h2 className="text-[20px] font-medium text-gray-900 mb-2">
          I&apos;m a Creator
        </h2>
        <p className="text-[16px] text-gray-400 leading-snug">
          I want to pay for products through bartering my services.
        </p>
      </div>

    </div>
  );
}
