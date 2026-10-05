"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CarnaticSynth } from "./carnaticSynth";

type Mode = "file" | "synth" | null;

/**
 * Plays the MP3 at `src`; if it is missing or can't play, falls back to the
 * built-in synthesized melody. `start()` must be called from a tap/click so
 * mobile browsers allow audio.
 */
export function useMusic(src: string) {
  const [playing, setPlaying] = useState(false);
  const mode = useRef<Mode>(null);
  const audio = useRef<HTMLAudioElement | null>(null);
  const ctx = useRef<AudioContext | null>(null);
  const synth = useRef<CarnaticSynth | null>(null);
  const wantPlay = useRef(false);

  const startSynth = useCallback(() => {
    const c = ctx.current;
    if (!c) return;
    mode.current = "synth";
    synth.current = new CarnaticSynth(c);
    synth.current.start();
    setPlaying(true);
  }, []);

  const start = useCallback(() => {
    if (mode.current) return;
    wantPlay.current = true;
    // Unlock an AudioContext inside the user gesture so the fallback can play later.
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AC) {
      ctx.current = new AC();
      void ctx.current.resume();
    }
    const a = new Audio(src);
    a.loop = true;
    a.volume = 0.75;
    a.preload = "auto";
    audio.current = a;
    a.play()
      .then(() => {
        mode.current = "file";
        setPlaying(true);
        void ctx.current?.close();
        ctx.current = null;
      })
      .catch(() => {
        audio.current = null;
        startSynth();
      });
  }, [src, startSynth]);

  const pause = useCallback(() => {
    if (mode.current === "file") audio.current?.pause();
    if (mode.current === "synth") void synth.current?.pause();
    setPlaying(false);
  }, []);

  const resume = useCallback(() => {
    if (mode.current === "file") void audio.current?.play();
    if (mode.current === "synth") void synth.current?.resume();
    setPlaying(true);
  }, []);

  const toggle = useCallback(() => {
    if (!mode.current) return start();
    wantPlay.current = !playing;
    if (playing) pause();
    else resume();
  }, [playing, start, pause, resume]);

  // Quiet down when the guest switches apps / locks the phone.
  useEffect(() => {
    const onVis = () => {
      if (!mode.current) return;
      if (document.hidden) pause();
      else if (wantPlay.current) resume();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [pause, resume]);

  return { playing, start, toggle };
}
