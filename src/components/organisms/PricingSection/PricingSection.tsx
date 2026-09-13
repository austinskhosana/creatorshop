import { PricingCard } from "@/components/molecules/PricingCard";

function TargetIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="3" fill="currentColor" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z" />
    </svg>
  );
}

export default function PricingSection() {
  return (
    <section className="bg-white px-6 pt-24 text-center sm:px-10 sm:pt-36 lg:px-16 lg:pt-56">
      <h2 className="text-2xl leading-tight font-medium tracking-tight text-neutral-900 sm:text-3xl">
        Simple pricing for every brand
      </h2>
      <p className="mx-auto mt-4 max-w-md leading-relaxed text-neutral-500">
        Run your own drops for a flat monthly fee, or hand the whole campaign
        to us.
      </p>

      <div className="mx-auto mt-16 grid max-w-3xl grid-cols-1 items-stretch gap-6 sm:grid-cols-2">
        <PricingCard
          badgeIcon={<SparkleIcon />}
          badgeLabel="Subscription"
          description="List your own drops, review every pitch, and manage delivery yourself."
          price="$50"
          priceSuffix="/month"
          features={[
            "Unlimited drops",
            "Self-serve listing",
            "Review every pitch",
            "Delivery tracking",
            "Pay in access, not cash",
            "Email support",
          ]}
          buttonLabel="Get started"
          buttonVariant="dark"
          featured
        />

        <PricingCard
          badgeIcon={<TargetIcon />}
          badgeLabel="Custom"
          description="We run your drop end to end. Sourcing creators, reviewing pitches, and managing delivery for you."
          price="Custom"
          features={[
            "Dedicated campaign manager",
            "Creator sourcing & vetting",
            "Full pitch review on your behalf",
            "Delivery tracking & reporting",
            "Multiple concurrent drops",
            "Priority support",
          ]}
          buttonLabel="Contact us"
          buttonVariant="secondary"
        />
      </div>
    </section>
  );
}
