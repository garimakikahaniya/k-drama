import { useEffect } from "react";
import { monetization } from "@/data/monetization";
import { useTaste, type Sponsor } from "@/lib/store";

type SlotName = "home" | "reels" | "player";

function safeHttp(href: string): string {
  try {
    const url = new URL(href);
    if (url.protocol === "https:" || url.protocol === "http:") return url.toString();
  } catch {
    /* ignore */
  }
  return "";
}

export function useSponsors(): { title: string; href: string; note: string }[] {
  const local = useTaste((s) => s.ads.sponsors);
  const baked = monetization.sponsors.filter((s) => safeHttp(s.href));
  const extra = local
    .map((s) => ({ title: s.title, href: safeHttp(s.href), note: s.note }))
    .filter((s) => s.href && s.title);
  return [...baked, ...extra].slice(0, 3);
}

export function AdSlot({ slot, label }: { slot: SlotName; label: string }) {
  const ads = useTaste((s) => s.ads);
  const client = monetization.adsenseClient || ads.client.trim();
  const slotId = monetization.slots[slot] || ads.slots[slot].trim();
  const live = Boolean(client && slotId);

  useEffect(() => {
    if (!live) return;
    const scriptId = "sunao-adsense";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.async = true;
      script.crossOrigin = "anonymous";
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`;
      document.head.appendChild(script);
    }
    try {
      const w = window as Window & { adsbygoogle?: Record<string, unknown>[] };
      w.adsbygoogle = w.adsbygoogle || [];
      w.adsbygoogle.push({});
    } catch {
      /* ad script not ready */
    }
  }, [live, client, slotId]);

  if (live) {
    return (
      <div className="px-4 md:px-8">
        <ins
          className="adsbygoogle mx-auto block min-h-16 w-full overflow-hidden"
          data-ad-client={client}
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  if (!ads.preview) return null;

  return (
    <div className="px-4 md:px-8">
      <div className="flex h-16 items-center justify-center rounded-2xl border border-dashed border-line bg-panel text-sm text-mute">
        AdSense · {label}
      </div>
    </div>
  );
}

export function SponsorRail() {
  const sponsors = useSponsors();
  if (sponsors.length === 0) return null;
  return (
    <section className="mt-8">
      <div className="mb-3 px-4 md:px-8">
        <h2 className="font-display text-xl text-cream">प्रायोजित</h2>
      </div>
      <div className="rail-scroll flex gap-3 overflow-x-auto px-4 pb-1 md:px-8">
        {sponsors.map((sponsor) => (
          <SponsorCard key={sponsor.href + sponsor.title} sponsor={sponsor} />
        ))}
      </div>
    </section>
  );
}

function SponsorCard({ sponsor }: { sponsor: Pick<Sponsor, "title" | "href" | "note"> }) {
  return (
    <a
      href={sponsor.href}
      target="_blank"
      rel="noreferrer sponsored"
      className="flex w-64 shrink-0 flex-col justify-between rounded-2xl border border-line bg-card p-4"
    >
      <span className="text-xs tracking-wide text-gold">प्रायोजित लिंक</span>
      <span className="mt-2 font-display text-lg leading-snug text-cream">{sponsor.title}</span>
      {sponsor.note ? <span className="mt-2 text-sm text-mute">{sponsor.note}</span> : null}
    </a>
  );
}
