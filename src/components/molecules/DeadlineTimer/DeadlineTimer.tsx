"use client";

import { useState, useEffect } from "react";

function getTimeLeft(deadline: Date) {
  const diff = deadline.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
    expired: false,
  };
}

function useCountdown(deadline: Date) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(deadline));

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft(deadline)), 1000);
    return () => clearInterval(id);
  }, [deadline]);

  return timeLeft;
}

export default function DeadlineTimer({ deadline }: { deadline: Date }) {
  const { days, hours, minutes, seconds, expired } = useCountdown(deadline);
  const urgency = expired || days < 1 ? "red" : days < 3 ? "amber" : "green";
  const c = {
    green: { border: "border-gray-200", text: "text-gray-600", dot: "bg-[#A3FF38]" },
    amber: { border: "border-amber-200", text: "text-amber-700", dot: "bg-amber-400" },
    red: { border: "border-red-200", text: "text-red-600", dot: "bg-red-400" },
  }[urgency];
  const pad = (n: number) => String(n).padStart(2, "0");

  if (expired) {
    return (
      <div className={`flex items-center gap-3 rounded-2xl border ${c.border} px-5 py-4`}>
        <div className={`h-2 w-2 rounded-full ${c.dot}`} />
        <p className={`text-[14px] font-semibold ${c.text}`}>Deadline has passed</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center rounded-2xl border ${c.border} px-5 py-4 text-center`}>
      <div className="mb-3 flex items-center gap-2">
        <div className={`h-2 w-2 rounded-full ${c.dot}`} />
        <p className={`text-[12px] font-semibold tracking-wider uppercase ${c.text}`}>Time remaining</p>
      </div>
      <div className="flex items-end gap-3">
        {[
          { value: days, label: "days" },
          { value: hours, label: "hours" },
          { value: minutes, label: "min" },
          { value: seconds, label: "sec" },
        ].map(({ value, label }) => (
          <div key={label} className="flex flex-col items-center gap-0.5">
            <span className={`text-[28px] leading-none font-bold tabular-nums ${c.text}`}>
              {label === "days" ? value : pad(value)}
            </span>
            <span className={`text-[11px] font-medium ${c.text} opacity-60`}>{label}</span>
          </div>
        ))}
      </div>
      <p className={`mt-3 text-[12px] ${c.text} opacity-70`}>
        Deliver by{" "}
        {deadline.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        })}
      </p>
    </div>
  );
}
