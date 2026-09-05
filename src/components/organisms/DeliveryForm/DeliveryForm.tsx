"use client";

import { useState } from "react";

interface DeliveryFormProps {
  onDelivered: (link: string) => void;
}

export default function DeliveryForm({ onDelivered }: DeliveryFormProps) {
  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-gray-200 text-[14px] text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-gray-400 transition-colors duration-[120ms] bg-white";

  async function handleSubmit() {
    if (!url.trim()) {
      setErrorMsg("Please enter the URL to your content.");
      setStatus("error");
      return;
    }
    try {
      new URL(url.trim());
    } catch {
      setErrorMsg("That doesn't look like a valid URL.");
      setStatus("error");
      return;
    }
    setStatus("submitting");
    setErrorMsg("");
    // Reference-only: no backend to submit to yet, so this simulates the round trip.
    await new Promise((resolve) => setTimeout(resolve, 600));
    onDelivered(url.trim());
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="mb-1.5 block text-[13px] font-medium text-gray-600">Link to your content</label>
        <input
          type="url"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setStatus("idle");
          }}
          placeholder="https://instagram.com/p/… or https://tiktok.com/@…"
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-1.5 block text-[13px] font-medium text-gray-600">
          Note <span className="font-normal text-gray-300">— optional</span>
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Anything you want the brand to know…"
          rows={3}
          className={inputClass + " resize-none"}
        />
      </div>
      {status === "error" && <p className="text-[13px] text-red-500">{errorMsg}</p>}
      <button
        onClick={handleSubmit}
        disabled={status === "submitting"}
        className="w-full rounded-2xl border border-[#82F200] bg-[#A3FF38] py-3.5 text-[15px] font-semibold text-gray-900 shadow-[inset_3px_3px_6px_rgba(255,255,255,0.4)] transition-all duration-[140ms] hover:brightness-95 active:scale-[0.98] disabled:opacity-50"
      >
        {status === "submitting" ? "Submitting…" : "Submit Delivery"}
      </button>
      <p className="text-center text-[12px] text-gray-400">Make sure your post is live and public before submitting.</p>
    </div>
  );
}
