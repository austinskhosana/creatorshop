"use client";

import { MessagesPage } from "@/components/pages/MessagesPage";
import { BrandShell } from "@/components/templates/BrandShell";
import { threadsFor, withInvites } from "@/lib/mock-brand-messages";
import { useBrandState } from "@/lib/store/brand-store";
import { getShopper } from "@/lib/mock-brand";
import type { InboxThread } from "@/lib/mock-messages";

/**
 * S1 for brands — one thread per creator. Swipe-mode invites land in the creator's thread.
 * Opening a creator without a thread yet starts an empty one, so "Message" from a profile or an
 * approval always lands somewhere.
 */
export default function BrandMessagesPage({ threadId }: { threadId?: string }) {
  const state = useBrandState();
  const brandThreads = withInvites(threadsFor(state.account), state);
  const shopper = threadId ? getShopper(threadId) : undefined;
  const threads: InboxThread[] =
    shopper && !brandThreads.some((thread) => thread.id === shopper.id)
      ? [{ id: shopper.id, participant: "brand", name: shopper.name, detail: `@${shopper.handle}`, image: shopper.avatar, messages: [] }, ...brandThreads]
      : brandThreads;

  // The inbox picks its open thread once, on mount. Keying on the account remounts it when the stored
  // session loads, so it opens on the top thread rather than the signed-out support-only list.
  return <MessagesPage key={`${state.account?.slug ?? "signed-out"}:${threadId ?? "inbox"}`} threads={threads} shell={BrandShell} initialThreadId={threadId} />;
}
