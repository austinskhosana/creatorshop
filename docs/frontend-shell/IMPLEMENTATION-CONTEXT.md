# Creatorshop Frontend — Shared Implementation Context

This is the living decision record for every frontend implementation chat. Read it before building or redesigning a Creatorshop page.

## Product framing

Creatorshop is a software store where creators pay with content. The UI must feel like commerce, not a deal marketplace or a job board.

- Say: product page, shop, price tier, access, receipt, pay with a post, storefront.
- Do not say: application, campaign, listing, reward, freebie, or get free.

## Component-first rules

1. Search the existing component library before creating any UI. Reuse an atom, molecule, or organism when its meaning matches.
2. When a page introduces a repeated visual or behavioral pattern, build it as a focused reusable component before repeating markup.
3. Page components should compose domain-specific components and own only page-level layout and temporary view state.
4. Keep mock data in `src/lib/` and pass it to presentation components by typed props. Do not bury product data inside markup.
5. Use shadcn-style primitives for accessible behavior; adapt their styling to Creatorshop tokens rather than importing another visual system.
6. A supplied open-source component is reference material. If its intended placement is not specified, use it only where it naturally improves the page’s hierarchy or interaction—never force it in.

## Shared shell

- `src/components/organisms/Sidebar/Sidebar.tsx` is the canonical sidebar and must be used across creator pages. Do not create another sidebar.
- `StoreSidebarCategories` is the canonical contextual Categories section shown beneath the sidebar navigation. It must travel with the sidebar on creator pages, including Cart.
- Use `CreatorShell` to apply the exact existing `AppShell` configuration from `/explore`—including search, Categories, counts, and layout—to creator-area routes. Do not create sidebar, mobile-drawer, or layout variations inside it.
- Preserve the sidebar navigation labels and destinations unless the product model explicitly changes.

## Design system

- Primary accent: lime `#A3FF38`; border accent `#82F200`.
- Neutral-900 carries primary contrast; white/gray-200 are base surfaces.
- Font: Satoshi. Corners: rounded-xl / rounded-2xl.
- The aesthetic is calm, editorial software commerce: clear hierarchy, confident whitespace, modest contrast, and deliberate state color.
- Match the transaction baseline: 20px primary card surfaces, 14px dense/form surfaces, 9px transaction controls, borders for structure, and dark primary CTAs. Lime is an accent—not the default action colour.

## State completeness

For every data-driven page, design populated, empty, loading, error, disabled, and relevant lifecycle states as part of the same ticket. Do not defer empty states to polish.

## Current phase boundaries

This phase is a mock-driven visual shell. Do not wire Supabase, Clerk, Stripe, realtime messaging, notifications, or final business logic unless the task explicitly moves into that phase.

## Before handing off a page

- Verify desktop, tablet, and mobile layouts.
- Verify keyboard/focus basics for controls.
- Verify user-facing language against the product framing above.
- Check whether any new repeated UI should become a reusable component.
