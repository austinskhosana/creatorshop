import { cn } from "@/lib/utils";
import type { ShopState } from "@/lib/mock-creator";

const copy: Record<ShopState, string> = { pending: "Awaiting review", approved: "Ready to post", posted: "Proof under review", active: "Access active", expired: "Access expired", overdue: "Overdue", declined: "Not approved", withdrawn: "Withdrawn" };
const tone: Record<ShopState, string> = { pending: "bg-amber-50 text-amber-800 ring-amber-200", approved: "bg-[#efffdc] text-neutral-900 ring-[#b9ed78]", posted: "bg-blue-50 text-blue-700 ring-blue-200", active: "bg-neutral-900 text-white ring-neutral-900", expired: "bg-neutral-100 text-neutral-600 ring-neutral-200", overdue: "bg-red-50 text-red-700 ring-red-200", declined: "bg-neutral-100 text-neutral-500 ring-neutral-200", withdrawn: "bg-neutral-100 text-neutral-500 ring-neutral-200" };

export default function ShopStateBadge({ state }: { state: ShopState }) { return <span className={cn("inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset", tone[state])}>{copy[state]}</span>; }
