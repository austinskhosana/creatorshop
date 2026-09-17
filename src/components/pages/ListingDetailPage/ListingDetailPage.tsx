"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import AppShell from "@/components/templates/AppShell/AppShell";
import CategoryNavList from "@/components/molecules/CategoryNavList/CategoryNavList";
import ListingHeader from "@/components/organisms/ListingHeader/ListingHeader";
import PayWithCard from "@/components/organisms/PayWithCard/PayWithCard";
import CampaignReferences from "@/components/organisms/CampaignReferences/CampaignReferences";
import { CATEGORY_LABELS } from "@/lib/listings/explore";
import { MOCK_LISTINGS } from "@/lib/mock-listings";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { Listing } from "@/lib/listings/types";

function SparkleIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-[15px] w-[15px]"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" /></svg>;
}

function DesignIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-[15px] w-[15px]"><path d="M4 20l4.5-1.5L19 8a2.12 2.12 0 0 0-3-3L5.5 15.5 4 20Z" /></svg>;
}

function MarketingIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-[15px] w-[15px]"><path d="M3.5 10v4a1 1 0 0 0 1 1h2l7 4V5l-7 4h-2a1 1 0 0 0-1 1Z" /><path d="M17 9.5a3.5 3.5 0 0 1 0 5" /></svg>;
}

function DevToolsIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-[15px] w-[15px]"><path d="M9 18l-6-6 6-6M15 6l6 6-6 6" /></svg>;
}

function ProductivityIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-[15px] w-[15px]"><path d="M13 3 4 14h6l-1 7 9-11h-6l1-7Z" /></svg>;
}

const CATEGORY_ICONS = {
  "AI Tools": <SparkleIcon />,
  Design: <DesignIcon />,
  Marketing: <MarketingIcon />,
  "Dev Tools": <DevToolsIcon />,
  Productivity: <ProductivityIcon />,
};

interface ListingDetailPageProps {
  listing: Listing;
}

export default function ListingDetailPage({ listing }: ListingDetailPageProps) {
  const router = useRouter();
  const categories = [
    { id: "all", label: "All products", count: MOCK_LISTINGS.length },
    ...CATEGORY_LABELS.map((label) => ({
      id: label,
      label,
      icon: CATEGORY_ICONS[label],
      count: MOCK_LISTINGS.filter((item) => item.category === label).length,
    })),
  ];

  function goToExplore(params: URLSearchParams) {
    router.push(params.size ? `/explore?${params.toString()}` : "/explore");
  }

  return (
    <AppShell
      activeHref="/explore"
      userName="Jordan Lee"
      searchValue=""
      onSearchChange={(value) => {
        const params = new URLSearchParams();
        if (value) params.set("q", value);
        goToExplore(params);
      }}
      cartCount={2}
      savedCount={7}
      messagesCount={3}
      sidebarChildren={
        <CategoryNavList
          categories={categories}
          activeId="all"
          onChange={(category) => {
            const params = new URLSearchParams();
            if (category !== "all") params.set("category", category);
            goToExplore(params);
          }}
        />
      }
    >
      <div className="flex h-full flex-col px-5 py-6 sm:px-8 sm:py-8">
        <Breadcrumb>
          <BreadcrumbList className="gap-2 text-[13px] text-neutral-400 sm:gap-2">
            <BreadcrumbItem>
              <BreadcrumbLink asChild className="text-neutral-400 hover:text-neutral-600">
                <Link href="/explore">Shop</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-neutral-400" />
            <BreadcrumbItem>
              <BreadcrumbLink asChild className="text-neutral-400 hover:text-neutral-600">
                <Link href="/explore">Software</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-neutral-400" />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium text-neutral-900">{listing.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mx-auto flex w-full max-w-6xl flex-1 items-start pt-16 pb-10">
          <div className="grid w-full gap-10 lg:grid-cols-[minmax(0,1fr)_1px_minmax(360px,460px)] lg:gap-12">
            <div className="flex min-w-0 flex-col items-start gap-8">
              <ListingHeader
                slug={listing.slug}
                brandName={listing.brandName}
                title={listing.title}
                description={listing.description}
                category={listing.category}
                align="left"
              />
              <div className="w-full max-w-xl">
                <PayWithCard listing={listing} saved={listing.saved} />
              </div>
            </div>

            <div aria-hidden="true" className="hidden bg-neutral-200 lg:block" />

            <CampaignReferences listing={listing} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
