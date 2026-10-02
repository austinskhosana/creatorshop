/** Software creators have wished for on the Genie Index — none of it is on Creatorshop yet. */
export interface GenieIndexEntry {
  /** Also the logo slug in `BrandLogo`. */
  brandKey: string;
  brandName: string;
  website: string;
  description: string;
  category: string;
}

export const GENIE_INDEX: GenieIndexEntry[] = [
  { brandKey: "capcut", brandName: "CapCut", website: "capcut.com", description: "Video editor built for short-form, with templates and auto-captions.", category: "Video" },
  { brandKey: "figma", brandName: "Figma", website: "figma.com", description: "Collaborative interface design and prototyping in the browser.", category: "Design" },
  { brandKey: "lightroom", brandName: "Lightroom", website: "lightroom.adobe.com", description: "Photo editing and presets, synced between your phone and desktop.", category: "Photo" },
  { brandKey: "framer", brandName: "Framer", website: "framer.com", description: "Design and publish websites without handing off to code.", category: "Design" },
  { brandKey: "descript", brandName: "Descript", website: "descript.com", description: "Edit video and podcasts by editing the transcript.", category: "Video" },
  { brandKey: "raycast", brandName: "Raycast", website: "raycast.com", description: "A fast launcher for your Mac, with AI and extensions built in.", category: "Productivity" },
  { brandKey: "linear", brandName: "Linear", website: "linear.app", description: "Issue tracking and project planning for product teams.", category: "Productivity" },
  { brandKey: "granola", brandName: "Granola", website: "granola.ai", description: "An AI notepad that writes up your meetings for you.", category: "AI Tools" },
];

export function toBrandKey(name: string) {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}
