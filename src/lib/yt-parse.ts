import { parseViews } from "@/data/catalog";

export type LiveVideo = {
  id: string;
  title: string;
  duration: string;
  viewsLabel: string;
  published: string;
  views: number;
};

export function extractYtInitialData(html: string): unknown | null {
  const marker = "var ytInitialData = ";
  const start = html.indexOf(marker);
  if (start < 0) return null;
  let i = start + marker.length;
  if (html[i] !== "{") return null;
  let depth = 0;
  let inStr = false;
  let esc = false;
  for (let j = i; j < html.length; j++) {
    const c = html[j];
    if (inStr) {
      if (esc) esc = false;
      else if (c === "\\") esc = true;
      else if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') {
      inStr = true;
      continue;
    }
    if (c === "{") depth += 1;
    else if (c === "}") {
      depth -= 1;
      if (depth === 0) {
        try {
          return JSON.parse(html.slice(i, j + 1)) as unknown;
        } catch {
          return null;
        }
      }
    }
  }
  return null;
}

function durationOf(lock: Record<string, unknown>): string {
  const image = lock.contentImage as
    | { thumbnailViewModel?: { overlays?: unknown[] } }
    | undefined;
  const overlays = image?.thumbnailViewModel?.overlays;
  if (!Array.isArray(overlays)) return "";
  for (const overlay of overlays) {
    const text = (
      overlay as {
        thumbnailBottomOverlayViewModel?: {
          badges?: { thumbnailBadgeViewModel?: { text?: string } }[];
        };
      }
    ).thumbnailBottomOverlayViewModel?.badges?.[0]?.thumbnailBadgeViewModel?.text;
    if (typeof text === "string" && text.trim()) return text.trim();
  }
  return "";
}

function metaParts(lock: Record<string, unknown>): string[] {
  const meta = lock.metadata as
    | {
        lockupMetadataViewModel?: {
          title?: { content?: string };
          metadata?: {
            contentMetadataViewModel?: {
              metadataRows?: { metadataParts?: { text?: { content?: string } }[] }[];
            };
          };
        };
      }
    | undefined;
  const rows = meta?.lockupMetadataViewModel?.metadata?.contentMetadataViewModel?.metadataRows;
  const parts: string[] = [];
  if (!Array.isArray(rows)) return parts;
  for (const row of rows) {
    for (const part of row.metadataParts ?? []) {
      const content = part.text?.content;
      if (typeof content === "string" && content.trim()) parts.push(content.trim());
    }
  }
  return parts;
}

function titleOf(lock: Record<string, unknown>): string {
  const meta = lock.metadata as
    | { lockupMetadataViewModel?: { title?: { content?: string } } }
    | undefined;
  const title = meta?.lockupMetadataViewModel?.title?.content;
  return typeof title === "string" ? title.trim() : "";
}

export function parseChannelVideos(html: string): LiveVideo[] {
  const data = extractYtInitialData(html);
  if (!data) return [];
  const out: LiveVideo[] = [];
  const seen = new Set<string>();

  const walk = (node: unknown) => {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) {
      for (const item of node) walk(item);
      return;
    }
    const rec = node as Record<string, unknown>;
    const lock = rec.lockupViewModel as Record<string, unknown> | undefined;
    if (lock && typeof lock.contentId === "string") {
      const id = lock.contentId;
      const title = titleOf(lock);
      if (/^[A-Za-z0-9_-]{11}$/.test(id) && title && !seen.has(id)) {
        seen.add(id);
        const parts = metaParts(lock).filter((p) => !p.startsWith("@"));
        let viewsLabel = "";
        let published = "";
        for (const part of parts) {
          const lower = part.toLowerCase();
          const looksTime = /ago|hour|day|week|month|year|\d+\s*mo\b|\d+y\b/.test(lower);
          if (!viewsLabel && /\d/.test(part) && !looksTime) {
            viewsLabel = part;
            continue;
          }
          if (!published) published = part;
        }
        out.push({
          id,
          title,
          duration: durationOf(lock),
          viewsLabel,
          published,
          views: parseViews(viewsLabel),
        });
      }
    }
    for (const value of Object.values(rec)) walk(value);
  };

  walk(data);
  return out;
}

export type LivePlaylist = {
  id: string;
  title: string;
  countLabel: string;
  thumb: string;
  kind: "playlist" | "podcast";
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

export function parseChannelShorts(html: string): LiveVideo[] {
  const data = extractYtInitialData(html);
  if (!data) return [];
  const out: LiveVideo[] = [];
  const seen = new Set<string>();

  const walk = (node: unknown) => {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) {
      for (const item of node) walk(item);
      return;
    }
    const rec = node as Record<string, unknown>;
    const lock = asRecord(rec.shortsLockupViewModel);
    if (lock) {
      const entity = typeof lock.entityId === "string" ? lock.entityId : "";
      let id = entity.startsWith("shorts-shelf-item-")
        ? entity.slice("shorts-shelf-item-".length)
        : "";
      if (!/^[A-Za-z0-9_-]{11}$/.test(id)) {
        const reel = asRecord(asRecord(asRecord(lock.onTap)?.innertubeCommand)?.reelWatchEndpoint);
        id = typeof reel?.videoId === "string" ? reel.videoId : "";
      }
      const overlay = asRecord(lock.overlayMetadata);
      const primary = asRecord(overlay?.primaryText);
      const secondary = asRecord(overlay?.secondaryText);
      const title = typeof primary?.content === "string" ? primary.content.trim() : "";
      const viewsLabel = typeof secondary?.content === "string" ? secondary.content.trim() : "";
      if (/^[A-Za-z0-9_-]{11}$/.test(id) && title && !seen.has(id)) {
        seen.add(id);
        out.push({
          id,
          title,
          duration: "",
          viewsLabel,
          published: "",
          views: parseViews(viewsLabel),
        });
      }
    }
    for (const value of Object.values(rec)) walk(value);
  };

  walk(data);
  return out;
}

function badgeAndThumb(lock: Record<string, unknown>): { countLabel: string; thumb: string } {
  const image = asRecord(lock.contentImage);
  const collection = asRecord(image?.collectionThumbnailViewModel);
  const primary = asRecord(collection?.primaryThumbnail);
  const thumbModel = asRecord(primary?.thumbnailViewModel);
  const sources = asRecord(thumbModel?.image)?.sources;
  let thumb = "";
  if (Array.isArray(sources)) {
    const first = asRecord(sources[0]);
    if (typeof first?.url === "string") thumb = first.url;
  }
  let countLabel = "";
  const overlays = thumbModel?.overlays;
  if (Array.isArray(overlays)) {
    for (const overlay of overlays) {
      const list = asRecord(asRecord(overlay)?.thumbnailOverlayBadgeViewModel)?.thumbnailBadges;
      if (!Array.isArray(list)) continue;
      for (const badge of list) {
        const text = asRecord(asRecord(badge)?.thumbnailBadgeViewModel)?.text;
        if (typeof text === "string" && text.trim()) countLabel = text.trim();
      }
    }
  }
  return { countLabel, thumb };
}

export function parseChannelPlaylists(html: string): LivePlaylist[] {
  const data = extractYtInitialData(html);
  if (!data) return [];
  const out: LivePlaylist[] = [];
  const seen = new Set<string>();

  const walk = (node: unknown) => {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) {
      for (const item of node) walk(item);
      return;
    }
    const rec = node as Record<string, unknown>;
    const lock = asRecord(rec.lockupViewModel);
    if (lock && typeof lock.contentId === "string") {
      const kindRaw = typeof lock.contentType === "string" ? lock.contentType : "";
      const kind = kindRaw.includes("PODCAST")
        ? "podcast"
        : kindRaw.includes("PLAYLIST")
          ? "playlist"
          : null;
      const title = titleOf(lock);
      if (kind && title && !seen.has(lock.contentId)) {
        seen.add(lock.contentId);
        const extra = badgeAndThumb(lock);
        out.push({
          id: lock.contentId,
          title,
          countLabel: extra.countLabel,
          thumb: extra.thumb,
          kind,
        });
      }
    }
    for (const value of Object.values(rec)) walk(value);
  };

  walk(data);
  return out;
}

function textOf(node: unknown): string {
  const rec = asRecord(node);
  if (!rec) return "";
  if (typeof rec.simpleText === "string") return rec.simpleText.trim();
  if (Array.isArray(rec.runs)) {
    return rec.runs
      .map((run) => {
        const text = asRecord(run)?.text;
        return typeof text === "string" ? text : "";
      })
      .join("")
      .trim();
  }
  return "";
}

export function parsePlaylistVideos(html: string): LiveVideo[] {
  const data = extractYtInitialData(html);
  if (!data) return [];
  const out: LiveVideo[] = [];
  const seen = new Set<string>();

  const walk = (node: unknown) => {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) {
      for (const item of node) walk(item);
      return;
    }
    const rec = node as Record<string, unknown>;
    const video = asRecord(rec.playlistVideoRenderer);
    if (video && typeof video.videoId === "string" && /^[A-Za-z0-9_-]{11}$/.test(video.videoId)) {
      const title = textOf(video.title);
      if (title && !seen.has(video.videoId)) {
        seen.add(video.videoId);
        const viewsLabel = textOf(video.videoInfo) || textOf(video.shortViewCountText);
        out.push({
          id: video.videoId,
          title,
          duration: textOf(video.lengthText),
          viewsLabel,
          published: "",
          views: parseViews(viewsLabel),
        });
      }
    }
    for (const value of Object.values(rec)) walk(value);
  };

  walk(data);
  if (out.length > 0) return out;
  return parseChannelShorts(html);
}
