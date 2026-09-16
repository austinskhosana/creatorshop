"use client";

import { ReactNode, useState } from "react";
import Sidebar from "@/components/organisms/Sidebar/Sidebar";
import TopBar from "@/components/organisms/TopBar/TopBar";

type Role = "CREATOR" | "BRAND" | "BOTH";

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
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col bg-white font-sans">
      <TopBar cartCount={cartCount} onMenuToggle={() => setMobileSidebarOpen(true)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          role={role}
          activeHref={activeHref}
          userName={userName}
          onSignOut={onSignOut}
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          savedCount={savedCount}
          messagesCount={messagesCount}
          className="hidden md:flex"
        >
          {sidebarChildren}
        </Sidebar>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button type="button" aria-label="Close navigation" onClick={() => setMobileSidebarOpen(false)} className="absolute inset-0 bg-black/20" />
          <Sidebar
            role={role}
            activeHref={activeHref}
            userName={userName}
            onSignOut={onSignOut}
            searchValue={searchValue}
            onSearchChange={onSearchChange}
            savedCount={savedCount}
            messagesCount={messagesCount}
            onNavigate={() => setMobileSidebarOpen(false)}
            className="relative z-10 w-[min(18rem,85vw)] shadow-xl"
          >
            {sidebarChildren}
          </Sidebar>
        </div>
      )}
    </div>
  );
}
