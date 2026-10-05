// Renders the /video teaser to an MP4 (1080×1920, 30fps) with the invitation music.
//
//   1. npm run dev            (in another terminal)
//   2. npm run video          → out/engagement-invitation.mp4
//
// Needs Google Chrome and ffmpeg installed. Every frame is seeked exactly via
// window.__seek(t), so the result is smooth no matter how fast the machine is.
import puppeteer from "puppeteer-core";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const URL = process.env.VIDEO_URL ?? "http://localhost:3000/video?render=1";
const CHROME = process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const FPS = 30;
const DURATION = 21; // keep in sync with DURATION in src/app/video/VideoScene.tsx
const FADE_OUT = 1.8;
const OUT = "out/engagement-invitation.mp4";
const MUSIC = "public/music/engagement.mp3";

const frames = mkdtempSync(path.join(tmpdir(), "invite-frames-"));
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--hide-scrollbars", "--force-color-profile=srgb", "--font-render-hinting=none"],
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 540, height: 960, deviceScaleFactor: 2 });
  await page.goto(URL, { waitUntil: "networkidle0", timeout: 120_000 });
  await page.waitForFunction("window.__ready === true", { timeout: 60_000 });
  await new Promise((r) => setTimeout(r, 800)); // let fonts & SVG settle

  const total = FPS * DURATION;
  for (let i = 0; i < total; i++) {
    await page.evaluate((t) => window.__seek(t), i / FPS);
    await page.screenshot({ path: path.join(frames, `${String(i).padStart(5, "0")}.jpg`), type: "jpeg", quality: 92 });
    if (i % FPS === 0) process.stdout.write(`\rframes ${i}/${total}`);
  }
  process.stdout.write(`\rframes ${total}/${total}\n`);
} finally {
  await browser.close();
}

mkdirSync(path.dirname(OUT), { recursive: true });
execFileSync("ffmpeg", [
  "-y", "-loglevel", "error",
  "-framerate", String(FPS), "-i", path.join(frames, "%05d.jpg"),
  "-i", MUSIC,
  "-filter_complex", `[1:a]afade=t=in:d=0.4,afade=t=out:st=${DURATION - FADE_OUT}:d=${FADE_OUT}[a]`,
  "-map", "0:v", "-map", "[a]", "-t", String(DURATION),
  // JPEG frames are full-range; convert to standard TV range so phones show true colours
  "-vf", "scale=in_range=pc:out_range=tv,format=yuv420p", "-color_range", "tv", "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709",
  "-c:v", "libx264", "-profile:v", "high", "-crf", "20", "-preset", "slow",
  "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart",
  OUT,
], { stdio: "inherit" });
rmSync(frames, { recursive: true, force: true });
console.log(`✓ ${OUT}`);
