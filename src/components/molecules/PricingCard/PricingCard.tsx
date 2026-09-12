import { ReactNode } from "react";
import { Button } from "@/components/atoms/Button";
import { MeshGradientPanel } from "@/components/atoms/MeshGradientPanel";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  badgeIcon: ReactNode;
  badgeLabel: string;
  description: string;
  price: string;
  priceSuffix?: string;
  features: string[];
  buttonLabel: string;
  buttonVariant?: "primary" | "dark" | "secondary";
  /** Wraps the card in the metallic shader background/border instead of a plain white card. */
  featured?: boolean;
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function PricingCard({
  badgeIcon,
  badgeLabel,
  description,
  price,
  priceSuffix,
  features,
  buttonLabel,
  buttonVariant = "secondary",
  featured = false,
}: PricingCardProps) {
  const content = (
    <div className="flex h-full flex-col p-8 text-left sm:p-10">
      <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white">
        {badgeIcon}
        {badgeLabel}
      </span>

      <p className={cn("mt-6 leading-relaxed", featured ? "text-neutral-700" : "text-neutral-500")}>
        {description}
      </p>

      <div className="mt-8 flex items-baseline gap-1.5">
        <span className="text-5xl leading-none font-medium tracking-tight text-neutral-900">{price}</span>
        {priceSuffix && <span className="text-neutral-600">{priceSuffix}</span>}
      </div>

      <ul className="mt-8 flex flex-col gap-4">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-3">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-white">
              <CheckIcon />
            </span>
            <span className="text-neutral-700">{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-10">
        <Button variant={buttonVariant} size="md" pill fullWidth style={{ boxShadow: "none" }}>
          {buttonLabel}
        </Button>
      </div>
    </div>
  );

  if (featured) {
    return (
      <MeshGradientPanel className="h-full shadow-[0_20px_45px_-15px_rgba(0,0,0,0.18)]">
        {content}
      </MeshGradientPanel>
    );
  }

  return <div className={cn("h-full rounded-[32px] border border-neutral-200 bg-white")}>{content}</div>;
}
