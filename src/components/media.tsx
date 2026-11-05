import { Link } from "@tanstack/react-router";
import { Bookmark, Heart, Play } from "lucide-react";
import {
  GENRE_LABEL,
  cleanTitle,
  episodeNumber,
  hindiWhen,
  shortThumb,
  thumb,
  type Episode,
} from "@/data/catalog";
import { useCatalog } from "@/lib/catalog-context";
import { cn } from "@/lib/cn";
import { useTaste } from "@/lib/store";

export function Poster({
  ep,
  wide = false,
}: {
  ep: Episode;
  wide?: boolean;
}) {
  const { episodes } = useCatalog();
  const n = episodeNumber(ep, episodes);
  return (
    <Link
      to="/watch/$videoId"
      params={{ videoId: ep.id }}
      className={cn("group block shrink-0", wide ? "w-44" : "w-36")}
    >
      <span className="poster-frame relative block overflow-hidden rounded-2xl bg-card">
        <img
          src={thumb(ep.id)}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover motion-safe:transition motion-safe:duration-200 motion-safe:group-hover:scale-105"
        />
        <span className="absolute top-2 left-2 rounded-md bg-ink/80 px-1.5 py-0.5 text-xs text-gold">
          EP {String(n).padStart(2, "0")}
        </span>
        <span className="absolute right-2 bottom-2 rounded-md bg-ink/80 px-1.5 py-0.5 text-xs text-cream">
          {ep.duration}
        </span>
      </span>
      <span className="mt-2 block text-sm leading-snug text-cream line-clamp-2">
        {cleanTitle(ep.title)}
      </span>
      <span className="mt-1 block text-xs text-mute">
        {ep.genres.map((g) => GENRE_LABEL[g]).slice(0, 2).join(" · ")}
      </span>
    </Link>
  );
}

export function ShortCard({ ep, featured = false }: { ep: Episode; featured?: boolean }) {
  return (
    <Link
      to="/reels"
      search={{ v: ep.id }}
      className={cn("group block shrink-0", featured ? "w-40" : "w-32")}
    >
      <span className="relative block aspect-[9/16] overflow-hidden rounded-2xl bg-card">
        <img
          src={shortThumb(ep.id)}
          alt=""
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src = thumb(ep.id);
          }}
          className="h-full w-full object-cover motion-safe:transition motion-safe:duration-200 motion-safe:group-hover:scale-105"
        />
        <span className="absolute top-2 left-2 rounded-md bg-ink/80 px-1.5 py-0.5 text-xs text-gold">
          शॉर्ट
        </span>
      </span>
      <span className="mt-2 block text-sm leading-snug text-cream line-clamp-2">
        {cleanTitle(ep.title)}
      </span>
      {ep.viewsLabel ? <span className="mt-1 block text-xs text-mute">{ep.viewsLabel}</span> : null}
    </Link>
  );
}

export function EpisodeRow({ ep }: { ep: Episode }) {
  const { episodes } = useCatalog();
  const n = episodeNumber(ep, episodes);
  return (
    <Link
      to="/watch/$videoId"
      params={{ videoId: ep.id }}
      className="flex items-center gap-3 rounded-2xl px-2 py-2 hover:bg-panel"
    >
      <span className="w-8 shrink-0 font-display text-lg text-gold">
        {String(n).padStart(2, "0")}
      </span>
      <span className="relative h-16 w-28 shrink-0 overflow-hidden rounded-xl bg-card">
        <img src={thumb(ep.id)} alt="" className="h-full w-full object-cover" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm leading-snug text-cream line-clamp-2">
          {cleanTitle(ep.title)}
        </span>
        <span className="mt-1 block text-xs text-mute">
          {ep.duration}
          {ep.published ? ` · ${hindiWhen(ep.published)}` : ""}
        </span>
      </span>
    </Link>
  );
}

export function YtFrame({
  id,
  title,
  portrait = false,
}: {
  id: string;
  title: string;
  portrait?: boolean;
}) {
  const src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?rel=0&modestbranding=1&playsinline=1&autoplay=1`;
  return (
    <div
      className={
        portrait
          ? "mx-auto aspect-[9/16] w-full max-w-sm overflow-hidden bg-ink"
          : "aspect-video w-full overflow-hidden bg-ink"
      }
    >
      <iframe
        className="h-full w-full"
        src={src}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}

export function SaveLike({ ep, light = false }: { ep: Episode; light?: boolean }) {
  const saved = useTaste((s) => s.saved.includes(ep.id));
  const liked = useTaste((s) => s.likes.includes(ep.id));
  const toggleSaved = useTaste((s) => s.toggleSaved);
  const toggleLike = useTaste((s) => s.toggleLike);
  const btn = light
    ? "border border-line bg-ink/70 text-cream"
    : "border border-line bg-panel text-cream";
  return (
    <div className="flex gap-2">
      <button
        type="button"
        aria-pressed={liked}
        onClick={() => toggleLike(ep.id, ep.genres)}
        className={cn("inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm", btn)}
      >
        <Heart className={cn("size-4", liked && "fill-cinnabar text-cinnabar")} />
        {liked ? "पसंद" : "पसंद करें"}
      </button>
      <button
        type="button"
        aria-pressed={saved}
        onClick={() => toggleSaved(ep.id, ep.genres)}
        className={cn("inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm", btn)}
      >
        <Bookmark className={cn("size-4", saved && "fill-gold text-gold")} />
        {saved ? "सहेजी" : "सहेजें"}
      </button>
    </div>
  );
}

export function PlayLink({
  ep,
  label = "देखें",
}: {
  ep: Episode;
  label?: string;
}) {
  return (
    <Link
      to="/watch/$videoId"
      params={{ videoId: ep.id }}
      className="inline-flex h-11 items-center gap-2 rounded-full bg-cinnabar px-5 text-sm font-semibold text-ink"
    >
      <Play className="size-4 fill-ink" />
      {label}
    </Link>
  );
}
