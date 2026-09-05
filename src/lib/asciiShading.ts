// Shared shading helpers for the ASCII-fire family of components
// (Fire, AsciiFlame) — maps a 0..max intensity value to a monospace
// glyph and a near-black fill, so every flame in the design system
// reads with the same "glyphs burning on brand green" texture.

export const RAMP = " .:-=+*#%@";

export function rampChar(value: number, max: number): string {
  const idx = Math.min(RAMP.length - 1, Math.round((value / max) * (RAMP.length - 1)));
  return RAMP[idx];
}

export function blackShade(value: number, max: number): string {
  const t = Math.max(0, Math.min(1, value / max));
  const lightness = 26 - t * 24; // near-black core, charcoal tips
  return `hsl(0, 0%, ${lightness.toFixed(0)}%)`;
}
