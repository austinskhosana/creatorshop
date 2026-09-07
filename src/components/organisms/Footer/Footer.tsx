import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white px-6 py-8 sm:px-10 lg:px-16">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 font-mono text-[12px] text-neutral-500 sm:flex-row">
        <p>© {year} Creatorshop. All rights reserved.</p>
        <nav className="flex items-center gap-5">
          <Link href="/privacy" className="transition-colors hover:text-neutral-900">
            Privacy Policy
          </Link>
          <a
            href="https://x.com/creatorshop"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-neutral-900"
          >
            X
          </a>
          <a
            href="https://linkedin.com/company/creatorshop"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-neutral-900"
          >
            LinkedIn
          </a>
        </nav>
      </div>
    </footer>
  );
}
