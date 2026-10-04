import { cn } from "@/lib/utils";

export type StatusTone = "waiting" | "success" | "progress" | "danger" | "muted" | "neutral";

// A solid core inside a lighter halo of the same hue. Halo strengths differ per tone so every
// ring sits at the same weight on white; brand lime is too pale to anchor a dot, so success
// takes the deeper lime edge the app's lime buttons use as its core.
const toneClass: Record<StatusTone, { core: string; halo: string }> = {
  waiting: { core: "bg-yellow-400", halo: "bg-yellow-400/30" },
  success: { core: "bg-[#71D200]", halo: "bg-[#A3FF38]/50" },
  progress: { core: "bg-blue-400", halo: "bg-blue-400/15" },
  danger: { core: "bg-red-500", halo: "bg-red-500/10" },
  muted: { core: "bg-neutral-300", halo: "bg-neutral-300/40" },
  neutral: { core: "bg-neutral-400", halo: "bg-neutral-400/20" },
};

/** A status indicator: a coloured dot ringed by a soft halo of its own tone. Decorative — pair it with a text label. */
export default function StatusDot({ tone, className }: { tone: StatusTone; className?: string }) {
  const { core, halo } = toneClass[tone];
  return (
    <span aria-hidden="true" className={cn("inline-flex size-3 shrink-0 items-center justify-center rounded-full", halo, className)}>
      <span className={cn("size-1.5 rounded-full", core)} />
    </span>
  );
}
