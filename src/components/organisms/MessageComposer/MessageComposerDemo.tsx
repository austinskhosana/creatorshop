"use client";

import { useState } from "react";
import MessageComposer from "./MessageComposer";

export default function MessageComposerDemo() {
  const [value, setValue] = useState("");
  return (
    <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-neutral-200">
      <MessageComposer
        value={value}
        onChange={setValue}
        onSubmit={(event) => {
          event.preventDefault();
          setValue("");
        }}
        placeholder="Message Paper"
      />
    </div>
  );
}
