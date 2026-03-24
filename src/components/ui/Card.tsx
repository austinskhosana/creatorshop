import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: "none" | "sm" | "md" | "lg";
  variant?: "default" | "gradient";
}

export default function Card({
  padding = "md",
  variant = "default",
  className = "",
  children,
  ...props
}: CardProps) {
  const paddings = {
    none: "",
    sm:   "p-4",
    md:   "p-6",
    lg:   "p-8",
  };

  const variants = {
    default:  "bg-white border border-gray-200",
    gradient: "bg-gradient-to-b from-[#A3FF38] to-white border border-gray-200",
  };

  return (
    <div
      className={[
        "rounded-2xl",
        variants[variant],
        paddings[padding],
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}
