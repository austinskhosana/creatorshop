export default function ServicesList({ services }: { services: string[] }) {
  if (services.length === 0) return null;

  return (
    <div className="flex flex-col gap-2.5 border-t border-gray-100 pt-5">
      <p className="text-[12px] font-semibold tracking-wider text-gray-400 uppercase">What I offer</p>
      <div className="flex flex-wrap gap-2">
        {services.map((s) => (
          <span key={s} className="rounded-xl bg-[#F6F6F6] px-3 py-1.5 text-[13px] font-medium text-gray-700">
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}
