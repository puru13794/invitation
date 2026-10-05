"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** A round gold "coin" guests scratch with a finger to uncover the date. */
export function ScratchReveal({ children, onReveal }: { children: ReactNode; onReveal?: () => void }) {
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);
  const onRevealRef = useRef(onReveal);
  onRevealRef.current = onReveal;

  useEffect(() => {
    const c = canvas.current!;
    const b = box.current!;
    const ctx = c.getContext("2d", { willReadFrequently: true })!;
    let drawing = false;
    let strokes = 0;
    let done = false;
    let last: { x: number; y: number } | null = null;

    const paint = () => {
      const { width: w, height: h } = b.getBoundingClientRect();
      const d = Math.min(window.devicePixelRatio || 1, 2);
      c.width = w * d;
      c.height = h * d;
      ctx.setTransform(d, 0, 0, d, 0, 0);
      ctx.globalCompositeOperation = "source-over";
      const g = ctx.createRadialGradient(w * 0.35, h * 0.3, 4, w / 2, h / 2, w * 0.7);
      g.addColorStop(0, "#fbe7a1");
      g.addColorStop(0.45, "#d9a33a");
      g.addColorStop(1, "#9c6512");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(255,240,190,.35)";
      for (let r = 14; r < w / 2; r += 9) {
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, r, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.fillStyle = "#5a2a05";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "600 13px system-ui, sans-serif";
      ctx.fillText("✦ SCRATCH HERE ✦", w / 2, h / 2 - 8);
      ctx.font = "italic 12px Georgia, serif";
      ctx.fillText("to reveal the date", w / 2, h / 2 + 12);
    };

    const reveal = () => {
      if (done) return;
      done = true;
      setRevealed(true);
      onRevealRef.current?.();
    };

    const progress = () => {
      const data = ctx.getImageData(0, 0, c.width, c.height).data;
      let clear = 0;
      let total = 0;
      for (let i = 3; i < data.length; i += 64) {
        total++;
        if (data[i] < 40) clear++;
      }
      if (clear / total > 0.42) reveal();
    };

    const pos = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const scratch = (e: PointerEvent) => {
      if (!drawing || done) return;
      const p = pos(e);
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineCap = "round";
      ctx.lineWidth = 38;
      ctx.beginPath();
      ctx.moveTo(last?.x ?? p.x, last?.y ?? p.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      last = p;
      if (++strokes % 8 === 0) progress();
    };
    const down = (e: PointerEvent) => {
      drawing = true;
      last = null;
      c.setPointerCapture(e.pointerId);
      scratch(e);
    };
    const up = () => {
      drawing = false;
      if (!done) progress();
    };

    paint();
    c.addEventListener("pointerdown", down);
    c.addEventListener("pointermove", scratch);
    c.addEventListener("pointerup", up);
    c.addEventListener("pointercancel", up);
    return () => {
      c.removeEventListener("pointerdown", down);
      c.removeEventListener("pointermove", scratch);
      c.removeEventListener("pointerup", up);
      c.removeEventListener("pointercancel", up);
    };
  }, []);

  return (
    <div className={`scratch ${revealed ? "scratch--done" : ""}`} ref={box}>
      <div className="scratch__content">{children}</div>
      <canvas ref={canvas} className="scratch__foil" aria-label="Scratch to reveal the date" />
    </div>
  );
}
