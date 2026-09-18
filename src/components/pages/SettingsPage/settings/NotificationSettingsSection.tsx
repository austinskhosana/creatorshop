"use client";

import {
  ChatBubbleLeftRightIcon,
  ClockIcon,
  ShoppingBagIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { SectionTitle } from "./SettingsPrimitives";

const preferenceCopy = [
  [ShoppingBagIcon, "Shop updates", "Approvals, declines, and access unlocks"],
  [ChatBubbleLeftRightIcon, "Messages", "A creator or brand writes in your thread"],
  [ClockIcon, "Deadline nudges", "Three days, one day, and on the delivery day"],
  [StarIcon, "Ratings & receipts", "Completed-shop records and rating prompts"],
] as const;

export function NotificationSettingsSection() {
  const [preferences, setPreferences] = useState([true, true, true, false]);

  return (
    <section className="rounded-[20px] bg-white p-5 sm:p-7">
      <SectionTitle title="Stay in the loop, selectively" description="Switch on the updates that keep projects moving and leave the rest behind." />
      <div className="mt-6 space-y-3">
        {preferenceCopy.map(([Icon, label, description], index) => (
          <div key={label} className="flex min-h-[4.5rem] items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-neutral-100 text-neutral-700"><Icon className="size-[19px]" /></span>
            <div id={`preference-${index}`} className="min-w-0 flex-1"><p className="text-sm font-semibold">{label}</p><p className="mt-0.5 text-xs text-neutral-500">{description}</p></div>
            <Switch checked={preferences[index]} onCheckedChange={(checked) => setPreferences((current) => current.map((value, itemIndex) => itemIndex === index ? checked : value))} aria-labelledby={`preference-${index}`} />
          </div>
        ))}
      </div>
    </section>
  );
}

