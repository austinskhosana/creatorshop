import { ShopperReviewPage } from "@/components/pages/ShopperReviewPage";
export const metadata = { title: "Review shoppers — Creatorshop for brands" };

export default async function Page({ searchParams }: { searchParams: Promise<{ product?: string | string[] }> }) {
  const { product } = await searchParams;
  return <ShopperReviewPage productId={typeof product === "string" ? product : undefined} />;
}
