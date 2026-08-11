# Creatorshop — Component Library Kickoff

## What this is right now
The Creatorshop product plan is archived at `archive/marketplace-v1/` — not
deleted, just parked. We're not building product features yet.

Instead: an internal component library, built one component at a time,
following atomic design. Each finished component gets posted publicly
(build in public) before moving to the next one.

This library currently lives inside the Creatorshop repo at `/design-system`,
but it's decoupled from any product decisions — it may become its own
standalone tool later.

---

## Reference: the prior full build
Before this reset, Creatorshop had a fully built-out version of the
marketplace app — real pages and components, not just the plan. That work
lives on the `archive/pre-atomic-rebuild` branch on GitHub
(`austinskhosana/creatorshop`), for one purpose only: checking prior UX
decisions while designing a new component or page here.

**Styling and UX only.** Pull layout, copy, spacing, and interaction
patterns from it. Never pull in anything functional from that branch —
no dependencies (Clerk, Prisma, Supabase, Resend, svix, pg), no database
wiring, no auth, no API routes. Those get rebuilt fresh, on purpose, when
there's real product work to wire up.

**This is temporary.** Once the full marketplace app is rebuilt and ships
as the final product — not just the component library — delete the
`archive/pre-atomic-rebuild` branch (and any other stale reference
branches). It's a build aid, not something that should persist in the
shipped repo.

---

## Atomic design levels
Build in this order. Don't skip ahead — a molecule shouldn't exist before
the atoms it's made of do.

| Level | What it means | Example |
|---|---|---|
| Atoms | Smallest possible unit, can't be broken down further | Button, Input, Badge, Avatar |
| Molecules | A small group of atoms working as one unit | Search field (Input + Button), Labeled field |
| Organisms | Groups of molecules/atoms forming a distinct section | Navbar, Card with actions, Form |
| Templates | Layout structure, no real content | Page shell with header/sidebar/content slots |
| Pages | Templates with real content in place | An actual finished screen |

---

## The workflow for every new component
1. Build the component under `src/components/{level}/{ComponentName}/`
2. Add one entry to `src/components/registry.tsx` — this is what makes it
   show up on `/design-system` automatically, grouped by level
3. Check it against the design skills before calling it done (see below)
4. Post it — screenshot or clip from `/design-system`, component by component

---

## Component file convention
Established by the existing `Button` atom — follow this shape:

```
src/components/atoms/Button/
  Button.tsx     ← the component, default export
  index.ts       ← re-export
```

```tsx
// Button.tsx pattern to follow
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}
// ...variant/size style maps, then the component using cn()
```

Registry entry:

```tsx
// registry.tsx — one object per component
{
  name: "Button",
  level: "atoms",
  description: "Primary, secondary, and ghost variants in three sizes.",
  preview: (/* live JSX showing all variants/states */),
}
```

---

## Design quality bar
Before marking a component done, run it against these skills:
- `emil-design-eng` — polish philosophy, animation decisions, invisible details
- `make-interfaces-feel-better` — hover states, shadows, borders, micro-interactions
- `userinterface-wiki` — broader UI/UX patterns, file:line findings

Every interactive component needs: hover, active, focus-visible, and
disabled states shown in its registry preview — not just the default state.

---

## Stack
| Layer | Tool |
|---|---|
| Framework | Next.js 16 (app router) |
| Styling | Tailwind 4 |
| Animation | Framer Motion |
| Component catalog | `/design-system` + `src/components/registry.tsx` |

Auth, database, and email packages (Clerk, Prisma, Resend, svix, pg) have
been removed from `package.json` — they're archived with the product plan
and can come back when there's product work to wire up.

---

## Current inventory
| Component | Level | Status |
|---|---|---|
| Button | atoms | Done — primary/secondary/ghost × sm/md/lg |

---

## Session kickoff prompt for Claude Code
Paste this at the start of each Claude Code session:

"We're building Creatorshop's component library from scratch, one atomic
component at a time, following the workflow in CLAUDE.md. Check the
'Current inventory' table for what exists, then help me build the next one."
