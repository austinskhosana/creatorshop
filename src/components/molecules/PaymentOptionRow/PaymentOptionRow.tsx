import { cn } from "@/lib/utils";

interface PaymentOptionRowProps {
  label: string;
  meta: string;
  price?: number;
  selected: boolean;
  onSelect: () => void;
  showPrice?: boolean;
}

function InstagramIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 shrink-0 text-neutral-500">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="3.75" />
      <path d="M17.7 6.55h.01" />
    </svg>
  );
}

export default function PaymentOptionRow({ label, meta, price, selected, onSelect, showPrice = true }: PaymentOptionRowProps) {
  const isInstagram = label.toLowerCase().startsWith("ig ");

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "flex w-full items-center justify-between rounded-[10px] border px-3.5 py-3 text-left transition-colors duration-150",
        selected ? "border-neutral-900 bg-[#fafaf9]" : "border-neutral-200 bg-white hover:border-neutral-300",
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
          <span className="flex items-center gap-1.5 text-[14px] leading-5 font-medium tracking-[-0.01em] text-neutral-900">
            {isInstagram && <InstagramIcon />}
            {label}
          </span>
          <span className="mt-0.5 block text-[12px] leading-4 font-medium tracking-[-0.01em] text-neutral-400">{meta}</span>
        </span>
      </div>
      {showPrice && price !== undefined && <span className="text-[16px] leading-5 font-semibold tracking-[-0.02em] tabular-nums text-neutral-900">${price}</span>}
    </button>
  );
}
