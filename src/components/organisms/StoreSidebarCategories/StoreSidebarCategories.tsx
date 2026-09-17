"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import CategoryNavList, { type Category } from "@/components/molecules/CategoryNavList/CategoryNavList";
import { MOCK_LISTINGS } from "@/lib/mock-listings";

function SparkleIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-[15px] w-[15px]"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8-2.8M8.4 15.6l-2.8 2.8" /></svg>; }
function DesignIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-[15px] w-[15px]"><path d="M4 20l4.5-1.5L19 8a2.12 2.12 0 0 0-3-3L5.5 15.5 4 20Z" /></svg>; }
function MarketingIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-[15px] w-[15px]"><path d="M3.5 10v4a1 1 0 0 0 1 1h2l7 4V5l-7 4h-2a1 1 0 0 0-1 1Z" /><path d="M17 9.5a3.5 3.5 0 0 1 0 5" /></svg>; }
function DevToolsIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-[15px] w-[15px]"><path d="M9 18l-6-6 6-6M15 6l6 6-6 6" /></svg>; }
function ProductivityIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-[15px] w-[15px]"><path d="M13 3 4 14h6l-1 7 9-11h-6l1-7Z" /></svg>; }

const definitions = [
  { id: "AI Tools", icon: <SparkleIcon /> }, { id: "Design", icon: <DesignIcon /> }, { id: "Marketing", icon: <MarketingIcon /> }, { id: "Dev Tools", icon: <DevToolsIcon /> }, { id: "Productivity", icon: <ProductivityIcon /> },
];

export default function StoreSidebarCategories() {
  const router = useRouter(); const pathname = usePathname(); const searchParams = useSearchParams();
  const activeId = pathname === "/explore" ? searchParams.get("category") ?? "all" : "all";
  const categories: Category[] = [{ id: "all", label: "All products", count: MOCK_LISTINGS.length }, ...definitions.map(({ id, icon }) => ({ id, label: id, icon, count: MOCK_LISTINGS.filter(listing => listing.category === id).length }))];
  return <StoreSidebarCategoriesView categories={categories} activeId={activeId} onChange={(category) => router.push(category === "all" ? "/explore" : `/explore?category=${encodeURIComponent(category)}`)} />;
}

export function StoreSidebarCategoriesView({ categories, activeId, onChange }: { categories: Category[]; activeId: string; onChange: (category: string) => void }) { return <CategoryNavList categories={categories} activeId={activeId} onChange={onChange} />; }
