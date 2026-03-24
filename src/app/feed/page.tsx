"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import FeedCard from "@/components/FeedCard";
import { getActiveDomain, getProfile } from "@/lib/store";
import { FeedItem } from "@/lib/content-fetcher";

type SortType = "engagement" | "recent";
type SourceFilter = "all" | "reddit" | "hackernews" | "devto";

export default function Feed() {
  const router = useRouter();
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortType>("engagement");
  const [source, setSource] = useState<SourceFilter>("all");
  const [domain, setDomain] = useState<ReturnType<typeof getActiveDomain>>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const p = getProfile();
    if (!p?.onboarded) { router.replace("/onboarding"); return; }
    setDomain(getActiveDomain());
    setReady(true);
  }, [router]);

  useEffect(() => {
    if (!ready || !domain) return;
    setLoading(true);
    const params = new URLSearchParams({
      subreddits: domain.subreddits.join(","), hnTags: domain.hnTags.join(","),
      devtoTags: domain.devtoTags.join(","), sort, source,
    });
    fetch(`/api/feed?${params}`)
      .then((r) => r.json())
      .then((data) => setItems(data.items || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [sort, source, domain, ready, router]);

  if (!domain) {
    return (
      <main className="min-h-screen pb-[70px] px-5 pt-[52px] max-w-lg mx-auto">
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <div className="text-[48px] mb-4">📡</div>
          <h2 className="font-semibold text-[18px] tracking-tight mb-2">No active domain</h2>
          <p className="text-[14px] text-[#86868b] mb-5">Select a learning domain first</p>
          <button
            onClick={() => router.push("/explore")}
            className="px-6 py-2.5 rounded-[14px] font-semibold text-[14px] text-white press-scale"
            style={{ background: "#0a84ff", boxShadow: "0 4px 16px rgba(10,132,255,0.3)" }}
          >
            Explore Domains
          </button>
        </div>
        <Navbar />
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-[70px] px-5 pt-[52px] max-w-lg mx-auto">
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[20px]">{domain.icon}</span>
          <h1 className="text-[22px] font-bold tracking-tight">{domain.name}</h1>
        </div>
        <p className="text-[13px] text-[#86868b]">Curated from Reddit, HN & Dev.to</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar">
        <div className="flex p-[3px] rounded-xl" style={{ background: "rgba(28,28,30,0.8)", border: "1px solid rgba(255,255,255,0.04)" }}>
          {(["engagement", "recent"] as SortType[]).map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className="px-3.5 py-[6px] rounded-[10px] text-[12px] font-semibold transition-all duration-200"
              style={{
                background: sort === s ? "#0a84ff" : "transparent",
                color: sort === s ? "white" : "#86868b",
              }}
            >
              {s === "engagement" ? "Top" : "New"}
            </button>
          ))}
        </div>
        <div className="flex p-[3px] rounded-xl" style={{ background: "rgba(28,28,30,0.8)", border: "1px solid rgba(255,255,255,0.04)" }}>
          {(["all", "reddit", "hackernews", "devto"] as SourceFilter[]).map((s) => (
            <button
              key={s}
              onClick={() => setSource(s)}
              className="px-3 py-[6px] rounded-[10px] text-[12px] font-semibold transition-all duration-200 whitespace-nowrap"
              style={{
                background: source === s ? "#0a84ff" : "transparent",
                color: source === s ? "white" : "#86868b",
              }}
            >
              {s === "all" ? "All" : s === "hackernews" ? "HN" : s === "devto" ? "DEV" : "Reddit"}
            </button>
          ))}
        </div>
      </div>

      {/* Feed */}
      {loading ? (
        <div className="space-y-2.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="rounded-2xl h-[88px] animate-pulse" style={{ background: "rgba(28,28,30,0.6)" }} />
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="space-y-2.5">
          {items.map((item) => <FeedCard key={item.id} item={item} />)}
        </div>
      ) : (
        <div className="rounded-2xl p-10 text-center" style={{ background: "rgba(28,28,30,0.6)" }}>
          <div className="text-[36px] mb-3">🔍</div>
          <p className="text-[14px] text-[#86868b]">No results. Try a different filter.</p>
        </div>
      )}

      <Navbar />
    </main>
  );
}
