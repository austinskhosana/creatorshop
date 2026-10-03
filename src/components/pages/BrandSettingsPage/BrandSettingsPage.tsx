"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  ArrowRightStartOnRectangleIcon,
  BellAlertIcon,
  BuildingStorefrontIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  CreditCardIcon,
  EnvelopeIcon,
  FlagIcon,
  InboxStackIcon,
  LinkIcon,
  PaperAirplaneIcon,
  ShieldCheckIcon,
  StarIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import Button from "@/components/atoms/Button/Button";
import { darkGradientButtonStyle } from "@/components/atoms/Button/darkGradientStyle";
import Input from "@/components/atoms/Input/Input";
import { ConfirmDialog } from "@/components/molecules/ConfirmDialog";
import Dropdown from "@/components/molecules/Dropdown/Dropdown";
import { FlashMessage, useFlash } from "@/components/molecules/FlashMessage";
import { PageHeader } from "@/components/molecules/PageHeader";
import { StatusPill } from "@/components/molecules/StatusPill";
import { OutreachSettingsForm } from "@/components/organisms/OutreachSettingsForm";
import { SettingsNav, type SettingsNavLink } from "@/components/pages/SettingsPage/settings/SettingsNav";
import { SectionTitle, SettingRow } from "@/components/pages/SettingsPage/settings/SettingsPrimitives";
import { BrandShell } from "@/components/templates/BrandShell";
import { Switch } from "@/components/ui/switch";
import type { BrandAccount } from "@/lib/data/brand-schema";
import { CATEGORY_LABELS } from "@/lib/listings/explore";
import { SHOPPERS } from "@/lib/mock-brand";
import { brandStore, domainOf, emailMatchesWebsite, useBrandState, useLiveCampaigns } from "@/lib/store/brand-store";

export type BrandSettingsSection = "storefront" | "intro" | "billing" | "notifications" | "account";

const LINKS: SettingsNavLink<BrandSettingsSection>[] = [
  ["storefront", "Storefront", BuildingStorefrontIcon],
  ["intro", "Intro message", PaperAirplaneIcon],
  ["billing", "Billing", CreditCardIcon],
  ["notifications", "Notifications", BellAlertIcon],
  ["account", "Account", UserCircleIcon],
];

const NOTIFICATIONS = [
  [InboxStackIcon, "New shoppers", "A creator checks out one of your product pages"],
  [LinkIcon, "Proof submitted", "A creator posts and sends you the link"],
  [ClockIcon, "Overdue posts", "A delivery deadline passes without proof"],
  [ChatBubbleLeftRightIcon, "Messages", "A creator writes in your thread"],
  [StarIcon, "Ratings", "A creator rates a completed shop"],
  [FlagIcon, "Report updates", "Changes to a report on one of your shops"],
] as const;

const SUBSCRIPTION_STATUS: Record<BrandAccount["subscription"], { label: string; tone: "success" | "waiting" | "muted" | "neutral" }> = {
  active: { label: "Active", tone: "success" },
  grace: { label: "Payment retrying", tone: "waiting" },
  paused: { label: "Paused", tone: "muted" },
  none: { label: "Not subscribed", tone: "neutral" },
};

const PANEL = "rounded-[20px] border border-neutral-200 bg-white p-5 sm:p-7";

function StorefrontSection({ account, onSaved }: { account: BrandAccount; onSaved: () => void }) {
  const [form, setForm] = useState({ companyName: account.companyName, website: account.website, tagline: account.tagline, category: account.category });
  const [attempted, setAttempted] = useState(false);
  const errors = {
    companyName: form.companyName.trim() ? undefined : "Add your company name.",
    website: domainOf(form.website).includes(".") ? undefined : "Add your website, e.g. yourproduct.com",
    tagline: form.tagline.trim() ? undefined : "Describe your product in one line.",
  };

  function save(event: FormEvent) {
    event.preventDefault();
    if (Object.values(errors).some(Boolean)) {
      setAttempted(true);
      return;
    }
    const website = `https://${domainOf(form.website)}`;
    brandStore.updateAccount({ companyName: form.companyName.trim(), website, tagline: form.tagline.trim(), category: form.category, verified: emailMatchesWebsite(account.workEmail, website) });
    onSaved();
  }

  return (
    <form onSubmit={save} noValidate className={PANEL}>
      <SectionTitle title="Your storefront" description="What creators see at the top of your store and on every product page." />
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Input label="Company name" value={form.companyName} onChange={(event) => setForm({ ...form, companyName: event.target.value })} error={attempted ? errors.companyName : undefined} />
        <Input
          label="Website"
          inputMode="url"
          value={form.website}
          onChange={(event) => setForm({ ...form, website: event.target.value })}
          hint="Changing your domain re-checks verification against your work email."
          error={attempted ? errors.website : undefined}
        />
        <div className="sm:col-span-2">
          <Input label="One-line description" maxLength={90} value={form.tagline} onChange={(event) => setForm({ ...form, tagline: event.target.value })} error={attempted ? errors.tagline : undefined} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="storefront-category" className="text-sm font-medium text-neutral-800">Category</label>
          <Dropdown id="storefront-category" variant="field" ariaLabel="Product category" value={form.category} onChange={(category) => setForm({ ...form, category })} options={CATEGORY_LABELS.map((label) => ({ value: label, label }))} />
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <Button type="submit" variant="dark" size="md" style={{ ...darkGradientButtonStyle, padding: "10px 18px" }}>
          Save storefront
        </Button>
      </div>
    </form>
  );
}

function IntroSection({ account, onSaved }: { account: BrandAccount; onSaved: (message: string) => void }) {
  const campaigns = useLiveCampaigns();
  return (
    <section className={PANEL}>
      <SectionTitle title="Intro message" description="The first thing creators read from you — sent when you swipe right on them in Creators, with a campaign if you pick one." />
      <div className="mt-6">
        <OutreachSettingsForm
          account={account}
          campaigns={campaigns}
          previewFor={SHOPPERS[0]}
          onSave={(settings) => {
            brandStore.saveOutreach(settings);
            onSaved(settings.autoSendInvites ? "Intro saved. Right swipes send it automatically." : "Intro saved. Right swipes open it for you to review.");
          }}
        />
      </div>
    </section>
  );
}

function BillingSection({ account, onChanged }: { account: BrandAccount; onChanged: (message: string) => void }) {
  const status = SUBSCRIPTION_STATUS[account.subscription];
  const active = account.subscription === "active";
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  return (
    <section className={PANEL}>
      <SectionTitle title="Billing" description="One flat price for everything. Cancelling pauses your product pages — nothing is deleted, and approved shops carry on." />
      <div className="mt-6 rounded-2xl border border-neutral-200 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-neutral-950">Creatorshop for brands</p>
            <p className="mt-1 text-3xl font-bold tracking-tight tabular-nums text-neutral-950">
              $50<span className="text-sm font-medium text-neutral-500">/month</span>
            </p>
          </div>
          <StatusPill tone={status.tone} label={status.label} />
        </div>
        <div className="mt-5 flex flex-wrap gap-2 border-t border-neutral-100 pt-4">
          {active ? (
            <Button variant="secondary" size="md" onClick={() => setConfirmingCancel(true)}>
              Cancel subscription
            </Button>
          ) : (
            <Button
              variant="dark"
              size="md"
              onClick={() => {
                brandStore.setSubscription("active");
                onChanged(account.subscription === "paused" ? "Welcome back. Your product pages are restored." : "Subscription started. You can publish product pages.");
              }}
              style={{ ...darkGradientButtonStyle, padding: "10px 18px" }}
            >
              {account.subscription === "paused" ? "Resubscribe" : "Start subscription"}
            </Button>
          )}
          <Button variant="secondary" size="md" disabled aria-describedby="billing-portal-note">
            Update card and invoices
          </Button>
        </div>
      </div>
      <p id="billing-portal-note" className="mt-3 text-xs leading-5 text-neutral-400">Payments aren&apos;t connected in this preview — subscription changes are simulated. Card updates and invoices will open in the Stripe customer portal.</p>
      <ConfirmDialog
        open={confirmingCancel}
        onOpenChange={setConfirmingCancel}
        title="Cancel your subscription?"
        description="Every live product page is paused and hidden from the store. Approved shops carry on — you'll still confirm proof and release access. Resubscribe any time to restore everything as it was."
        confirmLabel="Cancel subscription"
        cancelLabel="Keep subscription"
        destructive
        onConfirm={() => {
          brandStore.setSubscription("paused");
          onChanged("Subscription cancelled. Your product pages are paused.");
        }}
      />
    </section>
  );
}

function NotificationsSection() {
  const [preferences, setPreferences] = useState(NOTIFICATIONS.map((_, index) => index !== 4));
  return (
    <section className={PANEL}>
      <SectionTitle title="Notifications" description="Pick what reaches you in-app and by email. Receipts always arrive." />
      <div className="mt-6 space-y-3">
        {NOTIFICATIONS.map(([Icon, label, description], index) => (
          <div key={label} className="flex min-h-[4.5rem] items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-neutral-100 text-neutral-700"><Icon className="size-[19px]" /></span>
            <div id={`brand-preference-${index}`} className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{label}</p>
              <p className="mt-0.5 text-xs text-neutral-500">{description}</p>
            </div>
            <Switch
              checked={preferences[index]}
              onCheckedChange={(checked) => setPreferences((current) => current.map((value, itemIndex) => (itemIndex === index ? checked : value)))}
              aria-labelledby={`brand-preference-${index}`}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

function AccountSection({ account, onSaved, onSignOut }: { account: BrandAccount; onSaved: (message: string) => void; onSignOut: () => void }) {
  const [email, setEmail] = useState(account.workEmail);
  const [editing, setEditing] = useState(false);
  const domain = domainOf(account.website);
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  return (
    <section className={PANEL}>
      <SectionTitle title="Account" description="Who owns this storefront, and how it's verified." />
      <div className="mt-6 space-y-3">
        <SettingRow icon={UserCircleIcon} label="Owner" value={account.ownerName} />
        {editing ? (
          <form
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              if (!valid) return;
              const verified = emailMatchesWebsite(email, account.website);
              brandStore.updateAccount({ workEmail: email.trim().toLowerCase(), verified });
              setEditing(false);
              onSaved(verified ? "Email updated. Your storefront is verified." : `Email updated. Use an address at ${domain} to verify.`);
            }}
            className="rounded-2xl border border-neutral-200 p-3.5"
          >
            <Input label="Work email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} hint={`Matches ${domain} to verify your storefront.`} error={!valid && email ? "Add a valid email." : undefined} />
            <div className="mt-3 flex justify-end gap-2">
              <Button type="button" variant="secondary" size="sm" onClick={() => { setEditing(false); setEmail(account.workEmail); }}>Cancel</Button>
              <Button type="submit" variant="dark" size="sm" disabled={!valid}>Save email</Button>
            </div>
          </form>
        ) : (
          <SettingRow icon={EnvelopeIcon} label="Work email" value={account.workEmail} actionLabel="Change" onClick={() => setEditing(true)} />
        )}
        <div className="flex min-h-[4.5rem] items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-neutral-100 text-neutral-700"><ShieldCheckIcon className="size-[19px]" /></span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-neutral-900">Verification</p>
            <p className="mt-0.5 text-xs text-neutral-500">{account.verified ? `Work email matches ${domain}.` : `Use a work email at ${domain} to publish.`}</p>
          </div>
          <StatusPill tone={account.verified ? "success" : "waiting"} label={account.verified ? "Verified" : "Unverified"} />
        </div>
        <SettingRow icon={ArrowRightStartOnRectangleIcon} label="Sign out" value="Return to the brand landing page" actionLabel="Sign out" onClick={onSignOut} />
      </div>
    </section>
  );
}

function Settings({ initialSection }: { initialSection: BrandSettingsSection }) {
  const router = useRouter();
  const { account } = useBrandState();
  const [section, setSection] = useState<BrandSettingsSection>(initialSection);
  const [flash, showFlash] = useFlash();
  if (!account) return null;

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
      <PageHeader title="Settings" description="Your storefront, intro message, billing, notifications, and account." />
      <div className="mt-7 grid gap-7 lg:grid-cols-[15.5rem_minmax(0,1fr)]">
        <SettingsNav<BrandSettingsSection> active={section} onChange={setSection} links={LINKS} />
        <div className="min-w-0">
          {section === "storefront" ? <StorefrontSection key={account.slug} account={account} onSaved={() => showFlash({ message: "Storefront saved." })} /> : null}
          {section === "intro" ? <IntroSection account={account} onSaved={(message) => showFlash({ message })} /> : null}
          {section === "billing" ? <BillingSection account={account} onChanged={(message) => showFlash({ message })} /> : null}
          {section === "notifications" ? <NotificationsSection /> : null}
          {section === "account" ? (
            <AccountSection
              account={account}
              onSaved={(message) => showFlash({ message })}
              onSignOut={() => {
                brandStore.signOut();
                router.push("/brands");
              }}
            />
          ) : null}
        </div>
      </div>
      <FlashMessage {...flash} />
    </div>
  );
}

export default function BrandSettingsPage({ section = "storefront" }: { section?: BrandSettingsSection }) {
  return (
    <BrandShell>
      <Settings key={section} initialSection={section} />
    </BrandShell>
  );
}
