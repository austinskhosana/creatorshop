import { Button } from "@/components/atoms/Button";

export type AtomicLevel = "atoms" | "molecules" | "organisms" | "templates" | "pages";

export interface RegistryVariant {
  name: string;
  preview: React.ReactNode;
}

export interface RegistryEntry {
  name: string;
  level: AtomicLevel;
  description: string;
  variants: RegistryVariant[];
}

// Add one entry here each time a new component is built —
// it shows up in /design-system automatically. Each variant becomes
// its own page under /design-system/{component}/{variant}.
export const registry: RegistryEntry[] = [
  {
    name: "Button",
    level: "atoms",
    description: "Primary, secondary, and ghost variants in three sizes.",
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
        name: "Ghost",
        preview: (
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="ghost" size="sm">Ghost</Button>
            <Button variant="ghost" size="md">Ghost</Button>
            <Button variant="ghost" size="lg">Ghost</Button>
          </div>
        ),
      },
      {
        name: "Disabled",
        preview: (
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary" size="sm" disabled>Disabled</Button>
            <Button variant="primary" size="md" disabled>Disabled</Button>
            <Button variant="primary" size="lg" disabled>Disabled</Button>
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

// Not built yet — derived from the archived marketplace plan
// (archive/marketplace-v1/CLAUDE.md) so the design-system directory
// doubles as a checklist of what still needs designing. Move an entry
// out of here and into `registry` above once it's built.
export const roadmap: PlannedComponent[] = [
  // Atoms
  { name: "Input", level: "atoms", note: "Text field" },
  { name: "Textarea", level: "atoms", note: "Pitch, bio, brief, delivery note" },
  { name: "Select", level: "atoms", note: "Deliverable type, plan duration, category" },
  { name: "Label", level: "atoms", note: "Form field label" },
  { name: "Badge", level: "atoms", note: "Status and category pills" },
  { name: "Avatar", level: "atoms", note: "Profile image with fallback initials" },
  { name: "Card", level: "atoms", note: "Base surface wrapper" },
  { name: "Platform icon", level: "atoms", note: "Instagram, TikTok, YouTube, X, LinkedIn" },

  // Molecules
  { name: "Labeled field", level: "molecules", note: "Label + input" },
  { name: "Category filter", level: "molecules", note: "Filter pills on /explore" },
  { name: "Status badge", level: "molecules", note: "Colour-coded shop, application, or campaign status" },
  { name: "Deadline timer", level: "molecules", note: "Countdown to delivery deadline" },
  { name: "Approve / deny actions", level: "molecules", note: "Paired actions on an application or submission" },
  { name: "Stat tile", level: "molecules", note: "Number + label for campaign stats" },
  { name: "Empty state", level: "molecules", note: "Icon + message for no-data views" },
  { name: "Submission thumbnail", level: "molecules", note: "Post preview + platform icon" },
  { name: "Submission row", level: "molecules", note: "Avatar, platform, and status in a list" },

  // Organisms
  { name: "Navbar", level: "organisms", note: "Includes creator/brand role switcher" },
  { name: "Sidebar", level: "organisms", note: "Nav, active states, account menu" },
  { name: "Listing card", level: "organisms", note: "One tool on /explore" },
  { name: "Listing header", level: "organisms", note: "Logo, name, plan details" },
  { name: "Apply form", level: "organisms", note: "Application form on a listing page" },
  { name: "Shop card", level: "organisms", note: "One shop in a creator's history" },
  { name: "Delivery form", level: "organisms", note: "Link submission for a shop" },
  { name: "Application card", level: "organisms", note: "One creator application in the inbox" },
  { name: "Key reveal", level: "organisms", note: "Masked → revealed access key" },
  { name: "Profile header", level: "organisms", note: "Avatar, name, niche, audience" },
  { name: "Services list", level: "organisms", note: "What a creator offers" },
  { name: "Social links", level: "organisms", note: "A creator's platform links" },
  { name: "Campaign card", level: "organisms", note: "One campaign in the /campaigns/list hub" },
  { name: "Campaign form", level: "organisms", note: "Brief, deliverables, reward, deadline on /campaigns/new" },
  { name: "Submissions table", level: "organisms", note: "Submitted posts for a campaign" },
  { name: "Submission drawer", level: "organisms", note: "Full post detail + approve/reject, slides over the table" },
  { name: "Campaign stats panel", level: "organisms", note: "Stat tiles for /campaigns/history" },

  // Templates
  { name: "Auth shell", level: "templates", note: "Centered layout for sign-in / onboarding" },
  { name: "App shell", level: "templates", note: "Sidebar + content slots for signed-in pages" },
  { name: "Public profile layout", level: "templates", note: "Header + content sections" },
  { name: "Listing detail layout", level: "templates", note: "Header + apply panel" },
  { name: "List + detail drawer", level: "templates", note: "Master list with a slide-over panel" },

  // Pages
  { name: "Landing page", level: "pages", note: "/" },
  { name: "Onboarding", level: "pages", note: "/onboarding" },
  { name: "Explore software", level: "pages", note: "/explore" },
  { name: "Software listing", level: "pages", note: "/software/[slug]" },
  { name: "My shops", level: "pages", note: "/shops" },
  { name: "Shop delivery", level: "pages", note: "/shops/[id]" },
  { name: "Applications inbox", level: "pages", note: "/applications" },
  { name: "Creator profile (public)", level: "pages", note: "/profile/[username]" },
  { name: "Creator profile (edit)", level: "pages", note: "/profile" },
  { name: "Brand profile (edit)", level: "pages", note: "/brand-profile" },
  { name: "Access key reveal", level: "pages", note: "/access/[id]" },
  { name: "Campaign creation", level: "pages", note: "/campaigns/new" },
  { name: "Campaign submissions", level: "pages", note: "/campaigns/submissions" },
  { name: "Campaigns list", level: "pages", note: "/campaigns/list" },
  { name: "Campaign history", level: "pages", note: "/campaigns/history" },
];
