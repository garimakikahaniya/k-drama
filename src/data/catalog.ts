export type Genre = "jangal" | "dil" | "hasya" | "mohabbat" | "udaan" | "dar";

export type Episode = {
  id: string;
  title: string;
  duration: string;
  viewsLabel: string;
  views: number;
  published: string;
  genres: Genre[];
  seriesId: string;
  blurb: string;
  format?: "short" | "long";
  shortIndex?: number;
};

export type Series = {
  id: string;
  title: string;
  kicker: string;
  logline: string;
  genres: Genre[];
  episodeIds: string[];
};

export const CHANNEL = {
  name: "Hindi Kahaniya Sunao",
  handle: "@HindiKahaniyaSunao",
  url: "https://www.youtube.com/@HindiKahaniyaSunao",
  id: "UCgFR1rOlxsiqx36sr-ziwPQ",
};

export const GENRE_LABEL: Record<Genre, string> = {
  jangal: "जंगल",
  dil: "दिल",
  hasya: "हँसी",
  mohabbat: "मोहब्बत",
  udaan: "उड़ान",
  dar: "रहस्य",
};

export const MOODS: { id: Genre; label: string; line: string }[] = [
  { id: "jangal", label: "जंगल", line: "जानवर, जादू, दोस्त" },
  { id: "dil", label: "दिल", line: "घर, माँ, सच्ची बात" },
  { id: "hasya", label: "हँसी", line: "शरारत और तड़का" },
  { id: "mohabbat", label: "मोहब्बत", line: "दुकानें और ख़्वाब" },
  { id: "udaan", label: "उड़ान", line: "छोटा कदम, बड़ा सपना" },
  { id: "dar", label: "रहस्य", line: "हल्की छाया, बड़ा मोड़" },
];

export const SERIES: Series[] = [
  {
    id: "k-drama",
    title: "K DRAMA",
    kicker: "शॉर्ट्स",
    logline: "Hindi K-drama style shorts — HANA और नई कड़ियाँ, सबसे पहले।",
    genres: ["mohabbat", "dar"],
    episodeIds: [],
  },
  {
    id: "jangal-raj",
    title: "जंगल राज",
    kicker: "सीरीज़",
    logline: "जहाँ चिड़िया रानी है, शेर डांस करता है, और दोस्ती ही असली राजपाट है।",
    genres: ["jangal"],
    episodeIds: [
      "UmM8XJZkw4w",
      "xV9q_HvmSsg",
      "nAsGhcseK58",
      "5ZWbIYAa8go",
      "M_BWNweJIZ8",
      "9fTNpF0HAk8",
      "1CCi6TXmVDg",
      "6p6Zo79e_ME",
      "kouRJnCB7E4",
      "dCSE-rLqrmM",
      "mAFT-vM4BlM",
      "W7hbg0P77wY",
      "F8_87TgrvkE",
      "yjiyB_Q_jew",
    ],
  },
  {
    id: "dil-mohar",
    title: "दिल की मोहर",
    kicker: "सीरीज़",
    logline: "देहरी, बारिश और एक रुपया — वो कहानियाँ जो घर लौटकर चुभती हैं।",
    genres: ["dil"],
    episodeIds: ["A2NuOxWvKvg", "TQ4uGeVpf6Y", "VskX97DrIug", "0gsqA2sc0Yg", "oH2SRjn0KU4"],
  },
  {
    id: "hasya-adda",
    title: "हँसी अड्डा",
    kicker: "सीरीज़",
    logline: "उल्टा चश्मा, जादुई चप्पल, और एक भूत जो लोन वसूलने आया है।",
    genres: ["hasya", "dar"],
    episodeIds: [
      "5gj5dEiXHok",
      "RSlG-B3vjCY",
      "mAMRaTp_Cho",
      "GDLZQLaf4fo",
      "-Az1tQlr5j0",
      "XGwnRBXEVjY",
    ],
  },
  {
    id: "mohabbat-lane",
    title: "मोहब्बत लेन",
    kicker: "सीरीज़",
    logline: "पुरानी दिल्ली की एक दुकान, सपनों की अलमारी, और एक पेड़ जो इच्छा सुनता है।",
    genres: ["mohabbat"],
    episodeIds: ["dBJW_iN4_j0", "AK5NhIAx458", "qjlNqq04fYo"],
  },
  {
    id: "udaan",
    title: "उड़ान",
    kicker: "सीरीज़",
    logline: "नन्ही चींटी और एक नदी — छोटे कदमों की लंबी कहानियाँ।",
    genres: ["udaan"],
    episodeIds: ["saE8zgi0nls", "9_ZVELpxLFI"],
  },
  {
    id: "nayi",
    title: "नई कहानियाँ",
    kicker: "ताज़ा",
    logline: "चैनल पर जो अभी आया है, और किसी पुरानी सीरीज़ में बैठा नहीं।",
    genres: ["dil"],
    episodeIds: [],
  },
];

export const EPISODES: Episode[] = [
  {
    id: "UmM8XJZkw4w",
    title: "अलविदा जंगल है तीन दोस्तों की अनोखी कहानी",
    duration: "6:34",
    viewsLabel: "2.3K",
    views: 2300,
    published: "1y ago",
    genres: ["jangal", "dil"],
    seriesId: "jangal-raj",
    blurb: "तीन दोस्त जंगल को अलविदा कहते हैं।",
  },
  {
    id: "xV9q_HvmSsg",
    title: "छोटा हंसू और जादुई झरना, एक अद्भुत प्यारी कहानी",
    duration: "6:07",
    viewsLabel: "9.5K",
    views: 9500,
    published: "1y ago",
    genres: ["jangal"],
    seriesId: "jangal-raj",
    blurb: "एक छोटा हंसू, एक झरना जो राज़ खोलता है।",
  },
  {
    id: "nAsGhcseK58",
    title: "चिंटू का जादुई सफर | एक छोटा तोता, बड़ा सबक",
    duration: "4:25",
    viewsLabel: "40K",
    views: 40000,
    published: "1y ago",
    genres: ["jangal", "udaan"],
    seriesId: "jangal-raj",
    blurb: "छोटा तोता, लंबा सबक। चैनल की सबसे देखी कड़ी।",
  },
  {
    id: "5ZWbIYAa8go",
    title: "निम्मी बत्तख का जादुई एडवेंचर",
    duration: "2:52",
    viewsLabel: "5.1K",
    views: 5100,
    published: "1y ago",
    genres: ["jangal", "hasya"],
    seriesId: "jangal-raj",
    blurb: "निम्मी बत्तख का नन्हा सा कारनामा।",
  },
  {
    id: "M_BWNweJIZ8",
    title: "नन्ही चिड़िया रानी और हाथी की मस्ती",
    duration: "6:49",
    viewsLabel: "5.1K",
    views: 5100,
    published: "1y ago",
    genres: ["jangal", "hasya"],
    seriesId: "jangal-raj",
    blurb: "चिड़िया रानी और हाथी — जंगल की सबसे असमान जोड़ी।",
  },
  {
    id: "9fTNpF0HAk8",
    title: "डकी का खजाना: मस्ती, हंसी और दोस्ती का जादुई सफर",
    duration: "4:04",
    viewsLabel: "1.5K",
    views: 1500,
    published: "1y ago",
    genres: ["jangal", "hasya"],
    seriesId: "jangal-raj",
    blurb: "खजाना मिला, असली दौलत दोस्ती निकली।",
  },
  {
    id: "1CCi6TXmVDg",
    title: "Cute खरगोश का Independence Day Adventure: Kala Tal को बचाओ",
    duration: "2:33",
    viewsLabel: "379",
    views: 379,
    published: "1y ago",
    genres: ["jangal", "udaan"],
    seriesId: "jangal-raj",
    blurb: "एक खरगोश काला ताल बचाने निकलता है।",
  },
  {
    id: "6p6Zo79e_ME",
    title: "चीकू, गोलू भालू और ट्विंकल का सेब तमाशा",
    duration: "3:55",
    viewsLabel: "350",
    views: 350,
    published: "1y ago",
    genres: ["jangal", "hasya"],
    seriesId: "jangal-raj",
    blurb: "सेब, मदारी, और तीन शैतान दोस्त।",
  },
  {
    id: "kouRJnCB7E4",
    title: "मेंढक और नेवले की दोस्ती",
    duration: "2:08",
    viewsLabel: "378",
    views: 378,
    published: "1y ago",
    genres: ["jangal", "dil"],
    seriesId: "jangal-raj",
    blurb: "जो दोस्त नहीं बन सकते, वही बन जाते हैं।",
  },
  {
    id: "dCSE-rLqrmM",
    title: "छोटा तोता चिंटू की बहादुरी: जंगल बचाने वाली कहानी",
    duration: "5:29",
    viewsLabel: "3.2K",
    views: 3200,
    published: "1y ago",
    genres: ["jangal", "udaan"],
    seriesId: "jangal-raj",
    blurb: "चिंटू अकेले जंगल की तरफ खड़ा होता है।",
  },
  {
    id: "mAFT-vM4BlM",
    title: "जंगल में AI का धमाल: शेर डिस्को डांस करने लगा",
    duration: "5:14",
    viewsLabel: "909",
    views: 909,
    published: "1y ago",
    genres: ["jangal", "hasya"],
    seriesId: "jangal-raj",
    blurb: "शेर का डिस्को, और पाँच ऐसे मोड़ जो होश उड़ा दें।",
  },
  {
    id: "W7hbg0P77wY",
    title: "आदमी और साँप की रहस्यमयी दोस्ती",
    duration: "2:14",
    viewsLabel: "79",
    views: 79,
    published: "1y ago",
    genres: ["jangal", "dar"],
    seriesId: "jangal-raj",
    blurb: "डर और दोस्ती एक ही रस्सी पर।",
  },
  {
    id: "F8_87TgrvkE",
    title: "जंगल की रहस्यमयी चमक",
    duration: "8:45",
    viewsLabel: "272",
    views: 272,
    published: "1y ago",
    genres: ["jangal", "dar"],
    seriesId: "jangal-raj",
    blurb: "पेड़ों के बीच एक चमक, और एक गहरी सीख।",
  },
  {
    id: "yjiyB_Q_jew",
    title: "जादुई सुनहरी चिड़िया: गरीब लड़की vs अमीर का चमत्कार",
    duration: "4:57",
    viewsLabel: "1.3K",
    views: 1300,
    published: "10mo ago",
    genres: ["jangal", "dil"],
    seriesId: "jangal-raj",
    blurb: "सुनहरी चिड़िया गरीब लड़की के आँगन में उतरती है।",
  },
  {
    id: "A2NuOxWvKvg",
    title: "भिखारी से करोड़पति: 1 प्रेरणादायक कहानी",
    duration: "8:21",
    viewsLabel: "1.2K",
    views: 1200,
    published: "1y ago",
    genres: ["dil", "udaan"],
    seriesId: "dil-mohar",
    blurb: "सड़क से महल तक — बिना नारे के।",
  },
  {
    id: "TQ4uGeVpf6Y",
    title: "मैने नौकरी मिली तो माँ-बाप को निकाला",
    duration: "8:05",
    viewsLabel: "1.8K",
    views: 1800,
    published: "1y ago",
    genres: ["dil"],
    seriesId: "dil-mohar",
    blurb: "नौकरी का पहला महीना, घर का सबसे कठिन फ़ैसला।",
  },
  {
    id: "VskX97DrIug",
    title: "प्रेग्नेंट बहन को बारिश में सड़क पर छोड़ा",
    duration: "4:17",
    viewsLabel: "73",
    views: 73,
    published: "9mo ago",
    genres: ["dil"],
    seriesId: "dil-mohar",
    blurb: "बारिश, सड़क, और एक बहन जिसे कोई नहीं थामता।",
  },
  {
    id: "0gsqA2sc0Yg",
    title: "बीमार दादी और 1 रुपया",
    duration: "1:08",
    viewsLabel: "64",
    views: 64,
    published: "9mo ago",
    genres: ["dil"],
    seriesId: "dil-mohar",
    blurb: "एक रुपया, और दादी की दवा।",
  },
  {
    id: "oH2SRjn0KU4",
    title: "गधा नहीं… असली हीरो!",
    duration: "4:44",
    viewsLabel: "30",
    views: 30,
    published: "8mo ago",
    genres: ["dil", "udaan"],
    seriesId: "dil-mohar",
    blurb: "जिसे सब गधा कहते हैं, वही मौके पर खड़ा रहता है।",
  },
  {
    id: "5gj5dEiXHok",
    title: "भूत की EMI | मरा हुआ आदमी लोन चुकवाने आया",
    duration: "5:47",
    viewsLabel: "2K",
    views: 2000,
    published: "1y ago",
    genres: ["hasya", "dar"],
    seriesId: "hasya-adda",
    blurb: "क़िस्त बाकी थी, तो भूत खुद इकट्ठा करने आ गया।",
  },
  {
    id: "RSlG-B3vjCY",
    title: "भालू अंकल का उल्टा चश्मा",
    duration: "7:19",
    viewsLabel: "261",
    views: 261,
    published: "1y ago",
    genres: ["hasya", "jangal"],
    seriesId: "hasya-adda",
    blurb: "चश्मा उल्टा, दुनिया सीधी।",
  },
  {
    id: "mAMRaTp_Cho",
    title: "गधा जो बंदर बनना चाहता था",
    duration: "7:14",
    viewsLabel: "7.2K",
    views: 7200,
    published: "1y ago",
    genres: ["hasya", "dil"],
    seriesId: "hasya-adda",
    blurb: "किसी और की खाल में अपनी ज़िंदगी।",
  },
  {
    id: "GDLZQLaf4fo",
    title: "पप्पू का लाल टमाटर और Naughty Monkey",
    duration: "7:02",
    viewsLabel: "4.6K",
    views: 4600,
    published: "1y ago",
    genres: ["hasya", "jangal"],
    seriesId: "hasya-adda",
    blurb: "एक टमाटर, एक शरारती बंदर।",
  },
  {
    id: "-Az1tQlr5j0",
    title: "टुंडू की जादुई चप्पल | हँसी का तड़का",
    duration: "6:50",
    viewsLabel: "372",
    views: 372,
    published: "1y ago",
    genres: ["hasya"],
    seriesId: "hasya-adda",
    blurb: "चप्पल चली, टुंडू पीछे-पीछे।",
  },
  {
    id: "XGwnRBXEVjY",
    title: "गोपाल की गजब की गलती",
    duration: "6:55",
    viewsLabel: "183",
    views: 183,
    published: "1y ago",
    genres: ["hasya", "dil"],
    seriesId: "hasya-adda",
    blurb: "गलती ऐसी कि हँसी भी रुक जाए, सीख भी रह जाए।",
  },
  {
    id: "dBJW_iN4_j0",
    title: "जादुई पेड़ : क्या आपकी इच्छा पूरी होगी?",
    duration: "5:33",
    viewsLabel: "8K",
    views: 8000,
    published: "1y ago",
    genres: ["mohabbat", "dar"],
    seriesId: "mohabbat-lane",
    blurb: "पेड़ सुनता है। माँगने से पहले सोचो।",
  },
  {
    id: "AK5NhIAx458",
    title: "ख़्वाबों की दुकान: सपनों की सच्चाई",
    duration: "4:25",
    viewsLabel: "2.3K",
    views: 2300,
    published: "1y ago",
    genres: ["mohabbat", "udaan"],
    seriesId: "mohabbat-lane",
    blurb: "सपने बिकते हैं — पर असली वाला बेचने वाला नहीं देता।",
  },
  {
    id: "qjlNqq04fYo",
    title: "पुरानी दिल्ली का रहस्य: मोहब्बत की दुकान",
    duration: "4:24",
    viewsLabel: "393",
    views: 393,
    published: "1y ago",
    genres: ["mohabbat", "dar"],
    seriesId: "mohabbat-lane",
    blurb: "गली के आख़िर में एक दुकान, जहाँ दिल तौला जाता है।",
  },
  {
    id: "saE8zgi0nls",
    title: "नन्ही चींटी का बड़ा सपना: पहाड़ चढ़ने की जादुई कहानी",
    duration: "12:50",
    viewsLabel: "6.3K",
    views: 6300,
    published: "1y ago",
    genres: ["udaan"],
    seriesId: "udaan",
    blurb: "पहाड़ बड़ा था। चींटी छोटी थी। बस इतना ही फ़र्क था।",
  },
  {
    id: "9_ZVELpxLFI",
    title: "नदी की खोज: सुमेधा की प्रेरक कहानी",
    duration: "8:00",
    viewsLabel: "2.1K",
    views: 2100,
    published: "1y ago",
    genres: ["udaan", "dil"],
    seriesId: "udaan",
    blurb: "सुमेधा नदी ढूँढती है, और अपना रास्ता भी।",
  },
];

export function thumb(id: string): string {
  return `https://i.ytimg.com/vi/${encodeURIComponent(id)}/hqdefault.jpg`;
}

export function shortThumb(id: string): string {
  return `https://i.ytimg.com/vi/${encodeURIComponent(id)}/frame0.jpg`;
}

export function cleanTitle(title: string): string {
  const main = title.split("|")[0] ?? title;
  return main
    .replace(/\p{Extended_Pictographic}/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function hindiWhen(published: string): string {
  const p = published.toLowerCase();
  const num = p.match(/(\d+)/)?.[1] ?? "";
  if (p.includes("hour")) return num ? `${num} घंटे पहले` : "अभी";
  if (p.includes("day")) return num ? `${num} दिन पहले` : published;
  if (p.includes("week")) return num ? `${num} हफ़्ते पहले` : published;
  if (p.includes("month") || /\d+\s*mo\b/.test(p) || p.includes("mo ago")) {
    return num ? `${num} महीने पहले` : published;
  }
  if (p.includes("year") || /\d+\s*y\b/.test(p) || p.includes("y ago")) {
    return num ? `${num} साल पहले` : published;
  }
  return published;
}

export function parseViews(label: string): number {
  const t = label.replace(/\u00a0/g, " ").replace(/,/g, "").trim();
  const lower = t.toLowerCase();
  const match = lower.match(/([\d.]+)/);
  if (!match) return 0;
  const n = Number.parseFloat(match[1] ?? "");
  if (!Number.isFinite(n)) return 0;
  if (/हज़ार|हजार|हज़ार|thousand/.test(lower) || /[\d.]\s*k\b/i.test(t)) {
    return Math.round(n * 1000);
  }
  if (/लाख|lakh/.test(lower)) return Math.round(n * 100_000);
  if (/करोड़|crore/.test(lower)) return Math.round(n * 10_000_000);
  if (/मिलियन|million/.test(lower) || /[\d.]\s*m\b/i.test(t)) return Math.round(n * 1_000_000);
  if (/[\d.]\s*b\b/i.test(t)) return Math.round(n * 1_000_000_000);
  return Math.round(n);
}

export function classify(title: string): { seriesId: string; genres: Genre[] } {
  const t = title.toLowerCase();
  const has = (...words: string[]) => words.some((w) => t.includes(w.toLowerCase()));
  if (has("k-drama", "kdrama", "hana", "आखिरी लड़क", "last boy")) {
    return { seriesId: "k-drama", genres: ["mohabbat", "dar"] };
  }
  const genres: Genre[] = [];
  if (
    has(
      "जंगल",
      "तोता",
      "चिड़िया",
      "भालू",
      "बंदर",
      "खरगोश",
      "बत्तख",
      "साँप",
      "सांप",
      "शेर",
      "हाथी",
      "मेंढक",
      "चींटी",
      "हंसू",
      "डकी",
      "jungle",
      "animal",
    )
  ) {
    genres.push("jangal");
  }
  if (has("हँस", "मज़े", "मजे", "शरारत", "कॉमेडी", "comedy", "funny", "मस्ती", "तड़का")) {
    genres.push("hasya");
  }
  if (has("भूत", "डराव", "horror", "प्रेत", "रहस्य")) genres.push("dar");
  if (has("मोहब्बत", "प्यार", "love", "ख़्वाब", "ख्वाब", "सपन", "दिल्ली")) genres.push("mohabbat");
  if (has("प्रेरणा", "प्रेरक", "motivational", "inspirational", "मेहनत", "सपना")) {
    genres.push("udaan");
  }
  if (has("माँ", "मां", "दादी", "दिल", "भिखारी", "गरीब", "नैतिक", "moral", "बहन", "भावुक")) {
    genres.push("dil");
  }
  if (genres.length === 0) genres.push("dil");

  let seriesId = "dil-mohar";
  if (genres.includes("jangal")) seriesId = "jangal-raj";
  else if (genres.includes("mohabbat")) seriesId = "mohabbat-lane";
  else if (genres.includes("hasya") || (genres.includes("dar") && genres.includes("hasya"))) {
    seriesId = "hasya-adda";
  } else if (genres.includes("dar")) seriesId = "hasya-adda";
  else if (genres.includes("udaan") && !genres.includes("dil")) seriesId = "udaan";

  return { seriesId, genres: genres.slice(0, 3) };
}

export function getSeries(id: string): Series | undefined {
  return SERIES.find((s) => s.id === id);
}

export function episodeNumber(ep: Episode, all: Episode[]): number {
  const preset = getSeries(ep.seriesId)?.episodeIds ?? [];
  const idx = preset.indexOf(ep.id);
  if (idx >= 0) return idx + 1;
  const mine = all.filter((e) => e.seriesId === ep.seriesId);
  const rank = new Map(preset.map((id, i) => [id, i]));
  const sorted = [...mine].sort(
    (a, b) => (rank.get(a.id) ?? 1000) - (rank.get(b.id) ?? 1000),
  );
  const found = sorted.findIndex((e) => e.id === ep.id);
  return found >= 0 ? found + 1 : 1;
}
