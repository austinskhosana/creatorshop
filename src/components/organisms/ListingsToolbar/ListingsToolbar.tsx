interface SelectOption {
  value: string;
  label: string;
}

interface ListingsToolbarProps {
  resultCount: number;
  platform: string;
  onPlatformChange: (value: string) => void;
  priceTier: string;
  onPriceTierChange: (value: string) => void;
  accessLength: string;
  onAccessLengthChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
  inStockOnly: boolean;
  onInStockOnlyChange: (value: boolean) => void;
}

const PLATFORM_OPTIONS: SelectOption[] = [
  { value: "all", label: "Any platform" },
  { value: "Instagram", label: "Instagram" },
  { value: "TikTok", label: "TikTok" },
  { value: "YouTube", label: "YouTube" },
  { value: "X", label: "X" },
];

const PRICE_TIER_OPTIONS: SelectOption[] = [
  { value: "all", label: "Any price tier" },
  { value: "under-150", label: "Under $150" },
  { value: "150-250", label: "$150–$250" },
  { value: "over-250", label: "$250+" },
];

const ACCESS_LENGTH_OPTIONS: SelectOption[] = [
  { value: "all", label: "Any access duration" },
  { value: "1", label: "1 month" },
  { value: "3", label: "3 months" },
  { value: "6", label: "6 months" },
  { value: "12", label: "12 months" },
];

const SORT_OPTIONS: SelectOption[] = [
  { value: "newest", label: "Latest" },
  { value: "popular", label: "Most popular" },
  { value: "ending", label: "Ending soon" },
];

function ChevronIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none absolute top-1/2 right-2.5 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function DropdownSelect({
  value,
  onChange,
  options,
  ariaLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  ariaLabel: string;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={ariaLabel}
        className="appearance-none rounded-lg border border-neutral-200 bg-white py-2 pr-8 pl-3.5 text-[13px] font-medium text-neutral-700 transition-colors duration-150 hover:border-neutral-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronIcon />
    </div>
  );
}

export default function ListingsToolbar({
  resultCount,
  platform,
  onPlatformChange,
  priceTier,
  onPriceTierChange,
  accessLength,
  onAccessLengthChange,
  sort,
  onSortChange,
  inStockOnly,
  onInStockOnlyChange,
}: ListingsToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <DropdownSelect value={platform} onChange={onPlatformChange} options={PLATFORM_OPTIONS} ariaLabel="Filter by platform" />
        <DropdownSelect value={priceTier} onChange={onPriceTierChange} options={PRICE_TIER_OPTIONS} ariaLabel="Filter by price tier" />
        <DropdownSelect value={accessLength} onChange={onAccessLengthChange} options={ACCESS_LENGTH_OPTIONS} ariaLabel="Filter by access duration" />
        <button
          type="button"
          onClick={() => onInStockOnlyChange(!inStockOnly)}
          aria-pressed={inStockOnly}
          className={[
            "rounded-lg border px-3.5 py-2 text-[13px] font-medium transition-[background-color,border-color,color,transform] duration-150 active:scale-[0.96]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2",
            inStockOnly ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-200 text-neutral-700 hover:border-neutral-300",
          ].join(" ")}
        >
          In stock only
        </button>
      </div>

      <div className="flex items-center gap-4">
        <p className="text-[13px] text-neutral-400">
          Showing <span className="font-medium tabular-nums text-neutral-700">{resultCount}</span>{" "}
          {resultCount === 1 ? "product" : "products"}
        </p>
        <DropdownSelect value={sort} onChange={onSortChange} options={SORT_OPTIONS} ariaLabel="Sort products" />
      </div>
    </div>
  );
}
