# UI Polish Roadmap — 4 weeks to ship

Working roadmap for the UI polish pass. Supersedes the "7-day build plan" in
CLAUDE.md, which was written before campaigns, swipe-review applications,
influencer browsing, and the admin area existed. Backend wiring (Phase 2 in
CLAUDE.md) is largely done — this roadmap is about taking what's built and
making it feel finished, consistent, and componentized.

Update the checkboxes as we go. Each week ends with a short demo/review before
moving on.

---

## How we're building: component-based, not page-based

Right now most "pages" are one large client component (`SwipeCard.tsx` is 301
lines, `campaigns/new/page.tsx` is 550, `ShopDetailClient.tsx` is 262). Only a
handful of standalone components exist outside `ui/`: `BrandCard`,
`CategoryCard`, `CreatorCard`, `ListingCard`, `InfluencerCard`.

Going forward, every page we touch gets broken into the feature-folder
structure CLAUDE.md originally specified, instead of polishing markup in
place:

```
src/components/
  ui/            primitives — Badge, Button, Card, Avatar, Input, Textarea,
                 Skeleton, EmptyState, ErrorState, Logo (done)
  auth/          AuthShell (done)
  shop/          ShopCard, ShopStatus, DeliveryForm, AccessKeyPanel
  application/   ApplicationCard, ApproveButton, KeyReveal
  software/      ListingHeader, ApplyForm, PayWithPostsCard (move from ui/)
  campaign/      form sections for campaigns/new, ListingRow, SubmissionRow
  profile/       ProfileHeader, SocialLinks, ServicesList
  influencer/    InfluencerCard (done)
  layout/        Sidebar (done), DashboardShell if needed
```

Rule of thumb: if a chunk of JSX in a page file has its own concern (a card,
a form section, a status pill) and would be useful on a second page, it
becomes a component in the matching folder before we move to polish. No
abstraction for things used exactly once.

Every component pass also covers the four polish dimensions agreed on:
**motion/micro-interactions**, **visual consistency**, **empty/error/loading
states**, **responsive/mobile**.

---

## Week 1 — Foundation + Creator entry
**Pages:** `/` → `/sign-up` → `/sign-in` (✅ done) → `/onboarding` → `/explore` → `/software/[slug]`

- [x] Auth screens (`AuthShell`, `Logo`, Clerk theming, fixed missing `/sign-up` route)
- [ ] `/onboarding` — role selection + profile setup
  - Extract `OnboardingStep` / role card if the two-role picker is inline markup
  - Loading + validation states polish
- [ ] `/explore` — extract `ExploreFilters` if filtering logic is inline in `ExploreClient.tsx`; confirm `ListingCard` handles empty/loading/responsive grid well
- [ ] `/software/[slug]` (`SoftwareListingClient.tsx`, 263 lines)
  - Extract `software/ListingHeader.tsx`, `software/ApplyForm.tsx`
  - Move `PayWithPostsCard` from `ui/` to `software/` (it's listing-specific)
  - Build the duplicate-application state (disabled apply button + current
    status, per CLAUDE.md flow #15) — currently not implemented
- [ ] Sweep: mobile breakpoints for explore grid + listing detail two-column layout

**Definition of done:** a new creator can land on `/`, sign up, finish
onboarding, browse `/explore`, and open a listing — every screen consistent,
responsive, with real empty/loading states — without touching a single
one-off inline component.

---

## Week 2 — Creator shop lifecycle
**Pages:** `/shops` → `/shops/[id]` (delivery + key reveal) → `/profile` → `/profile/[username]`

- [ ] `/shops` (`ShopsClient.tsx`, 174 lines)
  - Extract `shop/ShopCard.tsx`, `shop/ShopStatus.tsx` (colored status badge — reused everywhere a shop status appears)
  - Status filter UI polish, empty state when no shops yet
- [ ] `/shops/[id]` (`ShopDetailClient.tsx`, 262 lines) — also absorbs the old `/access/[id]` scratch-card reveal, which now just redirects here
  - Extract `shop/DeliveryForm.tsx`, `shop/AccessKeyPanel.tsx` (the reveal interaction)
  - Motion: the key reveal is a key moment in the product — make sure it has a deliberate animation, not just an instant swap
- [ ] `/profile` (own, edit) + `/profile/[username]` (public view)
  - Extract `profile/ProfileHeader.tsx`, `profile/SocialLinks.tsx`, `profile/ServicesList.tsx` — shared between edit and public view
  - Responsive check on avatar/header layout at mobile width

**Definition of done:** full creator loop — apply, get approved, see key
revealed, deliver, see completed — feels like one coherent product, and
`shop/` + `profile/` component folders exist and are reused across pages.

---

## Week 3 — Brand side: review + listing creation
**Pages:** `/applications` (swipe review) → `/brand-profile` → `/campaigns/new` → `/campaigns/list` / `/campaigns/listings`

- [ ] `/applications` (`SwipeReviewClient.tsx` 245 + `SwipeCard.tsx` 301 lines)
  - Extract `application/ApplicationCard.tsx`, `application/ApproveButton.tsx`, `application/KeyReveal.tsx` out of `SwipeCard.tsx` — currently all logic lives in one file
  - Polish swipe motion (already has exit animations in `globals.css` — confirm they feel right, check reduced-motion fallback works)
  - Empty state: no pending applications
- [ ] `/brand-profile` (237 lines) — bring in line with creator `/profile` patterns where it makes sense
- [ ] `/campaigns/new` (550 lines — biggest single file in the app)
  - Break into `campaign/` form sections: basics, key upload, deliverable
    preferences, brief — each its own component with its own validation
  - This is the most important componentization target this month
- [ ] `/campaigns/list` + `/campaigns/listings` (`ListingsClient.tsx`)
  - Extract `campaign/ListingRow.tsx`; pause/close actions polish (confirm the pause-vs-close distinction is visually clear)

**Definition of done:** a brand can create a listing, review an application,
approve it — `campaign/new` is no longer a 550-line monolith, and
`application/` components exist and are reused.

---

## Week 4 — Remaining flows + cross-cutting polish
**Pages:** `/campaigns/submissions` → `/campaigns/history` → `/influencers` → `/admin` (lower priority) → full-app sweep

- [ ] `/campaigns/submissions` (`SubmissionsClient.tsx`, 321 lines) — extract `campaign/SubmissionRow.tsx` + the creator detail drawer as its own component
- [ ] `/campaigns/history` (`CampaignHistoryClient.tsx`) — stats tiles consistency with rest of app
- [ ] `/influencers` — uses `InfluencerCard` already; check filters/empty state
- [ ] `/admin` (268 lines, internal-only — not in CLAUDE.md's original 18 flows) — functional polish only, skip if time runs short
- [ ] Full-app sweep:
  - [ ] Every status badge across the app uses `shop/ShopStatus` / a shared `Badge` variant — no ad-hoc colored pills
  - [ ] Every data-fetching page has a real loading skeleton (several already do — confirm coverage)
  - [ ] Every empty state uses `ui/EmptyState`, every error boundary uses `ui/ErrorState`
  - [ ] Mobile pass on every page in this roadmap
  - [ ] Reduced-motion check across all animations (several keyframes already handle this — confirm new ones do too)
- [ ] Final QA: full shop flow end-to-end as both creator and brand, on mobile and desktop

**Definition of done:** ship. Every flow in CLAUDE.md's 18-flow list has a
componentized, polished UI; the `src/components/` tree matches the target
structure above.

---

## Notes
- This file tracks UI/polish work only — backend correctness bugs found along
  the way (like the missing `/sign-up` route fixed in week 1) get fixed
  inline when blocking, otherwise flagged separately.
- Order can shift if you want to jump ahead to a specific flow — this is a
  guide, not a contract.
