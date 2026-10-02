"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { EmptyState } from "@/components/molecules/EmptyState";
import { WishCard } from "@/components/molecules/WishCard";
import { MakeAWishForm } from "@/components/organisms/MakeAWishForm";
import { CreatorShell } from "@/components/templates/CreatorShell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { creatorStore, useGenieIndex } from "@/lib/store/creator-store";

type View = "all" | "mine";

export default function GenieIndexPage() {
  const rows = useGenieIndex();
  const reduceMotion = useReducedMotion();
  const [view, setView] = useState<View>("all");
  const mine = rows.filter((row) => row.wished);
  const visible = view === "mine" ? mine : rows;

  return (
    <CreatorShell>
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
        <MakeAWishForm rows={rows} />

        <section aria-labelledby="genie-index-heading" className="mt-10">
          <h1 id="genie-index-heading" className="text-[20px] font-semibold tracking-[-0.02em] text-neutral-950">
            Genie Index
          </h1>
          <p className="mt-1 text-sm text-neutral-500">The software creators most want to pay for with a post.</p>

          <Tabs value={view} onValueChange={(value) => setView(value as View)} className="mt-6">
            <TabsList>
              <TabsTrigger value="all">
                All<span className="ml-1.5 text-xs font-medium tabular-nums">{rows.length}</span>
              </TabsTrigger>
              <TabsTrigger value="mine">
                My wishes<span className="ml-1.5 text-xs font-medium tabular-nums">{mine.length}</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value={view} className="mt-6">
              {visible.length ? (
                <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {visible.map((row) => (
                    // Cards shift as wishes are added or taken back; the layout animation keeps that easy to follow.
                    <motion.li key={row.brandKey} layout={reduceMotion ? false : "position"} transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}>
                      <WishCard
                        brandKey={row.brandKey}
                        brandName={row.brandName}
                        website={row.website}
                        description={row.description}
                        category={row.category}
                        wished={row.wished}
                        onToggle={() => (row.wished ? creatorStore.withdrawWish(row.brandKey) : creatorStore.makeWish(row.brandName, row.website))}
                      />
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <EmptyState
                  icon={<SparklesIcon className="size-5" strokeWidth={1.75} />}
                  title="No wishes yet"
                  description="Wish for any brand in the index, or make a wish for one that isn't there."
                  action={{ label: "Browse all", onClick: () => setView("all") }}
                  secondaryAction={{ label: "Make a wish", onClick: () => document.getElementById("make-a-wish")?.focus() }}
                />
              )}
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </CreatorShell>
  );
}
