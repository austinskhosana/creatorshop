"use client";

import { useState } from "react";
import WishCard from "./WishCard";

/** Registry preview with its own wish state, since the registry renders on the server. */
export default function WishCardDemo({ wished: initiallyWished = false }: { wished?: boolean }) {
  const [wished, setWished] = useState(initiallyWished);
  return (
    <div className="w-[300px]">
      <WishCard
        brandKey="figma"
        brandName="Figma"
        website="figma.com"
        description="Collaborative interface design and prototyping in the browser."
        category="Design"
        wished={wished}
        onToggle={() => setWished((value) => !value)}
      />
    </div>
  );
}
