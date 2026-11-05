import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { GENRE_LABEL, MOODS } from "@/data/catalog";
import { Poster } from "@/components/media";
import { Shell } from "@/components/shell";
import { useCatalog } from "@/lib/catalog-context";
import { useTaste } from "@/lib/store";
import { strongest } from "@/lib/taste";

export const Route = createFileRoute("/library")({ component: LibraryPage });

function LibraryPage() {
  const { episodes } = useCatalog();
  const taste = useTaste((s) => s.taste);
  const saved = useTaste((s) => s.saved);
  const likes = useTaste((s) => s.likes);
  const history = useTaste((s) => s.history);
  const ads = useTaste((s) => s.ads);
  const setAds = useTaste((s) => s.setAds);
  const addSponsor = useTaste((s) => s.addSponsor);
  const removeSponsor = useTaste((s) => s.removeSponsor);
  const resetTaste = useTaste((s) => s.resetTaste);
  const lean = strongest(taste);

  const pick = (ids: string[]) =>
    ids
      .map((id) => episodes.find((ep) => ep.id === id))
      .filter((ep): ep is NonNullable<typeof ep> => Boolean(ep));

  return (
    <Shell>
      <div className="px-4 py-6 md:px-8">
        <p className="text-xs tracking-widest text-gold uppercase">इस फ़ोन पर</p>
        <h1 className="mt-1 font-display text-4xl text-cream">लाइब्रेरी</h1>
        <p className="mt-2 max-w-xl text-sm text-mute">
          खाता नहीं। जो कहानी आप खोलते, पसंद या सहेजते हैं, K DRAMA उसी तरफ झुकता है — सिर्फ़ इस डिवाइस पर।
        </p>

        <section className="mt-6 rounded-2xl bg-card p-4">
          <h2 className="font-display text-xl text-cream">
            झुकाव · {lean ? GENRE_LABEL[lean.id] : "अभी संतुलित"}
          </h2>
          <ul className="mt-4 flex flex-col gap-3">
            {MOODS.map((mood) => (
              <li key={mood.id}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-cream">{mood.label}</span>
                  <span className="text-mute">{taste[mood.id]}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-panel">
                  <div
                    className="h-full rounded-full bg-cinnabar"
                    style={{ width: `${taste[mood.id]}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={resetTaste}
            className="mt-4 h-11 rounded-full border border-line px-4 text-sm text-mute"
          >
            पसंद रीसेट करें
          </button>
        </section>

        <Shelf title="पसंद की हुई" items={pick(likes)} empty="दिल वाली कहानी पर पसंद दबाएँ।" />
        <Shelf title="सहेजी हुई" items={pick(saved)} empty="बाद में देखने के लिए सहेजें।" />
        <Shelf
          title="देखी हुई"
          items={pick(history.map((h) => h.id))}
          empty="एक कड़ी चलते ही यहाँ आ जाएगी।"
        />

        <Studio
          client={ads.client}
          home={ads.slots.home}
          reels={ads.slots.reels}
          player={ads.slots.player}
          preview={ads.preview}
          sponsors={ads.sponsors}
          onClient={(client) => setAds({ client })}
          onSlot={(key, value) => setAds({ slots: { ...ads.slots, [key]: value } })}
          onPreview={(preview) => setAds({ preview })}
          onAdd={addSponsor}
          onRemove={removeSponsor}
        />
      </div>
    </Shell>
  );
}

function Shelf({
  title,
  items,
  empty,
}: {
  title: string;
  items: { id: string }[];
  empty: string;
}) {
  const { episodes } = useCatalog();
  const full = items
    .map((item) => episodes.find((ep) => ep.id === item.id))
    .filter((ep): ep is NonNullable<typeof ep> => Boolean(ep));
  return (
    <section className="mt-8">
      <h2 className="font-display text-xl text-cream">{title}</h2>
      {full.length === 0 ? (
        <p className="mt-2 text-sm text-mute">{empty}</p>
      ) : (
        <div className="rail-scroll mt-3 flex gap-3 overflow-x-auto pb-1">
          {full.map((ep) => (
            <Poster key={ep.id} ep={ep} />
          ))}
        </div>
      )}
    </section>
  );
}

function Studio(props: {
  client: string;
  home: string;
  reels: string;
  player: string;
  preview: boolean;
  sponsors: { id: string; title: string; href: string; note: string }[];
  onClient: (value: string) => void;
  onSlot: (key: "home" | "reels" | "player", value: string) => void;
  onPreview: (value: boolean) => void;
  onAdd: (sponsor: { title: string; href: string; note: string }) => void;
  onRemove: (id: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [href, setHref] = useState("");
  const [note, setNote] = useState("");
  const field =
    "mt-1 h-11 w-full rounded-xl border border-line bg-panel px-3 text-sm text-cream outline-none focus:border-gold";

  return (
    <details className="mt-10 rounded-2xl border border-line bg-panel p-4">
      <summary className="cursor-pointer font-display text-xl text-cream">
        AdSense · बाद के लिए
      </summary>
      <p className="mt-3 text-sm text-mute">
        अभी खाली है। ca-pub और स्लॉट आईडी डालते ही होम, रील्स और प्लेयर पर विज्ञापन जागेंगे।
        प्रायोजित लिंक भी यहीं से। ये सेटिंग इस डिवाइस पर रहती है — Play Store बिल्ड में वही आईडी ऐप
        कॉन्फ़िग में जड़ दी जाती है, ताकि हर दर्शक को दिखे।
      </p>
      <label className="mt-4 block text-sm text-mute">
        AdSense client
        <input
          value={props.client}
          onChange={(e) => props.onClient(e.target.value)}
          placeholder="ca-pub-0000000000000000"
          className={field}
        />
      </label>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        {(
          [
            ["home", "होम स्लॉट", props.home],
            ["reels", "रील्स स्लॉट", props.reels],
            ["player", "प्लेयर स्लॉट", props.player],
          ] as const
        ).map(([key, label, value]) => (
          <label key={key} className="text-sm text-mute">
            {label}
            <input
              value={value}
              onChange={(e) => props.onSlot(key, e.target.value)}
              placeholder="slot id"
              className={field}
            />
          </label>
        ))}
      </div>
      <label className="mt-4 flex h-11 items-center gap-3 text-sm text-cream">
        <input
          type="checkbox"
          checked={props.preview}
          onChange={(e) => props.onPreview(e.target.checked)}
          className="size-4 accent-cinnabar"
        />
        खाली जगहों का पूर्वावलोकन दिखाएँ
      </label>

      <h3 className="mt-6 font-display text-lg text-cream">प्रायोजित लिंक</h3>
      <ul className="mt-2 flex flex-col gap-2">
        {props.sponsors.map((sponsor) => (
          <li key={sponsor.id} className="flex items-center justify-between gap-3 text-sm">
            <span className="text-cream">{sponsor.title}</span>
            <button
              type="button"
              onClick={() => props.onRemove(sponsor.id)}
              className="h-10 rounded-full px-3 text-mute"
            >
              हटाएँ
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-3 grid gap-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="शीर्षक"
          className={field}
        />
        <input
          value={href}
          onChange={(e) => setHref(e.target.value)}
          placeholder="https://…"
          className={field}
        />
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="एक पंक्ति"
          className={field}
        />
        <button
          type="button"
          className="h-11 rounded-full bg-cinnabar text-sm font-semibold text-ink"
          onClick={() => {
            const cleanTitleText = title.trim();
            const cleanHref = href.trim();
            if (!cleanTitleText || !cleanHref) return;
            try {
              const url = new URL(cleanHref);
              if (url.protocol !== "https:" && url.protocol !== "http:") return;
            } catch {
              return;
            }
            props.onAdd({ title: cleanTitleText, href: cleanHref, note: note.trim() });
            setTitle("");
            setHref("");
            setNote("");
          }}
        >
          लिंक जोड़ें
        </button>
      </div>
    </details>
  );
}
