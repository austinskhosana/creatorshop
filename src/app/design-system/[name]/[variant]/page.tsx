import { notFound } from "next/navigation";
import { registry } from "@/components/registry";
import { BackButton } from "../../_components/BackButton";

export function generateStaticParams() {
  return registry.flatMap((entry) =>
    entry.variants.map((variant) => ({
      name: entry.name.toLowerCase(),
      variant: variant.name.toLowerCase(),
    })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string; variant: string }>;
}) {
  const { name, variant } = await params;
  const entry = registry.find((e) => e.name.toLowerCase() === name);
  const match = entry?.variants.find((v) => v.name.toLowerCase() === variant);
  return { title: match ? `${match.name} ${entry!.name} — Creatorshop` : "Creatorshop" };
}

export default async function ComponentVariantPage({
  params,
}: {
  params: Promise<{ name: string; variant: string }>;
}) {
  const { name, variant } = await params;
  const entry = registry.find((e) => e.name.toLowerCase() === name);
  const match = entry?.variants.find((v) => v.name.toLowerCase() === variant);

  if (!entry || !match) notFound();

  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-6 py-20">
      <BackButton href={`/design-system/${entry.name.toLowerCase()}`} />

      <div className="w-full max-w-lg text-center">
        <h1 className="text-sm font-medium text-neutral-900">
          {match.name} {entry.name}
        </h1>

        <div className="mt-10 flex items-center justify-center">{match.preview}</div>
      </div>
    </div>
  );
}
