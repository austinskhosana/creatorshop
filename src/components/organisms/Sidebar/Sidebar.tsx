import Link from "next/link";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

// ── Icon components — flat outline, 1.75 stroke, currentColor ──────────────

function ShopIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
      <path d="M4 9l1.5-5h13L20 9" />
      <path d="M4 9h16v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9Z" />
      <path d="M9 13a3 3 0 0 0 6 0" />
    </svg>
  );
}

function ShopsIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function ApplicationsIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
      <path d="M3.5 12h4l2 3h5l2-3h4" />
      <path d="M6 5.5h12l2.5 6.5v6a1.5 1.5 0 0 1-1.5 1.5h-14A1.5 1.5 0 0 1 3.5 18v-6L6 5.5Z" />
    </svg>
  );
}

function CampaignsIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
      <path d="M3.5 10v4a1 1 0 0 0 1 1h2l7 4V5l-7 4h-2a1 1 0 0 0-1 1Z" />
      <path d="M17 9.5a3.5 3.5 0 0 1 0 5" />
      <path d="M19.5 7a7 7 0 0 1 0 10" />
    </svg>
  );
}

function InfluencersIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
      <path d="M16 8.5a2.5 2.5 0 1 1 2 4" />
      <path d="M17 13.5c2.5.3 3.5 2 3.5 4.5" />
    </svg>
  );
}

function SavedIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
      <path d="M6 3.75A1.75 1.75 0 0 1 7.75 2h8.5A1.75 1.75 0 0 1 18 3.75V21l-6-3.75L6 21V3.75Z" />
    </svg>
  );
}

function WishlistIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
      <path d="M12 20.5s-7.5-4.6-9.75-9.1C.9 8.2 2.3 5 5.6 5c1.9 0 3.3 1 4.4 2.6C11.1 6 12.5 5 14.4 5c3.3 0 4.7 3.2 3.35 6.4C15.5 15.9 12 20.5 12 20.5Z" />
    </svg>
  );
}

function MessagesIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
      <path d="M4 5.5h16v10a1.5 1.5 0 0 1-1.5 1.5H9l-4.5 3.5V17H4a1.5 1.5 0 0 1-1.5-1.5v-8.5A1.5 1.5 0 0 1 4 5.5Z" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 19.5a7.5 7.5 0 0 1 15 0" />
    </svg>
  );
}

function BrandProfileIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
      <path d="M4 20.5V6l6-2.5v17" />
      <path d="M14 20.5V9l6 2v9.5" />
      <path d="M2.5 20.5h19" />
      <path d="M7 8h.01M7 12h.01M7 16h.01" />
    </svg>
  );
}

function AdminIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
      <path d="M12 3.5l7 3v5c0 4.5-3 7.5-7 8.5-4-1-7-4-7-8.5v-5l7-3Z" />
      <path d="M9.5 12l1.75 1.75L14.5 10" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <circle cx="11" cy="11" r="6.5" />
      <path d="M20 20l-4.35-4.35" />
    </svg>
  );
}

function SignOutIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
      <path d="M9 20H5.5A1.5 1.5 0 0 1 4 18.5v-13A1.5 1.5 0 0 1 5.5 4H9" />
      <path d="M16 16l4-4-4-4" />
      <path d="M20 12H9" />
    </svg>
  );
}

type Role = "CREATOR" | "BRAND" | "BOTH";

type NavItem = {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  roles: Role[];
  countKey?: "saved" | "messages";
};

const NAV_ITEMS: NavItem[] = [
  { id: "shop", label: "Shop", href: "/explore", icon: <ShopIcon />, roles: ["CREATOR", "BOTH"] },
  { id: "shops", label: "My Shops", href: "/shops", icon: <ShopsIcon />, roles: ["CREATOR", "BOTH"] },
  { id: "saved", label: "Saved", href: "/saved", icon: <SavedIcon />, roles: ["CREATOR", "BOTH"], countKey: "saved" },
  { id: "wishlist", label: "Wishlist", href: "/wishlist", icon: <WishlistIcon />, roles: ["CREATOR", "BOTH"] },
  { id: "messages", label: "Messages", href: "/messages", icon: <MessagesIcon />, roles: ["CREATOR", "BRAND", "BOTH"], countKey: "messages" },
  { id: "profile", label: "Profile", href: "/profile", icon: <ProfileIcon />, roles: ["CREATOR", "BOTH"] },
  { id: "brand-profile", label: "Profile", href: "/brand-profile", icon: <BrandProfileIcon />, roles: ["BRAND"] },
  { id: "admin", label: "Admin", href: "/admin", icon: <AdminIcon />, roles: ["BRAND"] },
  { id: "applications", label: "Applications", href: "/applications", icon: <ApplicationsIcon />, roles: ["BRAND", "BOTH"] },
  { id: "campaigns", label: "Campaigns", href: "/campaigns", icon: <CampaignsIcon />, roles: ["BRAND", "BOTH"] },
  { id: "influencers", label: "Creators", href: "/influencers", icon: <InfluencersIcon />, roles: ["BRAND", "BOTH"] },
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
        <span className="truncate text-[13px] font-medium text-neutral-700">{name}</span>
      </div>
      <button
        type="button"
        aria-label="Sign out"
        title="Sign out"
        onClick={onSignOut}
        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-neutral-400 transition-colors duration-150 hover:bg-neutral-100 hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
      >
        <SignOutIcon />
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
  savedCount?: number;
  messagesCount?: number;
  /** Extra content rendered between the primary nav and the user profile — e.g. a category list on the shop page. */
  children?: ReactNode;
}

export default function Sidebar({
  role = "CREATOR",
  activeHref = "/explore",
  userName = "Jordan Lee",
  onSignOut,
  searchValue,
  onSearchChange,
  savedCount,
  messagesCount,
  children,
}: SidebarProps) {
  const visibleItems = NAV_ITEMS.filter((item) => item.roles.includes(role));
  const counts: Record<string, number | undefined> = { saved: savedCount, messages: messagesCount };

  return (
    <nav className="flex h-full w-64 flex-shrink-0 flex-col border-r border-neutral-200 bg-white px-3 py-5 font-sans">
      {onSearchChange && (
        <div className="relative mb-5 px-0">
          <span aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-neutral-400">
            <SearchIcon />
          </span>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search"
            aria-label="Search"
            className="w-full rounded-lg border border-neutral-200 bg-neutral-50 py-2 pr-12 pl-9 text-[13px] text-neutral-900 placeholder:text-neutral-400 transition-colors duration-150 focus:border-neutral-400 focus:bg-white focus:outline-none"
          />
          <span aria-hidden="true" className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 rounded-md border border-neutral-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-neutral-400">
            ⌘K
          </span>
        </div>
      )}

      <ul className="flex flex-col gap-0.5">
        {visibleItems.map((item) => {
          const isActive = item.href === "/" ? activeHref === "/" : activeHref.startsWith(item.href);
          const count = item.countKey ? counts[item.countKey] : undefined;

          return (
            <li key={item.id}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[14px] transition-[background-color,color,transform] duration-150 active:scale-[0.98]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2",
                  isActive ? "bg-neutral-100 font-medium text-neutral-900" : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800",
                )}
              >
                {item.icon}
                <span className="flex-1 truncate">{item.label}</span>
                {count !== undefined && count > 0 && (
                  <span className="text-[12px] tabular-nums text-neutral-400">{count}</span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>

      {children && <div className="mt-6 flex-1 overflow-y-auto">{children}</div>}
      {!children && <div className="flex-1" />}

      <div className="mt-4 border-t border-neutral-100 pt-3">
        <UserProfile name={userName} onSignOut={onSignOut} />
      </div>
    </nav>
  );
}
