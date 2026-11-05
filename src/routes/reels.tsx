import { Link, createFileRoute } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cleanTitle, getSeries, thumb } from "@/data/catalog";
import { AdSlot } from "@/components/ad-slot";
import { SaveLike, YtFrame } from "@/components/media";
import { Wordmark } from "@/components/shell";
import { useCatalog } from "@/lib/catalog-context";
import { useTaste } from "@/lib/store";
import { rankEpisodes } from "@/lib/taste";

type ReelSearch = { v?: string };

export const Route = createFileRoute("/reels")({
  validateSearch: (search: Record<string, unknown>): ReelSearch => ({
    v: typeof search.v === "string" ? search.v : undefined,
  }),
  component: ReelsPage,
});

function ReelsPage() {
  const { v } = Route.useSearch();
  const { episodes, shorts } = useCatalog();
  const taste = useTaste((s) => s.taste);
  const mood = useTaste((s) => s.mood);
  const recordWatch = useTaste((s) => s.recordWatch);
  const shortKey = shorts.map((ep) => ep.id).join(",");
  const list = useMemo(() => {
    const shortIds = new Set(shorts.map((ep) => ep.id));
    const rest = rankEpisodes(
      episodes.filter((ep) => !shortIds.has(ep.id)),
      taste,
      mood,
    );
    return [...shorts, ...rest];
    // Keep shelf order for this visit once shorts have loaded.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shortKey]);
  const scroller = useRef<HTMLDivElement>(null);
  const jumped = useRef(false);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState<string | null>(null);

  useEffect(() => {
    if (jumped.current || !v || !scroller.current) return;
    const i = list.findIndex((ep) => ep.id === v);
    if (i < 0 || !scroller.current.clientHeight) return;
    jumped.current = true;
    scroller.current.scrollTo({ top: i * scroller.current.clientHeight });
    setIndex(i);
  }, [v, list]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!scroller.current) return;
      const h = scroller.current.clientHeight;
      if (event.key === "ArrowDown") {
        scroller.current.scrollTo({ top: (index + 1) * h, behavior: "smooth" });
      }
      if (event.key === "ArrowUp") {
        scroller.current.scrollTo({ top: Math.max(0, index - 1) * h, behavior: "smooth" });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index]);

  const onScroll = () => {
    const el = scroller.current;
    if (!el || el.clientHeight === 0) return;
    const next = Math.round(el.scrollTop / el.clientHeight);
    if (next !== index) {
      setIndex(next);
      setPlaying(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink text-cream">
      <div className="mx-auto flex h-full max-w-md flex-col">
        <div className="flex shrink-0 items-center justify-between gap-2 px-3 py-2">
          <Link to="/" className="inline-flex min-w-0 items-center gap-1 text-cream">
            <ChevronLeft className="size-4 shrink-0" />
            <Wordmark size="sm" />
          </Link>
          <p className="text-xs tracking-widest text-gold uppercase">रील्स</p>
          <span className="w-16 text-right text-xs text-mute">
            {list.length ? index + 1 : 0}/{list.length}
          </span>
        </div>
        <div ref={scroller} onScroll={onScroll} className="reel-scroller min-h-0 flex-1">
          {list.map((ep, i) => {
            const series = getSeries(ep.seriesId);
            const open = playing === ep.id;
            return (
              <section key={ep.id} className="reel-slide flex flex-col overflow-hidden px-3 pb-3">
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl bg-card">
                  {open ? (
                    <div className="shrink-0">
                      <YtFrame id={ep.id} title={cleanTitle(ep.title)} />
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setPlaying(ep.id);
                        recordWatch(ep.id, ep.genres);
                      }}
                      className="relative block aspect-video w-full shrink-0"
                    >
                      <img src={thumb(ep.id)} alt="" className="h-full w-full object-cover" />
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="flex h-14 min-w-14 items-center justify-center rounded-full bg-cinnabar px-4 text-sm font-semibold text-ink">
                          चलाएँ
                        </span>
                      </span>
                    </button>
                  )}
                  <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4">
                    <p className="text-xs text-gold">{series?.title}</p>
                    <h1 className="mt-1 font-display text-2xl leading-tight text-cream">
                      {cleanTitle(ep.title)}
                    </h1>
                    <p className="mt-2 text-sm text-mute">{ep.blurb}</p>
                    <div className="mt-4">
                      <SaveLike ep={ep} />
                    </div>
                    {i > 0 && i % 5 === 0 ? (
                      <div className="mt-4">
                        <AdSlot slot="reels" label="रील्स ब्रेक" />
                      </div>
                    ) : (
                      <p className="mt-auto pt-4 text-center text-xs text-mute">ऊपर स्वाइप · अगली कहानी</p>
                    )}
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
