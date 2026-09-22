"use client";

import { useState } from "react";
import { resolveContentType } from "@/lib/content-types";
import { CREATOR, type CreatorShop } from "@/lib/mock-creator";
import { checkProofLink } from "@/lib/proof-links";

export interface ProofController {
  /** Stories have no permanent link, so they take a screenshot instead. */
  kind: "link" | "screenshot";
  platform: string;
  handle: string;
  link: string;
  setLink: (link: string) => void;
  screenshot: boolean;
  setScreenshot: (uploaded: boolean) => void;
  /** Why the proof can't be submitted yet, or null. */
  problem: string | null;
  /** Shown under the field as soon as something is typed. */
  linkProblem: string | null;
  note: string | null;
  /** How the proof reads on the receipt. */
  receiptValue: string;
}

/** The proof of payment a creator submits: the link to their live post, or a screenshot for a Story. */
export function useProof(shop: CreatorShop): ProofController {
  const contentType = resolveContentType(shop.tier);
  const platform = contentType.platform;
  const kind = contentType.id === "ig-story" ? "screenshot" : "link";
  const handle = CREATOR.platforms.find((item) => item.name === platform)?.handle ?? CREATOR.handle;
  const [link, setLink] = useState("");
  const [screenshot, setScreenshot] = useState(false);

  const check = checkProofLink(platform, link, handle);
  const problem = kind === "screenshot" ? (screenshot ? null : "Upload a screenshot of your story.") : check.problem;

  return {
    kind,
    platform,
    handle,
    link,
    setLink,
    screenshot,
    setScreenshot,
    problem,
    linkProblem: link.trim() !== "" ? check.problem : null,
    note: check.problem === null ? check.note : null,
    receiptValue: kind === "screenshot" ? "Screenshot" : check.short,
  };
}
