// 店舗LPの検索エンジン・AI向けの出力（JSON-LD / robots.txt / sitemap.xml / llms.txt）をまとめたもの。
// 方針: オーナーが入力した情報だけを使う。推測で値を補わない。読み取れない値は出さない。

export const STORE_LANGS = ['ja', 'en', 'zh-tw', 'ko'] as const;
export type StoreLang = (typeof STORE_LANGS)[number];

const STORE_DOMAIN = 'global-reaches.com';

// フェーズ1: 本文の静的HTML出力と JSON-LD・robots・sitemap・llms.txt を有効にする店舗（サブドメイン）。
// フェーズ2で全店舗に広げるときは、ここを外す。
export const AI_SEO_SUBDOMAINS = new Set<string>(['mvp']);
export const isAiSeoEnabled = (subdomain: string) => AI_SEO_SUBDOMAINS.has(subdomain);

export const storeOrigin = (subdomain: string) => `https://${subdomain}.${STORE_DOMAIN}`;
export const langPath = (lang: string) => (lang === 'ja' ? '/' : `/${lang}/`);
export const pageUrl = (subdomain: string, lang: string) => `${storeOrigin(subdomain)}${langPath(lang)}`;

// hreflang 用の絶対URL一覧（Google は完全なURLを求める）
export function alternateLinksFor(subdomain: string) {
  return STORE_LANGS.map((lang) => ({ lang, href: pageUrl(subdomain, lang) }));
}

// 多言語フィールドから指定言語の文字列を取り出す（ページの meta と同じ優先順位）
export function localText(field: any, lang: string): string {
  if (field === null || field === undefined) return '';
  if (typeof field === 'string') return field.trim();
  if (typeof field === 'number') return String(field);
  if (typeof field === 'object' && !Array.isArray(field)) {
    const v = field[lang] || field['en'] || field['ja'] || '';
    return typeof v === 'string' ? v.trim() : '';
  }
  return '';
}

const oneLine = (s: string) => s.replace(/\s*\n\s*/g, ' ').trim();

const isHttpUrl = (v: any): v is string => {
  if (typeof v !== 'string') return false;
  try {
    const u = new URL(v);
    return u.protocol === 'https:' || u.protocol === 'http:';
  } catch {
    return false;
  }
};

const imageUrl = (v: any): string | null => {
  if (isHttpUrl(v)) return v;
  if (v && typeof v === 'object' && isHttpUrl(v.url)) return v.url;
  return null;
};

export function storeName(pageData: any, lang: string): string {
  return oneLine(localText(pageData?.header?.logo?.text, lang));
}

export function storeDescription(pageData: any, lang: string): string {
  const heroDesc = localText(pageData?.hero?.subtitle, lang);
  const aboutDesc = localText(pageData?.about?.features?.[0]?.description, lang);
  return oneLine(`${heroDesc ? heroDesc + ' ' : ''}${aboutDesc}`);
}

// ---- 営業時間の読み取り（読み取れたときだけ使う） ----

const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DAY_PATTERNS: [RegExp, string][] = [
  [/月曜?日?|\bmon(day)?\b/i, 'Monday'],
  [/火曜?日?|\btue(s|sday)?\b/i, 'Tuesday'],
  [/水曜?日?|\bwed(nesday)?\b/i, 'Wednesday'],
  [/木曜?日?|\bthu(rs|rsday)?\b/i, 'Thursday'],
  [/金曜?日?|\bfri(day)?\b/i, 'Friday'],
  [/土曜?日?|\bsat(urday)?\b/i, 'Saturday'],
  [/日曜日?|\bsun(day)?\b/i, 'Sunday'],
];

// 文字列の中の曜日を、出てきた順に返す
function findDays(text: string): string[] {
  const found: { day: string; at: number }[] = [];
  let rest = text;
  // 「日曜」の「日」が「月曜日」の「日」と混同されないよう、長い表記から順に取り出す
  const ordered = [...DAY_PATTERNS].sort((a, b) => (a[1] === 'Sunday' ? -1 : b[1] === 'Sunday' ? 1 : 0));
  for (const [re, day] of ordered) {
    const m = rest.match(re);
    if (m && m.index !== undefined) {
      found.push({ day, at: m.index });
      rest = rest.slice(0, m.index) + ' '.repeat(m[0].length) + rest.slice(m.index + m[0].length);
    }
  }
  return found.sort((a, b) => a.at - b.at).map((f) => f.day);
}

// 「月曜日 - 日曜日」「毎日」「月〜金」などを曜日の一覧にする。読み取れなければ null
function parseOpenDays(text: string): string[] | null {
  const t = text.trim();
  if (!t) return null;
  if (/毎日|年中無休|daily|every ?day/i.test(t)) return [...DAY_ORDER];
  const days = findDays(t);
  if (days.length === 2 && /[-‐－–—~〜～]/.test(t)) {
    const a = DAY_ORDER.indexOf(days[0]);
    const b = DAY_ORDER.indexOf(days[1]);
    const out: string[] = [];
    for (let i = a; ; i = (i + 1) % 7) {
      out.push(DAY_ORDER[i]);
      if (i === b) break;
    }
    return out;
  }
  if (days.length >= 1 && /^[\s月火水木金土日曜・、,／/]+$/.test(t)) return days;
  return null;
}

// 定休日の文字列から、はっきり書かれた曜日だけを返す（「不定休」などは空）
function parseClosedDays(text: string): string[] {
  const t = text.replace(/定休日[:：]?/, '').trim();
  if (!t || /不定休|なし|無休/.test(t)) return [];
  // 「第2水曜」「祝日」のような条件付きは、毎週の休みとは言えないので扱わない
  if (/第|祝|隔週|月末|月初/.test(t)) return [];
  return findDays(t);
}

const TIME_RANGE = /(\d{1,2})[:：](\d{2})\s*[-‐－–—~〜～]\s*(\d{1,2})[:：](\d{2})/g;

function parseTimeRanges(text: string): { opens: string; closes: string }[] {
  const out: { opens: string; closes: string }[] = [];
  for (const m of text.matchAll(TIME_RANGE)) {
    const pad = (h: string, mm: string) => `${h.padStart(2, '0')}:${mm}`;
    const [h1, m1, h2, m2] = [m[1], m[2], m[3], m[4]].map(Number);
    // 「25:00」のような表記は schema.org の時刻として正しくないので、読み取りをやめる
    if (h1 > 24 || h2 > 24 || m1 > 59 || m2 > 59) return [];
    out.push({ opens: pad(m[1], m[2]), closes: pad(m[3], m[4]) });
  }
  return out;
}

export function openingHoursSpecification(pageData: any) {
  const bh = pageData?.footer?.businessHours;
  if (!bh) return null;
  // 曜日・時刻は日本語の入力（原文）から読む。翻訳文は使わない
  const days = parseOpenDays(localText(bh.days, 'ja'));
  const ranges = parseTimeRanges(localText(bh.hours, 'ja'));
  if (!days || ranges.length === 0) return null;
  const closed = new Set(parseClosedDays(localText(bh.closedDay, 'ja')));
  const openDays = days.filter((d) => !closed.has(d));
  if (openDays.length === 0) return null;
  return ranges.map((r) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: openDays.map((d) => `https://schema.org/${d}`),
    opens: r.opens,
    closes: r.closes,
  }));
}

// 「¥1,800」「1800円」などを数値にする。範囲や「時価」などは null
function parseYen(price: string): string | null {
  const t = price.replace(/\s/g, '');
  const m = t.match(/^(?:¥|￥)?([\d,]+)(?:円)?(?:\(税込\)|（税込）)?$/);
  if (!m) return null;
  const n = m[1].replace(/,/g, '');
  return /^\d+$/.test(n) ? n : null;
}

// ---- JSON-LD ----

export function buildJsonLd(pageData: any, subdomain: string, lang: StoreLang) {
  const url = pageUrl(subdomain, lang);
  const name = storeName(pageData, lang);
  if (!name) return null;
  const description = storeDescription(pageData, lang);

  const restaurant: Record<string, any> = {
    '@type': 'Restaurant',
    '@id': `${storeOrigin(subdomain)}/#restaurant`,
    name,
    url,
  };
  if (description) restaurant.description = description;

  const images = [
    imageUrl(pageData?.hero?.backgroundImage),
    imageUrl(pageData?.storeInfo?.mainImage),
    ...((pageData?.gallery?.images || []) as any[]).map((i) => imageUrl(i)),
  ].filter((v): v is string => !!v);
  const uniqueImages = [...new Set(images)].slice(0, 6);
  if (uniqueImages.length) restaurant.image = uniqueImages;

  const address = oneLine(localText(pageData?.access?.address, lang));
  if (address) restaurant.address = address;

  const hours = openingHoursSpecification(pageData);
  if (hours) restaurant.openingHoursSpecification = hours;

  const sameAs = ((pageData?.footer?.social?.links || []) as any[])
    .map((l) => l?.url)
    .filter(isHttpUrl);
  if (sameAs.length) restaurant.sameAs = [...new Set(sameAs)];

  const menuItems = ((pageData?.menu?.items || []) as any[])
    .map((item) => {
      const itemName = oneLine(localText(item?.name, lang));
      if (!itemName) return null;
      const mi: Record<string, any> = { '@type': 'MenuItem', name: itemName };
      const d = oneLine(localText(item?.description, lang));
      if (d) mi.description = d;
      const img = imageUrl(item?.image);
      if (img) mi.image = img;
      const price = parseYen(localText(item?.price, 'ja'));
      if (price) mi.offers = { '@type': 'Offer', price, priceCurrency: 'JPY' };
      return mi;
    })
    .filter(Boolean);
  if (menuItems.length) {
    const sectionName = oneLine(localText(pageData?.menu?.sectionTitle, lang));
    restaurant.hasMenu = {
      '@type': 'Menu',
      ...(sectionName ? { name: sectionName } : {}),
      hasMenuItem: menuItems,
    };
  }

  const graph: any[] = [
    {
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
      url,
      name,
      inLanguage: lang === 'zh-tw' ? 'zh-TW' : lang,
      ...(description ? { description } : {}),
      about: { '@id': restaurant['@id'] },
    },
    restaurant,
  ];

  const faqs = ((pageData?.faq?.items || []) as any[])
    .map((f) => {
      const q = oneLine(localText(f?.question, lang));
      const a = oneLine(localText(f?.answer, lang));
      return q && a ? { '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } } : null;
    })
    .filter(Boolean);
  if (faqs.length) {
    graph.push({ '@type': 'FAQPage', '@id': `${url}#faq`, url, mainEntity: faqs });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}

// <script type="application/ld+json"> に安全に埋め込むための文字列化（</script> 対策）
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');
}

// ---- robots.txt / sitemap.xml / llms.txt ----

const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Google-Extended',
  'Applebot-Extended',
];

export function buildRobotsTxt(subdomain: string): string {
  const lines = ['User-agent: *', 'Allow: /', '', '# AI crawlers — explicitly allowed'];
  for (const bot of AI_CRAWLERS) lines.push(`User-agent: ${bot}`, 'Allow: /', '');
  lines.push(`Sitemap: ${storeOrigin(subdomain)}/sitemap.xml`, '');
  return lines.join('\n');
}

const xmlEscape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function buildSitemapXml(subdomain: string, lastmod?: string): string {
  const date = lastmod && !Number.isNaN(Date.parse(lastmod)) ? new Date(lastmod).toISOString().slice(0, 10) : null;
  const alternates = alternateLinksFor(subdomain)
    .map((a) => `    <xhtml:link rel="alternate" hreflang="${a.lang}" href="${xmlEscape(a.href)}"/>`)
    .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${xmlEscape(pageUrl(subdomain, 'ja'))}"/>`)
    .join('\n');
  const urls = STORE_LANGS.map(
    (lang) =>
      `  <url>\n    <loc>${xmlEscape(pageUrl(subdomain, lang))}</loc>\n${date ? `    <lastmod>${date}</lastmod>\n` : ''}${alternates}\n  </url>`
  ).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`;
}

const LANG_LABEL: Record<StoreLang, string> = { ja: '日本語', en: 'English', 'zh-tw': '繁體中文', ko: '한국어' };

// llms.txt: AI がお店の要点を読み取りやすいよう、入力済みの情報だけを Markdown でまとめる（日本語と英語）
export function buildLlmsTxt(pageData: any, subdomain: string): string {
  const out: string[] = [];
  const nameJa = storeName(pageData, 'ja');
  const nameEn = storeName(pageData, 'en');
  out.push(`# ${nameJa}${nameEn && nameEn !== nameJa ? ` (${nameEn})` : ''}`, '');
  const descJa = storeDescription(pageData, 'ja');
  if (descJa) out.push(`> ${descJa}`, '');

  out.push('## Pages', '');
  for (const lang of STORE_LANGS) out.push(`- [${LANG_LABEL[lang]}](${pageUrl(subdomain, lang)})`);
  out.push('');

  for (const lang of ['ja', 'en'] as const) {
    const sec: string[] = [];
    const address = oneLine(localText(pageData?.access?.address, lang));
    if (address) sec.push(`- ${lang === 'ja' ? '住所' : 'Address'}: ${address}`);
    const bh = pageData?.footer?.businessHours;
    if (bh) {
      const days = oneLine(localText(bh.days, lang));
      const hours = oneLine(localText(bh.hours, lang));
      const closed = oneLine(localText(bh.closedDay, lang));
      const h = [days, hours].filter(Boolean).join(' ');
      if (h) sec.push(`- ${lang === 'ja' ? '営業時間' : 'Hours'}: ${h}`);
      if (closed) sec.push(`- ${closed}`);
    }
    for (const m of (pageData?.access?.transportation?.methods || []) as any[]) {
      const type = oneLine(localText(m?.type, lang));
      const d = oneLine(localText(m?.description, lang));
      if (d) sec.push(`- ${type ? `${type}: ` : ''}${d}`);
    }
    const parking = oneLine(localText(pageData?.access?.parking?.spaces, lang));
    if (parking) sec.push(`- ${lang === 'ja' ? '駐車場' : 'Parking'}: ${parking}`);

    const menu = ((pageData?.menu?.items || []) as any[])
      .map((i) => {
        const n = oneLine(localText(i?.name, lang));
        if (!n) return null;
        const p = oneLine(localText(i?.price, lang));
        const d = oneLine(localText(i?.description, lang));
        return `- ${n}${p ? ` — ${p}` : ''}${d ? `: ${d}` : ''}`;
      })
      .filter(Boolean) as string[];

    if (sec.length) out.push(`## ${lang === 'ja' ? '店舗情報' : 'Store information'}`, '', ...sec, '');
    if (menu.length) out.push(`## ${lang === 'ja' ? 'メニュー' : 'Menu'}`, '', ...menu, '');
  }

  return out.join('\n');
}
