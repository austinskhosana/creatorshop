"use client";

import { XCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import Button from "@/components/atoms/Button/Button";
import { darkGradientButtonStyle } from "@/components/atoms/Button/darkGradientStyle";
import { ModalPanel } from "@/components/molecules/ModalPanel";
import { formatDate, relativeDays } from "@/lib/brand-format";
import type { BrandShop, Shopper } from "@/lib/data/brand-schema";
import { cn } from "@/lib/utils";

interface CloseShopModalProps {
  open: boolean;
  /** After the exit animation. */
  onClosed: () => void;
  shop: BrandShop;
  shopper: Shopper;
  onClose: () => void;
  onConfirm: (message: string) => void;
}

/**
 * Closing an overdue shop ends the deal without releasing access. It always goes out with a note,
 * so the creator hears it from the brand rather than from a status change.
 */
export default function CloseShopModal({ open, onClosed, shop, shopper, onClose, onConfirm }: CloseShopModalProps) {
  const first = shopper.name.split(" ")[0];
  const [message, setMessage] = useState(
    () => `Hi ${first}, your ${shop.tierName} for ${shop.productName} was due ${formatDate(shop.deadline)} and we haven't seen it, so we're closing this shop. Thanks for your interest.`,
  );
  const [attempted, setAttempted] = useState(false);
  const invalid = attempted && !message.trim();

  return (
    <ModalPanel
      open={open}
      onOpenChange={(next) => !next && onClose()}
      onClosed={onClosed}
      title="Close this shop"
      icon={<XCircleIcon className="size-5" strokeWidth={1.75} />}
      description={`${first}'s post was due ${formatDate(shop.deadline)}, ${relativeDays(shop.deadline)}. Closing marks the shop incomplete and no access is released. Your message goes to your thread with ${first}.`}
    >
      <div className="mt-6">
        <label className="block">
          <span className="text-[13px] font-medium text-neutral-700">Message to {first}</span>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={4}
            maxLength={400}
            aria-invalid={invalid}
            className={cn(
              "mt-1.5 w-full resize-none rounded-xl border px-3.5 py-2.5 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-neutral-900",
              invalid ? "border-red-400" : "border-neutral-200",
            )}
          />
        </label>
        {invalid ? <p role="alert" className="mt-1.5 text-[13px] text-red-600">Add a short note so {first} knows why the shop closed.</p> : null}
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="secondary" size="md" onClick={onClose}>
            Keep waiting
          </Button>
          <Button
            variant="dark"
            size="md"
            onClick={() => {
              if (!message.trim()) {
                setAttempted(true);
                return;
              }
              onConfirm(message.trim());
            }}
            style={{ ...darkGradientButtonStyle, padding: "10px 18px" }}
          >
            Close and message {first}
          </Button>
        </div>
      </div>
    </ModalPanel>
  );
}
