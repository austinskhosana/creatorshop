import Link from "next/link";

export default function DesignSystemLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-neutral-200">
        <nav className="max-w-5xl mx-auto flex items-center gap-6 px-6 h-14 text-sm font-medium">
          <Link href="/" className="font-bold text-neutral-900">
            Creatorshop
          </Link>
          <Link href="/design-system" className="text-neutral-500 hover:text-neutral-900">
            Design System
          </Link>
        </nav>
      </header>
      <div className="flex-1">{children}</div>
    </div>
  );
}
