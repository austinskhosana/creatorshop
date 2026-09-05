"use client";

import Button from "@/components/atoms/Button/Button";

export default function ErrorState({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- required by Next.js error.tsx signature, not displayed
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-32 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-5 w-5 text-red-400"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <p className="mb-1 text-[16px] font-semibold text-neutral-900">Something went wrong</p>
      <p className="mb-6 max-w-xs text-[14px] text-gray-400">
        An unexpected error occurred. Try again or come back later.
      </p>
      <Button variant="dark" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
