"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/atoms/Badge";
import { avatarColor } from "@/components/organisms/SwipeCard";
import type { Application } from "@/components/organisms/SwipeCard";

interface ReviewedListProps {
  reviewed: Application[];
}

export default function ReviewedList({ reviewed }: ReviewedListProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (reviewed.length === 0) return null;

  const approvedCount = reviewed.filter((r) => r.status === "APPROVED").length;
  const deniedCount = reviewed.filter((r) => r.status === "DENIED").length;

  return (
    <div className="mt-6 w-full max-w-[440px]">
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="group flex w-full items-center justify-between rounded-2xl border border-gray-200 px-4 py-3 transition-all duration-[120ms] hover:border-gray-300 hover:bg-gray-50"
      >
        <div className="flex items-center gap-3">
          <span className="text-[13px] font-semibold text-neutral-900">Reviewed this session</span>
          <div className="flex items-center gap-1.5">
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
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-4 w-4 flex-shrink-0 text-gray-400 group-hover:text-gray-600"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <path
            fillRule="evenodd"
            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </motion.svg>
      </button>

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
            <div className="mt-2 divide-y divide-gray-50 overflow-hidden rounded-2xl border border-gray-100">
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
                      className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl text-[12px] font-bold ${colorClass}`}
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
