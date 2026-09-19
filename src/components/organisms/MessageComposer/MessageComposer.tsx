"use client";

import { ArrowUpIcon, FaceSmileIcon, PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { MessageContent } from "@/components/molecules/MessageBubble/MessageBubble";

const EMOJI_GROUPS: { label: string; emojis: string[] }[] = [
  { label: "Smileys", emojis: ["😀", "😂", "🥹", "😍", "🤩", "😎", "🥳", "😤", "🫡", "🤝", "🙏", "💀", "👀", "🔥", "💯", "✨", "❤️", "💜", "🫶", "👏"] },
  { label: "Gestures", emojis: ["👍", "👎", "✌️", "🤞", "🤟", "💪", "🫰", "👋", "🙌", "🤌"] },
  { label: "Objects", emojis: ["🎉", "🎊", "🏆", "📸", "🎬", "🎤", "🎧", "💻", "📱", "✏️", "📦", "💰", "⚡", "🚀", "💡", "🔗"] },
];

const MOCK_GIFS: { id: string; label: string; gradient: string }[] = [
  { id: "excited", label: "Excited", gradient: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)" },
  { id: "thumbsup", label: "Thumbs Up", gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)" },
  { id: "celebrate", label: "Celebrate", gradient: "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)" },
  { id: "thanks", label: "Thanks", gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)" },
  { id: "love", label: "Love It", gradient: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)" },
  { id: "mind-blown", label: "Mind Blown", gradient: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)" },
  { id: "nice", label: "Nice", gradient: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)" },
  { id: "dancing", label: "Dancing", gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
  { id: "wow", label: "Wow", gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
  { id: "nope", label: "Nope", gradient: "linear-gradient(135deg, #c3cfe2 0%, #f5f7fa 100%)" },
  { id: "lol", label: "LOL", gradient: "linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)" },
  { id: "high-five", label: "High Five", gradient: "linear-gradient(135deg, #96fbc4 0%, #f9f586 100%)" },
];

type ActivePicker = "emoji" | "gif" | null;

interface MessageComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onSendContent?: (content: MessageContent) => void;
  placeholder?: string;
}

function EmojiPicker({ onSelect }: { onSelect: (emoji: string) => void }) {
  return (
    <>
      <div className="flex items-center px-3 py-2">
        <p className="text-xs font-semibold text-neutral-700">Emoji</p>
      </div>
      <div className="max-h-44 overflow-y-auto px-3 pb-2.5">
        {EMOJI_GROUPS.map((group) => (
          <div key={group.label} className="mb-2 last:mb-0">
            <p className="mb-1 text-[10px] font-medium tracking-wide text-neutral-400 uppercase">{group.label}</p>
            <div className="grid grid-cols-8 gap-0">
              {group.emojis.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => onSelect(emoji)}
                  className="grid size-8 place-items-center rounded-md text-base transition-[background-color,transform] duration-100 hover:bg-neutral-100 active:scale-90"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function GifPicker({ onSelect }: { onSelect: (gif: typeof MOCK_GIFS[number]) => void }) {
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? MOCK_GIFS.filter((g) => g.label.toLowerCase().includes(search.toLowerCase()))
    : MOCK_GIFS;

  return (
    <>
      <div className="flex items-center px-3 py-2">
        <p className="text-xs font-semibold text-neutral-700">GIFs</p>
      </div>
      <div className="px-3 pb-1.5">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search GIFs…"
          className="w-full rounded-md border border-neutral-200 bg-neutral-50 px-2.5 py-1.5 text-xs text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-400"
        />
      </div>
      <div className="max-h-44 overflow-y-auto px-3 pb-2.5">
        <div className="grid grid-cols-3 gap-1.5">
          {filtered.map((gif) => (
            <button
              key={gif.id}
              type="button"
              onClick={() => onSelect(gif)}
              className="group relative aspect-[4/3] overflow-hidden rounded-lg transition-[transform,box-shadow] duration-150 hover:scale-[1.03] hover:shadow-md active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
              style={{ background: gif.gradient }}
            >
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/40 to-transparent px-1.5 pb-1.5 pt-4">
                <span className="text-[10px] font-semibold text-white drop-shadow-sm">{gif.label}</span>
              </span>
            </button>
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="py-6 text-center text-xs text-neutral-400">No GIFs match &quot;{search}&quot;</p>
        )}
      </div>
    </>
  );
}

function ImagePreview({ src, onRemove }: { src: string; onRemove: () => void }) {
  return (
    <div className="border-t border-neutral-100 bg-white px-4 py-3">
      <div className="relative inline-block">
        <Image src={src} alt="Upload preview" width={120} height={90} className="h-20 w-auto rounded-xl border border-neutral-200 object-cover" unoptimized />
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove image"
          className="absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full bg-neutral-900 text-white shadow-sm transition-transform hover:scale-110"
        >
          <XMarkIcon className="size-3" />
        </button>
      </div>
    </div>
  );
}

export default function MessageComposer({ value, onChange, onSubmit, onSendContent, placeholder = "Chat..." }: MessageComposerProps) {
  const [activePicker, setActivePicker] = useState<ActivePicker>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const togglePicker = useCallback((picker: ActivePicker) => {
    setActivePicker((current) => (current === picker ? null : picker));
  }, []);

  useEffect(() => {
    if (!activePicker) return;
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setActivePicker(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activePicker]);

  function handleEmojiSelect(emoji: string) {
    onChange(value + emoji);
    setActivePicker(null);
  }

  function handleGifSelect(gif: typeof MOCK_GIFS[number]) {
    onSendContent?.({ type: "gif", src: gif.gradient, alt: gif.label });
    setActivePicker(null);
  }

  function handleImageFile(file: File | undefined) {
    if (!file || !file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setImagePreview(url);
    setActivePicker(null);
  }

  function removeImagePreview() {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (imagePreview) {
      onSendContent?.({ type: "image", src: imagePreview });
      setImagePreview(null);
      return;
    }
    onSubmit(event);
  }

  return (
    <form onSubmit={handleSubmit} className="relative shrink-0 bg-white">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          handleImageFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      {activePicker && (
        <div
          ref={popoverRef}
          className="absolute bottom-full left-3 z-50 mb-2 w-72 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg"
        >
          {activePicker === "emoji" && <EmojiPicker onSelect={handleEmojiSelect} />}
          {activePicker === "gif" && <GifPicker onSelect={handleGifSelect} />}
        </div>
      )}

      {imagePreview && <ImagePreview src={imagePreview} onRemove={removeImagePreview} />}

      <div className="flex items-center gap-1 px-4 py-3.5 sm:px-6">
        <button
          type="button"
          aria-label="Add an image"
          onClick={() => fileInputRef.current?.click()}
          className={`grid size-10 shrink-0 place-items-center rounded-full transition-[background-color,color,transform] duration-150 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 ${
            imagePreview ? "bg-neutral-900 text-white" : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
          }`}
        >
          <PhotoIcon className="size-[18px]" />
        </button>
        <button
          type="button"
          aria-label="Add emoji"
          onClick={() => togglePicker("emoji")}
          className={`grid size-10 shrink-0 place-items-center rounded-full transition-[background-color,color,transform] duration-150 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 ${
            activePicker === "emoji" ? "bg-neutral-900 text-white" : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
          }`}
        >
          <FaceSmileIcon className="size-[18px]" />
        </button>
        <button
          type="button"
          aria-label="Add a GIF"
          onClick={() => togglePicker("gif")}
          className={`grid h-10 shrink-0 place-items-center rounded-full px-2.5 text-[11px] font-semibold tracking-tight transition-[background-color,color,transform] duration-150 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 ${
            activePicker === "gif" ? "bg-neutral-900 text-white" : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
          }`}
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
            disabled={!value.trim() && !imagePreview}
            className="grid size-10 shrink-0 place-items-center rounded-full bg-neutral-900 text-white transition-[background-color,color,transform] duration-150 hover:bg-neutral-700 active:scale-[0.96] disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-400 disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          >
            <ArrowUpIcon className="size-[18px]" />
          </button>
        </div>
      </div>
    </form>
  );
}
