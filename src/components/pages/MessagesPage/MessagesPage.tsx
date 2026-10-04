"use client";

import { useMemo, useState, type ComponentType, type ReactNode } from "react";
import { EnvelopeIcon, TrashIcon } from "@heroicons/react/24/outline";
import { EmptyEnvelope } from "@/components/atoms/EmptyEnvelope";
import type { ActionMenuItem } from "@/components/molecules/ActionMenu";
import { ConfirmDialog } from "@/components/molecules/ConfirmDialog";
import { EmptyState } from "@/components/molecules/EmptyState";
import type { MessageContent } from "@/components/molecules/MessageBubble";
import { ConversationHeader } from "@/components/organisms/ConversationHeader";
import { ConversationThread } from "@/components/organisms/ConversationThread";
import { MessageComposer } from "@/components/organisms/MessageComposer";
import { ThreadList, type ThreadListEntry } from "@/components/organisms/ThreadList";
import { CreatorShell } from "@/components/templates/CreatorShell";
import { inboxTimeFor, mockThreads, previewFor, type ChatMessage, type InboxThread } from "@/lib/mock-messages";

const formatTime = (date: Date) => date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

interface MessagesPageProps {
  /** Defaults to the creator's inbox. */
  threads?: InboxThread[];
  /** The frame around the inbox. Defaults to the creator shell. */
  shell?: ComponentType<{ children: ReactNode }>;
  /** Opens this thread first, e.g. after a brand approves a shopper. */
  initialThreadId?: string;
  /** What an inbox with no threads at all says, and where it points. Defaults to the creator's. */
  empty?: { description: string; action: { label: string; href: string } };
}

const CREATOR_EMPTY = {
  description: "Check out something you want and the brand's thread opens here, ready to talk through the campaign.",
  action: { label: "Browse the shop", href: "/explore" },
};

export default function MessagesPage({ threads: allThreads = mockThreads, shell: Shell = CreatorShell, initialThreadId, empty = CREATOR_EMPTY }: MessagesPageProps) {
  const firstId = allThreads.some((thread) => thread.id === initialThreadId) ? initialThreadId! : allThreads[0]?.id;
  const [activeId, setActiveId] = useState(firstId);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  // What you've sent this session, kept per thread so switching conversations doesn't carry it along.
  const [sentByThread, setSentByThread] = useState<Record<string, ChatMessage[]>>({});
  // Below lg the inbox and the conversation are separate screens; this tracks which one is showing.
  const [mobileView, setMobileView] = useState<"list" | "thread">("list");
  // Read state you've set this session, by opening a thread or from its menu; anything missing keeps the thread's own.
  const [unreadById, setUnreadById] = useState<Record<string, boolean>>(firstId ? { [firstId]: false } : {});
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  // The thread awaiting confirmation. It outlives the dialog's open state so the name holds while it closes.
  const [pendingDelete, setPendingDelete] = useState<{ id: string; name: string } | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const threads = useMemo(() => allThreads.filter((thread) => !deletedIds.includes(thread.id)), [allThreads, deletedIds]);

  const activeThread: InboxThread | undefined = threads.find((thread) => thread.id === activeId) ?? threads[0];
  const activeMessages = useMemo(
    () => (activeThread ? [...activeThread.messages, ...(sentByThread[activeThread.id] ?? [])] : []),
    [activeThread, sentByThread],
  );

  const filteredThreads = useMemo<ThreadListEntry[]>(() => {
    const needle = query.trim().toLowerCase();
    return threads.flatMap((thread) => {
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
          unread: unreadById[thread.id] ?? Boolean(thread.unread),
        },
      ];
    });
  }, [query, unreadById, sentByThread, threads]);
  const unreadCount = filteredThreads.filter((thread) => thread.unread).length;

  function selectThread(id: string) {
    if (id !== activeId) setMessage("");
    setActiveId(id);
    setMobileView("thread");
    setUnreadById((byId) => ({ ...byId, [id]: false }));
  }

  function toggleRead(id: string) {
    const thread = filteredThreads.find((entry) => entry.id === id);
    setUnreadById((byId) => ({ ...byId, [id]: !thread?.unread }));
  }

  function deleteThread(id: string) {
    setDeletedIds((ids) => [...ids, id]);
    setSentByThread((byThread) => {
      const next = { ...byThread };
      delete next[id];
      return next;
    });
    if (id !== activeThread?.id) return;
    // Deleting the open conversation moves to its neighbour, and back to the list on small screens.
    const index = threads.findIndex((thread) => thread.id === id);
    setActiveId((threads[index + 1] ?? threads[index - 1])?.id);
    setMessage("");
    setMobileView("list");
  }

  function requestDelete(id: string) {
    const thread = threads.find((entry) => entry.id === id);
    if (!thread) return;
    setPendingDelete({ id, name: thread.name });
    setConfirmingDelete(true);
  }

  // Rendered with the empty inbox too, so deleting the last conversation still lets the dialog close smoothly.
  const deleteDialog = (
    <ConfirmDialog
      open={confirmingDelete}
      onOpenChange={setConfirmingDelete}
      title="Delete conversation?"
      description={`Your conversation with ${pendingDelete?.name} will be removed from your inbox. This can't be undone.`}
      confirmLabel="Delete"
      destructive
      onConfirm={() => {
        if (pendingDelete) deleteThread(pendingDelete.id);
      }}
    />
  );

  if (!activeThread) {
    return (
      <Shell>
        <div className="flex min-h-full w-full items-center justify-center bg-white px-5 py-12">
          <h1 className="sr-only">Messages</h1>
          <EmptyState framed={false} illustration={<EmptyEnvelope />} title="No conversations yet" description={empty.description} action={empty.action} />
        </div>
        {deleteDialog}
      </Shell>
    );
  }

  const openId = activeThread.id;
  const threadActions: ActionMenuItem[] = [
    {
      label: filteredThreads.find((entry) => entry.id === openId)?.unread ? "Mark as read" : "Mark as unread",
      icon: <EnvelopeIcon strokeWidth={1.75} />,
      onSelect: () => toggleRead(openId),
    },
    { label: "Delete conversation", icon: <TrashIcon strokeWidth={1.75} />, tone: "danger", onSelect: () => requestDelete(openId) },
  ];

  function sendContent(content: MessageContent) {
    const sent: ChatMessage = { id: crypto.randomUUID(), from: "you", content, day: "Today", time: formatTime(new Date()) };
    setSentByThread((byThread) => ({ ...byThread, [openId]: [...(byThread[openId] ?? []), sent] }));
  }

  function sendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = message.trim();
    if (!text) return;
    sendContent({ type: "text", text });
    setMessage("");
  }

  return (
    <Shell>
      <div className="flex h-full min-h-0 w-full bg-white">
        <div className="grid h-full min-h-0 w-full grid-cols-[minmax(0,1fr)] overflow-hidden bg-white lg:grid-cols-[21rem_minmax(0,1fr)]">
          <div className={`min-h-0 ${mobileView === "thread" ? "hidden lg:block" : ""}`}>
            <ThreadList
              threads={filteredThreads}
              activeId={activeThread.id}
              onSelect={selectThread}
              query={query}
              onQueryChange={setQuery}
              unreadCount={unreadCount}
              onToggleRead={toggleRead}
              onDelete={requestDelete}
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
              actions={threadActions}
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

      {deleteDialog}
    </Shell>
  );
}
