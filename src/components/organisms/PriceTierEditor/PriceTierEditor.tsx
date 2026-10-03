"use client";

import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Dropdown from "@/components/molecules/Dropdown/Dropdown";
import { ACCESS_MONTHS, contentTypesFor, formatMonths, tierPlatform } from "@/lib/brand-format";
import type { AccessMonths, PriceTier } from "@/lib/data/brand-schema";
import { cn } from "@/lib/utils";

/** A tier as typed: the retail value stays a string until the form saves, so the field can be empty. */
export interface PriceTierInput extends Omit<PriceTier, "retailValue"> {
  retailValue: string;
}

interface PriceTierEditorProps {
  /** Every tier posts to this platform. Content types on it can each be used once. */
  platform: string;
  tiers: PriceTierInput[];
  onChange: (tiers: PriceTierInput[]) => void;
  /** Per-row problem, keyed by tier id. */
  errors?: Record<string, string>;
}

/** A blank tier on `platform`, using the first content type not already taken. */
export function newTier(platform = "Instagram", taken: string[] = []): PriceTierInput {
  const types = contentTypesFor(platform);
  return { id: crypto.randomUUID(), name: types.find((type) => !taken.includes(type)) ?? types[0], months: 3, retailValue: "" };
}

/** Moves a tier set to another platform, keeping the first tier's access and value. */
export function retargetTiers(tiers: PriceTierInput[], platform: string): PriceTierInput[] {
  if (tiers.length > 0 && tierPlatform(tiers[0].name) === platform) return tiers;
  const [first] = tiers;
  return [{ ...newTier(platform), months: first?.months ?? 3, retailValue: first?.retailValue ?? "" }];
}

/** Rows of price tiers — the content types a creator can pay with on one platform, like sizes on a product page. */
export default function PriceTierEditor({ platform, tiers, onChange, errors = {} }: PriceTierEditorProps) {
  const update = (id: string, patch: Partial<PriceTierInput>) => onChange(tiers.map((tier) => (tier.id === id ? { ...tier, ...patch } : tier)));
  const types = contentTypesFor(platform);
  const used = tiers.map((tier) => tier.name);

  return (
    <div className="@container">
      <div className="hidden grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,0.8fr)_2.5rem] gap-2.5 px-1 pb-2 text-xs font-medium text-neutral-500 @lg:grid">
        <span>Pay with</span>
        <span>Access</span>
        <span>Retail value</span>
        <span className="sr-only">Remove</span>
      </div>
      <ul className="space-y-2.5">
        {tiers.map((tier, index) => (
          <li key={tier.id} className="rounded-2xl border border-neutral-200 p-2.5 @lg:border-0 @lg:p-0">
            {/* Narrow rows favour the access field so "12 months" fits; the dollar value is a few digits. */}
            <div className="grid grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)_2.5rem] gap-2.5 @lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,0.8fr)_2.5rem] @lg:items-start">
              <div className="col-span-3 @lg:col-span-1">
                <Dropdown
                  variant="field"
                  ariaLabel={`Price tier ${index + 1}: content type`}
                  value={tier.name}
                  onChange={(name) => update(tier.id, { name })}
                  options={types.filter((type) => type === tier.name || !used.includes(type)).map((label) => ({ value: label, label }))}
                />
              </div>
              <Dropdown
                variant="field"
                ariaLabel={`Price tier ${index + 1}: access duration`}
                value={String(tier.months)}
                onChange={(months) => update(tier.id, { months: Number(months) as AccessMonths })}
                options={ACCESS_MONTHS.map((months) => ({ value: String(months), label: formatMonths(months) }))}
              />
              <label className="relative block">
                <span className="sr-only">Price tier {index + 1}: retail value in US dollars</span>
                <span aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-sm text-neutral-400">$</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  step={1}
                  value={tier.retailValue}
                  onChange={(event) => update(tier.id, { retailValue: event.target.value })}
                  placeholder="0"
                  aria-invalid={Boolean(errors[tier.id])}
                  className={cn(
                    "w-full rounded-xl border bg-white py-2.5 pr-3 pl-7 text-sm tabular-nums text-neutral-900 placeholder:text-neutral-400 transition-[border-color,box-shadow] duration-150 focus:ring-2 focus:outline-none",
                    errors[tier.id] ? "border-red-300 focus:border-red-400 focus:ring-red-200" : "border-neutral-200 focus:border-neutral-400 focus:ring-neutral-200",
                  )}
                />
              </label>
              <button
                type="button"
                onClick={() => onChange(tiers.filter((item) => item.id !== tier.id))}
                disabled={tiers.length === 1}
                aria-label={`Remove price tier ${index + 1}`}
                className="grid h-10 w-10 place-items-center rounded-xl text-neutral-400 transition-[background-color,color] duration-150 hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <TrashIcon aria-hidden="true" className="size-4" />
              </button>
            </div>
            {errors[tier.id] ? <p role="alert" className="mt-1.5 px-1 text-xs text-red-500">{errors[tier.id]}</p> : null}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => onChange([...tiers, newTier(platform, used)])}
        disabled={tiers.length >= types.length}
        className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-xl border border-dashed border-neutral-300 px-3.5 text-[13px] font-medium text-neutral-700 transition-[background-color,border-color,transform] duration-150 hover:border-neutral-400 hover:bg-neutral-50 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <PlusIcon aria-hidden="true" className="size-4" />
        Add a price tier
      </button>
      <p className="mt-2 text-xs text-neutral-400">
        {types.length === 1 ? `${platform} has one content type, so this page has one tier.` : `Up to ${types.length} tiers, one per ${platform} content type. Every product page needs at least one.`}
      </p>
    </div>
  );
}
