import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  /** Buttons or links aligned to the right of the title on wide screens. */
  actions?: ReactNode;
}

/** The title block every creator and brand screen opens with: a bold heading and one quiet line. */
export default function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-4xl font-bold tracking-tight text-neutral-950">{title}</h1>
        {description ? <p className="mt-2 text-sm text-neutral-500">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}
