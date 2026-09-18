import { ArrowUpIcon, FaceSmileIcon, PhotoIcon } from "@heroicons/react/24/outline";

interface MessageComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  placeholder?: string;
}

export default function MessageComposer({ value, onChange, onSubmit, placeholder = "Chat..." }: MessageComposerProps) {
  return (
    <form onSubmit={onSubmit} className="shrink-0 bg-white px-4 py-3.5 sm:px-6">
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="Add an image"
          className="grid size-10 shrink-0 place-items-center rounded-full text-neutral-500 transition-[background-color,color,transform] duration-150 hover:bg-neutral-100 hover:text-neutral-900 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
        >
          <PhotoIcon className="size-[18px]" />
        </button>
        <button
          type="button"
          aria-label="Add emoji"
          className="grid size-10 shrink-0 place-items-center rounded-full text-neutral-500 transition-[background-color,color,transform] duration-150 hover:bg-neutral-100 hover:text-neutral-900 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
        >
          <FaceSmileIcon className="size-[18px]" />
        </button>
        <button
          type="button"
          aria-label="Add a GIF"
          className="grid h-10 shrink-0 place-items-center rounded-full px-2.5 text-[11px] font-semibold tracking-tight text-neutral-500 transition-[background-color,color,transform] duration-150 hover:bg-neutral-100 hover:text-neutral-900 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
        >
          GIF
        </button>

        <div className="flex min-w-0 flex-1 items-center gap-1 rounded-full border border-neutral-200 bg-white py-1 pr-1 pl-4 transition-[border-color,box-shadow] duration-150 focus-within:border-neutral-400 focus-within:ring-4 focus-within:ring-neutral-100">
          <input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            aria-label={placeholder}
            className="min-w-0 flex-1 bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
          />
          <button
            type="submit"
            aria-label="Send message"
            disabled={!value.trim()}
            className="grid size-10 shrink-0 place-items-center rounded-full bg-neutral-900 text-white transition-[background-color,color,transform] duration-150 hover:bg-neutral-700 active:scale-[0.96] disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-400 disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          >
            <ArrowUpIcon className="size-[18px]" />
          </button>
        </div>
      </div>
    </form>
  );
}
