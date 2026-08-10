import { Button } from "@/components/atoms/Button";

export type AtomicLevel = "atoms" | "molecules" | "organisms" | "templates" | "pages";

export interface RegistryEntry {
  name: string;
  level: AtomicLevel;
  description: string;
  preview: React.ReactNode;
}

// Add one entry here each time a new component is built —
// it shows up in /design-system automatically.
export const registry: RegistryEntry[] = [
  {
    name: "Button",
    level: "atoms",
    description: "Primary, secondary, and ghost variants in three sizes.",
    preview: (
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="primary" disabled>
          Disabled
        </Button>
      </div>
    ),
  },
];

export const ATOMIC_LEVELS: { key: AtomicLevel; label: string }[] = [
  { key: "atoms", label: "Atoms" },
  { key: "molecules", label: "Molecules" },
  { key: "organisms", label: "Organisms" },
  { key: "templates", label: "Templates" },
  { key: "pages", label: "Pages" },
];
