import { WishCardDemo } from "@/components/molecules/WishCard";
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
import { DropdownDemo } from "@/components/molecules/Dropdown";
import { PricingCard } from "@/components/molecules/PricingCard";
import { BrandFAQItem } from "@/components/molecules/BrandFAQItem";
import { BrandCardVisual, BrandCardVisualFlip } from "@/components/molecules/BrandCardVisual";
import { BrandCard3D } from "@/components/molecules/BrandCard3D";
import { AccessTicket } from "@/components/molecules/AccessTicket";
import { TicketCard } from "@/components/molecules/TicketCard";
import { PosterCard } from "@/components/molecules/PosterCard";
import { FAQItem } from "@/components/molecules/FAQItem";
import { ThreadAvatar } from "@/components/molecules/ThreadAvatar";
import { MessageBubble } from "@/components/molecules/MessageBubble";
import { PaymentOptionPreview, ThreadListItemPreview } from "./interactive-previews";
import { StatusPill } from "@/components/molecules/StatusPill";
import { StockMeter } from "@/components/molecules/StockMeter";
import { PageHeader } from "@/components/molecules/PageHeader";
import { NoticeBanner } from "@/components/molecules/NoticeBanner";
import { ActionMenuDemo, CampaignPickerDemo, ConfirmDialogDemo, IntroMessageFieldDemo, PriceTierPickerDemo, RadioCardDemo, SendModePickerDemo } from "./brand-previews";
import { ShopperPitchDetails } from "@/components/molecules/ShopperPitchDetails";
import { CreditCardIcon } from "@heroicons/react/24/outline";
import { SHOPPERS, DEMO_PRODUCTS } from "@/lib/mock-brand";
import { FacePile } from "@/components/molecules/FacePile";
import { ReviewQueueCard } from "@/components/molecules/ReviewQueueCard";
import { AttentionStats } from "@/components/molecules/AttentionStats";
import { AddItemCard } from "@/components/molecules/AddItemCard";
import { ToastDemo, ToastPreview } from "@/components/molecules/Toast";
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
    name: "Ticket card",
    level: "molecules",
    description: "Ticket-cut banner shared by the shop promo and Make a wish — shader face with mono eyebrow and copy, masked notches, a perforated tear line, and a stub with one field, optional art, a barcode, and a serial. Stacks into a boarding-pass layout on mobile.",
    variants: [
      {
        name: "Default",
        preview: (
          <div className="w-full max-w-3xl">
            <TicketCard
              icon={<CreditCardIcon strokeWidth={1.75} />}
              eyebrow="Fictional event"
              title="Admit the bearer."
              description="Any face content goes here; pass children to add a form or actions below the copy."
              admit="Admit one"
              field={{ label: "Price", value: "1 post" }}
              serial="NO. 000042"
            />
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
    description: "Icon + title + description, with an optional action button. Pass `illustration` to replace the icon and its ghost cards with bespoke art, as the cart page does with the dithered empty cart.",
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
  },
  {
    name: "Radio card",
    level: "molecules",
    description: "One bordered option in a radio group, with an optional description and right-aligned detail. A native radio underneath, so arrow keys move between cards.",
    variants: [{ name: "Default", preview: <RadioCardDemo /> }],
  },
  {
    name: "Send mode picker",
    level: "molecules",
    description: "What a right swipe does with a brand's intro: review each one, or send automatically. Shared by the intro modal and Settings → Intro message.",
    variants: [{ name: "Default", preview: <SendModePickerDemo /> }],
  },
  {
    name: "Campaign picker",
    level: "molecules",
    description: "Which live product page goes out with a brand's intro, with spots left on each — or \"Just the intro\". Links to creating a product page when nothing is live.",
    variants: [
      { name: "Live campaigns", preview: <CampaignPickerDemo /> },
      { name: "Nothing live", preview: <CampaignPickerDemo empty /> },
    ],
  },
  {
    name: "Intro message field",
    level: "molecules",
    description: "A brand's swipe-right intro as a template. \"First name\" drops the {first name} token at the caret, and the preview shows the thread as one real creator reads it.",
    variants: [
      { name: "Intro only", preview: <IntroMessageFieldDemo /> },
      { name: "With campaign", preview: <IntroMessageFieldDemo withCampaign /> },
    ],
  },
  {
    name: "Dropdown",
    level: "molecules",
    description: "Custom listbox select used for store filters and sorting. Opens anchored to its trigger, with keyboard navigation and typeahead.",
    variants: [
      { name: "Default", preview: <DropdownDemo /> },
      { name: "Disabled", preview: <DropdownDemo disabled /> },
    ],
  },
  {
    name: "Wish card",
    level: "molecules",
    description: "A brand on The Genie Index, built like a listing card — logo and website link up top, name and description, then its category tag and the wish toggle.",
    variants: [
      { name: "Not wished", preview: <WishCardDemo /> },
      { name: "Wished", preview: <WishCardDemo wished /> },
    ],
  },
  {
    name: "Status pill",
    level: "molecules",
    description: "Bordered pill with a coloured dot — the status mark on shop and product cards. Tones: waiting, success, progress, danger, muted, neutral.",
    variants: [
      {
        name: "Tones",
        preview: (
          <div className="flex flex-wrap gap-2">
            <StatusPill tone="success" label="Live" />
            <StatusPill tone="waiting" label="Awaiting post" />
            <StatusPill tone="progress" label="Proof to review" />
            <StatusPill tone="danger" label="Post overdue" />
            <StatusPill tone="muted" label="Paused" />
            <StatusPill tone="neutral" label="Draft" />
          </div>
        ),
      },
    ],
  },
  {
    name: "Price tier picker",
    level: "molecules",
    description: "A product page's tiers as size-style radio options — the content type, then its access length and retail value kept apart.",
    variants: [{ name: "Default", preview: <PriceTierPickerDemo /> }],
  },
  {
    name: "Stock meter",
    level: "molecules",
    description: "“X of Y spots left” over a thin sold bar, with Almost sold out / Sold out callouts.",
    variants: [
      { name: "In stock", preview: <div className="w-64"><StockMeter remaining={10} total={12} /></div> },
      { name: "Almost sold out", preview: <div className="w-64"><StockMeter remaining={1} total={8} /></div> },
      { name: "Sold out", preview: <div className="w-64"><StockMeter remaining={0} total={4} /></div> },
    ],
  },
  {
    name: "Page header",
    level: "molecules",
    description: "Bold page title, one quiet line, and optional right-aligned actions — the opening of every creator and brand screen.",
    variants: [{ name: "Default", preview: <div className="w-full max-w-3xl"><PageHeader title="Shops" description="Every creator you've approved." /></div> }],
  },
  {
    name: "Notice banner",
    level: "molecules",
    description: "Grey account notice with an icon, explanation, and one fix — used for subscription and verification blockers.",
    variants: [
      {
        name: "Default",
        preview: (
          <div className="w-full max-w-2xl">
            <NoticeBanner icon={<CreditCardIcon className="size-5" strokeWidth={1.75} />} title="Subscribe to publish" description="Build product pages now. They go live once your $50/month subscription is active." action={{ label: "Subscribe", href: "#" }} />
          </div>
        ),
      },
    ],
  },
  {
    name: "Action menu",
    level: "molecules",
    description: "A ⋯ trigger on the shadcn DropdownMenu (Base UI): portalled, flips to stay on screen, typeahead and arrow keys, destructive items below a divider.",
    variants: [
      {
        name: "Default",
        preview: <ActionMenuDemo />,
      },
    ],
  },
  {
    name: "Shopper pitch details",
    level: "molecules",
    description: "Rating, completed shops, example posts and the chosen price tier — the brand-only additions inside a creator profile card during review.",
    variants: [
      { name: "With price tier", preview: <div className="w-full max-w-xl"><ShopperPitchDetails shopper={SHOPPERS[1]} tier={DEMO_PRODUCTS[0].tiers[1]} productName={DEMO_PRODUCTS[0].name} /></div> },
      { name: "New shopper", preview: <div className="w-full max-w-xl"><ShopperPitchDetails shopper={SHOPPERS[4]} /></div> },
    ],
  },
  {
    name: "Confirm dialog",
    level: "molecules",
    description: "shadcn AlertDialog (Base UI) for actions with consequences — closing a product page, cancelling a subscription. Cancel takes first focus; destructive confirms are red.",
    variants: [{ name: "Destructive", preview: <ConfirmDialogDemo /> }],
  },
  {
    name: "Face pile",
    level: "molecules",
    description: "Overlapping avatars for who's waiting: the first few faces, initials when there's no photo, then a +N chip. The ring takes the colour of the surface behind it.",
    variants: [
      { name: "On white", preview: <FacePile people={SHOPPERS.slice(0, 6).map((shopper) => ({ name: shopper.name, avatar: shopper.avatar }))} /> },
      {
        name: "On lime",
        preview: (
          <div className="rounded-2xl bg-[#A3FF38] p-4">
            <FacePile people={SHOPPERS.slice(2, 8).map((shopper) => ({ name: shopper.name, avatar: shopper.avatar }))} size={36} ringClassName="ring-[#A3FF38]" />
          </div>
        ),
      },
    ],
  },
  {
    name: "Review queue card",
    level: "molecules",
    description: "The brand's first action on the storefront: shoppers waiting for review, with their faces. Lime while anyone is waiting; quiet white pointing to the creator directory once the queue is clear.",
    variants: [
      { name: "Waiting", preview: <div className="w-full max-w-sm"><ReviewQueueCard people={SHOPPERS.slice(0, 6).map((shopper) => ({ name: shopper.name, avatar: shopper.avatar }))} href="#" emptyHref="#" /></div> },
      { name: "Clear", preview: <div className="w-full max-w-sm"><ReviewQueueCard people={[]} href="#" emptyHref="#" /></div> },
    ],
  },
  {
    name: "Attention stats",
    level: "molecules",
    description: "Linked counts, each its own card with a who-or-what line. Zero turns grey so live numbers stand out; the alert tone adds a red dot. Stacks into compact rows below a 32rem container.",
    variants: [
      {
        name: "Storefront",
        preview: (
          <div className="w-full max-w-2xl">
            <AttentionStats
              stats={[
                { label: "Proof to review", value: 1, href: "#" },
                { label: "Shops in progress", value: 5, href: "#" },
                { label: "Overdue posts", value: 1, href: "#", tone: "alert" },
              ]}
            />
          </div>
        ),
      },
      {
        name: "All clear",
        preview: (
          <div className="w-full max-w-2xl">
            <AttentionStats
              stats={[
                { label: "Proof to review", value: 0, href: "#" },
                { label: "Shops in progress", value: 0, href: "#" },
                { label: "Overdue posts", value: 0, href: "#", tone: "alert" },
              ]}
            />
          </div>
        ),
      },
    ],
  },
  {
    name: "Add item card",
    level: "molecules",
    description: "Dashed ghost card that ends a grid, sized like the cards beside it — the slot for the next product page.",
    variants: [{ name: "Default", preview: <div className="w-72"><AddItemCard href="#" label="List a product" description="Set the posts you accept and how many spots you have." /></div> }],
  },
  {
    name: "Toast",
    level: "molecules",
    description: "Sonner toast in the bottom-right corner for review decisions. The badge mirrors the swipe button just pressed: lime check to approve, white cross to pass. Hover holds the stack; swipe or × dismisses.",
    variants: [
      { name: "Live", preview: <ToastDemo /> },
      { name: "Approved", preview: <ToastPreview icon="check" title="Approved Lerato Dube" description="Their post is due 17 Oct 2026." action={{ label: "Open thread", href: "#" }} /> },
      { name: "Passed", preview: <ToastPreview icon="cross" title="Passed on Lerato Dube" /> },
      { name: "Undone", preview: <ToastPreview icon="undo" title="Decision undone" description="Lerato Dube is back in the queue." /> },
    ],
  },
];
