import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RadioCardProps {
  /** Shared by every card in the group. */
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  title: string;
  description?: string;
  /** Right-aligned detail, like stock left. */
  aside?: ReactNode;
}

/** One bordered option in a radio group — a native radio underneath, so arrow keys move between cards. */
export default function RadioCard({ name, value, checked, onChange, title, description, aside }: RadioCardProps) {
  return (
    <label
      className={cn(
        "flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-3 transition-[background-color,border-color,box-shadow] duration-150 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-neutral-900 has-[:focus-visible]:ring-offset-2",
        checked ? "border-neutral-900 bg-[#fafaf9]" : "border-neutral-200 bg-white hover:border-neutral-300",
      )}
    >
      <input type="radio" name={name} value={value} checked={checked} onChange={() => onChange(value)} className="sr-only" />
      <span
        aria-hidden="true"
        className={cn("grid size-4 shrink-0 place-items-center rounded-full border transition-colors duration-150", checked ? "border-neutral-900" : "border-neutral-300")}
      >
        {checked ? <span className="size-2 rounded-full bg-neutral-900" /> : null}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-neutral-900">{title}</span>
        {description ? <span className="mt-0.5 block text-xs leading-[1.45] text-neutral-500">{description}</span> : null}
      </span>
      {aside ? <span className="shrink-0 text-xs tabular-nums text-neutral-500">{aside}</span> : null}
    </label>
  );
}
