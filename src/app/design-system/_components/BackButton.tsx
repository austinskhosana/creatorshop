import Link from "next/link";

export function BackButton({ href }: { href: string }) {
  return (
    <Link
      href={href}
      aria-label="Go back"
      className="absolute top-6 left-6 inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-500 shadow-sm transition-colors duration-150 hover:border-neutral-300 hover:text-neutral-900"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
          d="M19 12H5M5 12L12 19M5 12L12 5"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}
