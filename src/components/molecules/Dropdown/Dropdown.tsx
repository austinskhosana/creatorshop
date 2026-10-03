"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  ariaLabel: string;
  /** Which edge of the trigger the menu lines up with. */
  align?: "start" | "end";
  disabled?: boolean;
  /** "field" stretches to the width of a form input and matches its height. */
  variant?: "toolbar" | "field";
  id?: string;
}

export default function Dropdown({ value, onChange, options, ariaLabel, align = "start", disabled = false, variant = "toolbar", id }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();
  const reduceMotion = useReducedMotion();

  const selectedIndex = Math.max(0, options.findIndex((option) => option.value === value));
  const selected = options[selectedIndex];

  function openMenu(index = selectedIndex) {
    setActiveIndex(index);
    setOpen(true);
  }

  function closeMenu({ restoreFocus = true } = {}) {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  }

  function choose(index: number) {
    const option = options[index];
    if (option && option.value !== value) onChange(option.value);
    closeMenu();
  }

  useEffect(() => {
    if (!open) return;
    listRef.current?.focus();

    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) closeMenu({ restoreFocus: false });
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      openMenu(event.key === "ArrowUp" ? options.length - 1 : selectedIndex);
    }
  }

  function handleListKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    const last = options.length - 1;
    const keyActions: Record<string, () => void> = {
      ArrowDown: () => setActiveIndex((index) => (index >= last ? 0 : index + 1)),
      ArrowUp: () => setActiveIndex((index) => (index <= 0 ? last : index - 1)),
      Home: () => setActiveIndex(0),
      End: () => setActiveIndex(last),
      Enter: () => choose(activeIndex),
      " ": () => choose(activeIndex),
      Escape: () => closeMenu(),
    };

    if (event.key === "Tab") {
      closeMenu({ restoreFocus: false });
      return;
    }

    const action = keyActions[event.key];
    if (action) {
      event.preventDefault();
      action();
      return;
    }

    // Typeahead: jump to the next option starting with the typed character.
    if (event.key.length === 1) {
      const char = event.key.toLocaleLowerCase();
      const ordered = [...options.slice(activeIndex + 1), ...options.slice(0, activeIndex + 1)];
      const match = ordered.find((option) => option.label.toLocaleLowerCase().startsWith(char));
      if (match) setActiveIndex(options.indexOf(match));
    }
  }

  return (
    <div ref={rootRef} className={variant === "field" ? "relative w-full" : "relative"}>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        disabled={disabled}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        onClick={() => (open ? closeMenu() : openMenu())}
        onKeyDown={handleTriggerKeyDown}
        className={[
          variant === "field"
            ? "flex w-full items-center justify-between gap-2 rounded-xl border bg-white py-2.5 pr-3 pl-3.5 text-sm text-neutral-900"
            : "flex items-center gap-2 rounded-lg border bg-white py-2 pr-2.5 pl-3.5 text-[13px] font-medium text-neutral-700",
          "transition-[border-color,background-color,transform] duration-150 active:scale-[0.98]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100",
          open ? "border-neutral-300" : "border-neutral-200 hover:border-neutral-300",
        ].join(" ")}
      >
        <span className={variant === "field" ? "min-w-0 truncate" : undefined}>{selected?.label}</span>
        <ChevronDownIcon
          aria-hidden="true"
          strokeWidth={2}
          className={["h-3.5 w-3.5 shrink-0 text-neutral-400 transition-transform duration-200", open ? "rotate-180" : ""].join(" ")}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            ref={listRef}
            id={listId}
            role="listbox"
            tabIndex={-1}
            aria-label={ariaLabel}
            aria-activedescendant={activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
            onKeyDown={handleListKeyDown}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.97, transition: { duration: 0.1 } }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className={[
              "absolute top-[calc(100%+6px)] z-30 min-w-full w-max rounded-xl border border-neutral-200 bg-white p-1 shadow-lg shadow-neutral-900/5 focus:outline-none",
              align === "end" ? "right-0 origin-top-right" : "left-0 origin-top-left",
            ].join(" ")}
          >
            {options.map((option, index) => {
              const isSelected = index === selectedIndex;
              const isActive = index === activeIndex;
              return (
                <li
                  key={option.value}
                  id={`${listId}-${index}`}
                  role="option"
                  aria-selected={isSelected}
                  onPointerMove={() => setActiveIndex(index)}
                  onClick={() => choose(index)}
                  className={[
                    "flex min-h-9 cursor-pointer items-center rounded-lg pr-6 pl-2.5 text-[13px] transition-colors duration-100",
                    isActive ? "bg-neutral-100" : "",
                    isSelected ? "font-medium text-neutral-900" : "text-neutral-600",
                  ].join(" ")}
                >
                  {option.label}
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
