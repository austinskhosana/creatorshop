import { StoreProductPage } from "@/components/pages/StoreProductPage";
export const metadata = { title: "Product — Creatorshop" };

export default async function Page({ params }: { params: Promise<{ brand: string; product: string }> }) {
  const { brand, product } = await params;
  return <StoreProductPage brandSlug={decodeURIComponent(brand)} productSlug={decodeURIComponent(product)} />;
}
