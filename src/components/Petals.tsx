/* Falling marigold & rose petals — pure CSS, deterministic so SSR matches. */
const COLORS = ["#f39c12", "#f6b21b", "#e8556d", "#ef7d12", "#f7c0cb", "#c4141e"];

function rand(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

export function Petals({ count = 16 }: { count?: number }) {
  return (
    <div className="petals" aria-hidden>
      {Array.from({ length: count }, (_, i) => {
        const size = 8 + rand(i + 1) * 9;
        return (
          <span
            key={i}
            style={{
              left: `${(rand(i + 7) * 100).toFixed(1)}%`,
              width: size.toFixed(1) + "px",
              height: (size * 0.75).toFixed(1) + "px",
              background: COLORS[i % COLORS.length],
              animationDuration: `${(9 + rand(i + 3) * 9).toFixed(1)}s`,
              animationDelay: `${(-rand(i + 5) * 15).toFixed(1)}s`,
              ["--drift" as string]: `${((rand(i + 11) - 0.5) * 160).toFixed(0)}px`,
              ["--spin" as string]: `${((rand(i + 13) - 0.5) * 900).toFixed(0)}deg`,
            }}
          />
        );
      })}
    </div>
  );
}

/** One-shot shower of petals (re-mount with a new `key` to replay). */
export function Burst({ count = 34 }: { count?: number }) {
  return (
    <div className="burst" aria-hidden>
      {Array.from({ length: count }, (_, i) => {
        const size = 9 + rand(i + 21) * 10;
        return (
          <span
            key={i}
            style={{
              left: `${(rand(i + 31) * 100).toFixed(1)}%`,
              width: size.toFixed(1) + "px",
              height: (size * 0.75).toFixed(1) + "px",
              background: COLORS[(i * 7) % COLORS.length],
              animationDuration: `${(2.8 + rand(i + 41) * 2.6).toFixed(2)}s`,
              animationDelay: `${(rand(i + 51) * 0.7).toFixed(2)}s`,
              ["--drift" as string]: `${((rand(i + 61) - 0.5) * 220).toFixed(0)}px`,
              ["--spin" as string]: `${((rand(i + 71) - 0.5) * 1080).toFixed(0)}deg`,
            }}
          />
        );
      })}
    </div>
  );
}
