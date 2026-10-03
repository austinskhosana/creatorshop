"use client";

import { useId } from "react";
import { RadioCard } from "@/components/molecules/RadioCard";

export type SendMode = "review" | "auto";

interface SendModePickerProps {
  value: SendMode;
  onChange: (mode: SendMode) => void;
}

/** What a right swipe does with the brand's intro: open it to review, or send it straight away. */
export default function SendModePicker({ value, onChange }: SendModePickerProps) {
  const name = useId();
  return (
    <fieldset>
      <legend className="text-sm font-medium text-neutral-800">When you swipe right</legend>
      <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
        <RadioCard
          name={name}
          value="review"
          checked={value === "review"}
          onChange={() => onChange("review")}
          title="Review each one"
          description="Opens your intro so you can tailor it before it sends."
        />
        <RadioCard
          name={name}
          value="auto"
          checked={value === "auto"}
          onChange={() => onChange("auto")}
          title="Send automatically"
          description="Sends straight away. Undo takes it back."
        />
      </div>
    </fieldset>
  );
}
