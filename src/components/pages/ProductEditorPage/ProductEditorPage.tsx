"use client";

import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import { EmptyBox } from "@/components/atoms/EmptyBox";
import Button from "@/components/atoms/Button/Button";
import { darkGradientButtonStyle } from "@/components/atoms/Button/darkGradientStyle";
import Input from "@/components/atoms/Input/Input";
import Textarea from "@/components/atoms/Textarea/Textarea";
import { CreatorBreadcrumb } from "@/components/molecules/CreatorBreadcrumb";
import { EmptyState } from "@/components/molecules/EmptyState";
import { PageHeader } from "@/components/molecules/PageHeader";
import { RadioCard } from "@/components/molecules/RadioCard";
import SelectableChip from "@/components/molecules/SelectableChip/SelectableChip";
import { PriceTierEditor, newTier, retargetTiers, type PriceTierInput } from "@/components/organisms/PriceTierEditor";
import { ProductPageCard } from "@/components/organisms/ProductPageCard";
import { SellingReadiness, canPublish } from "@/components/organisms/SellingReadiness";
import { BrandShell } from "@/components/templates/BrandShell";
import { ACCESS_METHODS, TIER_PLATFORMS, productPlatform } from "@/lib/brand-format";
import type { AccessMethod, AccessMonths, ProductPage } from "@/lib/data/brand-schema";
import { brandStore, useBrandState, useProductStats } from "@/lib/store/brand-store";

interface FormState {
  name: string;
  description: string;
  tiers: PriceTierInput[];
  accessMethod: AccessMethod;
  accessPayload: string;
  accessInstructions: string;
  /** Whether creators get access to make the post on approval, because no free plan covers it. */
  creatorAccessEnabled: boolean;
  creatorAccessMethod: AccessMethod;
  creatorAccessPayload: string;
  creatorAccessInstructions: string;
  stock: string;
  deadlineDays: string;
}

function toForm(product?: ProductPage): FormState {
  if (!product) {
    return {
      name: "",
      description: "",
      tiers: [newTier()],
      accessMethod: "promo_code",
      accessPayload: "",
      accessInstructions: "",
      creatorAccessEnabled: false,
      creatorAccessMethod: "promo_code",
      creatorAccessPayload: "",
      creatorAccessInstructions: "",
      stock: "",
      deadlineDays: "14",
    };
  }
  return {
    name: product.name,
    description: product.description,
    tiers: product.tiers.map((tier) => ({ ...tier, retailValue: String(tier.retailValue) })),
    accessMethod: product.accessMethod,
    accessPayload: product.accessPayload,
    accessInstructions: product.accessInstructions,
    creatorAccessEnabled: Boolean(product.creatorAccess),
    creatorAccessMethod: product.creatorAccess?.method ?? "promo_code",
    creatorAccessPayload: product.creatorAccess?.payload ?? "",
    creatorAccessInstructions: product.creatorAccess?.instructions ?? "",
    stock: String(product.stock),
    deadlineDays: String(product.deadlineDays),
  };
}

const wholeNumber = (value: string) => (/^\d+$/.test(value.trim()) ? Number(value) : NaN);

function validate(form: FormState, publishing: boolean) {
  const method = ACCESS_METHODS.find((item) => item.value === form.accessMethod)!;
  const creatorAccessMethod = ACCESS_METHODS.find((item) => item.value === form.creatorAccessMethod)!;
  const stock = wholeNumber(form.stock);
  const deadline = wholeNumber(form.deadlineDays);
  const tierErrors: Record<string, string> = {};
  for (const tier of form.tiers) {
    const value = wholeNumber(tier.retailValue);
    if (!(value >= 1)) tierErrors[tier.id] = "Add the retail value of this access in whole US dollars.";
  }
  const errors = {
    name: form.name.trim() ? undefined : "Name your product.",
    description: !publishing || form.description.trim().length >= 40 ? undefined : "Describe the product and the content you want — at least a couple of sentences.",
    stock: stock >= 1 && stock <= 500 ? undefined : "Set how many creator spots you have, from 1 to 500.",
    deadlineDays: deadline >= 3 && deadline <= 60 ? undefined : "Give creators between 3 and 60 days.",
    accessPayload: !publishing || !method.payloadLabel || form.accessPayload.trim() ? undefined : `Add the ${method.payloadLabel.toLowerCase()} creators receive.`,
    accessInstructions: !publishing || method.payloadLabel || form.accessInstructions.trim() ? undefined : "Tell creators how they'll get access.",
    creatorAccessPayload:
      !publishing || !form.creatorAccessEnabled || !creatorAccessMethod.payloadLabel || form.creatorAccessPayload.trim() ? undefined : `Add the ${creatorAccessMethod.payloadLabel.toLowerCase()} creators use to make the post.`,
    creatorAccessInstructions:
      !publishing || !form.creatorAccessEnabled || creatorAccessMethod.payloadLabel || form.creatorAccessInstructions.trim() ? undefined : "Tell creators how they'll get access to make the post.",
  };
  const ok = Object.values(errors).every((error) => !error) && Object.keys(tierErrors).length === 0;
  return { errors, tierErrors, ok };
}

function FormSection({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <section className="rounded-[20px] border border-neutral-200 bg-white p-5 sm:p-6">
      <h2 className="text-lg font-bold tracking-tight text-neutral-950">{title}</h2>
      <p className="mt-1 text-sm leading-6 text-neutral-500">{description}</p>
      <div className="mt-5">{children}</div>
    </section>
  );
}

/** B3 — list a product, or edit one. The brand is setting up a product page, not writing a brief. */
function Editor({ productId }: { productId?: string }) {
  const router = useRouter();
  const { account, products } = useBrandState();
  const stats = useProductStats();
  const existing = productId ? products.find((product) => product.id === productId) : undefined;
  const [form, setForm] = useState<FormState>(() => toForm(existing));
  const [attempt, setAttempt] = useState<"draft" | "publish" | null>(null);

  if (!account) return null;
  if (productId && !existing) {
    return (
      <div className="mx-auto max-w-xl px-5 py-12 sm:px-8">
        <EmptyState illustration={<EmptyBox />} title="Product page not found" description="It may have been removed in another tab." action={{ label: "Back to storefront", href: "/brand" }} />
      </div>
    );
  }

  const set = <Key extends keyof FormState>(key: Key, value: FormState[Key]) => setForm((current) => ({ ...current, [key]: value }));
  const method = ACCESS_METHODS.find((item) => item.value === form.accessMethod)!;
  const creatorAccessMethod = ACCESS_METHODS.find((item) => item.value === form.creatorAccessMethod)!;
  const isLive = existing && existing.status !== "draft";
  const publishable = canPublish(account);
  const { errors, tierErrors } = validate(form, attempt === "publish");
  const shown: Partial<typeof errors> = attempt ? errors : {};
  const firstProduct = products.length === 0;
  const platform = productPlatform(form);

  function save(publish: boolean) {
    const result = validate(form, publish);
    if (!result.ok) {
      setAttempt(publish ? "publish" : "draft");
      return;
    }
    const saved = brandStore.saveProduct(
      {
        name: form.name.trim(),
        description: form.description.trim(),
        tiers: form.tiers.map((tier) => ({ ...tier, retailValue: Number(tier.retailValue), months: tier.months as AccessMonths })),
        accessMethod: form.accessMethod,
        accessPayload: method.payloadLabel ? form.accessPayload.trim() : "",
        accessInstructions: form.accessInstructions.trim(),
        creatorAccess: form.creatorAccessEnabled
          ? {
              method: form.creatorAccessMethod,
              payload: creatorAccessMethod.payloadLabel ? form.creatorAccessPayload.trim() : "",
              instructions: form.creatorAccessInstructions.trim(),
            }
          : undefined,
        stock: Number(form.stock),
        deadlineDays: Number(form.deadlineDays),
      },
      { id: existing?.id, publish },
    );
    // Edits opened from the product page land back on it, so the change is visible where it was made.
    router.push(existing ? `/store/${account!.slug}/${saved.slug}` : "/brand");
  }

  // The preview reads the form as it is, so a half-filled tier still shows something sensible.
  const preview: ProductPage = {
    id: existing?.id ?? "preview",
    slug: "preview",
    status: existing?.status ?? "draft",
    createdAt: existing?.createdAt ?? "",
    name: form.name.trim() || "Your product",
    description: form.description.trim() || "Describe what it is, the content you want, and any must-haves.",
    tiers: form.tiers.map((tier) => ({ ...tier, retailValue: Number(tier.retailValue) || 0 })),
    accessMethod: form.accessMethod,
    accessPayload: "",
    accessInstructions: "",
    stock: Number(form.stock) || 0,
    deadlineDays: Number(form.deadlineDays) || 14,
  };
  const used = existing ? existing.stock - (stats[existing.id]?.remaining ?? existing.stock) : 0;

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
      <CreatorBreadcrumb items={[{ label: "Storefront", href: "/brand" }, { label: existing ? existing.name : "List a product" }]} />
      <div className="mt-7">
        <PageHeader
          title={existing ? "Edit product page" : "List a product"}
          description={firstProduct ? "You're setting up your storefront. Creators shop this page and pay with a post." : "Creators shop this page and pay with a post."}
        />
      </div>
      {!publishable ? (
        <div className="mt-7">
          <SellingReadiness account={account} />
        </div>
      ) : null}

      <div className="mt-7 grid gap-7 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            save(publishable);
          }}
          className="min-w-0 space-y-4"
        >
          <FormSection title="Product" description="Write it like a product description: what it is, the content you want in return, and any must-haves.">
            <div className="space-y-4">
              <Input label="Product name" required value={form.name} onChange={(event) => set("name", event.target.value)} placeholder={`e.g. ${account.companyName} Pro`} error={shown.name} />
              <Textarea
                label="Description"
                rows={5}
                maxLength={600}
                maxChars={600}
                currentLength={form.description.length}
                value={form.description}
                onChange={(event) => set("description", event.target.value)}
                placeholder="What creators get, what you'd love to see in the post, and anything it must mention."
                error={shown.description}
              />
            </div>
          </FormSection>

          <FormSection title="Price tiers" description="Pick the one platform this page runs on. Each tier is a content type on it and the access it buys — creators pick one, like choosing a size.">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Platform">
              {TIER_PLATFORMS.map((item) => (
                <SelectableChip key={item} label={item} selected={platform === item} onClick={() => set("tiers", retargetTiers(form.tiers, item))} />
              ))}
            </div>
            <div className="mt-5">
              <PriceTierEditor platform={platform} tiers={form.tiers} onChange={(tiers) => set("tiers", tiers)} errors={attempt ? tierErrors : {}} />
            </div>
          </FormSection>

          <FormSection title="Access delivery" description="How creators get the product once you confirm their post.">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Access delivery method">
              {ACCESS_METHODS.map((item) => (
                <SelectableChip key={item.value} label={item.label} selected={form.accessMethod === item.value} onClick={() => set("accessMethod", item.value)} />
              ))}
            </div>
            <div className="mt-5 space-y-4">
              {method.payloadLabel ? (
                <Input
                  label={method.payloadLabel}
                  value={form.accessPayload}
                  onChange={(event) => set("accessPayload", event.target.value)}
                  placeholder={method.placeholder}
                  autoComplete="off"
                  iconLeft={<LockClosedIcon className="size-4" />}
                  hint="Stored securely. Only revealed to a creator after you confirm their proof."
                  error={shown.accessPayload}
                />
              ) : null}
              <Textarea
                label={method.payloadLabel ? "Instructions (optional)" : "Instructions"}
                rows={3}
                value={form.accessInstructions}
                onChange={(event) => set("accessInstructions", event.target.value)}
                placeholder={method.value === "manual_seat" ? "e.g. We'll add your email to a workspace within one working day." : "e.g. Redeem at yourproduct.com/redeem after signing in."}
                error={shown.accessInstructions}
              />
            </div>
          </FormSection>

          <FormSection
            title="Creator access"
            description="Creators can't make a post about a product they can't use. If your free plan doesn't cover what they'd show, give them access the moment you approve them. It lasts through the delivery window."
          >
            <div className="grid gap-2 sm:grid-cols-2" role="radiogroup" aria-label="Creator access">
              <RadioCard
                name="creator-access"
                value="off"
                checked={!form.creatorAccessEnabled}
                onChange={() => set("creatorAccessEnabled", false)}
                title="Not needed"
                description="Your free plan covers everything they'd show."
              />
              <RadioCard
                name="creator-access"
                value="on"
                checked={form.creatorAccessEnabled}
                onChange={() => set("creatorAccessEnabled", true)}
                title="Give creator access"
                description="Unlocks on approval, so they can make the post."
              />
            </div>
            {form.creatorAccessEnabled ? (
              <div className="mt-5 space-y-4">
                <div className="flex flex-wrap gap-2" role="group" aria-label="Creator access delivery method">
                  {ACCESS_METHODS.map((item) => (
                    <SelectableChip key={item.value} label={item.label} selected={form.creatorAccessMethod === item.value} onClick={() => set("creatorAccessMethod", item.value)} />
                  ))}
                </div>
                {creatorAccessMethod.payloadLabel ? (
                  <Input
                    label={`Creator access ${creatorAccessMethod.payloadLabel.toLowerCase()}`}
                    value={form.creatorAccessPayload}
                    onChange={(event) => set("creatorAccessPayload", event.target.value)}
                    placeholder={creatorAccessMethod.placeholder}
                    autoComplete="off"
                    iconLeft={<LockClosedIcon className="size-4" />}
                    hint="Revealed when you approve a creator. Full access still waits for their proof."
                    error={shown.creatorAccessPayload}
                  />
                ) : null}
                <Textarea
                  label={creatorAccessMethod.payloadLabel ? "Creator access instructions (optional)" : "Creator access instructions"}
                  rows={3}
                  value={form.creatorAccessInstructions}
                  onChange={(event) => set("creatorAccessInstructions", event.target.value)}
                  placeholder="e.g. Redeem at yourproduct.com/redeem. It unlocks every feature you'd like in the post."
                  error={shown.creatorAccessInstructions}
                />
              </div>
            ) : null}
          </FormSection>

          <FormSection title="Stock and delivery" description="How many creators can shop this page, and how long they have to post once approved.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Stock"
                required
                type="number"
                inputMode="numeric"
                min={1}
                value={form.stock}
                onChange={(event) => set("stock", event.target.value)}
                placeholder="Creator spots"
                hint={used > 0 ? `${used} already taken by approved shops.` : "When it runs out, the page sells out and waiting shoppers are declined."}
                error={shown.stock}
              />
              <Input
                label="Delivery window"
                type="number"
                inputMode="numeric"
                min={3}
                max={60}
                value={form.deadlineDays}
                onChange={(event) => set("deadlineDays", event.target.value)}
                iconRight={<span className="text-xs">days</span>}
                hint="Counted from the moment you approve a shopper."
                error={shown.deadlineDays}
              />
            </div>
          </FormSection>

          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end lg:hidden">
            <EditorActions isLive={Boolean(isLive)} publishable={publishable} onSave={save} />
          </div>
        </form>

        <aside className="hidden lg:block">
          <div className="sticky top-8 space-y-4">
            <p className="text-xs font-medium text-neutral-500">How creators see it</p>
            <ProductPageCard product={preview} remaining={Math.max(0, preview.stock - used)} variant="storefront" />
            <div className="space-y-2">
              <EditorActions isLive={Boolean(isLive)} publishable={publishable} onSave={save} />
            </div>
            {isLive ? <p className="text-xs leading-5 text-neutral-500">Edits apply to new shoppers. Shops you&apos;ve already approved keep the terms they were approved on.</p> : null}
          </div>
        </aside>
      </div>
    </div>
  );
}

function EditorActions({ isLive, publishable, onSave }: { isLive: boolean; publishable: boolean; onSave: (publish: boolean) => void }) {
  if (isLive) {
    return (
      <Button type="button" variant="dark" size="lg" fullWidth onClick={() => onSave(false)} style={{ ...darkGradientButtonStyle, padding: "13px 20px" }}>
        Save changes
      </Button>
    );
  }
  return (
    <>
      <Button
        type="button"
        variant="dark"
        size="lg"
        fullWidth
        disabled={!publishable}
        aria-describedby={publishable ? undefined : "publish-blocked-reason"}
        onClick={() => onSave(true)}
        style={{ ...darkGradientButtonStyle, padding: "13px 20px" }}
      >
        Publish product page
      </Button>
      {!publishable ? (
        <p id="publish-blocked-reason" className="text-center text-xs leading-5 text-neutral-500">
          Subscribe and verify your storefront to publish. Drafts save any time.
        </p>
      ) : null}
      <Button type="button" variant="secondary" size="lg" fullWidth onClick={() => onSave(false)}>
        Save as draft
      </Button>
    </>
  );
}

export default function ProductEditorPage({ productId }: { productId?: string }) {
  return (
    <BrandShell>
      <Editor key={productId ?? "new"} productId={productId} />
    </BrandShell>
  );
}
