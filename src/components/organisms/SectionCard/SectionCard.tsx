import { ReactNode } from "react";

interface SectionCardProps {
  icon: ReactNode;
  title: string;
  description?: string;
  children: ReactNode;
}

export default function SectionCard({ icon, title, description, children }: SectionCardProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white">
      <div className="flex items-center gap-4 bg-gradient-to-b from-[#A3FF38]/40 to-white px-6 pt-6 pb-6">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl border border-[#82F200] bg-[#A3FF38] shadow-[inset_3px_3px_6px_rgba(255,255,255,0.4)]">
          {icon}
        </div>
        <div>
          <h2 className="text-[15px] leading-snug font-semibold text-neutral-900">{title}</h2>
          {description && <p className="mt-0.5 text-[13px] leading-snug text-gray-400">{description}</p>}
        </div>
      </div>
      <div className="flex flex-col gap-4 px-6 pb-6">{children}</div>
    </div>
  );
}
