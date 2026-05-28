import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ShopStatus = "PENDING" | "APPROVED" | "DENIED" | "DELIVERED" | "COMPLETED" | "REVOKED";
type BadgeVariant = ShopStatus | "count" | "tag" | "stat" | "default";

interface BadgeProps {
  variant?: BadgeVariant;
  label: string;
  icon?: ReactNode;
  className?: string;
}

const styles: Record<BadgeVariant, string> = {
  PENDING:   "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200",
  APPROVED:  "bg-[#A3FF38]/20 text-green-800 ring-1 ring-[#A3FF38]/40",
  DENIED:    "bg-red-50 text-red-600 ring-1 ring-red-200",
  DELIVERED: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  COMPLETED: "bg-neutral-900 text-white",
  REVOKED:   "bg-gray-100 text-gray-500",
  count:     "bg-[#A3FF38]/40 text-[#3E7300]",
  tag:       "bg-white text-gray-600 border border-gray-200",
  stat:      "bg-neutral-900 text-white",
  default:   "bg-gray-100 text-gray-600 border border-gray-200",
};

const STATUS_LABELS: Partial<Record<BadgeVariant, string>> = {
  PENDING:   "Pending",
  APPROVED:  "Approved",
  DENIED:    "Denied",
  DELIVERED: "Delivered",
  COMPLETED: "Completed",
  REVOKED:   "Revoked",
};

export default function Badge({ variant = "default", label, icon, className }: BadgeProps) {
  const statusLabel = STATUS_LABELS[variant];

  return (
    <span
      role={statusLabel ? "status" : undefined}
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium",
        styles[variant],
        className,
      )}
    >
      {icon && <span aria-hidden="true" className="w-3 h-3">{icon}</span>}
      {label}
    </span>
  );
}
