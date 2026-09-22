import { notFound } from "next/navigation";
import { PostBuilderPage } from "@/components/pages/PostBuilderPage";
import { isContentTypeId } from "@/lib/content-types";
import { CREATOR_SHOPS } from "@/lib/mock-creator";

export const metadata = { title: "Build your post — Creatorshop" };

export default async function Page({ params, searchParams }: PageProps<"/post-builder/[shopId]">) {
  const { shopId } = await params;
  const { type } = await searchParams;
  const shop = CREATOR_SHOPS.find((candidate) => candidate.id === shopId);

  if (!shop || shop.state !== "approved") notFound();

  // `?type=x-thread` previews another content type's layout without changing the shop's own tier.
  const contentTypeId = typeof type === "string" && isContentTypeId(type) ? type : undefined;

  return <PostBuilderPage shop={shop} contentTypeId={contentTypeId} />;
}
