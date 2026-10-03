"use client";

import Link from "next/link";
import { useId } from "react";
import { RadioCard } from "@/components/molecules/RadioCard";
import type { LiveCampaign } from "@/lib/store/brand-store";

/** The value for sending the intro on its own. */
export const NO_CAMPAIGN = "";

interface CampaignPickerProps {
  /** Live product pages only — nothing else can take a new creator. */
  campaigns: LiveCampaign[];
  /** The picked product page id, or `NO_CAMPAIGN`. */
  value: string;
  onChange: (productId: string) => void;
  legend: string;
  /** A line under the legend about when the campaign goes out. */
  hint?: string;
}

/** Which campaign goes with an intro: one of the live product pages, or none yet. */
export default function CampaignPicker({ campaigns, value, onChange, legend, hint }: CampaignPickerProps) {
  const name = useId();
  return (
    <fieldset>
      <legend className="text-sm font-medium text-neutral-800">{legend}</legend>
      {hint ? <p className="mt-0.5 text-xs leading-5 text-neutral-500">{hint}</p> : null}
      <div className="mt-2.5 flex max-h-[min(17rem,38vh)] flex-col gap-2 overflow-y-auto">
        {campaigns.map(({ product, remaining }) => (
          <RadioCard
            key={product.id}
            name={name}
            value={product.id}
            checked={value === product.id}
            onChange={onChange}
            title={product.name}
            description={product.tiers.map((tier) => tier.name).join(" · ")}
            aside={`${remaining} of ${product.stock} left`}
          />
        ))}
        <RadioCard
          name={name}
          value={NO_CAMPAIGN}
          checked={value === NO_CAMPAIGN}
          onChange={onChange}
          title="Just the intro"
          description="Start the conversation now and share a campaign when you're ready."
        />
      </div>
      {campaigns.length === 0 ? (
        <p className="mt-2.5 text-xs leading-5 text-neutral-500">
          No live campaigns yet.{" "}
          <Link
            href="/brand/products/new"
            className="rounded-sm font-medium text-neutral-800 underline decoration-neutral-300 underline-offset-4 transition-[text-decoration-color] duration-150 hover:decoration-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          >
            Create a product page
          </Link>{" "}
          to send one with your intro.
        </p>
      ) : null}
    </fieldset>
  );
}
