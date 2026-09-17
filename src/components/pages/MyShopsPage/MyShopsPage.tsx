"use client";

import Link from "next/link";
import { ArrowPathIcon, ChatBubbleLeftEllipsisIcon, CheckCircleIcon, ClockIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CREATOR_SHOPS, type CreatorShop, type ShopState } from "@/lib/mock-creator";
import BrandLogo from "@/components/atoms/BrandLogo/BrandLogo";
import Badge from "@/components/atoms/Badge/Badge";
import Button from "@/components/atoms/Button/Button";
import { CreatorShell } from "@/components/templates/CreatorShell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const filters: { label: string; states: ShopState[] }[] = [{ label: "Active", states: ["pending", "approved", "posted"] }, { label: "Confirmed", states: ["active"] }, { label: "Expired", states: ["expired", "declined", "withdrawn"] }, { label: "Overdue", states: ["overdue"] }];

function InstagramIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-3"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" stroke="none" /></svg>; }
function TikTokIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="size-3"><path d="M16.5 3c.3 1.9 1.6 3.4 3.5 3.7v2.6c-1.3 0-2.5-.4-3.5-1.1v6.4c0 3-2.4 5.4-5.4 5.4S5.7 17.6 5.7 14.6c0-2.8 2.1-5.1 4.8-5.4v2.7c-1.3.2-2.3 1.4-2.3 2.7 0 1.5 1.2 2.7 2.7 2.7s2.7-1.2 2.7-2.7V3h3Z" /></svg>; }
function YouTubeIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-3"><rect x="2" y="5" width="20" height="14" rx="4" stroke="currentColor" strokeWidth="1.8" /><path d="M10 9.5v5l4.5-2.5Z" fill="currentColor" /></svg>; }
function XIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="size-3"><path d="M18.901 1.153h3.68l-8.04 9.19 9.46 12.504h-7.406l-5.8-7.584-6.64 7.584H.479l8.6-9.83L.01 1.154h7.594l5.243 6.932 6.054-6.932Zm-1.29 19.674h2.039L6.496 3.042H4.307z" /></svg>; }

function getDeliverableTag(tier: string) {
  if (tier.startsWith("Instagram")) return { label: "Carousel", icon: <InstagramIcon /> };
  if (tier.startsWith("YouTube")) return { label: "Video review", icon: <YouTubeIcon /> };
  if (tier.startsWith("TikTok")) return { label: "Video", icon: <TikTokIcon /> };
  return { label: "Thread", icon: <XIcon /> };
}

function ShopCard({ shop, onViewCampaign }: { shop: CreatorShop; onViewCampaign: (shop: CreatorShop) => void }) {
  const action = shop.state === "approved" ? "View campaign" : shop.state === "expired" ? "Shop again" : shop.state === "active" ? "View access" : "Open thread";
  const statusMessage: Record<ShopState, string> = { pending: "Shop in review", approved: "Post approved", posted: "Post in review", active: "Access active", expired: "Access expired", overdue: "Post overdue", declined: "Shop declined", withdrawn: "Shop withdrawn" };
  const statusIcon = shop.state === "approved" || shop.state === "active" ? <CheckCircleIcon className="size-3.5 shrink-0" /> : shop.state === "expired" ? <ArrowPathIcon className="size-3.5 shrink-0" /> : shop.state === "declined" || shop.state === "withdrawn" ? <DocumentTextIcon className="size-3.5 shrink-0" /> : <ClockIcon className="size-3.5 shrink-0" />;
  const actionHref = shop.state === "expired" ? "/explore" : "/messages";
  const actionIcon = shop.state === "expired" ? <ArrowPathIcon className="size-3.5" /> : shop.state === "active" ? <DocumentTextIcon className="size-3.5" /> : <ChatBubbleLeftEllipsisIcon className="size-3.5" />;
  const deliverable = getDeliverableTag(shop.tier);

  return (
    <article className="flex min-h-[260px] flex-col rounded-[20px] border border-neutral-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <BrandLogo slug={shop.id === "dia" ? "dia-browser" : shop.id} name={shop.brand} />
        <Badge variant="tag" label={`${shop.access.replace("months", "month")} subscription`} />
      </div>

      <div className="mt-auto pt-5">
        <p className="text-xs font-medium text-neutral-500">{shop.brand}</p>
        <h2 className="mt-0.5 text-[16px] leading-snug font-semibold tracking-[-0.025em] text-neutral-950">{shop.product}</h2>
        <p className="mt-2 line-clamp-2 text-[13px] leading-[1.55] text-neutral-500">{shop.description}</p>
        <div className="mt-3"><Badge variant="tag" label={deliverable.label} icon={deliverable.icon} /></div>
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-neutral-100 px-3 py-2.5 text-xs text-neutral-600">{statusIcon}<span>{statusMessage[shop.state]}</span></div>
      </div>

      <div className="mt-3 flex items-end justify-between border-t border-neutral-100 pt-3">
        <div>
          <p className="text-[15px] font-semibold tabular-nums text-neutral-900">${shop.value}</p>
          <p className="text-[11px] text-neutral-400">Retail value</p>
        </div>
        {shop.state === "approved" ? (
          <Button
            variant="dark"
            size="sm"
            iconLeft={actionIcon}
            onClick={() => onViewCampaign(shop)}
            style={{
              borderRadius: "8px",
              padding: "8px 14px",
              fontWeight: 500,
              letterSpacing: "normal",
              background: "linear-gradient(180deg, #323232 0%, #222222 100%)",
              boxShadow: "inset 0 0.5px 1px rgba(255,255,255,0.15), inset 0 -1px 1.2px 0.35px rgba(18,18,18,1), 0 2px 3px -1px rgba(13,13,13,0.5), 0 0 0 1px rgba(51,51,51,1)",
            }}
          >
            {action}
          </Button>
        ) : (
          <Link href={actionHref} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2">
            <Button
              variant="dark"
              size="sm"
              iconLeft={actionIcon}
              style={{
                borderRadius: "8px",
                padding: "8px 14px",
                fontWeight: 500,
                letterSpacing: "normal",
                background: "linear-gradient(180deg, #323232 0%, #222222 100%)",
                boxShadow: "inset 0 0.5px 1px rgba(255,255,255,0.15), inset 0 -1px 1.2px 0.35px rgba(18,18,18,1), 0 2px 3px -1px rgba(13,13,13,0.5), 0 0 0 1px rgba(51,51,51,1)",
              }}
            >
              {action}
            </Button>
          </Link>
        )}
      </div>
    </article>
  );
}
export default function MyShopsPage() {
  const router = useRouter();
  const [selected, setSelected] = useState(0);
  const [campaignShop, setCampaignShop] = useState<CreatorShop | null>(null);
  const filter = filters[selected];
  const shops = CREATOR_SHOPS.filter(shop => filter.states.includes(shop.state));

  return <CreatorShell><div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12"><div><h1 className="text-4xl font-bold tracking-tight">My Shops</h1><p className="mt-2 text-sm text-neutral-500">Everything you’ve shopped, in one place.</p></div><Tabs value={String(selected)} onValueChange={value => setSelected(Number(value))} className="mt-9"><TabsList>{filters.map((filter, index) => <TabsTrigger key={filter.label} value={String(index)}>{filter.label}<span className="ml-1.5 text-xs font-medium">{CREATOR_SHOPS.filter(shop => filter.states.includes(shop.state)).length}</span></TabsTrigger>)}</TabsList><TabsContent value={String(selected)} className="mt-7"><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{shops.map(shop => <ShopCard key={shop.id} shop={shop} onViewCampaign={setCampaignShop} />)}</div>{shops.length === 0 ? <div className="rounded-[2rem] border border-dashed border-neutral-300 bg-white py-20 text-center"><ClockIcon className="mx-auto size-7 text-neutral-400" /><h2 className="mt-4 text-lg font-bold">Nothing here yet.</h2><p className="mt-1 text-sm text-neutral-500">Your {filter.label.toLowerCase()} shops will appear here.</p></div> : null}</TabsContent></Tabs></div>{campaignShop ? <div className="fixed inset-0 z-50 grid place-items-center bg-neutral-950/45 p-4" onMouseDown={() => setCampaignShop(null)}><div role="dialog" aria-modal="true" aria-labelledby="campaign-choice-title" className="w-full max-w-lg rounded-[20px] bg-white p-5 shadow-2xl sm:p-6" onMouseDown={event => event.stopPropagation()}><button type="button" onClick={() => setCampaignShop(null)} aria-label="Close campaign options" className="float-right grid size-8 place-items-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-950">×</button><p className="text-xs font-semibold tracking-[0.14em] text-neutral-500 uppercase">{campaignShop.brand} campaign</p><h2 id="campaign-choice-title" className="mt-2 text-2xl font-bold tracking-tight">Ready to pay with your post?</h2><p className="mt-2 max-w-md text-sm leading-6 text-neutral-500">Create a {campaignShop.tier.toLowerCase()} for {campaignShop.product}, then send it to {campaignShop.brand} for approval by {campaignShop.deadline}.</p><div className="mt-6 grid gap-3 sm:grid-cols-2"><button type="button" onClick={() => router.push("/messages")} className="rounded-xl border border-neutral-200 p-4 text-left transition hover:border-neutral-400 hover:bg-neutral-50"><ChatBubbleLeftEllipsisIcon className="size-5 text-neutral-700" /><p className="mt-4 text-sm font-semibold">Chat with {campaignShop.brand}</p><p className="mt-1 text-xs leading-5 text-neutral-500">Ask a question or get campaign guidance first.</p></button><button type="button" onClick={() => router.push(`/post-builder/${campaignShop.id}`)} className="rounded-xl bg-neutral-900 p-4 text-left text-white transition hover:bg-neutral-800"><DocumentTextIcon className="size-5" /><p className="mt-4 text-sm font-semibold">Pay with a post</p><p className="mt-1 text-xs leading-5 text-neutral-400">Build the post in-app and submit it for approval.</p></button></div></div></div> : null}</CreatorShell>;
}
