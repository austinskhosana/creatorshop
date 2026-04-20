"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface SeedBannerProps {
  brandUserId: string;
  hasPending: boolean;
}

export default function SeedBanner({ brandUserId, hasPending }: SeedBannerProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function seed() {
    setLoading(true);
    setMessage(null);
    const res = await fetch(`/api/dev/seed?brandUserId=${brandUserId}`, { method: "POST" });
    const data = await res.json();
    setMessage(data.message ?? (res.ok ? "Seeded!" : data.error));
    setLoading(false);
    if (res.ok) router.refresh();
  }

  async function wipe() {
    setLoading(true);
    setMessage(null);
    const res = await fetch(`/api/dev/seed?brandUserId=${brandUserId}`, { method: "DELETE" });
    const data = await res.json();
    setMessage(data.message ?? (res.ok ? "Wiped!" : data.error));
    setLoading(false);
    if (res.ok) router.refresh();
  }

  return (
    <div className="flex items-center gap-3 px-6 py-2.5 bg-amber-50 border-b border-amber-200 text-[12px]">
      <span className="px-1.5 py-0.5 rounded bg-amber-200 text-amber-800 font-bold tracking-wide uppercase text-[10px]">
        Dev
      </span>
      <span className="text-amber-700 flex-1">
        {message ?? (hasPending ? "6 seeded applications loaded." : "No pending applications — seed some to test the flow.")}
      </span>
      <button
        onClick={seed}
        disabled={loading}
        className="px-3 py-1 rounded-lg bg-amber-900 text-white text-[11px] font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
      >
        {loading ? "…" : "Seed creators"}
      </button>
      <button
        onClick={wipe}
        disabled={loading}
        className="px-3 py-1 rounded-lg border border-amber-300 text-amber-700 text-[11px] font-semibold hover:bg-amber-100 disabled:opacity-50 transition-colors"
      >
        Wipe seed data
      </button>
    </div>
  );
}
