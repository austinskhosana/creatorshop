import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { CornerDots } from "@/components/atoms/CornerDots";
import { StatusDot } from "@/components/atoms/StatusDot";
import { cn } from "@/lib/utils";

export interface AttentionStat {
  label: string;
  value: number;
  href: string;
  /** "alert" marks a number that's late, like overdue posts. */
  tone?: "default" | "alert";
}

/**
 * A row of linked counts, each its own card. Zero reads as quiet grey so the numbers that need
 * the brand stand out; each card opens the screen the number comes from.
 */
export default function AttentionStats({ stats, className }: { stats: AttentionStat[]; className?: string }) {
  return (
    <div className={cn("@container text-left", className)}>
      <div className="grid h-full gap-3 @lg:grid-flow-col @lg:auto-cols-fr">
        {stats.map((stat) => {
          const alert = stat.tone === "alert" && stat.value > 0;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="group relative isolate flex min-h-[148px] flex-col justify-between gap-8 rounded-[20px] border border-neutral-200 bg-white p-6 transition-[border-color,transform] duration-150 hover:border-neutral-300 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 @max-lg:min-h-0 @max-lg:gap-5"
            >
              <CornerDots />
              <div className="flex items-center justify-between gap-3">
                <p className="flex items-center gap-1 text-[13px] font-medium text-neutral-600">
                  {alert ? <StatusDot tone="danger" /> : null}
                  {stat.label}
                </p>
                <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#A3FF38] text-neutral-950">
                  <ArrowRightIcon className="size-3.5 transition-transform duration-150 motion-safe:group-hover:translate-x-0.5" />
                </span>
              </div>
              {/* Proportional digits so a lone "1" sits flush left instead of centred in a "0"-wide slot.
                  The negative bottom margin trims the line box below the baseline, matching the arrow's top inset. */}
              <p className={cn("-mb-1 text-[36px] leading-none font-bold tracking-[-0.04em]", stat.value > 0 ? "text-neutral-950" : "text-neutral-300")}>{stat.value}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
