import Link from "next/link";
import { Badge } from "@/components/atoms/Badge";

type ShopStatus = "PENDING" | "APPROVED" | "DENIED" | "DELIVERED" | "COMPLETED" | "REVOKED";

interface Shop {
  id: string;
  name: string;
  logoUrl: string | null;
  planName: string;
  months: number;
  status: ShopStatus;
}

const STATUS_LABEL: Record<ShopStatus, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  DENIED: "Denied",
  DELIVERED: "Delivered",
  COMPLETED: "Completed",
  REVOKED: "Revoked",
};

export default function ShopCard({ shop }: { shop: Shop }) {
  return (
    <div className="flex h-full flex-col gap-3 rounded-3xl border border-gray-200 bg-white p-3">
      <div
        className="flex h-36 items-center justify-center rounded-2xl border border-[#EFEFEF]"
        style={{ background: "radial-gradient(ellipse at 0% 0%, rgba(163,255,56,0.32) 0%, #ffffff 65%)" }}
      >
        {shop.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- faithful port of the prior build, not yet redesigned
          <img src={shop.logoUrl} alt={shop.name} className="h-20 w-20 object-contain" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-200">
            <span className="text-2xl font-bold text-gray-400">{shop.name[0]}</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 px-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-lg leading-snug font-semibold text-neutral-900">{shop.name}</p>
          <Badge variant={shop.status} label={STATUS_LABEL[shop.status]} />
        </div>
        <p className="text-sm leading-snug text-gray-400">
          Get {shop.months} {shop.months === 1 ? "month" : "months"} of {shop.name} {shop.planName}
        </p>
      </div>

      <Link
        href={`/shops/${shop.id}`}
        className="w-full rounded-xl bg-neutral-900 py-3 text-center text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] transition-opacity hover:opacity-90"
      >
        View Shop
      </Link>
    </div>
  );
}
