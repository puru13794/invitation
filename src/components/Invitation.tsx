"use client";

import { useCallback, useState } from "react";
import { invitation as inv } from "@/config";
import { useMusic } from "@/lib/useMusic";
import { useParallax, useReveal } from "@/lib/motion";
import { BananaLeaf, Diya, Divider, Gopuram, Kalash, Lotus, Mandala, MarigoldStrand, Rings, Toran } from "./Art";
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

  const share = async () => {
    const data = { title: `${inv.groom.name} & ${inv.bride.name}`, text: inv.shareText, url: window.location.href };
    if (navigator.share) {
      try { await navigator.share(data); } catch { /* cancelled */ }
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(`${inv.shareText}\n${data.url}`)}`, "_blank");
    }
  };

  const cal = calendarLinks();
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(inv.venue.mapQuery)}&z=15&output=embed`;

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
        {/* ═════════ HERO ═════════ */}
        <section className="hero" data-parallax>
          <div className="hero__sky" />
          <Mandala className="hero__mandala" />
          <div className="layer" data-speed="0.35"><Gopuram className="hero__gopuram" /></div>
          <div className="layer hero__leaves" data-speed="-0.12">
            <BananaLeaf className="hero__leaf hero__leaf--l" />
            <BananaLeaf className="hero__leaf hero__leaf--r" flip />
          </div>
          <Toran className="hero__toran" />
          <MarigoldStrand className="hero__strand hero__strand--l" count={10} />
          <MarigoldStrand className="hero__strand hero__strand--r" count={10} />

          <div className="hero__content" data-speed="0.18">
            <p className="telugu hero__ganesha anim" style={{ ["--d" as string]: "0.2s" }}>|| శ్రీ గణేశాయ నమః ||</p>
            <p className="kicker anim" style={{ ["--d" as string]: "0.45s" }}>With the blessings of the Almighty &amp; our elders</p>
            <h1 className="names">
              <span className="names__one anim" style={{ ["--d" as string]: "0.7s" }}>{inv.groom.name}</span>
              <span className="names__amp anim" style={{ ["--d" as string]: "1s" }}>&amp;</span>
              <span className="names__two anim" style={{ ["--d" as string]: "1.2s" }}>{inv.bride.name}</span>
            </h1>
            <Divider className="divider anim" />
            <p className="telugu hero__event anim" style={{ ["--d" as string]: "1.5s" }}>నిశ్చితార్థ మహోత్సవం</p>
            <p className="hero__event-en anim" style={{ ["--d" as string]: "1.6s" }}>Engagement Ceremony</p>
            <p className="hero__date anim" style={{ ["--d" as string]: "1.8s" }}>{inv.dateText}</p>
          </div>

          <div className="hero__diyas">
            <Diya className="diya" /><Diya className="diya diya--big" /><Diya className="diya" />
          </div>
          <a href="#invite" className="scroll-cue" aria-label="Scroll down"><span /></a>
        </section>

        {/* ═════════ INVITE TEXT + RINGS ═════════ */}
        <section className="section invite" id="invite" data-parallax>
          <Mandala className="bg-mandala" />
          <div className="invite__frame" data-reveal>
            <p className="telugu invite__telugu">సాదరంగా ఆహ్వానిస్తున్నాము</p>
            <p className="kicker">Together with our families</p>
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
          </div>
        </section>

        {/* ═════════ COUPLE ═════════ */}
        <section className="section couple" data-parallax>
          <div className="layer couple__bg" data-speed="0.2"><Lotus className="couple__lotus" /></div>
          <h2 className="heading" data-reveal>The Couple</h2>
          <p className="telugu heading-te" data-reveal>వధూవరులు</p>
          <div className="couple__grid">
            {[
              { role: "The Groom", te: "వరుడు", p: inv.groom },
              { role: "The Bride", te: "వధువు", p: inv.bride },
            ].map(({ role, te, p }, i) => (
              <article className="arch" key={role} data-reveal style={{ ["--d" as string]: `${i * 0.15}s` }}>
                <div className="arch__inner">
                  <div className="arch__mono">{p.name[0]}</div>
                  <p className="arch__role">{role} · <span className="telugu">{te}</span></p>
                  <h3 className="script arch__name">{p.name}</h3>
                  <p className="telugu arch__te">{p.teluguName}</p>
                  <p className="arch__parents">{p.parents}</p>
                </div>
              </article>
            ))}
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
              <span className="telugu scratch__te">{inv.teluguDateText}</span>
            </ScratchReveal>
          </div>
          <p className="kicker save__until" data-reveal>Counting down to the muhurtham</p>
          <div data-reveal><Countdown target={inv.dateISO} /></div>
          <div className="btn-row" data-reveal>
            <a className="btn" href={cal.google} target="_blank" rel="noopener noreferrer">📅 Google Calendar</a>
            <a className="btn btn--ghost" href={cal.ics} download="engagement.ics">🍎 Apple / Other</a>
          </div>
        </section>

        {/* ═════════ PROGRAMME ═════════ */}
        <section className="section programme">
          <h2 className="heading" data-reveal>Order of Ceremony</h2>
          <p className="telugu heading-te" data-reveal>కార్యక్రమ వివరాలు</p>
          <ol className="timeline">
            {inv.programme.map((item, i) => (
              <li key={item.title} data-reveal style={{ ["--d" as string]: `${i * 0.08}s` }}>
                <span className="timeline__dot" />
                <span className="timeline__time">{item.time}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ═════════ VENUE ═════════ */}
        <section className="section venue" data-parallax>
          <div className="layer" data-speed="0.25"><Gopuram className="venue__gopuram" /></div>
          <p className="kicker" data-reveal>Where the celebration happens</p>
          <h2 className="heading" data-reveal>The Venue</h2>
          <div className="venue__card" data-reveal>
            <h3>{inv.venue.name}</h3>
            <p>{inv.venue.address}</p>
            <p className="venue__when">{inv.dateText} · {inv.timeText}</p>
            <div className="venue__map">
              <iframe src={mapSrc} title="Venue location map" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
            </div>
            <a className="btn" href={inv.venue.mapsLink} target="_blank" rel="noopener noreferrer">📍 Get Directions</a>
          </div>
        </section>

        {/* ═════════ CLOSING ═════════ */}
        <section className="section closing">
          <Toran className="closing__toran" />
          <div data-reveal>
            <p className="telugu closing__te">మీ రాకే మాకు ఆనందం</p>
            <p className="closing__en">Your presence is our greatest blessing</p>
            <Divider className="divider" />
            <p className="kicker">With love &amp; best compliments from</p>
            <p className="closing__hosts">{inv.hosts}</p>
            <p className="closing__note">Kindly bless the couple with your gracious presence.</p>
            <button className="btn" onClick={share}>💌 Share Invitation</button>
          </div>
          <div className="closing__diyas"><Diya className="diya" /><Diya className="diya" /><Diya className="diya" /><Diya className="diya" /><Diya className="diya" /></div>
          <p className="closing__foot">{inv.groom.name.split(" ")[0]} ♥ {inv.bride.name.split(" ")[0]}</p>
        </section>
      </main>
    </div>
  );
}
