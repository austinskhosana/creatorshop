"use client";

import { useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useTilt } from "@/hooks/use-tilt";

interface AccessTicketProps {
  access: string;
  className?: string;
}

function TicketNotches() {
  return (
    <>
      <span aria-hidden="true" className="absolute top-1/2 -left-3 size-6 -translate-y-1/2 rounded-full bg-white" />
      <span aria-hidden="true" className="absolute top-1/2 -right-3 size-6 -translate-y-1/2 rounded-full bg-white" />
    </>
  );
}

export default function AccessTicket({ access, className }: AccessTicketProps) {
  const reduceMotion = useReducedMotion();
  const { rotateX, rotateY, handleMouseMove, handleMouseLeave } = useTilt(10);

  return (
    <div
      onMouseMove={reduceMotion ? undefined : handleMouseMove}
      onMouseLeave={reduceMotion ? undefined : handleMouseLeave}
      style={{
        transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: "transform 0.15s ease-out",
      }}
      className={`relative mx-auto h-56 w-full max-w-sm sm:h-64 sm:max-w-md ${className ?? ""}`}
    >
      <div className="relative size-full">
        <div className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-200 bg-white p-7 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <TicketNotches />
          <Image src="/Logo.svg" alt="Creatorshop" width={142} height={41} className="h-9 w-auto self-start" />
          <div className="flex items-center justify-between border-t border-dashed border-neutral-200 pt-3.5">
            <span className="text-[11px] font-medium tracking-[0.1em] text-neutral-400 uppercase">Access pass</span>
            <span className="text-[11px] font-semibold tracking-[0.1em] text-neutral-950 uppercase">{access}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
