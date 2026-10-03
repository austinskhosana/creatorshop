import { StarIcon } from "@heroicons/react/24/solid";
import PlatformIcon from "@/components/atoms/PlatformIcon/PlatformIcon";
import { formatMonths, formatUsd } from "@/lib/brand-format";
import type { PriceTier, Shopper } from "@/lib/data/brand-schema";

interface ShopperPitchDetailsProps {
  shopper: Shopper;
  /** The tier the creator chose at checkout. Leave out on a plain profile. */
  tier?: PriceTier;
  productName?: string;
}

/**
 * What a brand needs beyond the public profile to decide: the price tier chosen, track record, and
 * example posts. Sits under a profile card. Never shows incomplete shops — that stays private.
 */
export default function ShopperPitchDetails({ shopper, tier, productName }: ShopperPitchDetailsProps) {
  return (
    <>
      <div className="mt-6 grid grid-cols-2 gap-2.5">
        <div className="rounded-xl bg-neutral-100 px-4 py-3">
          <p className="text-xs text-neutral-500">Rating</p>
          <p className="mt-0.5 flex items-center gap-1 text-lg font-bold tabular-nums text-neutral-950">
            {shopper.rating !== null ? (
              <>
                <StarIcon aria-hidden="true" className="size-4 text-neutral-900" />
                {shopper.rating.toFixed(1)}
              </>
            ) : (
              <span className="text-base font-semibold">New shopper</span>
            )}
          </p>
        </div>
        <div className="rounded-xl bg-neutral-100 px-4 py-3">
          <p className="text-xs text-neutral-500">Completed shops</p>
          <p className="mt-0.5 text-lg font-bold tabular-nums text-neutral-950">{shopper.completedShops}</p>
        </div>
      </div>

      {shopper.examplePosts.length > 0 ? (
        <div className="mt-6">
          <h2 className="text-lg font-bold tracking-tight text-neutral-900">Example posts</h2>
          <ul className="mt-3 space-y-2">
            {shopper.examplePosts.map((post) => (
              <li key={post.url}>
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-11 items-center gap-3 rounded-xl border border-neutral-200 px-3.5 text-sm font-medium text-neutral-900 transition-[background-color,border-color] duration-150 hover:border-neutral-300 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                >
                  <PlatformIcon platform={post.platform} className="size-4 shrink-0 text-neutral-500" />
                  <span className="truncate">{post.title}</span>
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {tier ? (
        <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl bg-neutral-950 px-4 py-3.5 text-white">
          <div className="min-w-0">
            <p className="text-xs text-white/60">Paying for {productName ?? "your product"} with</p>
            <p className="mt-0.5 flex items-center gap-2 truncate text-sm font-semibold">
              <PlatformIcon platform={tier.name} className="size-4 shrink-0" />
              {tier.name} · {formatMonths(tier.months)}
            </p>
          </div>
          <p className="shrink-0 text-lg font-bold tabular-nums">{formatUsd(tier.retailValue)}</p>
        </div>
      ) : null}
    </>
  );
}
