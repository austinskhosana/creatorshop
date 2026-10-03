import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

function CartIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
      <circle cx="9" cy="20" r="1.25" />
      <circle cx="18" cy="20" r="1.25" />
      <path d="M2.5 3.5h2.2l1.9 11.4a1.75 1.75 0 0 0 1.73 1.47h9.34a1.75 1.75 0 0 0 1.73-1.47L20.8 7.5H6" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" className="h-[18px] w-[18px]">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

interface TopBarProps {
  cartCount?: number;
  /** Brands have no cart. */
  showCart?: boolean;
  homeHref?: string;
  onMenuToggle?: () => void;
  menuOpen?: boolean;
  className?: string;
}

/** The mobile header: menu button, logo, and the cart. AppShell shows it below the md breakpoint. */
export default function TopBar({ cartCount = 0, showCart = true, homeHref = "/", onMenuToggle, menuOpen, className }: TopBarProps) {
  return (
    <header className={cn("flex h-16 flex-shrink-0 items-center justify-between border-b border-neutral-100 bg-white pr-5 pl-3", className)}>
      <div className="flex items-center gap-2">
        {onMenuToggle && <button type="button" aria-label="Open navigation" aria-expanded={menuOpen} aria-haspopup="dialog" onClick={onMenuToggle} className="flex h-10 w-10 items-center justify-center rounded-lg text-neutral-600 transition-[background-color,color,transform] duration-150 hover:bg-neutral-50 hover:text-neutral-900 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 md:hidden"><MenuIcon /></button>}
        <Link href={homeHref} className="flex items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2">
          <Image src="/Logo.svg" alt="Creatorshop" width={142} height={41} className="h-6 w-auto" priority />
        </Link>
      </div>

      {showCart ? (
      <div className="relative">
        <Link
          href="/cart"
          aria-label={`Cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`}
          className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-neutral-200 text-neutral-600 transition-[background-color,color,transform] duration-150 hover:bg-neutral-50 hover:text-neutral-900 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
        >
          <CartIcon />
        </Link>
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-neutral-900 px-1 text-[10px] font-semibold tabular-nums text-white">
            {cartCount}
          </span>
        )}
      </div>
      ) : null}
    </header>
  );
}
