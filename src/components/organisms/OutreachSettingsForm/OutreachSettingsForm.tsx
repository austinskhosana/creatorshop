"use client";

import { useState, type FormEvent } from "react";
import Button from "@/components/atoms/Button/Button";
import { darkGradientButtonStyle } from "@/components/atoms/Button/darkGradientStyle";
import { CampaignPicker, NO_CAMPAIGN } from "@/components/molecules/CampaignPicker";
import { IntroMessageField } from "@/components/molecules/IntroMessageField";
import { SendModePicker, type SendMode } from "@/components/molecules/SendModePicker";
import type { BrandAccount, Shopper } from "@/lib/data/brand-schema";
import { draftIntro } from "@/lib/intro-message";
import type { LiveCampaign, OutreachSettings } from "@/lib/store/brand-store";

interface OutreachSettingsFormProps {
  account: BrandAccount;
  campaigns: LiveCampaign[];
  /** The creator the preview is written to — the card on top of the deck, or one from the directory. */
  previewFor: Pick<Shopper, "name">;
  onSave: (settings: OutreachSettings) => void;
  /** Shown beside save when the form sits in a modal. */
  onCancel?: () => void;
}

/**
 * Everything a right swipe sends, on one page: the brand's intro, whether it goes out without
 * asking, and the campaign that follows it. Settings → Intro message. Built from the same pieces as
 * IntroModal, which the creator deck opens, so both read the same.
 */
export default function OutreachSettingsForm({ account, campaigns, previewFor, onSave, onCancel }: OutreachSettingsFormProps) {
  const [intro, setIntro] = useState(() => account.introMessage ?? draftIntro(account));
  const [mode, setMode] = useState<SendMode>(account.autoSendInvites ? "auto" : "review");
  // A default campaign that's since paused, sold out or closed isn't offered again.
  const [campaignId, setCampaignId] = useState(() =>
    campaigns.some(({ product }) => product.id === account.defaultInviteProductId) ? account.defaultInviteProductId! : NO_CAMPAIGN,
  );
  const [attempted, setAttempted] = useState(false);
  const campaign = campaigns.find(({ product }) => product.id === campaignId)?.product;
  const error = intro.trim() ? undefined : "Write an intro before saving.";

  function save(event: FormEvent) {
    event.preventDefault();
    if (error) {
      setAttempted(true);
      return;
    }
    onSave({ introMessage: intro.trim(), autoSendInvites: mode === "auto", defaultInviteProductId: campaign?.id });
  }

  return (
    <form onSubmit={save} noValidate>
      {account.introMessage ? null : (
        <p className="mb-4 rounded-xl bg-neutral-100 px-3.5 py-2.5 text-[13px] leading-5 text-neutral-600">
          A starting draft in your name. Nothing goes out until you save it — make it sound like you.
        </p>
      )}

      <IntroMessageField value={intro} onChange={setIntro} error={attempted ? error : undefined} previewFor={previewFor} campaign={campaign} layout="split" />

      <div className="mt-6">
        <SendModePicker value={mode} onChange={setMode} />
      </div>

      <div className="mt-6">
        <CampaignPicker
          campaigns={campaigns}
          value={campaignId}
          onChange={setCampaignId}
          legend="Campaign"
          hint={mode === "auto" ? "Goes out with every intro." : "Picked for you each time. You can switch it per creator."}
        />
      </div>

      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {onCancel ? (
          <Button type="button" variant="secondary" size="md" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
        <Button type="submit" variant="dark" size="md" style={{ ...darkGradientButtonStyle, padding: "10px 18px" }}>
          Save intro
        </Button>
      </div>
    </form>
  );
}
