"use client";

import { PaymentOptionRow } from "@/components/molecules/PaymentOptionRow";
import { ThreadListItem } from "@/components/molecules/ThreadListItem";

export function PaymentOptionPreview({ selected = false }: { selected?: boolean }) {
  return (
    <PaymentOptionRow
      label="Instagram Reel"
      meta="Access for 3 months"
      price={48}
      selected={selected}
      onSelect={() => {}}
    />
  );
}

export function ThreadListItemPreview({ selected = false }: { selected?: boolean }) {
  return (
    <div className="w-72 rounded-xl border border-neutral-200 p-1">
      <ThreadListItem
        name={selected ? "Paper" : "Canva"}
        preview={selected ? "We're excited to see what you create." : "We left feedback on your draft."}
        time={selected ? "10:42 AM" : "Yesterday"}
        image={selected ? "/logos/paper.jpeg" : "/logos/canva.jpg"}
        online={selected}
        unread={selected}
        selected={selected}
        onClick={() => {}}
      />
    </div>
  );
}

