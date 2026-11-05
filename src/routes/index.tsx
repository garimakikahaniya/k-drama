import type { ReactNode } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { CHANNEL, GENRE_LABEL, MOODS, cleanTitle, getSeries, hindiWhen, thumb } from "@/data/catalog";
import { AdSlot, SponsorRail } from "@/components/ad-slot";
import { PlayLink, Poster, SaveLike, ShortCard } from "@/components/media";
import { Shell } from "@/components/shell";
import { orderedInSeries, useCatalog } from "@/lib/catalog-context";
import { FAQ, homeGraph, jsonScript } from "@/lib/geo";
import { cn } from "@/lib/cn";
import { useTaste } from "@/lib/store";
import { rankEpisodes, scoreEpisode, strongest } from "@/lib/taste";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const { episodes, series, live, shorts, playlists, origin } = useCatalog();
  const taste = useTaste((s) => s.taste);
  const mood = useTaste((s) => s.mood);
  const setMood = useTaste((s) => s.setMood);
  const history = useTaste((s) => s.history);
  const lean = strongest(taste);

  const ranked = rankEpisodes(episodes, taste, mood);
  const longRanked = ranked.filter((ep) => ep.format !== "short");
  const hero = longRanked[0] ?? ranked[0];
  const lead = shorts[0];
  const forYou = ranked.slice(0, 12);
  const fresh = [...episodes].sort((a, b) => b.views - a.views).slice(0, 10);
  const continueIds = history.map((h) => h.id);
  const continueEps = continueIds
    .map((id) => episodes.find((ep) => ep.id === id))
    .filter((ep): ep is NonNullable<typeof ep> => Boolean(ep));

  const seriesRails = series
    .map((item) => ({ item, eps: orderedInSeries(item.id, episodes) }))
    .filter((row) => row.eps.length > 0)
    .sort((a, b) => {
      const as = scoreEpisode(a.eps[0]!, taste);
      const bs = scoreEpisode(b.eps[0]!, taste);
      return bs - as;
    });

  return (
    <Shell>
      <div className="py-4 md:py-6">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonScript(homeGraph(origin, shorts, playlists)) }} />
        <section className="px-4 md:px-8">
          <p className="text-xs tracking-widest text-gold uppercase">पहले ये</p>
          <h1 className="mt-1 font-display text-3xl leading-tight text-cream md:text-4xl">नए शॉर्ट्स</h1>
          <p className="mt-2 max-w-xl text-sm text-mute">
            K DRAMA पर Hindi Kahaniya Sunao के YouTube Shorts सबसे ऊपर चलते हैं — Hindi K-drama स्टाइल की कड़ियाँ, जैसे HANA, फिर प्लेलिस्ट।
          </p>
          {lead ? (
          <div className="mt-4 flex flex-wrap items-end gap-4">
              <ShortCard ep={lead} featured />
              <div className="min-w-48 flex-1 pb-1">
                <p className="text-xs text-gold">नवीनतम शॉर्ट</p>
                <p className="mt-1 font-display text-2xl leading-tight text-cream">{cleanTitle(lead.title)}</p>
                <p className="mt-2 text-sm text-mute">{lead.viewsLabel || "YouTube Short"}</p>
                <div className="mt-3">
                  <PlayLink ep={lead} label="शॉर्ट चलाएँ" />
                </div>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-cream">शॉर्ट्स अभी लोड नहीं हुए। सहेजी कहानियाँ नीचे हैं।</p>
          )}
        </section>

        {shorts.length > 1 ? (
          <Rail title="सभी नए शॉर्ट्स" hint={live ? "चैनल के Shorts टैब से" : "सहेजा कैटलॉग"}>
            {shorts.slice(1, 24).map((ep) => (
              <ShortCard key={ep.id} ep={ep} />
            ))}
          </Rail>
        ) : null}

        {playlists.length > 0 ? (
          <Rail title="प्लेलिस्ट" hint="चैनल की सूचियाँ">
            {playlists.map((pl) => (
              <Link
                key={pl.id}
                to="/playlist/$playlistId"
                params={{ playlistId: pl.id }}
                className="block w-56 shrink-0"
              >
                <span className="relative block aspect-video overflow-hidden rounded-2xl bg-card">
                  {pl.thumb ? <img src={pl.thumb} alt="" className="h-full w-full object-cover" /> : null}
                  <span className="absolute top-2 left-2 rounded-md bg-ink/80 px-1.5 py-0.5 text-xs text-gold">
                    {pl.kind === "podcast" ? "पॉडकास्ट" : "प्लेलिस्ट"}
                  </span>
                  {pl.countLabel ? (
                    <span className="absolute right-2 bottom-2 rounded-md bg-ink/80 px-1.5 py-0.5 text-xs text-cream">
                      {pl.countLabel}
                    </span>
                  ) : null}
                </span>
                <span className="mt-2 block text-sm leading-snug text-cream line-clamp-2">{pl.title}</span>
              </Link>
            ))}
          </Rail>
        ) : null}
        {hero ? (
          <section className="mt-8 px-4 md:px-8">
            <p className="mb-3 text-xs tracking-widest text-gold uppercase">लंबी कहानी</p>
            <div className="overflow-hidden rounded-2xl bg-card">
              <div className="relative aspect-video">
                <img src={thumb(hero.id)} alt="" className="h-full w-full object-cover" />
                <div className="scrim-bottom absolute inset-0" />
                <div className="absolute inset-x-0 bottom-0 p-4 md:p-6">
                  <p className="text-xs tracking-widest text-gold uppercase">
                    {getSeries(hero.seriesId)?.title} · {hero.duration}
                  </p>
                  <h2 className="mt-1 max-w-xl font-display text-3xl leading-tight text-cream">
                    {cleanTitle(hero.title)}
                  </h2>
                  <p className="mt-2 max-w-lg text-sm text-cream">
                    {lean && hero.genres.includes(lean.id)
                      ? `आपकी ${GENRE_LABEL[lean.id]} पसंद के मुताबिक`
                      : hero.blurb}
                    {hero.published ? ` · ${hindiWhen(hero.published)}` : ""}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 p-3 md:p-4">
                <PlayLink ep={hero} />
                <SaveLike ep={hero} />
              </div>
            </div>
          </section>
        ) : null}

        <div className="rail-scroll mt-4 flex gap-2 overflow-x-auto px-4 md:px-8">
          <MoodChip active={mood === "all"} onClick={() => setMood("all")} label="सब" />
          {MOODS.map((item) => (
            <MoodChip
              key={item.id}
              active={mood === item.id}
              onClick={() => setMood(mood === item.id ? "all" : item.id)}
              label={item.label}
            />
          ))}
        </div>
        <p className="mt-2 px-4 text-xs text-mute md:px-8">
          {live ? "शॉर्ट्स और प्लेलिस्ट चैनल से ताज़ा · " : "चैनल की सहेजी कहानियाँ · "}
          पसंद बदलते ही शेल्फ़ हिलती है। सिर्फ़ इस फ़ोन पर।
        </p>

        <div className="mt-6">
          <AdSlot slot="home" label="होम बैनर" />
        </div>

        {continueEps.length > 0 ? (
          <Rail title="जारी रखें" hint="आपने खोली थीं">
            {continueEps.map((ep) => (
              <Poster key={ep.id} ep={ep} />
            ))}
          </Rail>
        ) : null}

        <Rail
          title={lean ? `आपके ${GENRE_LABEL[lean.id]} के लिए` : "आपके लिए"}
          hint={mood === "all" ? "देखने और पसंद से बनता है" : GENRE_LABEL[mood]}
        >
          {forYou.map((ep) => (
            <Poster key={ep.id} ep={ep} />
          ))}
        </Rail>

        <Rail title="सबसे ज़्यादा देखी गईं">
          {fresh.map((ep) => (
            <Poster key={ep.id} ep={ep} wide />
          ))}
        </Rail>

        {seriesRails.map(({ item, eps }) => (
          <Rail
            key={item.id}
            title={item.title}
            hint={`${eps.length} कड़ियाँ`}
            href={item.id}
          >
            {eps.map((ep) => (
              <Poster key={ep.id} ep={ep} />
            ))}
          </Rail>
        ))}

        <section className="mt-10 px-4 md:px-8">
          <h2 className="font-display text-xl text-cream">सवाल</h2>
          <dl className="mt-3 flex flex-col gap-4">
            {FAQ.map((item) => (
              <div key={item.q}>
                <dt className="text-sm text-cream">{item.q}</dt>
                <dd className="mt-1 text-sm text-mute">{item.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <SponsorRail />

        <p className="mt-10 px-4 text-sm text-mute md:px-8">
          कहानियाँ{" "}
          <a className="text-gold" href={CHANNEL.url} target="_blank" rel="noreferrer">
            {CHANNEL.handle}
          </a>{" "}
          पर। K DRAMA उन्हें सीरीज़ की तरह सजाता है।
        </p>
      </div>
    </Shell>
  );
}

function MoodChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "h-10 shrink-0 rounded-full px-4 text-sm",
        active ? "bg-cinnabar text-ink" : "bg-panel text-cream",
      )}
    >
      {label}
    </button>
  );
}

function Rail({
  title,
  hint,
  href,
  children,
}: {
  title: string;
  hint?: string;
  href?: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-8">
      <div className="mb-3 flex items-baseline justify-between gap-3 px-4 md:px-8">
        <h2 className="font-display text-xl text-cream">{title}</h2>
        {href ? (
          <Link to="/series/$seriesId" params={{ seriesId: href }} className="text-xs text-gold">
            पूरी सीरीज़
          </Link>
        ) : hint ? (
          <p className="text-xs text-mute">{hint}</p>
        ) : null}
      </div>
      <div className="rail-scroll flex gap-3 overflow-x-auto px-4 pb-1 md:px-8">{children}</div>
    </section>
  );
}
