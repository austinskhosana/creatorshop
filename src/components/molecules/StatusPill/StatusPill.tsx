import { cn } from "@/lib/utils";

export type StatusTone = "waiting" | "success" | "progress" | "danger" | "muted" | "neutral";

const dotColor: Record<StatusTone, string> = {
  waiting: "bg-yellow-400",
  success: "bg-[#A3FF38]",
  progress: "bg-blue-400",
  danger: "bg-red-500",
  muted: "bg-neutral-300",
  neutral: "bg-neutral-400",
};

/** A quiet bordered pill with a coloured dot — the status mark on shop and product cards. */
export default function StatusPill({ tone, label, className }: { tone: StatusTone; label: string; className?: string }) {
  return (
    <span className={cn("inline-flex shrink-0 items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-xs font-medium text-neutral-600", className)}>
      <span aria-hidden="true" className={cn("size-1.5 shrink-0 rounded-full", dotColor[tone])} />
      {label}
    </span>
  );
}
