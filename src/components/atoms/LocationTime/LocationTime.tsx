"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface LocationTimeProps {
  className?: string;
}

function cityFromTimeZone(timeZone: string) {
  const city = timeZone.split("/").pop() ?? timeZone;
  return city.replace(/_/g, " ").toUpperCase();
}

export default function LocationTime({ className }: LocationTimeProps) {
  const [display, setDisplay] = useState<{ location: string; time: string } | null>(null);

  useEffect(() => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const location = cityFromTimeZone(timeZone);
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    const tick = () => setDisplay({ location, time: formatter.format(new Date()) });
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className={cn(
        "font-geist-mono flex items-center gap-2 text-[11px] tracking-[0.1em] text-neutral-400 uppercase",
        className,
      )}
    >
      <span>{display?.location ?? "LOCATING"}</span>
      <span className="text-neutral-300">·</span>
      <span className="tabular-nums">{display?.time ?? "--:--"}</span>
    </div>
  );
}
