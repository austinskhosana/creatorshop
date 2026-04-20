"use client";

import { useState, useCallback } from "react";
import type { Application } from "./types";

type SwipeDecision = "approve" | "deny";

interface UndoEntry {
  app: Application;
  decision: SwipeDecision;
}

interface SwipeQueueState {
  queue: Application[];
  undoStack: UndoEntry[];
  reviewed: Application[];
  isAnimating: boolean;
  exitDirection: SwipeDecision | null;
  error: string | null;
}

interface UseSwipeQueueReturn extends SwipeQueueState {
  swipe: (decision: SwipeDecision) => void;
  undo: () => void;
  clearError: () => void;
}

async function callApi(shopId: string, action: "approve" | "deny"): Promise<{ ok: boolean; message?: string }> {
  try {
    const res = await fetch(`/api/shops/${shopId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    if (res.ok) return { ok: true };
    const data = await res.json().catch(() => ({}));
    return { ok: false, message: data?.error ?? `Failed to ${action} application` };
  } catch {
    return { ok: false, message: "Network error — please check your connection" };
  }
}

export function useSwipeQueue(
  initialQueue: Application[],
  initialReviewed: Application[]
): UseSwipeQueueReturn {
  const [state, setState] = useState<SwipeQueueState>({
    queue: initialQueue,
    undoStack: [],
    reviewed: initialReviewed,
    isAnimating: false,
    exitDirection: null,
    error: null,
  });

  const swipe = useCallback((decision: SwipeDecision) => {
    setState((prev) => {
      if (prev.isAnimating || prev.queue.length === 0) return prev;

      const [active, ...rest] = prev.queue;

      // Optimistically move card from queue to reviewed
      return {
        ...prev,
        queue: rest,
        reviewed: [
          { ...active, status: decision === "approve" ? "APPROVED" : "DENIED" },
          ...prev.reviewed,
        ],
        undoStack: [...prev.undoStack, { app: active, decision }],
        isAnimating: true,
        exitDirection: decision,
        error: null,
      };
    });

    // Fire API call optimistically — revert on failure
    setState((prev) => {
      const lastEntry = prev.undoStack[prev.undoStack.length - 1];
      if (!lastEntry) return prev;

      callApi(lastEntry.app.id, decision).then((result) => {
        if (!result.ok) {
          // Special case: no keys available — don't revert, just surface the error
          if (result.message?.includes("No access keys")) {
            setState((s) => ({
              ...s,
              error: "No access keys left — add more keys to this listing before approving.",
            }));
            return;
          }
          // General failure — revert the card back to front of queue
          setState((s) => {
            const revertedEntry = s.undoStack[s.undoStack.length - 1];
            if (!revertedEntry) return { ...s, error: result.message ?? null };
            return {
              ...s,
              queue: [revertedEntry.app, ...s.queue],
              reviewed: s.reviewed.filter((r) => r.id !== revertedEntry.app.id),
              undoStack: s.undoStack.slice(0, -1),
              error: result.message ?? "Something went wrong — please try again.",
            };
          });
        }
      });

      return prev;
    });

    // Release animation gate after card exit animation (350ms)
    setTimeout(() => {
      setState((s) => ({ ...s, isAnimating: false, exitDirection: null }));
    }, 400);
  }, []);

  const undo = useCallback(() => {
    setState((prev) => {
      if (prev.undoStack.length === 0) return prev;

      const lastEntry = prev.undoStack[prev.undoStack.length - 1];

      // NOTE: Undo is UI-only — it does not reverse a consumed access key on the server.
      // If the brand approved and an access key was consumed, that consumption stands.
      // The card is simply re-queued so the brand can make a new decision.
      return {
        ...prev,
        queue: [lastEntry.app, ...prev.queue],
        reviewed: prev.reviewed.filter((r) => r.id !== lastEntry.app.id),
        undoStack: prev.undoStack.slice(0, -1),
        error: null,
      };
    });
  }, []);

  const clearError = useCallback(() => {
    setState((s) => ({ ...s, error: null }));
  }, []);

  return { ...state, swipe, undo, clearError };
}
