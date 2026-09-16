import { notFound } from "next/navigation";
import { ListingDetailPage } from "@/components/pages/ListingDetailPage";
import { MOCK_LISTINGS } from "@/lib/mock-listings";

interface SoftwareListingPageProps {
  params: Promise<{ slug: string }>;
}

export default async function SoftwareListingPage({ params }: SoftwareListingPageProps) {
  const { slug } = await params;
  const listing = MOCK_LISTINGS.find((item) => item.slug === slug);

  if (!listing) notFound();

  return <ListingDetailPage listing={listing} />;
}
