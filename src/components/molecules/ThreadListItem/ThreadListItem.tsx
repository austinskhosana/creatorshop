"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ThreadAvatar } from "@/components/molecules/ThreadAvatar";
import { cn } from "@/lib/utils";

interface ThreadListItemProps {
  name: string;
  preview: string;
  time: string;
  image?: string;
  online?: boolean;
  unread?: boolean;
  selected?: boolean;
  onClick?: () => void;
}

export default function ThreadListItem({ name, preview, time, image, online, unread, selected, onClick }: ThreadListItemProps) {
  const reduceMotion = useReducedMotion();

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex w-full items-center gap-3 rounded-xl py-3 pr-3 pl-3.5 text-left transition-[background-color,transform] duration-150 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-inset",
        selected ? "bg-neutral-100" : "hover:bg-neutral-50",
      )}
    >
      <AnimatePresence>
        {unread ? (
          <motion.span
            aria-hidden="true"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-1/2 left-0.5 size-1.5 -translate-y-1/2 rounded-full bg-neutral-900"
          />
        ) : null}
      </AnimatePresence>
      <ThreadAvatar name={name} image={image} online={online} size="sm" />
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline justify-between gap-3">
          <span className="truncate text-sm font-semibold text-neutral-900">{name}</span>
          <span className="shrink-0 text-[11px] tabular-nums text-neutral-400">{time}</span>
        </span>
        <span className={cn("mt-1 block truncate text-xs leading-4", unread ? "font-medium text-neutral-700" : "text-neutral-500")}>
          {preview}
          {unread ? <span className="sr-only"> · Unread</span> : null}
        </span>
      </span>
    </button>
  );
}
