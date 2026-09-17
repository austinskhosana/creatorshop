"use client";

import Image from "next/image";
import {
  ArrowUpIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  EllipsisHorizontalIcon,
  FaceSmileIcon,
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
  PencilSquareIcon,
  PlusIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { useMemo, useState } from "react";
import Button from "@/components/atoms/Button/Button";
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
  { id: "paper", name: "Paper", detail: "Paper Pro · Instagram carousel", preview: "Your shop has been approved.", time: "10:42 AM", unread: true, online: true, image: "/logos/paper.jpeg" },
  { id: "canva", name: "Canva", detail: "Canva Pro · Short-form video", preview: "We left feedback on your draft.", time: "Yesterday", image: "/logos/canva.jpg" },
  { id: "Notion", name: "Notion", detail: "Notion Plus · Product tutorial", preview: "Thanks for sending that over!", time: "Tue", image: "/logos/notion.jpg" },
  { id: "elevenlabs", name: "ElevenLabs", detail: "Creator program", preview: "Your access is ready to use.", time: "Mon", image: "/logos/elevenlabs.png" },
  { id: "mia", name: "Mia at Creatorshop", detail: "Creatorshop support", preview: "How can we help with your shop?", time: "Fri", initials: "MC", online: true },
];

function ThreadAvatar({ thread, size = "md" }: { thread: Thread; size?: "sm" | "md" | "lg" }) {
  if (thread.image) {
    return <Image src={thread.image} alt="" width={44} height={44} className={cn("shrink-0 rounded-xl border border-neutral-100 object-contain", size === "sm" ? "size-9" : size === "lg" ? "size-11" : "size-10")} />;
  }
  return <Avatar name={thread.name} size={size} className="border-0 ring-0" />;
}

export default function MessagesPage() {
  const [activeId, setActiveId] = useState("paper");
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState<string[]>([]);
  const [showProof, setShowProof] = useState(false);
  const [proofUrl, setProofUrl] = useState("");
  const [disclosed, setDisclosed] = useState(false);
  const [proofSubmitted, setProofSubmitted] = useState(false);

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
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[1440px] bg-white lg:px-6 lg:py-6">
        <div className="grid w-full overflow-hidden border-y border-neutral-200 bg-white lg:min-h-[calc(100vh-7rem)] lg:grid-cols-[21rem_minmax(0,1fr)] lg:rounded-2xl lg:border">
          <aside className="flex min-h-0 flex-col border-b border-neutral-200 lg:border-r lg:border-b-0">
            <div className="border-b border-neutral-100 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.16em] text-neutral-400 uppercase">Workspace</p>
                  <h1 className="mt-0.5 text-xl font-semibold tracking-tight">Messages</h1>
                </div>
                <button type="button" aria-label="Start a new message" className="grid size-9 place-items-center rounded-xl border border-neutral-200 text-neutral-700 transition hover:border-neutral-400 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900">
                  <PencilSquareIcon className="size-4" />
                </button>
              </div>
              <label className="relative mt-4 block">
                <MagnifyingGlassIcon aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search messages" aria-label="Search messages" className="w-full rounded-xl bg-neutral-100 py-2.5 pr-3 pl-9 text-sm outline-none placeholder:text-neutral-400 focus:bg-white focus:ring-2 focus:ring-neutral-900" />
              </label>
              <div className="mt-4 flex gap-2" aria-label="Message filters">
                <button type="button" className="rounded-full bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white">All</button>
                <button type="button" className="rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 transition hover:border-neutral-400">Unread <span className="ml-1 text-neutral-400">1</span></button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-2 py-2" aria-label="Conversation list">
              {filteredThreads.map((thread) => {
                const selected = thread.id === activeId;
                return (
                  <button key={thread.id} type="button" onClick={() => setActiveId(thread.id)} className={cn("relative flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900", selected ? "bg-neutral-100" : "hover:bg-neutral-50")}>
                    <div className="relative">
                      <ThreadAvatar thread={thread} size="sm" />
                      {thread.online ? <span className="absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2 border-white bg-[#A3FF38]" /> : null}
                    </div>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-3"><span className="truncate text-sm font-semibold text-neutral-900">{thread.name}</span><span className="shrink-0 text-[11px] text-neutral-400">{thread.time}</span></span>
                      <span className="mt-0.5 flex items-center gap-2"><span className={cn("truncate text-xs", thread.unread ? "font-medium text-neutral-700" : "text-neutral-500")}>{thread.preview}</span>{thread.unread ? <span className="size-1.5 shrink-0 rounded-full bg-neutral-900" /> : null}</span>
                    </span>
                  </button>
                );
              })}
              {filteredThreads.length === 0 ? <p className="px-3 py-10 text-center text-sm text-neutral-500">No conversations found.</p> : null}
            </div>
          </aside>

          <section className="flex min-h-[680px] min-w-0 flex-col">
            <header className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative"><ThreadAvatar thread={activeThread} /><span className="absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2 border-white bg-[#A3FF38]" /></div>
                <div className="min-w-0"><h2 className="truncate text-sm font-semibold">{activeThread.name}</h2><p className="truncate text-xs text-neutral-500">{activeThread.detail}</p></div>
              </div>
              <div className="flex items-center gap-1">
                <button type="button" aria-label="Search this conversation" className="grid size-9 place-items-center rounded-lg text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"><MagnifyingGlassIcon className="size-4" /></button>
                <button type="button" aria-label="More conversation options" className="grid size-9 place-items-center rounded-lg text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"><EllipsisHorizontalIcon className="size-5" /></button>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto bg-white px-5 py-6 sm:px-8">
              <div className="mx-auto max-w-3xl space-y-5">
                <p className="mx-auto w-fit rounded-full border border-neutral-200 bg-white px-3 py-1 text-[10px] font-semibold tracking-[0.08em] text-neutral-400 uppercase">Today · 10:42 AM</p>

                <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5">
                  <div className="flex items-start gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#edffd4]"><CheckCircleIcon className="size-5 text-neutral-900" /></span><div><p className="text-sm font-semibold">Your shop was approved</p><p className="mt-1 text-sm leading-6 text-neutral-600">You&apos;re cleared to create your Paper Pro carousel. Submit the live post by <strong className="font-semibold text-neutral-900">September 25</strong> to unlock your three-month membership.</p></div></div>
                  {!proofSubmitted ? <Button size="sm" className="mt-4" onClick={() => setShowProof((visible) => !visible)} iconRight={showProof ? <ChevronDownIcon className="size-3.5" /> : <ArrowUpIcon className="size-3.5" />}>Submit proof</Button> : null}
                  {showProof && !proofSubmitted ? <form onSubmit={(event) => { event.preventDefault(); if (proofUrl.trim() && disclosed) { setProofSubmitted(true); setShowProof(false); } }} className="mt-4 border-t border-neutral-100 pt-4"><label className="block text-xs font-medium text-neutral-700">Live post URL<input required type="url" value={proofUrl} onChange={(event) => setProofUrl(event.target.value)} placeholder="https://instagram.com/p/..." className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-neutral-900" /></label><label className="mt-3 flex cursor-pointer items-start gap-2 text-xs leading-5 text-neutral-600"><input required type="checkbox" checked={disclosed} onChange={(event) => setDisclosed(event.target.checked)} className="mt-0.5 size-4 accent-neutral-900" />I included the required sponsored-content disclosure.</label><div className="mt-4 flex items-center gap-2"><Button type="submit" size="sm" disabled={!proofUrl.trim() || !disclosed}>Send for review</Button><button type="button" onClick={() => setShowProof(false)} className="px-2 py-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-900">Cancel</button></div></form> : null}
                  {proofSubmitted ? <p className="mt-4 rounded-xl bg-neutral-100 px-3 py-2 text-xs font-medium text-neutral-700">Proof submitted — Paper will review it shortly.</p> : null}
                </div>

                <div className="flex items-end gap-2"><ThreadAvatar thread={activeThread} size="sm" /><div className="max-w-[78%] rounded-2xl rounded-bl-sm bg-neutral-100 px-4 py-3 text-sm leading-6 text-neutral-700">We&apos;re excited to see how you make Paper your own. Let us know if you have questions about the product.</div></div>
                <p className="pl-12 text-[11px] text-neutral-400">Paper · 10:45 AM</p>

                {sent.map((text, index) => <div key={`${text}-${index}`} className="ml-auto max-w-[78%] rounded-2xl rounded-br-sm bg-neutral-900 px-4 py-3 text-sm leading-6 text-white"><p>{text}</p><p className="mt-1 text-[11px] text-white/55">You · now</p></div>)}

                <div className="flex items-start gap-3 rounded-2xl border border-dashed border-neutral-300 bg-white/70 p-4"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-neutral-100"><ShieldCheckIcon className="size-5" /></span><div><p className="text-sm font-semibold">Access unlocks after proof is confirmed</p><p className="mt-1 text-xs leading-5 text-neutral-500">Your Paper Pro membership and receipt will appear in this conversation.</p></div></div>
              </div>
            </div>

            <form onSubmit={sendMessage} className="border-t border-neutral-200 bg-white p-4 sm:px-6">
              <div className="flex items-end gap-2 rounded-2xl border border-neutral-200 bg-white p-2 focus-within:border-neutral-400">
                <button type="button" aria-label="Add attachment" className="grid size-9 shrink-0 place-items-center rounded-xl text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"><PlusIcon className="size-5" /></button>
                <textarea value={message} onChange={(event) => setMessage(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} rows={1} placeholder={`Message ${activeThread.name}`} aria-label={`Message ${activeThread.name}`} className="max-h-32 min-h-9 flex-1 resize-none bg-transparent py-2 text-sm outline-none placeholder:text-neutral-400" />
                <button type="button" aria-label="Attach a file" className="hidden size-9 place-items-center rounded-xl text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900 sm:grid"><PaperClipIcon className="size-4" /></button>
                <button type="button" aria-label="Add emoji" className="hidden size-9 place-items-center rounded-xl text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900 sm:grid"><FaceSmileIcon className="size-5" /></button>
                <button type="submit" aria-label="Send message" disabled={!message.trim()} className="grid size-9 shrink-0 place-items-center rounded-xl bg-neutral-900 text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-400"><PaperAirplaneIcon className="size-4" /></button>
              </div>
              <p className="mt-2 pl-2 text-[10px] text-neutral-400">Press Enter to send · Shift + Enter for a new line</p>
            </form>
          </section>
        </div>
      </div>
    </CreatorShell>
  );
}
