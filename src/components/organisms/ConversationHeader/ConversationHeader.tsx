import { EllipsisHorizontalIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { ThreadAvatar } from "@/components/molecules/ThreadAvatar";

interface ConversationHeaderProps {
  name: string;
  detail: string;
  image?: string;
  online?: boolean;
  onSearch?: () => void;
  onMore?: () => void;
}

export default function ConversationHeader({ name, detail, image, online, onSearch, onMore }: ConversationHeaderProps) {
  return (
    <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-neutral-200 px-5 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <ThreadAvatar name={name} image={image} online={online} />
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold tracking-[-0.01em] text-neutral-950">{name}</h2>
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
        <button
          type="button"
          onClick={onMore}
          aria-label="More conversation options"
          className="grid size-10 place-items-center rounded-lg text-neutral-500 transition-[background-color,color,transform] duration-150 hover:bg-neutral-100 hover:text-neutral-900 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
        >
          <EllipsisHorizontalIcon className="size-5" />
        </button>
      </div>
    </header>
  );
}
