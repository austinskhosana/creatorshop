"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Badge from "@/components/ui/Badge";
import { avatarColor } from "./SwipeCard";
import type { Application } from "./types";

interface ReviewedListProps {
  reviewed: Application[];
}

export default function ReviewedList({ reviewed }: ReviewedListProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (reviewed.length === 0) return null;

  const approvedCount = reviewed.filter((r) => r.status === "APPROVED").length;
  const deniedCount   = reviewed.filter((r) => r.status === "DENIED").length;

  return (
    <div className="w-full max-w-[440px] mt-6">
      {/* Toggle header */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-2xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-[120ms] group"
      >
        <div className="flex items-center gap-3">
          <span className="text-[13px] font-semibold text-neutral-900">
            Reviewed this session
          </span>
          <div className="flex items-center gap-1.5">
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
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-4 h-4 text-gray-400 group-hover:text-gray-600 flex-shrink-0"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
        </motion.svg>
      </button>

      {/* Collapsible list */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="reviewed-list"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="mt-2 rounded-2xl border border-gray-100 divide-y divide-gray-50 overflow-hidden">
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
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[12px] font-bold flex-shrink-0 ${colorClass}`}>
                      {initials}
                    </div>
                    {/* Name + listing */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-neutral-900 truncate">
                        {app.displayName}
                      </p>
                      <p className="text-[11px] text-gray-400 truncate">{app.listingName}</p>
                    </div>
                    {/* Decision badge */}
                    <Badge
                      variant={app.status === "APPROVED" ? "APPROVED" : "DENIED"}
                      label={app.status === "APPROVED" ? "Approved" : "Passed"}
                    />
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
