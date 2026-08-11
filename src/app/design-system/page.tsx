import Link from "next/link";
import { registry, roadmap, ATOMIC_LEVELS } from "@/components/registry";

export const metadata = {
  title: "Design System — Creatorshop",
};

export default function DesignSystemPage() {
  return (
    <div className="mx-auto max-w-lg px-6 py-20">
      <h1 className="text-sm font-medium text-neutral-900">Design System</h1>
      <p className="mt-1 text-sm text-neutral-400">
        Every component, organized by atomic design level.
      </p>

      <div className="mt-12 space-y-10">
        {ATOMIC_LEVELS.map(({ key, label }) => {
          const built = registry.filter((entry) => entry.level === key);
          const planned = roadmap.filter((entry) => entry.level === key);

          return (
            <section key={key}>
              <h2 className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                {label}
              </h2>

              {built.length === 0 && planned.length === 0 ? (
                <p className="mt-3 text-sm text-neutral-300">Nothing here yet</p>
              ) : (
                <div className="mt-3 divide-y divide-neutral-100">
                  {built.map((entry) => (
                    <Link
                      key={entry.name}
                      href={`/design-system/${entry.name.toLowerCase()}`}
                      className="block py-3 text-sm font-medium text-neutral-900 transition-colors duration-150 hover:text-neutral-600"
                    >
                      {entry.name}
                    </Link>
                  ))}
                  {planned.map((entry) => (
                    <div key={entry.name} className="flex items-baseline justify-between gap-6 py-3 text-sm">
                      <span className="text-neutral-400">{entry.name}</span>
                      <span className="truncate text-neutral-300">{entry.note}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
