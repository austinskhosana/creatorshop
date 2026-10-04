"use client";

import { useState } from "react";
import { ActionMenu } from "@/components/molecules/ActionMenu";
import { ConfirmDialog } from "@/components/molecules/ConfirmDialog";
import { BrandShopCard } from "@/components/organisms/BrandShopCard";
import { CampaignPicker, NO_CAMPAIGN } from "@/components/molecules/CampaignPicker";
import { IntroMessageField } from "@/components/molecules/IntroMessageField";
import { RadioCard } from "@/components/molecules/RadioCard";
import { SendModePicker, type SendMode } from "@/components/molecules/SendModePicker";
import { IntroModal } from "@/components/organisms/IntroModal";
import { OutreachSettingsForm } from "@/components/organisms/OutreachSettingsForm";
import { PriceTierEditor, newTier, type PriceTierInput } from "@/components/organisms/PriceTierEditor";
import { ProductPageCard } from "@/components/organisms/ProductPageCard";
import { PriceTierPicker } from "@/components/molecules/PriceTierPicker";
import { draftIntro } from "@/lib/intro-message";
import { DEMO_ACCOUNT, DEMO_PRODUCTS, DEMO_SHOPS, SHOPPERS, getShopper } from "@/lib/mock-brand";

/** Stateful wrappers for brand-side components that can't preview from static props. */
export function PriceTierEditorDemo() {
  const [tiers, setTiers] = useState<PriceTierInput[]>(() => [
    { ...newTier(), name: "Instagram carousel", months: 3, retailValue: "36" },
    { ...newTier(), name: "Instagram Reel", months: 6, retailValue: "" },
  ]);
  return (
    <div className="w-full max-w-xl">
      <PriceTierEditor platform="Instagram" tiers={tiers} onChange={setTiers} errors={tiers[1] && !tiers[1].retailValue ? { [tiers[1].id]: "Add the retail value of this access in whole US dollars." } : {}} />
    </div>
  );
}

const noop = () => {};

export function ActionMenuDemo() {
  return (
    <div className="pb-56">
      <ActionMenu label="More actions" items={[{ label: "Edit", onSelect: noop }, { label: "Duplicate", onSelect: noop }, { label: "Pause", onSelect: noop }, { label: "Close", tone: "danger", onSelect: noop }]} />
    </div>
  );
}

export function ProductPageCardManageDemo() {
  return (
    <div className="w-80">
      <ProductPageCard product={DEMO_PRODUCTS[0]} remaining={10} pending={4} actions={[{ label: "Edit", onSelect: noop }, { label: "Pause", onSelect: noop }]} />
    </div>
  );
}

/** `shopIndex` picks a seeded Fernpad shop. */
export function BrandShopCardDemo({ shopIndex }: { shopIndex: number }) {
  const shop = DEMO_SHOPS[shopIndex];
  const shopper = getShopper(shop.shopperId)!;
  return (
    <div className="w-80">
      <BrandShopCard shop={shop} shopper={shopper} onReviewProof={noop} onViewReceipt={noop} onCloseShop={noop} />
    </div>
  );
}

export function ConfirmDialogDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex min-h-10 items-center rounded-xl border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-800 transition-[background-color,transform] duration-150 hover:bg-neutral-50 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
      >
        Close product page
      </button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Close Fernpad Pro?"
        description="It leaves the store and 4 waiting shoppers are declined. Approved shops carry on, and you can reopen the page later."
        confirmLabel="Close product page"
        destructive
        onConfirm={noop}
      />
    </>
  );
}

const LIVE_CAMPAIGNS = DEMO_PRODUCTS.filter((product) => product.status === "live").map((product) => ({ product, remaining: 4 }));
const SAVED_INTRO = "Hi {first name}! Sam from Fernpad here. Your desk-setup videos are exactly how we picture people using Fernpad — would you be up for trying it?";

export function RadioCardDemo() {
  const [value, setValue] = useState("review");
  return (
    <div className="grid w-full max-w-lg gap-2 sm:grid-cols-2">
      <RadioCard name="radio-card-demo" value="review" checked={value === "review"} onChange={setValue} title="Review each one" description="Opens your intro so you can tailor it before it sends." />
      <RadioCard name="radio-card-demo" value="auto" checked={value === "auto"} onChange={setValue} title="Send automatically" description="Sends straight away. Undo takes it back." />
    </div>
  );
}

export function PriceTierPickerDemo() {
  const product = DEMO_PRODUCTS[0];
  const [value, setValue] = useState(product.tiers[0].id);
  return (
    <div className="w-full max-w-md">
      <PriceTierPicker name="price-tier-picker-demo" tiers={product.tiers} value={value} onChange={setValue} />
    </div>
  );
}

export function SendModePickerDemo() {
  const [value, setValue] = useState<SendMode>("review");
  return (
    <div className="w-full max-w-lg">
      <SendModePicker value={value} onChange={setValue} />
    </div>
  );
}

export function CampaignPickerDemo({ empty = false }: { empty?: boolean }) {
  const [value, setValue] = useState(empty ? NO_CAMPAIGN : LIVE_CAMPAIGNS[0]?.product.id ?? NO_CAMPAIGN);
  return (
    <div className="w-full max-w-md">
      <CampaignPicker campaigns={empty ? [] : LIVE_CAMPAIGNS} value={value} onChange={setValue} legend="Campaign" hint="Sent straight after your intro." />
    </div>
  );
}

export function IntroMessageFieldDemo({ withCampaign = false }: { withCampaign?: boolean }) {
  const [value, setValue] = useState(() => draftIntro(DEMO_ACCOUNT));
  return (
    <div className="w-full max-w-md">
      <IntroMessageField value={value} onChange={setValue} previewFor={SHOPPERS[0]} campaign={withCampaign ? LIVE_CAMPAIGNS[0]?.product : undefined} />
    </div>
  );
}

export function OutreachSettingsFormDemo({ saved = false }: { saved?: boolean }) {
  const account = saved ? { ...DEMO_ACCOUNT, introMessage: SAVED_INTRO, autoSendInvites: true, defaultInviteProductId: LIVE_CAMPAIGNS[0]?.product.id } : DEMO_ACCOUNT;
  return (
    <div className="w-full max-w-lg">
      <OutreachSettingsForm account={account} campaigns={LIVE_CAMPAIGNS} previewFor={SHOPPERS[0]} onSave={noop} />
    </div>
  );
}

/** `variant` picks the modal's state: the first-swipe setup, the deck's auto-send button, a saved intro to review, or auto-send held by a lapsed campaign. */
export function IntroModalDemo({ variant = "setup" }: { variant?: "setup" | "edit" | "review" | "paused" }) {
  const [open, setOpen] = useState(false);
  const [round, setRound] = useState(0);
  const account = variant === "setup" ? DEMO_ACCOUNT : { ...DEMO_ACCOUNT, introMessage: SAVED_INTRO, autoSendInvites: variant !== "review" };
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex min-h-10 items-center rounded-xl border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-800 transition-[background-color,transform] duration-150 hover:bg-neutral-50 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
      >
        {variant === "edit" ? "Auto-send on" : `Swipe right on ${SHOPPERS[0].name}`}
      </button>
      <IntroModal
        key={round}
        open={open}
        onClosed={() => setRound((n) => n + 1)}
        shopper={variant === "edit" ? undefined : SHOPPERS[0]}
        previewFor={SHOPPERS[0]}
        account={account}
        campaigns={LIVE_CAMPAIGNS}
        notice={variant === "paused" ? "Fernpad Sync isn't live any more, so this one waited for you. Pick another campaign or send your intro on its own." : undefined}
        onCancel={() => setOpen(false)}
        onSend={() => setOpen(false)}
        onSave={() => setOpen(false)}
      />
    </>
  );
}
