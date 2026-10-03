import { notFound } from "next/navigation";
import { BrandCreatorProfilePage } from "@/components/pages/BrandCreatorProfilePage";
import { getShopperByHandle } from "@/lib/mock-brand";

type Props = { params: Promise<{ handle: string }> };

export async function generateMetadata({ params }: Props) {
  const { handle } = await params;
  const shopper = getShopperByHandle(decodeURIComponent(handle));
  return { title: `${shopper?.name ?? "Creator"} — Creatorshop for brands` };
}

export default async function Page({ params }: Props) {
  const { handle } = await params;
  const shopper = getShopperByHandle(decodeURIComponent(handle));
  if (!shopper) notFound();
  return <BrandCreatorProfilePage shopper={shopper} />;
}
