import Image from "next/image";
import Link from "next/link";

function CartIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
      <circle cx="9" cy="20" r="1.25" />
      <circle cx="18" cy="20" r="1.25" />
      <path d="M2.5 3.5h2.2l1.9 11.4a1.75 1.75 0 0 0 1.73 1.47h9.34a1.75 1.75 0 0 0 1.73-1.47L20.8 7.5H6" />
    </svg>
  );
}

interface TopBarProps {
  cartCount?: number;
}

export default function TopBar({ cartCount = 0 }: TopBarProps) {
  return (
    <header className="flex h-14 flex-shrink-0 items-center justify-between border-b border-neutral-200 bg-white px-5">
      <Link href="/" className="flex items-center">
        <Image src="/Logo.svg" alt="Creatorshop" width={142} height={41} className="h-7 w-auto" priority />
      </Link>

      <Link
        href="/cart"
        aria-label={`Cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 transition-[background-color,color,transform] duration-150 hover:bg-neutral-100 hover:text-neutral-800 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
      >
        <CartIcon />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-neutral-900 px-1 text-[10px] font-semibold tabular-nums text-white">
            {cartCount}
          </span>
        )}
      </Link>
    </header>
  );
}
