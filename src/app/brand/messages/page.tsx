import { BrandMessagesPage } from "@/components/pages/BrandMessagesPage";
export const metadata = { title: "Messages — Creatorshop for brands" };

export default async function Page({ searchParams }: { searchParams: Promise<{ thread?: string | string[] }> }) {
  const { thread } = await searchParams;
  return <BrandMessagesPage threadId={typeof thread === "string" ? thread : undefined} />;
}
