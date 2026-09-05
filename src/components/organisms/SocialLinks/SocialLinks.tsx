import { ReactNode } from "react";

export interface SocialLink {
  key: string;
  label: string;
  url: string;
  icon: ReactNode;
}

export default function SocialLinks({ links }: { links: SocialLink[] }) {
  if (links.length === 0) return null;

  return (
    <div className="flex flex-col gap-2.5 border-t border-gray-100 pt-5">
      <p className="text-[12px] font-semibold tracking-wider text-gray-400 uppercase">Socials</p>
      <div className="flex flex-wrap gap-2">
        {links.map(({ key, label, url, icon }) => (
          <a
            key={key}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3.5 py-2 text-[13px] font-medium text-gray-600 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.03)] transition-colors duration-[120ms] hover:border-gray-300 hover:text-gray-900"
          >
            <span className="text-gray-500">{icon}</span>
            {label}
          </a>
        ))}
      </div>
    </div>
  );
}
