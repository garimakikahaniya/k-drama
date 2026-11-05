import { Link, createFileRoute } from "@tanstack/react-router";
import { GENRE_LABEL, thumb } from "@/data/catalog";
import { Shell } from "@/components/shell";
import { orderedInSeries, useCatalog } from "@/lib/catalog-context";
import { useTaste } from "@/lib/store";
import { scoreEpisode } from "@/lib/taste";

export const Route = createFileRoute("/series")({ component: SeriesIndex });

function SeriesIndex() {
  const { series, episodes } = useCatalog();
  const taste = useTaste((s) => s.taste);
  const rows = series
    .map((item) => ({ item, eps: orderedInSeries(item.id, episodes) }))
    .filter((row) => row.eps.length > 0)
    .sort((a, b) => scoreEpisode(b.eps[0]!, taste) - scoreEpisode(a.eps[0]!, taste));

  return (
    <Shell>
      <div className="px-4 py-6 md:px-8">
        <p className="text-xs tracking-widest text-gold uppercase">Anthology</p>
        <h1 className="mt-1 font-display text-4xl text-cream">सीरीज़</h1>
        <p className="mt-2 max-w-xl text-sm text-mute">
          चैनल की कहानियाँ K-drama शेल्फ़ की तरह — हर दुनिया की अपनी कड़ियाँ।
        </p>
        <ul className="mt-6 flex flex-col gap-4">
          {rows.map(({ item, eps }, index) => {
            const cover = eps[Math.min(2, eps.length - 1)] ?? eps[0];
            return (
              <li key={item.id}>
                <Link
                  to="/series/$seriesId"
                  params={{ seriesId: item.id }}
                  className="grid overflow-hidden rounded-2xl bg-card md:grid-cols-[220px_1fr]"
                >
                  <span className="relative block aspect-video md:aspect-auto md:min-h-44">
                    {cover ? (
                      <img src={thumb(cover.id)} alt="" className="h-full w-full object-cover" />
                    ) : null}
                  </span>
                  <span className="flex flex-col justify-center p-4 md:p-6">
                    <span className="text-xs text-gold">
                      {String(index + 1).padStart(2, "0")} · {item.genres.map((g) => GENRE_LABEL[g]).join(" · ")}
                    </span>
                    <span className="mt-1 font-display text-3xl text-cream">{item.title}</span>
                    <span className="mt-2 max-w-lg text-sm text-mute">{item.logline}</span>
                    <span className="mt-3 text-xs text-cream">{eps.length} कड़ियाँ</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </Shell>
  );
}
