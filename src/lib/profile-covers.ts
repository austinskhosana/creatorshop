import type { CSSProperties } from "react";

/** The cover presets a creator can pick for their profile banner. */
export type CoverOption = {
  id: string;
  name: string;
  group: "Color & gradient" | "Textures" | "Shader";
  style?: CSSProperties;
  shader?: boolean;
};

export const COVER_OPTIONS: CoverOption[] = [
  { id: "shader", name: "Shader", group: "Shader", shader: true },
  { id: "lime-haze", name: "Lime haze", group: "Color & gradient", style: { background: "radial-gradient(circle at 18% 20%, #c8ff7a 0%, rgba(200,255,122,.44) 27%, transparent 48%), radial-gradient(circle at 82% 78%, #fff 0%, rgba(255,255,255,.92) 25%, transparent 52%), #f5f5f2" } },
  { id: "papaya", name: "Papaya", group: "Color & gradient", style: { background: "#f26b55" } },
  { id: "butter", name: "Butter", group: "Color & gradient", style: { background: "#f8bf4d" } },
  { id: "pool", name: "Pool", group: "Color & gradient", style: { background: "#269bc3" } },
  { id: "mineral", name: "Mineral", group: "Color & gradient", style: { background: "linear-gradient(135deg, #50b9bd 0%, #aad9d1 52%, #b8967d 100%)" } },
  { id: "punch", name: "Punch", group: "Color & gradient", style: { background: "#f22f86" } },
  { id: "ember", name: "Ember", group: "Color & gradient", style: { background: "linear-gradient(135deg, #d75c42 0%, #f02b16 68%, #ff9f58 100%)" } },
  { id: "porcelain", name: "Porcelain", group: "Color & gradient", style: { background: "linear-gradient(125deg, #eaf8fb 0%, #eebaae 48%, #faf2e7 74%, #8dd4d4 100%)" } },
  { id: "afterglow", name: "Afterglow", group: "Textures", style: { background: "linear-gradient(145deg, #246993 0%, #e5a0be 43%, #29484c 67%, #ff3a1d 100%)" } },
  { id: "berry-film", name: "Berry film", group: "Textures", style: { background: "linear-gradient(180deg, #394c9e 0%, #8f397d 47%, #d42e61 100%)" } },
  { id: "storm-glass", name: "Storm glass", group: "Textures", style: { background: "radial-gradient(circle at 78% 23%, rgba(255,196,160,.8), transparent 32%), linear-gradient(135deg, #243c52, #82afbd 55%, #d9cec0)" } },
  { id: "graphite", name: "Graphite", group: "Textures", style: { background: "repeating-linear-gradient(115deg, rgba(255,255,255,.06) 0 1px, transparent 1px 6px), linear-gradient(140deg, #161918, #555b53)" } },
  { id: "linen", name: "Linen", group: "Textures", style: { background: "repeating-linear-gradient(0deg, rgba(76,61,48,.12) 0 1px, transparent 1px 4px), repeating-linear-gradient(90deg, rgba(76,61,48,.09) 0 1px, transparent 1px 5px), #c4b39f" } },
  { id: "moss", name: "Moss", group: "Textures", style: { background: "radial-gradient(circle at 20% 30%, rgba(232,229,179,.42) 0 1px, transparent 2px), radial-gradient(circle at 70% 60%, rgba(13,57,42,.35) 0 1px, transparent 2px), linear-gradient(135deg, #6e7c68, #b5b790)" } },
  { id: "newsprint", name: "Newsprint", group: "Textures", style: { background: "radial-gradient(circle, rgba(27,25,23,.23) 0 1px, transparent 1.5px) 0 0/5px 5px, #d7d0c6" } },
  { id: "midnight", name: "Midnight", group: "Textures", style: { background: "radial-gradient(circle at 32% 20%, rgba(140,170,184,.3), transparent 35%), repeating-linear-gradient(135deg, rgba(255,255,255,.035) 0 1px, transparent 1px 5px), #263642" } },
];

/** The id a creator's own uploaded image uses in place of a preset. */
export const UPLOADED_COVER_ID = "upload";

/**
 * Background style for a saved cover, or `null` when the banner should run the shader.
 * An "upload" cover without its image falls back to the shader rather than a blank banner.
 */
export function getCoverStyle(coverId: string, coverImage: string | null): CSSProperties | null {
  if (coverId === UPLOADED_COVER_ID) {
    return coverImage ? { backgroundImage: `url(${coverImage})`, backgroundPosition: "center", backgroundSize: "cover" } : null;
  }
  const option = COVER_OPTIONS.find((item) => item.id === coverId);
  return option && !option.shader ? option.style ?? null : null;
}

