"use client";

import { useState } from "react";
import Dropdown, { type DropdownOption } from "./Dropdown";

const DEMO_OPTIONS: DropdownOption[] = [
  { value: "all", label: "Any platform" },
  { value: "Instagram", label: "Instagram" },
  { value: "TikTok", label: "TikTok" },
  { value: "YouTube", label: "YouTube" },
];

export default function DropdownDemo({ disabled = false }: { disabled?: boolean }) {
  const [value, setValue] = useState("all");
  return <Dropdown value={value} onChange={setValue} options={DEMO_OPTIONS} ariaLabel="Filter by platform" disabled={disabled} />;
}
