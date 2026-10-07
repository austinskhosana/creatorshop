import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { EmptyBag } from "@/components/atoms/EmptyBag";
import { EmptyBell } from "@/components/atoms/EmptyBell";
import { EmptyBox } from "@/components/atoms/EmptyBox";
import { EmptyCart } from "@/components/atoms/EmptyCart";
import { EmptyChat } from "@/components/atoms/EmptyChat";
import { EmptyCompass } from "@/components/atoms/EmptyCompass";
import { EmptyEnvelope } from "@/components/atoms/EmptyEnvelope";
import { EmptySearch } from "@/components/atoms/EmptySearch";
import { EmptyStorefront } from "@/components/atoms/EmptyStorefront";
import { GenieLamp } from "@/components/atoms/GenieLamp";
import { MoneyStack } from "@/components/atoms/MoneyStack";
import { WishingStar } from "@/components/atoms/WishingStar";
import { cn } from "@/lib/utils";

const DRAWINGS = {
  "genie-lamp": <GenieLamp className="h-72 w-[36rem] text-neutral-950" />,
  "money-stack": <MoneyStack className="h-64 w-[36rem] text-neutral-950" />,
  "empty-cart": <EmptyCart className="h-[26rem] w-[38rem] text-neutral-950" />,
  "empty-chat": <EmptyChat className="h-[26rem] w-[38rem] text-neutral-950" />,
  "empty-search": <EmptySearch className="h-[26rem] w-[38rem] text-neutral-950" />,
  "empty-bag": <EmptyBag className="h-[26rem] w-[38rem] text-neutral-950" />,
  "empty-storefront": <EmptyStorefront className="h-[26rem] w-[38rem] text-neutral-950" />,
  "empty-box": <EmptyBox className="h-[26rem] w-[38rem] text-neutral-950" />,
  "empty-bell": <EmptyBell className="h-[26rem] w-[38rem] text-neutral-950" />,
  "wishing-star": <WishingStar className="h-[26rem] w-[38rem] text-neutral-950" />,
  "empty-envelope": <EmptyEnvelope className="h-[26rem] w-[38rem] text-neutral-950" />,
  "empty-compass": <EmptyCompass className="h-[26rem] w-[38rem] text-neutral-950" />,
} satisfies Record<string, ReactNode>;

export default async function DrawingShowcasePage({
  searchParams,
}: {
  searchParams: Promise<{ piece?: string }>;
}) {
  const piece = (await searchParams).piece ?? "genie-lamp";
  const drawing = DRAWINGS[piece as keyof typeof DRAWINGS];

  if (!drawing) notFound();

  return (
    <main className="grid min-h-screen place-items-center bg-white">
      <div
        data-recording-stage={piece}
        className={cn(
          "grid aspect-square w-screen max-w-[1080px] place-items-center overflow-hidden bg-white",
          "p-28 text-neutral-950",
        )}
      >
        {drawing}
      </div>
    </main>
  );
}
