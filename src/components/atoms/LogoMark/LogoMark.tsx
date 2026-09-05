import { cn } from "@/lib/utils";

type LogoMarkVariant = "onWhite" | "onLime";

interface LogoMarkProps {
  variant?: LogoMarkVariant;
  size?: number;
  className?: string;
}

const variantStyles: Record<LogoMarkVariant, { bg: string; stroke: string }> = {
  onWhite: { bg: "bg-[#A3FF38]", stroke: "#0F0F0F" },
  onLime: { bg: "bg-black", stroke: "#A3FF38" },
};

export default function LogoMark({ variant = "onWhite", size = 36, className }: LogoMarkProps) {
  const { bg, stroke } = variantStyles[variant];

  return (
    <div
      className={cn("flex shrink-0 items-center justify-center rounded-lg", bg, className)}
      style={{ width: size, height: size }}
    >
      <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="1.4" fill={stroke} stroke="none" />
        <path d="M12 3v6M12 15v6M21 12h-6M9 12H3M18.36 5.64l-4.24 4.24M9.88 14.12l-4.24 4.24M18.36 18.36l-4.24-4.24M9.88 9.88 5.64 5.64" />
      </svg>
    </div>
  );
}
