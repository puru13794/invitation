import { notFound } from "next/navigation";
import { VideoScene } from "./VideoScene";
import "./video.css";

/**
 * Dev-only page that plays the invitation teaser video. `npm run video`
 * renders it frame-by-frame to an MP4 (see scripts/render-video.mjs).
 * Not shipped: it 404s in production builds.
 */
export default function VideoPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <VideoScene />;
}
