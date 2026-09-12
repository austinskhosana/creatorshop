import Image from "next/image";
import { Button } from "@/components/atoms/Button";
import { LocationTime } from "@/components/atoms/LocationTime";
import { PixelTrail } from "@/components/atoms/PixelTrail";
import { ScrollIndicator } from "@/components/atoms/ScrollIndicator";
import { SocialCapitalCard } from "@/components/organisms/SocialCapitalCard";

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

      <div className="pointer-events-none flex items-start justify-between">
        <Image src="/Logo.svg" alt="Creatorshop" width={142} height={41} className="h-9 w-auto" priority />
        <LocationTime className="pointer-events-none mt-1.5" />
      </div>

      <div className="pointer-events-none flex flex-1 flex-col items-center justify-center gap-8">
        <SocialCapitalCard className="max-w-md" />
        <Button
          variant="dark"
          size="md"
          pill
          className="pointer-events-auto min-w-[150px]"
          style={{ boxShadow: "none" }}
        >
          Sign Up
        </Button>
      </div>

      <div className="flex items-end justify-between gap-6">
        <div className="pointer-events-none max-w-md">
          <h1 className="font-pixel text-xl text-neutral-900">
            Your audience is your bank account!
          </h1>
          <p className="mt-1 font-mono text-[13px] leading-relaxed text-neutral-600">
            Apply to software access listings and if brands approve, you can pay
            using content you create for the brand. No cash required.
          </p>
        </div>
        <ScrollIndicator className="pointer-events-auto shrink-0" />
      </div>
    </section>
  );
}
