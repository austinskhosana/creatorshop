"use client";

import {
  Pagination as PaginationRoot,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(page, totalPages);

  return (
    <PaginationRoot>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(event) => {
              event.preventDefault();
              if (page > 1) onPageChange(page - 1);
            }}
            aria-disabled={page === 1}
            tabIndex={page === 1 ? -1 : undefined}
            className={page === 1 ? "pointer-events-none opacity-50" : undefined}
          />
        </PaginationItem>

        {pages.map((p, i) =>
          p === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  onPageChange(p);
                }}
                isActive={p === page}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(event) => {
              event.preventDefault();
              if (page < totalPages) onPageChange(page + 1);
            }}
            aria-disabled={page === totalPages}
            tabIndex={page === totalPages ? -1 : undefined}
            className={page === totalPages ? "pointer-events-none opacity-50" : undefined}
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationRoot>
  );
}
