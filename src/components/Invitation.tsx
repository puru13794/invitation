"use client";

import { useCallback, useState } from "react";
import { invitation as inv } from "@/config";
import { useMusic } from "@/lib/useMusic";
import { useParallax, useReveal } from "@/lib/motion";
import { Divider, Kalash, Mandala, Rings } from "./Art";
import { Doors } from "./Doors";
import { Countdown } from "./Countdown";
import { ScratchReveal } from "./ScratchReveal";
import { Burst, Petals } from "./Petals";

/* ── calendar helpers ── */
const toICSDate = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
function calendarLinks() {
  const start = new Date(inv.dateISO);
  const end = new Date(start.getTime() + inv.durationHours * 3600_000);
  const title = `Engagement · ${inv.groom.name} & ${inv.bride.name}`;
  const where = `${inv.venue.name}, ${inv.venue.address}`;
  const google =
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    `&text=${encodeURIComponent(title)}&dates=${toICSDate(start)}/${toICSDate(end)}` +
    `&location=${encodeURIComponent(where)}&details=${encodeURIComponent(inv.venue.mapsLink)}`;
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//engagement//EN", "BEGIN:VEVENT",
    `UID:${toICSDate(start)}@engagement`, `DTSTAMP:${toICSDate(new Date())}`,
    `DTSTART:${toICSDate(start)}`, `DTEND:${toICSDate(end)}`,
    `SUMMARY:${title}`, `LOCATION:${where.replace(/,/g, "\\,")}`, `URL:${inv.venue.mapsLink}`,
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
  return { google, ics: `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}` };
}

export function Invitation() {
  const [opened, setOpened] = useState(false);
  const [burst, setBurst] = useState(0);
  const music = useMusic(inv.musicSrc);
  useParallax();
  useReveal(opened);

  const open = useCallback(() => {
    music.start();
    setOpened(true);
    setBurst((b) => b + 1);
    document.documentElement.classList.remove("locked");
    window.scrollTo(0, 0);
  }, [music]);

  const cal = calendarLinks();

  return (
    <div className={`site ${opened ? "is-open" : ""}`}>
      <Doors onOpen={open} />
      {opened && <Petals count={12} />}
      {burst > 0 && <Burst key={burst} />}

      <button className={`music-btn ${music.playing ? "is-playing" : ""}`} onClick={music.toggle}
        aria-label={music.playing ? "Pause music" : "Play music"}>
        <span className="music-btn__disc">{music.playing ? "♪" : "🔇"}</span>
        <span className="music-btn__bars" aria-hidden><i /><i /><i /></span>
      </button>

      <main className="page">
        {/* ═════════ INVITE + VENUE ═════════ */}
        <section className="section invite" id="invite" data-parallax>
          <div className="layer" data-speed="0.15"><Mandala className="bg-mandala" /></div>
          <div className="invite__frame" data-reveal>
            <p className="kicker invite__first">Together with our families</p>
            <p className="invite__text">
              we joyfully invite you and your family to grace the auspicious occasion of the
              <strong> engagement </strong>of
            </p>
            <div className="invite__pair">
              <div><span className="script">{inv.groom.name}</span><small>{inv.groom.parents}</small></div>
              <Rings className="rings" />
              <div><span className="script">{inv.bride.name}</span><small>{inv.bride.parents}</small></div>
            </div>
            <p className="invite__text">and bless the couple as two families become one.</p>

            <Divider className="divider" />
            <p className="kicker">Venue</p>
            <h3 className="invite__venue">{inv.venue.name}</h3>
            <p className="invite__address">{inv.venue.address}</p>
            <p className="invite__when">{inv.dateText} · {inv.timeText}</p>
            <div className="venue__map">
              <iframe src={inv.venue.mapEmbedUrl} title="Venue location map" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
            </div>
            <a className="btn" href={inv.venue.mapsLink} target="_blank" rel="noopener noreferrer">📍 Get Directions</a>
          </div>
        </section>

        {/* ═════════ SAVE THE DATE ═════════ */}
        <section className="section save" data-parallax>
          <div className="layer save__kalash" data-speed="-0.15"><Kalash className="kalash kalash--l" /><Kalash className="kalash kalash--r" /></div>
          <p className="kicker" data-reveal>Mark your calendar</p>
          <h2 className="heading" data-reveal>Save the Date</h2>
          <div data-reveal>
            <ScratchReveal onReveal={() => setBurst((b) => b + 1)}>
              <span className="scratch__date">{inv.dateText}</span>
              <span className="scratch__time">{inv.timeText}</span>
            </ScratchReveal>
          </div>
          <p className="kicker save__until" data-reveal>Counting down to the muhurtham</p>
          <div data-reveal><Countdown target={inv.dateISO} /></div>
          <div className="btn-row" data-reveal>
            <a className="btn" href={cal.google} target="_blank" rel="noopener noreferrer">📅 Google Calendar</a>
            <a className="btn btn--ghost" href={cal.ics} download="engagement.ics">🍎 Apple / Other</a>
          </div>
        </section>

      </main>
    </div>
  );
}
