import { BrandSettingsPage, type BrandSettingsSection } from "@/components/pages/BrandSettingsPage";
export const metadata = { title: "Settings — Creatorshop for brands" };

const SECTIONS: BrandSettingsSection[] = ["storefront", "intro", "billing", "notifications", "account"];

export default async function Page({ searchParams }: { searchParams: Promise<{ section?: string | string[] }> }) {
  const { section } = await searchParams;
  const initial = SECTIONS.find((item) => item === section) ?? "storefront";
  return <BrandSettingsPage section={initial} />;
}
