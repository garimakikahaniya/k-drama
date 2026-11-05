import { createServerFn } from "@tanstack/react-start";
import { CHANNEL } from "@/data/catalog";
import {
  parseChannelPlaylists,
  parseChannelShorts,
  parseChannelVideos,
  parsePlaylistVideos,
  type LivePlaylist,
  type LiveVideo,
} from "@/lib/yt-parse";

const VIDEOS_URL = `https://www.youtube.com/${CHANNEL.handle}/videos`;
const SHORTS_URL = `https://www.youtube.com/${CHANNEL.handle}/shorts`;
const PLAYLISTS_URL = `https://www.youtube.com/${CHANNEL.handle}/playlists`;
const MAX_AGE_MS = 15 * 60 * 1000;

export type ChannelSnapshot =
  | {
      ok: true;
      origin: string;
      videos: LiveVideo[];
      shorts: LiveVideo[];
      playlists: LivePlaylist[];
    }
  | { ok: false; origin: string; videos: []; shorts: []; playlists: [] };

let memory: { at: number; snap: ChannelSnapshot } | null = null;
const playlistMemory = new Map<string, { at: number; videos: LiveVideo[] }>();
let inflight: Promise<ChannelSnapshot> | null = null;

export const EMPTY_SNAPSHOT: ChannelSnapshot = {
  ok: false,
  origin: "",
  videos: [],
  shorts: [],
  playlists: [],
};

async function originOf(): Promise<string> {
  try {
    const { getRequest } = await import("@tanstack/react-start/server");
    return new URL(getRequest().url).origin;
  } catch {
    return "";
  }
}

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  "Accept-Language": "hi-IN,hi;q=0.9,en;q=0.8",
};

async function pull(url: string): Promise<string | null> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    const res = await fetch(url, { signal: ctrl.signal, headers: HEADERS });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function loadSnapshot(): Promise<ChannelSnapshot> {
  const origin = await originOf();
  if (memory && Date.now() - memory.at < MAX_AGE_MS && memory.snap.ok) {
    return { ...memory.snap, origin: origin || memory.snap.origin };
  }
  if (!inflight) {
    inflight = (async () => {
      try {
        const [videosHtml, shortsHtml, playlistsHtml] = await Promise.all([
          pull(VIDEOS_URL),
          pull(SHORTS_URL),
          pull(PLAYLISTS_URL),
        ]);
        const videos = videosHtml ? parseChannelVideos(videosHtml) : [];
        const shorts = shortsHtml ? parseChannelShorts(shortsHtml) : [];
        const playlists = playlistsHtml ? parseChannelPlaylists(playlistsHtml) : [];
        if (videos.length === 0 && shorts.length === 0) {
          return { ...EMPTY_SNAPSHOT, origin };
        }
        const snap: ChannelSnapshot = { ok: true, origin, videos, shorts, playlists };
        memory = { at: Date.now(), snap };
        return snap;
      } catch {
        return { ...EMPTY_SNAPSHOT, origin };
      } finally {
        inflight = null;
      }
    })();
  }
  return inflight;
}

export const fetchChannelCatalog = createServerFn({ method: "GET" }).handler(
  async (): Promise<ChannelSnapshot> => {
    try {
      return await loadSnapshot();
    } catch {
      return EMPTY_SNAPSHOT;
    }
  },
);

const PLAYLIST_ID = /^[A-Za-z0-9_-]{12,80}$/;

export const fetchPlaylistVideos = createServerFn({ method: "GET" })
  .validator((id: unknown) => (typeof id === "string" ? id : ""))
  .handler(async ({ data: id }): Promise<{ ok: true; videos: LiveVideo[] } | { ok: false }> => {
    if (!PLAYLIST_ID.test(id)) return { ok: false };
    try {
    const cached = playlistMemory.get(id);
    if (cached && Date.now() - cached.at < MAX_AGE_MS) return { ok: true, videos: cached.videos };
    const html = await pull(`https://www.youtube.com/playlist?list=${encodeURIComponent(id)}`);
    if (!html) return { ok: false };
    const videos = parsePlaylistVideos(html);
    if (videos.length === 0) return { ok: false };
    playlistMemory.set(id, { at: Date.now(), videos });
    return { ok: true, videos };
    } catch {
      return { ok: false };
    }
  });
