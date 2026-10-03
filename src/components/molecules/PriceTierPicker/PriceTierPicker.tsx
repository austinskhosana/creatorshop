"use client";

import PlatformIcon from "@/components/atoms/PlatformIcon/PlatformIcon";
import { formatMonths, formatUsd } from "@/lib/brand-format";
import type { PriceTier } from "@/lib/data/brand-schema";
import { cn } from "@/lib/utils";

interface PriceTierPickerProps {
  tiers: PriceTier[];
  value: string;
  onChange: (tierId: string) => void;
  /** Names the radio group so two pickers on a page don't share selection. */
  name: string;
  disabled?: boolean;
}

/** Price tiers as size-style options: the content type a creator posts, then the access it buys. */
export default function PriceTierPicker({ tiers, value, onChange, name, disabled = false }: PriceTierPickerProps) {
  return (
    <fieldset disabled={disabled} className="space-y-2.5">
      <legend className="sr-only">Pick what you&apos;ll post</legend>
      {tiers.map((tier) => {
        const selected = tier.id === value;
        return (
          <label
            key={tier.id}
            className={cn(
              "flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl border bg-white px-4 py-3 transition-[border-color,background-color,box-shadow] duration-150 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-neutral-900 has-[:focus-visible]:ring-offset-2 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50",
              selected ? "border-neutral-900 shadow-[0_0_0_1px_rgb(23,23,23)]" : "border-neutral-200 hover:border-neutral-300",
            )}
          >
            <input type="radio" name={name} value={tier.id} checked={selected} onChange={() => onChange(tier.id)} className="sr-only" />
            <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-xl bg-neutral-100 text-neutral-900">
              <PlatformIcon platform={tier.name} className="size-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-neutral-950">{tier.name}</span>
              <span className="mt-0.5 block text-xs tabular-nums text-neutral-500">{formatMonths(tier.months)} access</span>
            </span>
            <span className="shrink-0 text-right">
              <span className="block text-sm font-semibold tabular-nums text-neutral-950">{formatUsd(tier.retailValue)}</span>
              <span className="mt-0.5 block text-[11px] text-neutral-400">Retail value</span>
            </span>
          </label>
        );
      })}
    </fieldset>
  );
}
