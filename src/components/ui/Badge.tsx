type ShopStatus = "PENDING" | "APPROVED" | "DENIED" | "DELIVERED" | "COMPLETED" | "REVOKED";
type BadgeVariant = ShopStatus | "count" | "tag" | "stat" | "default";

interface BadgeProps {
  variant?: BadgeVariant;
  label: string;
  className?: string;
}

const styles: Record<BadgeVariant, string> = {
  // Shop statuses
  PENDING:   "bg-yellow-50 text-yellow-700 border border-yellow-200",
  APPROVED:  "bg-[#A3FF38]/20 text-green-800 border border-[#A3FF38]/40",
  DENIED:    "bg-red-50 text-red-600 border border-red-200",
  DELIVERED: "bg-blue-50 text-blue-700 border border-blue-200",
  COMPLETED: "bg-neutral-900 text-white",
  REVOKED:   "bg-gray-100 text-gray-500 border border-gray-200",
  // UI variants
  count:   "bg-[#A3FF38] text-black",
  tag:     "bg-white text-gray-600 border border-gray-200",
  stat:    "bg-neutral-900 text-white",
  default: "bg-gray-100 text-gray-600 border border-gray-200",
};

export default function Badge({ variant = "default", label, className = "" }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        styles[variant],
        className,
      ].join(" ")}
    >
      {label}
    </span>
  );
}
