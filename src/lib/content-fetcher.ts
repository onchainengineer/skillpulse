export interface FeedItem {
  id: string;
  title: string;
  url: string;
  source: "reddit" | "hackernews" | "devto";
  score: number;
  comments: number;
  author: string;
  createdAt: string;
  subreddit?: string;
  tags?: string[];
  thumbnail?: string;
}

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
      // skip failed subreddit
    }
  }

  return items;
}

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
