import { atomsEntries } from "./atoms";
import { moleculesEntries } from "./molecules";
import { organismsEntries } from "./organisms";
import { templatesEntries } from "./templates";
import { pagesEntries } from "./pages";

export type { AtomicLevel, PlannedComponent, RegistryEntry, RegistryVariant } from "./types";
export { roadmap } from "./roadmap";
import type { AtomicLevel, RegistryEntry } from "./types";

export const registry: RegistryEntry[] = [
  ...atomsEntries,
  ...moleculesEntries,
  ...organismsEntries,
  ...templatesEntries,
  ...pagesEntries,
];

export const ATOMIC_LEVELS: { key: AtomicLevel; label: string }[] = [
  { key: "atoms", label: "Atoms" },
  { key: "molecules", label: "Molecules" },
  { key: "organisms", label: "Organisms" },
  { key: "templates", label: "Templates" },
  { key: "pages", label: "Pages" },
];
