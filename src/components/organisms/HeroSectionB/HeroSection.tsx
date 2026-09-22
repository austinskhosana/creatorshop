import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import { Navbar } from "@/components/organisms/Navbar";
import { PixelTrail } from "@/components/atoms/PixelTrail";
import { ScrollIndicator } from "@/components/atoms/ScrollIndicator";
import { SocialCapitalCard } from "@/components/organisms/SocialCapitalCard";
import { TextScramble, SCRAMBLE_CHARS_ALPHANUMERIC } from "@/components/atoms/TextScramble";

const HERO_COPY = "Trade posts for software access. A new way to pay, built for creators.";

export default function HeroSectionB() {
  return (
    <section className="sticky top-0 z-0 flex h-screen flex-col bg-white px-6 pt-10 pb-10 sm:px-10 sm:pb-14 lg:px-16 lg:pb-16">
      <PixelTrail
        pixelSize={16}
        fadeDuration={500}
        delay={0}
        className="-z-10"
        pixelClassName="bg-black"
      />

      <div className="flex items-center justify-between">
        <Image
          src="/Logo.svg"
          alt="Creatorshop"
          width={142}
          height={41}
          className="pointer-events-none h-9 w-auto"
          priority
        />
        <Navbar variant="compact" />
      </div>

      {/* Conventional SaaS hero: big headline + copy up top, CTA, then the
          product visual anchoring the section below — instead of the
          original's small corner copy beside a large centered card. */}
      <div className="pointer-events-none flex flex-1 flex-col items-center justify-center gap-6 sm:gap-8">
        <div className="mt-20 max-w-sm text-center sm:mt-32 sm:max-w-xl lg:max-w-3xl">
          <h1 className="font-pixel text-3xl leading-[0.95] text-neutral-900 sm:text-5xl lg:text-6xl">
            <TextScramble text="Your content is the" chars={SCRAMBLE_CHARS_ALPHANUMERIC} />
            <br />
            <TextScramble text="new cash" chars={SCRAMBLE_CHARS_ALPHANUMERIC} delay={80} />
          </h1>
          <TextScramble
            text={HERO_COPY}
            chars={SCRAMBLE_CHARS_ALPHANUMERIC}
            className="mx-auto mt-5 max-w-xs font-mono text-[13px] leading-relaxed text-neutral-600 sm:mt-6 sm:max-w-md sm:text-base lg:max-w-lg"
          />
        </div>

        <Link href="/explore" className="pointer-events-auto">
          <Button variant="dark" size="md" pill className="min-w-[150px]" style={{ boxShadow: "none" }}>
            Sign Up
          </Button>
        </Link>

        <SocialCapitalCard className="mt-10 w-full max-w-md sm:mt-14" />
      </div>

      <div className="flex justify-end">
        <ScrollIndicator className="pointer-events-auto shrink-0" />
      </div>
    </section>
  );
}
