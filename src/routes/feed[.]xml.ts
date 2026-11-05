import { createFileRoute } from "@tanstack/react-router";
import { classify, type Episode } from "@/data/catalog";
import { fetchChannelCatalog } from "@/lib/catalog.functions";
import { renderFeed } from "@/lib/geo";

export const Route = createFileRoute("/feed.xml")({
  server: {
    handlers: {
      GET: async () => {
        const snap = await fetchChannelCatalog();
        const shorts: Episode[] = (snap.ok ? snap.shorts : []).map((video) => {
          const guessed = classify(video.title);
          return {
            id: video.id,
            title: video.title,
            duration: video.duration,
            viewsLabel: video.viewsLabel,
            views: video.views,
            published: video.published,
            genres: guessed.genres,
            seriesId: guessed.seriesId,
            blurb: "",
            format: "short",
          };
        });
        const xml = renderFeed(snap.origin, shorts);
        return new Response(xml, {
          headers: {
            "content-type": "application/rss+xml; charset=utf-8",
            "cache-control": "public, max-age=900",
          },
        });
      },
    },
  },
});
