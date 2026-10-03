"use client";

import { ArrowTopRightOnSquareIcon, ArrowUturnLeftIcon, CheckBadgeIcon, LockOpenIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import Button from "@/components/atoms/Button/Button";
import { darkGradientButtonStyle } from "@/components/atoms/Button/darkGradientStyle";
import PlatformIcon from "@/components/atoms/PlatformIcon/PlatformIcon";
import { ModalPanel } from "@/components/molecules/ModalPanel";
import { accessMethodLabel, formatDate, formatMonths } from "@/lib/brand-format";
import type { AccessMethod, BrandShop, Shopper } from "@/lib/data/brand-schema";
import { cn } from "@/lib/utils";

interface ProofReviewModalProps {
  open: boolean;
  /** After the exit animation. */
  onClosed: () => void;
  shop: BrandShop;
  shopper: Shopper;
  accessMethod?: AccessMethod;
  onClose: () => void;
  onConfirm: () => void;
  onDecline: (reason: string) => void;
}

const REASONS = ["Link doesn't open", "Wrong product or price tier", "Not disclosed as sponsored", "Post was removed"];

/**
 * Proof review is a match check against what was agreed, not a creative review. Confirming is one
 * tap and releases the access payload; sending back keeps the original deadline.
 */
export default function ProofReviewModal({ open, onClosed, shop, shopper, accessMethod, onClose, onConfirm, onDecline }: ProofReviewModalProps) {
  const [declining, setDeclining] = useState(false);
  const [reason, setReason] = useState("");
  const [attempted, setAttempted] = useState(false);
  const first = shopper.name.split(" ")[0];

  return (
    <ModalPanel
      open={open}
      onOpenChange={(next) => !next && onClose()}
      onClosed={onClosed}
      title={declining ? "Send proof back" : "Review proof"}
      icon={declining ? <ArrowUturnLeftIcon className="size-5" strokeWidth={1.75} /> : <CheckBadgeIcon className="size-5" strokeWidth={1.75} />}
      description={
        declining
          ? `Tell ${first} what to fix. The shop goes back to awaiting post, and the deadline stays ${formatDate(shop.deadline)}.`
          : `${shopper.name} paid for ${shop.productName} with ${/^[aeiou]/i.test(shop.tierName) ? "an" : "a"} ${shop.tierName}. Open the post and check it matches what you agreed.`
      }
    >
      {declining ? (
        <div className="mt-6">
          <div className="flex flex-wrap gap-2">
            {REASONS.map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={reason === option}
                onClick={() => setReason(option)}
                className={cn(
                  "min-h-9 rounded-lg border px-3 text-xs font-medium transition-[background-color,border-color,color,transform] duration-150 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2",
                  reason === option ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50",
                )}
              >
                {option}
              </button>
            ))}
          </div>
          <label className="mt-4 block">
            <span className="text-[13px] font-medium text-neutral-700">Reason</span>
            <textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              rows={3}
              maxLength={200}
              aria-invalid={attempted && !reason.trim()}
              placeholder="A short note the creator will see in your thread"
              className={cn(
                "mt-1.5 w-full resize-none rounded-xl border px-3.5 py-2.5 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-neutral-900",
                attempted && !reason.trim() ? "border-red-400" : "border-neutral-200",
              )}
            />
          </label>
          {attempted && !reason.trim() ? <p role="alert" className="mt-1.5 text-[13px] text-red-600">Add a short reason so {first} knows what to fix.</p> : null}
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="secondary" size="md" onClick={() => setDeclining(false)}>
              Back
            </Button>
            <Button
              variant="dark"
              size="md"
              onClick={() => {
                if (!reason.trim()) {
                  setAttempted(true);
                  return;
                }
                onDecline(reason.trim());
              }}
              style={{ ...darkGradientButtonStyle, padding: "10px 18px" }}
            >
              Send back to {first}
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <a
            href={shop.proofUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-12 items-center gap-3 rounded-xl border border-neutral-200 px-3.5 py-2.5 transition-[background-color,border-color] duration-150 hover:border-neutral-300 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          >
            <span className="grid size-5 shrink-0 place-items-center text-neutral-500">
              <PlatformIcon platform={shop.tierName} className="size-4" />
            </span>
            <span className="min-w-0 flex-1 truncate text-sm text-neutral-700">{shop.proofUrl}</span>
            <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-neutral-900">
              Open post
              <ArrowTopRightOnSquareIcon aria-hidden="true" className="size-3.5" />
            </span>
            <span className="sr-only">(opens in a new tab)</span>
          </a>

          <dl className="mt-4 divide-y divide-neutral-100 rounded-xl bg-neutral-50 px-4 text-sm">
            <div className="flex justify-between gap-4 py-2.5"><dt className="text-neutral-500">Price tier</dt><dd className="font-medium text-neutral-900">{shop.tierName}</dd></div>
            <div className="flex justify-between gap-4 py-2.5"><dt className="text-neutral-500">Releases</dt><dd className="text-right font-medium text-neutral-900">{formatMonths(shop.months)} of {shop.productName}{accessMethod ? ` · ${accessMethodLabel(accessMethod)}` : ""}</dd></div>
            <div className="flex justify-between gap-4 py-2.5"><dt className="text-neutral-500">Due</dt><dd className="font-medium tabular-nums text-neutral-900">{formatDate(shop.deadline)}</dd></div>
          </dl>

          <Button
            variant="dark"
            size="lg"
            fullWidth
            iconLeft={<LockOpenIcon aria-hidden="true" className="size-4" />}
            onClick={onConfirm}
            className="mt-6"
            style={{ ...darkGradientButtonStyle, padding: "14px 20px" }}
          >
            Confirm and release access
          </Button>
          <button
            type="button"
            onClick={() => setDeclining(true)}
            className="mt-2 flex min-h-10 w-full items-center justify-center rounded-xl text-[13px] font-medium text-neutral-500 transition-colors duration-150 hover:bg-neutral-50 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
          >
            Something&apos;s wrong — send it back
          </button>
        </div>
      )}
    </ModalPanel>
  );
}
