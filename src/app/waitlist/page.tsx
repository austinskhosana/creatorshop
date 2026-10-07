import Image from "next/image";
import Link from "next/link";
import { WaitlistForm } from "@/components/organisms/WaitlistForm";
import { SocialCapitalCard } from "@/components/organisms/SocialCapitalCard";

export const metadata = { title: "Join the creator waitlist — Creatorshop" };

export default function Page() {
  return (
    <div className="relative grid min-h-screen bg-white lg:grid-cols-[minmax(0,0.92fr)_minmax(0,0.92fr)]">
      <div className="relative flex min-h-screen items-center px-5 py-24 sm:px-10 lg:pr-8 lg:pl-16">
        <Link href="/" className="absolute top-6 left-5 w-fit rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 sm:left-10 lg:left-16">
          <Image src="/Logo.svg" alt="Creatorshop" width={142} height={41} className="h-8 w-auto" priority />
        </Link>
        <div className="mx-auto w-full max-w-md">
          <WaitlistForm audience="creator" compact />
        </div>
      </div>
      <div className="hidden items-center justify-start py-12 pr-16 pl-8 lg:flex">
        <div className="w-full max-w-2xl rounded-[32px] bg-[#DCDCDE] p-px">
          <div className="flex min-h-[680px] items-center justify-center rounded-[31px] bg-white px-14">
            <SocialCapitalCard className="w-full max-w-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
