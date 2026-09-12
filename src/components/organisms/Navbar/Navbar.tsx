import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/atoms/Button";

const NAV_LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "For creators", href: "/" },
  { label: "For brands", href: "/brands" },
];

export default function Navbar() {
  return (
    <header className="flex items-center justify-between px-6 py-6 sm:px-10 lg:px-16">
      <Link href="/">
        <Image src="/Logo.svg" alt="Creatorshop" width={142} height={41} className="h-9 w-auto" priority />
      </Link>

      <nav className="hidden items-center gap-8 text-sm text-neutral-700 sm:flex">
        {NAV_LINKS.map((link) => (
          <Link key={link.label} href={link.href} className="transition-colors hover:text-neutral-900">
            {link.label}
          </Link>
        ))}
      </nav>

      <Button variant="primary" size="md" pill style={{ border: "none", boxShadow: "none" }}>
        Join Waitlist
      </Button>
    </header>
  );
}
