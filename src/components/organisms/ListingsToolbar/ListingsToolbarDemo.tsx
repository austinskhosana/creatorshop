"use client";

import { useState } from "react";
import ListingsToolbar from "./ListingsToolbar";

export default function ListingsToolbarDemo() {
  const [platform, setPlatform] = useState("all");
  const [priceTier, setPriceTier] = useState("all");
  const [accessLength, setAccessLength] = useState("all");
  const [sort, setSort] = useState("newest");
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <ListingsToolbar
      resultCount={9}
      platform={platform}
      onPlatformChange={setPlatform}
      priceTier={priceTier}
      onPriceTierChange={setPriceTier}
      accessLength={accessLength}
      onAccessLengthChange={setAccessLength}
      sort={sort}
      onSortChange={setSort}
      inStockOnly={inStockOnly}
      onInStockOnlyChange={setInStockOnly}
    />
  );
}
