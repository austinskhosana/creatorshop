"use client";

import { useEffect } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimation,
  useReducedMotion,
} from "framer-motion";
import type { Application } from "./types";

// ── Avatar color ───────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  "bg-violet-100 text-violet-600",
  "bg-blue-100 text-blue-600",
  "bg-emerald-100 text-emerald-600",
  "bg-orange-100 text-orange-600",
  "bg-pink-100 text-pink-600",
  "bg-yellow-100 text-yellow-700",
  "bg-teal-100 text-teal-600",
  "bg-red-100 text-red-500",
];

export function avatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

// ── Social platform icon backgrounds ──────────────────────────────────────────

const PLATFORM_BG: Record<string, string> = {
  TikTok:    "bg-black",
  Instagram: "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400",
  YouTube:   "bg-red-500",
  X:         "bg-black",
  LinkedIn:  "bg-blue-600",
  Other:     "bg-gray-400",
};

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.69a8.18 8.18 0 0 0 4.79 1.53V6.76a4.85 4.85 0 0 1-1.03-.07z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.7 31.7 0 0 0 0 12a31.7 31.7 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.7 31.7 0 0 0 24 12a31.7 31.7 0 0 0-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  TikTok:    <TikTokIcon />,
  Instagram: <InstagramIcon />,
  YouTube:   <YouTubeIcon />,
  X:         <XIcon />,
  LinkedIn:  <LinkedInIcon />,
  Other:     null,
};

function UserGroupIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-gray-400">
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
    </svg>
  );
}

// ── Drag thresholds ────────────────────────────────────────────────────────────
const OFFSET_THRESHOLD = 120;
const VELOCITY_THRESHOLD = 500;

// ── Props ──────────────────────────────────────────────────────────────────────
interface SwipeCardProps {
  app: Application;
  isGhost?: boolean;
  onSwipe?: (decision: "approve" | "deny") => void;
  programmaticDirection?: "approve" | "deny" | null;
  onProgrammaticAnimationDone?: () => void;
}

export default function SwipeCard({
  app,
  isGhost = false,
  onSwipe,
  programmaticDirection,
  onProgrammaticAnimationDone,
}: SwipeCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const controls = useAnimation();

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], shouldReduceMotion ? [0, 0] : [-22, 22]);
  const approveOpacity = useTransform(x, [0, 80, 160], [0, 0.7, 1]);
  const denyOpacity    = useTransform(x, [-160, -80, 0], [1, 0.7, 0]);

  useEffect(() => {
    if (!programmaticDirection || isGhost) return;
    const targetX = programmaticDirection === "approve" ? 600 : -600;
    const targetRotate = programmaticDirection === "approve" ? 28 : -28;

    if (shouldReduceMotion) {
      controls.start({ opacity: 0, transition: { duration: 0.2 } }).then(() => {
        onSwipe?.(programmaticDirection);
        onProgrammaticAnimationDone?.();
      });
    } else {
      controls
        .start({ x: targetX, rotate: targetRotate, opacity: 0, transition: { duration: 0.32, ease: "easeIn" } })
        .then(() => {
          onSwipe?.(programmaticDirection);
          onProgrammaticAnimationDone?.();
        });
    }
  }, [programmaticDirection]); // eslint-disable-line react-hooks/exhaustive-deps

  const initials = app.displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  const colorClass = avatarColor(app.displayName);
  const username = `@${app.displayName.replace(/\s+/g, "")}`;

  const socials: { platform: string }[] = [];
  if (app.tiktokUrl)    socials.push({ platform: "TikTok" });
  if (app.instagramUrl) socials.push({ platform: "Instagram" });
  if (socials.length === 0 && app.platform !== "Other") {
    socials.push({ platform: app.platform });
  }

  // ── Card interior ──────────────────────────────────────────────────────────
  const cardContent = (
    <div className="flex flex-col h-full">

      {/* Banner */}
      <div className="relative h-[120px] bg-gray-50 rounded-t-2xl overflow-hidden flex-shrink-0">
        <div className="absolute -top-6 right-10 w-[150px] h-[110px] rounded-full bg-[#A3FF38]/80 blur-2xl" />
        <div className="absolute top-4 right-20 w-[90px] h-[70px] rounded-full bg-[#A3FF38]/50 blur-xl" />

        {/* Follower badge — bottom-right of banner */}
        {app.audienceSize && (
          <div className="absolute bottom-3 right-4 flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 shadow-sm border border-gray-100/80">
            <UserGroupIcon />
            <span className="text-[11px] font-semibold text-neutral-800">{app.audienceSize} Followers</span>
          </div>
        )}
      </div>

      {/* Avatar overlapping banner */}
      <div className="px-5 flex-shrink-0" style={{ marginTop: -32 }}>
        {app.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={app.avatarUrl}
            alt={app.displayName}
            className="w-[72px] h-[72px] rounded-full border-[3px] border-white object-cover shadow-md"
          />
        ) : (
          <div className={`w-[72px] h-[72px] rounded-full border-[3px] border-white flex items-center justify-center text-xl font-bold shadow-md ${colorClass}`}>
            {initials}
          </div>
        )}
      </div>

      {/* Name, username, bio */}
      <div className="px-5 pt-2.5 flex-shrink-0">
        <p className="text-[18px] font-bold text-neutral-900 leading-tight">{app.displayName}</p>
        <p className="text-[13px] text-gray-400 mt-0.5">{username}</p>
        {app.bio && (
          <p className="text-[13px] text-gray-500 leading-relaxed mt-2 line-clamp-3">{app.bio}</p>
        )}
      </div>

      {/* Niches */}
      {app.niches.length > 0 && (
        <div className="px-5 pt-3 flex-shrink-0">
          <p className="text-[13px] font-semibold text-neutral-900 mb-2">Niches</p>
          <div className="flex flex-wrap gap-1.5">
            {app.niches.slice(0, 5).map((n) => (
              <span key={n} className="px-3 py-1 rounded-lg border border-gray-200 text-[12px] text-neutral-600 font-medium">
                {n}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Socials */}
      {socials.length > 0 && (
        <div className="px-5 pt-3 pb-5 flex-shrink-0">
          <p className="text-[13px] font-semibold text-neutral-900 mb-2">Socials</p>
          <div className="flex flex-wrap gap-2">
            {socials.map((s) => (
              <span
                key={s.platform}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-gray-200 text-[12px] font-medium text-neutral-700"
              >
                <span className={`w-5 h-5 rounded-md flex items-center justify-center text-white flex-shrink-0 ${PLATFORM_BG[s.platform] ?? "bg-gray-400"}`}>
                  {PLATFORM_ICONS[s.platform]}
                </span>
                {s.platform}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // ── Ghost card ─────────────────────────────────────────────────────────────
  if (isGhost) {
    return (
      <div className="w-full h-full bg-white rounded-2xl shadow-lg border border-gray-100/80 overflow-hidden">
        {cardContent}
      </div>
    );
  }

  // ── Active draggable card ──────────────────────────────────────────────────
  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      animate={controls}
      initial={{ scale: shouldReduceMotion ? 1 : 0.92, y: shouldReduceMotion ? 0 : 20, opacity: 0 }}
      whileInView={{ scale: 1, y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      onDragEnd={(_, info) => {
        if (!onSwipe) return;
        if (info.offset.x > OFFSET_THRESHOLD || info.velocity.x > VELOCITY_THRESHOLD) {
          onSwipe("approve");
        } else if (info.offset.x < -OFFSET_THRESHOLD || info.velocity.x < -VELOCITY_THRESHOLD) {
          onSwipe("deny");
        }
      }}
      className="absolute inset-0 w-full h-full bg-white rounded-2xl shadow-2xl border border-gray-100 cursor-grab active:cursor-grabbing overflow-hidden select-none"
      style={{ x, rotate, touchAction: "pan-y" }}
    >
      {/* Approve overlay */}
      <motion.div
        className="absolute inset-0 rounded-2xl flex items-center justify-start pl-8 pointer-events-none z-10"
        style={{ opacity: approveOpacity, background: "rgba(163,255,56,0.85)" }}
      >
        <div className="flex flex-col items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-14 h-14 text-[#1a4a00] drop-shadow-sm">
            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
          </svg>
          <span className="text-[#1a4a00] font-bold text-[13px] tracking-wide uppercase">Approve</span>
        </div>
      </motion.div>

      {/* Deny overlay */}
      <motion.div
        className="absolute inset-0 rounded-2xl flex items-center justify-end pr-8 pointer-events-none z-10"
        style={{ opacity: denyOpacity, background: "rgba(239,68,68,0.85)" }}
      >
        <div className="flex flex-col items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-14 h-14 text-white drop-shadow-sm">
            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
          </svg>
          <span className="text-white font-bold text-[13px] tracking-wide uppercase">Pass</span>
        </div>
      </motion.div>

      <div className="relative z-0 h-full">
        {cardContent}
      </div>
    </motion.div>
  );
}
