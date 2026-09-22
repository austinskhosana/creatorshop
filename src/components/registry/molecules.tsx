import { Input } from "@/components/atoms/Input";
import { CreatorCard, BrandCard } from "@/components/molecules/RoleSelectionCard";
import { EmptyState, EmptyStateWithActionDemo } from "@/components/molecules/EmptyState";
import { ErrorStateDemo } from "@/components/molecules/ErrorState";
import { FilterTabBarDemo } from "@/components/molecules/FilterTabBar";
import { StatTile } from "@/components/molecules/StatTile";
import { DeadlineTimer } from "@/components/molecules/DeadlineTimer";
import { CategoryNavListDemo } from "@/components/molecules/CategoryNavList";
import { PaginationDemo } from "@/components/molecules/Pagination";
import { LabeledField } from "@/components/molecules/LabeledField";
import { SelectableChipDemo } from "@/components/molecules/SelectableChip";
import { PricingCard } from "@/components/molecules/PricingCard";
import { BrandFAQItem } from "@/components/molecules/BrandFAQItem";
import { BrandCardVisual, BrandCardVisualFlip } from "@/components/molecules/BrandCardVisual";
import { BrandCard3D } from "@/components/molecules/BrandCard3D";
import { AccessTicket } from "@/components/molecules/AccessTicket";
import { PosterCard } from "@/components/molecules/PosterCard";
import { FAQItem } from "@/components/molecules/FAQItem";
import { ThreadAvatar } from "@/components/molecules/ThreadAvatar";
import { MessageBubble } from "@/components/molecules/MessageBubble";
import { PaymentOptionPreview, ThreadListItemPreview } from "./interactive-previews";
import type { RegistryEntry } from "./types";

export const moleculesEntries: RegistryEntry[] = [
  {
    name: "Access ticket",
    level: "molecules",
    description: "Double-sided access pass that auto-spins on its own axis; freezes flat when reduced motion is on.",
    variants: [
      {
        name: "Default",
        preview: <AccessTicket access="12 months" />,
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
    name: "Pagination",
    level: "molecules",
    description: "Prev/next arrows and numbered pages with ellipsis truncation for long ranges — paginates the store grid.",
    variants: [
      {
        name: "Default",
        preview: <PaginationDemo />,
      },
    ],
  },
  {
    name: "Category nav list",
    level: "molecules",
    description: "Vertical category list with live counts and a left-border active state — lives inside the sidebar on the shop page.",
    variants: [
      {
        name: "Default",
        preview: (
          <div className="w-56">
            <CategoryNavListDemo />
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
    name: "Payment option row",
    level: "molecules",
    description: "Radio-style row for choosing which deliverable to pay with — label, access length, and price.",
    variants: [
      {
        name: "Unselected",
        preview: (
          <div className="w-80">
            <PaymentOptionPreview />
          </div>
        ),
      },
      {
        name: "Selected",
        preview: (
          <div className="w-80">
            <PaymentOptionPreview selected />
          </div>
        ),
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
              answer="Browse software subscription listings, apply to shop, and if the brand approves, create and deliver the content to pay with a post. No cash involved."
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
              answer="Browse software subscription listings, apply to shop, and if the brand approves, create and deliver the content to pay with a post. No cash involved."
              defaultOpen
            />
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
    name: "Brand card visual (flip)",
    level: "molecules",
    description:
      "Archived: the same autoplaying flip/tilt/sheen treatment as SocialCapitalCard, applied to the brand card. Not used live — the brand hero's MeshGradientPanel already has a continuously animated shader background, and stacking an autoplaying flip on top read as too much competing motion. Kept for a case study.",
    variants: [
      {
        name: "Default",
        preview: <BrandCardVisualFlip />,
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
    name: "Thread avatar",
    level: "molecules",
    description: "A conversation's avatar — a brand's square logo or a person's circular initials, with an optional online dot.",
    variants: [
      { name: "Brand logo", preview: <ThreadAvatar name="Paper" image="/logos/paper.jpeg" online /> },
      { name: "Person, online", preview: <ThreadAvatar name="Mia at Creatorshop" online /> },
      { name: "Person, offline", preview: <ThreadAvatar name="Jordan Lee" /> },
    ],
  },
  {
    name: "Message bubble",
    level: "molecules",
    description: "Incoming and outgoing chat bubbles for a conversation thread, each with a sender/time caption.",
    variants: [
      {
        name: "Incoming",
        preview: (
          <MessageBubble
            text="We're excited to see how you make Paper your own."
            meta="Paper · 10:45 AM"
            senderName="Paper"
            senderImage="/logos/paper.jpeg"
          />
        ),
      },
      { name: "Outgoing", preview: <MessageBubble text="Sounds great, I'll send a draft this week!" meta="You · now" variant="outgoing" /> },
    ],
  },
  {
    name: "Thread list item",
    level: "molecules",
    description: "A single row in the inbox — avatar, name, timestamp, and a truncated preview with an unread indicator.",
    variants: [
      {
        name: "Unread, selected",
        preview: (
          <ThreadListItemPreview selected />
        ),
      },
      {
        name: "Read",
        preview: (
          <ThreadListItemPreview />
        ),
      },
    ],
  }
];
