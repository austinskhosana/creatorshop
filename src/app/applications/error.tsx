"use client";

export default function ApplicationsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-red-500">
          <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 1.998-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
        </svg>
      </div>
      <h3 className="text-sm font-semibold text-neutral-900 mb-1">Something went wrong</h3>
      <p className="text-sm text-gray-400 max-w-xs leading-relaxed mb-5">
        {error.message || "Failed to load applications. Please try again."}
      </p>
      <button
        onClick={reset}
        className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all duration-[140ms]"
      >
        Try again
      </button>
    </div>
  );
}
