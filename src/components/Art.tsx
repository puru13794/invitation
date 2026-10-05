/* Hand-built SVG illustrations — no images to download, crisp at any size. */
import type { CSSProperties } from "react";

const r1 = (n: number) => Math.round(n * 10) / 10;

/* ═════════════════ Door decorations ═════════════════ */

function Marigold({ x, y, r, tone = 0 }: { x: number; y: number; r: number; tone?: number }) {
  const outer = tone ? "#f6b21b" : "#ef7d12";
  const inner = tone ? "#ffd35a" : "#f9a03a";
  const ruff = Array.from({ length: 10 }, (_, i) => {
    const a = (i / 10) * Math.PI * 2;
    return <circle key={i} cx={r1(x + Math.cos(a) * r * 0.62)} cy={r1(y + Math.sin(a) * r * 0.62)} r={r1(r * 0.46)} fill={outer} />;
  });
  return (
    <g>
      {ruff}
      <circle cx={r1(x)} cy={r1(y)} r={r1(r * 0.7)} fill={inner} />
      <circle cx={r1(x)} cy={r1(y)} r={r1(r * 0.32)} fill={outer} opacity={0.8} />
    </g>
  );
}

function MangoLeaf({ x, y, len = 40, rot = 0 }: { x: number; y: number; len?: number; rot?: number }) {
  const w = len * 0.24;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d={`M0 0 C ${w} ${len * 0.25} ${w} ${len * 0.7} 0 ${len} C ${-w} ${len * 0.7} ${-w} ${len * 0.25} 0 0Z`} fill="#2f7a3b" />
      <path d={`M0 2 L0 ${len - 3}`} stroke="#9fd18b" strokeWidth={0.9} opacity={0.7} />
    </g>
  );
}

/** Thoranam: mango leaves + marigolds */
export function Toran({ className }: { className?: string }) {
  const W = 400;
  const n = 13;
  // rounded so server- and browser-rendered SVG match exactly (Math.sin can differ in the last digit)
  const sag = (x: number) => r1(10 + Math.sin((x / W) * Math.PI) * 10);
  return (
    <svg className={className} viewBox={`0 0 ${W} 62`} preserveAspectRatio="xMidYMin slice" aria-hidden>
      <path d={`M0 10 Q ${W / 2} 30 ${W} 10`} stroke="#8a5a1c" strokeWidth={1.6} fill="none" />
      {Array.from({ length: n }, (_, i) => {
        const x = r1(((i + 0.5) / n) * W);
        return (
          <g key={i}>
            <MangoLeaf x={x} y={sag(x) + 2} len={i % 2 ? 34 : 44} rot={i % 2 ? 6 : -6} />
            <Marigold x={x + W / n / 2} y={sag(x + W / n / 2) + 2} r={6.5} tone={i % 2} />
          </g>
        );
      })}
    </svg>
  );
}

export function MarigoldStrand({ count = 12, className }: { count?: number; className?: string }) {
  const h = count * 15 + 30;
  return (
    <svg className={className} viewBox={`0 0 24 ${h}`} aria-hidden>
      <line x1={12} y1={0} x2={12} y2={h - 18} stroke="#8a5a1c" strokeWidth={1} />
      {Array.from({ length: count }, (_, i) => (
        <Marigold key={i} x={12} y={8 + i * 15} r={7} tone={i % 3 === 1 ? 1 : 0} />
      ))}
      <path d={`M7 ${h - 4} Q7 ${h - 17} 12 ${h - 17} Q17 ${h - 17} 17 ${h - 4} Z`} fill="#d9a63c" />
      <circle cx={12} cy={h - 2.5} r={2} fill="#a87620" />
    </svg>
  );
}

/* ═════════════════ Watercolour lotuses ═════════════════ */

const PETAL = "M0 0 C-22 -28 -20 -78 0 -110 C20 -78 22 -28 0 0Z";
const WIDE = "M0 0 C-34 -20 -34 -70 0 -96 C34 -70 34 -20 0 0Z";

/** Gradients shared by every lotus in one <svg>. */
function LotusDefs() {
  return (
    <defs>
      <linearGradient id="lp-back" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stopColor="#fde9f0" />
        <stop offset="1" stopColor="#f094b4" />
      </linearGradient>
      <linearGradient id="lp-mid" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stopColor="#fff3f6" />
        <stop offset="0.55" stopColor="#f6a9c2" />
        <stop offset="1" stopColor="#e2588a" />
      </linearGradient>
      <linearGradient id="lp-front" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stopColor="#fbd5e1" />
        <stop offset="1" stopColor="#d94377" />
      </linearGradient>
      <linearGradient id="lp-stem" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#5d8f45" />
        <stop offset="1" stopColor="#3f6e33" />
      </linearGradient>
      <radialGradient id="lp-pad" cx="0.45" cy="0.4" r="0.7">
        <stop offset="0" stopColor="#8cbf6a" />
        <stop offset="1" stopColor="#3d7135" />
      </radialGradient>
    </defs>
  );
}

function Bloom({ x, y, s = 1, rot = 0 }: { x: number; y: number; s?: number; rot?: number }) {
  const petal = (d: string, a: number, k: number, g: string, key: string, vein = false) => (
    <g key={key} transform={`rotate(${a}) scale(${k})`}>
      <path d={d} fill={`url(#${g})`} stroke="#c94a78" strokeOpacity="0.3" strokeWidth="1" />
      {vein && <path d="M0 -8 C-2 -40 -2 -70 0 -96" stroke="#fff" strokeOpacity="0.45" strokeWidth="1.2" fill="none" />}
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      {[-80, 80, -58, 58, -34, 34].map((a, i) => petal(PETAL, a, 0.6 + (i >> 1) * 0.12, "lp-back", `b${a}`))}
      {[-16, 16, 0].map((a) => petal(PETAL, a, a ? 0.94 : 1, "lp-mid", `m${a}`, true))}
      <ellipse cx="0" cy="-20" rx="20" ry="7" fill="#f2c14e" />
      {[-12, -6, 0, 6, 12].map((dx) => <circle key={dx} cx={dx} cy={-23} r="1.6" fill="#d99a1e" />)}
      {[-30, 30].map((a) => petal(WIDE, a, 0.72, "lp-front", `f${a}`, true))}
    </g>
  );
}

function Bud({ x, y, s = 1, rot = 0 }: { x: number; y: number; s?: number; rot?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path d={PETAL} transform="rotate(-10) scale(0.62)" fill="url(#lp-back)" stroke="#c94a78" strokeOpacity="0.3" />
      <path d={PETAL} transform="rotate(10) scale(0.62)" fill="url(#lp-mid)" stroke="#c94a78" strokeOpacity="0.3" />
      <path d={PETAL} transform="scale(0.5 0.66)" fill="url(#lp-front)" stroke="#c94a78" strokeOpacity="0.3" />
      <path d="M-14 0 Q-16 -14 -6 -26 Q-4 -10 0 0Z M14 0 Q16 -14 6 -26 Q4 -10 0 0Z" fill="#5d8f45" />
    </g>
  );
}

function Pad({ x, y, s = 1, rot = 0 }: { x: number; y: number; s?: number; rot?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path d="M0 0 L-60 -6 C-64 -26 -30 -38 6 -36 C44 -34 70 -20 62 -4 C50 10 10 14 0 0Z" fill="url(#lp-pad)" />
      <path d="M0 0 L-44 -24 M0 0 L-10 -34 M0 0 L26 -32 M0 0 L52 -16 M0 0 L40 6" stroke="#a8d48a" strokeOpacity="0.55" strokeWidth="1" fill="none" />
    </g>
  );
}

/** Tall lotus spray climbing the right edge. */
export function LotusSpray({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 170 560" aria-hidden>
      <LotusDefs />
      <g fill="none" stroke="url(#lp-stem)" strokeWidth="4" strokeLinecap="round">
        <path d="M150 560 C150 470 118 420 122 330 C126 240 104 180 100 118" />
        <path d="M124 400 C108 380 92 350 86 302" />
        <path d="M134 270 C150 250 152 228 146 210" strokeWidth="3" />
      </g>
      <Pad x={128} y={520} s={0.9} rot={-12} />
      <Bud x={146} y={210} s={0.55} rot={14} />
      <Bloom x={86} y={302} s={0.48} rot={-18} />
      <Bloom x={100} y={118} s={0.72} rot={-14} />
    </svg>
  );
}

/** Small lotus on a slender stem for the upper-left corner. */
export function LotusCorner({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 280" aria-hidden>
      <LotusDefs />
      <path d="M20 280 C10 220 30 170 44 96" stroke="url(#lp-stem)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      {[[22, 230, -40], [30, 175, 35], [16, 140, -50]].map(([x, y, a]) => (
        <path key={y} d="M0 0 C10 -6 22 -6 30 0 C22 6 10 6 0 0Z" transform={`translate(${x} ${y}) rotate(${a})`} fill="#4f8a3d" />
      ))}
      <Bloom x={48} y={96} s={0.46} rot={18} />
    </svg>
  );
}

/** Lotus pond cluster for the bottom-right corner. */
export function LotusPond({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 230 190" aria-hidden>
      <LotusDefs />
      <Pad x={60} y={186} s={1.1} rot={-6} />
      <Pad x={186} y={190} s={0.8} rot={8} />
      <Bloom x={56} y={150} s={0.58} rot={-18} />
      <Bloom x={150} y={184} s={0.95} rot={4} />
    </svg>
  );
}

/** Single lotus peeking in from the left edge. */
export function LotusPeek({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 110 130" aria-hidden>
      <LotusDefs />
      <path d="M0 110 C20 104 34 96 44 84" stroke="url(#lp-stem)" strokeWidth="3.5" fill="none" />
      <Bloom x={52} y={90} s={0.5} rot={62} />
    </svg>
  );
}

/* ═════════════════ Gold line-art ═════════════════ */

/** Delicate gold floral vine, drawn as outlines like hand-painted gilding. */
export function GoldVine({ className }: { className?: string }) {
  const flower = (x: number, y: number, r: number, key: string) => (
    <g key={key} transform={`translate(${x} ${y})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="0" cy={-r} rx={r * 0.55} ry={r} transform={`rotate(${a})`} />
      ))}
      <circle r={r * 0.35} fill="#c8a058" />
    </g>
  );
  const leaf = (x: number, y: number, a: number, key: string) => (
    <path key={key} d="M0 0 C6 -5 14 -5 20 0 C14 5 6 5 0 0Z M2 0 L18 0" transform={`translate(${x} ${y}) rotate(${a})`} />
  );
  return (
    <svg className={className} viewBox="0 0 150 320" aria-hidden>
      <g fill="none" stroke="#c8a058" strokeWidth="1.2" strokeLinecap="round">
        <path d="M10 320 C40 260 30 210 60 170 C90 130 70 80 110 40" />
        <path d="M44 236 C70 230 86 214 96 196" />
        <path d="M58 172 C34 156 26 136 30 112" />
        <path d="M84 104 C110 104 126 92 136 74" />
        {[leaf(30, 270, -60, "l1"), leaf(48, 210, -110, "l2"), leaf(70, 150, -70, "l3"), leaf(92, 76, -40, "l4"), leaf(60, 234, 10, "l5"), leaf(40, 132, -140, "l6")]}
        {[flower(98, 194, 7, "f1"), flower(30, 108, 8, "f2"), flower(136, 72, 7, "f3"), flower(112, 38, 9, "f4")]}
      </g>
    </svg>
  );
}

/** Gold lotus emblem for the top of each page. */
export function Emblem({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 80 70" aria-hidden>
      <g fill="none" stroke="#b98b3f" strokeWidth="1.6" strokeLinejoin="round">
        <path d="M40 54 C30 44 30 26 40 12 C50 26 50 44 40 54Z" />
        <path d="M40 54 C26 52 16 40 16 26 C28 30 36 40 40 54Z" />
        <path d="M40 54 C54 52 64 40 64 26 C52 30 44 40 40 54Z" />
        <path d="M40 54 C24 58 10 52 4 42 C18 40 30 46 40 54Z" />
        <path d="M40 54 C56 58 70 52 76 42 C62 40 50 46 40 54Z" />
        <path d="M22 62 H58" />
      </g>
      <circle cx="40" cy="5" r="2.6" fill="#b98b3f" />
      <circle cx="40" cy="62" r="2" fill="#b98b3f" />
    </svg>
  );
}

/** Thin gold rule with a scrolled centre, optionally a heart. */
export function Flourish({ className, heart, style }: { className?: string; heart?: boolean; style?: CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 240 24" aria-hidden>
      <g fill="none" stroke="#b98b3f" strokeWidth="1.2" strokeLinecap="round">
        <path d={heart ? "M10 12 H86" : "M10 12 H96"} />
        <path d={heart ? "M154 12 H230" : "M144 12 H230"} />
        {heart ? (
          <>
            <path d="M86 12 C92 4 100 4 102 10 C98 14 92 14 90 10" />
            <path d="M154 12 C148 4 140 4 138 10 C142 14 148 14 150 10" />
            <path d="M104 12 C98 18 92 20 86 18" />
            <path d="M136 12 C142 18 148 20 154 18" />
          </>
        ) : (
          <>
            <path d="M96 12 Q108 2 120 12 Q132 22 144 12" />
            <path d="M96 12 Q108 22 120 12 Q132 2 144 12" />
          </>
        )}
      </g>
      {heart ? (
        <path d="M120 19 C110 12 108 6 113 4 C116 3 119 5 120 8 C121 5 124 3 127 4 C132 6 130 12 120 19Z" fill="#d6527f" />
      ) : (
        <circle cx="120" cy="12" r="3" fill="#b98b3f" />
      )}
      <circle cx="8" cy="12" r="1.8" fill="#b98b3f" />
      <circle cx="232" cy="12" r="1.8" fill="#b98b3f" />
    </svg>
  );
}
