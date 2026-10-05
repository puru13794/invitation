/**
 * A tiny Web Audio "temple ensemble" used when no MP3 is supplied:
 * tanpura drone (Pa-Sa-Sa-Sa), a flute-like melody in raga Mohanam with
 * gamaka slides, soft mridangam strokes and an occasional temple bell —
 * all synthesized, so it costs zero bytes to download.
 */

const SA = 293.66; // D4 as Sa
// Mohanam swaras as just-intonation ratios: S R2 G3 P D2
const SCALE = [1, 9 / 8, 5 / 4, 3 / 2, 5 / 3];

/** degree 0 = Sa; negative / > 4 wrap into lower / upper octaves */
function freq(degree: number) {
  const oct = Math.floor(degree / 5);
  const idx = ((degree % 5) + 5) % 5;
  return SA * SCALE[idx] * Math.pow(2, oct);
}

// [degree, beats]; degree null = rest. 4 phrases × 16 beats.
type Note = [number | null, number];
const MELODY: Note[] = [
  // Phrase 1 — rising, hopeful
  [0, 1], [1, 1], [2, 1], [3, 1],
  [2, 0.5], [3, 0.5], [4, 1], [3, 2],
  [2, 1], [3, 1], [4, 1], [5, 1],
  [4, 1], [3, 1], [2, 2],
  // Phrase 2 — descending answer
  [5, 1], [6, 1], [5, 1], [4, 1],
  [3, 1], [4, 1], [3, 1], [2, 1],
  [1, 1], [2, 1], [3, 1], [2, 1],
  [1, 1], [0, 1], [0, 1.5], [null, 0.5],
  // Phrase 3 — climb to tara sthayi
  [2, 1.5], [3, 0.5], [4, 1], [5, 1],
  [6, 1], [7, 1], [6, 2],
  [5, 1], [4, 1], [3, 1], [4, 1],
  [5, 3], [null, 1],
  // Phrase 4 — settle home
  [4, 1], [3, 1], [2, 1], [3, 1],
  [4, 0.5], [5, 0.5], [4, 1], [3, 2],
  [2, 1], [1, 1], [0, 1], [1, 1],
  [0, 3], [null, 1],
];

const BPM = 68;
const BEAT = 60 / BPM;

export class CarnaticSynth {
  private ctx: AudioContext;
  private master: GainNode;
  private wet: GainNode;
  private timer: number | null = null;
  private nextMelodyTime = 0;
  private melodyIdx = 0;
  private prevFreq = freq(0);
  private nextBeatTime = 0;
  private beatCount = 0;
  private noiseBuf: AudioBuffer;

  constructor(ctx: AudioContext) {
    this.ctx = ctx;
    this.master = ctx.createGain();
    this.master.gain.value = 0;
    this.master.connect(ctx.destination);

    // Generated impulse response → spacious "mandapam" reverb
    const conv = ctx.createConvolver();
    conv.buffer = this.impulse(3.2, 2.6);
    this.wet = ctx.createGain();
    this.wet.gain.value = 0.55;
    this.wet.connect(conv).connect(this.master);

    this.noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = this.noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }

  private impulse(seconds: number, decay: number) {
    const rate = this.ctx.sampleRate;
    const len = Math.floor(rate * seconds);
    const buf = this.ctx.createBuffer(2, len, rate);
    for (let c = 0; c < 2; c++) {
      const ch = buf.getChannelData(c);
      for (let i = 0; i < len; i++) ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
    return buf;
  }

  /** route a node to dry + reverb */
  private out(node: AudioNode, dry = 1, wet = 1) {
    const d = this.ctx.createGain();
    d.gain.value = dry;
    node.connect(d).connect(this.master);
    const w = this.ctx.createGain();
    w.gain.value = wet;
    node.connect(w).connect(this.wet);
  }

  private tanpura(t: number, f: number, vol: number) {
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = f;
    const osc2 = ctx.createOscillator();
    osc2.type = "sawtooth";
    osc2.frequency.value = f * 1.0025; // chorus shimmer (jawari-ish)
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.Q.value = 6;
    lp.frequency.setValueAtTime(2400, t);
    lp.frequency.exponentialRampToValueAtTime(500, t + 3.5);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + BEAT * 4.2);
    osc.connect(lp);
    osc2.connect(lp);
    lp.connect(g);
    this.out(g, 0.7, 0.6);
    osc.start(t);
    osc2.start(t);
    osc.stop(t + BEAT * 4.3);
    osc2.stop(t + BEAT * 4.3);
  }

  private flute(t: number, f: number, dur: number) {
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    // gamaka: glide in from the previous swara
    osc.frequency.setValueAtTime(this.prevFreq, t);
    osc.frequency.exponentialRampToValueAtTime(f, t + Math.min(0.09, dur * 0.3));
    const over = ctx.createOscillator();
    over.type = "sine";
    over.frequency.setValueAtTime(this.prevFreq * 2, t);
    over.frequency.exponentialRampToValueAtTime(f * 2, t + Math.min(0.09, dur * 0.3));
    const overG = ctx.createGain();
    overG.gain.value = 0.18;

    // vibrato that blooms on longer notes
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 5.4;
    const lfoG = ctx.createGain();
    lfoG.gain.setValueAtTime(0, t);
    lfoG.gain.linearRampToValueAtTime(dur > 0.8 ? f * 0.012 : f * 0.004, t + Math.min(0.5, dur));
    lfo.connect(lfoG);
    lfoG.connect(osc.frequency);
    lfoG.connect(over.frequency);

    // breath
    const breath = ctx.createBufferSource();
    breath.buffer = this.noiseBuf;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = f * 2;
    bp.Q.value = 2;
    const bg = ctx.createGain();
    bg.gain.value = 0.035;
    breath.connect(bp).connect(bg);

    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 3200;
    const g = ctx.createGain();
    const peak = 0.16;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(peak, t + 0.05);
    g.gain.setValueAtTime(peak * 0.85, t + Math.max(0.06, dur - 0.12));
    g.gain.linearRampToValueAtTime(0, t + dur + 0.08);

    osc.connect(lp);
    over.connect(overG).connect(lp);
    bg.connect(lp);
    lp.connect(g);
    this.out(g, 0.8, 0.9);

    const end = t + dur + 0.12;
    [osc, over, lfo, breath].forEach((n) => {
      n.start(t);
      n.stop(end);
    });
    this.prevFreq = f;
  }

  private mridangam(t: number, kind: "thom" | "nam", vol: number) {
    const ctx = this.ctx;
    if (kind === "thom") {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.setValueAtTime(130, t);
      o.frequency.exponentialRampToValueAtTime(70, t + 0.25);
      const g = ctx.createGain();
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
      o.connect(g);
      this.out(g, 1, 0.25);
      o.start(t);
      o.stop(t + 0.5);
    } else {
      const o = ctx.createOscillator();
      o.type = "triangle";
      o.frequency.value = SA * 2;
      const n = ctx.createBufferSource();
      n.buffer = this.noiseBuf;
      const hp = ctx.createBiquadFilter();
      hp.type = "highpass";
      hp.frequency.value = 2500;
      const g = ctx.createGain();
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
      o.connect(g);
      n.connect(hp).connect(g);
      this.out(g, 1, 0.3);
      o.start(t);
      n.start(t);
      o.stop(t + 0.2);
      n.stop(t + 0.2);
    }
  }

  private bell(t: number) {
    const ctx = this.ctx;
    const base = SA * 4;
    [1, 2.76, 5.4, 8.93].forEach((r, i) => {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = base * r;
      const g = ctx.createGain();
      const v = 0.06 / (i + 1);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(v, t + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 4 / (i + 1));
      o.connect(g);
      this.out(g, 0.6, 1);
      o.start(t);
      o.stop(t + 4.2);
    });
  }

  private schedule = () => {
    const ahead = this.ctx.currentTime + 0.6;

    // rhythm + drone, beat by beat (16-beat cycle)
    while (this.nextBeatTime < ahead) {
      const t = this.nextBeatTime;
      const b = this.beatCount % 16;
      if (b % 4 === 0) {
        // tanpura cycle: Pa (low) · Sa · Sa · Sa (low)
        this.tanpura(t, freq(-2), 0.05);
        this.tanpura(t + BEAT, freq(0), 0.045);
        this.tanpura(t + BEAT * 2, freq(0), 0.045);
        this.tanpura(t + BEAT * 3, freq(-5), 0.055);
      }
      if (this.beatCount >= 16) {
        // adi-talam-ish pattern, gentle
        if (b % 4 === 0) this.mridangam(t, "thom", 0.22);
        if (b % 2 === 1) this.mridangam(t, "nam", 0.06);
        if (b % 8 === 6) this.mridangam(t + BEAT / 2, "nam", 0.04);
      }
      if (this.beatCount % 64 === 0) this.bell(t);
      this.nextBeatTime += BEAT;
      this.beatCount++;
    }

    // melody enters after one drone cycle
    while (this.nextMelodyTime < ahead) {
      const [deg, beats] = MELODY[this.melodyIdx];
      const dur = beats * BEAT;
      if (deg !== null) this.flute(this.nextMelodyTime, freq(deg), dur);
      this.nextMelodyTime += dur;
      this.melodyIdx = (this.melodyIdx + 1) % MELODY.length;
    }
  };

  start() {
    const now = this.ctx.currentTime + 0.05;
    this.nextBeatTime = now;
    this.nextMelodyTime = now + BEAT * 8;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(0, now);
    this.master.gain.linearRampToValueAtTime(0.9, now + 2.5);
    this.timer = window.setInterval(this.schedule, 150);
    this.schedule();
  }

  pause() {
    return this.ctx.suspend();
  }

  resume() {
    return this.ctx.resume();
  }
}
