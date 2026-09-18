import type { PlannedComponent } from "./types";

// Not built yet in the new library — grounded in an exhaustive audit of
// archive/pre-atomic-rebuild (the actual prior app, not just the plan doc),
// so the design-system directory doubles as a checklist of what to
// redesign. Where the old build duplicated something 2-4x across files,
// there's one entry here, not one per duplicate — the point is to build
// it once, well. Move an entry out of here and into `registry` above
// once it's built.
export const roadmap: PlannedComponent[] = [
  // Atoms
  // Molecules
  { name: "Swipe action bar", level: "molecules", note: "Deny / Undo / Approve row for the swipe review flow" },
  { name: "Submission row", level: "molecules", note: "Avatar, platform, and status in a list" },

  // Organisms
  { name: "Payment card visual", level: "organisms", note: "Decorative bank-card visual for a listing's plan — was 3 inconsistent versions" },
  { name: "Campaign option card", level: "organisms", note: "3D-tilt hub tile — was duplicated identically in two pages" },
  { name: "Campaign form", level: "organisms", note: "Brief, deliverables, reward, and deadline" },
  { name: "Listing row", level: "organisms", note: "A brand's own listing in a management list" },
  { name: "Key top-up panel", level: "organisms", note: "Add more access keys to a live listing" },
  { name: "Submissions table", level: "organisms", note: "Tabbed grid of creator applications for a campaign" },
  { name: "Submission drawer", level: "organisms", note: "Full post detail + approve/reject, slides over the table" },
  { name: "Campaign stats panel", level: "organisms", note: "Stat tiles for a campaign's history view" },

  // Templates
  { name: "Auth shell", level: "templates", note: "Centered layout for sign-in / onboarding" },
  { name: "Swipe review layout", level: "templates", note: "Full-screen card stack + action bar + progress" },
  { name: "Public profile layout", level: "templates", note: "Header + content sections" },
  { name: "Listing detail layout", level: "templates", note: "Header + apply panel" },
  { name: "List + detail drawer", level: "templates", note: "Master list with a slide-over panel" },

  // Pages
  { name: "Sign up / landing", level: "pages", note: "/ — currently just redirects or shows sign-up, no marketing content" },
  { name: "Sign in", level: "pages", note: "/sign-in" },
  { name: "Onboarding", level: "pages", note: "/onboarding" },
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
