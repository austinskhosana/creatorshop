"use client";

import { ReactNode, useEffect, useState } from "react";
import { CommandPalette } from "@/components/organisms/CommandPalette";
import Sidebar, { type Role } from "@/components/organisms/Sidebar/Sidebar";
import TopBar from "@/components/organisms/TopBar/TopBar";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useCart, useProfile } from "@/lib/store/creator-store";
import { mockThreads } from "@/lib/mock-messages";


interface AppShellProps {
  role?: Role;
  activeHref?: string;
  /** Defaults to the creator's profile name. */
  userName?: string;
  onSignOut?: () => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  /** Sidebar badges. Each defaults to the creator's live count. */
  cartCount?: number;
  messagesCount?: number;
  /** Brand sidebar: shoppers waiting for review. */
  reviewCount?: number;
  /** Rendered inside the sidebar, below the primary nav — e.g. a category list on the shop page. */
  sidebarChildren?: ReactNode;
  children: ReactNode;
}

export default function AppShell({
  role = "CREATOR",
  activeHref = "/explore",
  userName,
  onSignOut,
  searchValue,
  onSearchChange,
  cartCount,
  messagesCount,
  reviewCount,
  sidebarChildren,
  children,
}: AppShellProps) {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const cart = useCart();
  const profile = useProfile();
  const unreadThreads = mockThreads.filter((thread) => thread.unread).length;

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandPaletteOpen((open) => !open);
      }
    }

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  // The drawer only exists below md. Widening past it closes the drawer so it can't linger behind the desktop sidebar.
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    function handleChange(event: MediaQueryListEvent) {
      if (event.matches) setMobileNavOpen(false);
    }
    desktop.addEventListener("change", handleChange);
    return () => desktop.removeEventListener("change", handleChange);
  }, []);

  const sidebarProps = {
    role,
    activeHref,
    userName: userName ?? profile.displayName,
    onSignOut,
    searchValue,
    onSearchChange,
    cartCount: cartCount ?? cart.count,
    messagesCount: messagesCount ?? unreadThreads,
    reviewCount,
  };

  return (
    <div className="flex h-screen flex-col bg-white font-sans md:flex-row">
      <TopBar
        className="md:hidden"
        homeHref={role === "BRAND" ? "/brand" : "/explore"}
        showCart={role !== "BRAND"}
        cartCount={sidebarProps.cartCount}
        onMenuToggle={() => setMobileNavOpen(true)}
        menuOpen={mobileNavOpen}
      />
      <Sidebar {...sidebarProps} onOpenCommandPalette={() => setCommandPaletteOpen(true)} className="hidden md:flex">
        {sidebarChildren}
      </Sidebar>
      <Sheet open={mobileNavOpen} onOpenChange={(open) => setMobileNavOpen(open)}>
        <SheetContent>
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <Sidebar
            {...sidebarProps}
            onNavigate={() => setMobileNavOpen(false)}
            onOpenCommandPalette={() => {
              setMobileNavOpen(false);
              setCommandPaletteOpen(true);
            }}
            className="w-full border-r-0"
          >
            {sidebarChildren ? (
              // Page-specific extras (like shop categories) filter in place without a route change,
              // so any tap on one of their controls closes the drawer to reveal the result.
              <div
                onClick={(event) => {
                  if ((event.target as HTMLElement).closest("a, button")) setMobileNavOpen(false);
                }}
              >
                {sidebarChildren}
              </div>
            ) : null}
          </Sidebar>
        </SheetContent>
      </Sheet>
      <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
      <CommandPalette open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen} role={role} />
    </div>
  );
}
