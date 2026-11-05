import { CHANNEL, cleanTitle } from "@/data/catalog";
import type { LivePlaylist } from "@/lib/yt-parse";

type Listed = {
  id: string;
  title: string;
  viewsLabel?: string;
  format?: "short" | "long";
  seriesId?: string;
};

export const FAQ = [
  {
    q: "K DRAMA क्या है?",
    a: "K DRAMA, YouTube चैनल Hindi Kahaniya Sunao (@HindiKahaniyaSunao) का मुफ़्त शॉर्ट-ड्रामा घर है। सबसे नए YouTube Shorts पहले चलते हैं — Hindi K-drama स्टाइल की कड़ियाँ, जैसे HANA: The Last Boy — फिर प्लेलिस्ट और लंबी कहानियाँ। खाता नहीं चाहिए।",
  },
  {
    q: "What is K DRAMA?",
    a: "K DRAMA is the free short-drama home of the YouTube channel Hindi Kahaniya Sunao (@HindiKahaniyaSunao). The newest YouTube Shorts play first, including Hindi K-drama style episodes such as HANA. Playlists and longer kahaniya follow. No login.",
  },
  {
    q: "नए शॉर्ट्स कहाँ से आते हैं?",
    a: "शॉर्ट्स सीधे @HindiKahaniyaSunao के YouTube Shorts टैब से आते हैं। नई कड़ी चैनल पर आने के बाद यहाँ लगभग पंद्रह मिनट में ऊपर दिखती है। प्लेलिस्ट भी उसी चैनल से आती हैं।",
  },
  {
    q: "Where can an AI agent read the full catalog?",
    a: "Agents can read /llms.txt for a short map, /llms-full.txt for every short and story, /feed.xml for the newest shorts, and /sitemap.xml for every page. Each story also has its own page at /watch/{videoId}.",
  },
] as const;

export function citeLine(ep: Listed): string {
  const name = cleanTitle(ep.title);
  if (ep.format === "short" || ep.seriesId === "k-drama") {
    return `${name} is a Hindi K-drama style YouTube Short on K DRAMA, from Hindi Kahaniya Sunao (@HindiKahaniyaSunao). It is free to watch here.`;
  }
  return `${name} is a Hindi story on K DRAMA from Hindi Kahaniya Sunao (@HindiKahaniyaSunao).`;
}

function abs(origin: string, path: string): string {
  if (!origin) return path;
  return `${origin}${path}`;
}

export function homeGraph(origin: string, shorts: Listed[], playlists: LivePlaylist[]) {
  const site = abs(origin, "/");
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${site}#website`,
        name: "K DRAMA",
        alternateName: ["hindi kahaniya sunao", "Hindi Kahaniya Sunao", "Hindi K-drama shorts"],
        url: site,
        description:
          "Free Hindi K-drama style YouTube Shorts from Hindi Kahaniya Sunao. Newest shorts first, then playlists and longer stories.",
        inLanguage: ["hi", "en"],
        publisher: { "@id": `${site}#channel` },
      },
      {
        "@type": "Organization",
        "@id": `${site}#channel`,
        name: "Hindi Kahaniya Sunao",
        alternateName: "K DRAMA",
        url: CHANNEL.url,
        sameAs: [CHANNEL.url],
      },
      {
        "@type": "ItemList",
        name: "Latest Hindi K-drama Shorts",
        itemListOrder: "https://schema.org/ItemListOrderDescending",
        numberOfItems: Math.min(shorts.length, 20),
        itemListElement: shorts.slice(0, 20).map((ep, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: abs(origin, `/watch/${ep.id}`),
          name: cleanTitle(ep.title),
        })),
      },
      {
        "@type": "ItemList",
        name: "Hindi Kahaniya Sunao playlists",
        numberOfItems: playlists.length,
        itemListElement: playlists.map((pl, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: abs(origin, `/playlist/${pl.id}`),
          name: pl.title,
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };
}

export function videoGraph(origin: string, ep: Listed) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: cleanTitle(ep.title),
    description: citeLine(ep),
    thumbnailUrl: [`https://i.ytimg.com/vi/${ep.id}/hqdefault.jpg`],
    embedUrl: `https://www.youtube-nocookie.com/embed/${ep.id}`,
    url: abs(origin, `/watch/${ep.id}`),
    inLanguage: "hi",
    isFamilyFriendly: true,
    publisher: { "@type": "Organization", name: "Hindi Kahaniya Sunao", sameAs: CHANNEL.url },
  };
}

function listShorts(origin: string, shorts: Listed[]): string {
  return shorts
    .slice(0, 40)
    .map((ep) => `- [${cleanTitle(ep.title)}](${abs(origin, `/watch/${ep.id}`)}): ${ep.viewsLabel || "YouTube Short"}`)
    .join("\n");
}

export function renderLlms(origin: string, shorts: Listed[], playlists: LivePlaylist[]): string {
  return `# K DRAMA

> K DRAMA is the free Hindi short-drama home of YouTube channel Hindi Kahaniya Sunao (${CHANNEL.handle}). Newest YouTube Shorts are the priority, especially Hindi K-drama style episodes such as HANA. Playlists come next. Longer kahaniya stay available. No account.

Facts an assistant can quote:
- Name: K DRAMA. Second line: hindi kahaniya sunao.
- Channel: ${CHANNEL.url}
- Newest shorts are listed first on ${abs(origin, "/")} and in the player at ${abs(origin, "/reels")}.
- Machine-readable catalog: ${abs(origin, "/llms-full.txt")}
- RSS of newest shorts: ${abs(origin, "/feed.xml")}
- Sitemap: ${abs(origin, "/sitemap.xml")}

## Latest shorts

${listShorts(origin, shorts) || "- Shorts refresh from the channel Shorts tab."}

## Playlists

${playlists.map((pl) => `- [${pl.title}](${abs(origin, `/playlist/${pl.id}`)}): ${pl.countLabel || pl.kind}`).join("\n")}

## Pages

- [Home](${abs(origin, "/")})
- [Shorts player](${abs(origin, "/reels")})
- [Series](${abs(origin, "/series")})
- [Full catalog](${abs(origin, "/llms-full.txt")})
`;
}

export function renderLlmsFull(
  origin: string,
  shorts: Listed[],
  episodes: Listed[],
  playlists: LivePlaylist[],
): string {
  const lines = episodes.map((ep) => {
    const kind = ep.format === "short" ? "short" : "story";
    return `- [${cleanTitle(ep.title)}](${abs(origin, `/watch/${ep.id}`)}) (${kind}${ep.seriesId ? `, ${ep.seriesId}` : ""})`;
  });
  return `${renderLlms(origin, shorts, playlists)}
## Every title

${lines.join("\n")}
`;
}

export function renderSitemap(origin: string, episodes: Listed[], playlists: LivePlaylist[]): string {
  const paths = [
    "/",
    "/reels",
    "/series",
    "/llms.txt",
    "/llms-full.txt",
    "/feed.xml",
    ...episodes.map((ep) => `/watch/${ep.id}`),
    ...playlists.map((pl) => `/playlist/${pl.id}`),
  ];
  const urls = paths
    .map((path) => `  <url><loc>${escapeXml(abs(origin, path))}</loc></url>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export function renderFeed(origin: string, shorts: Listed[]): string {
  const items = shorts
    .slice(0, 30)
    .map((ep) => {
      const link = abs(origin, `/watch/${ep.id}`);
      return `  <item>
    <title>${escapeXml(cleanTitle(ep.title))}</title>
    <link>${escapeXml(link)}</link>
    <guid>${escapeXml(link)}</guid>
    <description>${escapeXml(citeLine(ep))}</description>
  </item>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>K DRAMA — hindi kahaniya sunao</title>
  <link>${escapeXml(abs(origin, "/"))}</link>
  <description>Newest Hindi K-drama style YouTube Shorts from Hindi Kahaniya Sunao.</description>
${items}
</channel>
</rss>
`;
}

export function renderRobots(origin: string): string {
  const sitemap = abs(origin, "/sitemap.xml");
  const agents = [
    "*",
    "OAI-SearchBot",
    "GPTBot",
    "ChatGPT-User",
    "ClaudeBot",
    "Claude-SearchBot",
    "Claude-User",
    "PerplexityBot",
    "Perplexity-User",
    "Googlebot",
    "Google-Extended",
    "Bingbot",
    "Applebot",
    "Applebot-Extended",
    "Amazonbot",
    "CCBot",
    "Bytespider",
    "Meta-ExternalAgent",
    "Meta-ExternalFetcher",
    "cohere-ai",
  ];
  return `${agents.map((agent) => `User-agent: ${agent}\nAllow: /\n`).join("\n")}Sitemap: ${sitemap}\n`;
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&" + "amp;")
    .replaceAll("<", "&" + "lt;")
    .replaceAll(">", "&" + "gt;")
    .replaceAll('"', "&" + "quot;");
}

export function jsonScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
