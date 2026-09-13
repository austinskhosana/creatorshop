import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Textarea } from "@/components/atoms/Textarea";
import { Badge } from "@/components/atoms/Badge";
import { Avatar } from "@/components/atoms/Avatar";
import { Card } from "@/components/atoms/Card";
import { Skeleton, SkeletonText, SkeletonCard } from "@/components/atoms/Skeleton";
import { CreatorCard, BrandCard } from "@/components/molecules/RoleSelectionCard";
import { EmptyState, EmptyStateWithActionDemo } from "@/components/molecules/EmptyState";
import { ErrorStateDemo } from "@/components/molecules/ErrorState";
import { FilterTabBarDemo } from "@/components/molecules/FilterTabBar";
import { StatTile } from "@/components/molecules/StatTile";
import { DeadlineTimer } from "@/components/molecules/DeadlineTimer";
import { CategoryCard } from "@/components/organisms/CategoryCard";
import { CreatorDirectoryCard } from "@/components/organisms/CreatorDirectoryCard";
import { ListingCard } from "@/components/organisms/ListingCard";
import { Sidebar } from "@/components/organisms/Sidebar";
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
import { LabeledField } from "@/components/molecules/LabeledField";
import { SelectableChipDemo } from "@/components/molecules/SelectableChip";
import { ProfileHeaderDemo } from "@/components/organisms/ProfileHeader";
import { ServicesList } from "@/components/organisms/ServicesList";
import { SocialLinks } from "@/components/organisms/SocialLinks";
import type { SocialLink } from "@/components/organisms/SocialLinks";
import { SocialCapitalCard } from "@/components/organisms/SocialCapitalCard";
import { HeroSection } from "@/components/organisms/HeroSection";
import { BrandHeroSection } from "@/components/organisms/BrandHeroSection";
import { BrandMomentSection } from "@/components/organisms/BrandMomentSection";
import { FeatureGridSection } from "@/components/organisms/FeatureGridSection";
import { PricingCard } from "@/components/molecules/PricingCard";
import { PricingSection } from "@/components/organisms/PricingSection";
import { BrandFAQSection } from "@/components/organisms/BrandFAQSection";
import { BrandFAQItem } from "@/components/molecules/BrandFAQItem";
import { BrandCardVisual } from "@/components/molecules/BrandCardVisual";
import { BrandCard3D } from "@/components/molecules/BrandCard3D";
import { Navbar } from "@/components/organisms/Navbar";
import { LogoMark } from "@/components/atoms/LogoMark";
import { Logo3D } from "@/components/atoms/Logo3D";
import { PixelTrail } from "@/components/atoms/PixelTrail";
import { MeshGradientPanel } from "@/components/atoms/MeshGradientPanel";
import { Fire } from "@/components/atoms/Fire";
import { AsciiFlame } from "@/components/atoms/AsciiFlame";
import { LocationTime } from "@/components/atoms/LocationTime";
import { ScrollIndicator } from "@/components/atoms/ScrollIndicator";
import { PosterCard } from "@/components/molecules/PosterCard";
import { HowItWorksSection } from "@/components/organisms/HowItWorksSection";
import { FAQItem } from "@/components/molecules/FAQItem";
import { FAQSection } from "@/components/organisms/FAQSection";
import { Footer } from "@/components/organisms/Footer";

export type AtomicLevel = "atoms" | "molecules" | "organisms" | "templates" | "pages";

export interface RegistryVariant {
  name: string;
  preview: React.ReactNode;
}

export interface RegistryEntry {
  name: string;
  level: AtomicLevel;
  description: string;
  /** "before" = ported as-is from archive/pre-atomic-rebuild, not yet redesigned. Omit once redesigned. */
  stage?: "before";
  variants: RegistryVariant[];
}

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

// Add one entry here each time a new component is built —
// it shows up in /design-system automatically. Each variant becomes
// its own page under /design-system/{component}/{variant}.
export const registry: RegistryEntry[] = [
  {
    name: "Button",
    level: "atoms",
    description:
      "Primary (lime accent), dark, secondary, and danger variants in three sizes — plus loading, full-width, and icon-slot states.",
    variants: [
      {
        name: "Primary",
        preview: (
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary" size="sm">Primary</Button>
            <Button variant="primary" size="md">Primary</Button>
            <Button variant="primary" size="lg">Primary</Button>
          </div>
        ),
      },
      {
        name: "Dark",
        preview: (
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="dark" size="sm">Dark</Button>
            <Button variant="dark" size="md">Dark</Button>
            <Button variant="dark" size="lg">Dark</Button>
          </div>
        ),
      },
      {
        name: "Secondary",
        preview: (
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="secondary" size="sm">Secondary</Button>
            <Button variant="secondary" size="md">Secondary</Button>
            <Button variant="secondary" size="lg">Secondary</Button>
          </div>
        ),
      },
      {
        name: "Danger",
        preview: (
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="danger" size="sm">Danger</Button>
            <Button variant="danger" size="md">Danger</Button>
            <Button variant="danger" size="lg">Danger</Button>
          </div>
        ),
      },
      {
        name: "Loading",
        preview: (
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary" loading>Primary</Button>
            <Button variant="dark" loading>Dark</Button>
            <Button variant="secondary" loading>Secondary</Button>
            <Button variant="danger" loading>Danger</Button>
          </div>
        ),
      },
      {
        name: "Full width",
        preview: (
          <div className="w-full max-w-sm space-y-3">
            <Button variant="primary" fullWidth>Continue</Button>
            <Button variant="secondary" fullWidth>Cancel</Button>
          </div>
        ),
      },
      {
        name: "With icons",
        preview: (
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="dark"
              iconLeft={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              }
            >
              Add item
            </Button>
            <Button
              variant="secondary"
              iconRight={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
            >
              Continue
            </Button>
          </div>
        ),
      },
      {
        name: "Disabled",
        preview: (
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary" disabled>Primary</Button>
            <Button variant="dark" disabled>Dark</Button>
            <Button variant="secondary" disabled>Secondary</Button>
            <Button variant="danger" disabled>Danger</Button>
          </div>
        ),
      },
      {
        name: "Pill",
        preview: (
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="dark" size="sm" pill>Sign Up</Button>
            <Button variant="primary" size="md" pill>Get Started</Button>
          </div>
        ),
      },
    ],
  },
  {
    name: "Input",
    level: "atoms",
    description: "Labeled text field with hint, error, and icon-slot states.",
    stage: "before",
    variants: [
      {
        name: "Default",
        preview: (
          <div className="w-full max-w-xs">
            <Input label="Email" placeholder="you@example.com" />
          </div>
        ),
      },
      {
        name: "With hint",
        preview: (
          <div className="w-full max-w-xs">
            <Input label="Display name" placeholder="Austin" hint="Shown on your public profile." />
          </div>
        ),
      },
      {
        name: "Error",
        preview: (
          <div className="w-full max-w-xs">
            <Input label="Email" defaultValue="not-an-email" error="Enter a valid email address." />
          </div>
        ),
      },
      {
        name: "With icons",
        preview: (
          <div className="w-full max-w-xs">
            <Input
              label="Website"
              placeholder="yoursite.com"
              iconLeft={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                  <path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18" stroke="currentColor" strokeWidth="2" />
                </svg>
              }
            />
          </div>
        ),
      },
      {
        name: "Disabled",
        preview: (
          <div className="w-full max-w-xs">
            <Input label="Email" defaultValue="you@example.com" disabled />
          </div>
        ),
      },
    ],
  },
  {
    name: "Textarea",
    level: "atoms",
    description: "Labeled textarea with hint, error, and character-counter states.",
    stage: "before",
    variants: [
      {
        name: "Default",
        preview: (
          <div className="w-full max-w-xs">
            <Textarea label="Bio" placeholder="Tell brands about yourself" rows={3} />
          </div>
        ),
      },
      {
        name: "With counter",
        preview: (
          <div className="w-full max-w-xs">
            <Textarea
              label="Pitch"
              placeholder="What will you create?"
              rows={3}
              maxChars={240}
              currentLength={210}
            />
          </div>
        ),
      },
      {
        name: "Error",
        preview: (
          <div className="w-full max-w-xs">
            <Textarea label="Brief" rows={3} defaultValue="" error="A brief is required." />
          </div>
        ),
      },
    ],
  },
  {
    name: "Badge",
    level: "atoms",
    description: "Shop-status colours plus count, tag, and stat variants.",
    stage: "before",
    variants: [
      {
        name: "Shop status",
        preview: (
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="PENDING" label="Pending" />
            <Badge variant="APPROVED" label="Approved" />
            <Badge variant="DENIED" label="Denied" />
            <Badge variant="DELIVERED" label="Delivered" />
            <Badge variant="COMPLETED" label="Completed" />
            <Badge variant="REVOKED" label="Revoked" />
          </div>
        ),
      },
      {
        name: "Generic",
        preview: (
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="count" label="12" />
            <Badge variant="tag" label="Design" />
            <Badge variant="stat" label="1.2k views" />
            <Badge variant="default" label="Default" />
          </div>
        ),
      },
    ],
  },
  {
    name: "Avatar",
    level: "atoms",
    description: "Circular avatar with initials fallback, four sizes.",
    stage: "before",
    variants: [
      {
        name: "Sizes",
        preview: (
          <div className="flex flex-wrap items-end gap-3">
            <Avatar name="Austin Skhosana" size="sm" />
            <Avatar name="Austin Skhosana" size="md" />
            <Avatar name="Austin Skhosana" size="lg" />
            <Avatar name="Austin Skhosana" size="xl" />
          </div>
        ),
      },
      {
        name: "Fallback",
        preview: (
          <div className="flex flex-wrap items-center gap-3">
            <Avatar name="Jordan Lee" />
            <Avatar name="Priya" />
            <Avatar />
          </div>
        ),
      },
    ],
  },
  {
    name: "Card",
    level: "atoms",
    description: "Base surface wrapper, default or gradient, four padding sizes.",
    stage: "before",
    variants: [
      {
        name: "Default",
        preview: (
          <Card className="w-64 text-sm text-neutral-600">Default card content.</Card>
        ),
      },
      {
        name: "Gradient",
        preview: (
          <Card variant="gradient" className="w-64 text-sm text-neutral-800">
            Gradient card content.
          </Card>
        ),
      },
      {
        name: "Padding",
        preview: (
          <div className="flex flex-wrap items-start gap-3">
            <Card padding="sm" className="w-40 text-xs text-neutral-600">sm</Card>
            <Card padding="md" className="w-40 text-xs text-neutral-600">md</Card>
            <Card padding="lg" className="w-40 text-xs text-neutral-600">lg</Card>
          </div>
        ),
      },
    ],
  },
  {
    name: "Logo mark",
    level: "atoms",
    description: "The Creatorshop node symbol — lime-on-black for use on light backgrounds, black-on-lime for use on lime surfaces like the social capital card.",
    variants: [
      {
        name: "On white",
        preview: (
          <div className="flex items-center gap-2.5">
            <LogoMark variant="onWhite" size={36} />
            <span className="text-lg font-semibold tracking-tight text-neutral-900">Creatorshop</span>
          </div>
        ),
      },
      {
        name: "On lime",
        preview: (
          <div className="flex items-center gap-2.5 rounded-xl bg-[#A3FF38] p-4">
            <LogoMark variant="onLime" size={36} />
            <span className="text-sm font-medium tracking-[0.08em] text-[#0F0F0F]">CREATORSHOP</span>
          </div>
        ),
      },
    ],
  },
  {
    name: "3D chrome logo",
    level: "atoms",
    description: "The Creatorshop symbol rendered as an interactive 3D chrome model (react-three-fiber) — tilts toward the cursor with a slow idle spin.",
    variants: [
      {
        name: "Default",
        preview: <Logo3D className="h-32 w-32" />,
      },
    ],
  },
  {
    name: "Pixel trail",
    level: "atoms",
    description: "Cursor-triggered grid of pixels that flash in and fade out along the trail — from the Fancy Components registry, used as the hero's background interaction.",
    variants: [
      {
        name: "Default",
        preview: (
          <div className="relative h-64 w-full max-w-xl overflow-hidden rounded-xl border border-neutral-200 bg-white">
            <PixelTrail pixelSize={24} fadeDuration={600} pixelClassName="bg-black" />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
                Move your cursor here
              </span>
            </div>
          </div>
        ),
      },
    ],
  },
  {
    name: "Fire",
    level: "atoms",
    description: "Doom-fire-style ASCII flame — black glyph shades propagating on brand green, from the Brand Engineering Kit. Used behind the \"Ditch the subscription\" section.",
    variants: [
      {
        name: "Default",
        preview: (
          <div className="relative h-64 w-full max-w-xl overflow-hidden rounded-xl">
            <Fire background="#a2ff38" rows={64} widthPercent={70} className="h-full w-full" />
          </div>
        ),
      },
    ],
  },
  {
    name: "Ascii flame",
    level: "atoms",
    description: "A single shaped flame silhouette (main tongue + two side licks) rendered as monospace glyphs — used above the copy in the \"Ditch the subscription\" section, in place of a static logo.",
    variants: [
      {
        name: "Default",
        preview: (
          <div className="relative h-36 w-28 overflow-hidden rounded-xl">
            <AsciiFlame background="#a2ff38" className="h-full w-full" />
          </div>
        ),
      },
    ],
  },
  {
    name: "Location time",
    level: "atoms",
    description: "Detects the visitor's own timezone and shows their local city and time in Geist Mono — used top-right of the hero heading.",
    variants: [
      {
        name: "Default",
        preview: (
          <div className="rounded-xl border border-neutral-200 bg-white p-6">
            <LocationTime />
          </div>
        ),
      },
    ],
  },
  {
    name: "Scroll indicator",
    level: "atoms",
    description: "Circular down-arrow button that scrolls the page down one viewport — used bottom-right of the hero heading.",
    variants: [
      {
        name: "Default",
        preview: (
          <div className="rounded-xl border border-neutral-200 bg-white p-6">
            <ScrollIndicator />
          </div>
        ),
      },
    ],
  },
  {
    name: "Role selection card",
    level: "molecules",
    description: "3D-tilt onboarding picker for Creator or Brand — was two duplicate files with identical tilt logic.",
    stage: "before",
    variants: [
      {
        name: "Creator",
        preview: <CreatorCard />,
      },
      {
        name: "Brand",
        preview: <BrandCard />,
      },
      {
        name: "Selected",
        preview: (
          <div className="flex flex-wrap gap-6">
            <CreatorCard isSelected />
            <BrandCard />
          </div>
        ),
      },
    ],
  },
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
    description: "Logo, plan/post-count badge, and CTA with a slots-remaining state.",
    stage: "before",
    variants: [
      {
        name: "Default",
        preview: (
          <div className="w-56">
            <ListingCard
              slug="acme-tool"
              name="Acme Tool"
              planName="Pro plan"
              months={3}
              postsRequired={2}
              slotsRemaining={4}
            />
          </div>
        ),
      },
      {
        name: "Full",
        preview: (
          <div className="w-56">
            <ListingCard
              slug="acme-tool"
              name="Acme Tool"
              planName="Pro plan"
              months={3}
              postsRequired={2}
              slotsRemaining={0}
            />
          </div>
        ),
      },
    ],
  },
  {
    name: "Sidebar",
    level: "organisms",
    description: "Nav rail, role-filtered items, and account block — Clerk dependency removed, role/user now passed as props.",
    stage: "before",
    variants: [
      {
        name: "Creator",
        preview: <Sidebar role="CREATOR" activeHref="/explore" userName="Jordan Lee" />,
      },
      {
        name: "Brand",
        preview: <Sidebar role="BRAND" activeHref="/applications" userName="Jordan Lee" />,
      },
      {
        name: "Both",
        preview: <Sidebar role="BOTH" activeHref="/shops" userName="Jordan Lee" />,
      },
    ],
  },
  {
    name: "Skeleton",
    level: "atoms",
    description: "Loading placeholder — base pulse block, multi-line text, and a full card shape.",
    stage: "before",
    variants: [
      {
        name: "Base",
        preview: (
          <div className="flex flex-wrap items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-5 w-32" />
          </div>
        ),
      },
      {
        name: "Text",
        preview: (
          <div className="w-64">
            <SkeletonText lines={3} />
          </div>
        ),
      },
      {
        name: "Card",
        preview: (
          <div className="w-56">
            <SkeletonCard />
          </div>
        ),
      },
    ],
  },
  {
    name: "Empty state",
    level: "molecules",
    description: "Icon + title + description, with an optional action button.",
    stage: "before",
    variants: [
      {
        name: "Default",
        preview: (
          <div className="w-full max-w-sm">
            <EmptyState title="No shops yet" description="Apply to a listing to start your first shop." />
          </div>
        ),
      },
      {
        name: "With action",
        preview: (
          <div className="w-full max-w-sm">
            <EmptyStateWithActionDemo />
          </div>
        ),
      },
    ],
  },
  {
    name: "Error state",
    level: "molecules",
    description: "Icon + message + retry button, the default content for every route's error page.",
    stage: "before",
    variants: [
      {
        name: "Default",
        preview: (
          <div className="w-full max-w-sm">
            <ErrorStateDemo />
          </div>
        ),
      },
    ],
  },
  {
    name: "Filter tab bar",
    level: "molecules",
    description: "Animated sliding-pill tabs — extracted from 4 near-identical inline copies into one controlled component.",
    stage: "before",
    variants: [
      {
        name: "Default",
        preview: <FilterTabBarDemo />,
      },
    ],
  },
  {
    name: "Stat tile",
    level: "molecules",
    description: "Number + label, optionally with a sub-line — for campaign stats.",
    stage: "before",
    variants: [
      {
        name: "Default",
        preview: (
          <div className="flex w-full max-w-md gap-3">
            <StatTile label="Total campaigns" value={12} />
            <StatTile label="Creators reached" value={34} sub="of 40 slots" />
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
    name: "Deadline timer",
    level: "molecules",
    description: "Countdown to a shop's delivery deadline — colour shifts as it gets urgent.",
    stage: "before",
    variants: [
      {
        name: "On track",
        preview: (
          <div className="w-72">
            <DeadlineTimer deadline={new Date(Date.now() + 5 * 86400000)} />
          </div>
        ),
      },
      {
        name: "Urgent",
        preview: (
          <div className="w-72">
            <DeadlineTimer deadline={new Date(Date.now() + 20 * 3600000)} />
          </div>
        ),
      },
      {
        name: "Expired",
        preview: (
          <div className="w-72">
            <DeadlineTimer deadline={new Date(Date.now() - 3600000)} />
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
    name: "Labeled field",
    level: "molecules",
    description: "Label + optional hint, wrapping any input — was rebuilt separately 4 times as an inline `Field` helper.",
    stage: "before",
    variants: [
      {
        name: "Default",
        preview: (
          <div className="w-72">
            <LabeledField label="Display name">
              <Input placeholder="Your name or handle" />
            </LabeledField>
          </div>
        ),
      },
      {
        name: "With hint",
        preview: (
          <div className="w-72">
            <LabeledField label="Services" hint="press Enter to add">
              <Input placeholder="e.g. Instagram Reels…" />
            </LabeledField>
          </div>
        ),
      },
    ],
  },
  {
    name: "Selectable chip",
    level: "molecules",
    description: "Toggleable pill for niches, platforms, deliverables — two colour tones, click to toggle.",
    stage: "before",
    variants: [
      {
        name: "Dark",
        preview: <SelectableChipDemo tone="dark" />,
      },
      {
        name: "Lime",
        preview: <SelectableChipDemo tone="lime" />,
      },
    ],
  },
  {
    name: "Poster card",
    level: "molecules",
    description: "Square-cornered brand-green tile with a step number, pixel-font headline, and mono description — used in the \"How it works\" section.",
    variants: [
      {
        name: "Default",
        preview: (
          <div className="w-80">
            <PosterCard
              step="01"
              art={`    #####
  ###   ###
 ##       ##
 ##       ##
 ##       ##
  ###   ###
    #####
       ##
        ##
         ###`}
              title={"BROWSE THE\nDROP"}
              description={"Explore software\nlistings from brands\nlooking for creators."}
            />
          </div>
        ),
      },
    ],
  },
  {
    name: "FAQ item",
    level: "molecules",
    description: "Click-to-expand question/answer row in a #FAFAFA rounded box, matching the brand-page FAQ item.",
    variants: [
      {
        name: "Default",
        preview: (
          <div className="w-96 bg-white p-3">
            <FAQItem
              question="How does Creatorshop actually work?"
              answer="Browse a software drop, pitch your reach, and if the brand's into it, you create the content and deliver it. Access unlocked — no cash involved."
            />
          </div>
        ),
      },
      {
        name: "Open",
        preview: (
          <div className="w-96 bg-white p-3">
            <FAQItem
              question="How does Creatorshop actually work?"
              answer="Browse a software drop, pitch your reach, and if the brand's into it, you create the content and deliver it. Access unlocked — no cash involved."
              defaultOpen
            />
          </div>
        ),
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
    name: "Brand card visual",
    level: "molecules",
    description: "The brand card image with the same mouse-tilt hover as the creator SocialCapitalCard.",
    variants: [
      {
        name: "Default",
        preview: <BrandCardVisual />,
      },
    ],
  },
  {
    name: "Brand card 3D",
    level: "molecules",
    description:
      "The brand card rendered as a real 3D object (react-three-fiber) — the card image is a texture on a thin extruded box, with physical materials and environment lighting, tilting toward the cursor with a gentle idle float. Used in the brand hero in place of the flat CSS-tilt card.",
    variants: [
      {
        name: "Default",
        preview: <BrandCard3D />,
      },
    ],
  },
  {
    name: "Mesh gradient panel",
    level: "atoms",
    description: "Animated WebGL mesh-gradient panel in the brand palette (lime + white) — used as a soft, moving background behind hero visuals.",
    variants: [
      {
        name: "Default",
        preview: (
          <MeshGradientPanel className="flex h-64 w-full max-w-5xl items-center justify-center">
            <span className="text-sm text-neutral-500">Content sits on top</span>
          </MeshGradientPanel>
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
    name: "Pricing card",
    level: "molecules",
    description: "Badge, description, price, feature checklist, and CTA — the plain variant is a white bordered card, the featured variant wraps in the header's metallic shader panel.",
    variants: [
      {
        name: "Default",
        preview: (
          <div className="w-80">
            <PricingCard
              badgeIcon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                  <circle cx="12" cy="12" r="3" fill="currentColor" />
                </svg>
              }
              badgeLabel="Custom"
              description="We run your drop end to end for you."
              price="Custom"
              features={["Dedicated campaign manager", "Full pitch review on your behalf"]}
              buttonLabel="Contact us"
              buttonVariant="secondary"
            />
          </div>
        ),
      },
      {
        name: "Featured",
        preview: (
          <div className="w-80">
            <PricingCard
              badgeIcon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z" />
                </svg>
              }
              badgeLabel="Subscription"
              description="List your own drops and manage delivery yourself."
              price="$50"
              priceSuffix="/month"
              features={["Unlimited drops", "Pay in access, not cash"]}
              buttonLabel="Get started"
              buttonVariant="dark"
              featured
            />
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
    name: "Brand FAQ item",
    level: "molecules",
    description: "Accordion FAQ row in a #FAFAFA rounded box, matching the brand-page grid blocks.",
    variants: [
      {
        name: "Default",
        preview: (
          <div className="w-full max-w-md">
            <BrandFAQItem
              question="How is this different from an affiliate program?"
              answer="No commissions, no cash payouts. Creators get access to your software in exchange for content."
            />
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
];

export const ATOMIC_LEVELS: { key: AtomicLevel; label: string }[] = [
  { key: "atoms", label: "Atoms" },
  { key: "molecules", label: "Molecules" },
  { key: "organisms", label: "Organisms" },
  { key: "templates", label: "Templates" },
  { key: "pages", label: "Pages" },
];

export interface PlannedComponent {
  name: string;
  level: AtomicLevel;
  note: string;
}

// Not built yet in the new library — grounded in an exhaustive audit of
// archive/pre-atomic-rebuild (the actual prior app, not just the plan doc),
// so the design-system directory doubles as a checklist of what to
// redesign. Where the old build duplicated something 2-4x across files,
// there's one entry here, not one per duplicate — the point is to build
// it once, well. Move an entry out of here and into `registry` above
// once it's built.
export const roadmap: PlannedComponent[] = [
  // Atoms
  { name: "Platform icon", level: "atoms", note: "Instagram, TikTok, YouTube, X, LinkedIn" },

  // Molecules
  { name: "Swipe action bar", level: "molecules", note: "Deny / Undo / Approve row for the swipe review flow" },
  { name: "Submission row", level: "molecules", note: "Avatar, platform, and status in a list" },

  // Organisms
  { name: "Payment card visual", level: "organisms", note: "Decorative bank-card visual for a listing's plan — was 3 inconsistent versions" },
  { name: "Listing header", level: "organisms", note: "Logo, name, plan details on a listing page" },
  { name: "Apply form", level: "organisms", note: "Deliverable picker + application form on a listing page" },
  { name: "Campaign option card", level: "organisms", note: "3D-tilt hub tile — was duplicated identically in two pages" },
  { name: "Campaign form", level: "organisms", note: "Brief, deliverables, reward, and deadline" },
  { name: "Listing row", level: "organisms", note: "A brand's own listing in a management list" },
  { name: "Key top-up panel", level: "organisms", note: "Add more access keys to a live listing" },
  { name: "Submissions table", level: "organisms", note: "Tabbed grid of creator applications for a campaign" },
  { name: "Submission drawer", level: "organisms", note: "Full post detail + approve/reject, slides over the table" },
  { name: "Campaign stats panel", level: "organisms", note: "Stat tiles for a campaign's history view" },

  // Templates
  { name: "App shell", level: "templates", note: "Sidebar + scrollable content — was copy-pasted across 7+ layout files" },
  { name: "Auth shell", level: "templates", note: "Centered layout for sign-in / onboarding" },
  { name: "Swipe review layout", level: "templates", note: "Full-screen card stack + action bar + progress" },
  { name: "Public profile layout", level: "templates", note: "Header + content sections" },
  { name: "Listing detail layout", level: "templates", note: "Header + apply panel" },
  { name: "List + detail drawer", level: "templates", note: "Master list with a slide-over panel" },

  // Pages
  { name: "Sign up / landing", level: "pages", note: "/ — currently just redirects or shows sign-up, no marketing content" },
  { name: "Sign in", level: "pages", note: "/sign-in" },
  { name: "Onboarding", level: "pages", note: "/onboarding" },
  { name: "Explore software", level: "pages", note: "/explore" },
  { name: "Software listing", level: "pages", note: "/software/[slug]" },
  { name: "My shops", level: "pages", note: "/shops" },
  { name: "Shop delivery", level: "pages", note: "/shops/[id]" },
  { name: "Applications inbox (swipe review)", level: "pages", note: "/applications" },
  { name: "Creator profile (edit)", level: "pages", note: "/profile" },
  { name: "Creator profile (public)", level: "pages", note: "/profile/[username] — was also duplicated as /influencers/[id] with mock data" },
  { name: "Creator directory", level: "pages", note: "/influencers — public list, separate from /profile" },
  { name: "Brand profile (edit)", level: "pages", note: "/brand-profile" },
  { name: "Brand profile setup", level: "pages", note: "/brand-profile/setup" },
  { name: "Campaigns hub", level: "pages", note: "/campaigns and /campaigns/list — two near-identical hub screens, worth merging into one" },
  { name: "Campaign creation", level: "pages", note: "/campaigns/new" },
  { name: "Campaign listings management", level: "pages", note: "/campaigns/listings" },
  { name: "Campaign submissions", level: "pages", note: "/campaigns/submissions" },
  { name: "Campaign history", level: "pages", note: "/campaigns/history" },
  { name: "Billing / admin", level: "pages", note: "/admin — mocked plan, payment method, billing history" },
  { name: "Shop catalog (legacy?)", level: "pages", note: "/shop, /shop/[category], /shop/[category]/[id] — hardcoded mock data, looks superseded by /explore" },
];
