import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Genre } from "@/data/catalog";
import { EMPTY_TASTE, bumpTaste, type Taste } from "@/lib/taste";

export type Sponsor = { id: string; title: string; href: string; note: string };

export type AdSettings = {
  client: string;
  slots: { home: string; reels: string; player: string };
  preview: boolean;
  sponsors: Sponsor[];
};

type HistoryItem = { id: string; lastAt: number; opens: number };

type TasteState = {
  taste: Taste;
  mood: Genre | "all";
  history: HistoryItem[];
  saved: string[];
  likes: string[];
  ads: AdSettings;
  query: string;
  setQuery: (query: string) => void;
  setMood: (mood: Genre | "all") => void;
  recordWatch: (id: string, genres: Genre[]) => void;
  toggleSaved: (id: string, genres: Genre[]) => void;
  toggleLike: (id: string, genres: Genre[]) => void;
  setAds: (patch: Partial<AdSettings>) => void;
  addSponsor: (sponsor: Omit<Sponsor, "id">) => void;
  removeSponsor: (id: string) => void;
  resetTaste: () => void;
};

const emptyAds = (): AdSettings => ({
  client: "",
  slots: { home: "", reels: "", player: "" },
  preview: false,
  sponsors: [],
});

export const useTaste = create<TasteState>()(
  persist(
    (set) => ({
      taste: EMPTY_TASTE,
      mood: "all",
      history: [],
      saved: [],
      likes: [],
      ads: emptyAds(),
      query: "",
      setQuery: (query) => set({ query }),
      setMood: (mood) =>
        set((s) => ({
          mood,
          taste: mood === "all" ? s.taste : bumpTaste(s.taste, [mood], 8),
        })),
      recordWatch: (id, genres) =>
        set((s) => {
          const prev = s.history.find((item) => item.id === id);
          if (prev && Date.now() - prev.lastAt < 2000) return s;
          const history = [
            { id, lastAt: Date.now(), opens: (prev?.opens ?? 0) + 1 },
            ...s.history.filter((item) => item.id !== id),
          ].slice(0, 40);
          return { history, taste: bumpTaste(s.taste, genres, 8) };
        }),
      toggleSaved: (id, genres) =>
        set((s) => {
          const has = s.saved.includes(id);
          return {
            saved: has ? s.saved.filter((x) => x !== id) : [id, ...s.saved],
            taste: has ? s.taste : bumpTaste(s.taste, genres, 6),
          };
        }),
      toggleLike: (id, genres) =>
        set((s) => {
          const has = s.likes.includes(id);
          return {
            likes: has ? s.likes.filter((x) => x !== id) : [id, ...s.likes],
            taste: has ? s.taste : bumpTaste(s.taste, genres, 12),
          };
        }),
      setAds: (patch) => set((s) => ({ ads: { ...s.ads, ...patch, slots: { ...s.ads.slots, ...patch.slots } } })),
      addSponsor: (sponsor) =>
        set((s) => {
          if (s.ads.sponsors.length >= 3) return s;
          return {
            ads: {
              ...s.ads,
              sponsors: [...s.ads.sponsors, { ...sponsor, id: crypto.randomUUID() }],
            },
          };
        }),
      removeSponsor: (id) =>
        set((s) => ({
          ads: { ...s.ads, sponsors: s.ads.sponsors.filter((item) => item.id !== id) },
        })),
      resetTaste: () => set({ taste: EMPTY_TASTE, mood: "all", history: [], likes: [], saved: [] }),
    }),
    {
      name: "sunao-taste-v1",
      partialize: (s) => ({
        taste: s.taste,
        mood: s.mood,
        history: s.history,
        saved: s.saved,
        likes: s.likes,
        ads: s.ads,
      }),
    },
  ),
);
