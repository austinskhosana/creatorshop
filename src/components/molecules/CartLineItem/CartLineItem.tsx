import { CalendarIcon, TrashIcon } from "@heroicons/react/24/outline";
import Badge from "@/components/atoms/Badge/Badge";
import BrandLogo from "@/components/atoms/BrandLogo/BrandLogo";
import PlatformIcon from "@/components/atoms/PlatformIcon/PlatformIcon";

export interface CartLineItemData {
  id: string;
  product: string;
  brand: string;
  tier: string;
  value: number;
  access: string;
}

interface CartLineItemProps {
  item: CartLineItemData;
  onRemove: (id: string) => void;
}

export default function CartLineItem({ item, onRemove }: CartLineItemProps) {
  return (
    <div className="flex items-center gap-4 p-5 sm:gap-5 sm:p-6">
      <BrandLogo slug={item.id} name={item.brand} size={56} className="shrink-0" />
      <div className="min-w-0 flex-1">
        <h2 className="truncate text-base font-bold">{item.product}</h2>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge variant="tag" label={item.tier} icon={<PlatformIcon platform={item.tier} className="h-3 w-3" />} />
          <Badge variant="tag" label={`${item.access} access`} icon={<CalendarIcon className="h-3 w-3" />} />
        </div>
      </div>
      <div className="flex flex-col items-end gap-3">
        <p className="font-bold tabular-nums">${item.value}</p>
        <button
          onClick={() => onRemove(item.id)}
          aria-label={`Remove ${item.product}`}
          className="grid size-10 place-items-center rounded-xl border border-neutral-200 text-neutral-400 transition-[background-color,color,border-color] duration-150 hover:border-red-200 hover:bg-red-50 hover:text-red-600 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
        >
          <TrashIcon className="size-4" strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
}
