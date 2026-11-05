import { createFileRoute } from "@tanstack/react-router";
import { EPISODES, classify, type Episode } from "@/data/catalog";
import { fetchChannelCatalog } from "@/lib/catalog.functions";
import { renderSitemap } from "@/lib/geo";
import type { LiveVideo } from "@/lib/yt-parse";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const snap = await fetchChannelCatalog();
        const episodes = titles(snap.ok ? snap.videos : [], snap.ok ? snap.shorts : []);
        const xml = renderSitemap(snap.origin, episodes, snap.ok ? snap.playlists : []);
        return new Response(xml, {
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=900",
          },
        });
      },
    },
  },
});

function titles(videos: LiveVideo[], shorts: LiveVideo[]): Episode[] {
  const ids = new Map<string, Episode>();
  for (const ep of EPISODES) ids.set(ep.id, ep);
  for (const video of [...videos, ...shorts]) {
    if (ids.has(video.id)) continue;
    const guessed = classify(video.title);
    ids.set(video.id, {
      id: video.id,
      title: video.title,
      duration: video.duration,
      viewsLabel: video.viewsLabel,
      views: video.views,
      published: "",
      genres: guessed.genres,
      seriesId: guessed.seriesId,
      blurb: "",
    });
  }
  return [...ids.values()];
}
