import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface Category {
  id: string;
  label: string;
  count: number;
  icon?: ReactNode;
}

interface CategoryNavListProps {
  categories: Category[];
  activeId: string;
  onChange: (id: string) => void;
}

export default function CategoryNavList({ categories, activeId, onChange }: CategoryNavListProps) {
  return (
    <div>
      <p className="px-2.5 pb-2 text-[11px] font-medium tracking-wider text-neutral-400 uppercase">Categories</p>
      <ul className="flex flex-col gap-0.5">
        {categories.map((category) => {
          const active = category.id === activeId;

          return (
            <li key={category.id}>
              <button
                type="button"
                onClick={() => onChange(category.id)}
                aria-current={active ? "true" : undefined}
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded-r-lg border-l-2 py-1.5 pr-2.5 pl-2.5 text-left text-[13.5px] transition-[color,border-color,transform] duration-150 active:scale-[0.98]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-inset",
                  active
                    ? "border-neutral-900 font-medium text-neutral-900"
                    : "border-transparent text-neutral-500 hover:text-neutral-800",
                )}
              >
                <span className="flex min-w-0 items-center gap-2">
                  {category.icon && (
                    <span aria-hidden="true" className={active ? "text-neutral-900" : "text-neutral-400"}>
                      {category.icon}
                    </span>
                  )}
                  <span className="truncate">{category.label}</span>
                </span>
                <span className="text-[12px] tabular-nums text-neutral-400">{category.count}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
