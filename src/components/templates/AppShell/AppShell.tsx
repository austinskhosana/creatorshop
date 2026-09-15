import { ReactNode } from "react";
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
  return (
    <div className="flex h-screen flex-col bg-white font-sans">
      <TopBar cartCount={cartCount} />
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
        >
          {sidebarChildren}
        </Sidebar>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
