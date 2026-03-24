import { NextRequest, NextResponse } from "next/server";
import {
  fetchRedditPosts,
  fetchHNStories,
  fetchDevToPosts,
  fetchGoogleNews,
  FeedItem,
} from "@/lib/content-fetcher";
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const subreddits = params.get("subreddits")?.split(",").filter(Boolean) || [];
  const hnTags = params.get("hnTags")?.split(",").filter(Boolean) || [];
  const devtoTags = params.get("devtoTags")?.split(",").filter(Boolean) || [];
  const sortBy = params.get("sort") || "engagement";
  const sourceFilter = params.get("source") || "all";
  const language = params.get("lang") || "en";
  const domainName = params.get("domain") || "technology";

  // Build Google News query from domain context
  const newsQuery = `${domainName} technology`;

  const [reddit, hn, devto, news] = await Promise.all([
    subreddits.length > 0 ? fetchRedditPosts(subreddits) : [],
    hnTags.length > 0 ? fetchHNStories(hnTags) : [],
    devtoTags.length > 0 ? fetchDevToPosts(devtoTags) : [],
    // Always fetch Google News in the user's language
    fetchGoogleNews(newsQuery, language, 15),
  ]);

  let items: FeedItem[] = [...reddit, ...hn, ...devto, ...news];

  // For non-English: prioritize Google News (actual localized content)
  if (language !== "en") {
    // Boost news items for non-English to appear higher
    items = items.map((item) => {
      if (item.source === "news") {
        return { ...item, score: item.score + 500 };
      }
      return item;
    });
  }

  if (sourceFilter !== "all") {
    items = items.filter((i) => i.source === sourceFilter);
  }

  // Deduplicate by title similarity
  const seen = new Set<string>();
  items = items.filter((item) => {
    const key = item.title.toLowerCase().slice(0, 50);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  if (sortBy === "engagement") {
    items.sort((a, b) => b.score + b.comments * 2 - (a.score + a.comments * 2));
  } else {
    items.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  return NextResponse.json({ items: items.slice(0, 40) });
}
