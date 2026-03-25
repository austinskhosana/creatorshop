"use client";

import { use, useRef, useEffect, useState } from "react";
import Link from "next/link";

const MOCK_ACCESS: Record<string, { name: string; planName: string; months: number; accessKey: string }> = {
  "1": { name: "Notion",    planName: "Plus",         months: 3, accessKey: "NOTION-XKCD-7291" },
  "2": { name: "Figma",     planName: "Professional", months: 1, accessKey: "FIGMA-PRO2-4823"  },
  "3": { name: "CapCut",    planName: "Pro",          months: 2, accessKey: "CAPCUT-9KX2-8811" },
  "4": { name: "Mailchimp", planName: "Standard",     months: 3, accessKey: "MCHMP-STD-3312"   },
  "5": { name: "Buffer",    planName: "Essentials",   months: 1, accessKey: "BUFF-ESS-5509"     },
};

// ── Scratch card ──────────────────────────────────────────────────────────────

function ScratchCard({ accessKey, onRevealed }: { accessKey: string; onRevealed: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const hasRevealed = useRef(false);
  const [fullyRevealed, setFullyRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Deep charcoal base
    ctx.fillStyle = "#141414";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle dot grid
    ctx.fillStyle = "rgba(255,255,255,0.06)";
    for (let x = 12; x < canvas.width; x += 18) {
      for (let y = 12; y < canvas.height; y += 18) {
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Hint text
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.font = "500 13px 'Courier New', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("scratch to reveal", canvas.width / 2, canvas.height / 2);
  }, []);

  function getPos(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  function scratch(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
    if (!isDrawing.current || hasRevealed.current) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const { x, y } = getPos(e);

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 34, 0, Math.PI * 2);
    ctx.fill();

    // Check how much has been scratched
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let transparent = 0;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 128) transparent++;
    }
    const pct = transparent / (data.length / 4);
    if (pct > 0.38) {
      hasRevealed.current = true;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setFullyRevealed(true);
      onRevealed();
    }
  }

  return (
    <div className="relative w-full rounded-2xl overflow-hidden" style={{ height: 180 }}>
      {/* Code underneath */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#F7F7F5] rounded-2xl">
        <p className="font-mono text-[11px] font-medium text-gray-400 uppercase tracking-widest">Your Access Key</p>
        <span className="font-mono text-[24px] font-bold tracking-[0.2em] text-gray-900 select-all">
          {accessKey}
        </span>
      </div>

      {/* Scratchable surface */}
      {!fullyRevealed && (
        <canvas
          ref={canvasRef}
          width={560}
          height={180}
          className="absolute inset-0 w-full h-full rounded-2xl cursor-crosshair touch-none"
          onMouseDown={() => { isDrawing.current = true; }}
          onMouseMove={scratch}
          onMouseUp={() => { isDrawing.current = false; }}
          onMouseLeave={() => { isDrawing.current = false; }}
          onTouchStart={(e) => { e.preventDefault(); isDrawing.current = true; }}
          onTouchMove={(e) => { e.preventDefault(); scratch(e); }}
          onTouchEnd={() => { isDrawing.current = false; }}
        />
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AccessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const shop = MOCK_ACCESS[id] ?? MOCK_ACCESS["1"];

  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(shop.accessKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-16">

      {/* Back */}
      <Link
        href="/shops"
        className="absolute top-8 left-8 inline-flex items-center gap-1.5 text-[13px] text-gray-400 hover:text-gray-700 transition-colors duration-[120ms]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
        </svg>
        My Shops
      </Link>

      <div className="w-full max-w-sm flex flex-col items-center gap-8">

        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-[#A3FF38] flex items-center justify-center shadow-[0_4px_24px_rgba(163,255,56,0.35)]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-gray-900">
            <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
          </svg>
        </div>

        {/* Heading */}
        <div className="text-center">
          <h1 className="text-[28px] font-semibold text-gray-900 leading-tight mb-2">
            You&apos;re in.
          </h1>
          <p className="text-[15px] text-gray-400 leading-snug">
            Your {shop.months} {shop.months === 1 ? "month" : "months"} of {shop.name} {shop.planName} is ready.
            <br />Scratch below to reveal your access key.
          </p>
        </div>

        {/* Scratch card */}
        <div className="w-full flex flex-col gap-5">
          <ScratchCard accessKey={shop.accessKey} onRevealed={() => setRevealed(true)} />

          {/* Copy button — fades in after reveal */}
          <button
            onClick={handleCopy}
            disabled={!revealed}
            className={[
              "w-full py-3.5 rounded-2xl text-[15px] font-semibold transition-all duration-300",
              revealed
                ? "bg-gray-900 text-white hover:opacity-90 active:scale-[0.98]"
                : "bg-gray-100 text-gray-300 cursor-not-allowed",
            ].join(" ")}
          >
            {copied ? "Copied!" : "Copy Access Key"}
          </button>
        </div>

        {/* Note */}
        {revealed && (
          <p className="text-[12px] text-gray-400 text-center">
            Keep this safe — your access key won&apos;t be shown again.
          </p>
        )}

      </div>
    </div>
  );
}
