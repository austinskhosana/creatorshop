import { StatusDot, type StatusTone } from "@/components/atoms/StatusDot";
import { cn } from "@/lib/utils";

export type { StatusTone };

/** A quiet bordered pill with a haloed status dot — the status mark on shop and product cards. */
export default function StatusPill({ tone, label, className }: { tone: StatusTone; label: string; className?: string }) {
  return (
    <span className={cn("inline-flex shrink-0 items-center gap-1 rounded-full border border-neutral-200 bg-white py-1 pr-2.5 pl-2 text-xs font-medium text-neutral-600", className)}>
      <StatusDot tone={tone} />
      {label}
    </span>
  );
}
