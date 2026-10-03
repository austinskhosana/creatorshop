import { BrandStorefrontPage } from "@/components/pages/BrandStorefrontPage";
export const metadata = { title: "Storefront — Creatorshop" };

export default async function Page({ params }: { params: Promise<{ brand: string }> }) {
  const { brand } = await params;
  return <BrandStorefrontPage slug={decodeURIComponent(brand)} />;
}
