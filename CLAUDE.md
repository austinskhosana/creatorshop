# Creatorshop — Agent Guide

## Current state

Creatorshop is a Next.js 16 web app and an actively evolving atomic component library. Product screens currently use mock data; authentication, persistence, payments, and external services are not wired yet.

The current product scope and business constraints live in `PRODUCT.md`. Historical plans live under `archive/` and are reference material only.

## Working rules

1. Preserve existing uncommitted work. Inspect the diff before changing a file.
2. Read only the context needed for the task. Do not preload `archive/`, every registry module, or every design skill.
3. For Next.js routing, configuration, caching, server/client boundaries, or framework APIs, read the relevant bundled guide in `node_modules/next/dist/docs/` first.
4. Keep UI components focused. Extract a distinct reusable card, form section, toolbar, status display, or interaction when it is reused or makes its parent materially easier to understand.
5. Do not add authentication, databases, email, payments, or external services unless the task explicitly requires them.
6. Do not fabricate live listings, testimonials, customers, or traction. Mock data must be clearly fictional.

## Component organization

```text
src/components/
  atoms/       smallest reusable controls and visuals
  molecules/   small combinations of atoms
  organisms/   substantial sections and workflows
  templates/   content-agnostic page structure
  pages/       composed application screens
```

Each component normally uses:

```text
src/components/{level}/{ComponentName}/
  ComponentName.tsx
  index.ts
```

The design-system catalog is modularized under `src/components/registry/`. Add a preview entry to the matching atomic-level file; do not rebuild a single monolithic registry.

## UI completion checklist

Apply this concise checklist during implementation. Invoke a specialized design skill only when the task needs a deeper audit.

- Match the established Tailwind tokens and nearby component conventions.
- Interactive controls have hover, active, focus-visible, disabled, loading, and error states where applicable.
- Touch targets are at least 40px in dense UI and preferably 44px on touch-oriented surfaces.
- Transitions name explicit properties; avoid `transition-all`.
- Motion has a functional purpose, stays subtle, and respects reduced motion.
- Dynamic numbers use tabular numerals when width changes would cause layout shift.
- Icons use the existing icon family and visually match adjacent text weight.
- Labels, keyboard behavior, and ARIA state remain correct.
- Run `npm run lint` and `npm run build` after structural changes.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion
- `/design-system` for component previews

## Useful entry points

- Product context: `PRODUCT.md`
- Routes: `src/app/`
- Components: `src/components/`
- Design-system registry: `src/components/registry/`
- Shared mock listings: `src/lib/mock-listings.ts`
