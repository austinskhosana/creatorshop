import Link from "next/link";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import Button from "@/components/atoms/Button/Button";
import { darkGradientButtonStyle } from "@/components/atoms/Button/darkGradientStyle";

interface CartSummaryProps {
  total: number;
  checkoutHref: string;
}

export default function CartSummary({ total, checkoutHref }: CartSummaryProps) {
  return (
    <aside className="sticky top-7 overflow-hidden rounded-[1.75rem] border border-neutral-200 bg-white p-6">
      <h2 className="text-balance text-[22px] font-semibold leading-[1.2] tracking-[-0.025em] text-neutral-950">
        You&rsquo;re shopping <span className="tabular-nums">${total}</span> worth of software.
      </h2>
      <p className="mt-2 text-pretty text-[13px] leading-[1.55] text-neutral-500">
        You pay with each brand&rsquo;s required content, never money.
      </p>
      <div className="mt-6 border-t border-neutral-100 pt-4">
        <div className="flex items-baseline justify-between text-[13px]">
          <span className="text-neutral-500">Retail value</span>
          <span className="font-semibold tabular-nums text-neutral-950">${total}</span>
        </div>
      </div>
      <Link href={checkoutHref} className="mt-5 block">
        <Button variant="dark" size="lg" fullWidth iconLeft={<ShoppingCartIcon className="size-4" />} style={{ ...darkGradientButtonStyle, padding: "14px 20px" }}>
          Confirm your shop
        </Button>
      </Link>
    </aside>
  );
}
