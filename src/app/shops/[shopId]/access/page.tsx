import { notFound } from "next/navigation";
import { AccessRevealPage } from "@/components/pages/AccessRevealPage";
import { CREATOR_SHOPS } from "@/lib/mock-creator";

export const metadata = { title: "Reveal your access — Creatorshop" };

export function generateStaticParams() {
  return CREATOR_SHOPS.filter(shop => shop.accessCode).map(shop => ({ shopId: shop.id }));
}

export default async function Page({ params }: PageProps<"/shops/[shopId]/access">) {
  const { shopId } = await params;
  const shop = CREATOR_SHOPS.find(item => item.id === shopId && item.accessCode);

  if (!shop) notFound();

  return <AccessRevealPage shop={shop} />;
}
