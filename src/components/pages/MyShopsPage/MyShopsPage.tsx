"use client";

import { ArrowPathIcon, CalendarIcon, ChatBubbleLeftEllipsisIcon, ClockIcon, DocumentTextIcon, LinkIcon } from "@heroicons/react/24/outline";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { resolveContentType } from "@/lib/content-types";
import { CREATOR_SHOPS, type CreatorShop, type ShopState } from "@/lib/mock-creator";
import BrandLogo from "@/components/atoms/BrandLogo/BrandLogo";
import Badge from "@/components/atoms/Badge/Badge";
import Button from "@/components/atoms/Button/Button";
import CampaignChoiceModal from "@/components/organisms/CampaignChoiceModal";
import { ProofOfPaymentModal } from "@/components/organisms/ProofOfPaymentModal";
import ShopStateBadge from "@/components/molecules/ShopStateBadge/ShopStateBadge";
import { CreatorShell } from "@/components/templates/CreatorShell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ALL_STATES: ShopState[] = ["pending", "approved", "draft", "ready", "posted", "active", "expired", "overdue", "declined", "withdrawn"];
const filters: { label: string; states: ShopState[] }[] = [{ label: "All", states: ALL_STATES }, { label: "Active", states: ["pending", "approved", "draft", "ready", "posted"] }, { label: "Confirmed", states: ["active"] }, { label: "Expired", states: ["expired", "declined", "withdrawn"] }, { label: "Overdue", states: ["overdue"] }];

function InstagramIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-3"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" stroke="none" /></svg>; }
function TikTokIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="size-3"><path d="M16.5 3c.3 1.9 1.6 3.4 3.5 3.7v2.6c-1.3 0-2.5-.4-3.5-1.1v6.4c0 3-2.4 5.4-5.4 5.4S5.7 17.6 5.7 14.6c0-2.8 2.1-5.1 4.8-5.4v2.7c-1.3.2-2.3 1.4-2.3 2.7 0 1.5 1.2 2.7 2.7 2.7s2.7-1.2 2.7-2.7V3h3Z" /></svg>; }
function YouTubeIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-3"><rect x="2" y="5" width="20" height="14" rx="4" stroke="currentColor" strokeWidth="1.8" /><path d="M10 9.5v5l4.5-2.5Z" fill="currentColor" /></svg>; }
function XIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="size-3"><path d="M18.901 1.153h3.68l-8.04 9.19 9.46 12.504h-7.406l-5.8-7.584-6.64 7.584H.479l8.6-9.83L.01 1.154h7.594l5.243 6.932 6.054-6.932Zm-1.29 19.674h2.039L6.496 3.042H4.307z" /></svg>; }

function getDeliverableTag(tier: string) {
  const type = resolveContentType(tier);
  const icon = type.platform === "Instagram" ? <InstagramIcon /> : type.platform === "TikTok" ? <TikTokIcon /> : type.platform === "X" ? <XIcon /> : <YouTubeIcon />;
  // Tiers that aren't one of our content types are the older YouTube reviews.
  if (type.id === "generic") return { label: "Video review", icon };
  const labels = { video: "Video", carousel: "Carousel", story: "Story", thread: "Thread" };
  return { label: labels[type.layout], icon };
}

/** The one-line "what happens next" shown on a card while a shop is moving through the barter. */
function nextStep(shop: CreatorShop) {
  const { platform } = resolveContentType(shop.tier);
  switch (shop.state) {
    case "approved":
      return `Upload your draft for ${shop.brand} to approve.`;
    case "draft":
      return `${shop.brand} is reviewing your draft.`;
    case "ready":
      return `Post it on ${platform} by ${shop.deadline}, then add your proof of payment.`;
    case "posted":
      return `${shop.brand} is checking your post.`;
    default:
      return null;
  }
}

function ShopCard({ shop, onViewCampaign, onAddProof }: { shop: CreatorShop; onViewCampaign: (shop: CreatorShop) => void; onAddProof: (shop: CreatorShop) => void }) {
  const router = useRouter();
  const action = shop.state === "approved" ? "View campaign" : shop.state === "ready" ? "Add proof of payment" : shop.state === "expired" ? "Shop again" : shop.state === "active" ? "View campaign" : "Open thread";
  const actionHref = shop.state === "expired" ? "/explore" : shop.state === "active" ? `/shops/${shop.id}/access` : "/messages";
  const actionIcon = shop.state === "expired" ? <ArrowPathIcon className="size-3.5" /> : shop.state === "active" ? <DocumentTextIcon className="size-3.5" /> : shop.state === "ready" ? <LinkIcon className="size-3.5" /> : <ChatBubbleLeftEllipsisIcon className="size-3.5" />;
  const deliverable = getDeliverableTag(shop.tier);
  const step = nextStep(shop);

  return (
    <article className="flex min-h-[260px] flex-col rounded-[20px] border border-neutral-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <BrandLogo slug={shop.id === "dia" ? "dia-browser" : shop.id} name={shop.brand} />
        <ShopStateBadge state={shop.state} />
      </div>

      <div className="mt-auto pt-5">
        <h2 className="text-[16px] leading-snug font-semibold tracking-[-0.025em] text-neutral-950">{shop.product}</h2>
        <p className="mt-2 line-clamp-2 text-[13px] leading-[1.55] text-neutral-500">{shop.description}</p>
        {step ? <p className="mt-3 text-[13px] leading-5 font-medium text-neutral-950">{step}</p> : null}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge variant="tag" label={deliverable.label} icon={deliverable.icon} />
          <Badge variant="tag" label={`${shop.access.replace("months", "month")} subscription`} icon={<CalendarIcon className="size-3" />} />
        </div>
      </div>

      <div className="mt-3 flex items-end justify-between border-t border-neutral-100 pt-3">
        <div>
          <p className="text-[15px] font-semibold tabular-nums text-neutral-900">${shop.value}</p>
          <p className="text-[11px] text-neutral-400">Retail value</p>
        </div>
        <Button
          variant="premium"
          size="sm"
          iconLeft={actionIcon}
          onClick={() => (shop.state === "approved" ? onViewCampaign(shop) : shop.state === "ready" ? onAddProof(shop) : router.push(actionHref))}
          style={{ borderRadius: "8px", padding: "8px 14px", fontWeight: 500, letterSpacing: "normal" }}
        >
          {action}
        </Button>
      </div>
    </article>
  );
}
export default function MyShopsPage() {
  const router = useRouter();
  const [selected, setSelected] = useState(0);
  const [campaignShop, setCampaignShop] = useState<CreatorShop | null>(null);
  const [proofShop, setProofShop] = useState<CreatorShop | null>(null);
  // Sending proof moves a card to "Proof in review". Held in memory only — nothing is stored yet.
  const [sentProof, setSentProof] = useState<string[]>([]);
  const allShops = CREATOR_SHOPS.map(shop => (sentProof.includes(shop.id) ? { ...shop, state: "posted" as const } : shop));
  const filter = filters[selected];
  const shops = allShops.filter(shop => filter.states.includes(shop.state));

  return <CreatorShell><div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12"><div><h1 className="text-4xl font-bold tracking-tight">My Shops</h1><p className="mt-2 text-sm text-neutral-500">Everything you&apos;ve shopped, in one place.</p></div><Tabs value={String(selected)} onValueChange={value => setSelected(Number(value))} className="mt-9"><TabsList>{filters.map((filter, index) => <TabsTrigger key={filter.label} value={String(index)}>{filter.label}<span className="ml-1.5 text-xs font-medium">{allShops.filter(shop => filter.states.includes(shop.state)).length}</span></TabsTrigger>)}</TabsList><TabsContent value={String(selected)} className="mt-7"><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{shops.map(shop => <ShopCard key={shop.id} shop={shop} onViewCampaign={setCampaignShop} onAddProof={setProofShop} />)}</div>{shops.length === 0 ? <div className="rounded-[2rem] border border-dashed border-neutral-300 bg-white py-20 text-center"><ClockIcon className="mx-auto size-7 text-neutral-400" /><h2 className="mt-4 text-lg font-bold">Nothing here yet.</h2><p className="mt-1 text-sm text-neutral-500">Your {filter.label.toLowerCase()} shops will appear here.</p></div> : null}</TabsContent></Tabs></div><AnimatePresence>{campaignShop ? <CampaignChoiceModal key="campaign" shop={campaignShop} onClose={() => setCampaignShop(null)} onChat={() => router.push("/messages")} onPayWithPost={() => router.push(`/post-builder/${campaignShop.id}`)} /> : null}{proofShop ? <ProofOfPaymentModal key="proof" shop={proofShop} onClose={() => setProofShop(null)} onSubmit={() => { setSentProof(current => [...current, proofShop.id]); setProofShop(null); }} /> : null}</AnimatePresence></CreatorShell>;
}
