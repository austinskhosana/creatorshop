"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import Badge from "@/components/ui/Badge";
import { avatarColor } from "./SwipeCard";
import type { Application } from "./types";

interface ReviewedPillProps {
  reviewed: Application[];
}

export default function ReviewedPill({ reviewed }: ReviewedPillProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const pillControls = useAnimation();
  const prevLength = useRef(reviewed.length);

  const approvedCount = reviewed.filter((r) => r.status === "APPROVED").length;
  const deniedCount   = reviewed.filter((r) => r.status === "DENIED").length;

  // Bounce pill each time a new decision is added
  useEffect(() => {
    if (reviewed.length > prevLength.current && reviewed.length > 0) {
      pillControls.start({
        scale: [1, 1.22, 0.95, 1.06, 1],
        transition: { duration: 0.45, ease: "easeOut" },
      });
    }
    prevLength.current = reviewed.length;
  }, [reviewed.length, pillControls]);

  // Close sheet on Escape
  useEffect(() => {
    if (!sheetOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSheetOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sheetOpen]);

  if (reviewed.length === 0) return null;

  return (
    <>
      {/* ── Floating pill ──────────────────────────────────────────────────── */}
      <motion.button
        animate={pillControls}
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 22 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setSheetOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 pl-3 pr-4 py-2.5 rounded-full bg-[#A3FF38] shadow-lg shadow-black/10 cursor-pointer"
        aria-label={`${reviewed.length} reviewed — click to see decisions`}
      >
        {/* Checkmark icon */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-[#1a4a00] flex-shrink-0">
          <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
        </svg>

        {/* Count */}
        <span className="text-[13px] font-bold text-[#1a4a00] leading-none">
          {reviewed.length}
        </span>

        {/* Sub-counts */}
        <div className="flex items-center gap-1.5 pl-1.5 border-l border-[#1a4a00]/20">
          {approvedCount > 0 && (
            <span className="text-[11px] font-semibold text-[#1a4a00]/70">
              ✓{approvedCount}
            </span>
          )}
          {deniedCount > 0 && (
            <span className="text-[11px] font-semibold text-[#1a4a00]/70">
              ✗{deniedCount}
            </span>
          )}
        </div>
      </motion.button>

      {/* ── Bottom sheet ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {sheetOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40"
              onClick={() => setSheetOpen(false)}
            />

            {/* Sheet */}
            <motion.div
              key="sheet"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
              drag="y"
              dragConstraints={{ top: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.y > 80 || info.velocity.y > 400) setSheetOpen(false);
              }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl flex flex-col"
              style={{ maxHeight: "62vh" }}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1 flex-shrink-0 cursor-grab active:cursor-grabbing">
                <div className="w-8 h-1 rounded-full bg-gray-200" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 pt-3 pb-4 flex-shrink-0">
                <div>
                  <h2 className="text-[16px] font-bold text-neutral-900">Reviewed this session</h2>
                  <div className="flex items-center gap-2 mt-1">
                    {approvedCount > 0 && (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#A3FF38]/20 text-[#3A7A00]">
                        {approvedCount} approved
                      </span>
                    )}
                    {deniedCount > 0 && (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-600">
                        {deniedCount} passed
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setSheetOpen(false)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors duration-[120ms]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                  </svg>
                </button>
              </div>

              {/* Scrollable list */}
              <div className="overflow-y-auto flex-1 px-3 pb-6">
                <div className="rounded-2xl border border-gray-100 divide-y divide-gray-50 overflow-hidden">
                  {reviewed.map((app) => {
                    const initials = app.displayName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2);
                    const colorClass = avatarColor(app.displayName);

                    return (
                      <div key={app.id} className="flex items-center gap-3 px-4 py-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-[12px] font-bold flex-shrink-0 ${colorClass}`}>
                          {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-neutral-900 truncate">
                            {app.displayName}
                          </p>
                          <p className="text-[11px] text-gray-400 truncate">{app.listingName}</p>
                        </div>
                        <Badge
                          variant={app.status === "APPROVED" ? "APPROVED" : "DENIED"}
                          label={app.status === "APPROVED" ? "Approved" : "Passed"}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
