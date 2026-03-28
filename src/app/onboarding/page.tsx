"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import CreatorCard from "@/components/CreatorCard";
import BrandCard from "@/components/BrandCard";

type Role = "CREATOR" | "BRAND";

export default function OnboardingPage() {
  const router = useRouter();
  const { session } = useClerk();
  const [selected, setSelected] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleContinue() {
    if (!selected) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: selected }),
      });

      if (!res.ok) throw new Error("Something went wrong");

      // Force the session JWT to refresh so the middleware sees
      // onboardingComplete: true on the very next request.
      await session?.reload();

      router.push(selected === "CREATOR" ? "/explore" : "/dashboard");
    } catch {
      setError("Something went wrong — please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col items-center justify-center px-6">
      <div className="flex flex-col items-center w-full max-w-3xl">

        {/* Header */}
        <div className="mb-12 text-center">
          <p className="text-xs font-medium tracking-widest uppercase text-neutral-400 mb-3">
            Welcome to Creatorshop
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 leading-tight">
            How will you use Creatorshop?
          </h1>
          <p className="mt-3 text-neutral-500 text-sm leading-relaxed">
            Pick one to start — you can always do both later.
          </p>
        </div>

        {/* Role cards */}
        <div className="flex gap-6 mb-10">
          <CreatorCard
            isSelected={selected === "CREATOR"}
            onClick={() => setSelected("CREATOR")}
          />
          <BrandCard
            isSelected={selected === "BRAND"}
            onClick={() => setSelected("BRAND")}
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-500 mb-4">{error}</p>
        )}

        {/* CTA */}
        <button
          onClick={handleContinue}
          disabled={!selected || loading}
          className="w-full max-w-xs py-3 rounded-xl bg-neutral-900 text-white font-semibold text-sm tracking-wide transition-opacity disabled:opacity-40 hover:opacity-90"
        >
          {loading ? "Setting up…" : "Continue"}
        </button>

      </div>
    </div>
  );
}
