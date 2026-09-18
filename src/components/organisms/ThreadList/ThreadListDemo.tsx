"use client";

import { useMemo, useState } from "react";
import ThreadList, { type ThreadListEntry } from "./ThreadList";

const DEMO_THREADS: ThreadListEntry[] = [
  { id: "paper", name: "Paper", preview: "We're excited to see what you create.", time: "10:42 AM", unread: true, online: true, image: "/logos/paper.jpeg" },
  { id: "canva", name: "Canva", preview: "We left feedback on your draft.", time: "Yesterday", image: "/logos/canva.jpg" },
  { id: "notion", name: "Notion", preview: "Thanks for sending that over!", time: "Tue", image: "/logos/notion.jpg" },
  { id: "mia", name: "Mia at Creatorshop", preview: "How can we help with your shop?", time: "Fri", online: true },
];

export default function ThreadListDemo() {
  const [activeId, setActiveId] = useState("paper");
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () => DEMO_THREADS.filter((thread) => `${thread.name} ${thread.preview}`.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  return (
    <div className="h-[420px] w-full max-w-sm overflow-hidden rounded-2xl border border-neutral-200">
      <ThreadList
        threads={filtered}
        activeId={activeId}
        onSelect={setActiveId}
        query={query}
        onQueryChange={setQuery}
        unreadCount={1}
      />
    </div>
  );
}
