"use client";

import { use, useState } from "react";
import Link from "next/link";

// ── Mock data ─────────────────────────────────────────────────────────────────
// Stand-in for a database fetch. Keyed by product ID.

type PostRequirement = {
  quantity: number;
  type: string; // e.g. "Feed Post", "Story", "Reel"
};

type Product = {
  id: string;
  name: string;
  brand: string;
  description: string;
  image: string; // placeholder colour for now
  retailValue: number;
  requirements: PostRequirement[];
  category: string;
  availableClaims: number;
};

const PRODUCTS: Record<string, Product> = {
  "chuck-taylor": {
    id: "chuck-taylor",
    name: "Chuck Taylor All Star '70 Hi",
    brand: "Converse",
    description:
      "The All Star '70 brings back the original Chuck Taylor construction — thicker foxing tape, a puffier tongue, and better cushioning than the classic. A staple silhouette that works across every aesthetic.",
    image: "#F0F0F0",
    retailValue: 110,
    requirements: [
      { quantity: 2, type: "Stories" },
      { quantity: 1, type: "Reel" },
      { quantity: 2, type: "Feed Posts" },
    ],
    category: "Fashion",
    availableClaims: 2,
  },
  "adidas-samba": {
    id: "adidas-samba",
    name: "Adidas Samba OG",
    brand: "Adidas",
    description:
      "Originally designed for indoor football in the 1950s, the Samba has become one of the most enduring sneaker silhouettes of all time. Clean, low-profile, and instantly recognisable.",
    image: "#EAEAEA",
    retailValue: 100,
    requirements: [
      { quantity: 1, type: "Reel" },
      { quantity: 3, type: "Stories" },
    ],
    category: "Fashion",
    availableClaims: 1,
  },
  "waterproof-boot": {
    id: "waterproof-boot",
    name: "Premium Waterproof Boot",
    brand: "Timberland",
    description:
      "Built for whatever the forecast throws at you. Full-grain waterproof leather, seam-sealed construction, and a lug sole that handles both city streets and trail conditions.",
    image: "#E8DDD0",
    retailValue: 198,
    requirements: [
      { quantity: 2, type: "Feed Posts" },
      { quantity: 4, type: "Stories" },
      { quantity: 1, type: "Reel" },
    ],
    category: "Fashion",
    availableClaims: 6,
  },
};

// Fallback for unknown IDs
const FALLBACK: Product = PRODUCTS["chuck-taylor"];

// ── Helpers ───────────────────────────────────────────────────────────────────

// Formats the requirements into a readable summary line
// e.g. "2 Stories · 1 Reel · 2 Feed Posts"
function requirementsSummary(reqs: PostRequirement[]) {
  return reqs.map((r) => `${r.quantity} ${r.type}`).join(" · ");
}

// ── Payment card ──────────────────────────────────────────────────────────────
// This is the centrepiece of the redesign — it makes the post exchange feel
// like a real payment method in a checkout flow, not just a text field.

function PayWithPostCard({ product }: { product: Product }) {
  return (
    <div className="rounded-2xl overflow-hidden">
      {/* Dark card body — mimics a payment card / Apple Pay sheet */}
      <div className="bg-[#111111] px-6 pt-6 pb-5">

        {/* Top row: icon + label */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {/* Creatorshop icon tile */}
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

          {/* Retail value badge */}
          <div className="text-right">
            <div className="text-[11px] text-white/40 uppercase tracking-widest font-medium">Value</div>
            <div className="text-[20px] text-[#A3FF38] font-semibold">${product.retailValue}</div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mb-5" />

        {/* Post requirements — styled like transaction line items */}
        <div className="space-y-3">
          {product.requirements.map((req) => (
            <div key={req.type} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {/* Small green dot per line item */}
                <div className="w-1.5 h-1.5 rounded-full bg-[#A3FF38]" />
                <span className="text-[14px] text-white/60">{req.type}</span>
              </div>
              <span className="text-[14px] text-white font-medium">×{req.quantity}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Summary strip at the bottom of the card */}
      <div className="bg-[#1A1A1A] px-6 py-3.5 flex items-center justify-between">
        <span className="text-[12px] text-white/40">{requirementsSummary(product.requirements)}</span>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#A3FF38]" />
          <span className="text-[12px] text-[#A3FF38] font-medium">
            {product.availableClaims} {product.availableClaims === 1 ? "spot" : "spots"} left
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ProductPage({
  params,
}: {
  params: Promise<{ category: string; id: string }>;
}) {
  // `use()` unwraps the params promise in a client component
  const { id, category } = use(params);
  const product = PRODUCTS[id] ?? FALLBACK;

  const [applied, setApplied] = useState(false);

  return (
    <div className="min-h-full p-8 flex flex-col">

      {/* ── Back button ──────────────────────────────────────────────── */}
      <Link
        href={`/shop/${category}`}
        className="inline-flex items-center gap-2 text-[14px] text-gray-400 hover:text-gray-700 transition-colors duration-[120ms] mb-8 w-fit"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
        </svg>
        Back to {category.charAt(0).toUpperCase() + category.slice(1)}
      </Link>

      {/* ── Two-column layout ─────────────────────────────────────────── */}
      <div className="flex gap-12 flex-1 items-start max-w-5xl">

        {/* Left — product image */}
        <div
          className="flex-shrink-0 w-[440px] h-[480px] rounded-3xl flex items-center justify-center"
          style={{ backgroundColor: product.image }}
        >
          {/* Placeholder — swap for <Image> when real assets exist */}
          <div className="text-gray-300 text-[14px]">Product Image</div>
        </div>

        {/* Right — details */}
        <div className="flex-1 flex flex-col gap-6 pt-2">

          {/* Brand + name */}
          <div>
            <div className="text-[13px] text-gray-400 uppercase tracking-widest font-medium mb-1">
              {product.brand}
            </div>
            <h1 className="text-[32px] font-semibold text-gray-900 leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Description */}
          <p className="text-[15px] text-gray-500 leading-relaxed">
            {product.description}
          </p>

          {/* Pay with Post card */}
          <PayWithPostCard product={product} />

          {/* Apply button */}
          {applied ? (
            <div className="w-full py-4 rounded-2xl bg-gray-100 text-gray-500 text-[16px] font-medium text-center">
              Application sent — we&apos;ll be in touch.
            </div>
          ) : (
            <button
              onClick={() => setApplied(true)}
              className="w-full py-4 rounded-2xl bg-[#A3FF38] border border-[#82F200] shadow-[inset_3px_3px_6px_rgba(255,255,255,0.4)] text-gray-900 text-[16px] font-semibold hover:brightness-95 active:scale-[0.98] transition-all duration-[140ms]"
            >
              Apply
            </button>
          )}

        </div>
      </div>
    </div>
  );
}
