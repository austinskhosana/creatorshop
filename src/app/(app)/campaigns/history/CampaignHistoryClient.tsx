"use client";

import { useState, useRef, useLayoutEffect } from "react";
import Link from "next/link";

type Campaign = {
  id: string;
  name: string;
  planName: string;
  createdAt: string;
  endedAt: string;
  totalSlots: number;
  filled: number;
  delivered: number;
};

function formatDateRange(start: string, end: string) {
  const s = new Date(start).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const e = new Date(end).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return `${s} – ${e}`;
}

function StatTile({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="flex flex-col gap-1 flex-1 rounded-2xl bg-white border border-gray-200 px-5 py-4">
      <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">{label}</p>
      <p className="text-[28px] font-bold text-neutral-900 leading-none">{value}</p>
      {sub && <p className="text-[12px] text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

function CampaignCard({ campaign }: { campaign: Campaign }) {
  const fillRate     = campaign.totalSlots > 0 ? Math.round((campaign.filled / campaign.totalSlots) * 100) : 0;
  const deliveryRate = campaign.filled > 0 ? Math.round((campaign.delivered / campaign.filled) * 100) : 0;

  return (
    <div className="w-full text-left rounded-3xl border border-gray-200 bg-white overflow-hidden">
      <div className="flex items-center gap-4 px-6 pt-6 pb-6 bg-gradient-to-b from-[#A3FF38]/40 to-white">
        <div className="w-11 h-11 rounded-2xl bg-[#A3FF38] border border-[#82F200] flex items-center justify-center flex-shrink-0 shadow-[inset_3px_3px_6px_rgba(255,255,255,0.4)]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-900">
            <path d="M16.881 4.345A23.112 23.112 0 0 1 8.25 6H7.5a5.25 5.25 0 0 0-.88 10.427 21.593 21.593 0 0 0 1.378 3.94c.464 1.004 1.674 1.32 2.582.796l.657-.379c.88-.508 1.165-1.593.73-2.477a19.665 19.665 0 0 1-.748-2.37 23.148 23.148 0 0 1 5.33 1.43 22.795 22.795 0 0 0 .97-6.308c0-1.833-.277-3.553-.78-5.148a.5.5 0 0 0-.11-.166Z" />
            <path d="M20.08 4.14a23.09 23.09 0 0 1 1.17 6.705 23.085 23.085 0 0 1-1.17 6.704 23.046 23.046 0 0 0 2.63-6.704 23.046 23.046 0 0 0-2.63-6.705Z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-[15px] font-semibold text-neutral-900 leading-snug truncate">{campaign.name}</h2>
          <p className="text-[13px] text-gray-400 leading-snug mt-0.5">
            {campaign.planName} · {formatDateRange(campaign.createdAt, campaign.endedAt)}
          </p>
        </div>
      </div>
      <div className="px-6 pb-6 flex gap-3">
        <div className="flex-1 rounded-2xl bg-white border border-gray-200 px-4 py-3 flex flex-col gap-0.5">
          <p className="text-[18px] font-bold text-neutral-900 leading-none">
            {campaign.filled}<span className="text-[13px] font-medium text-gray-300"> / {campaign.totalSlots}</span>
          </p>
          <p className="text-[12px] text-gray-400">Slots filled</p>
          <p className="text-[11px] text-gray-300">{fillRate}% fill rate</p>
        </div>
        <div className="flex-1 rounded-2xl bg-white border border-gray-200 px-4 py-3 flex flex-col gap-0.5">
          <p className="text-[18px] font-bold text-neutral-900 leading-none">{campaign.delivered}</p>
          <p className="text-[12px] text-gray-400">Posts delivered</p>
          <p className="text-[11px] text-gray-300">{campaign.filled > 0 ? `${deliveryRate}% delivery rate` : "—"}</p>
        </div>
      </div>
    </div>
  );
}

export default function CampaignHistoryClient({ campaigns }: { campaigns: Campaign[] }) {
  const [activeTab, setActiveTab] = useState<"all" | "delivered" | "empty">("all");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [pill, setPill] = useState({ left: 0, width: 0, ready: false });

  useLayoutEffect(() => {
    const el = tabRefs.current[0];
    if (el) setPill({ left: el.offsetLeft, width: el.offsetWidth, ready: false });
  }, []);

  function handleTabChange(tab: typeof activeTab, idx: number) {
    setActiveTab(tab);
    const el = tabRefs.current[idx];
    if (el) setPill({ left: el.offsetLeft, width: el.offsetWidth, ready: true });
  }

  const TABS = [
    { id: "all" as const,       label: "All",           count: campaigns.length },
    { id: "delivered" as const, label: "Had deliveries", count: campaigns.filter(c => c.delivered > 0).length },
    { id: "empty" as const,     label: "No deliveries", count: campaigns.filter(c => c.delivered === 0).length },
  ];

  const filtered = activeTab === "all"
    ? campaigns
    : activeTab === "delivered"
      ? campaigns.filter(c => c.delivered > 0)
      : campaigns.filter(c => c.delivered === 0);

  const totalDelivered  = campaigns.reduce((acc, c) => acc + c.delivered, 0);
  const totalFilled     = campaigns.reduce((acc, c) => acc + c.filled, 0);
  const totalSlots      = campaigns.reduce((acc, c) => acc + c.totalSlots, 0);
  const overallDelivery = totalFilled > 0 ? Math.round((totalDelivered / totalFilled) * 100) : 0;

  return (
    <div className="p-10 max-w-4xl mx-auto pb-24">
      <Link href="/campaigns/list" className="inline-flex items-center gap-2 text-[14px] text-gray-400 hover:text-gray-700 transition-colors duration-[120ms] mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
        </svg>
        Back
      </Link>

      <div className="flex flex-col gap-1 mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Campaign History</h1>
        <p className="text-[15px] text-gray-400">All closed listings and their final outcomes.</p>
      </div>

      <div className="flex gap-3 mb-8">
        <StatTile label="Total campaigns" value={campaigns.length} />
        <StatTile label="Creators reached" value={totalFilled} sub={`of ${totalSlots} slots`} />
        <StatTile label="Posts delivered" value={totalDelivered} sub={`${overallDelivery}% delivery rate`} />
      </div>

      {campaigns.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <p className="text-gray-400 text-[15px]">No closed campaigns yet.</p>
        </div>
      ) : (
        <>
          <div className="relative flex gap-1 border border-gray-200 rounded-xl p-1 w-fit mb-6">
            <div
              className="absolute top-1 bottom-1 rounded-lg bg-white shadow-sm border border-gray-200 will-change-transform"
              style={{
                left: 0,
                width: pill.width,
                transform: `translateX(${pill.left}px)`,
                opacity: pill.width === 0 ? 0 : 1,
                transition: pill.ready ? "transform 320ms cubic-bezier(0.34,1.1,0.64,1), width 280ms cubic-bezier(0.34,1.1,0.64,1)" : "none",
              }}
            />
            {TABS.map((tab, i) => (
              <button
                key={tab.id}
                ref={(el) => { tabRefs.current[i] = el; }}
                onClick={() => handleTabChange(tab.id, i)}
                className={["relative z-10 flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors duration-[200ms]", activeTab === tab.id ? "text-neutral-900" : "text-gray-500 hover:text-gray-800"].join(" ")}
              >
                {tab.label}
                <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-400">{tab.count}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {filtered.map((campaign, i) => (
              <div key={campaign.id} style={{ animationName: "card-enter", animationDuration: "0.45s", animationTimingFunction: "cubic-bezier(0.22,1,0.36,1)", animationFillMode: "both", animationDelay: `${i * 60}ms` }}>
                <CampaignCard campaign={campaign} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
