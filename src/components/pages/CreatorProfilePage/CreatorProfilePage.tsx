"use client";

import Link from "next/link";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { CreatorProfileCard } from "@/components/molecules/CreatorProfileCard";
import { CreatorShell } from "@/components/templates/CreatorShell";
import { CREATOR } from "@/lib/mock-creator";

export default function CreatorProfilePage() {
  return (
    <CreatorShell>
      <main className="relative min-h-screen w-full px-4 py-6 sm:px-5 sm:py-8">
        <div className="flex min-h-[calc(100vh-3rem)] w-full items-center justify-center sm:min-h-[calc(100vh-4rem)]">
          <div className="w-full max-w-[650px]">
            <div className="flex justify-end">
              <Link
                href="/settings"
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-900 transition-[background-color,border-color,transform] duration-150 hover:border-neutral-300 hover:bg-neutral-50 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
              >
                <PencilSquareIcon aria-hidden="true" className="size-4" />
                Edit profile
              </Link>
            </div>

            <CreatorProfileCard creator={CREATOR} className="mt-3" />
          </div>
        </div>
      </main>
    </CreatorShell>
  );
}
