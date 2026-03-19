"use client";
// "use client" is needed because we're tracking which nav item is active using state —
// that kind of interactivity only works in the browser, not on the server.

import { useState } from "react";

// ── Icon components ───────────────────────────────────────────────────────────
// Each one is a small SVG wrapped in a function so we can reuse it cleanly.

function HomeIcon() {
  return (
    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
      <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
    </svg>
  );
}

function ShopIcon() {
  return (
    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M9.375 3a1.875 1.875 0 0 0 0 3.75h1.875v4.5H3.375A1.875 1.875 0 0 1 1.5 9.375v-.75c0-1.036.84-1.875 1.875-1.875h3.193A3.375 3.375 0 0 1 12 2.753a3.375 3.375 0 0 1 5.432 3.997h3.943c1.035 0 1.875.84 1.875 1.875v.75c0 1.036-.84 1.875-1.875 1.875H12.75v-4.5h1.875a1.875 1.875 0 1 0-1.875-1.875V6.75h-1.5V4.875C11.25 3.839 10.41 3 9.375 3ZM11.25 12.75H3v6.75a2.25 2.25 0 0 0 2.25 2.25h6v-9ZM12.75 21.75h6A2.25 2.25 0 0 0 21 19.5v-6.75h-8.25v9Z" />
    </svg>
  );
}

function CampaignsIcon() {
  return (
    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M7.5 5.25a3 3 0 0 1 3-3h3a3 3 0 0 1 3 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0 1 12 15.75c-2.73 0-5.357-.442-7.814-1.259-1.202-.4-1.936-1.541-1.936-2.752V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 0 1 7.5 5.455V5.25Zm7.5 0v.09a49.488 49.488 0 0 0-6 0v-.09a1.5 1.5 0 0 1 1.5-1.5h3a1.5 1.5 0 0 1 1.5 1.5Zm-3 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
      <path d="M3 18.4v-2.796a4.3 4.3 0 0 0 .713.31A26.226 26.226 0 0 0 12 17.25c2.892 0 5.68-.468 8.287-1.335.252-.084.49-.189.713-.311V18.4c0 1.452-1.047 2.728-2.523 2.923-2.12.282-4.282.427-6.477.427a49.19 49.19 0 0 1-6.477-.427C4.047 21.128 3 19.852 3 18.4Z" />
    </svg>
  );
}

function InfluencersIcon() {
  return (
    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
    </svg>
  );
}

function SignOutIcon() {
  return (
    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V15a.75.75 0 0 1 1.5 0v3.75a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V5.25a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3V9A.75.75 0 0 1 15 9V5.25a1.5 1.5 0 0 0-1.5-1.5h-6Zm10.72 4.72a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 1 1-1.06-1.06l1.72-1.72H9a.75.75 0 0 1 0-1.5h10.94l-1.72-1.72a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
    </svg>
  );
}

// ── Nav item type ─────────────────────────────────────────────────────────────
// This describes the shape of each item in our nav list.
// TypeScript uses this to catch mistakes — e.g. if you forget to add an icon.
type NavItem = {
  id: string;
  label: string;
  icon: React.ReactNode; // ReactNode means "anything React can render" — JSX, text, null, etc.
};

const navItems: NavItem[] = [
  { id: "home",        label: "Home",        icon: <HomeIcon /> },
  { id: "shop",        label: "Shop",        icon: <ShopIcon /> },
  { id: "campaigns",   label: "Campaigns",   icon: <CampaignsIcon /> },
  { id: "influencers", label: "Influencers", icon: <InfluencersIcon /> },
];

// ── Sidebar component ─────────────────────────────────────────────────────────
export default function Sidebar() {
  // activeId tracks which nav item is currently selected.
  // We default to "home" so it starts highlighted on first render.
  const [activeId, setActiveId] = useState("home");

  return (
    // The sidebar is a tall flex column with a light gray background.
    // h-screen makes it fill the full viewport height.
    <nav className="flex flex-col h-screen w-72 bg-[#FAFAFB] px-4 py-8 font-sans border-r border-black/[0.1]">

      {/* ── Logo ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-10 px-2">
        {/* Green rounded icon tile — same style as the app icon */}
        <div className="w-12 h-12 rounded-2xl bg-[#A3FF38] flex items-center justify-center shadow-sm shrink-0">
          {/* Asterisk/snowflake SVG — the Creatorshop brand mark */}
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-6 h-6 text-black">
            <line x1="12" y1="2"  x2="12" y2="22" />
            <line x1="2"  y1="12" x2="22" y2="12" />
            <line x1="4.93"  y1="4.93"  x2="19.07" y2="19.07" />
            <line x1="19.07" y1="4.93"  x2="4.93"  y2="19.07" />
          </svg>
        </div>
        <span className="text-[22px] font-semibold text-gray-900 tracking-tight">Creatorshop</span>
      </div>

      {/* ── Nav items ────────────────────────────────────────────────────── */}
      {/* flex-1 makes this section grow to fill available space, pushing Sign Out to the bottom */}
      <ul className="flex flex-col gap-1 flex-1">
        {navItems.map((item, index) => {
          const isActive = item.id === activeId;

          return (
            // Each item staggered 40ms apart — items cascade in rather than all appearing at once.
            // `both` fill-mode keeps the item invisible until its delay starts, preventing a flash.
            <li
              key={item.id}
              style={{
                animation: "nav-enter 280ms cubic-bezier(0.23, 1, 0.32, 1) both",
                animationDelay: `${index * 40}ms`,
              }}
            >
              <button
                onClick={() => setActiveId(item.id)}
                className={[
                  "flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg text-[16px]",
                  // Specific properties only — no transition-all.
                  // Same cubic-bezier easing for every state change: instant start, smooth settle.
                  "border transition-[background-color,color,box-shadow,transform,border-color] duration-[160ms] ease-[cubic-bezier(0.23,1,0.32,1)]",
                  // 0.96 is the correct scale-on-press value per design principle — tactile but not dramatic.
                  "active:scale-[0.96]",
                  isActive
                    // Two shadow layers: a tight ambient shadow + a wider diffused one.
                    // Layered shadows look far more natural than a single shadow.
                    ? "bg-white border-black/[0.07] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.07)] text-gray-900 font-medium"
                    // Subtle background on hover gives the surface a chance to respond
                    // before the click — not just after.
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-black/[0.03]",
                ].join(" ")}
              >
                {item.icon}
                {item.label}
              </button>
            </li>
          );
        })}
      </ul>

      {/* ── Sign Out ─────────────────────────────────────────────────────── */}
      {/* Same transition and press feel as nav items — interactive elements should be consistent */}
      <button className="flex items-center gap-3 px-4 py-3 text-[16px] text-gray-500 hover:text-gray-700 hover:bg-black/[0.03] transition-[color,background-color,transform] duration-[160ms] ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.96] rounded-lg">
        <SignOutIcon />
        Sign Out
      </button>

    </nav>
  );
}
