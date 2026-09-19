import Link from "next/link";
import Image from "next/image";
import {
  ArrowRightStartOnRectangleIcon,
  BookmarkIcon,
  BuildingOffice2Icon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  HeartIcon,
  InboxIcon,
  MagnifyingGlassIcon,
  MegaphoneIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  Squares2X2Icon,
  UserIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

const SIDEBAR_ICON_CLASS = "h-[18px] w-[18px]";

export type Role = "CREATOR" | "BRAND" | "BOTH";

export type NavItem = {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  roles: Role[];
  countKey?: "cart" | "saved" | "messages";
};

export const NAV_ITEMS: NavItem[] = [
  { id: "shop", label: "Shop", href: "/explore", icon: <ShoppingBagIcon className={SIDEBAR_ICON_CLASS} />, roles: ["CREATOR", "BOTH"] },
  { id: "shops", label: "My Shops", href: "/shops", icon: <Squares2X2Icon className={SIDEBAR_ICON_CLASS} />, roles: ["CREATOR", "BOTH"] },
  { id: "saved", label: "Saved", href: "/saved", icon: <BookmarkIcon className={SIDEBAR_ICON_CLASS} />, roles: ["CREATOR", "BOTH"], countKey: "saved" },
  { id: "wishlist", label: "Wishlist", href: "/wishlist", icon: <HeartIcon className={SIDEBAR_ICON_CLASS} />, roles: ["CREATOR", "BOTH"] },
  { id: "cart", label: "Cart", href: "/cart", icon: <ShoppingCartIcon className={SIDEBAR_ICON_CLASS} />, roles: ["CREATOR", "BOTH"], countKey: "cart" },
  { id: "messages", label: "Messages", href: "/messages", icon: <ChatBubbleLeftRightIcon className={SIDEBAR_ICON_CLASS} />, roles: ["CREATOR", "BRAND", "BOTH"], countKey: "messages" },
  { id: "profile", label: "Profile", href: "/profile", icon: <UserIcon className={SIDEBAR_ICON_CLASS} />, roles: ["CREATOR", "BOTH"] },
  { id: "settings", label: "Settings", href: "/settings", icon: <Cog6ToothIcon className={SIDEBAR_ICON_CLASS} />, roles: ["CREATOR", "BRAND", "BOTH"] },
  { id: "brand-profile", label: "Profile", href: "/brand-profile", icon: <BuildingOffice2Icon className={SIDEBAR_ICON_CLASS} />, roles: ["BRAND"] },
  { id: "admin", label: "Admin", href: "/admin", icon: <ShieldCheckIcon className={SIDEBAR_ICON_CLASS} />, roles: ["BRAND"] },
  { id: "applications", label: "Applications", href: "/applications", icon: <InboxIcon className={SIDEBAR_ICON_CLASS} />, roles: ["BRAND", "BOTH"] },
  { id: "campaigns", label: "Campaigns", href: "/campaigns", icon: <MegaphoneIcon className={SIDEBAR_ICON_CLASS} />, roles: ["BRAND", "BOTH"] },
  { id: "influencers", label: "Creators", href: "/influencers", icon: <UsersIcon className={SIDEBAR_ICON_CLASS} />, roles: ["BRAND", "BOTH"] },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0].toUpperCase())
    .join("");
}

function UserProfile({ name, onSignOut }: { name: string; onSignOut?: () => void }) {
  return (
    <div className="flex items-center justify-between gap-1 rounded-lg px-2 py-2">
      <div className="flex min-w-0 items-center gap-2.5">
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-neutral-900 text-[11px] font-semibold text-white">
          {getInitials(name) || "?"}
        </div>
        <span className="truncate text-[13px] font-medium text-neutral-600">{name}</span>
      </div>
      <button
        type="button"
        aria-label="Sign out"
        title="Sign out"
        onClick={onSignOut}
        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-neutral-600 transition-colors duration-150 hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
      >
        <ArrowRightStartOnRectangleIcon className={SIDEBAR_ICON_CLASS} />
      </button>
    </div>
  );
}

interface SidebarProps {
  role?: Role;
  activeHref?: string;
  userName?: string;
  onSignOut?: () => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  cartCount?: number;
  savedCount?: number;
  messagesCount?: number;
  /** Extra content rendered between the primary nav and the user profile — e.g. a category list on the shop page. */
  children?: ReactNode;
  className?: string;
  onNavigate?: () => void;
  onOpenCommandPalette?: () => void;
}

export default function Sidebar({
  role = "CREATOR",
  activeHref = "/explore",
  userName = "Jordan Lee",
  onSignOut,
  searchValue,
  onSearchChange,
  cartCount,
  savedCount,
  messagesCount,
  children,
  className,
  onNavigate,
  onOpenCommandPalette,
}: SidebarProps) {
  const visibleItems = NAV_ITEMS.filter((item) => item.roles.includes(role));
  const counts: Record<string, number | undefined> = { cart: cartCount, saved: savedCount, messages: messagesCount };

  return (
    <nav className={cn("flex h-full w-64 flex-shrink-0 flex-col border-r border-neutral-200 bg-white px-4 py-6 font-sans", className)}>
      <Link href="/explore" onClick={onNavigate} className="mb-8 flex items-center px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2">
        <Image src="/Logo.svg" alt="Creatorshop" width={142} height={41} className="h-8 w-auto" priority />
      </Link>
      {onSearchChange && (
        <div className="relative mb-6 px-0">
          <span aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-neutral-600">
            <MagnifyingGlassIcon className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search"
            aria-label="Search"
            className="w-full rounded-lg border border-neutral-200 bg-neutral-50 py-2 pr-12 pl-9 text-[13px] text-neutral-600 placeholder:text-neutral-600 transition-colors duration-150 focus:border-neutral-400 focus:bg-white focus:outline-none"
          />
          <button
            type="button"
            onClick={onOpenCommandPalette}
            aria-label="Open command menu"
            className="absolute top-1/2 right-1.5 flex min-h-7 -translate-y-1/2 items-center rounded-md border border-neutral-200 bg-white px-1.5 text-[10px] font-medium text-neutral-600 transition-[border-color,color,transform] duration-150 hover:border-neutral-300 hover:text-neutral-950 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-1"
          >
            ⌘K
          </button>
        </div>
      )}

      <ul className="flex flex-col gap-1">
        {visibleItems.map((item) => {
          const isActive = item.href === "/" ? activeHref === "/" : activeHref.startsWith(item.href);
          const count = item.countKey ? counts[item.countKey] : undefined;

          return (
            <li key={item.id}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                onClick={onNavigate}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[14px] font-medium transition-[background-color,color,transform] duration-150 active:scale-[0.98]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2",
                  isActive ? "bg-neutral-100 font-medium text-neutral-900" : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900",
                )}
              >
                {item.icon}
                <span className="flex-1 truncate">{item.label}</span>
                {count !== undefined && count > 0 && (
                  <span className="text-[12px] tabular-nums text-neutral-600">{count}</span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>

      {children && <div className="mt-7 flex-1 overflow-y-auto">{children}</div>}
      {!children && <div className="flex-1" />}

      <div className="mt-5 border-t border-neutral-100 pt-4">
        <UserProfile name={userName} onSignOut={onSignOut} />
      </div>
    </nav>
  );
}
