import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Great_Vibes, Noto_Serif_Telugu } from "next/font/google";
import { invitation as inv } from "@/config";
import "./globals.css";

const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600", "700"], style: ["normal", "italic"], variable: "--font-serif", display: "swap" });
const script = Great_Vibes({ subsets: ["latin"], weight: "400", variable: "--font-script", display: "swap" });
const telugu = Noto_Serif_Telugu({ subsets: ["telugu"], weight: ["500", "700"], variable: "--font-telugu", display: "swap" });

const title = `${inv.groom.name} & ${inv.bride.name} · Engagement Invitation`;

export const metadata: Metadata = {
  title,
  description: `Join us for the Nischitartham (engagement) of ${inv.groom.name} & ${inv.bride.name}. ${inv.dateText}`,
  openGraph: { title, description: `${inv.dateText} · ${inv.venue.name}`, type: "website" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#6e0f1c",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`locked ${serif.variable} ${script.variable} ${telugu.variable}`}>
      <body>{children}</body>
    </html>
  );
}
