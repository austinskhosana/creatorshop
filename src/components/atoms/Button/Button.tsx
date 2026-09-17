import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "accent" | "dark" | "secondary" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  pill?: boolean;
  loading?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  /** Disable the built-in press scale, e.g. when a wrapper (like a metallic border panel) handles the press feedback itself. */
  pressScale?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-neutral-900 text-white border border-neutral-800 shadow-[inset_0_0.5px_1px_rgba(255,255,255,0.15),inset_0_-1px_1.2px_rgba(18,18,18,1),0_2px_3px_-1px_rgba(13,13,13,0.5)] hover:bg-neutral-800 focus-visible:ring-neutral-900",
  accent:
    "bg-[#A3FF38] text-black border border-[#82F200] shadow-[inset_3px_3px_6px_rgba(255,255,255,0.4)] hover:brightness-95 focus-visible:ring-[#82F200]",
  dark: "bg-neutral-900 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] hover:bg-neutral-800 focus-visible:ring-neutral-900",
  secondary:
    "bg-white text-neutral-900 border border-neutral-200 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.03)] hover:bg-neutral-50 focus-visible:ring-neutral-900",
  danger: "bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs tracking-wide",
  md: "px-5 py-2.5 text-sm tracking-wide",
  lg: "px-6 py-3.5 text-sm tracking-wide",
};

function Spinner() {
  return (
    <svg aria-hidden="true" className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

export default function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  pill = false,
  loading = false,
  pressScale = true,
  iconLeft,
  iconRight,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      aria-busy={loading}
      disabled={isDisabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-[background-color,color,border-color,box-shadow,filter,transform,opacity] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40",
        pressScale && "active:scale-[0.96] disabled:active:scale-100",
        pill ? "rounded-full" : "rounded-xl",
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {loading ? <Spinner /> : iconLeft}
      {children}
      {!loading && iconRight}
    </button>
  );
}
