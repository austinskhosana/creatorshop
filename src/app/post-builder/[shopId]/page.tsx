import { notFound } from "next/navigation";
import { PostBuilderPage } from "@/components/pages/PostBuilderPage";
import { CREATOR_SHOPS } from "@/lib/mock-creator";

export const metadata = { title: "Build your post — Creatorshop" };

export default async function Page({ params }: PageProps<"/post-builder/[shopId]">) {
  const { shopId } = await params;
  const shop = CREATOR_SHOPS.find((candidate) => candidate.id === shopId);

  if (!shop || shop.state !== "approved") notFound();

  return <PostBuilderPage shop={shop} />;
}
