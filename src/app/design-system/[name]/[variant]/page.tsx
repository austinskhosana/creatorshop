import { notFound } from "next/navigation";
import { registry } from "@/components/registry";
import { slugify } from "@/lib/utils";
import { BackButton } from "../../_components/BackButton";

export function generateStaticParams() {
  return registry.flatMap((entry) =>
    entry.variants.map((variant) => ({
      name: slugify(entry.name),
      variant: slugify(variant.name),
    })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string; variant: string }>;
}) {
  const { name, variant } = await params;
  const entry = registry.find((e) => slugify(e.name) === name);
  const match = entry?.variants.find((v) => slugify(v.name) === variant);
  return { title: match ? `${match.name} ${entry!.name} — Creatorshop` : "Creatorshop" };
}

export default async function ComponentVariantPage({
  params,
}: {
  params: Promise<{ name: string; variant: string }>;
}) {
  const { name, variant } = await params;
  const entry = registry.find((e) => slugify(e.name) === name);
  const match = entry?.variants.find((v) => slugify(v.name) === variant);

  if (!entry || !match) notFound();

  if (entry.fullBleed) {
    return (
      <div className="relative">
        <BackButton href={`/design-system/${slugify(entry.name)}`} position="right" fixed />
        {match.preview}
      </div>
    );
  }

  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-6 py-20">
      <BackButton href={`/design-system/${slugify(entry.name)}`} />

      <div className="w-full max-w-lg text-center">
        <h1 className="text-sm font-medium text-neutral-900">
          {match.name} {entry.name}
        </h1>
        {entry.stage === "before" && (
          <p className="mt-2 text-xs text-amber-700">
            Ported as-is from the prior build — not yet redesigned.
          </p>
        )}

        <div className="mt-10 flex items-center justify-center">{match.preview}</div>
      </div>
    </div>
  );
}
