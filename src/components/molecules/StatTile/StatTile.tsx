import Link from "next/link";
import { cn } from "@/lib/utils";

interface StatTileProps {
  label: string;
  value: string | number;
  sub?: string;
  /** Makes the whole tile a link to where the number comes from. */
  href?: string;
  /** Draws attention when the number needs action, e.g. overdue posts. */
  emphasis?: boolean;
}

export default function StatTile({ label, value, sub, href, emphasis = false }: StatTileProps) {
  const className = cn(
    "flex flex-1 flex-col gap-1 rounded-[20px] border bg-white px-5 py-4",
    emphasis ? "border-neutral-900" : "border-neutral-200",
    href && "transition-[border-color,transform] duration-150 hover:border-neutral-400 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2",
  );
  const content = (
    <>
      <p className="text-xs font-medium text-neutral-500">{label}</p>
      <p className="text-[28px] leading-none font-bold tabular-nums text-neutral-950">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-neutral-400">{sub}</p>}
    </>
  );
  return href ? (
    <Link href={href} className={className}>
      {content}
    </Link>
  ) : (
    <div className={className}>{content}</div>
  );
}
