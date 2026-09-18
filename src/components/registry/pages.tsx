import { ListingDetailPage } from "@/components/pages/ListingDetailPage";
import { ExploreSoftwarePage } from "@/components/pages/ExploreSoftwarePage";
import { MOCK_LISTINGS } from "@/lib/mock-listings";
import { SavedPage } from "@/components/pages/SavedPage";
import { CartPage } from "@/components/pages/CartPage";
import { MessagesPage } from "@/components/pages/MessagesPage";
import type { RegistryEntry } from "./types";

export const pagesEntries: RegistryEntry[] = [
  {
    name: "Explore software",
    level: "pages",
    description: "The shop — creators browse software to pay for with a post. Sidebar search and category counts, an access-length/sort toolbar, and a grid of grey-placeholder product cards. Light mode, editorial density, Toolfolio-inspired.",
    fullBleed: true,
    variants: [
      {
        name: "Default",
        preview: <ExploreSoftwarePage listings={MOCK_LISTINGS} />,
      },
    ],
  },
  {
    name: "Saved",
    level: "pages",
    description: "Bookmarked products — same grid and card treatment as the store, with an empty state pointing back to Shop.",
    fullBleed: true,
    variants: [
      {
        name: "Default",
        preview: <SavedPage />,
      },
    ],
  },
  {
    name: "Cart",
    level: "pages",
    description: "The basket before checkout — line items with a remove action on the left, a sticky transaction summary and CTA on the right, and an empty state pointing back to Shop.",
    fullBleed: true,
    variants: [
      {
        name: "Default",
        preview: <CartPage />,
      },
      {
        name: "Empty",
        preview: <CartPage initialItems={[]} />,
      },
    ],
  },
  {
    name: "Software listing",
    level: "pages",
    description: "Product detail as a centered checkout moment rather than a two-column page — no product image, brand logo above the fold, description and pay-with panel stacked and centered in the viewport.",
    fullBleed: true,
    variants: [
      {
        name: "Default",
        preview: <ListingDetailPage listing={MOCK_LISTINGS[0]} />,
      },
      {
        name: "Multiple deliverables",
        preview: <ListingDetailPage listing={MOCK_LISTINGS[3]} />,
      },
    ],
  },
  {
    name: "Messages",
    level: "pages",
    description: "Inbox and conversation view — a thread list sidebar next to a message log with a composer, mirroring the shop's DM experience.",
    fullBleed: true,
    variants: [{ name: "Default", preview: <MessagesPage /> }],
  }
];
