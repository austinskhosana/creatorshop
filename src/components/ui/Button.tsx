import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "dark" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export default function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-semibold rounded-xl transition-opacity disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed";

  const variants = {
    primary:   "bg-[#A3FF38] text-black hover:opacity-90",
    dark:      "bg-neutral-900 text-white hover:opacity-90",
    secondary: "bg-white text-neutral-900 border border-gray-200 hover:bg-gray-50",
    danger:    "bg-red-500 text-white hover:opacity-90",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs tracking-wide",
    md: "px-5 py-2.5 text-sm tracking-wide",
    lg: "px-6 py-3.5 text-sm tracking-wide",
  };

  return (
    <button
      className={[
        base,
        variants[variant],
        sizes[size],
        fullWidth ? "w-full" : "",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
