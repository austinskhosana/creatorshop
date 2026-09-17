# Creatorshop Frontend Shell Plan

Use this folder as the planning source of truth for the creator-side shell. Each workstream is deliberately self-contained so it can be handed to a separate implementation chat without losing product constraints.

## Shared rules

- Preserve the established Creatorshop design language and tokens.
- Use commerce language: **product page**, **shop**, **price tier**, **access**, **receipt**, and **pay with a post**. Do not use application, campaign, listing, reward, or freebie language.
- Build populated, empty, loading, error, and relevant lifecycle states together.
- Use shadcn/ui for functional, accessible primitives; use open-source references for presentation only.
- When a supplied component has no explicit placement guidance, inspect its capabilities and use it only where it is contextually useful to the page’s interaction or visual hierarchy. Do not force it into the UI just because it was supplied.
- Use static view models for this phase. Do not build Supabase, Clerk, Stripe, or realtime integrations.

## Workstream briefs

1. [Foundation and navigation](./01-foundation-and-navigation.md)
2. [Creator profile](./02-creator-profile.md)
3. [Cart and checkout](./03-cart-and-checkout.md)
4. [My Shops](./04-my-shops.md)
5. [Messages and transaction states](./05-messages-and-transaction-states.md)
6. [Settings and saved](./06-settings-and-saved.md)
7. [QA and Devin polish](./07-qa-and-devin-polish.md)

## Reference block

Copy this beneath any ticket that needs external inspiration:

```md
**Image references**
- [attach image / local path / link]
- Mobbin: [screen or collection link]
- What to borrow: visual hierarchy, density, card composition, or interaction pattern
- What not to copy: brand styling, wording, or information architecture that conflicts with Creatorshop

**Component**
- [link]

Use for: cart item controls / empty state / profile header
Keep: motion, layout, or visual treatment
Adapt: tokens, colors, typography, and copy to Creatorshop
Avoid: importing its entire design system
If no placement is specified: use the component contextually where its interaction or visual treatment best fits; otherwise do not force its use.
```
