interface StatTileProps {
  label: string;
  value: string | number;
  sub?: string;
}

export default function StatTile({ label, value, sub }: StatTileProps) {
  return (
    <div className="flex flex-1 flex-col gap-1 rounded-2xl border border-gray-200 bg-white px-5 py-4">
      <p className="text-[11px] font-medium tracking-wider text-gray-400 uppercase">{label}</p>
      <p className="text-[28px] leading-none font-bold text-neutral-900">{value}</p>
      {sub && <p className="mt-0.5 text-[12px] text-gray-400">{sub}</p>}
    </div>
  );
}
