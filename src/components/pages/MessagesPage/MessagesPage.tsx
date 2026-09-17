"use client";

import Image from "next/image";
import {
  EllipsisHorizontalIcon,
  FaceSmileIcon,
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
  PencilSquareIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { useMemo, useState } from "react";
import Avatar from "@/components/atoms/Avatar/Avatar";
import { CreatorShell } from "@/components/templates/CreatorShell";
import { cn } from "@/lib/utils";

type Thread = {
  id: string;
  name: string;
  detail: string;
  preview: string;
  time: string;
  unread?: boolean;
  online?: boolean;
  image?: string;
  initials?: string;
};

const threads: Thread[] = [
  { id: "paper", name: "Paper", detail: "Paper Pro · Instagram carousel", preview: "We're excited to see what you create.", time: "10:42 AM", unread: true, online: true, image: "/logos/paper.jpeg" },
  { id: "canva", name: "Canva", detail: "Canva Pro · Short-form video", preview: "We left feedback on your draft.", time: "Yesterday", image: "/logos/canva.jpg" },
  { id: "Notion", name: "Notion", detail: "Notion Plus · Product tutorial", preview: "Thanks for sending that over!", time: "Tue", image: "/logos/notion.jpg" },
  { id: "elevenlabs", name: "ElevenLabs", detail: "Creator program", preview: "Your access is ready to use.", time: "Mon", image: "/logos/elevenlabs.png" },
  { id: "mia", name: "Mia at Creatorshop", detail: "Creatorshop support", preview: "How can we help with your shop?", time: "Fri", initials: "MC", online: true },
];

function ThreadAvatar({ thread, size = "md" }: { thread: Thread; size?: "sm" | "md" | "lg" }) {
  if (thread.image) {
    return <Image src={thread.image} alt="" width={44} height={44} className={cn("shrink-0 rounded-xl object-contain ring-1 ring-black/10", size === "sm" ? "size-9" : size === "lg" ? "size-11" : "size-10")} />;
  }
  return <Avatar name={thread.name} size={size} className="border-0 ring-0" />;
}

export default function MessagesPage() {
  const [activeId, setActiveId] = useState("paper");
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState<string[]>([]);

  const activeThread = threads.find((thread) => thread.id === activeId) ?? threads[0];
  const filteredThreads = useMemo(
    () => threads.filter((thread) => `${thread.name} ${thread.preview}`.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  function sendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = message.trim();
    if (!text) return;
    setSent((messages) => [...messages, text]);
    setMessage("");
  }

  return (
    <CreatorShell>
      <div className="flex h-screen min-h-0 w-full bg-white">
        <div className="grid h-full min-h-0 w-full grid-rows-[minmax(0,16rem)_minmax(0,1fr)] overflow-hidden bg-white lg:grid-cols-[21rem_minmax(0,1fr)] lg:grid-rows-1">
          <aside className="flex h-full min-h-0 flex-col border-b border-neutral-200 lg:border-r lg:border-b-0">
            <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-neutral-200 px-4">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.14em] text-neutral-400 uppercase">Inbox</p>
                <h1 className="mt-0.5 text-lg font-semibold tracking-[-0.02em] text-neutral-950">Messages</h1>
              </div>
              <button type="button" aria-label="Start a new message" className="grid size-10 place-items-center rounded-xl border border-neutral-200 text-neutral-600 transition-[background-color,border-color,color,transform] duration-150 hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-950 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2">
                <PencilSquareIcon className="size-[18px]" />
              </button>
            </div>

            <div className="shrink-0 border-b border-neutral-100 px-4 py-3.5">
              <label className="relative block">
                <MagnifyingGlassIcon aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search conversations" aria-label="Search conversations" className="h-10 w-full rounded-xl bg-neutral-100 pr-3 pl-9 text-sm text-neutral-900 outline-none transition-[background-color,box-shadow] duration-150 placeholder:text-neutral-400 focus:bg-white focus:ring-2 focus:ring-neutral-900" />
              </label>
              <div className="mt-3 flex gap-1.5" aria-label="Message filters">
                <button type="button" className="min-h-8 rounded-full bg-neutral-900 px-3 text-xs font-medium text-white transition-transform duration-150 active:scale-[0.96]">All</button>
                <button type="button" className="min-h-8 rounded-full border border-neutral-200 px-3 text-xs font-medium text-neutral-600 transition-[background-color,border-color,color,transform] duration-150 hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900 active:scale-[0.96]">Unread <span className="ml-1 tabular-nums text-neutral-400">1</span></button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-2 py-2.5" aria-label="Conversation list">
              {filteredThreads.map((thread) => {
                const selected = thread.id === activeId;
                return (
                  <button key={thread.id} type="button" onClick={() => setActiveId(thread.id)} className={cn("relative flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-[background-color,transform] duration-150 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-inset", selected ? "bg-neutral-100" : "hover:bg-neutral-50")}>
                    <div className="relative">
                      <ThreadAvatar thread={thread} size="sm" />
                      {thread.online ? <span className="absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2 border-white bg-[#A3FF38]" /> : null}
                    </div>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-3"><span className="truncate text-sm font-semibold text-neutral-900">{thread.name}</span><span className="shrink-0 text-[11px] tabular-nums text-neutral-400">{thread.time}</span></span>
                      <span className="mt-1 flex items-center gap-2"><span className={cn("truncate text-xs leading-4", thread.unread ? "font-medium text-neutral-700" : "text-neutral-500")}>{thread.preview}</span>{thread.unread ? <span className="size-1.5 shrink-0 rounded-full bg-neutral-900" /> : null}</span>
                    </span>
                  </button>
                );
              })}
              {filteredThreads.length === 0 ? <p className="px-3 py-10 text-center text-sm text-neutral-500">No conversations found.</p> : null}
            </div>
          </aside>

          <section className="flex min-h-0 min-w-0 flex-col">
            <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-neutral-200 px-5 sm:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative"><ThreadAvatar thread={activeThread} /><span className="absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2 border-white bg-[#A3FF38]" /></div>
                <div className="min-w-0"><h2 className="truncate text-[15px] font-semibold tracking-[-0.01em] text-neutral-950">{activeThread.name}</h2><p className="mt-0.5 truncate text-xs text-neutral-500">{activeThread.detail}</p></div>
              </div>
              <div className="flex items-center gap-0.5">
                <button type="button" aria-label="Search this conversation" className="grid size-10 place-items-center rounded-xl text-neutral-500 transition-[background-color,color,transform] duration-150 hover:bg-neutral-100 hover:text-neutral-900 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"><MagnifyingGlassIcon className="size-[18px]" /></button>
                <button type="button" aria-label="More conversation options" className="grid size-10 place-items-center rounded-xl text-neutral-500 transition-[background-color,color,transform] duration-150 hover:bg-neutral-100 hover:text-neutral-900 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"><EllipsisHorizontalIcon className="size-5" /></button>
              </div>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto bg-white px-5 py-7 sm:px-8 sm:py-9">
              <div className="mx-auto flex max-w-3xl flex-col gap-7">
                <p className="mx-auto text-[10px] font-semibold tracking-[0.1em] text-neutral-400 uppercase">Today · 10:42 AM</p>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-end gap-2.5"><ThreadAvatar thread={activeThread} size="sm" /><div className="max-w-[min(78%,36rem)] rounded-2xl rounded-bl-[5px] bg-neutral-100 px-4 py-2.5 text-sm leading-[1.55] text-neutral-700">We&apos;re excited to see how you make Paper your own. Let us know if you have questions about the product.</div></div>
                  <p className="pl-[46px] text-[11px] tabular-nums text-neutral-400">Paper · 10:45 AM</p>
                </div>

                {sent.map((text, index) => (
                  <div key={`${text}-${index}`} className="ml-auto flex max-w-[min(78%,36rem)] flex-col items-end gap-1.5">
                    <div className="rounded-2xl rounded-br-[5px] bg-neutral-900 px-4 py-2.5 text-sm leading-[1.55] text-white">{text}</div>
                    <p className="text-[11px] tabular-nums text-neutral-400">You · now</p>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={sendMessage} className="shrink-0 border-t border-neutral-200 bg-white px-4 py-3.5 sm:px-6">
              <div className="flex items-end gap-1.5 rounded-xl border border-neutral-200 bg-white p-1.5 transition-[border-color,box-shadow] duration-150 focus-within:border-neutral-400 focus-within:ring-4 focus-within:ring-neutral-100">
                <button type="button" aria-label="Add attachment" className="grid size-10 shrink-0 place-items-center rounded-lg text-neutral-500 transition-[background-color,color,transform] duration-150 hover:bg-neutral-100 hover:text-neutral-900 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"><PlusIcon className="size-5" /></button>
                <textarea value={message} onChange={(event) => setMessage(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} rows={1} placeholder={`Message ${activeThread.name}`} aria-label={`Message ${activeThread.name}`} className="max-h-32 min-h-10 flex-1 resize-none bg-transparent px-1 py-2.5 text-sm leading-5 text-neutral-900 outline-none placeholder:text-neutral-400" />
                <button type="button" aria-label="Attach a file" className="hidden size-10 shrink-0 place-items-center rounded-lg text-neutral-500 transition-[background-color,color,transform] duration-150 hover:bg-neutral-100 hover:text-neutral-900 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 sm:grid"><PaperClipIcon className="size-[18px]" /></button>
                <button type="button" aria-label="Add emoji" className="hidden size-10 shrink-0 place-items-center rounded-lg text-neutral-500 transition-[background-color,color,transform] duration-150 hover:bg-neutral-100 hover:text-neutral-900 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 sm:grid"><FaceSmileIcon className="size-5" /></button>
                <button type="submit" aria-label="Send message" disabled={!message.trim()} className="grid size-10 shrink-0 place-items-center rounded-lg bg-neutral-900 text-white transition-[background-color,color,transform] duration-150 hover:bg-neutral-700 active:scale-[0.96] disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-300 disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"><PaperAirplaneIcon className="size-[18px]" /></button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </CreatorShell>
  );
}
