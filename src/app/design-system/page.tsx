import { registry, ATOMIC_LEVELS } from "@/components/registry";

export const metadata = {
  title: "Design System — Creatorshop",
};

export default function DesignSystemPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold text-neutral-900">Design System</h1>
      <p className="mt-2 text-sm text-neutral-500">
        Every component, organized by atomic design level.
      </p>

      <div className="mt-12 space-y-16">
        {ATOMIC_LEVELS.map(({ key, label }) => {
          const entries = registry.filter((entry) => entry.level === key);
          return (
            <section key={key}>
              <h2 className="text-lg font-semibold text-neutral-900">{label}</h2>
              <div className="mt-1 h-px bg-neutral-200" />

              {entries.length === 0 ? (
                <p className="mt-6 text-sm text-neutral-400">Nothing here yet.</p>
              ) : (
                <div className="mt-6 space-y-6">
                  {entries.map((entry) => (
                    <div
                      key={entry.name}
                      className="rounded-xl border border-neutral-200 p-6"
                    >
                      <h3 className="text-sm font-semibold text-neutral-900">
                        {entry.name}
                      </h3>
                      <p className="mt-1 text-xs text-neutral-500">
                        {entry.description}
                      </p>
                      <div className="mt-4">{entry.preview}</div>
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
