"use client";

import { useState } from "react";
import SelectableChip from "./SelectableChip";

const NICHES = ["Fashion", "Travel", "Lifestyle", "Tech"];

export default function SelectableChipDemo({ tone = "dark" }: { tone?: "dark" | "lime" }) {
  const [selected, setSelected] = useState<string[]>([NICHES[0]]);

  return (
    <div className="flex flex-wrap gap-2">
      {NICHES.map((n) => (
        <SelectableChip
          key={n}
          label={n}
          tone={tone}
          selected={selected.includes(n)}
          onClick={() => setSelected((prev) => (prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]))}
        />
      ))}
    </div>
  );
}
