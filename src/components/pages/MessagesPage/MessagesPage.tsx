"use client";

import { useMemo, useState } from "react";
import type { MessageContent } from "@/components/molecules/MessageBubble";
import { ConversationHeader } from "@/components/organisms/ConversationHeader";
import { ConversationThread } from "@/components/organisms/ConversationThread";
import { MessageComposer } from "@/components/organisms/MessageComposer";
import { ThreadList, type ThreadListEntry } from "@/components/organisms/ThreadList";
import { CreatorShell } from "@/components/templates/CreatorShell";
import { inboxTimeFor, mockThreads, previewFor, type ChatMessage } from "@/lib/mock-messages";

const formatTime = (date: Date) => date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

export default function MessagesPage() {
  const [activeId, setActiveId] = useState(mockThreads[0].id);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  // What you've sent this session, kept per thread so switching conversations doesn't carry it along.
  const [sentByThread, setSentByThread] = useState<Record<string, ChatMessage[]>>({});
  // Below lg the inbox and the conversation are separate screens; this tracks which one is showing.
  const [mobileView, setMobileView] = useState<"list" | "thread">("list");
  const [readIds, setReadIds] = useState<string[]>([mockThreads[0].id]);

  const activeThread = mockThreads.find((thread) => thread.id === activeId) ?? mockThreads[0];
  const activeMessages = useMemo(
    () => [...activeThread.messages, ...(sentByThread[activeThread.id] ?? [])],
    [activeThread, sentByThread],
  );

  const filteredThreads = useMemo<ThreadListEntry[]>(() => {
    const needle = query.trim().toLowerCase();
    return mockThreads.flatMap((thread) => {
      const all = [...thread.messages, ...(sentByThread[thread.id] ?? [])];
      const searchText = `${thread.name} ${thread.detail} ${all.map((m) => (m.content.type === "text" ? m.content.text : "")).join(" ")}`;
      if (!searchText.toLowerCase().includes(needle)) return [];
      const last = all[all.length - 1];
      return [
        {
          id: thread.id,
          name: thread.name,
          image: thread.image,
          online: thread.online,
          official: thread.participant === "team",
          preview: previewFor(last),
          time: inboxTimeFor(last),
          unread: thread.unread && !readIds.includes(thread.id),
        },
      ];
    });
  }, [query, readIds, sentByThread]);
  const unreadCount = filteredThreads.filter((thread) => thread.unread).length;

  function selectThread(id: string) {
    if (id !== activeId) setMessage("");
    setActiveId(id);
    setMobileView("thread");
    setReadIds((ids) => (ids.includes(id) ? ids : [...ids, id]));
  }

  function sendContent(content: MessageContent) {
    const sent: ChatMessage = { id: crypto.randomUUID(), from: "you", content, day: "Today", time: formatTime(new Date()) };
    setSentByThread((byThread) => ({ ...byThread, [activeThread.id]: [...(byThread[activeThread.id] ?? []), sent] }));
  }

  function sendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = message.trim();
    if (!text) return;
    sendContent({ type: "text", text });
    setMessage("");
  }

  return (
    <CreatorShell>
      <div className="flex h-dvh min-h-0 w-full bg-white">
        <div className="grid h-full min-h-0 w-full grid-cols-[minmax(0,1fr)] overflow-hidden bg-white lg:grid-cols-[21rem_minmax(0,1fr)]">
          <div className={`min-h-0 ${mobileView === "thread" ? "hidden lg:block" : ""}`}>
            <ThreadList
              threads={filteredThreads}
              activeId={activeId}
              onSelect={selectThread}
              query={query}
              onQueryChange={setQuery}
              unreadCount={unreadCount}
            />
          </div>

          <section className={`min-h-0 min-w-0 flex-col ${mobileView === "list" ? "hidden lg:flex" : "flex"}`}>
            <ConversationHeader
              name={activeThread.name}
              detail={activeThread.detail}
              image={activeThread.image}
              online={activeThread.online}
              official={activeThread.participant === "team"}
              onBack={() => setMobileView("list")}
            />

            <ConversationThread
              threadId={activeThread.id}
              messages={activeMessages}
              senderName={activeThread.name}
              senderImage={activeThread.image}
            />

            <MessageComposer
              value={message}
              onChange={setMessage}
              onSubmit={sendMessage}
              onSendContent={sendContent}
              placeholder={`Message ${activeThread.name}`}
            />
          </section>
        </div>
      </div>
    </CreatorShell>
  );
}
