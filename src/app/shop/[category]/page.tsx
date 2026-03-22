"use client";

import { use, useState } from "react";
import Link from "next/link";

// ── Mock data ─────────────────────────────────────────────────────────────────

type Product = {
  id: string;
  name: string;
  description: string;
  image: string; // placeholder colour
  postCount: number;
  subcategory: string;
};

const PRODUCTS_BY_CATEGORY: Record<string, { subcategories: string[]; products: Product[] }> = {
  fashion: {
    subcategories: ["All", "Shoes", "Tops", "Bottoms", "Accessories", "Outerwear", "Bags", "Swimwear"],
    products: [
      { id: "adidas-samba",    name: "Adidas Samba OG",              description: "A timeless icon of street style.", image: "#EAEAEA", postCount: 1, subcategory: "Shoes" },
      { id: "chuck-taylor",    name: "Chuck Taylor All Star '70 Hi", description: "A timeless icon of street style.", image: "#E0E0E0", postCount: 2, subcategory: "Shoes" },
      { id: "waterproof-boot", name: "Premium Waterproof Boot",      description: "A timeless icon of street style.", image: "#E8DDD0", postCount: 6, subcategory: "Shoes" },
      { id: "linen-shirt",     name: "Relaxed Linen Shirt",          description: "Effortless warm-weather dressing.", image: "#D8E8D8", postCount: 3, subcategory: "Tops" },
      { id: "cargo-pants",     name: "Utility Cargo Trousers",       description: "Functional meets fashion-forward.", image: "#D8D8E8", postCount: 1, subcategory: "Bottoms" },
      { id: "leather-tote",    name: "Structured Leather Tote",      description: "A carry-everything everyday bag.",  image: "#E8D8C8", postCount: 4, subcategory: "Bags" },
    ],
  },
  beauty: {
    subcategories: ["All", "Skincare", "Makeup", "Haircare", "Fragrance"],
    products: [
      { id: "serum-kit",       name: "Vitamin C Serum Kit",          description: "Brightening essentials for every skin type.", image: "#FFF0E0", postCount: 5, subcategory: "Skincare" },
      { id: "lip-set",         name: "Matte Lip Collection",         description: "12 long-wear shades for any look.",            image: "#FFE0E8", postCount: 2, subcategory: "Makeup" },
      { id: "hair-oil",        name: "Argan Hair Oil",               description: "Frizz control and shine, every day.",          image: "#E8F0E0", postCount: 3, subcategory: "Haircare" },
    ],
  },
  tech: {
    subcategories: ["All", "Audio", "Accessories", "Photography", "Gaming"],
    products: [
      { id: "headphones",      name: "Wireless Noise-Cancel Headphones", description: "Studio-quality sound, anywhere.",         image: "#E0E8F0", postCount: 7, subcategory: "Audio" },
      { id: "keyboard",        name: "Mechanical Keyboard",              description: "Tactile typing for creators.",             image: "#E8E0F0", postCount: 2, subcategory: "Accessories" },
      { id: "ring-light",      name: "LED Ring Light",                   description: "Perfect lighting for every shoot.",        image: "#F0F0E0", postCount: 4, subcategory: "Photography" },
    ],
  },
  food: {
    subcategories: ["All", "Snacks", "Drinks", "Supplements", "Kitchen"],
    products: [
      { id: "protein-bundle",  name: "Protein Powder Bundle",        description: "Clean fuel for any lifestyle.",       image: "#F0E8D8", postCount: 3, subcategory: "Supplements" },
      { id: "matcha-kit",      name: "Premium Matcha Starter Kit",   description: "Ceremonial grade, everyday ritual.",  image: "#D8F0D8", postCount: 1, subcategory: "Drinks" },
    ],
  },
  wellness: {
    subcategories: ["All", "Fitness", "Mindfulness", "Sleep", "Recovery"],
    products: [
      { id: "yoga-mat",        name: "Premium Yoga Mat",             description: "Non-slip, 6mm cushioning.",           image: "#E0F0E8", postCount: 2, subcategory: "Fitness" },
      { id: "foam-roller",     name: "Deep Tissue Foam Roller",      description: "Post-workout recovery essential.",    image: "#F0E0E8", postCount: 1, subcategory: "Recovery" },
    ],
  },
};

const FALLBACK_CATEGORY = {
  subcategories: ["All"],
  products: [],
};

// Capitalise first letter for display
function formatCategory(slug: string) {
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

// ── Card ──────────────────────────────────────────────────────────────────────

function ProductCard({ product, category }: { product: Product; category: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.09)] transition-shadow duration-200">

      {/* Product image */}
      <div
        className="h-[180px] w-full rounded-t-2xl flex items-center justify-center"
        style={{ backgroundColor: product.image }}
      >
        <span className="text-gray-300 text-[13px]">Product Image</span>
      </div>

      {/* Name + post count badge */}
      <div className="px-4 pt-4 flex items-start justify-between gap-2">
        <span className="text-[15px] font-medium text-gray-900 leading-snug">{product.name}</span>
        <span className="flex-shrink-0 px-2.5 py-1 rounded-full bg-[#A3FF38] text-[12px] font-semibold text-gray-900 whitespace-nowrap">
          {product.postCount} {product.postCount === 1 ? "Post" : "Posts"}
        </span>
      </div>

      {/* Description */}
      <p className="px-4 pt-1.5 pb-4 text-[13px] text-gray-400">{product.description}</p>

      {/* View Product button */}
      <div className="px-4 pb-4">
        <Link
          href={`/shop/${category}/${product.id}`}
          className="block w-full py-3 rounded-xl bg-gray-900 text-white text-[14px] font-semibold text-center hover:bg-gray-800 active:scale-[0.98] transition-all duration-[140ms]"
        >
          View Product
        </Link>
      </div>

    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ProductGridPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = use(params);
  const data = PRODUCTS_BY_CATEGORY[category.toLowerCase()] ?? FALLBACK_CATEGORY;

  const [activeSubcategory, setActiveSubcategory] = useState("All");

  const filtered = activeSubcategory === "All"
    ? data.products
    : data.products.filter((p) => p.subcategory === activeSubcategory);

  return (
    <div className="p-8">

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[28px] font-semibold text-gray-900">{formatCategory(category)}</h1>
        <div className="flex items-center gap-3">
          <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors duration-[120ms]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
            </svg>
          </button>
          <button className="px-4 py-2 rounded-xl bg-[#A3FF38] text-gray-900 text-[14px] font-semibold hover:brightness-95 active:scale-[0.98] transition-all duration-[140ms]">
            Add New Product
          </button>
        </div>
      </div>

      {/* ── Subcategory filter tabs ──────────────────────────────────── */}
      <div className="flex gap-1 mb-8 border border-gray-200 rounded-xl p-1 w-fit">
        {data.subcategories.map((sub) => (
          <button
            key={sub}
            onClick={() => setActiveSubcategory(sub)}
            className={[
              "px-4 py-2 rounded-lg text-[14px] font-medium transition-all duration-[140ms]",
              activeSubcategory === sub
                ? "bg-gray-900 text-white"
                : "text-gray-500 hover:text-gray-800",
            ].join(" ")}
          >
            {sub}
          </button>
        ))}
      </div>

      {/* ── Grid ────────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="py-24 text-center text-gray-400 text-[15px]">
          No products in this category yet.
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-5">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} category={category} />
          ))}
        </div>
      )}

    </div>
  );
}
