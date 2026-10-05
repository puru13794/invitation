/* Hand-built SVG illustrations — no images to download, crisp at any size. */
import type { ReactNode } from "react";

const r1 = (n: number) => Math.round(n * 10) / 10;

/* ───────────── Marigold flower ───────────── */
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
      <circle cx={x} cy={y} r={r * 0.7} fill={inner} />
      <circle cx={x} cy={y} r={r * 0.32} fill={outer} opacity={0.8} />
    </g>
  );
}

/* ───────────── Mango leaf (points down) ───────────── */
function MangoLeaf({ x, y, len = 40, rot = 0 }: { x: number; y: number; len?: number; rot?: number }) {
  const w = len * 0.24;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d={`M0 0 C ${w} ${len * 0.25} ${w} ${len * 0.7} 0 ${len} C ${-w} ${len * 0.7} ${-w} ${len * 0.25} 0 0Z`} fill="#2f7a3b" />
      <path d={`M0 2 L0 ${len - 3}`} stroke="#9fd18b" strokeWidth={0.9} opacity={0.7} />
    </g>
  );
}

/* ───────────── Thoranam: mango leaves + marigolds ───────────── */
export function Toran({ className }: { className?: string }) {
  const W = 400;
  const n = 13;
  const sag = (x: number) => 10 + Math.sin((x / W) * Math.PI) * 10;
  const items = Array.from({ length: n }, (_, i) => {
    const x = r1(((i + 0.5) / n) * W);
    const y = sag(x);
    return (
      <g key={i}>
        <MangoLeaf x={x} y={y + 2} len={i % 2 ? 34 : 44} rot={i % 2 ? 6 : -6} />
        <Marigold x={x + W / n / 2} y={sag(x + W / n / 2) + 2} r={6.5} tone={i % 2} />
      </g>
    );
  });
  return (
    <svg className={className} viewBox={`0 0 ${W} 62`} preserveAspectRatio="xMidYMin slice" aria-hidden>
      <path d={`M0 10 Q ${W / 2} 30 ${W} 10`} stroke="#8a5a1c" strokeWidth={1.6} fill="none" />
      {items}
    </svg>
  );
}

/* ───────────── Hanging marigold strand ───────────── */
export function MarigoldStrand({ count = 12, className }: { count?: number; className?: string }) {
  const h = count * 15 + 30;
  return (
    <svg className={className} viewBox={`0 0 24 ${h}`} aria-hidden>
      <line x1={12} y1={0} x2={12} y2={h - 18} stroke="#8a5a1c" strokeWidth={1} />
      {Array.from({ length: count }, (_, i) => (
        <Marigold key={i} x={12} y={8 + i * 15} r={7} tone={i % 3 === 1 ? 1 : 0} />
      ))}
      {/* little brass bell */}
      <path d={`M7 ${h - 4} Q7 ${h - 17} 12 ${h - 17} Q17 ${h - 17} 17 ${h - 4} Z`} fill="#d9a63c" />
      <circle cx={12} cy={h - 2.5} r={2} fill="#a87620" />
    </svg>
  );
}

/* ───────────── Diya (oil lamp) with flickering flame ───────────── */
export function Diya({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 80" aria-hidden>
      <defs>
        <radialGradient id="diyaGlow">
          <stop offset="0" stopColor="#ffd86b" stopOpacity="0.85" />
          <stop offset="1" stopColor="#ffb02e" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="diyaFlame" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#ff7a00" />
          <stop offset="0.55" stopColor="#ffc531" />
          <stop offset="1" stopColor="#fff6c4" />
        </linearGradient>
        <linearGradient id="diyaClay" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c6602b" />
          <stop offset="1" stopColor="#7b2d12" />
        </linearGradient>
      </defs>
      <circle className="diya-glow" cx="40" cy="34" r="26" fill="url(#diyaGlow)" />
      <path className="diya-flame" d="M40 14 C46 24 47 31 40 40 C33 31 34 24 40 14Z" fill="url(#diyaFlame)" />
      <path d="M8 46 Q40 44 72 46 Q66 66 40 68 Q14 66 8 46Z" fill="url(#diyaClay)" />
      <path d="M8 46 Q40 52 72 46" stroke="#f0b35a" strokeWidth="1.5" fill="none" />
      <circle cx="26" cy="56" r="1.6" fill="#f0b35a" />
      <circle cx="40" cy="59" r="1.6" fill="#f0b35a" />
      <circle cx="54" cy="56" r="1.6" fill="#f0b35a" />
    </svg>
  );
}

/* ───────────── Temple gopuram silhouette ───────────── */
export function Gopuram({ className }: { className?: string }) {
  const tiers = [];
  let yb = 330;
  let wb = 210;
  for (let i = 0; i < 6; i++) {
    const h = 40 - i * 2;
    const wt = wb - 16;
    const cx = 150;
    tiers.push(
      <g key={i}>
        <path d={`M${cx - wb / 2} ${yb} L${cx - wt / 2} ${yb - h} L${cx + wt / 2} ${yb - h} L${cx + wb / 2} ${yb} Z`} />
        <rect x={cx - wt / 2 - 5} y={yb - h - 4} width={wt + 10} height={5} rx={1.5} />
        {Array.from({ length: Math.max(2, 6 - i) }, (_, k) => {
          const count = Math.max(2, 6 - i);
          const span = wt - 30;
          const nx = cx - span / 2 + (span / (count - 1)) * k;
          return <path key={k} className="niche" d={`M${nx - 4} ${yb - 6} L${nx - 4} ${yb - h + 14} Q${nx} ${yb - h + 7} ${nx + 4} ${yb - h + 14} L${nx + 4} ${yb - 6}Z`} />;
        })}
      </g>,
    );
    yb -= h + 4;
    wb = wt - 4;
  }
  const topY = yb;
  return (
    <svg className={className} viewBox="0 0 300 420" aria-hidden>
      <g fill="currentColor">
        {/* base with doorway */}
        <path d="M30 420 L30 334 L270 334 L270 420 Z M128 420 L128 372 Q150 346 172 372 L172 420 Z" fillRule="evenodd" />
        <rect x={24} y={328} width={252} height={7} rx={2} />
        {tiers}
        {/* shala (barrel-vault crown) */}
        <path d={`M100 ${topY} L100 ${topY - 18} Q100 ${topY - 34} 116 ${topY - 34} L184 ${topY - 34} Q200 ${topY - 34} 200 ${topY - 18} L200 ${topY} Z`} />
        {[118, 150, 182].map((x) => (
          <g key={x}>
            <rect x={x - 1} y={topY - 46} width={2} height={12} />
            <path d={`M${x} ${topY - 62} C${x + 6} ${topY - 54} ${x + 6} ${topY - 47} ${x} ${topY - 45} C${x - 6} ${topY - 47} ${x - 6} ${topY - 54} ${x} ${topY - 62}Z`} />
          </g>
        ))}
      </g>
    </svg>
  );
}

/* ───────────── Mandala (slowly rotating backdrop) ───────────── */
export function Mandala({ className }: { className?: string }) {
  const ring = (count: number, radius: number, el: (i: number) => ReactNode) =>
    Array.from({ length: count }, (_, i) => (
      <g key={`${radius}-${i}`} transform={`rotate(${(360 / count) * i} 200 200) translate(200 ${200 - radius})`}>
        {el(i)}
      </g>
    ));
  return (
    <svg className={className} viewBox="0 0 400 400" aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1.1">
        <circle cx="200" cy="200" r="22" />
        <circle cx="200" cy="200" r="186" />
        <circle cx="200" cy="200" r="194" strokeDasharray="2 6" />
        {ring(12, 38, () => <path d="M0 -14 C8 -6 8 6 0 14 C-8 6 -8 -6 0 -14Z" />)}
        {ring(24, 72, () => <path d="M0 -20 C10 -8 10 8 0 20 C-10 8 -10 -8 0 -20Z" />)}
        {ring(24, 72, () => <circle cy="-30" r="3" />)}
        {ring(36, 120, () => <path d="M0 -24 C12 -10 10 10 0 22 C-10 10 -12 -10 0 -24Z M0 -12 L0 12" />)}
        {ring(48, 160, () => <path d="M-6 10 Q0 -22 6 10" />)}
        {ring(72, 176, () => <circle r="2" />)}
      </g>
    </svg>
  );
}

/* ───────────── Lotus ───────────── */
export function Lotus({ className }: { className?: string }) {
  const petal = "M0 0 C14 -18 14 -44 0 -62 C-14 -44 -14 -18 0 0Z";
  return (
    <svg className={className} viewBox="-80 -70 160 80" aria-hidden>
      <g>
        {[-64, -32, 32, 64].map((a) => (
          <path key={a} d={petal} transform={`rotate(${a})`} fill="#f2a7b5" stroke="#c4566e" strokeWidth="1" />
        ))}
        {[-34, 34].map((a) => (
          <path key={a} d={petal} transform={`rotate(${a * 0.5}) scale(0.92)`} fill="#f7c0cb" stroke="#c4566e" strokeWidth="1" />
        ))}
        <path d={petal} fill="#fbd4db" stroke="#c4566e" strokeWidth="1" />
        <path d="M-60 2 Q0 14 60 2" stroke="#2f7a3b" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/* ───────────── Purna Kalash with coconut & mango leaves ───────────── */
export function Kalash({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 150" aria-hidden>
      <defs>
        <linearGradient id="brass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#a8741c" />
          <stop offset="0.45" stopColor="#f3cd6b" />
          <stop offset="1" stopColor="#9a6513" />
        </linearGradient>
      </defs>
      {/* mango leaves fanned */}
      {[-58, -32, -10, 10, 32, 58].map((a) => (
        <g key={a} transform={`translate(60 58) rotate(${a + 180})`}>
          <MangoLeaf x={0} y={0} len={42} />
        </g>
      ))}
      {/* coconut */}
      <ellipse cx="60" cy="40" rx="17" ry="20" fill="#8a5a2b" />
      <path d="M60 18 L60 26" stroke="#5c3a17" strokeWidth="3" strokeLinecap="round" />
      <path d="M48 32 Q60 28 72 32" stroke="#6f4620" strokeWidth="1.2" fill="none" />
      {/* pot */}
      <path d="M44 58 L76 58 L72 66 Q100 78 98 106 Q94 138 60 140 Q26 138 22 106 Q20 78 48 66 Z" fill="url(#brass)" />
      <rect x="40" y="55" width="40" height="6" rx="3" fill="#c9952f" />
      <path d="M27 96 Q60 108 93 96" stroke="#b02a2a" strokeWidth="3" fill="none" />
      <path d="M28 104 Q60 116 92 104" stroke="#f6b21b" strokeWidth="2" fill="none" strokeDasharray="1 4" strokeLinecap="round" />
      <circle cx="60" cy="88" r="5" fill="#c4141e" />
      <circle cx="45" cy="85" r="2.6" fill="#f6b21b" />
      <circle cx="75" cy="85" r="2.6" fill="#f6b21b" />
    </svg>
  );
}

/* ───────────── Engagement rings ───────────── */
export function Rings({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 220 140" aria-hidden>
      <defs>
        <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fbe39a" />
          <stop offset="0.5" stopColor="#d49a2a" />
          <stop offset="1" stopColor="#8f5b10" />
        </linearGradient>
        <linearGradient id="gem" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.6" stopColor="#cfe9ff" />
          <stop offset="1" stopColor="#8fb8e6" />
        </linearGradient>
      </defs>
      <g className="ring-left">
        <circle cx="86" cy="84" r="40" fill="none" stroke="url(#gold)" strokeWidth="9" />
        <path d="M74 40 L86 26 L98 40 L86 50Z" fill="url(#gem)" stroke="#b9cde6" strokeWidth="1" />
        <path d="M74 40 L98 40" stroke="#ffffff" strokeWidth="1" />
      </g>
      <g className="ring-right">
        <circle cx="134" cy="84" r="40" fill="none" stroke="url(#gold)" strokeWidth="9" />
      </g>
      <g className="sparkles" fill="#f6d36b">
        <path d="M40 30 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 l8 -3z" />
        <path d="M184 36 l2 6 l6 2 l-6 2 l-2 6 l-2 -6 l-6 -2 l6 -2z" />
        <path d="M176 118 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2z" />
      </g>
    </svg>
  );
}

/* ───────────── Banana leaf (entrance decoration) ───────────── */
export function BananaLeaf({ className, flip }: { className?: string; flip?: boolean }) {
  const ribs = Array.from({ length: 16 }, (_, i) => {
    const y = 40 + i * 22;
    return <path key={i} d={`M60 ${y} Q${34} ${y + 6} ${14 + i * 0.6} ${y + 20}`} />;
  });
  return (
    <svg className={className} viewBox="0 0 120 420" aria-hidden style={flip ? { transform: "scaleX(-1)" } : undefined}>
      <path d="M60 4 C112 70 118 250 76 412 L60 420 L44 412 C2 250 8 70 60 4Z" fill="#3c8a3f" />
      <path d="M60 4 C10 70 4 250 44 412 L60 420 Z" fill="#2f7334" />
      <g stroke="#6fb565" strokeWidth="1" fill="none" opacity="0.6">
        {ribs}
        <g transform="translate(120 0) scale(-1 1)">{ribs}</g>
      </g>
      <path d="M60 6 L60 420" stroke="#a9d78f" strokeWidth="3" />
    </svg>
  );
}

/* ───────────── Ornamental divider ───────────── */
export function Divider({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 240 24" aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M4 12 H92" />
        <path d="M148 12 H236" />
        <path d="M92 12 Q106 0 120 12 Q134 24 148 12" />
        <path d="M92 12 Q106 24 120 12 Q134 0 148 12" />
      </g>
      <circle cx="120" cy="12" r="3.5" fill="currentColor" />
      <circle cx="4" cy="12" r="2" fill="currentColor" />
      <circle cx="236" cy="12" r="2" fill="currentColor" />
    </svg>
  );
}
