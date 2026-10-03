import type { MessageContent } from "@/components/molecules/MessageBubble";
import type { BrandAccount, BrandState, CreatorInvite, ProductPage, Shopper } from "@/lib/data/brand-schema";
import { DEMO_ACCOUNT, getShopper } from "@/lib/mock-brand";
import { campaignMessage, draftIntro, fillIntro } from "@/lib/intro-message";
import type { ChatMessage, InboxThread } from "@/lib/mock-messages";

/**
 * Fictional inbox for the brand-side /brand/messages prototype — one thread per creator, as Fernpad
 * (the mock merchant) sees it. Every message is invented.
 */

const text = (value: string): MessageContent => ({ type: "text", text: value });

export const brandThreads: InboxThread[] = [
  {
    id: "marcus",
    participant: "brand",
    name: "Marcus Vale",
    detail: "Fernpad Pro · Instagram carousel · Proof submitted",
    image: "/creators/marcus-vale.png",
    unread: true,
    messages: [
      { id: "m1", from: "you", day: "Sep 20", time: "9:02 AM", content: text("Welcome aboard, Marcus! Your Fernpad Pro shop is approved. Carousel is due Oct 4.") },
      { id: "m2", from: "them", day: "Yesterday", time: "6:40 PM", content: text("Thanks! Went with a 'journal for lifters' angle — backlinks panel is on slide 3.") },
      { id: "m3", from: "them", day: "Today", time: "8:15 AM", content: text("Carousel is live. Proof link is submitted in the shop.") },
    ],
  },
  {
    id: "jun",
    participant: "brand",
    name: "Jun Park",
    detail: "Fernpad Pro · TikTok video · Overdue",
    image: undefined,
    unread: true,
    messages: [
      { id: "j1", from: "you", day: "Sep 12", time: "11:20 AM", content: text("Hi Jun, you're approved for Fernpad Pro. The video is due Sep 26.") },
      { id: "j2", from: "them", day: "Sep 24", time: "4:05 PM", content: text("Filming this weekend — might run a couple of days late, sorry!") },
      { id: "j3", from: "you", day: "Yesterday", time: "10:00 AM", content: text("No stress — any update on timing?") },
    ],
  },
  {
    id: "sasha",
    participant: "brand",
    name: "Sasha Lindqvist",
    detail: "Fernpad AI Notes · X thread",
    messages: [
      { id: "s1", from: "you", day: "Sep 27", time: "9:30 AM", content: text("Approved! Thread is due Oct 18. Happy to answer questions about the transcription pipeline.") },
      { id: "s2", from: "them", day: "Sep 27", time: "1:12 PM", content: text("Perfect. Is the on-device audio point okay to mention by name?") },
      { id: "s3", from: "you", day: "Sep 28", time: "8:45 AM", content: text("Yes please — that's the must-have.") },
    ],
  },
  {
    id: "theo",
    participant: "brand",
    name: "Theo Bramm",
    detail: "Fernpad Sync · Access active",
    image: "/creators/theo-bramm.png",
    messages: [
      { id: "t1", from: "you", day: "Sep 8", time: "3:10 PM", content: text("Proof confirmed — your Fernpad Sync access is unlocked. Thanks for the story!") },
      { id: "t2", from: "them", day: "Sep 8", time: "3:30 PM", content: text("Pleasure. Just shopped AI Notes too, fingers crossed.") },
    ],
  },
  {
    id: "support",
    participant: "team",
    name: "Austin at Creatorshop",
    detail: "Creatorshop support",
    image: "/Creatorshop Brand Symbol.webp",
    online: true,
    messages: [
      { id: "cs1", from: "them", day: "Sep 1", time: "12:10 PM", content: text("Welcome to Creatorshop 👋 Your storefront is live.") },
      { id: "cs2", from: "them", day: "Sep 1", time: "12:11 PM", content: text("Questions about stock, price tiers, or reviewing shoppers? Ask here.") },
    ],
  },
];

/** The demo merchant gets its lived-in inbox; a brand-new account starts with just Creatorshop support. */
export function threadsFor(account: BrandAccount | null) {
  return account?.slug === DEMO_ACCOUNT.slug ? brandThreads : brandThreads.filter((thread) => thread.participant === "team");
}

function stamp(iso: string) {
  const date = new Date(iso);
  const today = date.toDateString() === new Date().toDateString();
  return {
    day: today ? "Today" : date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    time: date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
  };
}

/** A right swipe's intro, exactly as the brand sent it, then the campaign that went with it. */
export function inviteMessages(invite: CreatorInvite, shopper: Shopper, account: BrandAccount, product?: ProductPage): ChatMessage[] {
  const messages: ChatMessage[] = [
    { id: `${invite.id}-intro`, from: "you", ...stamp(invite.sentAt), content: text(invite.message ?? fillIntro(draftIntro(account), shopper)) },
  ];
  if (product) messages.push({ id: `${invite.id}-campaign`, from: "you", ...stamp(invite.sentAt), content: text(campaignMessage(product)) });
  return messages;
}

/** Folds swipe-mode invites into the inbox: onto a creator's existing thread, or as a new one on top. */
export function withInvites(threads: InboxThread[], { account, invites, products }: BrandState): InboxThread[] {
  if (!account || invites.length === 0) return threads;
  const sent = new Map<string, ChatMessage[]>();
  for (const invite of invites) {
    const shopper = getShopper(invite.shopperId);
    if (!shopper) continue;
    const product = products.find((item) => item.id === invite.productId);
    sent.set(shopper.id, [...(sent.get(shopper.id) ?? []), ...inviteMessages(invite, shopper, account, product)]);
  }
  const existing = threads.map((thread) => (sent.has(thread.id) ? { ...thread, messages: [...thread.messages, ...sent.get(thread.id)!] } : thread));
  const fresh = [...sent.keys()]
    .filter((id) => !threads.some((thread) => thread.id === id))
    .reverse()
    .map((id): InboxThread => {
      const shopper = getShopper(id)!;
      return { id, participant: "brand", name: shopper.name, detail: `@${shopper.handle}`, image: shopper.avatar, messages: sent.get(id)! };
    });
  return [...fresh, ...existing];
}
