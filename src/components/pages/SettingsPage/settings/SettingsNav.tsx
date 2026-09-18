import {
  BellAlertIcon,
  ShieldCheckIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import type { ComponentType } from "react";
import type { SettingsSection } from "./types";

const links: [SettingsSection, string, ComponentType<{ className?: string }>][] = [
  ["profile", "Profile", UserCircleIcon],
  ["notifications", "Notifications", BellAlertIcon],
  ["account", "Account & security", ShieldCheckIcon],
];

export function SettingsNav({
  active,
  onChange,
}: {
  active: SettingsSection;
  onChange: (section: SettingsSection) => void;
}) {
  return (
    <aside className="lg:sticky lg:top-8 lg:self-start lg:pt-7">
      <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
        {links.map(([id, label, Icon]) => (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={`group relative flex min-h-10 shrink-0 items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-medium transition-[background-color,color,transform] duration-150 active:scale-[0.96] lg:w-full ${active === id ? "bg-neutral-100 text-neutral-950" : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-950"}`}
          >
            <Icon className="size-[18px]" />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}

