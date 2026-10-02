import { Dropdown, type DropdownOption } from "@/components/molecules/Dropdown";

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

const PLATFORM_OPTIONS: DropdownOption[] = [
  { value: "all", label: "Any platform" },
  { value: "Instagram", label: "Instagram" },
  { value: "TikTok", label: "TikTok" },
  { value: "YouTube", label: "YouTube" },
  { value: "X", label: "X" },
];

const PRICE_TIER_OPTIONS: DropdownOption[] = [
  { value: "all", label: "Any price tier" },
  { value: "under-150", label: "Under $150" },
  { value: "150-250", label: "$150–$250" },
  { value: "over-250", label: "$250+" },
];

const ACCESS_LENGTH_OPTIONS: DropdownOption[] = [
  { value: "all", label: "Any access duration" },
  { value: "1", label: "1 month" },
  { value: "3", label: "3 months" },
  { value: "6", label: "6 months" },
  { value: "12", label: "12 months" },
];

const SORT_OPTIONS: DropdownOption[] = [
  { value: "newest", label: "Latest" },
  { value: "popular", label: "Most popular" },
  { value: "ending", label: "Ending soon" },
];

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
        <Dropdown value={platform} onChange={onPlatformChange} options={PLATFORM_OPTIONS} ariaLabel="Filter by platform" />
        <Dropdown value={priceTier} onChange={onPriceTierChange} options={PRICE_TIER_OPTIONS} ariaLabel="Filter by price tier" />
        <Dropdown value={accessLength} onChange={onAccessLengthChange} options={ACCESS_LENGTH_OPTIONS} ariaLabel="Filter by access duration" />
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
        <Dropdown align="end" value={sort} onChange={onSortChange} options={SORT_OPTIONS} ariaLabel="Sort products" />
      </div>
    </div>
  );
}
