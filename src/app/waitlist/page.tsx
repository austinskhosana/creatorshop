import Image from "next/image";
import Link from "next/link";
import { WaitlistForm } from "@/components/organisms/WaitlistForm";
import WaitlistGradient from "@/components/organisms/WaitlistForm/WaitlistGradient";

export const metadata = { title: "Join the creator waitlist — Creatorshop" };

export default function Page() {
  return (
    <main className="min-h-screen bg-white lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(520px,1fr)]">
      <section className="relative hidden min-h-screen overflow-hidden lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
        <WaitlistGradient />
        <Link href="/" className="relative z-10 w-fit rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2">
          <Image src="/Logo.svg" alt="Creatorshop" width={142} height={41} className="h-8 w-auto" priority />
        </Link>

        <div className="relative z-10 max-w-lg pb-2">
          <h1 className="text-balance text-4xl font-medium leading-[1.04] tracking-[-0.035em] text-neutral-950 xl:text-5xl">
            Ditch the subscription,
            <br />
            pay with a post instead.
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-neutral-700">
            Join the first creators using posts to pay for software.
          </p>
        </div>
      </section>

      <section className="relative flex min-h-screen items-center justify-center px-5 py-24 sm:px-10 lg:px-14 lg:py-12 xl:px-20">
        <Link href="/" className="absolute top-6 left-5 w-fit rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 sm:left-10 lg:hidden">
          <Image src="/Logo.svg" alt="Creatorshop" width={142} height={41} className="h-8 w-auto" priority />
        </Link>

        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-medium tracking-[-0.03em] text-neutral-950">Join the waitlist</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-neutral-500 lg:mx-0">
              Join the first creators using posts to pay for software.
            </p>
          </div>
          <WaitlistForm audience="creator" compact showIntro={false} />
        </div>
      </section>
    </main>
  );
}
