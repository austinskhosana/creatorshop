"use client";

import { useRef, useLayoutEffect, useState } from "react";

interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface FilterTabBarProps {
  tabs: Tab[];
  activeId: string;
  onChange: (id: string) => void;
}

export default function FilterTabBar({ tabs, activeId, onChange }: FilterTabBarProps) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [pill, setPill] = useState({ left: 0, width: 0, ready: false });

  useLayoutEffect(() => {
    const idx = Math.max(
      tabs.findIndex((t) => t.id === activeId),
      0,
    );
    const el = tabRefs.current[idx];
    if (el) setPill({ left: el.offsetLeft, width: el.offsetWidth, ready: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleChange(id: string, idx: number) {
    onChange(id);
    const el = tabRefs.current[idx];
    if (el) setPill({ left: el.offsetLeft, width: el.offsetWidth, ready: true });
  }

  return (
    <div className="relative flex w-fit gap-1 rounded-xl border border-gray-200 p-1">
      <div
        className="absolute top-1 bottom-1 rounded-lg border border-gray-200 bg-white shadow-sm will-change-transform"
        style={{
          left: 0,
          width: pill.width,
          transform: `translateX(${pill.left}px)`,
          opacity: pill.width === 0 ? 0 : 1,
          transition: pill.ready
            ? "transform 320ms cubic-bezier(0.34,1.1,0.64,1), width 280ms cubic-bezier(0.34,1.1,0.64,1)"
            : "none",
        }}
      />
      {tabs.map((tab, i) => (
        <button
          key={tab.id}
          ref={(el) => {
            tabRefs.current[i] = el;
          }}
          onClick={() => handleChange(tab.id, i)}
          className={[
            "relative z-10 flex items-center gap-2 rounded-lg px-4 py-1.5 text-sm font-medium transition-colors duration-[200ms]",
            activeId === tab.id ? "text-neutral-900" : "text-gray-500 hover:text-gray-800",
          ].join(" ")}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-[11px] font-semibold text-gray-400">
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
