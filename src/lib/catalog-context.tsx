import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  EPISODES,
  SERIES,
  classify,
  type Episode,
  type Series,
} from "@/data/catalog";
import { fetchChannelCatalog, type ChannelSnapshot } from "@/lib/catalog.functions";
import type { LivePlaylist, LiveVideo } from "@/lib/yt-parse";

type CatalogValue = {
  episodes: Episode[];
  series: Series[];
  playlists: LivePlaylist[];
  shorts: Episode[];
  live: boolean;
  origin: string;
};

const EMPTY: CatalogValue = {
  episodes: EPISODES,
  series: SERIES,
  playlists: [],
  shorts: [],
  live: false,
  origin: "",
};

const CatalogContext = createContext<CatalogValue>(EMPTY);

function applyLive(map: Map<string, Episode>, video: LiveVideo, format?: "short", shortIndex?: number) {
  const known = map.get(video.id);
  if (known) {
    known.title = video.title || known.title;
    known.duration = video.duration || known.duration;
    known.published = video.published || known.published;
    if (video.viewsLabel && video.views > 0 && video.views >= known.views * 0.4) {
      known.viewsLabel = video.viewsLabel;
      known.views = video.views;
    }
    if (format === "short") {
      known.format = "short";
      known.shortIndex = shortIndex;
      if (known.seriesId !== "k-drama") {
        const guessed = classify(known.title);
        if (guessed.seriesId === "k-drama") {
          known.seriesId = guessed.seriesId;
          known.genres = guessed.genres;
        }
      }
    }
    return;
  }
  const guessed = classify(video.title);
  const kdrama = guessed.seriesId === "k-drama" || format === "short";
  map.set(video.id, {
    id: video.id,
    title: video.title,
    duration: video.duration,
    viewsLabel: video.viewsLabel,
    views: video.views,
    published: video.published,
    genres: guessed.genres,
    seriesId: guessed.seriesId,
    blurb: kdrama ? "Hindi K-drama style short — Hindi Kahaniya Sunao." : "चैनल पर नई कड़ी।",
    format: format ?? "long",
    shortIndex,
  });
}

function fromSnapshot(snapshot: ChannelSnapshot): CatalogValue {
  if (!snapshot.ok) return { ...EMPTY, origin: snapshot.origin };
  const map = new Map(EPISODES.map((ep) => [ep.id, { ...ep, format: ep.format ?? "long" }]));
  for (const video of snapshot.videos) applyLive(map, video);
  snapshot.shorts.forEach((video, index) => applyLive(map, video, "short", index));
  const episodes = [...map.values()];
  const shorts = episodes
    .filter((ep) => ep.format === "short")
    .sort((a, b) => (a.shortIndex ?? 9999) - (b.shortIndex ?? 9999));
  return {
    episodes,
    series: SERIES,
    playlists: snapshot.playlists,
    shorts,
    live: true,
    origin: snapshot.origin,
  };
}

export function CatalogProvider({
  snapshot,
  children,
}: {
  snapshot: ChannelSnapshot;
  children: ReactNode;
}) {
  const [snap, setSnap] = useState(snapshot);
  useEffect(() => {
    if (snapshot.ok) setSnap(snapshot);
  }, [snapshot]);
  useEffect(() => {
    if (snap.ok && snap.shorts.length > 0) return;
    let gone = false;
    fetchChannelCatalog()
      .then((next) => {
        if (!gone && next.ok) setSnap(next);
      })
      .catch(() => {
        /* saved stories stay */
      });
    return () => {
      gone = true;
    };
  }, [snap.ok, snap.shorts.length]);
  const value = useMemo(() => fromSnapshot(snap), [snap]);
  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog(): CatalogValue {
  return useContext(CatalogContext);
}

export function orderedInSeries(seriesId: string, episodes: Episode[]): Episode[] {
  const preset = SERIES.find((s) => s.id === seriesId)?.episodeIds ?? [];
  const rank = new Map(preset.map((id, index) => [id, index]));
  return episodes
    .filter((ep) => ep.seriesId === seriesId)
    .sort((a, b) => {
      const ar = rank.get(a.id) ?? 1000 + (a.shortIndex ?? 500);
      const br = rank.get(b.id) ?? 1000 + (b.shortIndex ?? 500);
      return ar - br;
    });
}
