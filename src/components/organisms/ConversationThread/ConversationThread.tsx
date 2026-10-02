"use client";

import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import { MessageBubble } from "@/components/molecules/MessageBubble";
import type { ChatMessage } from "@/lib/mock-messages";

interface ConversationThreadProps {
  /** Changing this jumps back to the newest message. */
  threadId: string;
  messages: ChatMessage[];
  senderName: string;
  senderImage?: string;
}

function DayDivider({ label }: { label: string }) {
  return (
    <div role="separator" aria-label={label} className="flex items-center gap-3 py-1">
      <span className="h-px flex-1 bg-neutral-100" />
      <span className="text-[11px] font-medium text-neutral-400">{label}</span>
      <span className="h-px flex-1 bg-neutral-100" />
    </div>
  );
}

export default function ConversationThread({ threadId, messages, senderName, senderImage }: ConversationThreadProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  // Messages already in the thread when it opened render in place; only new ones animate.
  const [history, setHistory] = useState(() => ({ threadId, ids: new Set(messages.map((m) => m.id)) }));
  if (history.threadId !== threadId) setHistory({ threadId, ids: new Set(messages.map((m) => m.id)) });
  // Follow the newest message — including after a photo finishes loading and grows the thread —
  // unless the reader has scrolled up to look at something older.
  const stickToBottom = useRef(true);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const content = scroller?.firstElementChild;
    if (!scroller || !content) return;
    const observer = new ResizeObserver(() => {
      if (stickToBottom.current) scroller.scrollTop = scroller.scrollHeight;
    });
    observer.observe(content);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    stickToBottom.current = true;
    const scroller = scrollerRef.current;
    if (scroller) scroller.scrollTop = scroller.scrollHeight;
  }, [threadId]);

  // Sending always brings you back down, even if you'd scrolled up.
  const last = messages[messages.length - 1];
  useLayoutEffect(() => {
    if (last?.from === "you") stickToBottom.current = true;
  }, [last]);

  return (
    <div
      ref={scrollerRef}
      onScroll={(event) => {
        const el = event.currentTarget;
        stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
      }}
      className="min-h-0 flex-1 overflow-y-auto bg-white px-5 py-7 sm:px-8 sm:py-9"
    >
      <div className="mx-auto flex max-w-3xl flex-col">
        {messages.length === 0 ? (
          <p className="py-16 text-center text-sm text-neutral-400">No messages yet. Say hi to {senderName}.</p>
        ) : null}

        {messages.map((message, index) => {
          const prev = messages[index - 1];
          const next = messages[index + 1];
          const newDay = message.day !== prev?.day;
          // A run is consecutive messages from the same person on the same day: bubbles sit close
          // together and only the last one carries the avatar, pointed corner and timestamp.
          const startsRun = newDay || prev?.from !== message.from;
          const endsRun = !next || next.day !== message.day || next.from !== message.from;
          const outgoing = message.from === "you";

          return (
            <Fragment key={message.id}>
              {newDay ? <div className={index === 0 ? "mb-6" : "mt-8 mb-6"}><DayDivider label={message.day} /></div> : null}
              <div className={newDay ? "" : startsRun ? "mt-6" : "mt-1"}>
                <MessageBubble
                  content={message.content}
                  meta={`${outgoing ? "You" : senderName} · ${message.time}`}
                  variant={outgoing ? "outgoing" : "incoming"}
                  senderName={senderName}
                  senderImage={senderImage}
                  showMeta={endsRun}
                  tail={endsRun}
                  showAvatar={endsRun}
                  animateIn={!history.ids.has(message.id)}
                />
              </div>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
