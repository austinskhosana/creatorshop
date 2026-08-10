import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <h1 className="text-3xl font-bold text-neutral-900">Creatorshop</h1>
      <p className="mt-3 text-neutral-500 max-w-md">
        Rebuilding from scratch, component by component, following atomic
        design principles — built in public.
      </p>
      <Link
        href="/design-system"
        className="mt-6 inline-block text-sm font-medium text-neutral-900 underline underline-offset-4"
      >
        View the design system →
      </Link>
    </div>
  );
}
