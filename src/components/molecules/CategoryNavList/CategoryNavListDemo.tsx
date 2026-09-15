"use client";

import { useState } from "react";
import CategoryNavList from "./CategoryNavList";

const DEMO_CATEGORIES = [
  { id: "all", label: "All products", count: 9 },
  { id: "ai-tools", label: "AI Tools", count: 2 },
  { id: "design", label: "Design", count: 2 },
  { id: "marketing", label: "Marketing", count: 2 },
  { id: "dev-tools", label: "Dev Tools", count: 2 },
  { id: "productivity", label: "Productivity", count: 1 },
];

export default function CategoryNavListDemo() {
  const [activeId, setActiveId] = useState("all");
  return <CategoryNavList categories={DEMO_CATEGORIES} activeId={activeId} onChange={setActiveId} />;
}
