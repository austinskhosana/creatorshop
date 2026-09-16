import { Suspense } from "react";
import { ExploreSoftwarePage } from "@/components/pages/ExploreSoftwarePage";
import { MOCK_LISTINGS } from "@/lib/mock-listings";

export const metadata = {
  title: "Software — Creatorshop",
};

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <ExploreSoftwarePage listings={MOCK_LISTINGS} />
    </Suspense>
  );
}
