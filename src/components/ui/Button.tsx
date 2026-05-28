"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "dark" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  loading?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

function Spinner() {
  return (
    <svg
      aria-hidden="true"
      className="animate-spin w-4 h-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

export default function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  iconLeft,
  iconRight,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const base =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-900 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer";

  const variants = {
    primary:   "bg-[#A3FF38] text-black border border-[#82F200] shadow-[inset_3px_3px_6px_rgba(255,255,255,0.4)] hover:brightness-95 focus-visible:ring-[#82F200]",
    dark:      "bg-neutral-900 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] hover:opacity-90",
    secondary: "bg-white text-neutral-900 border border-gray-200 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.03)] hover:bg-gray-50",
    danger:    "bg-red-500 text-white hover:opacity-90 focus-visible:ring-red-500",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs tracking-wide",
    md: "px-5 py-2.5 text-sm tracking-wide",
    lg: "px-6 py-3.5 text-sm tracking-wide",
  };

  return (
    <button
      aria-busy={loading}
      disabled={isDisabled}
      className={cn(base, variants[variant], sizes[size], fullWidth && "w-full", className)}
      {...props}
    >
      {loading ? <Spinner /> : iconLeft}
      {children}
      {!loading && iconRight}
    </button>
  );
}
