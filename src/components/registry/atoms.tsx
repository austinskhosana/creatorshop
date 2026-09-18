import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Textarea } from "@/components/atoms/Textarea";
import { Badge } from "@/components/atoms/Badge";
import { Avatar } from "@/components/atoms/Avatar";
import { Card } from "@/components/atoms/Card";
import { Skeleton, SkeletonText, SkeletonCard } from "@/components/atoms/Skeleton";
import { PlatformIcon } from "@/components/atoms/PlatformIcon";
import { LogoMark } from "@/components/atoms/LogoMark";
import { Logo3D } from "@/components/atoms/Logo3D";
import { PixelTrail } from "@/components/atoms/PixelTrail";
import { MeshGradientPanel } from "@/components/atoms/MeshGradientPanel";
import { Fire } from "@/components/atoms/Fire";
import { AsciiFlame } from "@/components/atoms/AsciiFlame";
import { LocationTime } from "@/components/atoms/LocationTime";
import { ScrollIndicator } from "@/components/atoms/ScrollIndicator";
import { TextScramble } from "@/components/atoms/TextScramble";
import type { RegistryEntry } from "./types";

export const atomsEntries: RegistryEntry[] = [
  {
    name: "Button",
    level: "atoms",
    description:
      "Primary (lime accent), dark, secondary, and danger variants in three sizes — plus loading, full-width, and icon-slot states.",
    variants: [
      {
        name: "Primary",
        preview: (
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary" size="sm">Primary</Button>
            <Button variant="primary" size="md">Primary</Button>
            <Button variant="primary" size="lg">Primary</Button>
          </div>
        ),
      },
      {
        name: "Dark",
        preview: (
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="dark" size="sm">Dark</Button>
            <Button variant="dark" size="md">Dark</Button>
            <Button variant="dark" size="lg">Dark</Button>
          </div>
        ),
      },
      {
        name: "Secondary",
        preview: (
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="secondary" size="sm">Secondary</Button>
            <Button variant="secondary" size="md">Secondary</Button>
            <Button variant="secondary" size="lg">Secondary</Button>
          </div>
        ),
      },
      {
        name: "Danger",
        preview: (
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="danger" size="sm">Danger</Button>
            <Button variant="danger" size="md">Danger</Button>
            <Button variant="danger" size="lg">Danger</Button>
          </div>
        ),
      },
      {
        name: "Loading",
        preview: (
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary" loading>Primary</Button>
            <Button variant="dark" loading>Dark</Button>
            <Button variant="secondary" loading>Secondary</Button>
            <Button variant="danger" loading>Danger</Button>
          </div>
        ),
      },
      {
        name: "Full width",
        preview: (
          <div className="w-full max-w-sm space-y-3">
            <Button variant="primary" fullWidth>Continue</Button>
            <Button variant="secondary" fullWidth>Cancel</Button>
          </div>
        ),
      },
      {
        name: "With icons",
        preview: (
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="dark"
              iconLeft={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              }
            >
              Add item
            </Button>
            <Button
              variant="secondary"
              iconRight={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
            >
              Continue
            </Button>
          </div>
        ),
      },
      {
        name: "Disabled",
        preview: (
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary" disabled>Primary</Button>
            <Button variant="dark" disabled>Dark</Button>
            <Button variant="secondary" disabled>Secondary</Button>
            <Button variant="danger" disabled>Danger</Button>
          </div>
        ),
      },
      {
        name: "Pill",
        preview: (
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="dark" size="sm" pill>Sign Up</Button>
            <Button variant="primary" size="md" pill>Get Started</Button>
          </div>
        ),
      },
    ],
  },
  {
    name: "Input",
    level: "atoms",
    description: "Labeled text field with hint, error, and icon-slot states.",
    stage: "before",
    variants: [
      {
        name: "Default",
        preview: (
          <div className="w-full max-w-xs">
            <Input label="Email" placeholder="you@example.com" />
          </div>
        ),
      },
      {
        name: "With hint",
        preview: (
          <div className="w-full max-w-xs">
            <Input label="Display name" placeholder="Austin" hint="Shown on your public profile." />
          </div>
        ),
      },
      {
        name: "Error",
        preview: (
          <div className="w-full max-w-xs">
            <Input label="Email" defaultValue="not-an-email" error="Enter a valid email address." />
          </div>
        ),
      },
      {
        name: "With icons",
        preview: (
          <div className="w-full max-w-xs">
            <Input
              label="Website"
              placeholder="yoursite.com"
              iconLeft={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                  <path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18" stroke="currentColor" strokeWidth="2" />
                </svg>
              }
            />
          </div>
        ),
      },
      {
        name: "Disabled",
        preview: (
          <div className="w-full max-w-xs">
            <Input label="Email" defaultValue="you@example.com" disabled />
          </div>
        ),
      },
    ],
  },
  {
    name: "Textarea",
    level: "atoms",
    description: "Labeled textarea with hint, error, and character-counter states.",
    stage: "before",
    variants: [
      {
        name: "Default",
        preview: (
          <div className="w-full max-w-xs">
            <Textarea label="Bio" placeholder="Tell brands about yourself" rows={3} />
          </div>
        ),
      },
      {
        name: "With counter",
        preview: (
          <div className="w-full max-w-xs">
            <Textarea
              label="Pitch"
              placeholder="What will you create?"
              rows={3}
              maxChars={240}
              currentLength={210}
            />
          </div>
        ),
      },
      {
        name: "Error",
        preview: (
          <div className="w-full max-w-xs">
            <Textarea label="Brief" rows={3} defaultValue="" error="A brief is required." />
          </div>
        ),
      },
    ],
  },
  {
    name: "Badge",
    level: "atoms",
    description: "Shop-status colours plus count, tag, and stat variants.",
    stage: "before",
    variants: [
      {
        name: "Shop status",
        preview: (
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="PENDING" label="Pending" />
            <Badge variant="APPROVED" label="Approved" />
            <Badge variant="DENIED" label="Denied" />
            <Badge variant="DELIVERED" label="Delivered" />
            <Badge variant="COMPLETED" label="Completed" />
            <Badge variant="REVOKED" label="Revoked" />
          </div>
        ),
      },
      {
        name: "Generic",
        preview: (
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="count" label="12" />
            <Badge variant="tag" label="Design" />
            <Badge variant="stat" label="1.2k views" />
            <Badge variant="default" label="Default" />
          </div>
        ),
      },
    ],
  },
  {
    name: "Platform icon",
    level: "atoms",
    description: "Resolves a deliverable or content-type string (e.g. \"YouTube review\", \"TikTok\", \"IG carousel\") to its platform glyph. Shared by content-type tags across cards and cart rows.",
    variants: [
      {
        name: "Platforms",
        preview: (
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="tag" label="Instagram" icon={<PlatformIcon platform="Instagram" className="h-3 w-3" />} />
            <Badge variant="tag" label="TikTok" icon={<PlatformIcon platform="TikTok" className="h-3 w-3" />} />
            <Badge variant="tag" label="YouTube review" icon={<PlatformIcon platform="YouTube review" className="h-3 w-3" />} />
            <Badge variant="tag" label="X thread" icon={<PlatformIcon platform="X thread" className="h-3 w-3" />} />
          </div>
        ),
      },
    ],
  },
  {
    name: "Avatar",
    level: "atoms",
    description: "Circular avatar with initials fallback, four sizes.",
    stage: "before",
    variants: [
      {
        name: "Sizes",
        preview: (
          <div className="flex flex-wrap items-end gap-3">
            <Avatar name="Austin Skhosana" size="sm" />
            <Avatar name="Austin Skhosana" size="md" />
            <Avatar name="Austin Skhosana" size="lg" />
            <Avatar name="Austin Skhosana" size="xl" />
          </div>
        ),
      },
      {
        name: "Fallback",
        preview: (
          <div className="flex flex-wrap items-center gap-3">
            <Avatar name="Jordan Lee" />
            <Avatar name="Priya" />
            <Avatar />
          </div>
        ),
      },
    ],
  },
  {
    name: "Card",
    level: "atoms",
    description: "Base surface wrapper, default or gradient, four padding sizes.",
    stage: "before",
    variants: [
      {
        name: "Default",
        preview: (
          <Card className="w-64 text-sm text-neutral-600">Default card content.</Card>
        ),
      },
      {
        name: "Gradient",
        preview: (
          <Card variant="gradient" className="w-64 text-sm text-neutral-800">
            Gradient card content.
          </Card>
        ),
      },
      {
        name: "Padding",
        preview: (
          <div className="flex flex-wrap items-start gap-3">
            <Card padding="sm" className="w-40 text-xs text-neutral-600">sm</Card>
            <Card padding="md" className="w-40 text-xs text-neutral-600">md</Card>
            <Card padding="lg" className="w-40 text-xs text-neutral-600">lg</Card>
          </div>
        ),
      },
    ],
  },
  {
    name: "Logo mark",
    level: "atoms",
    description: "The Creatorshop node symbol — lime-on-black for use on light backgrounds, black-on-lime for use on lime surfaces like the social capital card.",
    variants: [
      {
        name: "On white",
        preview: (
          <div className="flex items-center gap-2.5">
            <LogoMark variant="onWhite" size={36} />
            <span className="text-lg font-semibold tracking-tight text-neutral-900">Creatorshop</span>
          </div>
        ),
      },
      {
        name: "On lime",
        preview: (
          <div className="flex items-center gap-2.5 rounded-xl bg-[#A3FF38] p-4">
            <LogoMark variant="onLime" size={36} />
            <span className="text-sm font-medium tracking-[0.08em] text-[#0F0F0F]">CREATORSHOP</span>
          </div>
        ),
      },
    ],
  },
  {
    name: "3D chrome logo",
    level: "atoms",
    description: "The Creatorshop symbol rendered as an interactive 3D chrome model (react-three-fiber) — tilts toward the cursor with a slow idle spin.",
    variants: [
      {
        name: "Default",
        preview: <Logo3D className="h-32 w-32" />,
      },
    ],
  },
  {
    name: "Pixel trail",
    level: "atoms",
    description: "Cursor-triggered grid of pixels that flash in and fade out along the trail — from the Fancy Components registry, used as the hero's background interaction.",
    variants: [
      {
        name: "Default",
        preview: (
          <div className="relative h-64 w-full max-w-xl overflow-hidden rounded-xl border border-neutral-200 bg-white">
            <PixelTrail pixelSize={24} fadeDuration={600} pixelClassName="bg-black" />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
                Move your cursor here
              </span>
            </div>
          </div>
        ),
      },
    ],
  },
  {
    name: "Fire",
    level: "atoms",
    description: "Doom-fire-style ASCII flame — black glyph shades propagating on brand green, from the Brand Engineering Kit. Used behind the \"Ditch the subscription\" section.",
    variants: [
      {
        name: "Default",
        preview: (
          <div className="relative h-64 w-full max-w-xl overflow-hidden rounded-xl">
            <Fire background="#a2ff38" rows={64} widthPercent={70} className="h-full w-full" />
          </div>
        ),
      },
    ],
  },
  {
    name: "Ascii flame",
    level: "atoms",
    description: "A single shaped flame silhouette (main tongue + two side licks) rendered as monospace glyphs — used above the copy in the \"Ditch the subscription\" section, in place of a static logo.",
    variants: [
      {
        name: "Default",
        preview: (
          <div className="relative h-36 w-28 overflow-hidden rounded-xl">
            <AsciiFlame background="#a2ff38" className="h-full w-full" />
          </div>
        ),
      },
    ],
  },
  {
    name: "Location time",
    level: "atoms",
    description: "Detects the visitor's own timezone and shows their local city and time in Geist Mono — used top-right of the hero heading.",
    variants: [
      {
        name: "Default",
        preview: (
          <div className="rounded-xl border border-neutral-200 bg-white p-6">
            <LocationTime />
          </div>
        ),
      },
    ],
  },
  {
    name: "Scroll indicator",
    level: "atoms",
    description: "Circular down-arrow button that scrolls the page down one viewport — used bottom-right of the hero heading.",
    variants: [
      {
        name: "Default",
        preview: (
          <div className="rounded-xl border border-neutral-200 bg-white p-6">
            <ScrollIndicator />
          </div>
        ),
      },
    ],
  },
  {
    name: "Text scramble",
    level: "atoms",
    description: "Decodes into place from random glyphs on mount — used for the hero's pitch copy. Respects prefers-reduced-motion by rendering the final text immediately.",
    variants: [
      {
        name: "Default",
        preview: (
          <TextScramble
            text="Trade posts for software access."
            className="font-mono text-sm text-neutral-600"
          />
        ),
      },
    ],
  },
  {
    name: "Skeleton",
    level: "atoms",
    description: "Loading placeholder — base pulse block, multi-line text, and a full card shape.",
    stage: "before",
    variants: [
      {
        name: "Base",
        preview: (
          <div className="flex flex-wrap items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-5 w-32" />
          </div>
        ),
      },
      {
        name: "Text",
        preview: (
          <div className="w-64">
            <SkeletonText lines={3} />
          </div>
        ),
      },
      {
        name: "Card",
        preview: (
          <div className="w-56">
            <SkeletonCard />
          </div>
        ),
      },
    ],
  },
  {
    name: "Mesh gradient panel",
    level: "atoms",
    description: "Animated WebGL mesh-gradient panel in the brand palette (lime + white) — used as a soft, moving background behind hero visuals.",
    variants: [
      {
        name: "Default",
        preview: (
          <MeshGradientPanel className="flex h-64 w-full max-w-5xl items-center justify-center">
            <span className="text-sm text-neutral-500">Content sits on top</span>
          </MeshGradientPanel>
        ),
      },
    ],
  }
];
