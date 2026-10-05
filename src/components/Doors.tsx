"use client";

import { useEffect, useState } from "react";
import { MarigoldStrand, Toran } from "./Art";
import { invitation } from "@/config";

export function Doors({ onOpen }: { onOpen: () => void }) {
  const [state, setState] = useState<"closed" | "opening" | "gone">("closed");

  useEffect(() => {
    if (state !== "opening") return;
    const t = setTimeout(() => setState("gone"), 1900);
    return () => clearTimeout(t);
  }, [state]);

  if (state === "gone") return null;

  const open = () => {
    if (state !== "closed") return;
    setState("opening");
    onOpen();
  };

  return (
    <div className={`doors ${state === "opening" ? "doors--open" : ""}`} onClick={open} role="button" tabIndex={0}
      aria-label="Open the invitation" onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && open()}>
      <div className="doors__light" />
      <div className="door door--left"><span className="door__knocker" /></div>
      <div className="door door--right"><span className="door__knocker" /></div>
      <Toran className="doors__toran" />
      <MarigoldStrand className="doors__strand doors__strand--l" count={22} />
      <MarigoldStrand className="doors__strand doors__strand--r" count={22} />

      <div className="doors__center">
        <p className="telugu doors__sri">శ్రీరస్తు · శుభమస్తు</p>
        <div className="seal">
          <span>{invitation.groom.name[0]}</span>
          <i>&amp;</i>
          <span>{invitation.bride.name[0]}</span>
        </div>
        <p className="doors__hint">Tap to open</p>
        <p className="doors__sub">🔊 best with sound on</p>
      </div>
    </div>
  );
}
