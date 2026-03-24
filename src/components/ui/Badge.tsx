type BadgeVariant =
  | "PENDING"
  | "APPROVED"
  | "DENIED"
  | "DELIVERED"
  | "COMPLETED"
  | "REVOKED"
  | "default";

interface BadgeProps {
  variant?: BadgeVariant;
  label?: string;
  className?: string;
}

const styles: Record<BadgeVariant, string> = {
  PENDING:   "bg-yellow-50 text-yellow-700 border border-yellow-200",
  APPROVED:  "bg-green-50 text-green-700 border border-green-200",
  DENIED:    "bg-red-50 text-red-600 border border-red-200",
  DELIVERED: "bg-blue-50 text-blue-700 border border-blue-200",
  COMPLETED: "bg-neutral-900 text-white border border-neutral-900",
  REVOKED:   "bg-gray-100 text-gray-500 border border-gray-200",
  default:   "bg-gray-100 text-gray-600 border border-gray-200",
};

const labels: Record<BadgeVariant, string> = {
  PENDING:   "Pending",
  APPROVED:  "Approved",
  DENIED:    "Denied",
  DELIVERED: "Delivered",
  COMPLETED: "Completed",
  REVOKED:   "Revoked",
  default:   "Unknown",
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
      {label ?? labels[variant]}
    </span>
  );
}
