export interface FeedItem {
  id: string;
  title: string;
  url: string;
  source: "reddit" | "hackernews" | "devto" | "news";
  score: number;
  comments: number;
  author: string;
  createdAt: string;
  subreddit?: string;
  tags?: string[];
  thumbnail?: string;
}

// --- Google News RSS (supports language natively) ---
export async function fetchGoogleNews(
  query: string,
  langCode: string,
  limit = 15
): Promise<FeedItem[]> {
  // Google News RSS: hl=language, gl=country, ceid=country:language
  const langMap: Record<string, { hl: string; gl: string; ceid: string }> = {
    en: { hl: "en", gl: "US", ceid: "US:en" },
    hi: { hl: "hi", gl: "IN", ceid: "IN:hi" },
    es: { hl: "es", gl: "ES", ceid: "ES:es" },
    fr: { hl: "fr", gl: "FR", ceid: "FR:fr" },
    de: { hl: "de", gl: "DE", ceid: "DE:de" },
    pt: { hl: "pt-BR", gl: "BR", ceid: "BR:pt-419" },
    ja: { hl: "ja", gl: "JP", ceid: "JP:ja" },
    ko: { hl: "ko", gl: "KR", ceid: "KR:ko" },
    zh: { hl: "zh-CN", gl: "CN", ceid: "CN:zh-Hans" },
    ar: { hl: "ar", gl: "SA", ceid: "SA:ar" },
    ru: { hl: "ru", gl: "RU", ceid: "RU:ru" },
    ta: { hl: "ta", gl: "IN", ceid: "IN:ta" },
    te: { hl: "te", gl: "IN", ceid: "IN:te" },
    bn: { hl: "bn", gl: "IN", ceid: "IN:bn" },
  };

  const params = langMap[langCode] || langMap.en;
  const encodedQuery = encodeURIComponent(query);
  const url = `https://news.google.com/rss/search?q=${encodedQuery}&hl=${params.hl}&gl=${params.gl}&ceid=${params.ceid}`;

  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const xml = await res.text();

    // Simple XML parsing for RSS items
    const items: FeedItem[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    let count = 0;

    while ((match = itemRegex.exec(xml)) !== null && count < limit) {
      const itemXml = match[1];
      const title = extractTag(itemXml, "title");
      const link = extractTag(itemXml, "link");
      const pubDate = extractTag(itemXml, "pubDate");
      const source = extractTag(itemXml, "source");

      if (title && link) {
        items.push({
          id: `news-${count}-${Date.now()}`,
          title: decodeHtmlEntities(title),
          url: link,
          source: "news",
          score: 0, // Google News doesn't provide engagement
          comments: 0,
          author: source || "Google News",
          createdAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
        });
        count++;
      }
    }

    return items;
  } catch {
    return [];
  }
}

function extractTag(xml: string, tag: string): string {
  // Handle CDATA
  const cdataRegex = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`);
  const cdataMatch = xml.match(cdataRegex);
  if (cdataMatch) return cdataMatch[1].trim();

  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`);
  const match = xml.match(regex);
  return match ? match[1].trim() : "";
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/");
}

// --- Reddit ---
export async function fetchRedditPosts(
  subreddits: string[],
  limit = 10
): Promise<FeedItem[]> {
  const items: FeedItem[] = [];

  for (const sub of subreddits) {
    try {
      const res = await fetch(
        `https://www.reddit.com/r/${sub}/hot.json?limit=${limit}`,
        {
          headers: { "User-Agent": "SkillPulse/1.0" },
          next: { revalidate: 300 },
        }
      );
      if (!res.ok) continue;
      const data = await res.json();
      const posts = data?.data?.children || [];
      for (const post of posts) {
        const d = post.data;
        if (d.stickied) continue;
        items.push({
          id: `reddit-${d.id}`,
          title: d.title,
          url: d.url?.startsWith("http")
            ? d.url
            : `https://reddit.com${d.permalink}`,
          source: "reddit",
          score: d.score || 0,
          comments: d.num_comments || 0,
          author: d.author || "",
          createdAt: new Date(d.created_utc * 1000).toISOString(),
          subreddit: d.subreddit,
          thumbnail:
            d.thumbnail && d.thumbnail.startsWith("http")
              ? d.thumbnail
              : undefined,
        });
      }
    } catch {
      // skip
    }
  }

  return items;
}

// --- HackerNews ---
export async function fetchHNStories(
  tags: string[],
  limit = 15
): Promise<FeedItem[]> {
  try {
    const res = await fetch(
      "https://hacker-news.firebaseio.com/v0/topstories.json",
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    const ids: number[] = await res.json();
    const topIds = ids.slice(0, 50);

    const stories = await Promise.all(
      topIds.map(async (id) => {
        const r = await fetch(
          `https://hacker-news.firebaseio.com/v0/item/${id}.json`,
          { next: { revalidate: 300 } }
        );
        return r.ok ? r.json() : null;
      })
    );

    const tagLower = tags.map((t) => t.toLowerCase());

    return stories
      .filter((s) => {
        if (!s || !s.title) return false;
        const titleLower = s.title.toLowerCase();
        return tagLower.some((t) => titleLower.includes(t));
      })
      .slice(0, limit)
      .map((s) => ({
        id: `hn-${s.id}`,
        title: s.title,
        url: s.url || `https://news.ycombinator.com/item?id=${s.id}`,
        source: "hackernews" as const,
        score: s.score || 0,
        comments: s.descendants || 0,
        author: s.by || "",
        createdAt: new Date(s.time * 1000).toISOString(),
      }));
  } catch {
    return [];
  }
}

// --- Dev.to ---
export async function fetchDevToPosts(
  tags: string[],
  limit = 10
): Promise<FeedItem[]> {
  const items: FeedItem[] = [];

  for (const tag of tags.slice(0, 3)) {
    try {
      const res = await fetch(
        `https://dev.to/api/articles?tag=${tag}&top=7&per_page=${limit}`,
        { next: { revalidate: 300 } }
      );
      if (!res.ok) continue;
      const articles = await res.json();
      for (const a of articles) {
        items.push({
          id: `devto-${a.id}`,
          title: a.title,
          url: a.url,
          source: "devto",
          score: a.public_reactions_count || 0,
          comments: a.comments_count || 0,
          author: a.user?.name || a.user?.username || "",
          createdAt: a.published_at || a.created_at,
          tags: a.tag_list,
          thumbnail: a.cover_image || a.social_image,
        });
      }
    } catch {
      // skip
    }
  }

  return items;
}
