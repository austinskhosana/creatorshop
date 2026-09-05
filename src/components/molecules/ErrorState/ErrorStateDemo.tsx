"use client";

import ErrorState from "./ErrorState";

export default function ErrorStateDemo() {
  return <ErrorState error={new Error("Failed to load")} reset={() => {}} />;
}
