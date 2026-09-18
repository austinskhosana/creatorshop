import { CategoryCard } from "@/components/organisms/CategoryCard";
import { CreatorDirectoryCard } from "@/components/organisms/CreatorDirectoryCard";
import { ListingCard } from "@/components/organisms/ListingCard";
import { ListingHeader } from "@/components/organisms/ListingHeader";
import { PayWithCard } from "@/components/organisms/PayWithCard";
import { ListingsToolbarDemo } from "@/components/organisms/ListingsToolbar";
import { ListingGrid } from "@/components/organisms/ListingGrid";
import { TopBar } from "@/components/organisms/TopBar";
import { PromoBanner } from "@/components/organisms/PromoBanner";
import { CuratedRow } from "@/components/organisms/CuratedRow";
import { Sidebar } from "@/components/organisms/Sidebar";
import { MOCK_LISTINGS } from "@/lib/mock-listings";
import { CampaignCard } from "@/components/organisms/CampaignCard";
import { SectionCard } from "@/components/organisms/SectionCard";
import { KeyReveal } from "@/components/organisms/KeyReveal";
import { DeliveryFormDemo } from "@/components/organisms/DeliveryForm";
import { ShopCard } from "@/components/organisms/ShopCard";
import { SwipeCard } from "@/components/organisms/SwipeCard";
import type { Application } from "@/components/organisms/SwipeCard";
import { CardStackDemo } from "@/components/organisms/CardStack";
import { ReviewedList } from "@/components/organisms/ReviewedList";
import { ReviewedPill } from "@/components/organisms/ReviewedPill";
import { ProfileHeaderDemo } from "@/components/organisms/ProfileHeader";
import { ServicesList } from "@/components/organisms/ServicesList";
import { SocialLinks } from "@/components/organisms/SocialLinks";
import type { SocialLink } from "@/components/organisms/SocialLinks";
import { SocialCapitalCard } from "@/components/organisms/SocialCapitalCard";
import { HeroSection } from "@/components/organisms/HeroSection";
import { BrandHeroSection } from "@/components/organisms/BrandHeroSection";
import { BrandMomentSection } from "@/components/organisms/BrandMomentSection";
import { FeatureGridSection } from "@/components/organisms/FeatureGridSection";
import { PricingSection } from "@/components/organisms/PricingSection";
import { BrandFAQSection } from "@/components/organisms/BrandFAQSection";
import { Navbar } from "@/components/organisms/Navbar";
import { HowItWorksSection } from "@/components/organisms/HowItWorksSection";
import { FAQSection } from "@/components/organisms/FAQSection";
import { Footer } from "@/components/organisms/Footer";
import { ConversationHeader } from "@/components/organisms/ConversationHeader";
import { MessageComposerDemo } from "@/components/organisms/MessageComposer";
import { ThreadListDemo } from "@/components/organisms/ThreadList";
import type { RegistryEntry } from "./types";

const MOCK_APPLICATION: Application = {
  id: "1",
  creatorId: "c1",
  displayName: "Jordan Lee",
  avatarUrl: null,
  bio: "Lifestyle and travel content creator working with software brands.",
  pitch: "I'll create a 60s TikTok walkthrough of your onboarding flow.",
  niches: ["Lifestyle", "Travel"],
  services: ["TikTok video"],
  audienceSize: "24K",
  deliverable: "TikTok video",
  platform: "TikTok",
  listingName: "Acme Tool",
  appliedAt: new Date().toISOString(),
  instagramUrl: null,
  tiktokUrl: "https://tiktok.com/@jordanlee",
  status: "PENDING",
};

const MOCK_REVIEWED: Application[] = [
  { ...MOCK_APPLICATION, id: "r1", displayName: "Jordan Lee", status: "APPROVED" },
  { ...MOCK_APPLICATION, id: "r2", displayName: "Priya Nair", status: "DENIED" },
  { ...MOCK_APPLICATION, id: "r3", displayName: "Sam Osei", status: "APPROVED" },
];

export const organismsEntries: RegistryEntry[] = [
  {
    name: "Category card",
    level: "organisms",
    description: "3D-tilt shop category tile with a hover gradient.",
    stage: "before",
    variants: [
      {
        name: "Default",
        preview: (
          <div className="grid w-full max-w-xl grid-cols-2 gap-4">
            <CategoryCard
              name="Apparel"
              description="Streetwear, footwear, and accessories."
              href="#"
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M8 4l4-1 4 1 3 3-3 3v11H5V10L2 7l3-3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
              }
            />
            <CategoryCard
              name="Electronics"
              description="Gadgets, audio, and smart devices."
              href="#"
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect x="4" y="4" width="16" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M9 20h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              }
            />
          </div>
        ),
      },
    ],
  },
  {
    name: "Creator directory card",
    level: "organisms",
    description: "Cover block, niche tags, bio, and view-profile CTA for the creator directory.",
    stage: "before",
    variants: [
      {
        name: "Default",
        preview: (
          <div className="w-56">
            <CreatorDirectoryCard
              id="jordan-lee"
              name="Jordan Lee"
              bio="Lifestyle and travel content creator working with software brands."
              niches={["Lifestyle", "Travel"]}
              coverColor="#FFD6A5"
            />
          </div>
        ),
      },
    ],
  },
  {
    name: "Listing card",
    level: "organisms",
    description: "Grey image placeholder, stock count, a bookmark toggle, deliverable tags, retail value, and an Add to cart CTA.",
    variants: [
      {
        name: "Default",
        preview: (
          <div className="w-72">
            <ListingCard
              slug="acme-tool"
              title="Acme Pro"
              description="Automate the busywork so your team can focus on the work that matters."
              deliverables={["IG Reel · 3mo"]}
              retailValue={180}
              slotsRemaining={4}
              totalSlots={10}
            />
          </div>
        ),
      },
      {
        name: "Sold out",
        preview: (
          <div className="w-72">
            <ListingCard
              slug="acme-tool"
              title="Acme Pro"
              description="Automate the busywork so your team can focus on the work that matters."
              deliverables={["IG Reel · 3mo"]}
              retailValue={180}
              slotsRemaining={0}
              totalSlots={10}
            />
          </div>
        ),
      },
    ],
  },
  {
    name: "Listing header",
    level: "organisms",
    description: "Brand logo, category, title, and description, centered — sits above the pay-with panel on a listing's detail page.",
    variants: [
      {
        name: "Default",
        preview: (
          <div className="w-full max-w-md">
            <ListingHeader slug="paper" brandName="Paper" title="Paper Pro" description="An AI-native design canvas where what you draw is real HTML and CSS, not a proprietary file format." category="Design" />
          </div>
        ),
      },
    ],
  },
  {
    name: "Pay with card",
    level: "organisms",
    description: "Deliverable picker with per-option pricing, a spots-remaining meter, Add to cart / Save actions, and a shareable product link.",
    variants: [
      {
        name: "Default",
        preview: (
          <div className="w-full max-w-md">
            <PayWithCard listing={MOCK_LISTINGS[0]} />
          </div>
        ),
      },
      {
        name: "Multiple options",
        preview: (
          <div className="w-full max-w-md">
            <PayWithCard listing={MOCK_LISTINGS[3]} />
          </div>
        ),
      },
      {
        name: "Sold out",
        preview: (
          <div className="w-full max-w-md">
            <PayWithCard listing={{ ...MOCK_LISTINGS[0], slotsRemaining: 0 }} />
          </div>
        ),
      },
    ],
  },
  {
    name: "Listings toolbar",
    level: "organisms",
    description: "Platform, price-tier, and access-duration filters, an in-stock toggle, a live result count, and a sort dropdown.",
    variants: [
      {
        name: "Default",
        preview: (
          <div className="w-full max-w-3xl">
            <ListingsToolbarDemo />
          </div>
        ),
      },
    ],
  },
  {
    name: "Listing grid",
    level: "organisms",
    description: "Responsive grid of listing cards with a built-in empty state.",
    variants: [
      {
        name: "Default",
        preview: (
          <div className="w-full max-w-4xl">
            <ListingGrid
              listings={[
                {
                  slug: "acme-tool",
                  brandName: "Acme",
                  title: "Acme Pro — Workflow Tool",
                  description: "Automate the busywork so your team can focus on the work that matters.",
                  deliverables: ["IG Reel · 3mo"],
                  retailValue: 180,
                  months: 3,
                  slotsRemaining: 4,
                  totalSlots: 10,
                  category: "AI Tools",
                },
                {
                  slug: "beta-app",
                  brandName: "Beta",
                  title: "Beta Team — Design Systems",
                  description: "Keep every screen in sync with a single source of design truth.",
                  deliverables: ["YouTube review · 6mo"],
                  retailValue: 288,
                  months: 6,
                  slotsRemaining: 0,
                  totalSlots: 12,
                  category: "Design",
                },
                {
                  slug: "gamma-ai",
                  brandName: "Gamma",
                  title: "Gamma Growth — Email Marketing",
                  description: "Automated flows and segmentation for creators launching a product.",
                  deliverables: ["X thread · 1mo"],
                  retailValue: 96,
                  months: 3,
                  slotsRemaining: 2,
                  totalSlots: 8,
                  category: "Marketing",
                },
              ]}
            />
          </div>
        ),
      },
      {
        name: "Empty",
        preview: (
          <div className="w-full max-w-3xl">
            <ListingGrid listings={[]} />
          </div>
        ),
      },
    ],
  },
  {
    name: "Promo banner",
    level: "organisms",
    description: "Full-width store banner — eyebrow pill, headline, and copy on a brand-tinted mesh gradient.",
    variants: [
      {
        name: "Default",
        preview: (
          <div className="w-full max-w-3xl">
            <PromoBanner
              eyebrow="No cash. No gifting. A real transaction."
              title="Pay with a post."
              description="Shop vetted software from real brands and pay with content. Add products to your cart, check out in one tap, and unlock access when your post goes live."
            />
          </div>
        ),
      },
    ],
  },
  {
    name: "Curated row",
    level: "organisms",
    description: "A titled, horizontally-scrollable row of listing cards — used for Featured and Recently added sections on the shop page.",
    variants: [
      {
        name: "Default",
        preview: (
          <div className="w-full max-w-4xl">
            <CuratedRow
              title="Featured products"
              subtitle="Hand-picked this week"
              listings={[
                {
                  slug: "acme-tool",
                  brandName: "Acme",
                  title: "Acme Pro — Workflow Tool",
                  description: "Automate the busywork so your team can focus on the work that matters.",
                  deliverables: ["IG Reel · 3mo"],
                  retailValue: 180,
                  months: 3,
                  slotsRemaining: 4,
                  totalSlots: 10,
                  category: "AI Tools",
                },
              ]}
            />
          </div>
        ),
      },
    ],
  },
  {
    name: "Top bar",
    level: "organisms",
    description: "Slim global header — logo and a cart icon with a live item-count badge.",
    variants: [
      {
        name: "Default",
        preview: (
          <div className="w-full max-w-lg">
            <TopBar cartCount={2} />
          </div>
        ),
      },
      {
        name: "Empty cart",
        preview: (
          <div className="w-full max-w-lg">
            <TopBar cartCount={0} />
          </div>
        ),
      },
    ],
  },
  {
    name: "Sidebar",
    level: "organisms",
    description: "Light-mode nav rail — search, role-filtered nav with Saved/Messages counts, an optional category slot, and an account block with a real sign-out control.",
    variants: [
      {
        name: "Creator",
        preview: (
          <div className="h-[600px]">
            <Sidebar role="CREATOR" activeHref="/explore" userName="Jordan Lee" savedCount={7} messagesCount={3} />
          </div>
        ),
      },
      {
        name: "Brand",
        preview: (
          <div className="h-[600px]">
            <Sidebar role="BRAND" activeHref="/applications" userName="Jordan Lee" />
          </div>
        ),
      },
      {
        name: "Both",
        preview: (
          <div className="h-[600px]">
            <Sidebar role="BOTH" activeHref="/shops" userName="Jordan Lee" />
          </div>
        ),
      },
    ],
  },
  {
    name: "Campaign card",
    level: "organisms",
    description: "One campaign in a history or list view — logo block, fill rate, delivery rate.",
    stage: "before",
    variants: [
      {
        name: "Default",
        preview: (
          <div className="w-80">
            <CampaignCard
              campaign={{
                id: "1",
                name: "Acme Tool campaign",
                planName: "Pro plan",
                createdAt: "2026-05-01",
                endedAt: "2026-06-01",
                totalSlots: 10,
                filled: 8,
                delivered: 6,
              }}
            />
          </div>
        ),
      },
    ],
  },
  {
    name: "Section card",
    level: "organisms",
    description: "Gradient icon-header content wrapper — was rebuilt separately 4 times before this one.",
    stage: "before",
    variants: [
      {
        name: "Default",
        preview: (
          <div className="w-96">
            <SectionCard
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97Z" />
                </svg>
              }
              title="Creator Brief"
              description="What the brand is asking for."
            >
              <p className="text-[14px] leading-relaxed text-gray-600">
                Post a 60-second walkthrough of the onboarding flow, highlighting the dashboard.
              </p>
            </SectionCard>
          </div>
        ),
      },
    ],
  },
  {
    name: "Key reveal",
    level: "organisms",
    description: "Masked → revealed access key, with copy-to-clipboard.",
    stage: "before",
    variants: [
      {
        name: "Default",
        preview: (
          <div className="w-96">
            <KeyReveal accessKey="ACME-9X7K-2QRT" />
          </div>
        ),
      },
    ],
  },
  {
    name: "Delivery form",
    level: "organisms",
    description: "Link submission for a shop — the fetch to the old /api/shops route was removed; this now simulates the round trip.",
    stage: "before",
    variants: [
      {
        name: "Default",
        preview: (
          <div className="w-96">
            <DeliveryFormDemo />
          </div>
        ),
      },
    ],
  },
  {
    name: "Shop card",
    level: "organisms",
    description: "Logo/gradient block, status badge, CTA — one shop in a creator's history.",
    stage: "before",
    variants: [
      {
        name: "Default",
        preview: (
          <div className="w-56">
            <ShopCard
              shop={{ id: "1", name: "Acme Tool", logoUrl: null, planName: "Pro plan", months: 3, status: "APPROVED" }}
            />
          </div>
        ),
      },
    ],
  },
  {
    name: "Swipe card",
    level: "organisms",
    description: "Draggable application card with swipe physics — drag left to pass, right to approve.",
    stage: "before",
    variants: [
      {
        name: "Default",
        preview: (
          <div className="relative h-[420px] w-80">
            <SwipeCard app={MOCK_APPLICATION} />
          </div>
        ),
      },
    ],
  },
  {
    name: "Card stack",
    level: "organisms",
    description: "Swipeable deck of applications for brand review — drag the top card to advance the queue.",
    stage: "before",
    variants: [
      {
        name: "Default",
        preview: <CardStackDemo />,
      },
    ],
  },
  {
    name: "Reviewed list",
    level: "organisms",
    description: "Collapsible list of already-reviewed applications.",
    stage: "before",
    variants: [
      {
        name: "Default",
        preview: (
          <div className="w-full max-w-md">
            <ReviewedList reviewed={MOCK_REVIEWED} />
          </div>
        ),
      },
    ],
  },
  {
    name: "Reviewed pill",
    level: "organisms",
    description: "Floating count pill (fixed to the viewport corner) that opens a bottom sheet — click it to see the real behavior.",
    stage: "before",
    variants: [
      {
        name: "Default",
        preview: <ReviewedPill reviewed={MOCK_REVIEWED} />,
      },
    ],
  },
  {
    name: "Profile header",
    level: "organisms",
    description: "Avatar, name, location, audience badge, and edit action.",
    stage: "before",
    variants: [
      {
        name: "Default",
        preview: (
          <div className="w-96">
            <ProfileHeaderDemo />
          </div>
        ),
      },
    ],
  },
  {
    name: "Services list",
    level: "organisms",
    description: "What a creator offers — a row of service tags.",
    stage: "before",
    variants: [
      {
        name: "Default",
        preview: (
          <div className="w-96">
            <ServicesList services={["Instagram Reels", "Stories", "YouTube Reviews", "Blog Posts"]} />
          </div>
        ),
      },
    ],
  },
  {
    name: "Social links",
    level: "organisms",
    description: "A creator's platform links — was 3 inconsistent versions across profile pages.",
    stage: "before",
    variants: [
      {
        name: "Default",
        preview: (
          <div className="w-96">
            <SocialLinks
              links={
                [
                  {
                    key: "instagramUrl",
                    label: "Instagram",
                    url: "https://instagram.com/ainojohansson",
                    icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="2" y="2" width="20" height="20" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
                        <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    ),
                  },
                  {
                    key: "tiktokUrl",
                    label: "TikTok",
                    url: "https://tiktok.com/@ainojohansson",
                    icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.3 6.3 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06Z" />
                      </svg>
                    ),
                  },
                ] satisfies SocialLink[]
              }
            />
          </div>
        ),
      },
    ],
  },
  {
    name: "Social capital card",
    level: "organisms",
    description:
      "The core transaction unit as a credit card — card number, holder, expiry, and social handles, with a floating X badge accent. Gently floats in place.",
    variants: [
      {
        name: "Default",
        preview: <SocialCapitalCard />,
      },
    ],
  },
  {
    name: "Hero section",
    level: "organisms",
    description:
      "The landing page hero — logo lockup, the social capital card, a Sign Up CTA, and the pitch copy underneath.",
    variants: [
      {
        name: "Default",
        preview: (
          <div className="w-full max-w-5xl bg-white">
            <HeroSection />
          </div>
        ),
      },
    ],
  },
  {
    name: "Navbar",
    level: "organisms",
    description: "Marketing nav with a full default header and a compact variant (links + hamburger only, no logo/CTA) for embedding inside a hero.",
    variants: [
      {
        name: "Default",
        preview: (
          <div className="w-full max-w-5xl bg-white">
            <Navbar />
          </div>
        ),
      },
      {
        name: "Compact",
        preview: (
          <div className="w-full max-w-5xl bg-white p-6">
            <Navbar variant="compact" />
          </div>
        ),
      },
    ],
  },
  {
    name: "Brand moment section",
    level: "organisms",
    description: "Minimal brand-awareness moment for the top of the brands page — large 3D chrome logo, a heading, and one line of copy.",
    variants: [
      {
        name: "Default",
        preview: (
          <div className="w-full max-w-5xl bg-white">
            <BrandMomentSection />
          </div>
        ),
      },
    ],
  },
  {
    name: "Feature grid section",
    level: "organisms",
    description: "Placeholder grid of #FAFAFA rounded blocks, sized to match the other brand-page panels — sits after the brand moment scroll section.",
    variants: [
      {
        name: "Default",
        preview: (
          <div className="w-full max-w-5xl bg-white">
            <FeatureGridSection />
          </div>
        ),
      },
    ],
  },
  {
    name: "Pricing section",
    level: "organisms",
    description: "Brand-page pricing — a custom/enterprise plan next to the $50/month self-serve subscription, sits after the feature grid.",
    variants: [
      {
        name: "Default",
        preview: (
          <div className="w-full max-w-5xl bg-white">
            <PricingSection />
          </div>
        ),
      },
    ],
  },
  {
    name: "Brand FAQ section",
    level: "organisms",
    description: "FAQ section for the brands page — each question sits in a #FAFAFA rounded box, same treatment as the creator-page FAQ section.",
    variants: [
      {
        name: "Default",
        preview: (
          <div className="w-full max-w-5xl bg-white">
            <BrandFAQSection />
          </div>
        ),
      },
    ],
  },
  {
    name: "Brand hero section",
    level: "organisms",
    description:
      "The brand-facing landing page hero — centered headline and CTA row, with a gradient panel holding the brand card image.",
    variants: [
      {
        name: "Default",
        preview: (
          <div className="w-full max-w-5xl bg-white">
            <BrandHeroSection />
          </div>
        ),
      },
    ],
  },
  {
    name: "How it works section",
    level: "organisms",
    description: "White section with three square-cornered brand-green poster cards walking through the browse → pitch → deliver flow.",
    variants: [
      {
        name: "Default",
        preview: (
          <div className="w-full max-w-5xl bg-white">
            <HowItWorksSection />
          </div>
        ),
      },
    ],
  },
  {
    name: "FAQ section",
    level: "organisms",
    description: "White section holding a stack of #FAFAFA rounded FAQ items in a centered column, matching the brand-page FAQ section.",
    variants: [
      {
        name: "Default",
        preview: (
          <div className="w-full max-w-5xl">
            <FAQSection />
          </div>
        ),
      },
    ],
  },
  {
    name: "Footer",
    level: "organisms",
    description: "Super-minimal footer — copyright, Privacy Policy link, and text-only X / LinkedIn links.",
    variants: [
      {
        name: "Default",
        preview: (
          <div className="w-full max-w-5xl">
            <Footer />
          </div>
        ),
      },
    ],
  },
  {
    name: "Conversation header",
    level: "organisms",
    description: "The active-thread header above the message log — avatar, name, detail line, and search/more actions.",
    variants: [
      { name: "Default", preview: <ConversationHeader name="Paper" detail="Paper Pro · Instagram carousel" image="/logos/paper.jpeg" online /> },
    ],
  },
  {
    name: "Message composer",
    level: "organisms",
    description: "The message input row — attach, emoji, and send actions, with Enter-to-send and a disabled empty state.",
    variants: [{ name: "Default", preview: <MessageComposerDemo /> }],
  },
  {
    name: "Thread list",
    level: "organisms",
    description: "The inbox sidebar — header with a new-message action, search, unread filter, and the scrollable conversation list.",
    fullBleed: true,
    variants: [{ name: "Default", preview: <ThreadListDemo /> }],
  }
];
