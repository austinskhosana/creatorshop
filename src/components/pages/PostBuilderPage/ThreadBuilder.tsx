"use client";

import { ChatBubbleBottomCenterTextIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useRef, useState } from "react";
import {
  BriefSection,
  BuilderFrame,
  CharacterCount,
  PayButton,
  PreviewNote,
  PreviewPill,
  SectionHeading,
  type BuilderProps,
} from "./BuilderParts";
import { XPost } from "./PlatformPreviews";

interface ThreadPost {
  id: number;
  text: string;
}

/** An X thread: several short posts written and previewed in order. */
export default function ThreadBuilder({ shop, contentType, intro, onPay }: BuilderProps) {
  const limit = contentType.textLimit;
  const min = contentType.range?.min ?? 2;
  const max = contentType.range?.max ?? 10;
  const [posts, setPosts] = useState<ThreadPost[]>([
    { id: 1, text: `I've been using ${shop.product} to make my creative work feel more focused. A thread on what I'm loving so far. #ad` },
    { id: 2, text: "1/ Here's what I noticed first." },
  ]);
  const nextId = useRef(3);
  const problem =
    posts.length < min
      ? `Add at least ${min} posts to continue.`
      : posts.some((post) => post.text.trim().length === 0)
        ? "Every post needs some text."
        : posts.some((post) => post.text.length > limit)
          ? `Shorten any post over ${limit} characters.`
          : null;

  function updatePost(id: number, text: string) {
    setPosts((current) => current.map((post) => (post.id === id ? { ...post, text } : post)));
  }

  function addPost() {
    if (posts.length >= max) return;
    setPosts([...posts, { id: nextId.current++, text: "" }]);
  }

  function removePost(id: number) {
    if (posts.length <= min) return;
    setPosts(posts.filter((post) => post.id !== id));
  }

  return (
    <BuilderFrame
      intro={intro}
      composer={
        <>
          <BriefSection />
          <div className="mt-8">
            <div className="flex items-center justify-between gap-3">
              <SectionHeading icon={<ChatBubbleBottomCenterTextIcon className="size-3.5 text-black" />}>Posts</SectionHeading>
              <span className="text-xs tabular-nums text-neutral-400">
                {posts.length} / {max}
                <span className="sr-only"> posts</span>
              </span>
            </div>
            <p className="mt-2 text-[13px] leading-5 text-neutral-500">
              Write the thread in order. Each post can be up to {limit} characters, and a thread needs at least {min} posts.
            </p>
            <ol className="mt-4 flex flex-col gap-3">
              {posts.map((post, index) => (
                <li key={post.id} className="rounded-xl border border-neutral-200 p-3.5 transition-colors focus-within:border-neutral-900">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-neutral-500">Post {index + 1}</span>
                    <span className="flex items-center gap-3">
                      <CharacterCount count={post.text.length} limit={limit} />
                      {posts.length > min ? (
                        <button
                          type="button"
                          onClick={() => removePost(post.id)}
                          aria-label={`Remove post ${index + 1}`}
                          className="grid size-6 place-items-center rounded-full text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
                        >
                          <XMarkIcon className="size-3.5" strokeWidth={2} />
                        </button>
                      ) : null}
                    </span>
                  </div>
                  <textarea
                    value={post.text}
                    onChange={(event) => updatePost(post.id, event.target.value)}
                    aria-label={`Post ${index + 1}`}
                    rows={3}
                    className="mt-2 w-full resize-none border-0 bg-transparent p-0 text-sm leading-6 font-normal text-neutral-700 outline-none"
                  />
                </li>
              ))}
            </ol>
            {posts.length < max ? (
              <button
                type="button"
                onClick={addPost}
                className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-300 bg-neutral-50/60 text-[13px] font-medium text-neutral-500 transition hover:border-neutral-500 hover:bg-neutral-50 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
              >
                <PlusIcon aria-hidden="true" className="size-4" strokeWidth={2} />
                Add post
              </button>
            ) : null}
          </div>
        </>
      }
      previewPill={<PreviewPill />}
      previewNote={<PreviewNote brand={shop.brand} />}
      preview={
        <ol className="max-h-[460px] overflow-y-auto rounded-[16px] border border-neutral-200 bg-white">
          {posts.map((post, index) => (
            <XPost key={post.id} text={post.text} isLast={index === posts.length - 1} />
          ))}
        </ol>
      }
      action={<PayButton problem={problem} onPay={onPay} />}
    />
  );
}
