import { AppShell } from "@/components/templates/AppShell";
import type { RegistryEntry } from "./types";

export const templatesEntries: RegistryEntry[] = [
  {
    name: "App shell",
    level: "templates",
    description: "Sidebar + scrollable content region — the layout every dashboard page is built on.",
    fullBleed: true,
    variants: [
      {
        name: "Default",
        preview: (
          <AppShell>
            <div className="flex h-full items-center justify-center p-10 text-sm text-gray-400">Page content goes here</div>
          </AppShell>
        ),
      },
    ],
  }
];
