"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import Button from "@/components/atoms/Button/Button";
import { darkGradientButtonStyle } from "@/components/atoms/Button/darkGradientStyle";
import Input from "@/components/atoms/Input/Input";
import { MeshGradientPanel } from "@/components/atoms/MeshGradientPanel";
import { BrandCardVisual } from "@/components/molecules/BrandCardVisual";
import Dropdown from "@/components/molecules/Dropdown/Dropdown";
import { CATEGORY_LABELS } from "@/lib/listings/explore";
import { brandStore, domainOf, emailMatchesWebsite, slugify } from "@/lib/store/brand-store";
import { cn } from "@/lib/utils";

const STEPS = ["Your account", "Your storefront", "Subscribe"] as const;
const PLAN_FEATURES = ["Unlimited product pages", "Review every shopper", "Delivery tracking and proof confirmation", "Pay in access, not cash"];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function StepIndicator({ step }: { step: number }) {
  return (
    <div>
      <p className="text-xs font-medium text-neutral-500">
        Step <span className="tabular-nums">{step + 1}</span> of {STEPS.length} · {STEPS[step]}
      </p>
      <ol className="mt-2.5 grid grid-cols-3 gap-1.5" aria-label="Sign-up progress">
        {STEPS.map((label, index) => (
          <li key={label} aria-current={index === step ? "step" : undefined} className="h-1 overflow-hidden rounded-full bg-neutral-100">
            <span className={cn("block h-full rounded-full bg-neutral-900 transition-[width] duration-300 ease-out", index <= step ? "w-full" : "w-0")} />
            <span className="sr-only">{label}{index < step ? " (done)" : ""}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** The quiet note that the prototype isn't wired to real auth or billing yet. */
function PreviewNote({ children }: { children: string }) {
  return <p className="mt-4 text-center text-xs leading-5 text-neutral-400">{children}</p>;
}

function SignUpFlow() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [attempted, setAttempted] = useState(false);
  const [form, setForm] = useState({ ownerName: "", workEmail: "", companyName: "", website: "", tagline: "", category: "Productivity" });
  const set = (key: keyof typeof form) => (value: string) => setForm((current) => ({ ...current, [key]: value }));

  const errors: Partial<Record<keyof typeof form, string>> =
    step === 0
      ? {
          ownerName: form.ownerName.trim() ? undefined : "Add your name.",
          workEmail: EMAIL_PATTERN.test(form.workEmail.trim()) ? undefined : "Add a valid work email.",
        }
      : step === 1
        ? {
            companyName: form.companyName.trim() ? undefined : "Add your company name.",
            website: domainOf(form.website).includes(".") ? undefined : "Add your website, e.g. yourproduct.com",
            tagline: form.tagline.trim() ? undefined : "Describe your product in one line.",
          }
        : {};
  const hasErrors = Object.values(errors).some(Boolean);
  const show = (key: keyof typeof form) => (attempted ? errors[key] : undefined);

  function next(event: FormEvent) {
    event.preventDefault();
    if (hasErrors) {
      setAttempted(true);
      return;
    }
    setAttempted(false);
    setStep((current) => current + 1);
  }

  function finish(subscribed: boolean) {
    const website = `https://${domainOf(form.website)}`;
    brandStore.signUp({
      ownerName: form.ownerName.trim(),
      workEmail: form.workEmail.trim().toLowerCase(),
      companyName: form.companyName.trim(),
      slug: slugify(form.companyName),
      website,
      tagline: form.tagline.trim(),
      category: form.category,
      verified: emailMatchesWebsite(form.workEmail, website),
      subscription: subscribed ? "active" : "none",
      rating: null,
      completedShops: 0,
    });
    router.push("/brand");
  }

  const emailDomain = form.workEmail.split("@")[1]?.toLowerCase();
  const siteDomain = domainOf(form.website);

  return (
    <>
      <StepIndicator step={step} />

      {step < 2 ? (
        <form onSubmit={next} noValidate className="mt-8">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-950">{step === 0 ? "Sell your software for posts" : "Set up your storefront"}</h1>
          <p className="mt-2 text-sm leading-6 text-neutral-500">
            {step === 0
              ? "Creators shop your product and pay with content. Start with your account."
              : "This is what creators see when they land on your store. You can change it any time."}
          </p>

          <div className="mt-7 space-y-4">
            {step === 0 ? (
              <>
                <Input label="Your name" autoComplete="name" value={form.ownerName} onChange={(event) => set("ownerName")(event.target.value)} error={show("ownerName")} />
                <Input
                  label="Work email"
                  type="email"
                  autoComplete="email"
                  value={form.workEmail}
                  onChange={(event) => set("workEmail")(event.target.value)}
                  hint="Use your company address. Matching it to your website is how we verify your storefront."
                  error={show("workEmail")}
                />
              </>
            ) : (
              <>
                <Input label="Company name" autoComplete="organization" value={form.companyName} onChange={(event) => set("companyName")(event.target.value)} error={show("companyName")} />
                <Input label="Website" inputMode="url" autoComplete="url" placeholder="yourproduct.com" value={form.website} onChange={(event) => set("website")(event.target.value)} error={show("website")} />
                <Input
                  label="One-line description"
                  maxLength={90}
                  placeholder="What your product does, in a sentence"
                  value={form.tagline}
                  onChange={(event) => set("tagline")(event.target.value)}
                  error={show("tagline")}
                />
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="brand-category" className="text-sm font-medium text-neutral-800">Category</label>
                  <Dropdown
                    id="brand-category"
                    variant="field"
                    ariaLabel="Product category"
                    value={form.category}
                    onChange={set("category")}
                    options={CATEGORY_LABELS.map((label) => ({ value: label, label }))}
                  />
                </div>
              </>
            )}
          </div>

          <div className="mt-8 flex items-center gap-2">
            {step > 0 ? (
              <Button type="button" variant="secondary" size="lg" iconLeft={<ArrowLeftIcon className="size-4" />} onClick={() => setStep((current) => current - 1)}>
                Back
              </Button>
            ) : null}
            <Button type="submit" variant="dark" size="lg" fullWidth iconRight={<ArrowRightIcon className="size-4" />} style={{ ...darkGradientButtonStyle, padding: "14px 20px" }}>
              Continue
            </Button>
          </div>
          {step === 0 ? (
            <p className="mt-6 text-center text-sm text-neutral-500">
              Already selling on Creatorshop?{" "}
              <Link href="/brand/signin" className="font-medium text-neutral-950 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-900">
                Sign in
              </Link>
            </p>
          ) : null}
        </form>
      ) : (
        <div className="mt-8">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-950">Open your store</h1>
          <p className="mt-2 text-sm leading-6 text-neutral-500">One flat price. Creators shop free and pay you with posts — no cash changes hands between you.</p>

          <div className="mt-7 rounded-[20px] border border-neutral-200 p-5">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm font-semibold text-neutral-950">Creatorshop for brands</p>
                <p className="mt-0.5 text-xs text-neutral-500">Cancel any time. Nothing is deleted.</p>
              </div>
              <p className="text-3xl font-bold tracking-tight tabular-nums text-neutral-950">
                $50<span className="text-sm font-medium text-neutral-500">/month</span>
              </p>
            </div>
            <ul className="mt-5 space-y-2.5 border-t border-neutral-100 pt-4">
              {PLAN_FEATURES.map((feature) => (
                <li key={feature} className="flex items-center gap-2.5 text-sm text-neutral-700">
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-[#A3FF38]">
                    <CheckIcon aria-hidden="true" className="size-3 text-neutral-950" strokeWidth={2.5} />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 flex items-start gap-3 rounded-2xl bg-neutral-100 p-4">
            <ShieldCheckIcon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-neutral-900" />
            <p className="text-sm leading-6 text-neutral-600">
              {emailDomain && emailDomain === siteDomain
                ? `${form.workEmail} matches ${siteDomain}, so your storefront will be verified and ready to publish.`
                : `${form.workEmail} doesn't match ${siteDomain || "your website"}. You can build product pages now and publish once you verify with a work email from your domain.`}
            </p>
          </div>

          <div className="mt-7 flex items-center gap-2">
            <Button type="button" variant="secondary" size="lg" iconLeft={<ArrowLeftIcon className="size-4" />} onClick={() => setStep(1)}>
              Back
            </Button>
            <Button type="button" variant="dark" size="lg" fullWidth onClick={() => finish(true)} style={{ ...darkGradientButtonStyle, padding: "14px 20px" }}>
              Start subscription
            </Button>
          </div>
          <button
            type="button"
            onClick={() => finish(false)}
            className="mt-2 flex min-h-10 w-full items-center justify-center rounded-xl text-[13px] font-medium text-neutral-500 transition-colors duration-150 hover:bg-neutral-50 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
          >
            Set up first, subscribe before publishing
          </button>
          <PreviewNote>Payments aren&apos;t connected in this preview — starting the subscription is simulated.</PreviewNote>
        </div>
      )}
    </>
  );
}

function SignInFlow() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [attempted, setAttempted] = useState(false);
  const error = attempted && !EMAIL_PATTERN.test(email.trim()) ? "Add the work email you signed up with." : undefined;

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!EMAIL_PATTERN.test(email.trim())) {
      setAttempted(true);
      return;
    }
    brandStore.signInDemo();
    router.push("/brand");
  }

  return (
    <form onSubmit={submit} noValidate>
      <h1 className="text-3xl font-bold tracking-tight text-neutral-950">Welcome back</h1>
      <p className="mt-2 text-sm leading-6 text-neutral-500">Sign in to manage your storefront and review shoppers.</p>
      <div className="mt-7">
        <Input label="Work email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} error={error} />
      </div>
      <Button type="submit" variant="dark" size="lg" fullWidth iconRight={<ArrowRightIcon className="size-4" />} className="mt-6" style={{ ...darkGradientButtonStyle, padding: "14px 20px" }}>
        Sign in
      </Button>
      <p className="mt-6 text-center text-sm text-neutral-500">
        New to Creatorshop?{" "}
        <Link href="/brand/signup" className="font-medium text-neutral-950 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-900">
          Join the waitlist
        </Link>
      </p>
      <PreviewNote>Sign-in isn&apos;t connected in this preview — any email opens the Fernpad demo storefront.</PreviewNote>
    </form>
  );
}

/** The way into the brand side, reached from the brand landing page's buttons. */
export default function BrandAuthPage({ mode }: { mode: "signup" | "signin" }) {
  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="flex flex-col px-5 py-6 sm:px-10 lg:px-16">
        <Link href="/brands" className="w-fit rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2">
          <Image src="/Logo.svg" alt="Creatorshop for brands" width={142} height={41} className="h-8 w-auto" priority />
        </Link>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12">{mode === "signup" ? <SignUpFlow /> : <SignInFlow />}</div>
      </div>
      <div className="hidden p-4 lg:block">
        <MeshGradientPanel className="flex h-full items-center justify-center px-12">
          <BrandCardVisual />
        </MeshGradientPanel>
      </div>
    </div>
  );
}
