import Image from "next/image";
import Link from "next/link";
import { WaitlistForm } from "@/components/organisms/WaitlistForm";
import { MeshGradientPanel } from "@/components/atoms/MeshGradientPanel";
import { BrandCardVisual } from "@/components/molecules/BrandCardVisual";

export const metadata = { title: "Join the brand waitlist — Creatorshop for brands" };

export default function Page() {
  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="flex flex-col px-5 py-6 sm:px-10 lg:px-16">
        <Link href="/brands" className="w-fit rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2">
          <Image src="/Logo.svg" alt="Creatorshop for brands" width={142} height={41} className="h-8 w-auto" priority />
        </Link>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12">
          <WaitlistForm audience="brand" compact />
        </div>
      </div>
      <div className="hidden p-4 lg:block">
        <MeshGradientPanel className="flex h-full items-center justify-center px-12">
          <BrandCardVisual />
        </MeshGradientPanel>
      </div>
    </div>
  );
}
