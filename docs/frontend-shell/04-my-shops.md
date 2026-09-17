# My Shops

## Goal

Build the creator’s single source of truth for every product they have shopped.

## Tasks

- [ ] Add tabs: Active, Confirmed, Expired, Overdue.
- [ ] Design cards for pending, approved, posted, confirmed/active, expired, overdue, declined, and withdrawn.
- [ ] Add actions: withdraw pending, open thread, submit proof, view access/receipt, and Shop again.
- [ ] Make the expired Shop again state prominent.
- [ ] Add an empty state for every tab.

## Components and later data

- Reuse/build: `ShopCard`, `StatusBadge`, `EmptyState`
- shadcn: Tabs, Badge, Dropdown Menu, Alert Dialog
- Later data: `Shop`, `Pitch`, `ProductPage`, `PriceTier`, `Receipt`

## Copy constraints

- Use “Your access has expired. Shop again to renew.”
- Never say “Your free trial ended.”

## Done when

Every important lifecycle state and its next action is understandable at a glance.

## Reference block

**Image references**
- [add reference]
- Mobbin: [add reference]

**Component**
- [add link]

Use for: shop cards, tabs, status treatment, renewal/empty states
Keep: motion, layout, or visual treatment
Adapt: tokens, colors, typography, and copy to Creatorshop
Avoid: importing its entire design system
