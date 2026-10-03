import Link from "next/link";
import type { ReactNode } from "react";

interface NoticeBannerProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: { label: string; href?: string; onClick?: () => void };
}

const ACTION_CLASS =
  "inline-flex min-h-10 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white px-3.5 text-xs font-semibold text-neutral-800 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-[background-color,border-color,transform] duration-150 hover:border-neutral-300 hover:bg-neutral-50 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2";

/** Something the account needs before it can sell — subscription, verification — and the fix. */
export default function NoticeBanner({ icon, title, description, action }: NoticeBannerProps) {
  return (
    <div role="status" className="flex flex-col gap-3 rounded-2xl bg-neutral-100 p-4 sm:flex-row sm:items-center">
      <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-neutral-900">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-neutral-950">{title}</p>
        <p className="mt-0.5 text-[13px] leading-5 text-neutral-600">{description}</p>
      </div>
      {action ? (
        action.href ? (
          <Link href={action.href} className={ACTION_CLASS}>{action.label}</Link>
        ) : (
          <button type="button" onClick={action.onClick} className={ACTION_CLASS}>{action.label}</button>
        )
      ) : null}
    </div>
  );
}
