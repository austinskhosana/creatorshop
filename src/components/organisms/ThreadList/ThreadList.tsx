import { MagnifyingGlassIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { ThreadListItem } from "@/components/molecules/ThreadListItem";

export interface ThreadListEntry {
  id: string;
  name: string;
  preview: string;
  time: string;
  unread?: boolean;
  online?: boolean;
  image?: string;
}

interface ThreadListProps {
  threads: ThreadListEntry[];
  activeId: string;
  onSelect: (id: string) => void;
  query: string;
  onQueryChange: (query: string) => void;
  unreadCount?: number;
  onNewMessage?: () => void;
}

export default function ThreadList({ threads, activeId, onSelect, query, onQueryChange, unreadCount, onNewMessage }: ThreadListProps) {
  return (
    <aside className="flex h-full min-h-0 flex-col border-b border-neutral-200 lg:border-r lg:border-b-0">
      <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-neutral-200 px-4">
        <div>
          <h1 className="text-lg font-semibold tracking-[-0.02em] text-neutral-950">Messages</h1>
        </div>
        <button
          type="button"
          onClick={onNewMessage}
          aria-label="Start a new message"
          className="grid size-10 place-items-center rounded-lg text-neutral-600 transition-[background-color,color,transform] duration-150 hover:bg-neutral-50 hover:text-neutral-950 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
        >
          <PencilSquareIcon className="size-[18px]" />
        </button>
      </div>

      <div className="shrink-0 px-4 py-3.5">
        <label className="relative block">
          <MagnifyingGlassIcon aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search conversations"
            aria-label="Search conversations"
            className="h-10 w-full rounded-xl bg-neutral-100 pr-3 pl-9 text-sm text-neutral-900 outline-none transition-[background-color,box-shadow] duration-150 placeholder:text-neutral-400 focus:bg-white focus:ring-2 focus:ring-neutral-900"
          />
        </label>
        <div className="mt-3 flex gap-1.5" aria-label="Message filters">
          <button type="button" className="h-7 rounded-full bg-neutral-900 px-3 text-xs font-medium text-white transition-transform duration-150 active:scale-[0.96]">
            All
          </button>
          <button
            type="button"
            className="h-7 rounded-full border border-neutral-200 bg-white px-3 text-xs font-medium text-neutral-600 transition-[background-color,border-color,color,transform] duration-150 hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900 active:scale-[0.96]"
          >
            Unread <span className="ml-1 tabular-nums text-neutral-400">{unreadCount ?? 0}</span>
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 py-2.5" aria-label="Conversation list">
        {threads.map((thread) => (
          <ThreadListItem
            key={thread.id}
            name={thread.name}
            preview={thread.preview}
            time={thread.time}
            image={thread.image}
            online={thread.online}
            unread={thread.unread}
            selected={thread.id === activeId}
            onClick={() => onSelect(thread.id)}
          />
        ))}
        {threads.length === 0 ? <p className="px-3 py-10 text-center text-sm text-neutral-500">No conversations found.</p> : null}
      </div>
    </aside>
  );
}
