import { ArrowPathIcon, CheckCircleIcon, ClockIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import Badge from "@/components/atoms/Badge/Badge";
import type { ShopState } from "@/lib/mock-creator";

const copy: Record<ShopState, string> = { pending: "Shop in review", approved: "Post approved", posted: "Post in review", active: "Access active", expired: "Access expired", overdue: "Post overdue", declined: "Shop declined", withdrawn: "Shop withdrawn" };

function getStateIcon(state: ShopState) {
  if (state === "approved" || state === "active") return <CheckCircleIcon className="size-3" />;
  if (state === "expired") return <ArrowPathIcon className="size-3" />;
  if (state === "declined" || state === "withdrawn") return <DocumentTextIcon className="size-3" />;
  return <ClockIcon className="size-3" />;
}

export default function ShopStateBadge({ state }: { state: ShopState }) {
  return <Badge variant="tag" label={copy[state]} icon={getStateIcon(state)} />;
}
