import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

interface AddItemCardProps {
  href: string;
  label: string;
  description?: string;
  className?: string;
}

/** A dashed ghost card that ends a grid: the next item's slot, waiting to be filled. */
export default function AddItemCard({ href, label, description, className }: AddItemCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex h-full min-h-[300px] flex-col items-center justify-center gap-3 rounded-[20px] border border-dashed border-neutral-300 p-6 text-center transition-[background-color,border-color] duration-150 hover:border-neutral-400 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2",
        className,
      )}
    >
      <span className="grid size-11 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-700 transition-[border-color,color,transform] duration-150 group-hover:border-neutral-300 group-hover:text-neutral-950 group-active:scale-[0.94]">
        <PlusIcon aria-hidden="true" className="size-5" strokeWidth={1.75} />
      </span>
      <span>
        <span className="block text-[14px] font-semibold text-neutral-900">{label}</span>
        {description ? <span className="mt-1 block max-w-[15rem] text-pretty text-[13px] leading-snug text-neutral-500">{description}</span> : null}
      </span>
    </Link>
  );
}
