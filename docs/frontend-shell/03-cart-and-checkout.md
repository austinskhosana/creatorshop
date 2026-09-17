# Cart and Checkout

## Goal

Make the barter transaction legible as a commerce flow, without payment UI.

## Cart tasks

- [ ] Build populated cart rows: brand, product, selected price tier, access duration, retail value.
- [ ] Add change-tier and remove-product UI states.
- [ ] Add aggregate retail value: “You’re shopping $X worth of software.”
- [ ] Build empty cart with return-to-store CTA.
- [ ] Build loading state.

## Checkout tasks

- [ ] Build a distinct Confirm your shop summary screen.
- [ ] Show every selected product, tier, and aggregate retail value.
- [ ] Add a single confirmation action.
- [ ] Build success state that routes to My Shops.

## Components and later data

- Reuse/build: `CartItem`, `PriceTierSelector`, `EmptyState`
- shadcn: Button, Select, Separator, Sheet, Skeleton, Card, Checkbox, Sonner
- Later data: `Cart`, `CartItem`, `ProductPage`, `PriceTier`, `Pitch`

## Done when

The cart, checkout, and success states clearly tell the story of shopping for software by paying with content.

## Reference block

**Image references**
- [add reference]
- Mobbin: [add reference]

**Component**
- [add link]

Use for: cart item controls, totals, empty state, checkout confirmation
Keep: motion, layout, or visual treatment
Adapt: tokens, colors, typography, and copy to Creatorshop
Avoid: importing its entire design system
