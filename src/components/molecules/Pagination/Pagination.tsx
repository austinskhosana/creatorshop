"use client";

import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getPageNumbers(page: number, totalPages: number): (number | "ellipsis")[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);

  const keep = new Set([1, totalPages, page - 1, page, page + 1]);
  const sorted = [...keep].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);

  const result: (number | "ellipsis")[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) result.push("ellipsis");
    result.push(p);
  });
  return result;
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-3.5 w-3.5", direction === "left" && "rotate-180")}
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

const navButtonClasses =
  "flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 transition-colors duration-150 hover:bg-neutral-50 hover:text-neutral-900 active:scale-[0.96] disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2";

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(page, totalPages);

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1.5">
      <button type="button" onClick={() => onPageChange(page - 1)} disabled={page === 1} aria-label="Previous page" className={navButtonClasses}>
        <ChevronIcon direction="left" />
      </button>

      {pages.map((p, i) =>
        p === "ellipsis" ? (
          <span key={`ellipsis-${i}`} className="flex h-8 w-8 items-center justify-center text-[13px] text-neutral-400">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg text-[13px] font-medium tabular-nums transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2",
              p === page ? "bg-neutral-900 text-white" : "text-neutral-600 hover:bg-neutral-100 active:scale-[0.96]",
            )}
          >
            {p}
          </button>
        ),
      )}

      <button type="button" onClick={() => onPageChange(page + 1)} disabled={page === totalPages} aria-label="Next page" className={navButtonClasses}>
        <ChevronIcon direction="right" />
      </button>
    </nav>
  );
}
