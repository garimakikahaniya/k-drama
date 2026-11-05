import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { CatalogProvider } from "@/lib/catalog-context";
import { fetchChannelCatalog, EMPTY_SNAPSHOT } from "@/lib/catalog.functions";
import appCss from "../styles.css?url";

const FALLBACK_DESCRIPTION =
  "K DRAMA plays the newest Hindi K-drama style YouTube Shorts from Hindi Kahaniya Sunao first, then playlists and longer kahaniya. Free, no account.";

export const Route = createRootRoute({
  loader: () =>
    Promise.race([
      fetchChannelCatalog().catch(() => EMPTY_SNAPSHOT),
      new Promise<typeof EMPTY_SNAPSHOT>((resolve) => {
        setTimeout(() => resolve(EMPTY_SNAPSHOT), 4000);
      }),
    ]),
  staleTime: 15 * 60 * 1000,
  head: ({ loaderData }) => {
    const lead = loaderData?.ok ? loaderData.shorts[0]?.title : "";
    const description = lead
      ? `K DRAMA plays the newest Hindi K-drama style YouTube Shorts from Hindi Kahaniya Sunao (@HindiKahaniyaSunao) first. Latest short: ${lead}. Playlists and longer kahaniya follow. Free.`
      : FALLBACK_DESCRIPTION;
    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title: "K DRAMA — Hindi K-drama Shorts | hindi kahaniya sunao" },
        { name: "description", content: description },
        { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1" },
        { name: "theme-color", content: "#100e0c" },
      ],
      links: [
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "stylesheet", href: appCss },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,650;1,9..144,500&family=Mukta:wght@400;500;600;700&display=swap",
        },
        { rel: "manifest", href: "/__grok/manifest.webmanifest" },
        { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
        { rel: "alternate", type: "application/rss+xml", title: "K DRAMA shorts", href: "/feed.xml" },
        { rel: "alternate", type: "text/markdown", title: "llms.txt", href: "/llms.txt" },
      ],
    };
  },
  component: function Root() {
    const snapshot = Route.useLoaderData();
    return (
      <html lang="hi" suppressHydrationWarning>
        <head>
          <HeadContent />
        </head>
        <body>
          <PreviewHostBridge />
          <AuthProvider>
            <CatalogProvider snapshot={snapshot}>
              <Outlet />
            </CatalogProvider>
          </AuthProvider>
          <Scripts />
        </body>
      </html>
    );
  },
});