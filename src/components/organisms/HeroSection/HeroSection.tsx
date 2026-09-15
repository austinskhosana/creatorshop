import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import { Navbar } from "@/components/organisms/Navbar";
import { PixelTrail } from "@/components/atoms/PixelTrail";
import { ScrollIndicator } from "@/components/atoms/ScrollIndicator";
import { SocialCapitalCard } from "@/components/organisms/SocialCapitalCard";
import { TextScramble, SCRAMBLE_CHARS_ALPHANUMERIC } from "@/components/atoms/TextScramble";

const HERO_COPY = "Trade posts for software access. A new way to pay, built for creators.";
const HERO_COPY_MOBILE =
  "Trade posts for software access. A new way to pay, built for\u00A0creators.";

export default function HeroSection() {
  return (
    <section className="sticky top-0 z-0 flex h-screen flex-col bg-white px-6 pt-10 pb-16 sm:px-10 sm:pb-20 lg:px-16 lg:pb-24">
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

      <div className="pointer-events-none flex flex-1 flex-col items-center justify-center gap-6 sm:gap-8">
        <div className="order-1 max-w-xs text-center sm:hidden">
          <h1 className="font-pixel text-3xl leading-tight text-neutral-900">
            <TextScramble text="Your audience is your" chars={SCRAMBLE_CHARS_ALPHANUMERIC} />
            <br />
            <TextScramble text="bank account!" chars={SCRAMBLE_CHARS_ALPHANUMERIC} delay={80} />
          </h1>
          <TextScramble
            text={HERO_COPY_MOBILE}
            chars={SCRAMBLE_CHARS_ALPHANUMERIC}
            className="mt-2 font-mono text-[13px] leading-relaxed text-neutral-600"
          />
        </div>

        <Link href="/explore" className="pointer-events-auto order-2">
          <Button variant="dark" size="md" pill className="min-w-[150px]" style={{ boxShadow: "none" }}>
            Sign Up
          </Button>
        </Link>

        <SocialCapitalCard className="order-3 mt-12 max-w-md sm:mt-0 sm:order-1" />
      </div>

      <div className="hidden sm:flex sm:items-end sm:justify-between sm:gap-6">
        <div className="pointer-events-none max-w-md">
          <TextScramble
            text="Your audience is your bank account!"
            chars={SCRAMBLE_CHARS_ALPHANUMERIC}
            className="font-pixel text-xl text-neutral-900"
          />
          <TextScramble
            text={HERO_COPY}
            chars={SCRAMBLE_CHARS_ALPHANUMERIC}
            className="mt-1 font-mono text-[13px] leading-relaxed text-neutral-600"
          />
        </div>
        <ScrollIndicator className="pointer-events-auto shrink-0" />
      </div>
    </section>
  );
}
