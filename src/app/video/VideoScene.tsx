"use client";

import { useEffect, type CSSProperties } from "react";
import { invitation as inv } from "@/config";
import { Emblem, Flourish, GoldVine, LotusCorner, LotusPeek, LotusPond, LotusSpray, MarigoldStrand, Toran } from "@/components/Art";
import { Petals } from "@/components/Petals";

/** Total length in seconds — keep in sync with scripts/render-video.mjs. */
export const DURATION = 21;

/** start time (s) for an element's entrance animation */
const at = (s: number): CSSProperties => ({ ["--t" as string]: `${s}s` });

const PETAL_COLORS = ["#f6a9c2", "#e2588a", "#fbd5e1", "#f094b4", "#d9b56a", "#ef7fa5"];
const rand = (n: number) => {
  const x = Math.sin(n * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

export function VideoScene() {
  // In render mode every animation is paused and driven by window.__seek(t),
  // so each captured frame is exact regardless of how slow the capture is.
  useEffect(() => {
    const render = new URLSearchParams(location.search).has("render");
    const w = window as unknown as { __seek: (t: number) => void; __ready: boolean };
    w.__seek = (t) => {
      for (const a of document.getAnimations()) {
        a.pause();
        a.currentTime = t * 1000;
      }
    };
    document.fonts.ready.then(() => {
      if (render) w.__seek(0);
      w.__ready = true;
    });
  }, []);

  const [day, month, year] = (() => {
    const d = new Date(inv.dateISO);
    return [
      d.toLocaleDateString("en-IN", { day: "numeric", timeZone: "Asia/Kolkata" }),
      d.toLocaleDateString("en-IN", { month: "long", timeZone: "Asia/Kolkata" }),
      d.toLocaleDateString("en-IN", { year: "numeric", timeZone: "Asia/Kolkata" }),
    ];
  })();
  const weekday = new Date(inv.dateISO).toLocaleDateString("en-IN", { weekday: "long", timeZone: "Asia/Kolkata" });
  const city = inv.venue.address.split(",").slice(-2).join(",").trim();

  return (
    <div className="v">
      {/* ── the marble arch world (slow push-in) ── */}
      <div className="v-world">
        <div className="frame" aria-hidden>
          <div className="frame__lintel" />
          <div className="frame__pillar frame__pillar--l" />
          <div className="frame__pillar frame__pillar--r" />
          <div className="frame__arch"><div className="frame__panel" /></div>
        </div>
        <div className="v-glow" />
        <div className="v-deco">
          <div className="v-item v-vine-l"><GoldVine /></div>
          <div className="v-item v-vine-r"><GoldVine className="vine--flip" /></div>
          <div className="v-item v-corner"><LotusCorner className="sway" /></div>
          <div className="v-item v-spray"><LotusSpray className="sway sway--slow" /></div>
          <div className="v-item v-peek"><LotusPeek className="sway" /></div>
          <div className="v-item v-pond"><LotusPond /></div>
        </div>
      </div>

      <Petals count={16} />

      {/* ── scene 1 · invitation + names ── */}
      <section className="v-scene" style={{ ["--in" as string]: "3s", ["--out" as string]: "9.8s" }}>
        <Emblem className="v-emblem v-up" />
        <Flourish className="v-flourish v-up" />
        <p className="v-caps v-up" style={at(3.4)}>Together with our families</p>
        <p className="v-caps v-up" style={at(3.8)}>we invite you to celebrate</p>
        <p className="v-caps v-up" style={at(4.2)}>the engagement of</p>
        <Flourish className="v-flourish v-up" />
        <h1 className="v-names">
          <span className="v-name v-write" style={at(5.1)}>{inv.groom.name}</span>
          <span className="v-amp v-pop" style={at(6.5)}>&amp;</span>
          <span className="v-name v-write" style={at(6.9)}>{inv.bride.name}</span>
        </h1>
        <Flourish className="v-flourish v-flourish--heart v-up" heart />
      </section>

      {/* ── scene 2 · save the date ── */}
      <section className="v-scene" style={{ ["--in" as string]: "10.3s", ["--out" as string]: "13.9s" }}>
        <p className="v-caps v-up" style={at(10.3)}>Save the date</p>
        <h2 className="v-title v-up" style={at(10.5)}>{weekday}</h2>
        <div className="v-medal v-pop" style={at(10.9)}>
          <span className="v-medal__month">{month}</span>
          <span className="v-medal__day">{day}</span>
          <span className="v-medal__year">{year}</span>
          <i className="v-shine" />
        </div>
        <Flourish className="v-flourish v-flourish--heart v-up" heart style={at(11.8)} />
        <p className="v-time v-up" style={at(12)}>{inv.timeText}</p>
      </section>

      {/* ── scene 3 · venue ── */}
      <section className="v-scene" style={{ ["--in" as string]: "14.4s", ["--out" as string]: "17.7s" }}>
        <svg className="v-pin v-drop" viewBox="0 0 60 80" aria-hidden style={at(14.4)}>
          <path d="M30 78 C30 78 4 46 4 28 A26 26 0 0 1 56 28 C56 46 30 78 30 78Z" fill="#c2416d" />
          <circle cx="30" cy="28" r="10" fill="#fff6f8" />
        </svg>
        <i className="v-pin-shadow v-pop" style={at(14.9)} />
        <p className="v-caps v-up" style={at(15)}>Venue</p>
        <h2 className="v-venue v-up" style={at(15.3)}>{inv.venue.name}</h2>
        <Flourish className="v-flourish v-up" style={at(15.7)} />
        <p className="v-address v-up" style={at(15.9)}>{city}</p>
      </section>

      {/* ── scene 4 · closing ── */}
      <section className="v-scene v-scene--last" style={{ ["--in" as string]: "18s" }}>
        <Emblem className="v-emblem v-up" style={at(18)} />
        <h2 className="v-closing-names v-up" style={at(18.2)}>
          <span>{inv.groom.name.split(" ")[0]}</span>
          <span className="v-closing-amp">&amp;</span>
          <span>{inv.bride.name.split(" ")[0]}</span>
        </h2>
        <Flourish className="v-flourish v-flourish--heart v-up" heart style={at(18.6)} />
        <p className="v-caps v-up" style={at(18.9)}>Your presence will make</p>
        <p className="v-caps v-up" style={at(19.1)}>our day more special</p>
        <p className="v-link v-up" style={at(19.5)}>Tap the link for the full invitation 💌</p>
      </section>

      {/* ── petal shower as the doors open ── */}
      <div className="v-burst" aria-hidden>
        {Array.from({ length: 40 }, (_, i) => {
          const size = 12 + rand(i + 21) * 14;
          return (
            <span
              key={i}
              style={{
                left: `${(rand(i + 31) * 100).toFixed(1)}%`,
                width: `${size.toFixed(1)}px`,
                height: `${(size * 0.75).toFixed(1)}px`,
                background: PETAL_COLORS[(i * 7) % PETAL_COLORS.length],
                animationDuration: `${(3 + rand(i + 41) * 2.5).toFixed(2)}s`,
                animationDelay: `${(1.6 + rand(i + 51) * 0.8).toFixed(2)}s`,
                ["--drift" as string]: `${((rand(i + 61) - 0.5) * 260).toFixed(0)}px`,
                ["--spin" as string]: `${((rand(i + 71) - 0.5) * 1080).toFixed(0)}deg`,
              }}
            />
          );
        })}
      </div>

      {/* ── temple doors intro ── */}
      <div className="v-doors">
        <div className="v-doors__light" />
        <div className="door v-door v-door--l"><span className="door__knocker" /></div>
        <div className="door v-door v-door--r"><span className="door__knocker" /></div>
        <Toran className="v-doors__toran" />
        <MarigoldStrand className="v-doors__strand v-doors__strand--l" count={26} />
        <MarigoldStrand className="v-doors__strand v-doors__strand--r" count={26} />
        <div className="v-doors__center">
          <div className="seal">
            <span>{inv.groom.name[0]}</span>
            <i>&amp;</i>
            <span>{inv.bride.name[0]}</span>
          </div>
          <p className="v-doors__hint">You&apos;re invited</p>
        </div>
      </div>
    </div>
  );
}
