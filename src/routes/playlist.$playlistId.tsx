import { Link, createFileRoute } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { cleanTitle, classify, thumb, type Episode } from "@/data/catalog";
import { EpisodeRow, PlayLink } from "@/components/media";
import { Shell } from "@/components/shell";
import { useCatalog } from "@/lib/catalog-context";
import { fetchPlaylistVideos } from "@/lib/catalog.functions";

export const Route = createFileRoute("/playlist/$playlistId")({
  loader: ({ params }) =>
    fetchPlaylistVideos({ data: params.playlistId }).catch(() => ({ ok: false as const })),
  component: PlaylistPage,
});

function PlaylistPage() {
  const { playlistId } = Route.useParams();
  const result = Route.useLoaderData();
  const { playlists } = useCatalog();
  const known = playlists.find((pl) => pl.id === playlistId);
  const videos: Episode[] =
    result.ok
      ? result.videos.map((video) => {
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
            format: "short" as const,
          };
        })
      : [];

  return (
    <Shell>
      <div className="px-4 py-4 md:px-8">
        <Link to="/" className="inline-flex h-11 items-center gap-1 text-sm text-cream">
          <ChevronLeft className="size-4" />
          होम
        </Link>
        <p className="mt-3 text-xs tracking-widest text-gold uppercase">प्लेलिस्ट</p>
        <h1 className="mt-1 font-display text-4xl text-cream">{known?.title ?? "प्लेलिस्ट"}</h1>
        <p className="mt-2 max-w-xl text-sm text-mute">
          {known?.countLabel ? `${known.countLabel} · ` : ""}
          Hindi Kahaniya Sunao की YouTube प्लेलिस्ट। K DRAMA पर वही क्रम।
        </p>
        {videos[0] ? (
          <div className="mt-4">
            <PlayLink ep={videos[0]} label="पहली कड़ी" />
          </div>
        ) : (
          <p className="mt-4 text-sm text-cream">इस प्लेलिस्ट की कड़ियाँ अभी नहीं खुलीं।</p>
        )}
        {known?.thumb ? (
          <img src={known.thumb} alt="" className="mt-4 aspect-video w-full max-w-lg rounded-2xl object-cover" />
        ) : videos[0] ? (
          <img src={thumb(videos[0].id)} alt="" className="mt-4 aspect-video w-full max-w-lg rounded-2xl object-cover" />
        ) : null}
        <ol className="mt-6">
          {videos.map((ep) => (
            <li key={ep.id}>
              <EpisodeRow ep={ep} />
              <p className="-mt-1 mb-2 pl-12 text-xs text-mute">{cleanTitle(ep.title)}</p>
            </li>
          ))}
        </ol>
      </div>
    </Shell>
  );
}
