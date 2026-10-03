"use client";

import { AdjustmentsHorizontalIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Dropdown } from "@/components/molecules/Dropdown";
import { Popover, PopoverContent, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";
import { SOCIAL_PLATFORMS } from "@/lib/socials";

export const AUDIENCE_BUCKETS = [
  { value: "any", label: "Any audience", min: 0, max: Infinity },
  { value: "small", label: "Under 25K", min: 0, max: 25_000 },
  { value: "mid", label: "25K – 100K", min: 25_000, max: 100_000 },
  { value: "large", label: "100K+", min: 100_000, max: Infinity },
];

export interface CreatorFilterValues {
  query: string;
  niche: string;
  platform: string;
  audience: string;
}

export const NO_FILTERS: CreatorFilterValues = { query: "", niche: "all", platform: "all", audience: "any" };

interface CreatorFiltersProps {
  values: CreatorFilterValues;
  onChange: (patch: Partial<CreatorFilterValues>) => void;
  niches: string[];
  /** Creators matching the current filters. */
  count: number;
  onClear: () => void;
}

export function activeFilterCount({ query, niche, platform, audience }: CreatorFilterValues) {
  return [query.trim() !== "", niche !== "all", platform !== "all", audience !== "any"].filter(Boolean).length;
}

const nicheOptions = (niches: string[]) => [{ value: "all", label: "All niches" }, ...niches.map((item) => ({ value: item, label: item }))];
const platformOptions = [{ value: "all", label: "All platforms" }, ...SOCIAL_PLATFORMS.map(({ name }) => ({ value: name, label: name }))];
const audienceOptions = AUDIENCE_BUCKETS.map(({ value, label }) => ({ value, label }));

function SearchField({ value, onChange, className = "" }: { value: string; onChange: (value: string) => void; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <MagnifyingGlassIcon aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search creators"
        aria-label="Search creators"
        className="w-full rounded-lg border border-neutral-200 bg-white py-2 pr-3 pl-9 text-[13px] text-neutral-900 placeholder:text-neutral-400 transition-colors duration-150 focus:border-neutral-400 focus:outline-none"
      />
    </div>
  );
}

/** The grid's toolbar: search and the three filters in a row, with the match count. */
export function CreatorFilterBar({ values, onChange, niches, count }: CreatorFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <SearchField value={values.query} onChange={(query) => onChange({ query })} className="sm:w-64" />
      <div className="flex flex-wrap items-center gap-2">
        <Dropdown ariaLabel="Niche" value={values.niche} onChange={(niche) => onChange({ niche })} options={nicheOptions(niches)} />
        <Dropdown ariaLabel="Platform" value={values.platform} onChange={(platform) => onChange({ platform })} options={platformOptions} />
        <Dropdown ariaLabel="Audience size" value={values.audience} onChange={(audience) => onChange({ audience })} options={audienceOptions} />
      </div>
      <p className="text-[13px] tabular-nums text-neutral-500 sm:ml-auto" aria-live="polite">
        {count} {count === 1 ? "creator" : "creators"}
      </p>
    </div>
  );
}

/** Swipe mode's one filter button. The same filters as the grid, folded away so the card owns the screen. */
export function CreatorFilterPopover({ values, onChange, niches, count, onClear }: CreatorFiltersProps) {
  const active = activeFilterCount(values);
  const fields = [
    { label: "Niche", node: <Dropdown variant="field" ariaLabel="Niche" value={values.niche} onChange={(niche) => onChange({ niche })} options={nicheOptions(niches)} /> },
    { label: "Platform", node: <Dropdown variant="field" ariaLabel="Platform" value={values.platform} onChange={(platform) => onChange({ platform })} options={platformOptions} /> },
    { label: "Audience", node: <Dropdown variant="field" ariaLabel="Audience size" value={values.audience} onChange={(audience) => onChange({ audience })} options={audienceOptions} /> },
  ];

  return (
    <Popover>
      <PopoverTrigger
        aria-label={active > 0 ? `Filters, ${active} on` : "Filters"}
        className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-2.5 py-2 text-[13px] font-medium sm:pr-3 text-neutral-700 transition-[border-color,transform] duration-150 hover:border-neutral-300 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 data-[popup-open]:border-neutral-300"
      >
        <AdjustmentsHorizontalIcon aria-hidden="true" className="size-4" strokeWidth={1.75} />
        <span className="hidden sm:inline">Filters</span>
        {active > 0 ? (
          <span aria-hidden="true" className="grid h-[18px] min-w-[18px] place-items-center rounded-full bg-neutral-950 px-1 text-[11px] font-semibold tabular-nums text-white">
            {active}
          </span>
        ) : null}
      </PopoverTrigger>
      <PopoverContent className="w-[min(20rem,calc(100vw-2rem))]">
        <div className="flex items-baseline justify-between gap-3">
          <PopoverTitle className="text-sm font-semibold text-neutral-950">Filters</PopoverTitle>
          <p className="text-[13px] tabular-nums text-neutral-400" aria-live="polite">
            {count} {count === 1 ? "creator" : "creators"}
          </p>
        </div>
        <SearchField value={values.query} onChange={(query) => onChange({ query })} className="mt-4" />
        <div className="mt-4 space-y-3">
          {fields.map((field) => (
            <div key={field.label}>
              <p aria-hidden="true" className="mb-1.5 text-xs font-medium text-neutral-500">
                {field.label}
              </p>
              {field.node}
            </div>
          ))}
        </div>
        {active > 0 ? (
          <button
            type="button"
            onClick={onClear}
            className="mt-4 flex min-h-10 w-full items-center justify-center rounded-xl text-[13px] font-medium text-neutral-500 transition-[background-color,color] duration-150 hover:bg-neutral-50 hover:text-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
          >
            Clear filters
          </button>
        ) : null}
      </PopoverContent>
    </Popover>
  );
}
