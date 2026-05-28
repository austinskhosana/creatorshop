import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse rounded-lg bg-gray-100", className)}
    />
  );
}

export function SkeletonText({ lines = 1, className }: { lines?: number; className?: string }) {
  return (
    <div aria-hidden="true" className={cn("flex flex-col gap-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn("h-4", i === lines - 1 && lines > 1 ? "w-3/4" : "w-full")}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("flex flex-col rounded-3xl border border-gray-100 bg-white p-3 gap-3", className)}
    >
      <Skeleton className="h-36 rounded-2xl" />
      <div className="flex flex-col gap-2 px-1 flex-1">
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
        <Skeleton className="h-4 w-40" />
      </div>
      <Skeleton className="h-10 rounded-xl" />
    </div>
  );
}
