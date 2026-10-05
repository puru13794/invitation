# Purushottam ❤ Kavya — Engagement Invitation

Next.js (App Router) site, statically pre-rendered → instant loads on Vercel.

## Edit details
Everything is in **`src/config.ts`**: date/time, venue, Google Maps link, parents' names,
ceremony programme, hosts. Placeholders are in `[square brackets]`.

- `dateISO` drives the countdown and "Add to calendar" — keep the `+05:30` offset.
- `venue.mapsLink` → paste your Google Maps share link (Get Directions button).
- `venue.mapQuery` → venue name + city, or `"lat,lng"`, for the embedded map.

## Music
Drop an MP3 at **`public/music/engagement.mp3`** (keep it ~2–4 MB, e.g. a
nadaswaram / mangala vadyam / veena instrumental) and it plays when guests open the doors.
If the file is absent, a built-in synthesized Carnatic melody (raga Mohanam, tanpura,
mridangam, temple bell) plays instead — zero download.

## Run locally
```bash
npm install
npm run dev     # http://localhost:3000
```

## Deploy to Vercel
- Push this folder to a GitHub repo → vercel.com/new → Import → Deploy (no settings needed), or
- `npx vercel --prod` from this folder.
