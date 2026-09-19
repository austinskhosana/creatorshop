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
}

function MediaBubble({ content, outgoing }: { content: MessageContent; outgoing: boolean }) {
  if (content.type === "text") {
    return (
      <div
        className={
          outgoing
            ? "rounded-2xl rounded-br-[5px] bg-neutral-900 px-4 py-2.5 text-sm leading-[1.55] text-white"
            : "max-w-[min(78%,36rem)] rounded-2xl rounded-bl-[5px] bg-neutral-100 px-4 py-2.5 text-sm leading-[1.55] text-neutral-700"
        }
      >
        {content.text}
      </div>
    );
  }

  if (content.type === "image") {
    return (
      <div className={`overflow-hidden rounded-2xl ${outgoing ? "rounded-br-[5px]" : "rounded-bl-[5px]"}`}>
        <Image
          src={content.src}
          alt={content.alt ?? "Shared image"}
          width={320}
          height={240}
          className="block max-h-72 w-auto max-w-[min(78%,20rem)] rounded-2xl object-cover"
          unoptimized
        />
      </div>
    );
  }

  if (content.type === "gif") {
    const isGradient = content.src.startsWith("linear-gradient") || content.src.startsWith("radial-gradient");
    return (
      <div className={`overflow-hidden rounded-2xl ${outgoing ? "rounded-br-[5px]" : "rounded-bl-[5px]"}`}>
        {isGradient ? (
          <div
            className="flex h-36 w-56 items-end rounded-2xl p-3"
            style={{ background: content.src }}
          >
            {content.alt && (
              <span className="rounded-lg bg-black/20 px-2 py-1 text-xs font-semibold text-white backdrop-blur-sm">{content.alt}</span>
            )}
          </div>
        ) : (
          <Image
            src={content.src}
            alt={content.alt ?? "GIF"}
            width={240}
            height={180}
            className="block max-h-56 w-auto max-w-[min(78%,16rem)] rounded-2xl object-cover"
            unoptimized
          />
        )}
      </div>
    );
  }

  return null;
}

export default function MessageBubble({ text, content, meta, variant = "incoming", senderName, senderImage }: MessageBubbleProps) {
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
        <MediaBubble content={resolved} outgoing />
        <p className="text-[11px] tabular-nums text-neutral-400">{meta}</p>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-end gap-2.5">
        <ThreadAvatar name={senderName ?? ""} image={senderImage} size="sm" />
        {resolved.type === "text" ? (
          <div className="max-w-[min(78%,36rem)] rounded-2xl rounded-bl-[5px] bg-neutral-100 px-4 py-2.5 text-sm leading-[1.55] text-neutral-700">
            {resolved.text}
          </div>
        ) : (
          <MediaBubble content={resolved} outgoing={false} />
        )}
      </div>
      <p className="pl-[46px] text-[11px] tabular-nums text-neutral-400">{meta}</p>
    </div>
  );
}
