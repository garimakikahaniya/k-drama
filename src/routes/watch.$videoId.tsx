import { Link, createFileRoute } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { useEffect, useRef } from "react";
import {
  GENRE_LABEL,
  cleanTitle,
  episodeNumber,
  getSeries,
  hindiWhen,
} from "@/data/catalog";
import { AdSlot } from "@/components/ad-slot";
import { EpisodeRow, PlayLink, SaveLike, YtFrame } from "@/components/media";
import { Shell } from "@/components/shell";
import { orderedInSeries, useCatalog } from "@/lib/catalog-context";
import { citeLine, jsonScript, videoGraph } from "@/lib/geo";
import { useTaste } from "@/lib/store";
import { rankEpisodes } from "@/lib/taste";

export const Route = createFileRoute("/watch/$videoId")({ component: WatchPage });

function WatchPage() {
  const { videoId } = Route.useParams();
  const { episodes, origin } = useCatalog();
  const taste = useTaste((s) => s.taste);
  const mood = useTaste((s) => s.mood);
  const recordWatch = useTaste((s) => s.recordWatch);
  const marked = useRef("");
  const ep = episodes.find((item) => item.id === videoId);

  useEffect(() => {
    if (!ep || marked.current === ep.id) return;
    marked.current = ep.id;
    recordWatch(ep.id, ep.genres);
  }, [ep, recordWatch]);

  if (!ep) {
    return (
      <Shell>
        <div className="px-4 py-16 md:px-8">
          <h1 className="font-display text-3xl text-cream">यह कड़ी नहीं मिली</h1>
          <Link to="/" className="mt-4 inline-flex text-gold">
            होम
          </Link>
        </div>
      </Shell>
    );
  }

  const series = getSeries(ep.seriesId);
  const eps = orderedInSeries(ep.seriesId, episodes);
  const n = episodeNumber(ep, episodes);
  const next = eps[n] ?? null;
  const more = rankEpisodes(
    episodes.filter((item) => item.id !== ep.id),
    taste,
    mood,
  ).slice(0, 8);

  return (
    <Shell>
      <div className="md:grid md:grid-cols-[minmax(0,1fr)_320px] md:gap-6 md:px-8 md:py-6">
        <div>
          <div className="flex items-center px-4 py-2 md:px-0">
            {series ? (
              <Link
                to="/series/$seriesId"
                params={{ seriesId: series.id }}
                className="inline-flex h-11 items-center gap-1 text-sm text-cream"
              >
                <ChevronLeft className="size-4" />
                {series.title}
              </Link>
            ) : (
              <Link to="/" className="inline-flex h-11 items-center gap-1 text-sm text-cream">
                <ChevronLeft className="size-4" />
                वापस
              </Link>
            )}
          </div>
          <YtFrame id={ep.id} title={cleanTitle(ep.title)} portrait={ep.format === "short"} />
          <div className="px-4 py-4 md:px-0">
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: jsonScript(videoGraph(origin, ep)) }}
            />
            <p className="text-xs tracking-widest text-gold uppercase">
              EP {String(n).padStart(2, "0")}
              {series ? ` · ${series.title}` : ""} · {ep.genres.map((g) => GENRE_LABEL[g]).join(" · ")}
            </p>
            <h1 className="mt-1 font-display text-3xl leading-tight text-cream">
              {cleanTitle(ep.title)}
            </h1>
            <p className="mt-2 max-w-xl text-sm text-cream">{citeLine(ep)}</p>
            <p className="mt-2 text-sm text-mute">
              {ep.blurb}
              {ep.duration ? ` · ${ep.duration}` : ""}
              {ep.viewsLabel ? ` · ${ep.viewsLabel} बार` : ""}
              {ep.published ? ` · ${hindiWhen(ep.published)}` : ""}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <SaveLike ep={ep} />
              {next ? <PlayLink ep={next} label="अगली कड़ी" /> : null}
              <a
                href={`https://www.youtube.com/watch?v=${ep.id}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center rounded-full border border-line px-4 text-sm text-mute"
              >
                YouTube पर
              </a>
            </div>
          </div>
          <div className="mt-2 mb-4">
            <AdSlot slot="player" label="प्लेयर के नीचे" />
          </div>
          <div className="px-2 md:hidden">
            <h2 className="px-2 font-display text-xl text-cream">इसी सीरीज़ में</h2>
            <ol className="mt-2">
              {eps.map((item) => (
                <li key={item.id}>
                  <EpisodeRow ep={item} />
                </li>
              ))}
            </ol>
          </div>
          <section className="mt-6 px-4 md:px-0">
            <h2 className="font-display text-xl text-cream">और ऐसी ही</h2>
            <div className="mt-3 flex flex-col">
              {more.slice(0, 4).map((item) => (
                <EpisodeRow key={item.id} ep={item} />
              ))}
            </div>
          </section>
        </div>
        <aside className="hidden md:block">
          <h2 className="font-display text-xl text-cream">कड़ियाँ</h2>
          <ol className="mt-2">
            {eps.map((item) => (
              <li key={item.id}>
                <EpisodeRow ep={item} />
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </Shell>
  );
}
