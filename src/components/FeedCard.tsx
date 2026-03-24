"use client";
import { FeedItem } from "@/lib/content-fetcher";
import { toggleBookmark, isBookmarked } from "@/lib/store";
import { useState } from "react";

const sourceConfig: Record<string, { color: string; bg: string; label: string }> = {
  reddit: { color: "#ff6b35", bg: "rgba(255, 107, 53, 0.1)", label: "Reddit" },
  hackernews: { color: "#ff9f0a", bg: "rgba(255, 159, 10, 0.1)", label: "Hacker News" },
  devto: { color: "#30d158", bg: "rgba(48, 209, 88, 0.1)", label: "DEV" },
  news: { color: "#0a84ff", bg: "rgba(10, 132, 255, 0.1)", label: "News" },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return `${Math.max(1, Math.floor(diff / 60000))}m`;
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

function formatNum(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

export default function FeedCard({ item }: { item: FeedItem }) {
  const [bookmarked, setBookmarked] = useState(() => isBookmarked(item.id));

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark({
      id: item.id,
      title: item.title,
      url: item.url,
      source: item.source,
      savedAt: new Date().toISOString(),
    });
    setBookmarked(!bookmarked);
  };

  const src = sourceConfig[item.source] || sourceConfig.reddit;

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-2xl p-4 press-scale transition-all duration-200 hover:bg-white/[0.04]"
      style={{
        background: "rgba(28, 28, 30, 0.6)",
        border: "1px solid rgba(255, 255, 255, 0.06)",
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Source + Meta */}
          <div className="flex items-center gap-2 mb-2.5">
            <span
              className="text-[11px] font-semibold px-2 py-[3px] rounded-md"
              style={{ color: src.color, background: src.bg }}
            >
              {src.label}
            </span>
            {item.subreddit && (
              <span className="text-[11px] text-[#6e6e73]">
                r/{item.subreddit}
              </span>
            )}
            <span className="text-[11px] text-[#48484a]">
              {timeAgo(item.createdAt)}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-[15px] font-semibold leading-[1.35] text-[#f5f5f7] line-clamp-2 tracking-[-0.01em]">
            {item.title}
          </h3>

          {/* Engagement */}
          <div className="flex items-center gap-4 mt-2.5">
            <span className="flex items-center gap-1.5 text-[12px] text-[#86868b]">
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1.5l2.18 4.42 4.88.71-3.53 3.44.83 4.87L8 12.67l-4.36 2.27.83-4.87-3.53-3.44 4.88-.71L8 1.5z" />
              </svg>
              {formatNum(item.score)}
            </span>
            <span className="flex items-center gap-1.5 text-[12px] text-[#86868b]">
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1C4.13 1 1 3.58 1 6.75c0 1.77 1.06 3.35 2.72 4.38L3 14.5l3.28-1.87c.56.1 1.13.12 1.72.12 3.87 0 7-2.58 7-5.75S11.87 1 8 1z" />
              </svg>
              {formatNum(item.comments)}
            </span>
            <span className="text-[11px] text-[#48484a] truncate">
              {item.author}
            </span>
          </div>
        </div>

        {/* Bookmark */}
        <button
          onClick={handleBookmark}
          className="shrink-0 p-2 -mr-1 rounded-full transition-all duration-200 hover:bg-white/[0.08] active:scale-90"
        >
          <svg
            className="w-[18px] h-[18px] transition-colors duration-200"
            viewBox="0 0 20 20"
            fill={bookmarked ? "#0a84ff" : "none"}
            stroke={bookmarked ? "#0a84ff" : "#48484a"}
            strokeWidth={1.5}
          >
            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
          </svg>
        </button>
      </div>
    </a>
  );
}
