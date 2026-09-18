export type AtomicLevel = "atoms" | "molecules" | "organisms" | "templates" | "pages";

export interface RegistryVariant {
  name: string;
  preview: React.ReactNode;
}

export interface RegistryEntry {
  name: string;
  level: AtomicLevel;
  description: string;
  /** "before" = ported as-is from archive/pre-atomic-rebuild, not yet redesigned. Omit once redesigned. */
  stage?: "before";
  /** Full-screen layouts render edge-to-edge instead of in the centered preview column. */
  fullBleed?: boolean;
  variants: RegistryVariant[];
}

export interface PlannedComponent {
  name: string;
  level: AtomicLevel;
  note: string;
}
