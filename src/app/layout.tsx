import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Creatorshop",
  description: "Building Creatorshop's design system, one component at a time.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
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
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
