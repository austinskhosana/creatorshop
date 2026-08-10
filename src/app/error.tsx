"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <h1 className="text-xl font-bold text-neutral-900">Something went wrong</h1>
      <p className="mt-2 text-sm text-neutral-500">{error.message}</p>
      <button
        onClick={reset}
        className="mt-6 px-4 py-2 rounded-lg bg-neutral-900 text-white text-sm font-medium"
      >
        Try again
      </button>
    </div>
  );
}
