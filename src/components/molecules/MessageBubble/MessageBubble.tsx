"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ThreadAvatar } from "@/components/molecules/ThreadAvatar";

export type MessageContent =
  | { type: "text"; text: string }
  | { type: "image"; src: string; alt?: string }
  | { type: "gif"; src: string; alt?: string };

interface MessageBubbleProps {
  text?: string;
  content?: MessageContent;
  meta: string;
  variant?: "incoming" | "outgoing";
  senderName?: string;
  senderImage?: string;
  /** Show the timestamp line. Turn off for all but the last message in a run from the same person. */
  showMeta?: boolean;
  /** Give the bubble its pointed corner. Only the last message in a run gets one. */
  tail?: boolean;
}

// Photos are the flex item themselves (no wrapper), so the bubble is exactly as wide as the
// image and sits flush with its timestamp. The corner radius carries the chat "tail", and an
// inset outline gives a white-background photo a hairline edge.
const mediaImageClassName =
  "block h-auto w-auto rounded-2xl outline outline-1 -outline-offset-1 outline-black/[0.06]";

function MediaBubble({ content, outgoing, tail }: { content: MessageContent; outgoing: boolean; tail: boolean }) {
  const tailClassName = tail ? (outgoing ? "rounded-br-[5px]" : "rounded-bl-[5px]") : "";

  if (content.type === "text") {
    return (
      <div
        className={
          outgoing
            ? `rounded-2xl ${tailClassName} bg-neutral-900 px-4 py-2.5 text-sm leading-[1.55] text-white`
            : `max-w-[min(78%,36rem)] rounded-2xl ${tailClassName} bg-neutral-100 px-4 py-2.5 text-sm leading-[1.55] text-neutral-700`
        }
      >
        {content.text}
      </div>
    );
  }

  if (content.type === "image") {
    return (
      <Image
        src={content.src}
        alt={content.alt ?? "Shared image"}
        width={320}
        height={320}
        className={`${mediaImageClassName} max-h-72 max-w-[min(20rem,100%)] ${tailClassName}`}
        unoptimized
      />
    );
  }

  if (content.type === "gif") {
    const isGradient = content.src.startsWith("linear-gradient") || content.src.startsWith("radial-gradient");
    if (!isGradient) {
      return (
        <Image
          src={content.src}
          alt={content.alt ?? "GIF"}
          width={240}
          height={240}
          className={`${mediaImageClassName} max-h-56 max-w-[min(16rem,100%)] ${tailClassName}`}
          unoptimized
        />
      );
    }

    return (
      <div className={`overflow-hidden rounded-2xl ${tailClassName}`}>
        <div
          className="flex h-36 w-56 items-end rounded-2xl p-3"
          style={{ background: content.src }}
        >
          {content.alt && (
            <span className="rounded-lg bg-black/20 px-2 py-1 text-xs font-semibold text-white backdrop-blur-sm">{content.alt}</span>
          )}
        </div>
      </div>
    );
  }

  return null;
}

export default function MessageBubble({ text, content, meta, variant = "incoming", senderName, senderImage, showMeta = true, tail = true }: MessageBubbleProps) {
  const reduceMotion = useReducedMotion();
  const resolved: MessageContent = content ?? { type: "text", text: text ?? "" };

  if (variant === "outgoing") {
    return (
      <motion.div
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="ml-auto flex max-w-[min(78%,36rem)] flex-col items-end gap-1.5"
      >
        <MediaBubble content={resolved} outgoing tail={tail} />
        {showMeta ? <p className="text-[11px] tabular-nums text-neutral-400">{meta}</p> : null}
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-end gap-2.5">
        <ThreadAvatar name={senderName ?? ""} image={senderImage} size="sm" />
        {resolved.type === "text" ? (
          <div className={`max-w-[min(78%,36rem)] rounded-2xl ${tail ? "rounded-bl-[5px]" : ""} bg-neutral-100 px-4 py-2.5 text-sm leading-[1.55] text-neutral-700`}>
            {resolved.text}
          </div>
        ) : (
          <MediaBubble content={resolved} outgoing={false} tail={tail} />
        )}
      </div>
      {showMeta ? <p className="pl-[46px] text-[11px] tabular-nums text-neutral-400">{meta}</p> : null}
    </div>
  );
}
