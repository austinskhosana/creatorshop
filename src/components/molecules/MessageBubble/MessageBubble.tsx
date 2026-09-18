"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ThreadAvatar } from "@/components/molecules/ThreadAvatar";

interface MessageBubbleProps {
  text: string;
  meta: string;
  variant?: "incoming" | "outgoing";
  senderName?: string;
  senderImage?: string;
}

export default function MessageBubble({ text, meta, variant = "incoming", senderName, senderImage }: MessageBubbleProps) {
  const reduceMotion = useReducedMotion();

  if (variant === "outgoing") {
    return (
      <motion.div
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="ml-auto flex max-w-[min(78%,36rem)] flex-col items-end gap-1.5"
      >
        <div className="rounded-2xl rounded-br-[5px] bg-neutral-900 px-4 py-2.5 text-sm leading-[1.55] text-white">{text}</div>
        <p className="text-[11px] tabular-nums text-neutral-400">{meta}</p>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-end gap-2.5">
        <ThreadAvatar name={senderName ?? ""} image={senderImage} size="sm" />
        <div className="max-w-[min(78%,36rem)] rounded-2xl rounded-bl-[5px] bg-neutral-100 px-4 py-2.5 text-sm leading-[1.55] text-neutral-700">
          {text}
        </div>
      </div>
      <p className="pl-[46px] text-[11px] tabular-nums text-neutral-400">{meta}</p>
    </div>
  );
}
