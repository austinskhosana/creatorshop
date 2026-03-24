# Creatorshop — Claude Code Kickoff

## What this is
A marketplace where creators barter their services (content, design, video)
in exchange for software subscriptions. Phase 1 is software only.

---

## The core flow
1. Creator browses software listings on /explore
2. Creator applies — submits what they'll create in exchange
3. Brand approves or denies — no negotiation, take it or leave it
4. On approval, access key is automatically revealed to the creator
5. Creator uses the software, then delivers by submitting a link
6. Brand confirms delivery — shop is complete

---

## Language / naming — use these consistently
- A single exchange = a **Shop** (never "deal", "order", "transaction")
- Creator's history page = **My Shops** at /shops
- Brand's inbox = **Applications** at /applications
- Access details (key, invite link, promo code) = **Access key**
- Software companies = **Brands**

---

## User types
- **Creator** — browses and applies for software using services as payment
- **Brand** — lists software tools and reviews incoming applications
- **Both** — a single account can act as either depending on context
  - Needs a role switcher in the nav to toggle between creator and brand views
  - Each view is completely separate — /shops vs /applications

---

## Shop statuses
- **PENDING** — applied, waiting on brand
- **APPROVED** — brand said yes, access key revealed to creator
- **DENIED** — brand passed, or listing was closed while pending
- **DELIVERED** — creator submitted their content link, brand reviewing
- **COMPLETED** — brand confirmed delivery, shop is done
- **REVOKED** — creator didn't deliver before deadline, auto-revoked

---

## Delivery deadline mechanic
- Brand sets a delivery window in days when creating a listing (e.g. 14 days)
- Clock starts the moment a shop is approved — deadline = approvedAt + deliveryDays
- Halfway through the window → reminder email sent to creator
- 24 hours before deadline → final warning email sent to creator
- Deadline passes with no delivery link → shop is auto-revoked, key burned, brand notified
- No grace period — auto-revoke fires exactly at the deadline
- A creator with an overdue approved shop can browse but cannot apply for new shops
- Auto-revoke resolves the block immediately — creator can apply again once revoked
- Auto-revoke runs as a scheduled job — checks for past-deadline approved shops

---

## Listing close mechanic
- When a brand closes a listing all PENDING shops are auto-denied in a single transaction
- Affected creators receive an email — listing closed, not a reflection of their pitch
- APPROVED shops on a closed listing still require delivery — deadline still applies
- A closed listing sets isActive: false — disappears from /explore immediately
- Brands can pause a listing (hidden from explore, no new applications) without closing it
- A paused listing can be reactivated. A closed listing cannot.

---

## Duplicate application rule
- A creator cannot apply to the same listing twice
- If they visit a listing they've already applied to, the apply button is disabled
- Their current shop status is shown instead with a link to /shops

---

## Incomplete onboarding rule
- If a user signs up but doesn't complete onboarding, any protected page redirects to /onboarding
- Enforced via middleware checking for a completed profile on every route

---

## Pages
| Route | Name | Who sees it |
|---|---|---|
| / | Landing page | Everyone |
| /explore | Explore software | Creators |
| /software/[slug] | Software listing | Creators |
| /shops | My shops | Creators only |
| /applications | Applications inbox | Brands only |
| /profile/[username] | Creator profile | Public |
| /onboarding | Onboarding | New users |
| /dashboard | Dashboard | Both — renders different UI per role |

---

## Dashboard behaviour
Single route /dashboard. Renders CreatorDashboard or BrandDashboard
based on the user's role from Clerk publicMetadata.

```tsx
// src/app/dashboard/page.tsx
import { currentUser } from "@clerk/nextjs/server";
import CreatorDashboard from "@/components/CreatorDashboard";
import BrandDashboard from "@/components/BrandDashboard";

export default async function Dashboard() {
  const user = await currentUser();
  const role = user?.publicMetadata?.role;
  if (role === "BRAND") return <BrandDashboard />;
  return <CreatorDashboard />;
}
```

---

## Access key mechanic
- Brand uploads a batch of keys/invite links when creating a listing
- Each key = one slot. Number of slots = number of keys uploaded
- Listing auto-closes when all keys are consumed
- On approval, one key is consumed and revealed only to that creator
- Keys must be encrypted at rest in the database — never plain text
- Key is marked as burned on revoke — never reused
- Brand can top up keys on a live listing without taking it offline

---

## Email notifications — full list
All emails sent via Resend.
| Trigger | Recipient | Content |
|---|---|---|
| Shop approved | Creator | Access key + what to deliver + deadline |
| Shop denied | Creator | Listing passed, try other listings |
| Listing closed (pending shops) | Creator | Listing closed, not a rejection |
| Deadline reminder (halfway) | Creator | Friendly reminder to deliver |
| Deadline final warning (24hrs) | Creator | Urgent — deliver or shop is revoked |
| Shop auto-revoked | Creator + Brand | Key burned, shop closed |
| New application received | Brand | Creator applied, review in inbox |
| Creator delivered | Brand | Review the link, confirm or revoke |
| Shop completed | Creator | Confirmation, shop is done |

---

## Stack
| Layer | Tool | Why |
|---|---|---|
| Framework | Next.js 16 (app router) | Already set up |
| Styling | Tailwind 4 + Satoshi font | Already set up |
| Auth | Clerk | Handles roles, sessions, UI — saves days |
| Database | Supabase (Postgres) | DB + storage + realtime |
| ORM | Prisma | Type-safe queries, schema migrations |
| Email | Resend | Transactional email, React templates |
| Deploy | Vercel | Already the platform |

---

## Fix on day 1
layout.tsx is importing Geist from Google Fonts but globals.css uses Satoshi.
Remove the Geist imports — Satoshi is already loaded via globals.css.

```tsx
// src/app/layout.tsx — replace with this
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Creatorshop",
  description: "Barter your services for software subscriptions",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
```

---

## Prisma schema
Drop this at prisma/schema.prisma

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  CREATOR
  BRAND
  BOTH
}

enum ShopStatus {
  PENDING
  APPROVED
  DENIED
  DELIVERED
  COMPLETED
  REVOKED
}

enum DeliverableType {
  INSTAGRAM_POST
  INSTAGRAM_REEL
  INSTAGRAM_STORY
  TIKTOK_VIDEO
  YOUTUBE_VIDEO
  YOUTUBE_SHORT
  TWEET
  LINKEDIN_POST
  BLOG_POST
  OTHER
}

model User {
  id        String   @id @default(cuid())
  clerkId   String   @unique
  email     String   @unique
  role      Role     @default(CREATOR)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  creatorProfile CreatorProfile?
  brandProfile   BrandProfile?
  shopsAsCreator Shop[]          @relation("CreatorShops")
  shopsAsBrand   Shop[]          @relation("BrandShops")

  @@map("users")
}

model CreatorProfile {
  id     String @id @default(cuid())
  userId String @unique
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  displayName  String
  bio          String?
  avatarUrl    String?
  location     String?
  niche        String?
  services     String[]

  instagramUrl String?
  tiktokUrl    String?
  youtubeUrl   String?
  twitterUrl   String?
  linkedinUrl  String?
  websiteUrl   String?
  audienceSize String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("creator_profiles")
}

model BrandProfile {
  id     String @id @default(cuid())
  userId String @unique
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  brandName  String
  bio        String?
  logoUrl    String?
  websiteUrl String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  listings SoftwareListing[]

  @@map("brand_profiles")
}

model SoftwareListing {
  id             String       @id @default(cuid())
  brandProfileId String
  brandProfile   BrandProfile @relation(fields: [brandProfileId], references: [id], onDelete: Cascade)

  name        String
  tagline     String?
  description String?
  logoUrl     String?
  websiteUrl  String?
  category    String?

  planName     String
  planValue    Float?
  billingCycle String?

  brief                 String
  preferredDeliverables DeliverableType[]
  deliveryDays          Int     @default(14)

  isActive Boolean @default(true)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  accessKeys AccessKey[]
  shops      Shop[]

  @@map("software_listings")
}

model AccessKey {
  id                String          @id @default(cuid())
  softwareListingId String
  softwareListing   SoftwareListing @relation(fields: [softwareListingId], references: [id], onDelete: Cascade)

  encryptedValue String
  isConsumed     Boolean   @default(false)
  consumedAt     DateTime?

  shop Shop?

  createdAt DateTime @default(now())

  @@map("access_keys")
}

model Shop {
  id String @id @default(cuid())

  creatorId String
  creator   User   @relation("CreatorShops", fields: [creatorId], references: [id])
  brandId   String
  brand     User   @relation("BrandShops", fields: [brandId], references: [id])

  softwareListingId String
  softwareListing   SoftwareListing @relation(fields: [softwareListingId], references: [id])

  accessKeyId String?    @unique
  accessKey   AccessKey? @relation(fields: [accessKeyId], references: [id])

  status ShopStatus @default(PENDING)

  deliverable DeliverableType
  pitch       String

  // Set on approval as approvedAt + listing.deliveryDays
  deadline    DateTime?

  deliveryLink String?
  deliveryNote String?
  deliveredAt  DateTime?
  completedAt  DateTime?
  revokedAt    DateTime?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("shops")
}
```

---

## Key Prisma transactions

### Close a listing (auto-deny all pending shops)
```ts
await prisma.$transaction([
  prisma.shop.updateMany({
    where: { softwareListingId: listingId, status: "PENDING" },
    data: { status: "DENIED" },
  }),
  prisma.softwareListing.update({
    where: { id: listingId },
    data: { isActive: false },
  }),
]);
```

### Approve a shop (consume key, set deadline)
```ts
const listing = await prisma.softwareListing.findUnique({
  where: { id: softwareListingId }
});
const deadline = new Date();
deadline.setDate(deadline.getDate() + listing.deliveryDays);

await prisma.$transaction([
  prisma.accessKey.update({
    where: { id: nextAvailableKeyId },
    data: { isConsumed: true, consumedAt: new Date() },
  }),
  prisma.shop.update({
    where: { id: shopId },
    data: { status: "APPROVED", accessKeyId: nextAvailableKeyId, deadline },
  }),
]);
```

### Auto-revoke overdue shops (scheduled job — run every hour via Vercel cron)
```ts
await prisma.shop.updateMany({
  where: {
    status: "APPROVED",
    deadline: { lt: new Date() },
  },
  data: { status: "REVOKED", revokedAt: new Date() },
});
// After this, fire revoke emails to affected creators and brands via Resend
```

---

## Component architecture
Build in this order — primitives first, then features.

```
src/
  components/
    ui/                     ← build these first
      Badge.tsx             ← status pills
      Button.tsx            ← primary, secondary, danger variants
      Card.tsx              ← base card wrapper
      Avatar.tsx            ← profile images with fallback initials
      EmptyState.tsx        ← when there's no data

    shop/                   ← creator-side
      ShopCard.tsx          ← one shop in history list
      ShopStatus.tsx        ← coloured status badge
      DeliveryForm.tsx      ← link submission form
      DeadlineTimer.tsx     ← countdown to delivery deadline

    application/            ← brand-side
      ApplicationCard.tsx   ← one creator application
      ApproveButton.tsx     ← approve / deny actions
      KeyReveal.tsx         ← masked → revealed access key

    software/               ← listing components
      ListingCard.tsx       ← one tool on explore page
      ListingHeader.tsx     ← logo, name, plan details
      ApplyForm.tsx         ← the application form

    profile/                ← creator profile
      ProfileHeader.tsx     ← avatar, name, niche, audience
      SocialLinks.tsx       ← platform links
      ServicesList.tsx      ← what they offer

    layout/
      Navbar.tsx            ← includes role switcher for BOTH users
      DashboardShell.tsx    ← switches creator/brand view by role
```

---

## All 18 flows to design

| # | Flow | Who |
|---|---|---|
| 1 | Onboarding — role selection + profile setup | New user |
| 2 | Creator shopping — browse to apply | Creator |
| 3 | Brand review — approve or deny application | Brand |
| 4 | Delivery — creator submits, brand confirms or revokes | Both |
| 5 | Brand listing setup — create listing + upload keys | Brand |
| 6 | Access key reveal — approval triggers automatic reveal | System |
| 7 | Creator profile — public view | Brand |
| 8 | Creator profile — edit own | Creator |
| 9 | Brand profile — public view via listing page | Creator |
| 10 | Brand profile — edit own + manage listings | Brand |
| 11 | Role switching — toggle between creator and brand | Both |
| 12 | Incomplete onboarding — redirect back to finish | New user |
| 13 | Listing key top-up — add more keys to live listing | Brand |
| 14 | Listing pause / close — with auto-deny on close | Brand |
| 15 | Duplicate application blocked — status shown instead | Creator |
| 16 | Email notifications — all 9 triggers via Resend | System |
| 17 | Delivery deadline — reminder + warning + auto-revoke | System |
| 18 | Creator unblocked — delivers overdue shop, can apply again | Creator |

---

## 30-day build plan

| Day | Task |
|---|---|
| 1 | Fix layout.tsx, install Clerk + Supabase + Prisma, deploy schema, push to Vercel |
| 2 | Clerk auth — sign up, log in, role selection (creator / brand) on onboarding |
| 3 | Creator onboarding — profile setup form, save to DB |
| 4 | Brand onboarding — software listing setup + key upload |
| 5 | Creator profile page + software listing page (read-only) |
| 6 | Explore page — browse active listings |
| 7 | Apply form — creator submits deliverable + pitch |
| 8 | /shops — creator's shop history with status + deadline timer |
| 9 | /applications — brand's inbox, approve / deny |
| 10 | Key reveal — decrypt and show access key on approval |
| 11 | Delivery flow — creator submits link, brand confirms |
| 12 | Revoke flow + auto-revoke scheduled job (Vercel cron) |
| 13 | Listing close — auto-deny pending shops transaction |
| 14 | Dashboard — single route, renders per role + role switcher |
| 15 | Email notifications via Resend — all 9 triggers |
| 16 | Buffer — catch up |
| 17 | Landing page |
| 18 | UI polish — empty states, loading states, error states |
| 19 | End-to-end test — full shop flow as creator and brand |
| 20 | Seed 2–3 real software listings, soft launch |

---

## What's cut from phase 1
- Negotiation / counter-offers
- API post verification
- Reviews and ratings
- Search and filters on explore
- Admin moderation panel
- Automated API access grants per tool
- Grace period on delivery (auto-revoke fires at deadline, no grace)

---

## Kickoff prompt for Claude Code
Paste this at the start of your Claude Code session:

"I'm building Creatorshop — a marketplace where creators barter their
services for software subscriptions. The product is fully scoped in CLAUDE.md
at the root of this project. Please read it before we start.

Day 1 tasks:
1. Fix layout.tsx — remove Geist imports, Satoshi is already loaded in globals.css
2. Install and configure Clerk for auth with creator/brand role selection
3. Install Supabase and Prisma, apply the schema from CLAUDE.md
4. Confirm everything deploys to Vercel cleanly

After that we'll build component-first — starting with ui/Badge, ui/Button,
and ui/Card using Tailwind 4."
