"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { Badge } from "@/components/atoms/Badge";
import { avatarColor } from "@/components/organisms/SwipeCard";
import type { Application } from "@/components/organisms/SwipeCard";

interface ReviewedPillProps {
  reviewed: Application[];
}

export default function ReviewedPill({ reviewed }: ReviewedPillProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const pillControls = useAnimation();
  const prevLength = useRef(reviewed.length);

  const approvedCount = reviewed.filter((r) => r.status === "APPROVED").length;
  const deniedCount = reviewed.filter((r) => r.status === "DENIED").length;

  useEffect(() => {
    if (reviewed.length > prevLength.current && reviewed.length > 0) {
      pillControls.start({
        scale: [1, 1.22, 0.95, 1.06, 1],
        transition: { duration: 0.45, ease: "easeOut" },
      });
    }
    prevLength.current = reviewed.length;
  }, [reviewed.length, pillControls]);

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
      <motion.button
        animate={pillControls}
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 22 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setSheetOpen(true)}
        className="fixed right-6 bottom-6 z-40 flex cursor-pointer items-center gap-2 rounded-full bg-[#A3FF38] py-2.5 pr-4 pl-3 shadow-lg shadow-black/10"
        aria-label={`${reviewed.length} reviewed — click to see decisions`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 flex-shrink-0 text-neutral-900">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-[13px] leading-none font-bold text-neutral-900">{reviewed.length}</span>
        <div className="flex items-center gap-1.5 border-l border-[#1a4a00]/20 pl-1.5">
          {approvedCount > 0 && <span className="text-[11px] font-semibold text-neutral-600">✓{approvedCount}</span>}
          {deniedCount > 0 && <span className="text-[11px] font-semibold text-neutral-600">✗{deniedCount}</span>}
        </div>
      </motion.button>

      <AnimatePresence>
        {sheetOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
              onClick={() => setSheetOpen(false)}
            />

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
              className="fixed right-0 bottom-0 left-0 z-50 flex flex-col rounded-t-3xl bg-white shadow-2xl"
              style={{ maxHeight: "62vh" }}
            >
              <div className="flex flex-shrink-0 cursor-grab justify-center pt-3 pb-1 active:cursor-grabbing">
                <div className="h-1 w-8 rounded-full bg-gray-200" />
              </div>

              <div className="flex flex-shrink-0 items-center justify-between px-5 pt-3 pb-4">
                <div>
                  <h2 className="text-[16px] font-bold text-neutral-900">Reviewed this session</h2>
                  <div className="mt-1 flex items-center gap-2">
                    {approvedCount > 0 && (
                      <span className="rounded-full bg-[#A3FF38]/20 px-2 py-0.5 text-[11px] font-medium text-neutral-900">
                        {approvedCount} approved
                      </span>
                    )}
                    {deniedCount > 0 && (
                      <span className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-600">
                        {deniedCount} passed
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setSheetOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-xl text-gray-400 transition-colors duration-[120ms] hover:bg-gray-100 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                    <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-3 pb-6">
                <div className="divide-y divide-gray-50 overflow-hidden rounded-2xl border border-gray-100">
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
                        <div
                          className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-[12px] font-bold ${colorClass}`}
                        >
                          {initials}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13px] font-semibold text-neutral-900">{app.displayName}</p>
                          <p className="truncate text-[11px] text-gray-400">{app.listingName}</p>
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
