import Link from "next/link";
import { notFound } from "next/navigation";
import { registry } from "@/components/registry";
import { BackButton } from "../_components/BackButton";

export function generateStaticParams() {
  return registry.map((entry) => ({ name: entry.name.toLowerCase() }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const entry = registry.find((e) => e.name.toLowerCase() === name);
  return { title: entry ? `${entry.name} — Creatorshop` : "Creatorshop" };
}

export default async function ComponentDirectoryPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const entry = registry.find((e) => e.name.toLowerCase() === name);

  if (!entry) notFound();

  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-6 py-20">
      <BackButton href="/design-system" />

      <div className="w-full max-w-lg text-center">
        <h1 className="text-sm font-medium text-neutral-900">{entry.name}</h1>

        <div className="mt-10 divide-y divide-neutral-100 text-left">
          {entry.variants.map((variant) => (
            <Link
              key={variant.name}
              href={`/design-system/${entry.name.toLowerCase()}/${variant.name.toLowerCase()}`}
              className="block py-3 text-sm font-medium text-neutral-900 transition-colors duration-150 hover:text-neutral-600"
            >
              {variant.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
