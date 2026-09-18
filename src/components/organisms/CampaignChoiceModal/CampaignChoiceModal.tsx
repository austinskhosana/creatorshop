"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { BanknotesIcon, ChatBubbleLeftEllipsisIcon, DocumentTextIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { TerminalgraphShader } from "@/components/atoms/TerminalgraphShader";
import type { CreatorShop } from "@/lib/mock-creator";

interface CampaignChoiceModalProps {
  shop: CreatorShop;
  onClose: () => void;
  onChat: () => void;
  onPayWithPost: () => void;
}

export default function CampaignChoiceModal({ shop, onClose, onChat, onPayWithPost }: CampaignChoiceModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeButtonRef.current?.focus();
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 grid place-items-center bg-neutral-950/45 p-4 backdrop-blur-[2px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      onMouseDown={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="campaign-choice-title"
        className="relative w-full max-w-lg rounded-[24px] bg-white p-6 shadow-[0_30px_80px_rgba(0,0,0,0.22)] sm:p-7"
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 4 }}
        transition={{ type: "spring", duration: 0.35, bounce: 0.2 }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close campaign options"
          className="absolute top-4 right-4 grid size-9 shrink-0 place-items-center rounded-full text-neutral-400 transition-colors duration-150 hover:bg-neutral-100 hover:text-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 sm:top-5 sm:right-5"
        >
          <XMarkIcon aria-hidden="true" className="size-4" strokeWidth={1.75} />
        </button>

        <div className="pr-10">
          <div className="flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-neutral-100 text-neutral-700">
              <BanknotesIcon aria-hidden="true" className="size-5" strokeWidth={1.75} />
            </span>
            <h2 id="campaign-choice-title" className="text-2xl font-bold tracking-tight text-neutral-950">Ready to pay with your post?</h2>
          </div>
          <p className="mt-3 max-w-md text-sm leading-6 text-neutral-500">
            Create {/^[aeiou]/i.test(shop.tier) ? "an" : "a"} {shop.tier.toLowerCase()} for {shop.product}, then send it to {shop.brand} for approval by {shop.deadline}.
          </p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onChat}
            className="rounded-2xl border border-neutral-200 p-4 text-left transition-[border-color,background-color,transform] duration-150 hover:border-neutral-300 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 active:scale-[0.98]"
          >
            <span className="grid size-9 place-items-center rounded-full bg-neutral-100 text-neutral-700">
              <ChatBubbleLeftEllipsisIcon aria-hidden="true" className="size-4.5" strokeWidth={1.75} />
            </span>
            <span className="mt-4 block text-sm font-semibold text-neutral-950">Chat with {shop.brand}</span>
            <span className="mt-1 block text-xs leading-5 text-neutral-500">Ask a question or get campaign guidance first.</span>
          </button>

          <button
            type="button"
            onClick={onPayWithPost}
            className="group relative isolate overflow-hidden rounded-2xl bg-neutral-900 p-4 text-left text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-transform duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 active:scale-[0.98]"
          >
            <TerminalgraphShader theme="dark" className="pointer-events-none absolute inset-0 -z-10" />
            <span className="pointer-events-none absolute inset-0 -z-10 bg-black/35 transition-colors duration-150 group-hover:bg-black/25" />
            <span className="grid size-9 place-items-center rounded-full bg-white/10 text-white">
              <DocumentTextIcon aria-hidden="true" className="size-4.5" strokeWidth={1.75} />
            </span>
            <span className="mt-4 block text-sm font-semibold">Pay with a post</span>
            <span className="mt-1 block text-xs leading-5 text-neutral-400">Build the post in-app and submit it for approval.</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
