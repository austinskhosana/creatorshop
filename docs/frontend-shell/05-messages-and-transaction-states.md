# Messages and Transaction States

## Goal

Build a static, persistent message-thread shell that can represent the transaction lifecycle before realtime data exists.

## Tasks

- [ ] Build text-message presentation and thread layout.
- [ ] Build system cards: shop approved, proof submitted, proof confirmed, access unlocked, rating prompt.
- [ ] Add Submit proof UI: proof URL and sponsored-content disclosure checkbox.
- [ ] Add access-unlocked state and receipt entry point.
- [ ] Add report entry point without building the report flow.

## Components and later data

- Reuse/build: `SystemMessageCard`, `ProofSubmissionCard`
- shadcn: Textarea, Input, Checkbox, Dialog, Button
- Later data: `Thread`, `Message`, `Proof`, `AccessGrant`, `Receipt`

## Done when

The mock thread tells the whole approval-to-access story and gives My Shops a credible destination.

## Reference block

**Image references**
- [add reference]
- Mobbin: [add reference]

**Component**
- [add link]

Use for: message layout, system events, proof form, access card
Keep: motion, layout, or visual treatment
Adapt: tokens, colors, typography, and copy to Creatorshop
Avoid: importing its entire design system
