"use client";

import { usePathname } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowRightIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import Button from "@/components/atoms/Button/Button";
import Input from "@/components/atoms/Input/Input";
import { Fire } from "@/components/atoms/Fire";
import Dropdown from "@/components/molecules/Dropdown/Dropdown";
import { BrandCardVisual } from "@/components/molecules/BrandCardVisual";
import { showToast } from "@/components/molecules/Toast";
import { SocialCapitalCard } from "@/components/organisms/SocialCapitalCard";
import { validateWaitlistPayload, type WaitlistAudience, type WaitlistFieldError } from "@/lib/waitlist";
import { cn } from "@/lib/utils";

const CREATOR_PLATFORMS = ["Instagram", "TikTok", "YouTube", "X", "LinkedIn", "Newsletter"];
const AUDIENCE_SIZES = ["Under 5K", "5K-25K", "25K-100K", "100K-500K", "500K+"];

type WaitlistFormState = {
  email: string;
  name: string;
  companyName: string;
  website: string;
  socialHandle: string;
  platform: string;
  audienceSize: string;
};

type WaitlistFormProps = {
  audience: WaitlistAudience;
  compact?: boolean;
};

const INITIAL_FORM: WaitlistFormState = {
  email: "",
  name: "",
  companyName: "",
  website: "",
  socialHandle: "",
  platform: CREATOR_PLATFORMS[0],
  audienceSize: AUDIENCE_SIZES[1],
};

const COPY = {
  brand: {
    title: "Put your product in the next drop",
    description: "Join the first software teams trading subscription access for creator distribution.",
    button: "Request brand access",
    success: "Your brand access request is in.",
    toast: "Brand access request saved.",
  },
  creator: {
    title: "Shop software with social capital",
    description: "Join the first creators using posts as buying power for software drops.",
    button: "Request creator access",
    success: "Your creator access request is in.",
    toast: "Creator access request saved.",
  },
} satisfies Record<WaitlistAudience, Record<string, string>>;

const formChrome = {
  brand: "border-neutral-950 bg-white shadow-[8px_8px_0_#A3FF38]",
  creator: "border-neutral-950 bg-white shadow-[8px_8px_0_#0f0f0f]",
} satisfies Record<WaitlistAudience, string>;

function WaitlistSuccess({ audience }: { audience: WaitlistAudience }) {
  return (
    <div className={cn("rounded-[20px] border-2 p-5", formChrome[audience])}>
      <div className="flex items-start gap-3">
        <CheckCircleIcon className="mt-0.5 size-6 shrink-0 text-neutral-950" />
        <div>
          <p className="font-semibold text-neutral-950">{COPY[audience].success}</p>
          <p className="mt-1 text-sm leading-6 text-neutral-500">
            We&apos;ll send the key when the next access batch opens.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function WaitlistForm({ audience, compact = false }: WaitlistFormProps) {
  const pathname = usePathname();
  const [form, setForm] = useState<WaitlistFormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<WaitlistFieldError>({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (key: keyof WaitlistFormState) => (value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setMessage("");
  };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const payload = {
      audience,
      email: form.email,
      name: form.name,
      companyName: form.companyName,
      website: form.website,
      socialHandle: form.socialHandle,
      platform: form.platform,
      audienceSize: form.audienceSize,
      sourcePath: pathname,
    };
    const validation = validateWaitlistPayload(payload);

    if (!validation.ok) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        errors?: WaitlistFieldError;
        message?: string;
      };

      if (!response.ok || !data.ok) {
        if (data.errors) setErrors(data.errors);
        setMessage(data.message ?? "We could not save your spot. Try again in a moment.");
        return;
      }

      setSubmitted(true);
      showToast({ title: COPY[audience].toast, description: "Keep an eye on your inbox.", icon: "check" });
    } catch {
      setMessage("We could not reach the waitlist. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) return <WaitlistSuccess audience={audience} />;

  return (
    <form
      onSubmit={submit}
      noValidate
      className={cn(
        compact ? "space-y-4" : "rounded-[24px] border-2 p-5 sm:p-6",
        !compact && formChrome[audience],
      )}
    >
      <div>
        <h2 className="mt-2 text-2xl font-semibold leading-tight text-neutral-950">{COPY[audience].title}</h2>
        <p className="mt-2 text-sm leading-6 text-neutral-500">{COPY[audience].description}</p>
      </div>

      <div className="mt-5 space-y-4">
        {audience === "creator" ? (
          <>
            <Input label="Your name" autoComplete="name" value={form.name} onChange={(event) => set("name")(event.target.value)} error={errors.name} required />
            <Input label="Social handle" placeholder="@yourhandle" value={form.socialHandle} onChange={(event) => set("socialHandle")(event.target.value)} error={errors.socialHandle} required />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-neutral-800">Main platform</span>
                <Dropdown
                  variant="field"
                  ariaLabel="Primary platform"
                  value={form.platform}
                  onChange={set("platform")}
                  options={CREATOR_PLATFORMS.map((platform) => ({ label: platform, value: platform }))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-neutral-800">Audience size</span>
                <Dropdown
                  variant="field"
                  ariaLabel="Audience size"
                  value={form.audienceSize}
                  onChange={set("audienceSize")}
                  options={AUDIENCE_SIZES.map((size) => ({ label: size, value: size }))}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <Input label="Company name" autoComplete="organization" value={form.companyName} onChange={(event) => set("companyName")(event.target.value)} error={errors.companyName} required />
            <Input label="Website" inputMode="url" autoComplete="url" placeholder="yourproduct.com" value={form.website} onChange={(event) => set("website")(event.target.value)} error={errors.website} required />
            <Input label="Your name" autoComplete="name" value={form.name} onChange={(event) => set("name")(event.target.value)} error={errors.name} />
          </>
        )}

        <Input label={audience === "brand" ? "Work email" : "Email"} type="email" autoComplete="email" value={form.email} onChange={(event) => set("email")(event.target.value)} error={errors.email} required />
      </div>

      {message ? <p className="mt-4 text-sm leading-6 text-red-500">{message}</p> : null}

      <Button type="submit" variant="dark" size="lg" fullWidth loading={loading} iconRight={<ArrowRightIcon className="size-4" />} className="mt-5" style={{ boxShadow: "none" }}>
        {COPY[audience].button}
      </Button>
    </form>
  );
}

function WaitlistArtifacts({ audience }: { audience: WaitlistAudience }) {
  if (audience === "brand") {
    return (
      <div className="relative mx-auto mt-10 w-full max-w-md lg:mx-0">
        <div className="rotate-2">
          <BrandCardVisual />
        </div>
        <div className="absolute -right-2 -bottom-5 max-w-[13rem] rotate-[-3deg] rounded-[14px] border-2 border-neutral-950 bg-[#A3FF38] px-4 py-3 text-xs leading-5 text-neutral-950 shadow-[5px_5px_0_#0f0f0f]">
          Access is the media budget.
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto mt-10 w-full max-w-md lg:mx-0">
      <SocialCapitalCard />
      <div className="absolute -left-2 -bottom-5 max-w-[13rem] rotate-[-3deg] rounded-[14px] border-2 border-neutral-950 bg-white px-4 py-3 text-xs leading-5 text-neutral-950 shadow-[5px_5px_0_#0f0f0f]">
        Content becomes buying power.
      </div>
    </div>
  );
}

export function WaitlistBand({ audience }: { audience: WaitlistAudience }) {
  const isBrand = audience === "brand";

  return (
    <section
      id={`${audience}-waitlist`}
      className={cn(
        "relative isolate z-10 overflow-hidden px-6 py-16 sm:px-10 sm:py-20 lg:px-16",
        isBrand ? "bg-white text-neutral-950" : "bg-[#A3FF38] text-neutral-950",
      )}
    >
      <Fire
        background={isBrand ? "#ffffff" : "#A3FF38"}
        rows={90}
        widthPercent={100}
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-full w-full opacity-60"
      />
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(360px,0.72fr)] lg:items-center">
        <div className="relative">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
            {isBrand ? "Next brand drop" : "Next creator drop"}
          </p>
          <h2 className="mt-4 max-w-3xl text-balance text-4xl font-semibold leading-[0.98] text-neutral-950 sm:text-5xl lg:text-6xl">
            {isBrand ? "Trade access for attention." : "Your content is the new cash."}
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-neutral-700 sm:text-base">
            {isBrand
              ? "We are opening Creatorshop in small batches for software teams that want creator distribution without cash retainers."
              : "We are inviting creators in batches so every software drop has real inventory, clear terms, and brands paying attention."}
          </p>
          <dl className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              isBrand ? ["01", "List your drop", "Turn seats, months, or credits into creator offers."] : ["01", "Browse the drop", "See software offers before the public shelf opens."],
              isBrand ? ["02", "Review pitches", "Choose creators by fit, not just follower count."] : ["02", "Apply to shop", "Pitch with your handle, audience, and platform fit."],
              isBrand ? ["03", "Pay in access", "Creators post. You approve proof. No retainers."] : ["03", "Pay with posts", "Create the content and unlock access. No cash required."],
            ].map(([number, title, detail]) => (
              <div key={number} className="border-t-2 border-neutral-950 pt-3">
                <dt className="text-xs text-neutral-500">{number}</dt>
                <dd className="mt-1 text-sm font-semibold leading-5 text-neutral-950">{title}</dd>
                <dd className="mt-1 text-xs leading-5 text-neutral-600">{detail}</dd>
              </div>
            ))}
          </dl>
          <WaitlistArtifacts audience={audience} />
        </div>
        <WaitlistForm audience={audience} />
      </div>
    </section>
  );
}
