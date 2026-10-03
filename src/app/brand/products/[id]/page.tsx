import { ProductEditorPage } from "@/components/pages/ProductEditorPage";
export const metadata = { title: "Edit product page — Creatorshop for brands" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductEditorPage productId={decodeURIComponent(id)} />;
}
