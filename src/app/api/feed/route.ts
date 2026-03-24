import { NextRequest, NextResponse } from "next/server";
import {
  fetchRedditPosts,
  fetchHNStories,
  fetchDevToPosts,
  FeedItem,
} from "@/lib/content-fetcher";
import { getLanguageByCode } from "@/lib/languages";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const subreddits = params.get("subreddits")?.split(",").filter(Boolean) || [];
  const hnTags = params.get("hnTags")?.split(",").filter(Boolean) || [];
  const devtoTags = params.get("devtoTags")?.split(",").filter(Boolean) || [];
  const sortBy = params.get("sort") || "engagement";
  const sourceFilter = params.get("source") || "all";
  const language = params.get("lang") || "en";

  // Add language-specific subreddits
  const lang = getLanguageByCode(language);
  const allSubreddits = [...subreddits, ...lang.subredditSuffixes];
  const allHnTags = [...hnTags, ...lang.searchTerms];

  const [reddit, hn, devto] = await Promise.all([
    allSubreddits.length > 0 ? fetchRedditPosts(allSubreddits) : [],
    allHnTags.length > 0 ? fetchHNStories(allHnTags) : [],
    devtoTags.length > 0 ? fetchDevToPosts(devtoTags) : [],
  ]);

  let items: FeedItem[] = [...reddit, ...hn, ...devto];

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
