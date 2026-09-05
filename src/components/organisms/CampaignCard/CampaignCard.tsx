interface Campaign {
  id: string;
  name: string;
  planName: string;
  createdAt: string;
  endedAt: string;
  totalSlots: number;
  filled: number;
  delivered: number;
}

function formatDateRange(start: string, end: string) {
  const s = new Date(start).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const e = new Date(end).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return `${s} – ${e}`;
}

export default function CampaignCard({ campaign }: { campaign: Campaign }) {
  const fillRate = campaign.totalSlots > 0 ? Math.round((campaign.filled / campaign.totalSlots) * 100) : 0;
  const deliveryRate = campaign.filled > 0 ? Math.round((campaign.delivered / campaign.filled) * 100) : 0;

  return (
    <div className="w-full overflow-hidden rounded-3xl border border-gray-200 bg-white text-left">
      <div className="flex items-center gap-4 bg-gradient-to-b from-[#A3FF38]/40 to-white px-6 pt-6 pb-6">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl border border-[#82F200] bg-[#A3FF38] shadow-[inset_3px_3px_6px_rgba(255,255,255,0.4)]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-gray-900">
            <path d="M16.881 4.345A23.112 23.112 0 0 1 8.25 6H7.5a5.25 5.25 0 0 0-.88 10.427 21.593 21.593 0 0 0 1.378 3.94c.464 1.004 1.674 1.32 2.582.796l.657-.379c.88-.508 1.165-1.593.73-2.477a19.665 19.665 0 0 1-.748-2.37 23.148 23.148 0 0 1 5.33 1.43 22.795 22.795 0 0 0 .97-6.308c0-1.833-.277-3.553-.78-5.148a.5.5 0 0 0-.11-.166Z" />
            <path d="M20.08 4.14a23.09 23.09 0 0 1 1.17 6.705 23.085 23.085 0 0 1-1.17 6.704 23.046 23.046 0 0 0 2.63-6.704 23.046 23.046 0 0 0-2.63-6.705Z" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-[15px] leading-snug font-semibold text-neutral-900">{campaign.name}</h2>
          <p className="mt-0.5 text-[13px] leading-snug text-gray-400">
            {campaign.planName} · {formatDateRange(campaign.createdAt, campaign.endedAt)}
          </p>
        </div>
      </div>
      <div className="flex gap-3 px-6 pb-6">
        <div className="flex flex-1 flex-col gap-0.5 rounded-2xl border border-gray-200 bg-white px-4 py-3">
          <p className="text-[18px] leading-none font-bold text-neutral-900">
            {campaign.filled}
            <span className="text-[13px] font-medium text-gray-300"> / {campaign.totalSlots}</span>
          </p>
          <p className="text-[12px] text-gray-400">Slots filled</p>
          <p className="text-[11px] text-gray-300">{fillRate}% fill rate</p>
        </div>
        <div className="flex flex-1 flex-col gap-0.5 rounded-2xl border border-gray-200 bg-white px-4 py-3">
          <p className="text-[18px] leading-none font-bold text-neutral-900">{campaign.delivered}</p>
          <p className="text-[12px] text-gray-400">Posts delivered</p>
          <p className="text-[11px] text-gray-300">
            {campaign.filled > 0 ? `${deliveryRate}% delivery rate` : "—"}
          </p>
        </div>
      </div>
    </div>
  );
}
