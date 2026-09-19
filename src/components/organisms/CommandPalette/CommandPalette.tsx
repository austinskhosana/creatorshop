"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowRightIcon,
  CheckIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { NAV_ITEMS, type Role } from "@/components/organisms/Sidebar/Sidebar";
import { cn } from "@/lib/utils";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role?: Role;
}

type Command = {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  current?: boolean;
};

const DESCRIPTIONS: Record<string, string> = {
  shop: "Browse available software drops",
  shops: "Track applications, campaigns, and access",
  saved: "Return to products you saved",
  wishlist: "Review products on your wishlist",
  cart: "Review the software you want to shop",
  messages: "Continue conversations with brands",
  profile: "View your public creator profile",
  settings: "Manage your profile and preferences",
  "brand-profile": "View and edit your brand profile",
  admin: "Manage billing and account details",
  applications: "Review creator applications",
  campaigns: "Create and manage campaigns",
  influencers: "Discover creators",
};

export default function CommandPalette({ open, onOpenChange, role = "CREATOR" }: CommandPaletteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const titleId = useId();
  const listId = useId();

  const commands = useMemo<Command[]>(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const pages = NAV_ITEMS.filter((item) => item.roles.includes(role))
      .filter((item) => {
        if (!normalizedQuery) return true;
        return `${item.label} ${DESCRIPTIONS[item.id] ?? ""}`.toLowerCase().includes(normalizedQuery);
      })
      .map((item) => ({
        id: item.id,
        label: item.label,
        description: DESCRIPTIONS[item.id] ?? "Open page",
        href: item.href,
        icon: item.icon,
        current: pathname.startsWith(item.href),
      }));

    if (!normalizedQuery) return pages;

    return [
      ...pages,
      {
        id: "search-software",
        label: `Search software for “${query.trim()}”`,
        description: "View matching products in Shop",
        href: `/explore?q=${encodeURIComponent(query.trim())}`,
        icon: <MagnifyingGlassIcon className="size-[18px]" />,
      },
    ];
  }, [pathname, query, role]);

  useEffect(() => {
    if (!open) return;

    returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const frame = requestAnimationFrame(() => {
      setQuery("");
      setActiveIndex(0);
      inputRef.current?.focus();
    });
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      requestAnimationFrame(() => returnFocusRef.current?.focus());
    };
  }, [open]);

  function selectCommand(command: Command) {
    onOpenChange(false);
    router.push(command.href);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      onOpenChange(false);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % commands.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + commands.length) % commands.length);
      return;
    }

    if (event.key === "Enter" && commands[activeIndex]) {
      event.preventDefault();
      selectCommand(commands[activeIndex]);
      return;
    }

    if (event.key === "Tab" && panelRef.current) {
      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'),
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-neutral-950/35 px-4 pt-[12vh] backdrop-blur-[2px] sm:pt-[16vh]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onOpenChange(false);
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onKeyDown={handleKeyDown}
        className="w-full max-w-[620px] overflow-hidden rounded-[22px] border border-black/10 bg-white shadow-[0_24px_80px_rgba(0,0,0,0.22),0_2px_8px_rgba(0,0,0,0.08)]"
      >
        <h2 id={titleId} className="sr-only">Command menu</h2>
        <div className="flex items-center gap-3 border-b border-neutral-200 px-4 sm:px-5">
          <MagnifyingGlassIcon aria-hidden="true" className="size-5 shrink-0 text-neutral-400" strokeWidth={1.8} />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            role="combobox"
            aria-controls={listId}
            aria-expanded="true"
            aria-autocomplete="list"
            aria-activedescendant={commands[activeIndex] ? `${listId}-${commands[activeIndex].id}` : undefined}
            placeholder="Search pages or software…"
            className="h-16 min-w-0 flex-1 bg-transparent text-[15px] text-neutral-950 outline-none placeholder:text-neutral-400"
          />
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close command menu"
            className="grid size-10 shrink-0 place-items-center rounded-xl text-neutral-400 transition-[background-color,color,transform] duration-150 hover:bg-neutral-100 hover:text-neutral-950 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
          >
            <XMarkIcon className="size-5" />
          </button>
        </div>

        <div className="max-h-[min(430px,60vh)] overflow-y-auto p-2.5 sm:p-3">
          <p className="px-2.5 pt-1 pb-2 text-[11px] font-semibold tracking-[0.12em] text-neutral-400 uppercase">
            {query.trim() ? "Results" : "Go to"}
          </p>
          <div id={listId} role="listbox" aria-label="Commands" className="space-y-1">
            {commands.map((command, index) => (
              <button
                key={command.id}
                id={`${listId}-${command.id}`}
                type="button"
                role="option"
                aria-selected={index === activeIndex}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => selectCommand(command)}
                className={cn(
                  "group flex min-h-14 w-full items-center gap-3 rounded-[14px] px-3 text-left transition-[background-color,color] duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900",
                  index === activeIndex ? "bg-neutral-100 text-neutral-950" : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950",
                )}
              >
                <span className={cn("grid size-9 shrink-0 place-items-center rounded-[10px] border bg-white", index === activeIndex ? "border-neutral-200 text-neutral-950" : "border-neutral-100 text-neutral-500")}>
                  {command.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{command.label}</span>
                  <span className="mt-0.5 block truncate text-xs text-neutral-400">{command.description}</span>
                </span>
                {command.current ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-500">
                    <CheckIcon className="size-3.5" /> Current
                  </span>
                ) : (
                  <ArrowRightIcon className={cn("size-4 transition-[opacity,transform] duration-150", index === activeIndex ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0")} />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-neutral-100 bg-neutral-50/80 px-4 py-2.5 text-[11px] text-neutral-400 sm:px-5">
          <span>Navigate with <kbd className="font-sans text-neutral-600">↑ ↓</kbd></span>
          <span className="flex items-center gap-3"><span><kbd className="font-sans text-neutral-600">↵</kbd> Open</span><span><kbd className="font-sans text-neutral-600">Esc</kbd> Close</span></span>
        </div>
      </div>
    </div>
  );
}
