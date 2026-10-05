import { ImageResponse } from "next/og";
import { invitation as inv } from "@/config";

// WhatsApp / social link preview card
export const alt = `${inv.groom.name} & ${inv.bride.name} — Engagement`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          background: "radial-gradient(circle at 50% 40%, #9c1b2c 0%, #5c0b17 70%)", color: "#fbe7a1", fontFamily: "serif",
          border: "18px solid #d9a33a",
        }}
      >
        <div style={{ fontSize: 30, letterSpacing: 10, color: "#f6c76a" }}>ENGAGEMENT CEREMONY</div>
        <div style={{ fontSize: 96, marginTop: 30, fontStyle: "italic" }}>{inv.groom.name}</div>
        <div style={{ fontSize: 60, color: "#f39c12" }}>&amp;</div>
        <div style={{ fontSize: 96, fontStyle: "italic" }}>{inv.bride.name}</div>
        <div style={{ fontSize: 32, marginTop: 30, color: "#ffe9c2" }}>{inv.dateText}</div>
      </div>
    ),
    size,
  );
}
