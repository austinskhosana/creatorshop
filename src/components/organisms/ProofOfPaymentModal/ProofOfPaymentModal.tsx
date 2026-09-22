"use client";

import { ArrowUpTrayIcon, BanknotesIcon, LinkIcon, PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Button from "@/components/atoms/Button/Button";
import { darkGradientButtonStyle } from "@/components/atoms/Button/darkGradientStyle";
import { MeshGradientPanel } from "@/components/atoms/MeshGradientPanel";
import PlatformIcon from "@/components/atoms/PlatformIcon/PlatformIcon";
import type { CreatorShop } from "@/lib/mock-creator";
import { PROOF_LINK_EXAMPLES } from "@/lib/proof-links";
import { cn } from "@/lib/utils";
import { useProof } from "./useProof";

interface ProofOfPaymentModalProps {
  shop: CreatorShop;
  onClose: () => void;
  onSubmit: () => void;
}

/**
 * Where a creator proves they paid, once their draft is approved and they've posted it:
 * the link to their live post, or a screenshot for an Instagram Story (which has no link).
 */
export default function ProofOfPaymentModal({ shop, onClose, onSubmit }: ProofOfPaymentModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const proof = useProof(shop);
  const isLink = proof.kind === "link";
  // The button is always ready. Pressing it too early shows what's missing, instead of sitting greyed out.
  const [attempted, setAttempted] = useState(false);
  const fieldProblem = proof.linkProblem ?? (attempted ? proof.problem : null);
  const isLinkValid = isLink && proof.link.trim() !== "" && proof.linkProblem === null;

  function handleSubmit() {
    if (proof.problem !== null) {
      setAttempted(true);
      inputRef.current?.focus();
      return;
    }
    onSubmit();
  }

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
        aria-labelledby="proof-modal-title"
        className="w-full max-w-lg"
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 4 }}
        transition={{ type: "spring", duration: 0.35, bounce: 0.2 }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <MeshGradientPanel radius={30} borderWidth={6} shaded={false} className="w-full p-1.5 shadow-[0_30px_80px_rgba(0,0,0,0.22)]">
          <div className="relative rounded-[24px] bg-white p-6 sm:p-7">
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Close proof of payment"
              className="absolute top-4 right-4 grid size-9 shrink-0 place-items-center rounded-lg text-neutral-400 transition-colors duration-150 hover:bg-neutral-100 hover:text-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 sm:top-5 sm:right-5"
            >
              <XMarkIcon aria-hidden="true" className="size-4" strokeWidth={1.75} />
            </button>

            <div className="pr-10">
              <div className="flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-neutral-100 text-neutral-700">
                  <LinkIcon aria-hidden="true" className="size-5" strokeWidth={1.75} />
                </span>
                <h2 id="proof-modal-title" className="text-2xl font-bold tracking-tight text-neutral-950">Add your proof of payment</h2>
              </div>
              <p className="mt-3 max-w-md text-sm leading-6 text-neutral-500">
                {isLink
                  ? `Paste the link to your ${proof.platform} post. ${shop.brand} uses it to confirm you've paid before your ${shop.product} access unlocks.`
                  : `Stories disappear after 24 hours and don't have a link. Upload a screenshot so ${shop.brand} can see your story.`}
              </p>
            </div>

            <div className="mt-6">
              {isLink ? (
                <>
                  <label className="block">
                    <span className="sr-only">Link to your {proof.platform} post</span>
                    <div className="relative">
                      <span className="pointer-events-none absolute top-1/2 left-3.5 grid size-5 -translate-y-1/2 place-items-center text-neutral-400">
                        <PlatformIcon platform={proof.platform} className="size-4" />
                      </span>
                      <input
                        ref={inputRef}
                        type="url"
                        value={proof.link}
                        onChange={(event) => proof.setLink(event.target.value)}
                        placeholder={PROOF_LINK_EXAMPLES[proof.platform] ?? "https://"}
                        inputMode="url"
                        autoComplete="off"
                        aria-invalid={fieldProblem !== null}
                        aria-describedby={fieldProblem || proof.note ? "proof-message" : undefined}
                        className={cn(
                          "w-full rounded-xl border border-neutral-200 py-3 pr-3.5 pl-10 text-sm text-neutral-700 outline-none placeholder:text-neutral-400 focus:border-neutral-900",
                          isLinkValid && "pr-10",
                          fieldProblem && "border-red-400 focus:border-red-500",
                        )}
                      />
                      {isLinkValid ? (
                        <CheckCircleIcon
                          aria-hidden="true"
                          className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-neutral-900"
                        />
                      ) : null}
                    </div>
                  </label>
                  {fieldProblem || proof.note ? (
                    <p id="proof-message" className={cn("mt-2 text-[13px] leading-5", fieldProblem ? "text-red-600" : "text-neutral-500")}>
                      {fieldProblem ?? proof.note}
                    </p>
                  ) : null}
                </>
              ) : (
                <div className="flex items-stretch gap-3">
                  {proof.screenshot ? (
                    <div className="relative isolate grid aspect-[9/16] w-20 shrink-0 place-items-center overflow-hidden rounded-xl border border-neutral-200 bg-[linear-gradient(135deg,#fafafa,#e5e5e5)]">
                      <PhotoIcon aria-hidden="true" className="size-5 text-neutral-400" />
                      <button
                        type="button"
                        onClick={() => proof.setScreenshot(false)}
                        aria-label="Remove screenshot"
                        className="absolute top-1.5 right-1.5 z-10 grid size-6 place-items-center rounded-full bg-white/90 text-neutral-700 shadow-sm ring-1 ring-black/10 transition hover:bg-white hover:text-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
                      >
                        <XMarkIcon className="size-3.5" strokeWidth={2} />
                      </button>
                    </div>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => proof.setScreenshot(true)}
                    className="flex min-h-11 flex-1 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50/60 px-4 py-6 text-center transition hover:border-neutral-500 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
                  >
                    <span className="grid size-9 place-items-center rounded-full bg-white shadow-sm ring-1 ring-neutral-200">
                      <ArrowUpTrayIcon className="size-4 text-neutral-600" strokeWidth={2} />
                    </span>
                    <span className="text-[13px] font-medium text-neutral-500">{proof.screenshot ? "Replace screenshot" : "Upload a screenshot"}</span>
                  </button>
                </div>
              )}
              {!isLink && attempted && proof.problem ? <p className="mt-2 text-[13px] leading-5 text-red-600">{proof.problem}</p> : null}
            </div>

            <div className="mt-6">
              <Button
                variant="dark"
                size="lg"
                fullWidth
                iconLeft={<BanknotesIcon aria-hidden="true" className="size-4" />}
                onClick={handleSubmit}
                style={{ ...darkGradientButtonStyle, padding: "14px 20px" }}
              >
                Send proof of payment
              </Button>
            </div>
          </div>
        </MeshGradientPanel>
      </motion.div>
    </motion.div>
  );
}
