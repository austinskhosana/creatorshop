import Image from "next/image";
import { cn } from "@/lib/utils";

interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizes = {
  sm: { className: "w-8 h-8 text-xs",   px: 32  },
  md: { className: "w-10 h-10 text-sm",  px: 40  },
  lg: { className: "w-12 h-12 text-base", px: 48 },
  xl: { className: "w-16 h-16 text-lg",  px: 64  },
};

function getInitials(name?: string) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const ring = "ring-2 ring-white border border-gray-200";

export default function Avatar({ src, name, size = "md", className }: AvatarProps) {
  const { className: sizeCls, px } = sizes[size];

  if (src) {
    return (
      <Image
        src={src}
        alt={name ? `${name}'s avatar` : "Avatar"}
        width={px}
        height={px}
        className={cn("rounded-full object-cover", ring, sizeCls, className)}
      />
    );
  }

  return (
    <div
      aria-label={name ? `${name}'s avatar` : "Avatar"}
      className={cn(
        "rounded-full bg-neutral-900 text-white flex items-center justify-center font-semibold select-none",
        ring,
        sizeCls,
        className,
      )}
    >
      {getInitials(name)}
    </div>
  );
}
