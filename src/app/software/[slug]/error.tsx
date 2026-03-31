"use client";

import ErrorState from "@/components/ui/ErrorState";

export default function SoftwareListingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorState error={error} reset={reset} />;
}
