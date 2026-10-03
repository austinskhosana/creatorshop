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
  },
  {
    name: "App shell · brand",
    level: "templates",
    description: "The same AppShell with the brand nav: Storefront, Review shoppers, Shops, Creators, Messages, Settings. Brand routes wrap it in BrandShell, which also sends signed-out visitors to /brands.",
    fullBleed: true,
    variants: [
      {
        name: "Default",
        preview: (
          <AppShell role="BRAND" activeHref="/brand" userName="Fernpad" reviewCount={6} messagesCount={2}>
            <div className="flex h-full items-center justify-center p-10 text-sm text-gray-400">Page content goes here</div>
          </AppShell>
        ),
      },
    ],
  },
];
