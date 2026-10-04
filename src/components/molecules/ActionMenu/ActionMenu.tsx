"use client";

import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { Fragment, type ReactNode } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface ActionMenuItem {
  label: string;
  icon?: ReactNode;
  onSelect: () => void;
  tone?: "default" | "danger";
  disabled?: boolean;
}

interface ActionMenuProps {
  items: ActionMenuItem[];
  /** Names the trigger for screen readers, e.g. "More actions for Fernpad Pro". */
  label: string;
  /** "outline" is a bordered 36px button for cards; "ghost" is a bare 40px icon button for toolbars and headers. */
  appearance?: "outline" | "ghost";
  className?: string;
}

const TRIGGER_STYLES = {
  outline:
    "size-9 border border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50 focus-visible:ring-offset-2 data-[popup-open]:border-neutral-300 data-[popup-open]:bg-neutral-50",
  ghost: "size-10 hover:bg-neutral-100 data-[popup-open]:bg-neutral-100",
};

/** A "⋯" button that opens a short list of actions. Danger items sit below a divider. */
export default function ActionMenu({ items, label, appearance = "outline", className }: ActionMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={label}
        className={cn(
          "grid place-items-center rounded-lg text-neutral-500 transition-[background-color,color,border-color,transform] duration-150 hover:text-neutral-900 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 data-[popup-open]:text-neutral-900",
          TRIGGER_STYLES[appearance],
          className,
        )}
      >
        <EllipsisHorizontalIcon aria-hidden="true" className={appearance === "ghost" ? "size-5" : "size-[18px]"} strokeWidth={1.75} />
      </DropdownMenuTrigger>
      <DropdownMenuContent aria-label={label}>
        {items.map((item, index) => {
          const danger = item.tone === "danger";
          const firstDanger = danger && items[index - 1]?.tone !== "danger" && index > 0;
          return (
            <Fragment key={item.label}>
              {firstDanger ? <DropdownMenuSeparator /> : null}
              <DropdownMenuItem variant={danger ? "destructive" : "default"} disabled={item.disabled} onClick={item.onSelect}>
                {item.icon ? <span aria-hidden="true" className="grid size-4 place-items-center">{item.icon}</span> : null}
                {item.label}
              </DropdownMenuItem>
            </Fragment>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
