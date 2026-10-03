import type { ShopState } from "@/lib/mock-creator";
import StatusPill, { type StatusTone } from "@/components/molecules/StatusPill/StatusPill";

const copy: Record<ShopState, string> = { pending: "Shop in review", approved: "Shop approved", draft: "Draft in review", ready: "Draft approved", posted: "Proof in review", active: "Access active", expired: "Access expired", overdue: "Post overdue", declined: "Shop declined", withdrawn: "Shop withdrawn" };

const tone: Record<ShopState, StatusTone> = {
  pending: "waiting",
  approved: "success",
  draft: "progress",
  ready: "success",
  posted: "progress",
  active: "success",
  expired: "muted",
  overdue: "danger",
  declined: "danger",
  withdrawn: "neutral",
};

export default function ShopStateBadge({ state }: { state: ShopState }) {
  return <StatusPill tone={tone[state]} label={copy[state]} />;
}
