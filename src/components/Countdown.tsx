"use client";

import { useEffect, useState } from "react";

const pad = (n: number) => String(n).padStart(2, "0");

export function Countdown({ target }: { target: string }) {
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const t = new Date(target).getTime();
    const tick = () => setLeft(Math.max(0, t - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  const s = left === null ? null : Math.floor(left / 1000);
  const units = [
    ["Days", s === null ? "--" : pad(Math.floor(s / 86400))],
    ["Hours", s === null ? "--" : pad(Math.floor((s % 86400) / 3600))],
    ["Minutes", s === null ? "--" : pad(Math.floor((s % 3600) / 60))],
    ["Seconds", s === null ? "--" : pad(s % 60)],
  ];

  if (left === 0) return <p className="countdown__done">The auspicious day is here! 🎉</p>;

  return (
    <div className="countdown" role="timer" aria-live="off">
      {units.map(([label, v]) => (
        <div className="countdown__unit" key={label}>
          <span className="countdown__num">{v}</span>
          <span className="countdown__lab">{label}</span>
        </div>
      ))}
    </div>
  );
}
