"use client";

import { useRef } from "react";
import { PlusIcon } from "@heroicons/react/16/solid";
import Textarea from "@/components/atoms/Textarea/Textarea";
import { MessageBubble } from "@/components/molecules/MessageBubble";
import type { ProductPage, Shopper } from "@/lib/data/brand-schema";
import {
  FIRST_NAME_TOKEN,
  INTRO_MAX_LENGTH,
  campaignMessage,
  fillIntro,
  firstNameOf,
} from "@/lib/intro-message";

interface IntroMessageFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  /** The creator the preview is written to. */
  previewFor: Pick<Shopper, "name">;
  /** Shown under the intro in the preview when a campaign goes with it. */
  campaign?: Pick<ProductPage, "name" | "tiers">;
  autoFocus?: boolean;
  /** `split` puts the preview beside the field on wider screens, for a wide modal. */
  layout?: "stacked" | "split";
}

/**
 * The brand's intro as a template: a `{first name}` button that drops the token at the caret, and a
 * live preview of the thread as one real creator would read it — campaign included.
 */
export default function IntroMessageField({
  value,
  onChange,
  error,
  previewFor,
  campaign,
  autoFocus,
  layout = "stacked",
}: IntroMessageFieldProps) {
  const split = layout === "split";
  const ref = useRef<HTMLTextAreaElement>(null);
  const first = firstNameOf(previewFor.name);
  const filled = fillIntro(value, previewFor);
  const canInsert = value.length + FIRST_NAME_TOKEN.length <= INTRO_MAX_LENGTH;

  function insertFirstName() {
    const field = ref.current;
    const start = field?.selectionStart ?? value.length;
    const end = field?.selectionEnd ?? value.length;
    onChange(value.slice(0, start) + FIRST_NAME_TOKEN + value.slice(end));
    // After React writes the new value, put the caret just past the token.
    requestAnimationFrame(() => {
      const caret = start + FIRST_NAME_TOKEN.length;
      field?.focus();
      field?.setSelectionRange(caret, caret);
    });
  }

  return (
    <div className={split ? "grid gap-4 md:grid-cols-2 md:gap-5" : undefined}>
      <div>
        <Textarea
          ref={ref}
          label="Intro message"
          rows={split ? 7 : 5}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          maxLength={INTRO_MAX_LENGTH}
          maxChars={INTRO_MAX_LENGTH}
          currentLength={value.length}
          error={error}
          autoFocus={autoFocus}
        />
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
          <button
            type="button"
            onClick={insertFirstName}
            disabled={!canInsert}
            className="inline-flex min-h-8 items-center gap-1 rounded-lg border border-neutral-200 bg-white px-2.5 text-xs font-medium text-neutral-700 transition-[background-color,border-color,transform] duration-150 hover:border-neutral-300 hover:bg-neutral-50 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <PlusIcon
              aria-hidden="true"
              className="size-3.5 text-neutral-400"
            />
            First name
          </button>
          <p className="text-xs text-neutral-500">
            Adds{" "}
            <code className="rounded bg-neutral-100 px-1 py-px font-mono text-[11px] text-neutral-700">
              {FIRST_NAME_TOKEN}
            </code>
            , which becomes each creator&apos;s name.
          </p>
        </div>
      </div>

      <section
        aria-label={`Preview of what ${first} sees`}
        className={
          split
            ? "rounded-2xl bg-neutral-50 p-4 md:mt-7"
            : "mt-4 rounded-2xl bg-neutral-50 p-4"
        }
      >
        <p className="text-xs font-medium text-neutral-500">
          How {first} sees it
        </p>
        <div className="mt-3 flex flex-col gap-1.5">
          {filled ? (
            <>
              <MessageBubble
                text={filled}
                meta="You · now"
                variant="outgoing"
                animateIn={false}
                showMeta={!campaign}
                tail={!campaign}
              />
              {campaign ? (
                <MessageBubble
                  text={campaignMessage(campaign)}
                  meta="You · now"
                  variant="outgoing"
                  animateIn={false}
                />
              ) : null}
            </>
          ) : (
            <p className="py-3 text-center text-xs text-neutral-400">
              Your intro shows here as you write it.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
