import { ListingDetailPage } from "@/components/pages/ListingDetailPage";
import { ExploreSoftwarePage } from "@/components/pages/ExploreSoftwarePage";
import { MOCK_LISTINGS } from "@/lib/mock-listings";
import { GenieIndexPage } from "@/components/pages/GenieIndexPage";
import { CartPage } from "@/components/pages/CartPage";
import { MessagesPage } from "@/components/pages/MessagesPage";
import { BrandAuthPage } from "@/components/pages/BrandAuthPage";
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
    name: "The Genie Index",
    level: "pages",
    description: "Creators wish for software that isn't on Creatorshop yet — a Make a wish banner above The Genie Index heading, All / My wishes tabs, and a grid of wish cards.",
    fullBleed: true,
    variants: [
      {
        name: "Default",
        preview: <GenieIndexPage />,
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
        preview: <CartPage items={[]} />,
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
  },
  {
    name: "Brand sign-up",
    level: "pages",
    description: "The way into the brand side from the /brands landing page: account → storefront → $50/month subscription, with the landing hero's card visual on the right. Sign-in variant opens the Fernpad demo merchant.",
    fullBleed: true,
    variants: [
      { name: "Sign up", preview: <BrandAuthPage mode="signup" /> },
      { name: "Sign in", preview: <BrandAuthPage mode="signin" /> },
    ],
  },
];
