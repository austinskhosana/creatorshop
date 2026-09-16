import { cn } from "@/lib/utils";

interface PaymentOptionRowProps {
  label: string;
  meta: string;
  price: number;
  selected: boolean;
  onSelect: () => void;
}

export default function PaymentOptionRow({ label, meta, price, selected, onSelect }: PaymentOptionRowProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "flex w-full items-center justify-between rounded-2xl border px-4 py-3.5 text-left transition-colors duration-150",
        selected ? "border-neutral-900 bg-neutral-50" : "border-neutral-200 hover:border-neutral-300",
      )}
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className={cn(
            "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
            selected ? "border-neutral-900" : "border-neutral-300",
          )}
        >
          {selected && <span className="h-2 w-2 rounded-full bg-neutral-900" />}
        </span>
        <span>
          <span className="block text-[14px] font-medium text-neutral-900">{label}</span>
          <span className="block text-[12px] text-neutral-400">{meta}</span>
        </span>
      </div>
      <span className="text-[14px] font-semibold tabular-nums text-neutral-900">${price}</span>
    </button>
  );
}
