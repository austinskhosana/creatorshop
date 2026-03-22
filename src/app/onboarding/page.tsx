"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Role = "CREATOR" | "BRAND";

const roles: {
  value: Role;
  label: string;
  description: string;
  detail: string;
}[] = [
  {
    value: "CREATOR",
    label: "Creator",
    description: "I create content",
    detail:
      "Browse software listings and offer a post, video, or article in exchange for access.",
  },
  {
    value: "BRAND",
    label: "Brand",
    description: "I offer software",
    detail:
      "List your software tool and receive quality content from creators in exchange for access.",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
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

      router.push("/dashboard");
    } catch {
      setError("Something went wrong — please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-10">
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
        <div className="flex flex-col gap-3 mb-8">
          {roles.map((role) => {
            const isSelected = selected === role.value;
            return (
              <button
                key={role.value}
                onClick={() => setSelected(role.value)}
                className={[
                  "text-left w-full rounded-xl border px-5 py-4 transition-all duration-150 outline-none",
                  isSelected
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-200 bg-white text-neutral-900 hover:border-neutral-400",
                ].join(" ")}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-base">{role.label}</span>
                  <span
                    className={[
                      "text-xs font-medium",
                      isSelected ? "text-neutral-300" : "text-neutral-400",
                    ].join(" ")}
                  >
                    {role.description}
                  </span>
                </div>
                <p
                  className={[
                    "text-sm leading-relaxed",
                    isSelected ? "text-neutral-300" : "text-neutral-500",
                  ].join(" ")}
                >
                  {role.detail}
                </p>
              </button>
            );
          })}
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-500 mb-4">{error}</p>
        )}

        {/* CTA */}
        <button
          onClick={handleContinue}
          disabled={!selected || loading}
          className="w-full py-3 rounded-xl bg-neutral-900 text-white font-semibold text-sm tracking-wide transition-opacity disabled:opacity-40 hover:opacity-90"
        >
          {loading ? "Setting up…" : "Continue"}
        </button>
      </div>
    </div>
  );
}
