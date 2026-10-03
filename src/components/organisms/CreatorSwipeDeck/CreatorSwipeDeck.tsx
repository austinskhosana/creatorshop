"use client";

import { useEffect, useEffectEvent, useState, type ReactNode } from "react";
import { PaperAirplaneIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { EmptySearch } from "@/components/atoms/EmptySearch";
import { EmptyBell } from "@/components/atoms/EmptyBell";
import { EmptyState } from "@/components/molecules/EmptyState";
import { dismissToast, showToast } from "@/components/molecules/Toast";
import { CreatorSwipeStage } from "@/components/organisms/CreatorSwipeStage";
import { IntroModal, type ComposedInvite } from "@/components/organisms/IntroModal";
import type { Shopper } from "@/lib/data/brand-schema";
import { fillIntro, firstNameOf } from "@/lib/intro-message";
import { SHOPPERS } from "@/lib/mock-brand";
import { brandStore, useBrandState, useLiveCampaigns } from "@/lib/store/brand-store";
import { cn } from "@/lib/utils";

/** One swipe the deck can take back: a pass, or an invite to withdraw, with the toast that announced it. */
interface Decision {
  shopperId: string;
  inviteId?: string;
  toastId: string | number;
}

type AutoSendStatus = "setup" | "on" | "paused" | "off";

interface CreatorSwipeDeckProps {
  /** The screen's h1, shown as a quiet corner label so the card owns the screen. */
  title: string;
  /** The directory's filtered creators, in order. Anyone already invited is skipped. */
  creators: Shopper[];
  /** The page's own controls (filters, layout), at the right of the header. */
  toolbar?: ReactNode;
  /** Shown when the filters match no one. */
  onClearFilters?: () => void;
  /** Back to the grid, from the end of the deck. */
  onShowGrid: () => void;
}

const threadAction = (shopper: Shopper) => ({ label: "Open thread", href: `/brand/messages?thread=${shopper.id}` });

const sentTitle = (shopper: Shopper) => `Invited ${shopper.name}`;

const sentDescription = (shopper: Shopper, campaignName?: string) => `Sent ${firstNameOf(shopper.name)} your intro${campaignName ? ` and ${campaignName}` : ""}.`;

const STATUS: Record<AutoSendStatus, { label: string; dot?: string }> = {
  setup: { label: "Write your intro" },
  on: { label: "Auto-send on", dot: "bg-[#4C7A00]" },
  paused: { label: "Auto-send paused", dot: "bg-amber-500" },
  off: { label: "Auto-send off", dot: "bg-neutral-300" },
};

/** The header control for the brand's intro: shows what a right swipe will do, and opens the editor. */
function IntroButton({ status, onClick }: { status: AutoSendStatus; onClick: () => void }) {
  const { label, dot } = STATUS[status];
  const Icon = status === "setup" ? PencilSquareIcon : PaperAirplaneIcon;
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      onClick={onClick}
      className="inline-flex h-10 items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 text-[13px] font-medium text-neutral-700 transition-[border-color,transform] duration-150 hover:border-neutral-300 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
    >
      <Icon aria-hidden="true" className="size-4" strokeWidth={1.75} />
      {/* Icon and status dot alone on a phone, so the header's controls fit one row. */}
      <span className="sr-only sm:not-sr-only">{label}</span>
      {dot ? <span aria-hidden="true" className={cn("size-1.5 rounded-full", dot)} /> : null}
    </button>
  );
}

/**
 * The creator directory as a deck. Swiping right reaches out with the brand's own intro: the first
 * time, the brand writes it before anything sends; after that a right swipe either opens it to
 * tailor for that creator or, on auto-send, sends it with the brand's campaign straight away.
 * Passes only last for the visit; invites stick, so an invited creator doesn't come round again.
 */
export default function CreatorSwipeDeck({ title, creators, toolbar, onClearFilters, onShowGrid }: CreatorSwipeDeckProps) {
  const { account, products, invites } = useBrandState();
  const campaigns = useLiveCampaigns();
  const [passed, setPassed] = useState<string[]>([]);
  const [history, setHistory] = useState<Decision[]>([]);
  const [programmaticDirection, setProgrammaticDirection] = useState<1 | -1 | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasSwiped, setHasSwiped] = useState(false);
  const [composing, setComposing] = useState<{ shopper: Shopper; notice?: string } | null>(null);
  const [composerOpen, setComposerOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  // Remounts the editor on every open, so a cancelled edit doesn't linger.
  const [editorRound, setEditorRound] = useState(0);
  // Bumped when a right swipe is cancelled, so the same creator's card remounts and eases back in.
  const [returns, setReturns] = useState(0);

  const invited = new Set(invites.map((invite) => invite.shopperId));
  const queue = creators.filter((creator) => !invited.has(creator.id) && !passed.includes(creator.id));
  const shopper = queue[0];

  const intro = account?.introMessage;
  const defaultCampaign = products.find((product) => product.id === account?.defaultInviteProductId);
  // A campaign that's since paused, sold out or closed holds auto-send until the brand picks again.
  const campaignLapsed = Boolean(defaultCampaign && defaultCampaign.status !== "live");
  const autoSend = Boolean(intro && account?.autoSendInvites && !campaignLapsed);
  const status: AutoSendStatus = !intro ? "setup" : account?.autoSendInvites ? (campaignLapsed ? "paused" : "on") : "off";
  const busy = isAnimating || composerOpen || editorOpen;

  function decide(direction: 1 | -1) {
    if (!shopper || busy) return;
    setIsAnimating(true);
    setProgrammaticDirection(direction);
  }

  // An effect event always sees this render's deck, so the listener never goes stale.
  const onKey = useEffectEvent((event: KeyboardEvent) => {
    const target = event.target as HTMLElement;
    if (target.closest("input, textarea, [role=menu], [role=listbox], [role=dialog]")) return;
    if (event.key === "ArrowRight") decide(1);
    if (event.key === "ArrowLeft") decide(-1);
  });

  useEffect(() => {
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function handleSwiped(direction: 1 | -1) {
    if (!shopper) return;
    setHasSwiped(true);
    setProgrammaticDirection(null);
    setIsAnimating(false);

    if (direction === -1) {
      setPassed((ids) => [...ids, shopper.id]);
      const toastId = showToast({ icon: "cross", title: `Passed on ${shopper.name}` });
      setHistory((stack) => [...stack, { shopperId: shopper.id, toastId }]);
      return;
    }

    if (autoSend && intro) {
      const invite = brandStore.inviteCreator(shopper.id, fillIntro(intro, shopper), defaultCampaign?.id);
      const toastId = showToast({ icon: "check", title: sentTitle(shopper), description: sentDescription(shopper, defaultCampaign?.name), action: threadAction(shopper) });
      setHistory((stack) => [...stack, { shopperId: shopper.id, inviteId: invite.id, toastId }]);
      return;
    }

    setComposing({
      shopper,
      notice:
        account?.autoSendInvites && campaignLapsed && defaultCampaign
          ? `${defaultCampaign.name} isn't live any more, so this one waited for you. Pick another campaign or send your intro on its own.`
          : undefined,
    });
    setComposerOpen(true);
  }

  function send({ message, productId, template, autoSend: alwaysSend }: ComposedInvite) {
    if (!composing) return;
    const recipient = composing.shopper;
    const product = campaigns.find((campaign) => campaign.product.id === productId)?.product;
    brandStore.saveOutreach(
      template !== undefined
        ? { introMessage: template, autoSendInvites: alwaysSend, defaultInviteProductId: productId }
        : { autoSendInvites: alwaysSend, ...(alwaysSend ? { defaultInviteProductId: productId } : {}) },
    );
    const invite = brandStore.inviteCreator(recipient.id, message, productId);
    setComposerOpen(false);
    const toastId = showToast({
      icon: "check",
      title: sentTitle(recipient),
      description: `${template !== undefined ? "Intro saved. " : ""}${sentDescription(recipient, product?.name)}${alwaysSend && !autoSend ? " Right swipes now send it automatically." : ""}`,
      action: threadAction(recipient),
    });
    setHistory((stack) => [...stack, { shopperId: recipient.id, inviteId: invite.id, toastId }]);
  }

  // Nothing went out, so the creator's card comes back to be decided again.
  function cancelCompose() {
    setComposerOpen(false);
    setReturns((count) => count + 1);
  }

  function undo() {
    const last = history[history.length - 1];
    if (!last || busy) return;
    if (last.inviteId) brandStore.withdrawInvite(last.inviteId);
    setPassed((ids) => ids.filter((id) => id !== last.shopperId));
    setHistory((stack) => stack.slice(0, -1));
    dismissToast(last.toastId);
    const name = creators.find((creator) => creator.id === last.shopperId)?.name;
    showToast({ icon: "undo", title: last.inviteId ? "Invite withdrawn" : "Decision undone", description: name ? `${name} is back in the deck.` : undefined });
  }

  // Laid out like shopper review — one quiet header line, then the shared stage — so the two decks
  // are the same screen and the card owns it.
  return (
    <div className="flex flex-1 flex-col">
      <header className="flex min-h-10 flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div className="flex min-w-0 items-baseline gap-x-3">
          <h1 className="text-base font-semibold tracking-tight text-neutral-950">{title}</h1>
          <p className="truncate text-sm tabular-nums text-neutral-400" aria-live="polite">
            {creators.length === 0 ? "No matches" : shopper ? `${queue.length} to go` : "All caught up"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {account ? <IntroButton status={status} onClick={() => setEditorOpen(true)} /> : null}
          {toolbar}
        </div>
      </header>

      {shopper ? (
        <CreatorSwipeStage
          shopper={shopper}
          cardKey={`${shopper.id}:${returns}`}
          onSwiped={handleSwiped}
          enterAfterSwipe={hasSwiped}
          programmaticDirection={programmaticDirection}
          disabled={busy}
          onDeny={() => decide(-1)}
          onUndo={undo}
          onApprove={() => decide(1)}
          canUndo={history.length > 0}
          approveVerb="invite"
          approveStamp="Invite"
          approveLabel={`Invite ${shopper.name} to collaborate`}
        />
      ) : (
        <div className="flex flex-1 items-center justify-center pb-16">
          {creators.length === 0 ? (
            <EmptyState
              className="w-full max-w-[34rem]"
              illustration={<EmptySearch />}
              title="No creators match"
              description="Try a different niche or platform, or widen the audience range."
              action={onClearFilters ? { label: "Clear filters", onClick: onClearFilters } : undefined}
            />
          ) : (
            <EmptyState
              className="w-full max-w-[34rem]"
              illustration={<EmptyBell />}
              title="That's everyone for now"
              description={
                passed.length > 0
                  ? "Invited creators are in Messages. Start over to see the ones you passed on."
                  : "Every creator here has your intro. Their replies land in Messages."
              }
              action={{ label: "Open Messages", href: "/brand/messages" }}
              secondaryAction={
                passed.length > 0
                  ? {
                      label: "Start over",
                      onClick: () => {
                        setPassed([]);
                        setHistory((stack) => stack.filter((decision) => decision.inviteId));
                      },
                    }
                  : { label: "Back to grid", onClick: onShowGrid }
              }
            />
          )}
        </div>
      )}

      {composing && account ? (
        <IntroModal
          key={composing.shopper.id}
          open={composerOpen}
          onClosed={() => setComposing(null)}
          shopper={composing.shopper}
          account={account}
          campaigns={campaigns}
          notice={composing.notice}
          onCancel={cancelCompose}
          onSend={send}
        />
      ) : null}

      {account ? (
        <IntroModal
          key={editorRound}
          open={editorOpen}
          onClosed={() => setEditorRound((round) => round + 1)}
          account={account}
          campaigns={campaigns}
          previewFor={shopper ?? creators[0] ?? SHOPPERS[0]}
          onCancel={() => setEditorOpen(false)}
          onSave={(settings) => {
            brandStore.saveOutreach(settings);
            setEditorOpen(false);
            showToast({ icon: "check", title: "Intro saved", description: settings.autoSendInvites ? "Right swipes send it automatically." : "Right swipes open it for you to review." });
          }}
        />
      ) : null}
    </div>
  );
}
