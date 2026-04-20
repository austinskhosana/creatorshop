"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CardStack from "./CardStack";
import ReviewedPill from "./ReviewedPill";
import { useSwipeQueue } from "./useSwipeQueue";
import type { Application } from "./types";

// ── Icons ──────────────────────────────────────────────────────────────────────

function DenyIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="w-5 h-5">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ApproveIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function UndoIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M9.53 2.47a.75.75 0 0 1 0 1.06L4.81 8.25H15a6.75 6.75 0 0 1 0 13.5h-3a.75.75 0 0 1 0-1.5h3a5.25 5.25 0 1 0 0-10.5H4.81l4.72 4.72a.75.75 0 1 1-1.06 1.06l-6-6a.75.75 0 0 1 0-1.06l6-6a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
    </svg>
  );
}

// ── Props ──────────────────────────────────────────────────────────────────────

interface SwipeReviewClientProps {
  pending: Application[];
  reviewed: Application[];
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function SwipeReviewClient({ pending, reviewed: initialReviewed }: SwipeReviewClientProps) {
  const { queue, undoStack, reviewed, swipe, undo, error, clearError, isAnimating } =
    useSwipeQueue(pending, initialReviewed);

  const totalPending = pending.length;
  const progressPct = totalPending > 0 ? ((totalPending - queue.length) / totalPending) * 100 : 100;

  // ── Programmatic direction (buttons + keyboard) ────────────────────────────
  const [programmaticDirection, setProgrammaticDirection] = useState<"approve" | "deny" | null>(null);
  const pendingSwipeRef = useRef<"approve" | "deny" | null>(null);

  function triggerProgrammaticSwipe(direction: "approve" | "deny") {
    if (isAnimating || queue.length === 0) return;
    pendingSwipeRef.current = direction;
    setProgrammaticDirection(direction);
  }

  function handleProgrammaticAnimationDone() {
    const direction = pendingSwipeRef.current;
    if (direction) {
      swipe(direction);
      pendingSwipeRef.current = null;
    }
    setProgrammaticDirection(null);
  }

  // ── Keyboard handler ───────────────────────────────────────────────────────
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      // Don't fire if focus is inside an input / textarea
      if ((e.target as HTMLElement).tagName === "INPUT" || (e.target as HTMLElement).tagName === "TEXTAREA") return;

      if (e.key === "ArrowRight") {
        e.preventDefault();
        triggerProgrammaticSwipe("approve");
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        triggerProgrammaticSwipe("deny");
      } else if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        undo();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isAnimating, queue.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Error toast auto-dismiss ───────────────────────────────────────────────
  useEffect(() => {
    if (!error) return;
    const t = setTimeout(clearError, 4000);
    return () => clearTimeout(t);
  }, [error, clearError]);

  // ── All-done state ─────────────────────────────────────────────────────────
  const isDone = queue.length === 0;

  return (
    <div className="flex flex-col items-center px-6 py-10 min-h-screen">

      {/* ── Page header ───────────────────────────────────────────────────── */}
      <div className="w-full max-w-[440px] mb-8">
        <h1 className="text-[22px] font-bold text-neutral-900">Applications</h1>
        <p className="text-[13px] text-gray-400 mt-0.5">
          {isDone
            ? "All applications reviewed"
            : `${queue.length} pending · swipe or use arrow keys`}
        </p>

        {/* Progress bar */}
        <div className="mt-3 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#A3FF38] rounded-full"
            initial={false}
            animate={{ width: `${progressPct}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
        </div>
      </div>

      {/* ── Card stack / empty state ───────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {isDone ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col items-center justify-center py-16 px-6 text-center w-full max-w-[440px]"
          >
            {/* Checkmark illustration */}
            <div className="w-20 h-20 rounded-3xl bg-[#A3FF38]/20 flex items-center justify-center mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-neutral-900">
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-[18px] font-bold text-neutral-900 mb-1.5">You&rsquo;re all caught up</h3>
            <p className="text-[13px] text-gray-400 leading-relaxed max-w-[280px]">
              You&rsquo;ve reviewed all pending applications
              {reviewed.length > 0 && ` — ${reviewed.filter(r => r.status === "APPROVED").length} approved, ${reviewed.filter(r => r.status === "DENIED").length} passed`}.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="stack"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CardStack
              queue={queue}
              onSwipe={swipe}
              programmaticDirection={programmaticDirection}
              onProgrammaticAnimationDone={handleProgrammaticAnimationDone}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Action buttons ─────────────────────────────────────────────────── */}
      {!isDone && (
        <div className="flex items-center gap-5 mt-10">
          {/* Deny */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.93 }}
            onClick={() => triggerProgrammaticSwipe("deny")}
            disabled={isAnimating || queue.length === 0}
            title="Pass (←)"
            className="w-14 h-14 rounded-full bg-neutral-900 text-white flex items-center justify-center shadow-sm hover:bg-neutral-800 hover:shadow-md transition-colors duration-[120ms] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <DenyIcon />
          </motion.button>

          {/* Undo */}
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.93 }}
            onClick={undo}
            disabled={undoStack.length === 0}
            title="Undo (⌘Z)"
            className="w-11 h-11 rounded-full bg-white border border-gray-200 text-gray-400 flex items-center justify-center hover:bg-gray-50 transition-colors duration-[120ms] disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
          >
            <UndoIcon />
          </motion.button>

          {/* Approve */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.93 }}
            onClick={() => triggerProgrammaticSwipe("approve")}
            disabled={isAnimating || queue.length === 0}
            title="Approve (→)"
            className="w-14 h-14 rounded-full bg-[#A3FF38] text-neutral-900 flex items-center justify-center shadow-sm hover:opacity-90 hover:shadow-md transition-all duration-[120ms] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ApproveIcon />
          </motion.button>
        </div>
      )}

      {/* ── Keyboard hint (fades after first swipe) ────────────────────────── */}
      <AnimatePresence>
        {!isDone && reviewed.length === 0 && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ delay: 1.2, duration: 0.4 }}
            className="text-[11px] text-gray-300 mt-5 tracking-wide"
          >
            ← Pass &nbsp;&nbsp;|&nbsp;&nbsp; Approve →
          </motion.p>
        )}
      </AnimatePresence>

      {/* ── Reviewed list (collapsible, appears after first swipe) ─────────── */}
      <ReviewedPill reviewed={reviewed} />

      {/* ── Error toast ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {error && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-neutral-900 text-white text-[13px] font-medium px-5 py-3 rounded-2xl shadow-xl max-w-sm text-center z-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-red-400 flex-shrink-0">
              <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
            </svg>
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
