"use client";

import { useState } from "react";
import Link from "next/link";

type Listing = {
  slug: string;
  name: string;
  planName: string;
  isActive: boolean;
  totalSlots: number;
  slotsRemaining: number;
  totalApplications: number;
  createdAt: string;
};

function TopUpPanel({ slug, onSuccess }: { slug: string; onSuccess: (added: number) => void }) {
  const [raw, setRaw] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit() {
    const keys = raw.split("\n").map((k) => k.trim()).filter(Boolean);
    if (!keys.length) { setErrorMsg("Paste at least one key."); return; }
    setState("loading");
    setErrorMsg("");
    try {
      const res = await fetch(`/api/listings/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessKeys: keys }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      setRaw("");
      setState("idle");
      onSuccess(data.added as number);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      setState("error");
    }
  }

  return (
    <div className="mt-3 border-t border-gray-100 pt-3 flex flex-col gap-2">
      <p className="text-[12px] text-gray-400">Paste keys — one per line:</p>
      <textarea
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        rows={4}
        placeholder={"key-abc-123\nkey-def-456"}
        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[13px] text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-gray-400 transition-colors duration-[120ms] resize-none font-mono"
      />
      {state === "error" && <p className="text-[12px] text-red-500">{errorMsg}</p>}
      <button
        onClick={handleSubmit}
        disabled={state === "loading"}
        className="self-end px-4 py-2 rounded-xl bg-neutral-900 text-white text-[13px] font-semibold hover:opacity-90 active:scale-[0.98] transition-all duration-[140ms] disabled:opacity-50"
      >
        {state === "loading" ? "Adding…" : "Add Keys"}
      </button>
    </div>
  );
}

function ListingRow({ listing }: { listing: Listing }) {
  const [showTopUp, setShowTopUp] = useState(false);
  const [slotsRemaining, setSlotsRemaining] = useState(listing.slotsRemaining);
  const [isActive, setIsActive] = useState(listing.isActive);

  const slotsFull = slotsRemaining === 0;

  function handleTopUpSuccess(added: number) {
    setSlotsRemaining((n) => n + added);
    setIsActive(true);
    setShowTopUp(false);
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4">

        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-[15px] font-semibold text-neutral-900 truncate">{listing.name}</p>
            <span className="text-[11px] text-gray-400 font-medium">{listing.planName}</span>
          </div>
          <div className="flex items-center gap-4 text-[13px] text-gray-400">
            <span>{listing.totalApplications} applications</span>
            <span
              className={[
                "font-medium",
                slotsFull ? "text-red-500" : slotsRemaining <= 3 ? "text-amber-500" : "text-emerald-600",
              ].join(" ")}
            >
              {slotsRemaining} / {listing.totalSlots} slots left
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className={[
              "text-[11px] font-medium px-2.5 py-1 rounded-full",
              isActive ? "bg-[#EDFFD0] text-[#3A7A00]" : "bg-gray-100 text-gray-400",
            ].join(" ")}
          >
            {isActive ? "Active" : "Closed"}
          </span>

          <button
            onClick={() => setShowTopUp((v) => !v)}
            className="text-[13px] font-medium px-3.5 py-1.5 rounded-xl border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-all duration-[120ms]"
          >
            {showTopUp ? "Cancel" : "Top up keys"}
          </button>
        </div>

      </div>

      {showTopUp && (
        <TopUpPanel slug={listing.slug} onSuccess={handleTopUpSuccess} />
      )}
    </div>
  );
}

export default function ListingsClient({ listings }: { listings: Listing[] }) {
  return (
    <div className="p-10 pl-20 flex flex-col items-center">
      <div className="w-full max-w-3xl">

        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold text-neutral-900">My Listings</h1>
            <p className="text-[15px] text-gray-400">Manage your active listings and top up access keys.</p>
          </div>
          <Link
            href="/campaigns/new"
            className="px-4 py-2.5 rounded-xl bg-neutral-900 text-white text-[13px] font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] hover:opacity-90 transition-opacity"
          >
            + New listing
          </Link>
        </div>

        {listings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <p className="text-gray-400 text-[15px] mb-4">No listings yet. Create your first one.</p>
            <Link
              href="/campaigns/new"
              className="px-5 py-2.5 rounded-xl bg-neutral-900 text-white text-sm font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] hover:opacity-90 transition-opacity"
            >
              Create a listing
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {listings.map((listing) => (
              <ListingRow key={listing.slug} listing={listing} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
