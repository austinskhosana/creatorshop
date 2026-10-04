import { EnvelopeIcon, EnvelopeOpenIcon, MagnifyingGlassIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { EmptySearch } from "@/components/atoms/EmptySearch";
import { EmptyState } from "@/components/molecules/EmptyState";
import { ThreadListItem } from "@/components/molecules/ThreadListItem";
import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from "@/components/ui/context-menu";
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

export interface ThreadListEntry {
  id: string;
  name: string;
  preview: string;
  time: string;
  unread?: boolean;
  online?: boolean;
  official?: boolean;
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
  /** Right-click (or long-press) actions on a thread. The menu only appears when at least one is given. */
  onToggleRead?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function ThreadList({ threads, activeId, onSelect, query, onQueryChange, unreadCount, onNewMessage, onToggleRead, onDelete }: ThreadListProps) {
  const hasMenu = Boolean(onToggleRead || onDelete);

  return (
    <aside className="flex h-full min-h-0 flex-col border-neutral-200 lg:border-r">
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
        {threads.map((thread) => {
          const item = (
            <ThreadListItem
              name={thread.name}
              preview={thread.preview}
              time={thread.time}
              image={thread.image}
              online={thread.online}
              official={thread.official}
              unread={thread.unread}
              selected={thread.id === activeId}
              onClick={() => onSelect(thread.id)}
            />
          );
          if (!hasMenu) return <div key={thread.id}>{item}</div>;
          return (
            <ContextMenu key={thread.id}>
              {/* The row holds its hover tint while its menu is open, so it's clear which thread the menu is for. */}
              <ContextMenuTrigger className="rounded-xl [&[data-popup-open]>button]:bg-neutral-100">{item}</ContextMenuTrigger>
              <ContextMenuContent aria-label={`Actions for ${thread.name}`}>
                {onToggleRead ? (
                  <DropdownMenuItem onClick={() => onToggleRead(thread.id)}>
                    {thread.unread ? <EnvelopeOpenIcon aria-hidden="true" strokeWidth={1.75} /> : <EnvelopeIcon aria-hidden="true" strokeWidth={1.75} />}
                    {thread.unread ? "Mark as read" : "Mark as unread"}
                  </DropdownMenuItem>
                ) : null}
                {onToggleRead && onDelete ? <DropdownMenuSeparator /> : null}
                {onDelete ? (
                  <DropdownMenuItem variant="destructive" onClick={() => onDelete(thread.id)}>
                    <TrashIcon aria-hidden="true" strokeWidth={1.75} />
                    Delete conversation
                  </DropdownMenuItem>
                ) : null}
              </ContextMenuContent>
            </ContextMenu>
          );
        })}
        {threads.length === 0 ? (
          <EmptyState
            framed={false}
            illustration={<EmptySearch />}
            title="No conversations match"
            description={query.trim() ? `Nothing in your messages mentions “${query.trim()}”.` : undefined}
            action={query ? { label: "Clear search", onClick: () => onQueryChange("") } : undefined}
            className="px-3 py-10 sm:py-12"
          />
        ) : null}
      </div>
    </aside>
  );
}
