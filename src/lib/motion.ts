"use client";

import { useEffect } from "react";

/**
 * One passive scroll listener drives every `[data-speed]` element:
 * it is shifted relative to its section's centre → layered parallax.
 * Only transforms are written, so it stays on the compositor (60fps on phones).
 */
export function useParallax() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-speed]"));
    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      for (const el of els) {
        const host = (el.closest("[data-parallax]") as HTMLElement) ?? el.parentElement!;
        const r = host.getBoundingClientRect();
        if (r.bottom < -vh || r.top > vh * 2) continue;
        const offset = r.top + r.height / 2 - vh / 2;
        const speed = Number(el.dataset.speed);
        el.style.transform = `translate3d(0, ${(-offset * speed).toFixed(1)}px, 0)`;
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);
}

/** Fade/slide `[data-reveal]` elements in as they enter the viewport. */
export function useReveal(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.1 },
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [enabled]);
}
