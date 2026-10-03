"use client";

import { CreditCardIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import { NoticeBanner } from "@/components/molecules/NoticeBanner";
import { domainOf } from "@/lib/store/brand-store";
import type { BrandAccount } from "@/lib/data/brand-schema";

/** Whether this account can publish: an active subscription and a verified storefront. */
export function canPublish(account: BrandAccount) {
  return account.verified && account.subscription === "active";
}

/** The banners that explain what stands between the brand and a live product page. */
export default function SellingReadiness({ account }: { account: BrandAccount }) {
  if (canPublish(account)) return null;
  return (
    <div className="space-y-2.5">
      {account.subscription !== "active" ? (
        <NoticeBanner
          icon={<CreditCardIcon className="size-5" strokeWidth={1.75} />}
          title={account.subscription === "paused" ? "Your product pages are paused" : "Subscribe to publish"}
          description={
            account.subscription === "paused"
              ? "Your subscription lapsed, so pages are hidden from the store. Approved shops carry on. Resubscribe to restore everything as it was."
              : "Build product pages now. They go live once your $50/month subscription is active."
          }
          action={{ label: account.subscription === "paused" ? "Resubscribe" : "Subscribe", href: "/brand/settings?section=billing" }}
        />
      ) : null}
      {!account.verified ? (
        <NoticeBanner
          icon={<EnvelopeIcon className="size-5" strokeWidth={1.75} />}
          title="Verify your storefront"
          description={`Your work email doesn't match ${domainOf(account.website)}. Update it to an address at your domain to publish.`}
          action={{ label: "Update email", href: "/brand/settings?section=account" }}
        />
      ) : null}
    </div>
  );
}
