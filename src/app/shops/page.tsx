"use client";

import { useState, useRef, useLayoutEffect, useEffect } from "react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";

type ShopStatus = "PENDING" | "APPROVED" | "DENIED" | "DELIVERED" | "COMPLETED" | "REVOKED";

type Shop = {
  id: string;
  slug: string;
  name: string;
  logoUrl: string | null;
  planName: string;
  months: number;
  postsRequired: number;
  status: ShopStatus;
};

const MOCK_SHOPS: Shop[] = [
  { id: "1", slug: "notion-plus",        name: "Notion",    logoUrl: null, planName: "Plus",         months: 3, postsRequired: 1, status: "APPROVED" },
  { id: "2", slug: "figma-pro",          name: "Figma",     logoUrl: null, planName: "Professional", months: 1, postsRequired: 2, status: "PENDING" },
  { id: "3", slug: "capcut-pro",         name: "CapCut",    logoUrl: null, planName: "Pro",          months: 2, postsRequired: 1, status: "DELIVERED" },
  { id: "4", slug: "mailchimp-standard", name: "Mailchimp", logoUrl: null, planName: "Standard",     months: 3, postsRequired: 3, status: "COMPLETED" },
  { id: "5", slug: "buffer-essentials",  name: "Buffer",    logoUrl: null, planName: "Essentials",   months: 1, postsRequired: 1, status: "DENIED" },
];

const FILTERS = ["All", "Pending", "Approved", "Delivered", "Completed", "Denied", "Revoked"] as const;
type Filter = typeof FILTERS[number];

const STATUS_LABEL: Record<ShopStatus, string> = {
  PENDING:   "Pending",
  APPROVED:  "Approved",
  DENIED:    "Denied",
  DELIVERED: "Delivered",
  COMPLETED: "Completed",
  REVOKED:   "Revoked",
};

function ShopCard({ shop }: { shop: Shop }) {
  return (
    <div className="flex flex-col rounded-3xl border border-gray-200 bg-white p-3 gap-3 h-full">

      {/* ── Logo area ── */}
      <div className="flex items-center justify-center h-36 bg-gray-100 rounded-2xl">
        {shop.logoUrl ? (
          <img src={shop.logoUrl} alt={shop.name} className="w-20 h-20 object-contain" />
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-gray-200 flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-400">{shop.name[0]}</span>
          </div>
        )}
      </div>

      {/* ── Info ── */}
      <div className="flex flex-col gap-2 px-1 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-lg font-semibold text-neutral-900 leading-snug">{shop.name}</p>
          <Badge variant={shop.status} label={STATUS_LABEL[shop.status]} />
        </div>

        <p className="text-sm text-gray-400 leading-snug">
          Get {shop.months} {shop.months === 1 ? "month" : "months"} of {shop.name} {shop.planName}
        </p>
      </div>

      {/* ── Button ── */}
      <Link
        href={shop.status === "APPROVED" ? `/access/${shop.id}` : `/software/${shop.slug}`}
        className="w-full bg-neutral-900 text-white text-sm font-semibold text-center py-3 rounded-xl hover:opacity-90 transition-opacity"
      >
        {shop.status === "APPROVED" ? "Get Access" : "View Brief"}
      </Link>

    </div>
  );
}

export default function ShopsPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>("All");

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [pill, setPill] = useState({ left: 0, width: 0, ready: false });

  useLayoutEffect(() => {
    const el = tabRefs.current[0];
    if (el) setPill({ left: el.offsetLeft, width: el.offsetWidth, ready: false });
  }, []);

  useEffect(() => {
    const idx = FILTERS.indexOf(activeFilter);
    const el = tabRefs.current[idx];
    if (el) setPill({ left: el.offsetLeft, width: el.offsetWidth, ready: true });
  }, [activeFilter]);

  const filtered = activeFilter === "All"
    ? MOCK_SHOPS
    : MOCK_SHOPS.filter((s) => s.status === activeFilter.toUpperCase());

  return (
    <div className="p-10 pl-20">

      {/* ── Header ── */}
      <div className="flex flex-col gap-1 mb-6">
        <h1 className="text-3xl font-bold text-neutral-900">My Shops</h1>
        <p className="text-[15px] text-gray-400">Track the status of everything you&apos;ve applied for.</p>
      </div>

      {/* ── Status filter tabs ── */}
      <div className="relative flex gap-1 border border-gray-200 rounded-xl p-1 w-fit mb-8">
        <div
          className="absolute top-1 bottom-1 rounded-lg bg-white shadow-sm border border-gray-200 will-change-transform"
          style={{
            left: 0,
            width: pill.width,
            transform: `translateX(${pill.left}px)`,
            transition: pill.ready
              ? [
                  "transform 320ms cubic-bezier(0.34, 1.1, 0.64, 1)",
                  "width 280ms cubic-bezier(0.34, 1.1, 0.64, 1)",
                ].join(", ")
              : "none",
          }}
        />
        {FILTERS.map((filter, i) => (
          <button
            key={filter}
            ref={(el) => { tabRefs.current[i] = el; }}
            onClick={() => setActiveFilter(filter)}
            className={[
              "relative z-10 px-4 py-1.5 rounded-lg text-sm font-medium",
              "transition-colors duration-[200ms]",
              activeFilter === filter ? "text-neutral-900" : "text-gray-500 hover:text-gray-800",
            ].join(" ")}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* ── Grid ── */}
      {MOCK_SHOPS.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <p className="text-gray-400 text-[15px] mb-4">You haven&apos;t applied for anything yet.</p>
          <Link
            href="/explore"
            className="px-5 py-2.5 rounded-xl bg-neutral-900 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Browse Software
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6 max-w-4xl">
          {filtered.map((shop, i) => (
            <div
              key={shop.id + activeFilter}
              style={{
                animationName: "card-enter",
                animationDuration: "0.55s",
                animationTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                animationFillMode: "both",
                animationDelay: `${i * 90}ms`,
              }}
            >
              <ShopCard shop={shop} />
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
