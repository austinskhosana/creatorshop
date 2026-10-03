import { cn } from "@/lib/utils";

interface StockMeterProps {
  remaining: number;
  total: number;
  className?: string;
}

/** "3 of 12 spots left" over a thin bar — stock on a product page, read at a glance. */
export default function StockMeter({ remaining, total, className }: StockMeterProps) {
  const sold = total - remaining;
  const percent = total > 0 ? Math.min(100, (sold / total) * 100) : 0;
  const label = remaining === 0 ? "Sold out" : remaining <= Math.max(1, Math.floor(total * 0.2)) ? "Almost sold out" : null;

  if (total <= 0) {
    return <p className={cn("text-[13px] text-neutral-400", className)}>No stock set yet</p>;
  }

  return (
    <div className={cn("min-w-0", className)}>
      <p className="text-[13px] font-medium tabular-nums text-neutral-900">
        {remaining} of {total} spots left
        {label ? <span className="ml-1.5 font-normal text-neutral-500">· {label}</span> : null}
      </p>
      <div
        role="meter"
        aria-label="Spots sold"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={sold}
        className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-neutral-950"
      >
        <div className="h-full rounded-full bg-[#A3FF38] transition-[width] duration-300 ease-out" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
