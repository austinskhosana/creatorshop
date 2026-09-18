import Link from "next/link";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import Button from "@/components/atoms/Button/Button";

interface CartSummaryProps {
  total: number;
  checkoutHref: string;
}

export default function CartSummary({ total, checkoutHref }: CartSummaryProps) {
  return (
    <aside className="sticky top-7 overflow-hidden rounded-[1.75rem] border border-neutral-200 bg-white p-5 sm:p-6">
      <h2 className="text-2xl font-bold leading-tight text-neutral-950">
        You&rsquo;re shopping <span className="tabular-nums">${total}</span> worth of software.
      </h2>
      <p className="mt-4 text-sm leading-6 text-neutral-500">
        You pay with each brand&rsquo;s required content, never money.
      </p>
      <div className="mt-7 border-t border-neutral-200 pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-neutral-500">Retail value</span>
          <span className="font-semibold tabular-nums text-neutral-950">${total}</span>
        </div>
      </div>
      <Link href={checkoutHref} className="mt-5 block">
        <Button variant="accent" size="lg" fullWidth iconLeft={<ShoppingCartIcon className="size-4" />}>
          Confirm your shop
        </Button>
      </Link>
    </aside>
  );
}
