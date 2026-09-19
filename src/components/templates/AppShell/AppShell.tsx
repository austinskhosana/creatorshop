"use client";

import { ReactNode, useEffect, useState } from "react";
import { CommandPalette } from "@/components/organisms/CommandPalette";
import Sidebar, { type Role } from "@/components/organisms/Sidebar/Sidebar";


interface AppShellProps {
  role?: Role;
  activeHref?: string;
  userName?: string;
  onSignOut?: () => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  cartCount?: number;
  savedCount?: number;
  messagesCount?: number;
  /** Rendered inside the sidebar, below the primary nav — e.g. a category list on the shop page. */
  sidebarChildren?: ReactNode;
  children: ReactNode;
}

export default function AppShell({
  role = "CREATOR",
  activeHref = "/explore",
  userName = "Jordan Lee",
  onSignOut,
  searchValue,
  onSearchChange,
  cartCount = 0,
  savedCount,
  messagesCount,
  sidebarChildren,
  children,
}: AppShellProps) {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

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
        userName={userName}
        onSignOut={onSignOut}
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        cartCount={cartCount}
        savedCount={savedCount}
        messagesCount={messagesCount}
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
