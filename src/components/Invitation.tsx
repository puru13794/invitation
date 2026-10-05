"use client";

import { useCallback, useState } from "react";
import { invitation as inv } from "@/config";
import { useMusic } from "@/lib/useMusic";
import { useParallax, useReveal } from "@/lib/motion";
import { Emblem, Flourish, GoldVine, LotusCorner, LotusPeek, LotusPond, LotusSpray } from "./Art";
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
        {/* ═════════ PAGE 1 · INVITATION + VENUE ═════════ */}
        <section className="sheet" data-parallax>
          <Frame />
          <div className="sheet__content">
            <Emblem className="emblem" />
            <Flourish className="flourish" />
            <p className="caps" data-reveal>
              Together with our families<br />we invite you to celebrate<br />the engagement of
            </p>
            <Flourish className="flourish" />

            <h1 className="names">
              <span className="names__one" data-reveal>{inv.groom.name}</span>
              <span className="parents" data-reveal>{inv.groom.parents}</span>
              <span className="names__amp" data-reveal>&amp;</span>
              <span className="names__two" data-reveal>{inv.bride.name}</span>
              <span className="parents" data-reveal>{inv.bride.parents}</span>
            </h1>

            <Flourish className="flourish flourish--heart" heart />

            <div data-reveal>
              <p className="label">Date &amp; Time</p>
              <p className="when-date">{inv.dateText}</p>
              <p className="when-time">{inv.timeText}</p>
            </div>

            <Flourish className="flourish flourish--sm" />

            <div data-reveal>
              <p className="label">Venue</p>
              <h2 className="venue-name">{inv.venue.name}</h2>
              <p className="venue-address">{inv.venue.address}</p>
            </div>
            <div className="map" data-reveal>
              <iframe src={inv.venue.mapEmbedUrl} title="Venue location map" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
              {/* covers Google's small "Maps" button with our own "Venue" chip (same link) */}
              <a className="map__chip" href={inv.venue.mapsLink} target="_blank" rel="noopener noreferrer">📍 Venue</a>
            </div>
            <a className="btn" href={inv.venue.mapsLink} target="_blank" rel="noopener noreferrer" data-reveal>📍 Get Directions</a>

            <Flourish className="flourish flourish--heart" heart />
            <p className="caps caps--sm" data-reveal>Your presence will make<br />our day more special.</p>
          </div>
        </section>

        {/* ═════════ PAGE 2 · SAVE THE DATE ═════════ */}
        <section className="sheet" data-parallax>
          <Frame />
          <div className="sheet__content">
            <Emblem className="emblem" />
            <p className="caps" data-reveal>Mark your calendar</p>
            <h2 className="title" data-reveal>Save the Date</h2>
            <Flourish className="flourish flourish--heart" heart />
            <div data-reveal>
              <ScratchReveal onReveal={() => setBurst((b) => b + 1)}>
                <span className="scratch__date">{inv.dateText}</span>
                <span className="scratch__time">{inv.timeText}</span>
              </ScratchReveal>
            </div>
            <p className="caps caps--sm save__until" data-reveal>Counting down to the muhurtham</p>
            <div data-reveal><Countdown target={inv.dateISO} /></div>
            <div className="btn-row" data-reveal>
              <a className="btn" href={cal.google} target="_blank" rel="noopener noreferrer">📅 Google Calendar</a>
              <a className="btn btn--ghost" href={cal.ics} download="engagement.ics">🍎 Apple / Other</a>
            </div>
            <Flourish className="flourish" />
          </div>
        </section>
      </main>
    </div>
  );
}

/** Carved marble arch with lotus & gold-vine decoration (parallax layers). */
function Frame() {
  return (
    <>
      <div className="frame" aria-hidden>
        <div className="frame__lintel" />
        <div className="frame__pillar frame__pillar--l" />
        <div className="frame__pillar frame__pillar--r" />
        <div className="frame__arch"><div className="frame__panel" /></div>
      </div>
      <div className="deco deco--back" aria-hidden>
        <div className="deco__item deco__vine-l" data-speed="0.05"><GoldVine className="vine" /></div>
        <div className="deco__item deco__vine-r" data-speed="0.08"><GoldVine className="vine vine--flip" /></div>
      </div>
      <div className="deco" aria-hidden>
        <div className="deco__item deco__corner" data-speed="0.1"><LotusCorner className="sway" /></div>
        <div className="deco__item deco__spray" data-speed="0.16"><LotusSpray className="sway sway--slow" /></div>
        <div className="deco__item deco__peek" data-speed="0.06"><LotusPeek className="sway" /></div>
        <div className="deco__item deco__pond" data-speed="-0.06"><LotusPond /></div>
      </div>
    </>
  );
}
