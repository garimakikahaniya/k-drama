import { createFileRoute } from "@tanstack/react-router";
import { fetchChannelCatalog } from "@/lib/catalog.functions";
import { renderLlms } from "@/lib/geo";

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: async () => {
        const snap = await fetchChannelCatalog();
        const body = renderLlms(snap.origin, snap.shorts, snap.playlists);
        return text(body, "text/plain; charset=utf-8");
      },
    },
  },
});

function text(body: string, type: string) {
  return new Response(body, {
    headers: {
      "content-type": type,
      "cache-control": "public, max-age=900",
    },
  });
}
