"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MessageBubble, type MessageContent } from "@/components/molecules/MessageBubble";
import { ConversationHeader } from "@/components/organisms/ConversationHeader";
import { MessageComposer } from "@/components/organisms/MessageComposer";
import { ThreadList, type ThreadListEntry } from "@/components/organisms/ThreadList";
import { CreatorShell } from "@/components/templates/CreatorShell";

type Thread = ThreadListEntry & { detail: string };

const threads: Thread[] = [
  { id: "paper", name: "Paper", detail: "Paper Pro · Instagram carousel", preview: "We're excited to see what you create.", time: "10:42 AM", unread: true, image: "/logos/paper.jpeg" },
  { id: "canva", name: "Canva", detail: "Canva Pro · Short-form video", preview: "We left feedback on your draft.", time: "Yesterday", image: "/logos/canva.jpg" },
  { id: "Notion", name: "Notion", detail: "Notion Plus · Product tutorial", preview: "Thanks for sending that over!", time: "Tue", image: "/logos/notion.jpg" },
  { id: "elevenlabs", name: "ElevenLabs", detail: "Creator program", preview: "Your access is ready to use.", time: "Mon", image: "/logos/elevenlabs.png" },
  { id: "mia", name: "Austin at Creatorshop", detail: "Creatorshop support", preview: "How can we help with your shop?", time: "Fri", online: true, image: "/Creatorshop Brand Symbol.webp" },
];

export default function MessagesPage() {
  const [activeId, setActiveId] = useState("paper");
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState<MessageContent[]>([]);
  const [readIds, setReadIds] = useState<string[]>([]);
  const threadRef = useRef<HTMLDivElement>(null);
  // Follow the newest message — including after a photo finishes loading and grows the thread —
  // unless the reader has scrolled up to look at something older.
  const stickToBottom = useRef(true);

  useEffect(() => {
    const scroller = threadRef.current;
    const content = scroller?.firstElementChild;
    if (!scroller || !content) return;
    const observer = new ResizeObserver(() => {
      if (stickToBottom.current) scroller.scrollTop = scroller.scrollHeight;
    });
    observer.observe(content);
    return () => observer.disconnect();
  }, []);

  const activeThread = threads.find((thread) => thread.id === activeId) ?? threads[0];
  const filteredThreads = useMemo(
    () =>
      threads
        .filter((thread) => `${thread.name} ${thread.preview}`.toLowerCase().includes(query.toLowerCase()))
        .map((thread) => (readIds.includes(thread.id) ? { ...thread, unread: false } : thread)),
    [query, readIds],
  );
  const unreadCount = useMemo(() => filteredThreads.filter((thread) => thread.unread).length, [filteredThreads]);

  function selectThread(id: string) {
    setActiveId(id);
    setReadIds((ids) => (ids.includes(id) ? ids : [...ids, id]));
  }

  function sendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = message.trim();
    if (!text) return;
    stickToBottom.current = true;
    setSent((messages) => [...messages, { type: "text", text }]);
    setMessage("");
  }

  function sendContent(content: MessageContent) {
    stickToBottom.current = true;
    setSent((messages) => [...messages, content]);
  }

  return (
    <CreatorShell>
      <div className="flex h-screen min-h-0 w-full bg-white">
        <div className="grid h-full min-h-0 w-full grid-rows-[minmax(0,16rem)_minmax(0,1fr)] overflow-hidden bg-white lg:grid-cols-[21rem_minmax(0,1fr)] lg:grid-rows-1">
          <ThreadList
            threads={filteredThreads}
            activeId={activeId}
            onSelect={selectThread}
            query={query}
            onQueryChange={setQuery}
            unreadCount={unreadCount}
          />

          <section className="flex min-h-0 min-w-0 flex-col">
            <ConversationHeader name={activeThread.name} detail={activeThread.detail} image={activeThread.image} online={activeThread.online} />

            <div
              ref={threadRef}
              onScroll={(event) => {
                const el = event.currentTarget;
                stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
              }}
              className="min-h-0 flex-1 overflow-y-auto bg-white px-5 py-7 sm:px-8 sm:py-9"
            >
              <div className="mx-auto flex max-w-3xl flex-col">
                <MessageBubble
                  text="We're excited to see how you make Paper your own. Let us know if you have questions about the product."
                  meta={`${activeThread.name} · 10:45 AM`}
                  senderName={activeThread.name}
                  senderImage={activeThread.image}
                />

                {/* Everything sent is from you: one run, so bubbles sit close together and only the
                    last one carries the pointed corner and the timestamp. */}
                {sent.map((content, index) => {
                  const isLast = index === sent.length - 1;
                  return (
                    <div key={index} className={index === 0 ? "mt-7" : "mt-1"}>
                      <MessageBubble content={content} meta="You · now" variant="outgoing" showMeta={isLast} tail={isLast} />
                    </div>
                  );
                })}
              </div>
            </div>

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
