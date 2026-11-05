import { createFileRoute } from "@tanstack/react-router";
import { EPISODES, classify, type Episode } from "@/data/catalog";
import { fetchChannelCatalog } from "@/lib/catalog.functions";
import { renderLlmsFull } from "@/lib/geo";
import type { LiveVideo } from "@/lib/yt-parse";

export const Route = createFileRoute("/llms-full.txt")({
  server: {
    handlers: {
      GET: async () => {
        const snap = await fetchChannelCatalog();
        const episodes = mergeTitles(snap.ok ? snap.videos : [], snap.ok ? snap.shorts : []);
        const body = renderLlmsFull(snap.origin, episodes.filter((ep) => ep.format === "short"), episodes, snap.playlists);
        return new Response(body, {
          headers: {
            "content-type": "text/plain; charset=utf-8",
            "cache-control": "public, max-age=900",
          },
        });
      },
    },
  },
});

function mergeTitles(videos: LiveVideo[], shorts: LiveVideo[]): Episode[] {
  const map = new Map(EPISODES.map((ep) => [ep.id, { ...ep }]));
  const add = (video: LiveVideo, format: "short" | "long", index?: number) => {
    const known = map.get(video.id);
    if (known) {
      known.title = video.title || known.title;
      if (format === "short") {
        known.format = "short";
        known.shortIndex = index;
      }
      return;
    }
    const guessed = classify(video.title);
    map.set(video.id, {
      id: video.id,
      title: video.title,
      duration: video.duration,
      viewsLabel: video.viewsLabel,
      views: video.views,
      published: video.published,
      genres: guessed.genres,
      seriesId: guessed.seriesId,
      blurb: "",
      format,
      shortIndex: index,
    });
  };
  videos.forEach((video) => add(video, "long"));
  shorts.forEach((video, index) => add(video, "short", index));
  return [...map.values()];
}
