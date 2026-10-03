"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import type { ReactNode } from "react";
import { MeshGradientPanel } from "@/components/atoms/MeshGradientPanel";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

interface ModalPanelProps {
  open: boolean;
  /** Called with false on Escape, the close button, or a backdrop click. */
  onOpenChange: (open: boolean) => void;
  /** Runs after the exit animation — clear the modal's data here, not in onOpenChange. */
  onClosed?: () => void;
  title: string;
  icon?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  /** `wide` gives side-by-side content room, so a long form fits the viewport without scrolling. */
  size?: "default" | "wide";
}

/**
 * The proof-of-payment modal's look — metallic ring, white sheet, close button — on the shadcn
 * Dialog, which traps focus, locks scroll and returns focus to the trigger on close.
 */
export default function ModalPanel({ open, onOpenChange, onClosed, title, icon, description, children, size = "default" }: ModalPanelProps) {
  return (
    <Dialog open={open} onOpenChange={(next) => onOpenChange(next)} onOpenChangeComplete={(next) => !next && onClosed?.()}>
      <DialogContent className={size === "wide" ? "max-w-3xl" : undefined}>
        <MeshGradientPanel radius={30} borderWidth={6} shaded={false} className="w-full p-1.5 shadow-[0_30px_80px_rgba(0,0,0,0.22)]">
          <div className="relative rounded-[24px] bg-white p-6 sm:p-7">
            <DialogClose
              aria-label="Close"
              className="absolute top-4 right-4 grid size-9 shrink-0 place-items-center rounded-lg text-neutral-400 transition-colors duration-150 hover:bg-neutral-100 hover:text-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 sm:top-5 sm:right-5"
            >
              <XMarkIcon aria-hidden="true" className="size-4" strokeWidth={1.75} />
            </DialogClose>
            <div className="pr-10">
              <div className="flex items-center gap-3">
                {icon ? <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-xl bg-neutral-100 text-neutral-700">{icon}</span> : null}
                <DialogTitle>{title}</DialogTitle>
              </div>
              {description ? <DialogDescription className={size === "wide" ? "mt-3 max-w-xl" : "mt-3 max-w-md"}>{description}</DialogDescription> : null}
            </div>
            {children}
          </div>
        </MeshGradientPanel>
      </DialogContent>
    </Dialog>
  );
}
