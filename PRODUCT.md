# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two-sided:
- **Creators** (primary) — have an audience/platform, global for the software-vertical launch (the founding story is South-Africa-rooted, but that's origin narrative, not a deployment restriction). Want to monetize their content via barter instead of needing follower-count gatekeeping or waiting on manual brand outreach.
- **Brands** (software companies) — want creator-made content/exposure in exchange for free product access instead of cash ad spend or affiliate payouts. Pay a flat $50/month for the brand-side tool itself.

## Product Purpose

Creatorshop lets creators get free software access by pitching a post/deliverable directly to brands, and lets brands get creator-made content in exchange for product access — a self-serve barter marketplace. Success means creators completing barter "Shops" (apply → approve → access reveal → deliver → complete) without needing a concierge/manual intermediary.

## Positioning

"Product Hunt, but creators shop for software by posts." The mechanism a competitor can't copy: a direct, self-serve pitch flow (Explore → Apply) for barter deals — unlike upvote-only discovery (Product Hunt) and unlike manual/concierge pitching services (e.g. Simple Influence, staff-mediated outreach). Founding insight: the founder, a South African creator, had a platform and audience but no self-serve way to pitch a brand for a barter deal — an access/infrastructure gap, not a follower-count gap.

## Operating Context

- Launch scope: software vertical only, positioned as "Product Hunt for software by posts."
- Launch geography: international for the software vertical (software has location freedom — delivery isn't geography-bound). The founding narrative is South-Africa-rooted, but that doesn't restrict this vertical's launch geography.
- Launch mechanic: no live listings exist at cold-outreach time. The pitch to creators is **"software drops"** — scheduled/batched listing releases — rather than an always-on marketplace. Outreach is cold DM + voice note, ~100/day.
- Core transaction unit: a **"Shop"** — a barter of a software subscription for a creator post/deliverable. Flow: apply → approve → access reveal → deliver → complete.
- Long-term roadmap: expand beyond software into all categories ("multi-category shop"). Native mobile apps (separate Creator app and Brand app, two distinct Expo repos) are built once the product goes multi-category — not before, and not solely gated on Apple Developer Program affordability.
- Deployment: web app first, on a domain the founder already owns — not an app-store release at launch.

## Capabilities and Constraints

- Brand side is the only paying side: $50/month flat, single tier, no usage-based pricing planned.
- Creator side is free — creators "pay" with content/services, not cash.
- No plan-tier feature-gating on the brand side (all features ship under the one price) unless tiering is decided later.
- Currently a single web codebase in active development (this repo); mobile is future scope, not current.
- Currently building an internal atomic-design component library (`/design-system` in this repo) before product screens are wired to real data — Button, Avatar, Badge, Card, Input, Skeleton, Textarea atoms in progress.
- A prior full build of the marketplace app exists on GitHub branch `archive/pre-atomic-rebuild` — usable only as a styling/UX reference (layout, copy, spacing, interaction patterns), never for functional code, dependencies, or data wiring.

## Brand Commitments

- Name: Creatorshop.
- Confirmed design-system tokens already in code: primary accent lime green `#A3FF38` (border `#82F200`), neutral-900 dark, white/gray-200 surfaces, rounded-xl/2xl corners, Satoshi as the brand font (Plus Jakarta Sans is the working substitute in tools where Satoshi isn't available).

## Evidence on Hand

None yet — pre-launch. No live listings, no real brand/creator names, logos, testimonials, or traction to cite. The "software drops" launch mechanic exists specifically because there is no inventory yet at outreach time; future work must not fabricate listings, testimonials, or traction numbers.

## Product Principles

1. Self-serve beats concierge — the pitch/apply flow is the product's core differentiator and deserves the most design care of any screen.
2. Barter, not cash, is the mechanism on both sides — creators pay with posts, brands pay with product access (plus a flat monthly fee for the brand-side tool itself).
3. Launch narrow, architect broad — software-only and web-only at launch, but data models and components should stay category-flexible for the planned multi-category and multi-platform expansion.
4. Honesty about supply — the "drops" framing turns pre-launch lack of inventory into an expectation-setting hook, not something to hide or oversell.
5. Decompose relentlessly — every visually distinct UI chunk becomes its own atomic component; the prior build's monolithic page components are the explicit anti-pattern to avoid.

## Accessibility & Inclusion

No product-specific requirement established yet.
