"use client";

import { Button } from "@/components/atoms/Button";
import { Fire } from "@/components/atoms/Fire";
import { Logo3D } from "@/components/atoms/Logo3D";

export default function NextSection() {
  return (
    <section className="sticky top-0 z-10 flex h-screen flex-col items-center justify-center overflow-hidden bg-[#a2ff38] px-6 pb-20 text-center sm:pb-28">
      <Fire
        background="#a2ff38"
        rows={90}
        widthPercent={100}
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-full w-full"
      />
      <div className="pointer-events-auto mb-10">
        <Logo3D className="h-36 w-36 sm:h-44 sm:w-44" spinWithScroll />
      </div>
      <h2 className="pointer-events-none font-pixel max-w-4xl text-4xl leading-tight text-black sm:text-5xl">
        Ditch the subscription. You&apos;re too hot to pay for software.
      </h2>
      <p className="pointer-events-none mt-6 max-w-xl font-mono text-sm text-black/70 sm:text-base">
        Apply to software access listings and if brands approve, you can pay
        using content you create for the brand. No cash required.
      </p>
      <Button
        variant="dark"
        size="lg"
        pill
        className="pointer-events-auto mt-8 min-w-[160px]"
        style={{ boxShadow: "none", color: "#A3FF38" }}
      >
        Sign Up
      </Button>
    </section>
  );
}
