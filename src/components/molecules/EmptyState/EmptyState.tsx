import { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface EmptyStateAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  /** Draws the dashed outline. Turn off when the parent already frames the space. */
  framed?: boolean;
  className?: string;
}

function DefaultIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="size-5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776" />
    </svg>
  );
}

const ACTION_BASE =
  "inline-flex min-h-10 items-center justify-center rounded-[9px] px-4 text-[13px] font-medium transition-[background-color,border-color,filter,transform] duration-150 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2";

const ACTION_STYLES = {
  primary:
    "text-white bg-[linear-gradient(180deg,#323232_0%,#222222_100%)] shadow-[inset_0_0.5px_1px_rgba(255,255,255,0.15),inset_0_-1px_1.2px_0.35px_rgba(18,18,18,1),0_2px_3px_-1px_rgba(13,13,13,0.5),0_0_0_1px_rgba(51,51,51,1)] hover:brightness-125",
  secondary: "border border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-950",
};

function ActionControl({ action, tone }: { action: EmptyStateAction; tone: keyof typeof ACTION_STYLES }) {
  const className = cn(ACTION_BASE, ACTION_STYLES[tone]);
  if (action.href) {
    return (
      <Link href={action.href} className={className}>
        {action.label}
      </Link>
    );
  }
  return (
    <button type="button" onClick={action.onClick} className={className}>
      {action.label}
    </button>
  );
}

/**
 * Placeholder empty state: a small icon resting on two ghost cards (the shape of a listing card),
 * a title, a line of help, and up to two actions. Intentionally quiet until bespoke ones are designed.
 */
export default function EmptyState({ title, description, icon, action, secondaryAction, framed = true, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-6 py-16 text-center sm:py-20",
        framed && "rounded-[20px] border border-dashed border-neutral-200 bg-white",
        className,
      )}
    >
      <div aria-hidden="true" className="relative mb-6 h-14 w-24">
        <span className="absolute inset-x-5 inset-y-1 -translate-x-4 -rotate-[10deg] rounded-[12px] border border-neutral-200 bg-neutral-100" />
        <span className="absolute inset-x-5 inset-y-1 translate-x-4 rotate-[10deg] rounded-[12px] border border-neutral-200 bg-neutral-100" />
        <span className="absolute inset-x-5 inset-y-0 grid place-items-center rounded-[12px] border border-neutral-200 bg-white text-neutral-900 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          {icon ?? <DefaultIcon />}
          <span className="absolute -top-1 -right-1 size-2.5 rounded-full border-2 border-white bg-[#A3FF38]" />
        </span>
      </div>
      <h3 className="text-balance text-[15px] font-semibold tracking-[-0.02em] text-neutral-950">{title}</h3>
      {description && <p className="mt-1.5 max-w-[19rem] text-pretty text-[13px] leading-[1.55] text-neutral-500">{description}</p>}
      {(action || secondaryAction) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {action && <ActionControl action={action} tone="primary" />}
          {secondaryAction && <ActionControl action={secondaryAction} tone="secondary" />}
        </div>
      )}
    </div>
  );
}
