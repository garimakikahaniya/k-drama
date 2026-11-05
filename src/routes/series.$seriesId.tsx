import { Link, createFileRoute } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { GENRE_LABEL, cleanTitle, getSeries, thumb } from "@/data/catalog";
import { EpisodeRow, PlayLink } from "@/components/media";
import { Shell } from "@/components/shell";
import { orderedInSeries, useCatalog } from "@/lib/catalog-context";
import { useTaste } from "@/lib/store";

export const Route = createFileRoute("/series/$seriesId")({ component: SeriesPage });

function SeriesPage() {
  const { seriesId } = Route.useParams();
  const { episodes } = useCatalog();
  const history = useTaste((s) => s.history);
  const series = getSeries(seriesId);
  const eps = orderedInSeries(seriesId, episodes);

  if (!series || eps.length === 0) {
    return (
      <Shell>
        <div className="px-4 py-16 md:px-8">
          <h1 className="font-display text-3xl text-cream">यह सीरीज़ नहीं मिली</h1>
          <Link to="/series" className="mt-4 inline-flex text-gold">
            सभी सीरीज़
          </Link>
        </div>
      </Shell>
    );
  }

  const resume = [...eps].reverse().find((ep) => history.some((h) => h.id === ep.id)) ?? eps[0];
  const cover = eps[0];

  return (
    <Shell>
      <div className="pb-6">
        <div className="relative aspect-video max-h-80 w-full overflow-hidden md:max-h-96">
          {cover ? <img src={thumb(cover.id)} alt="" className="h-full w-full object-cover" /> : null}
          <div className="scrim-bottom absolute inset-0" />
          <Link
            to="/series"
            className="absolute top-4 left-4 inline-flex h-11 items-center gap-1 rounded-full bg-ink/80 px-3 text-sm text-cream"
          >
            <ChevronLeft className="size-4" />
            सीरीज़
          </Link>
        </div>
        <div className="px-4 pt-4 md:px-8">
          <p className="text-xs tracking-widest text-gold uppercase">
            {series.genres.map((g) => GENRE_LABEL[g]).join(" · ")} · {eps.length} कड़ियाँ
          </p>
          <h1 className="mt-1 font-display text-4xl text-cream">{series.title}</h1>
          <p className="mt-2 max-w-xl text-sm text-mute">{series.logline}</p>
          {resume ? (
            <div className="mt-4">
              <PlayLink
                ep={resume}
                label={history.some((h) => h.id === resume.id) ? "जारी रखें" : "पहली कड़ी"}
              />
            </div>
          ) : null}
          <ol className="mt-6">
            {eps.map((ep) => (
              <li key={ep.id}>
                <EpisodeRow ep={ep} />
                {ep.blurb ? (
                  <p className="-mt-1 mb-2 pl-12 text-xs text-mute">{ep.blurb || cleanTitle(ep.title)}</p>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Shell>
  );
}
