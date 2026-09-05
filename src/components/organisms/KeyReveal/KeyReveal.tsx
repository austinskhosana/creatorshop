"use client";

import { useState } from "react";
import { SectionCard } from "@/components/organisms/SectionCard";

export default function KeyReveal({ accessKey }: { accessKey: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(accessKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <SectionCard
      icon={
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-gray-900">
          <path
            fillRule="evenodd"
            d="M15.75 1.5a6.75 6.75 0 0 0-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 0 0-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 0 0 .75-.75v-1.5h1.5A.75.75 0 0 0 9 19.5V18h1.5a.75.75 0 0 0 .53-.22l.5-.5c.19-.189.517-.288.907-.22A6.75 6.75 0 1 0 15.75 1.5Zm0 3a.75.75 0 0 0 0 1.5A2.25 2.25 0 0 1 18 8.25a.75.75 0 0 0 1.5 0 3.75 3.75 0 0 0-3.75-3.75Z"
            clipRule="evenodd"
          />
        </svg>
      }
      title="Access Key"
      description="Use this to activate your subscription."
    >
      <div className="flex items-center justify-between gap-3 rounded-2xl bg-gray-50 px-5 py-4">
        <span className="font-mono text-[18px] font-bold tracking-[0.15em] text-neutral-900 select-all">
          {accessKey}
        </span>
        <button
          onClick={handleCopy}
          className="flex-shrink-0 rounded-xl bg-neutral-900 px-4 py-2 text-[13px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] transition-all duration-[140ms] hover:opacity-90 active:scale-[0.97]"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <p className="text-[12px] text-gray-400">Keep this safe — you&apos;ll need it to redeem your subscription.</p>
    </SectionCard>
  );
}
