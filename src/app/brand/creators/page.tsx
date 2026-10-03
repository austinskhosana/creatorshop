import { CreatorDirectoryPage } from "@/components/pages/CreatorDirectoryPage";
export const metadata = { title: "Creators — Creatorshop for brands" };

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string | string[]; view?: string | string[] }> }) {
  const { q, view } = await searchParams;
  return <CreatorDirectoryPage key={typeof q === "string" ? q : ""} initialQuery={typeof q === "string" ? q : ""} initialView={view === "grid" ? "grid" : "swipe"} />;
}
