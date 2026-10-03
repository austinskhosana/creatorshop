"use client";

import { useState, type FormEvent } from "react";
import { CheckIcon } from "@heroicons/react/16/solid";
import { ArrowRightIcon, ExclamationTriangleIcon, PaperAirplaneIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import Button from "@/components/atoms/Button/Button";
import { darkGradientButtonStyle } from "@/components/atoms/Button/darkGradientStyle";
import Textarea from "@/components/atoms/Textarea/Textarea";
import { CampaignPicker, NO_CAMPAIGN } from "@/components/molecules/CampaignPicker";
import { IntroMessageField } from "@/components/molecules/IntroMessageField";
import { ModalPanel } from "@/components/molecules/ModalPanel";
import { NoticeBanner } from "@/components/molecules/NoticeBanner";
import { SendModePicker, type SendMode } from "@/components/molecules/SendModePicker";
import type { BrandAccount, Shopper } from "@/lib/data/brand-schema";
import { INTRO_MAX_LENGTH, draftIntro, fillIntro, firstNameOf } from "@/lib/intro-message";
import type { LiveCampaign, OutreachSettings } from "@/lib/store/brand-store";

export interface ComposedInvite {
  /** Filled in with the creator's name — exactly what lands in their thread. */
  message: string;
  productId?: string;
  /** The template written on the brand's first right swipe, to save as their intro. */
  template?: string;
  /** Right swipes send without asking from now on. */
  autoSend: boolean;
}

interface IntroModalProps {
  open: boolean;
  /** After the exit animation. */
  onClosed: () => void;
  account: BrandAccount;
  campaigns: LiveCampaign[];
  /** The creator a right swipe is reaching out to. Without one, the modal edits the intro and how it sends. */
  shopper?: Shopper;
  /** Who the preview is written to when there's no `shopper`. */
  previewFor?: Pick<Shopper, "name">;
  /** Why a right swipe that would have sent automatically stopped to ask. */
  notice?: string;
  /** Closing without saving or sending. After a swipe, the creator's card comes back. */
  onCancel: () => void;
  /** With a `shopper`: the invite to send, and any intro written on the way. */
  onSend?: (invite: ComposedInvite) => void;
  /** Without a `shopper`: the intro and sending settings to save. */
  onSave?: (settings: OutreachSettings) => void;
}

const DARK_BUTTON_PADDING = { padding: "10px 18px" };

/**
 * The brand's intro, in one modal wherever it comes up — the first right swipe, or the deck's
 * auto-send button. Both run the same two steps: write the intro beside a live preview, then pick
 * what a right swipe does and the campaign that goes with it. The first swipe ends by sending to
 * that creator; the button ends by saving.
 *
 * Once an intro is saved, a right swipe that doesn't auto-send opens it filled in for that creator,
 * to tailor or send as is. Nothing reaches a creator until the brand presses send.
 */
export default function IntroModal({ open, onClosed, account, campaigns, shopper, previewFor, notice, onCancel, onSend, onSave }: IntroModalProps) {
  // Fixed at open: sending saves the intro, and the closing modal mustn't flip into another mode.
  const [mode] = useState<"setup" | "edit" | "review">(() => (!shopper ? "edit" : account.introMessage ? "review" : "setup"));
  const [step, setStep] = useState<"write" | "send">(mode === "review" ? "send" : "write");
  const [template, setTemplate] = useState(() => account.introMessage ?? draftIntro(account));
  const [message, setMessage] = useState(() => (shopper ? fillIntro(account.introMessage ?? "", shopper) : ""));
  const [campaignId, setCampaignId] = useState(() => {
    if (campaigns.some(({ product }) => product.id === account.defaultInviteProductId)) return account.defaultInviteProductId!;
    // A first intro suggests a campaign; a saved "intro only" choice is kept.
    return account.introMessage ? NO_CAMPAIGN : (campaigns[0]?.product.id ?? NO_CAMPAIGN);
  });
  const [sendMode, setSendMode] = useState<SendMode>(account.autoSendInvites ? "auto" : "review");
  const [attempted, setAttempted] = useState(false);

  const recipient = shopper ? firstNameOf(shopper.name) : undefined;
  const campaign = campaigns.find(({ product }) => product.id === campaignId)?.product;
  const templateError = template.trim() ? undefined : "Write an intro before you continue.";
  const messageError = message.trim() ? undefined : "Write a message before sending.";

  function next(event: FormEvent) {
    event.preventDefault();
    if (templateError) {
      setAttempted(true);
      return;
    }
    setAttempted(false);
    setStep("send");
  }

  function finish(event: FormEvent) {
    event.preventDefault();
    if (mode === "edit") {
      onSave?.({ introMessage: template.trim(), autoSendInvites: sendMode === "auto", defaultInviteProductId: campaign?.id });
      return;
    }
    if (!shopper) return;
    if (mode === "review" && messageError) {
      setAttempted(true);
      return;
    }
    onSend?.({
      message: mode === "setup" ? fillIntro(template, shopper) : message.trim(),
      productId: campaign?.id,
      template: mode === "setup" ? template.trim() : undefined,
      autoSend: sendMode === "auto",
    });
  }

  const header =
    step === "write"
      ? {
          title: account.introMessage ? "Your intro" : "Write your intro",
          icon: <PencilSquareIcon className="size-5" strokeWidth={1.75} />,
          description: "Creators get this when you swipe right on them. It's filled in with each creator's name, and you can change it any time.",
        }
      : mode === "edit"
        ? {
            title: "How it sends",
            icon: <PaperAirplaneIcon className="size-5" strokeWidth={1.75} />,
            description: "Choose what a right swipe does, and the campaign that goes with your intro.",
          }
        : mode === "setup"
          ? {
              title: `Send to ${recipient}`,
              icon: <PaperAirplaneIcon className="size-5" strokeWidth={1.75} />,
              description: `Choose what right swipes do from now on, and the campaign ${recipient} gets with your intro.`,
            }
          : {
              title: `Message ${recipient}`,
              icon: <PaperAirplaneIcon className="size-5" strokeWidth={1.75} />,
              description: "Your saved intro, ready to go. Edits here change this message only.",
            };

  const stepLabel = (n: number) => <p className="mb-4 text-xs font-medium tabular-nums text-neutral-400">Step {n} of 2</p>;

  return (
    <ModalPanel open={open} onOpenChange={(next) => !next && onCancel()} onClosed={onClosed} size={mode === "review" ? "default" : "wide"} {...header}>
      {step === "write" ? (
        <form className="mt-6" noValidate onSubmit={next}>
          {stepLabel(1)}
          <IntroMessageField
            value={template}
            onChange={setTemplate}
            error={attempted ? templateError : undefined}
            previewFor={shopper ?? previewFor ?? { name: "Alex" }}
            campaign={campaign}
            layout="split"
            autoFocus
          />
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="secondary" size="md" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="dark" size="md" iconRight={<ArrowRightIcon aria-hidden="true" className="size-4" />} style={{ ...darkGradientButtonStyle, ...DARK_BUTTON_PADDING }}>
              Next
            </Button>
          </div>
        </form>
      ) : (
        <form className="mt-6" noValidate onSubmit={finish}>
          {mode === "review" ? null : stepLabel(2)}
          {notice ? (
            <div className="mb-5">
              <NoticeBanner icon={<ExclamationTriangleIcon className="size-5" strokeWidth={1.75} />} title="Auto-send paused" description={notice} />
            </div>
          ) : null}

          {mode === "review" ? (
            <div className="mb-6">
              <Textarea
                label="Message"
                rows={5}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                maxLength={INTRO_MAX_LENGTH}
                maxChars={INTRO_MAX_LENGTH}
                currentLength={message.length}
                hint="Your saved intro stays as it is."
                error={attempted ? messageError : undefined}
              />
            </div>
          ) : (
            <div className="mb-6">
              <SendModePicker value={sendMode} onChange={setSendMode} />
            </div>
          )}

          <CampaignPicker
            campaigns={campaigns}
            value={campaignId}
            onChange={setCampaignId}
            legend="Campaign"
            hint={recipient ? `Sent straight after your intro, for ${recipient} to shop.` : "Sent straight after your intro."}
          />

          {mode === "review" ? (
            <label className="mt-5 flex min-h-10 cursor-pointer items-start gap-3 rounded-lg py-1">
              <input type="checkbox" checked={sendMode === "auto"} onChange={(event) => setSendMode(event.target.checked ? "auto" : "review")} className="peer sr-only" />
              <span
                aria-hidden="true"
                className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-[5px] border border-neutral-300 bg-white text-white transition-[background-color,border-color] duration-150 peer-checked:border-neutral-900 peer-checked:bg-neutral-900 peer-focus-visible:ring-2 peer-focus-visible:ring-neutral-900 peer-focus-visible:ring-offset-2 [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100"
              >
                <CheckIcon className="size-3" />
              </span>
              <span className="text-[13px] leading-5">
                <span className="block font-medium text-neutral-900">Send automatically from now on</span>
                <span className="block text-neutral-500">
                  Right swipes will send your saved intro{campaign ? ` and ${campaign.name}` : ""} without asking. Change it any time above the deck.
                </span>
              </span>
            </label>
          ) : null}

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            {mode === "review" ? (
              <Button type="button" variant="secondary" size="md" onClick={onCancel}>
                Cancel
              </Button>
            ) : (
              <Button type="button" variant="secondary" size="md" onClick={() => setStep("write")}>
                Back
              </Button>
            )}
            <Button
              type="submit"
              variant="dark"
              size="md"
              iconLeft={mode === "edit" ? undefined : <PaperAirplaneIcon aria-hidden="true" className="size-4" />}
              style={{ ...darkGradientButtonStyle, ...DARK_BUTTON_PADDING }}
            >
              {mode === "edit" ? "Save intro" : mode === "setup" ? `Save and send to ${recipient}` : `Send to ${recipient}`}
            </Button>
          </div>
        </form>
      )}
    </ModalPanel>
  );
}
