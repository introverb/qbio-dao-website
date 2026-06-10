// Qubie News feed — pulled at build time from the Qubie Report.
//
// The Qubie Report has no CORS headers on /feed.json, so a browser-side
// fetch from this site is blocked. Instead we fetch server-side during
// `astro build` and bake the results in. The list therefore refreshes on
// each rebuild/deploy (the upstream feed itself refreshes twice daily).
//
// Selection mirrors the Qubie Report's own "Featured" strips: score >= 10,
// filtered by category, sorted newest-first. The homepage panel mixes the
// research wire (paper/preprint/news) and the videos page, which use
// different FEATURED_CATEGORIES on the upstream site but share /feed.json.
const FEED_URL = "https://qubiereport.up.railway.app/feed.json";

export const QUBIE_SITE_URL = "https://qubiereport.up.railway.app/";
export const QUBIE_CHATTER_URL = "https://qubiereport.up.railway.app/chatter";

const SCORE_THRESHOLD = 10;

export interface QubieArticle {
  title: string;
  link: string;
  source: string;
  category: string;
  date: string;
  dateIso: string;
  blurb: string;
  thumbnail: string;
  score: number;
  matchedKeywords: string[];
}

interface FeedItem {
  title?: string;
  link?: string;
  source?: string;
  source_category?: string;
  date_iso?: string;
  score?: number;
  summary?: string;
  blurb?: string;
  thumbnail?: string;
  matched_keywords?: string[];
}

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function toArticle(a: FeedItem): QubieArticle {
  return {
    title: a.title ?? "",
    link: a.link ?? QUBIE_SITE_URL,
    source: a.source ?? "",
    category: a.source_category ?? "",
    date: formatDate(a.date_iso ?? ""),
    dateIso: a.date_iso ?? "",
    blurb: (a.blurb || a.summary || "").trim(),
    thumbnail: (a.thumbnail ?? "").trim(),
    score: a.score ?? 0,
    matchedKeywords: a.matched_keywords ?? [],
  };
}

async function loadFeed(): Promise<FeedItem[]> {
  try {
    const res = await fetch(FEED_URL);
    if (!res.ok) return [];
    const data = (await res.json()) as { articles?: FeedItem[] };
    return Array.isArray(data?.articles) ? data.articles : [];
  } catch {
    return [];
  }
}

function pickFeatured(
  items: FeedItem[],
  categories: string[],
  limit: number,
): QubieArticle[] {
  const set = new Set(categories);
  return items
    .filter((a) => (a.score ?? 0) >= SCORE_THRESHOLD)
    .filter((a) => set.has(a.source_category ?? ""))
    .sort((a, b) => (b.date_iso ?? "").localeCompare(a.date_iso ?? ""))
    .slice(0, limit)
    .map(toArticle);
}

// What the homepage Qubie News panel renders: two streams from one feed —
// the top `researchN` items from the research wire (paper/preprint/news)
// shown as rich cards, plus a mixed strip below combining `chatterN` items
// from /chatter (forums + social) with `videoN` videos, re-sorted by date.
export async function getQubieCards(
  researchN = 3,
  chatterN = 4,
  videoN = 1,
): Promise<{ research: QubieArticle[]; chatter: QubieArticle[] }> {
  const feed = await loadFeed();
  if (feed.length === 0) return { research: [], chatter: [] };
  const research = pickFeatured(feed, ["paper", "preprint", "news"], researchN);
  const fromChatter = pickFeatured(feed, ["forums", "social"], chatterN);
  const fromVideos = pickFeatured(feed, ["video"], videoN);
  const chatter = [...fromChatter, ...fromVideos].sort((a, b) =>
    (b.dateIso || "").localeCompare(a.dateIso || ""),
  );
  return { research, chatter };
}
