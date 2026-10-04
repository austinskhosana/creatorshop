import { ChevronLeftIcon, EllipsisHorizontalIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { OfficialBadge } from "@/components/atoms/OfficialBadge";
import { ActionMenu, type ActionMenuItem } from "@/components/molecules/ActionMenu";
import { ThreadAvatar } from "@/components/molecules/ThreadAvatar";

interface ConversationHeaderProps {
  name: string;
  detail: string;
  image?: string;
  online?: boolean;
  /** Creatorshop team account. */
  official?: boolean;
  onSearch?: () => void;
  onMore?: () => void;
  /** Fills the "⋯" button with a menu, in place of onMore. */
  actions?: ActionMenuItem[];
  /** Back to the inbox. Only shown below the split-view breakpoint, where the list and thread are separate screens. */
  onBack?: () => void;
}

export default function ConversationHeader({ name, detail, image, online, official, onSearch, onMore, actions, onBack }: ConversationHeaderProps) {
  return (
    <header className={`flex h-[72px] shrink-0 items-center justify-between border-b border-neutral-200 pr-5 sm:pr-6 ${onBack ? "pl-2 lg:pl-6" : "pl-5 sm:pl-6"}`}>
      <div className="flex min-w-0 items-center gap-3">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to messages"
            className="-mr-1 grid size-11 shrink-0 place-items-center rounded-lg text-neutral-700 transition-[background-color,color,transform] duration-150 hover:bg-neutral-100 hover:text-neutral-950 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 lg:hidden"
          >
            <ChevronLeftIcon className="size-5" />
          </button>
        ) : null}
        <ThreadAvatar name={name} image={image} online={online} />
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-1">
            <h2 className="truncate text-sm font-semibold tracking-[-0.01em] text-neutral-950">{name}</h2>
            {official ? <OfficialBadge /> : null}
          </div>
          <p className="mt-0.5 truncate text-xs text-neutral-500">{detail}</p>
        </div>
      </div>
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          onClick={onSearch}
          aria-label="Search this conversation"
          className="grid size-10 place-items-center rounded-lg text-neutral-500 transition-[background-color,color,transform] duration-150 hover:bg-neutral-100 hover:text-neutral-900 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
        >
          <MagnifyingGlassIcon className="size-[18px]" />
        </button>
        {actions ? (
          <ActionMenu items={actions} label="More conversation options" appearance="ghost" />
        ) : (
          <button
            type="button"
            onClick={onMore}
            aria-label="More conversation options"
            className="grid size-10 place-items-center rounded-lg text-neutral-500 transition-[background-color,color,transform] duration-150 hover:bg-neutral-100 hover:text-neutral-900 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
          >
            <EllipsisHorizontalIcon className="size-5" />
          </button>
        )}
      </div>
    </header>
  );
}
