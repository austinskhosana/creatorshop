import Image from "next/image";
import { cn } from "@/lib/utils";

const LOGO_IMAGES: Record<string, string> = {
  paper: "/logos/paper.jpeg",
  cursor: "/logos/cursor.jpg",
  "dia-browser": "/logos/dia-browser.jpg",
  notion: "/logos/notion.jpg",
  "youtube-premium": "/logos/youtube.jpg",
  "apple-music": "/logos/apple-music.jpg",
  elevenlabs: "/logos/elevenlabs.png",
  higgsfield: "/logos/higgsfield.jpg",
  procreate: "/logos/procreate.jpg",
  canva: "/logos/canva.jpg",
  spotify: "/logos/spotify.jpg",
  // Genie Index brands, not on Creatorshop yet.
  capcut: "/logos/capcut.png",
  descript: "/logos/descript.png",
  figma: "/logos/figma.png",
  framer: "/logos/framer.png",
  granola: "/logos/granola.png",
  lightroom: "/logos/lightroom.png",
  linear: "/logos/linear.png",
  raycast: "/logos/raycast.png",
  // The brand-side demo merchant. An original mark for a fictional company.
  fernpad: "/logos/fernpad.svg",
};

interface BrandLogoProps {
  slug: string;
  name: string;
  size?: number;
  className?: string;
}

export default function BrandLogo({ slug, name, size = 52, className }: BrandLogoProps) {
  const image = LOGO_IMAGES[slug];
  const radius = Math.round(size * 0.23);

  if (image) {
    return (
      <div
        aria-label={`${name} logo`}
        className={cn("relative overflow-hidden", className)}
        style={{ height: size, width: size, borderRadius: radius }}
      >
        <Image src={image} alt="" width={size} height={size} className="h-full w-full object-cover" />
        {/* Hairline drawn over the image so white app icons (CapCut, Notion) keep a visible tile edge on white cards. */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]" />
      </div>
    );
  }

  const initial = name.trim().charAt(0).toUpperCase();

  return (
    <div
      aria-label={`${name} logo`}
      className={cn("flex items-center justify-center font-bold tracking-[-0.06em] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)]", className)}
      style={{ height: size, width: size, borderRadius: radius, background: "#efefed", color: "#1d1d1b", fontSize: size * 0.31 }}
    >
      {initial}
    </div>
  );
}
