import type { ShopState } from "@/lib/mock-creator";

const copy: Record<ShopState, string> = { pending: "Shop in review", approved: "Post approved", posted: "Post in review", active: "Access active", expired: "Access expired", overdue: "Post overdue", declined: "Shop declined", withdrawn: "Shop withdrawn" };

const dotColor: Record<ShopState, string> = {
  pending: "bg-yellow-400",
  approved: "bg-[#A3FF38]",
  posted: "bg-blue-400",
  active: "bg-[#A3FF38]",
  expired: "bg-neutral-300",
  overdue: "bg-red-500",
  declined: "bg-red-400",
  withdrawn: "bg-neutral-400",
};

export default function ShopStateBadge({ state }: { state: ShopState }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-600">
      <span aria-hidden="true" className={`size-1.5 shrink-0 rounded-full ${dotColor[state]}`} />
      {copy[state]}
    </span>
  );
}
