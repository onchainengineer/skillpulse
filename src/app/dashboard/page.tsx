"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import FeedCard from "@/components/FeedCard";
import ProgressBar from "@/components/ProgressBar";
import DailyGoalRing from "@/components/DailyGoalRing";
import XPBar from "@/components/XPBar";
import AchievementToast from "@/components/AchievementToast";
import {
  getProfile, getActiveDomain, getDomainProgress,
  getStreak, updateStreak, getXP, addXP, checkAchievements,
  Achievement, XPData,
} from "@/lib/store";
import { FeedItem } from "@/lib/content-fetcher";

export default function Dashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<ReturnType<typeof getProfile>>(null);
  const [domain, setDomain] = useState<ReturnType<typeof getActiveDomain>>(null);
  const [topItems, setTopItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [streak, setStreak] = useState({ lastDate: "", count: 0 });
  const [xp, setXP] = useState<XPData>({ total: 0, level: 1, todayXP: 0, todayDate: "", todayReads: 0 });
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState<Achievement | null>(null);

  useEffect(() => {
    const p = getProfile();
    if (!p?.onboarded) { router.replace("/onboarding"); return; }
    setProfile(p);
    setDomain(getActiveDomain());
    setStreak(updateStreak());
    setXP(getXP());
    setReady(true);

    // Check achievements on load
    const newAchievements = checkAchievements();
    if (newAchievements.length > 0) {
      setToast(newAchievements[0]);
    }
  }, [router]);

  useEffect(() => {
    if (!domain) return;
    setLoading(true);
    const params = new URLSearchParams({
      subreddits: domain.subreddits.join(","),
      hnTags: domain.hnTags.join(","),
      devtoTags: domain.devtoTags.join(","),
      sort: "engagement",
    });
    fetch(`/api/feed?${params}`)
      .then((r) => r.json())
      .then((data) => setTopItems((data.items || []).slice(0, 5)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [domain]);

  const handleArticleRead = useCallback(() => {
    const result = addXP(10);
    setXP(result.xp);
    const newAchievements = checkAchievements();
    if (newAchievements.length > 0) setToast(newAchievements[0]);
  }, []);

  if (!ready || !profile) return null;

  const progress = domain ? getDomainProgress(domain) : 0;
  const daysLeft = domain
    ? Math.max(0, Math.ceil((new Date(domain.startDate).getTime() + domain.durationWeeks * 7 * 86400000 - Date.now()) / 86400000))
    : 0;

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <main className="min-h-screen pb-[70px] px-5 pt-[48px] max-w-lg mx-auto">
      {/* Achievement Toast */}
      {toast && <AchievementToast achievement={toast} onDismiss={() => setToast(null)} />}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[13px] text-[#86868b] font-medium">{greeting}</p>
          <h1 className="text-[28px] font-bold tracking-tight">{profile.name.split(" ")[0]}</h1>
        </div>
        <Link
          href="/profile"
          className="h-10 w-10 rounded-full flex items-center justify-center text-[15px] font-semibold text-white press-scale"
          style={{ background: "linear-gradient(135deg, #5e5ce6, #bf5af2)" }}
        >
          {profile.name[0]?.toUpperCase()}
        </Link>
      </div>

      {/* XP Bar */}
      <div className="mb-6 rounded-2xl p-4" style={{ background: "rgba(28,28,30,0.6)", border: "1px solid rgba(255,255,255,0.04)" }}>
        <XPBar xp={xp} />
      </div>

      {/* Daily Goal + Streak Row */}
      <div className="flex gap-3 mb-6">
        {/* Daily Goal */}
        <div
          className="flex-1 rounded-2xl p-4 flex flex-col items-center"
          style={{ background: "rgba(28,28,30,0.6)", border: "1px solid rgba(255,255,255,0.04)" }}
        >
          <p className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider mb-3">Daily Goal</p>
          <DailyGoalRing current={xp.todayReads} goal={profile.dailyGoal} size={100} />
          <p className="text-[11px] text-[#48484a] mt-2">articles today</p>
        </div>

        {/* Streak + Quick Stats */}
        <div className="flex-1 flex flex-col gap-3">
          <div
            className="flex-1 rounded-2xl p-4 flex flex-col items-center justify-center"
            style={{
              background: streak.count > 0
                ? "linear-gradient(135deg, rgba(255,159,10,0.1), rgba(255,103,35,0.06))"
                : "rgba(28,28,30,0.6)",
              border: `1px solid ${streak.count > 0 ? "rgba(255,159,10,0.15)" : "rgba(255,255,255,0.04)"}`,
            }}
          >
            <span className="text-[32px]">{streak.count > 0 ? "🔥" : "❄️"}</span>
            <span className="text-[22px] font-bold text-[#f5f5f7] mt-1">{streak.count}</span>
            <span className="text-[10px] font-semibold text-[#86868b] uppercase tracking-wider">day streak</span>
          </div>
          <div
            className="rounded-2xl p-3 flex items-center justify-center gap-2"
            style={{ background: "rgba(28,28,30,0.6)", border: "1px solid rgba(255,255,255,0.04)" }}
          >
            <span className="text-[14px]">⚡</span>
            <span className="text-[13px] font-bold" style={{ color: "#ff9f0a" }}>+{xp.todayXP}</span>
            <span className="text-[11px] text-[#48484a]">XP today</span>
          </div>
        </div>
      </div>

      {/* Active Domain */}
      {domain ? (
        <div
          className="rounded-[20px] p-5 mb-6"
          style={{
            background: "linear-gradient(135deg, rgba(10,132,255,0.08), rgba(191,90,242,0.05))",
            border: "1px solid rgba(10,132,255,0.12)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-[14px] flex items-center justify-center text-[22px]" style={{ background: "rgba(255,255,255,0.06)" }}>
                {domain.icon}
              </div>
              <div>
                <h2 className="font-semibold text-[15px] text-[#f5f5f7]">{domain.name}</h2>
                <p className="text-[12px] text-[#86868b] mt-0.5">
                  {daysLeft}d left &middot; Week {Math.min(domain.durationWeeks, Math.ceil((Date.now() - new Date(domain.startDate).getTime()) / (7 * 86400000)) + 1)} of {domain.durationWeeks}
                </p>
              </div>
            </div>
            <span className="text-[20px] font-bold" style={{ color: "#0a84ff" }}>{progress}%</span>
          </div>
          <ProgressBar value={progress} />
        </div>
      ) : (
        <Link
          href="/explore"
          className="block rounded-[20px] p-6 mb-6 text-center press-scale"
          style={{ background: "rgba(28,28,30,0.6)", border: "1px dashed rgba(255,255,255,0.12)" }}
        >
          <div className="text-[36px] mb-2">🧭</div>
          <p className="font-semibold text-[15px] text-[#f5f5f7]">Start a Learning Journey</p>
          <p className="text-[13px] text-[#86868b] mt-1">Pick a domain to get curated content</p>
        </Link>
      )}

      {/* Trending */}
      {domain && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[17px] font-semibold tracking-tight">Trending Now</h2>
            <Link href="/feed" className="text-[13px] font-medium" style={{ color: "#0a84ff" }}>
              See All
            </Link>
          </div>

          {loading ? (
            <div className="space-y-2.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl h-[88px] animate-pulse" style={{ background: "rgba(28,28,30,0.6)" }} />
              ))}
            </div>
          ) : topItems.length > 0 ? (
            <div className="space-y-2.5">
              {topItems.map((item) => (
                <div key={item.id} onClick={handleArticleRead}>
                  <FeedCard item={item} />
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl p-8 text-center" style={{ background: "rgba(28,28,30,0.6)" }}>
              <p className="text-[14px] text-[#86868b]">Content loading...</p>
            </div>
          )}
        </div>
      )}

      <Navbar />
    </main>
  );
}
