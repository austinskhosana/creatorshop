"use client";

import { useState } from "react";
import FilterTabBar from "./FilterTabBar";

const DEMO_TABS = [
  { id: "all", label: "All", count: 12 },
  { id: "delivered", label: "Had deliveries", count: 7 },
  { id: "empty", label: "No deliveries", count: 5 },
];

export default function FilterTabBarDemo() {
  const [activeId, setActiveId] = useState("all");
  return <FilterTabBar tabs={DEMO_TABS} activeId={activeId} onChange={setActiveId} />;
}
