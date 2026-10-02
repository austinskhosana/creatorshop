"use client";

import { ReactNode, useEffect, useState } from "react";
import { CommandPalette } from "@/components/organisms/CommandPalette";
import Sidebar, { type Role } from "@/components/organisms/Sidebar/Sidebar";
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
  sidebarChildren,
  children,
}: AppShellProps) {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
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

  return (
    <div className="flex h-screen bg-white font-sans">
      <Sidebar
        role={role}
        activeHref={activeHref}
        userName={userName ?? profile.displayName}
        onSignOut={onSignOut}
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        cartCount={cartCount ?? cart.count}
        messagesCount={messagesCount ?? unreadThreads}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        className="hidden md:flex"
      >
        {sidebarChildren}
      </Sidebar>
      <main className="flex-1 overflow-y-auto">{children}</main>
      <CommandPalette open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen} role={role} />
    </div>
  );
}
