import { Link, useRouterState } from "@tanstack/react-router";
import { Bookmark, Clapperboard, Home, RectangleVertical, Search, X } from "lucide-react";
import type { ReactNode } from "react";
import { cleanTitle, GENRE_LABEL } from "@/data/catalog";
import { useCatalog } from "@/lib/catalog-context";
import { cn } from "@/lib/cn";
import { useTaste } from "@/lib/store";
import { strongest } from "@/lib/taste";

const TABS = [
  { to: "/", label: "होम", icon: Home },
  { to: "/reels", label: "शॉर्ट्स", icon: RectangleVertical },
  { to: "/series", label: "सीरीज़", icon: Clapperboard },
  { to: "/library", label: "लाइब्रेरी", icon: Bookmark },
] as const;

function isOn(path: string, to: string) {
  if (to === "/") return path === "/";
  return path === to || path.startsWith(`${to}/`);
}

export function Wordmark({ size = "lg" }: { size?: "lg" | "sm" }) {
  const big = size === "lg";
  return (
    <span className="flex min-w-0 flex-col leading-none">
      <span
        className={cn(
          "font-display tracking-tight text-cream",
          big ? "text-4xl" : "text-xl",
        )}
      >
        K DRAMA
      </span>
      <span
        className={cn(
          "whitespace-nowrap text-gold",
          big ? "mt-1.5 text-xs tracking-wide" : "mt-0.5 text-[10px] tracking-wide",
        )}
      >
        hindi kahaniya sunao
      </span>
    </span>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const query = useTaste((s) => s.query);
  const setQuery = useTaste((s) => s.setQuery);
  const taste = useTaste((s) => s.taste);
  const lean = strongest(taste);
  const { episodes } = useCatalog();
  const q = query.trim().toLowerCase();
  const hits = q
    ? episodes.filter((ep) => ep.title.toLowerCase().includes(q) || cleanTitle(ep.title).toLowerCase().includes(q))
    : [];

  return (
    <div className="min-h-dvh bg-ink text-cream">
      <div className="mx-auto flex min-h-dvh max-w-6xl">
        <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-line px-4 py-6 md:flex">
          <Link to="/" className="px-2">
            <Wordmark />
          </Link>
          <nav className="mt-8 flex flex-col gap-1" aria-label="मुख्य">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const on = isOn(path, tab.to);
              return (
                <Link
                  key={tab.to}
                  to={tab.to}
                  className={cn(
                    "flex h-11 items-center gap-3 rounded-xl px-3 text-sm",
                    on ? "bg-card text-cream" : "text-mute hover:bg-panel hover:text-cream",
                  )}
                >
                  <Icon className={cn("size-4", on && "text-cinnabar")} />
                  {tab.label}
                </Link>
              );
            })}
          </nav>
          <p className="mt-auto px-2 text-xs text-mute">
            झुकाव · {lean ? GENRE_LABEL[lean.id] : "संतुलित"}
          </p>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col pb-24 md:pb-8">
          <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-line/80 bg-ink/90 px-4 py-3 backdrop-blur md:px-8">
            <Link to="/" className="shrink-0 md:hidden">
              <Wordmark size="sm" />
            </Link>
            <form
              role="search"
              className="relative ml-auto w-full max-w-sm"
              onSubmit={(e) => e.preventDefault()}
            >
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-mute" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="कहानी खोजें"
                aria-label="कहानी खोजें"
                className="h-11 w-full rounded-full border border-line bg-panel pr-10 pl-10 text-sm text-cream outline-none placeholder:text-mute focus:border-gold"
              />
              {query ? (
                <button
                  type="button"
                  aria-label="खोज साफ़ करें"
                  onClick={() => setQuery("")}
                  className="absolute top-1/2 right-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-mute"
                >
                  <X className="size-4" />
                </button>
              ) : null}
            </form>
          </header>

          {q ? (
            <div className="px-4 py-4 md:px-8">
              <p className="text-sm text-mute">
                {hits.length} नतीजे · “{query.trim()}”
              </p>
              <ul className="mt-3 flex flex-col">
                {hits.map((ep) => (
                  <li key={ep.id}>
                    <Link
                      to="/watch/$videoId"
                      params={{ videoId: ep.id }}
                      onClick={() => setQuery("")}
                      className="flex h-14 items-center text-sm text-cream"
                    >
                      {cleanTitle(ep.title)}
                    </Link>
                  </li>
                ))}
              </ul>
              {hits.length === 0 ? (
                <p className="mt-6 text-cream">इस नाम की कड़ी अभी कैटलॉग में नहीं।</p>
              ) : null}
            </div>
          ) : (
            <div className="min-w-0">{children}</div>
          )}
        </div>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink/95 backdrop-blur md:hidden"
        aria-label="मुख्य"
      >
        <ul className="mx-auto grid max-w-lg grid-cols-4">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const on = isOn(path, tab.to);
            return (
              <li key={tab.to}>
                <Link
                  to={tab.to}
                  className={cn(
                    "flex h-16 flex-col items-center justify-center gap-1 text-xs",
                    on ? "text-cinnabar" : "text-mute",
                  )}
                >
                  <Icon className="size-5" />
                  {tab.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
