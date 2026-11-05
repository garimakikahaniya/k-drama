import type { Episode, Genre } from "@/data/catalog";

export type Taste = Record<Genre, number>;

export const EMPTY_TASTE: Taste = {
  jangal: 24,
  dil: 24,
  hasya: 24,
  mohabbat: 24,
  udaan: 24,
  dar: 24,
};

const GENRES: Genre[] = ["jangal", "dil", "hasya", "mohabbat", "udaan", "dar"];

export function clampTaste(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

export function bumpTaste(taste: Taste, genres: Genre[], amount: number): Taste {
  const next = { ...taste };
  for (const genre of GENRES) {
    const hit = genres.includes(genre);
    next[genre] = clampTaste(next[genre] + (hit ? amount : -Math.round(amount / 5)));
  }
  return next;
}

export function scoreEpisode(ep: Episode, taste: Taste): number {
  const base =
    ep.genres.reduce((sum, genre) => sum + (taste[genre] ?? 0), 0) /
    Math.max(ep.genres.length, 1);
  const pop = Math.log10(ep.views + 10) * 12;
  return base + pop;
}

export function strongest(taste: Taste): { id: Genre; value: number } | null {
  const entries = GENRES.map((id) => ({ id, value: taste[id] }));
  entries.sort((a, b) => b.value - a.value);
  const top = entries[0];
  const low = entries[entries.length - 1];
  if (!top || !low) return null;
  if (top.value - low.value < 8) return null;
  return top;
}

export function rankEpisodes(list: Episode[], taste: Taste, mood: Genre | "all"): Episode[] {
  const filtered =
    mood === "all" ? list : list.filter((ep) => ep.genres.includes(mood));
  return [...filtered].sort((a, b) => scoreEpisode(b, taste) - scoreEpisode(a, taste));
}
