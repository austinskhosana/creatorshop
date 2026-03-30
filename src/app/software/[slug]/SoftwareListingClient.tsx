"use client";

import { useState } from "react";
import Link from "next/link";

type Deliverable = { quantity: number; type: string; enumValue: string };

type Listing = {
  slug: string;
  name: string;
  brand: string;
  tagline: string;
  description: string;
  logoUrl: string | null;
  planName: string;
  planValue: number;
  deliveryDays: number;
  deliverables: Deliverable[];
  slotsRemaining: number;
};

type ExistingShop = { id: string; status: string } | null;

const STATUS_COPY: Record<string, string> = {
  PENDING:   "Application pending",
  APPROVED:  "Already approved",
  DELIVERED: "Delivery submitted",
  COMPLETED: "Shop completed",
  REVOKED:   "Shop revoked",
};

function deliverablesSummary(deliverables: Deliverable[]) {
  return deliverables.map((d) => `${d.quantity} ${d.type}`).join(" · ");
}

function PayWithPostCard({ listing }: { listing: Listing }) {
  return (
    <div className="rounded-2xl overflow-hidden">
      <div className="bg-[#111111] px-6 pt-6 pb-5">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#A3FF38] flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 58 56" fill="none" className="w-5 h-5">
                <path d="M45.446 0H11.969C5.359 0 0 5.329 0 11.903V44.031C0 50.605 5.359 55.935 11.969 55.935H45.446C52.057 55.935 57.415 50.605 57.415 44.031V11.903C57.415 5.329 52.057 0 45.446 0Z" fill="#A3FF38"/>
                <path d="M45.659 27.311H31.892c-.587 0-.881-.707-.467-1.12l6.563-6.526a.75.75 0 000-1.061.75.75 0 00-1.063 0l-6.563 6.527c-.416.413-1.125.12-1.125-.465V11.109a.662.662 0 00-.662-.657.662.662 0 00-.663.657V24.8c0 .585-.711.877-1.125.465l-6.563-6.527a.75.75 0 00-1.062 0 .75.75 0 000 1.06l6.562 6.527c.415.414.12 1.12-.466 1.12H11.756a.662.662 0 00-.66.657c0 .361.295.656.66.656h13.767c.587 0 .881.707.466 1.12l-6.562 6.527a.75.75 0 000 1.06.75.75 0 001.062 0l6.563-6.527c.414-.413 1.125-.12 1.125.465v13.691c0 .362.296.657.663.657.366 0 .662-.294.662-.657V30.635c0-.585.711-.877 1.125-.465l6.563 6.527a.75.75 0 001.062 0 .75.75 0 000-1.06l-6.563-6.527c-.414-.413-.12-1.12.467-1.12H45.66a.662.662 0 00.66-.656.662.662 0 00-.66-.657z" fill="#181818"/>
              </svg>
            </div>
            <div>
              <div className="text-[11px] text-white/40 uppercase tracking-widest font-medium">Pay with</div>
              <div className="text-[16px] text-white font-semibold leading-tight">Post</div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[11px] text-white/40 uppercase tracking-widest font-medium">Plan value</div>
            <div className="text-[20px] text-[#A3FF38] font-semibold">
              ${listing.planValue}
              <span className="text-[13px] text-white/40 font-normal">/yr</span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mb-5" />

        <div className="space-y-3">
          {listing.deliverables.map((d) => (
            <div key={d.type} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#A3FF38]" />
                <span className="text-[14px] text-white/60">{d.type}</span>
              </div>
              <span className="text-[14px] text-white font-medium">×{d.quantity}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#1A1A1A] px-6 py-3.5 flex items-center justify-between">
        <span className="text-[12px] text-white/40">{deliverablesSummary(listing.deliverables)}</span>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#A3FF38]" />
          <span className="text-[12px] text-[#A3FF38] font-medium">
            {listing.slotsRemaining} {listing.slotsRemaining === 1 ? "slot" : "slots"} left
          </span>
        </div>
      </div>
    </div>
  );
}

export default function SoftwareListingClient({
  listing,
  existingShop,
}: {
  listing: Listing;
  existingShop: ExistingShop;
}) {
  const [state, setState] = useState<"idle" | "form" | "loading" | "applied" | "error">("idle");
  const [pitch, setPitch] = useState("");
  const [deliverable, setDeliverable] = useState(listing.deliverables[0]?.enumValue ?? "");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleApply() {
    if (!pitch.trim()) { setErrorMsg("Tell the brand what you'll create."); return; }
    if (!deliverable)  { setErrorMsg("Select a deliverable type."); return; }
    setState("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: listing.slug, pitch, deliverable }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      setState("applied");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      setState("error");
    }
  }

  return (
    <div className="min-h-full py-10 pb-24 px-16 flex flex-col">

      {/* ── Back ── */}
      <Link
        href="/explore"
        className="inline-flex items-center gap-2 text-[14px] text-gray-400 hover:text-gray-700 transition-colors duration-[120ms] mb-14 w-fit"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
        </svg>
        Back to Explore
      </Link>

      {/* ── Single-column layout ── */}
      <div className="flex flex-col gap-6 w-[420px] mx-auto">

        {/* Logo area */}
        <div className="w-full h-52 rounded-3xl bg-gray-100 flex items-center justify-center">
          {listing.logoUrl ? (
            <img src={listing.logoUrl} alt={listing.name} className="w-20 h-20 object-contain" />
          ) : (
            <span className="text-7xl font-bold text-gray-300">{listing.name[0]}</span>
          )}
        </div>

        {/* Brand + name */}
        <div>
          <div className="text-[13px] text-gray-400 uppercase tracking-widest font-medium mb-1">
            {listing.brand} · {listing.planName}
          </div>
          <h1 className="text-[28px] font-semibold text-gray-900 leading-tight">
            {listing.name}
          </h1>
        </div>

        {/* Description */}
        <p className="text-[15px] text-gray-500 leading-relaxed -mt-2">
          {listing.description}
        </p>

        {/* Pay with Post card */}
        <PayWithPostCard listing={listing} />

        {/* Delivery note */}
        <p className="text-[13px] text-gray-400 text-center -mt-2">
          Deliver within {listing.deliveryDays} days of approval
        </p>

        {/* Apply section */}
        {existingShop ? (
          <div className="flex flex-col gap-2">
            <div className="w-full py-4 rounded-2xl bg-gray-100 text-gray-400 text-[16px] font-medium text-center cursor-not-allowed select-none">
              {STATUS_COPY[existingShop.status] ?? "Already applied"}
            </div>
            <Link
              href={`/shops/${existingShop.id}`}
              className="text-[13px] text-gray-400 hover:text-gray-700 transition-colors duration-[120ms] text-center"
            >
              View your shop →
            </Link>
          </div>
        ) : state === "applied" ? (
          <div className="w-full py-4 rounded-2xl bg-gray-100 text-gray-500 text-[16px] font-medium text-center">
            Application sent — we&apos;ll be in touch.
          </div>
        ) : state === "form" || state === "loading" || state === "error" ? (
          <div className="flex flex-col gap-3">
            {/* Deliverable selector */}
            {listing.deliverables.length > 1 && (
              <div className="flex flex-col gap-2">
                <p className="text-[13px] font-medium text-gray-600">What will you create?</p>
                <div className="flex flex-wrap gap-2">
                  {listing.deliverables.map((d) => (
                    <button
                      key={d.enumValue}
                      type="button"
                      onClick={() => setDeliverable(d.enumValue)}
                      className={[
                        "px-3.5 py-2 rounded-xl border text-[13px] font-medium transition-all duration-[120ms]",
                        deliverable === d.enumValue
                          ? "bg-neutral-900 border-neutral-900 text-white"
                          : "border-gray-200 text-gray-500 hover:border-gray-300",
                      ].join(" ")}
                    >
                      {d.type}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Pitch textarea */}
            <textarea
              value={pitch}
              onChange={(e) => setPitch(e.target.value)}
              placeholder="Tell the brand what you'll create and why you're a good fit…"
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[14px] text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-gray-400 transition-colors duration-[120ms] resize-none"
            />

            {state === "error" && (
              <p className="text-[13px] text-red-500 -mt-1">{errorMsg}</p>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => { setState("idle"); setErrorMsg(""); }}
                className="flex-1 py-3.5 rounded-2xl border border-gray-200 text-gray-500 text-[15px] font-medium hover:border-gray-300 transition-colors duration-[120ms]"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                disabled={state === "loading"}
                className="flex-[2] py-3.5 rounded-2xl bg-[#A3FF38] border border-[#82F200] shadow-[inset_3px_3px_6px_rgba(255,255,255,0.4)] text-gray-900 text-[15px] font-semibold hover:brightness-95 active:scale-[0.98] transition-[filter,transform] duration-[140ms] disabled:opacity-50"
              >
                {state === "loading" ? "Sending…" : "Send Application"}
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => listing.slotsRemaining > 0 && setState("form")}
            disabled={listing.slotsRemaining === 0}
            className="w-full py-4 rounded-2xl bg-[#A3FF38] border border-[#82F200] shadow-[inset_3px_3px_6px_rgba(255,255,255,0.4)] text-gray-900 text-[16px] font-semibold hover:brightness-95 active:scale-[0.98] transition-[filter,transform] duration-[140ms] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {listing.slotsRemaining === 0 ? "No slots available" : "Apply to Purchase"}
          </button>
        )}

      </div>
    </div>
  );
}
