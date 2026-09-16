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
        className={cn("overflow-hidden shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)]", className)}
        style={{ height: size, width: size, borderRadius: radius }}
      >
        <Image src={image} alt="" width={size} height={size} className="h-full w-full object-cover" />
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
