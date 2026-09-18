import type { ComponentType, ReactNode } from "react";

export function SectionTitle({ title, description }: { title: string; description: string }) {
  return (
    <header>
      <h2 className="text-2xl font-bold tracking-[-0.035em] text-neutral-950">{title}</h2>
      <p className="mt-1.5 max-w-xl text-sm leading-6 text-neutral-500">{description}</p>
    </header>
  );
}

export function SettingRow({
  icon: Icon,
  label,
  value,
  actionLabel,
  onClick,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value?: string;
  actionLabel?: string;
  onClick?: () => void;
}) {
  return (
    <div className="flex min-h-[4.5rem] w-full items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-neutral-100 text-neutral-700">
        <Icon className="size-[19px]" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-neutral-900">{label}</span>
        {value ? <span className="mt-0.5 block truncate text-xs text-neutral-500">{value}</span> : null}
      </span>
      {actionLabel && onClick ? (
        <button
          type="button"
          aria-label={`${actionLabel} ${label.toLowerCase()}`}
          onClick={onClick}
          className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white px-3.5 text-xs font-semibold text-neutral-800 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-[background-color,transform] duration-150 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 active:scale-[0.96]"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

export function ModalSecondaryAction({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white px-3.5 text-xs font-semibold text-neutral-800 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-[background-color,border-color,transform] duration-150 hover:border-neutral-300 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 active:scale-[0.96]"
    >
      {children}
    </button>
  );
}

