"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import XPBar from "@/components/XPBar";
import DailyGoalRing from "@/components/DailyGoalRing";
import { LANGUAGES } from "@/lib/languages";
import {
  getProfile, saveProfile, getActiveDomain, getBookmarks, getDomainHistory,
  getStreak, clearActiveDomain, addToHistory, getXP, getAchievements, getAllAchievementDefs,
  BookmarkedItem, DomainHistory, ActiveDomain, UserProfile, XPData, Achievement,
} from "@/lib/store";

export default function Profile() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [domain, setDomain] = useState<ActiveDomain | null>(null);
  const [bookmarks, setBookmarks] = useState<BookmarkedItem[]>([]);
  const [history, setHistory] = useState<DomainHistory[]>([]);
  const [streak, setStreak] = useState({ lastDate: "", count: 0 });
  const [xp, setXP] = useState<XPData>({ total: 0, level: 1, todayXP: 0, todayDate: "", todayReads: 0 });
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [tab, setTab] = useState<"achievements" | "bookmarks" | "history">("achievements");

  useEffect(() => {
    const p = getProfile();
    if (!p?.onboarded) { router.replace("/onboarding"); return; }
    setProfile(p);
    setDomain(getActiveDomain());
    setBookmarks(getBookmarks());
    setHistory(getDomainHistory());
    setStreak(getStreak());
    setXP(getXP());
    setAchievements(getAchievements());
  }, [router]);

  const handleFinishDomain = () => {
    if (!domain) return;
    addToHistory({
      id: domain.id, name: domain.name, startDate: domain.startDate,
      endDate: new Date().toISOString(), durationWeeks: domain.durationWeeks,
    });
    clearActiveDomain();
    setDomain(null);
    setHistory(getDomainHistory());
  };

  const handleResetProfile = () => {
    if (confirm("This will clear all your data and progress. Continue?")) {
      localStorage.clear();
      router.push("/onboarding");
    }
  };

  if (!profile) return null;

  const allDefs = getAllAchievementDefs();
  const unlockedIds = new Set(achievements.map((a) => a.id));

  return (
    <main className="min-h-screen pb-[70px] px-5 pt-[48px] max-w-lg mx-auto">
      {/* Profile Header */}
      <div className="flex items-center gap-4 mb-5">
        <div
          className="h-[60px] w-[60px] rounded-full flex items-center justify-center text-[24px] font-semibold text-white shrink-0"
          style={{ background: "linear-gradient(135deg, #5e5ce6, #bf5af2)" }}
        >
          {profile.name[0]?.toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-[22px] font-bold tracking-tight truncate">{profile.name}</h1>
          <p className="text-[14px] text-[#86868b]">{profile.role}</p>
        </div>
      </div>

      {/* XP */}
      <div className="rounded-2xl p-4 mb-4" style={{ background: "rgba(28,28,30,0.6)", border: "1px solid rgba(255,255,255,0.04)" }}>
        <XPBar xp={xp} />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-2 mb-5">
        {[
          { value: streak.count, label: "Streak", icon: "🔥" },
          { value: xp.total, label: "Total XP", icon: "⚡" },
          { value: history.length, label: "Done", icon: "✅" },
          { value: bookmarks.length, label: "Saved", icon: "📌" },
        ].map(({ value, label, icon }) => (
          <div
            key={label}
            className="rounded-2xl p-3 text-center"
            style={{ background: "rgba(28,28,30,0.6)", border: "1px solid rgba(255,255,255,0.04)" }}
          >
            <span className="text-[16px]">{icon}</span>
            <div className="text-[16px] font-bold text-[#f5f5f7] mt-0.5">{value}</div>
            <div className="text-[9px] font-medium text-[#6e6e73] uppercase tracking-wider">{label}</div>
          </div>
        ))}
      </div>

      {/* Daily Goal */}
      <div
        className="rounded-2xl p-4 mb-5 flex items-center gap-4"
        style={{ background: "rgba(28,28,30,0.6)", border: "1px solid rgba(255,255,255,0.04)" }}
      >
        <DailyGoalRing current={xp.todayReads} goal={profile.dailyGoal} size={64} />
        <div>
          <p className="text-[14px] font-semibold text-[#f5f5f7]">Daily Goal</p>
          <p className="text-[12px] text-[#86868b]">{xp.todayReads} of {profile.dailyGoal} articles today</p>
        </div>
      </div>

      {/* Active Domain */}
      {domain && (
        <div
          className="rounded-2xl p-4 mb-5"
          style={{ background: "rgba(28,28,30,0.6)", border: "1px solid rgba(255,255,255,0.04)" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-[22px]">{domain.icon}</span>
              <div>
                <p className="font-semibold text-[14px]">{domain.name}</p>
                <p className="text-[12px] text-[#6e6e73]">{domain.durationWeeks}w plan</p>
              </div>
            </div>
            <button
              onClick={handleFinishDomain}
              className="text-[12px] px-3.5 py-1.5 rounded-full font-medium press-scale"
              style={{ background: "rgba(255,255,255,0.06)", color: "#86868b", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              Complete
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div
        className="flex p-[3px] rounded-xl mb-4"
        style={{ background: "rgba(28,28,30,0.8)", border: "1px solid rgba(255,255,255,0.04)" }}
      >
        {(["achievements", "bookmarks", "history"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 px-2 py-2 rounded-[10px] text-[12px] font-semibold capitalize transition-all"
            style={{
              background: tab === t ? "#0a84ff" : "transparent",
              color: tab === t ? "white" : "#86868b",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === "achievements" && (
        <div className="grid grid-cols-2 gap-2.5">
          {allDefs.map((def) => {
            const unlocked = unlockedIds.has(def.id);
            return (
              <div
                key={def.id}
                className="rounded-2xl p-4 text-center transition-all"
                style={{
                  background: unlocked ? "rgba(255,159,10,0.06)" : "rgba(28,28,30,0.4)",
                  border: `1px solid ${unlocked ? "rgba(255,159,10,0.15)" : "rgba(255,255,255,0.04)"}`,
                  opacity: unlocked ? 1 : 0.4,
                }}
              >
                <span className="text-[28px]">{def.icon}</span>
                <p className="text-[12px] font-semibold text-[#f5f5f7] mt-1.5">{def.title}</p>
                <p className="text-[10px] text-[#6e6e73] mt-0.5">{def.description}</p>
              </div>
            );
          })}
        </div>
      )}

      {tab === "bookmarks" && (
        bookmarks.length > 0 ? (
          <div className="space-y-2">
            {bookmarks.map((b) => (
              <a
                key={b.id}
                href={b.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-2xl p-3.5 press-scale"
                style={{ background: "rgba(28,28,30,0.6)", border: "1px solid rgba(255,255,255,0.04)" }}
              >
                <p className="text-[14px] font-medium line-clamp-2 text-[#f5f5f7]">{b.title}</p>
                <p className="text-[11px] text-[#48484a] mt-1.5">{b.source} &middot; {new Date(b.savedAt).toLocaleDateString()}</p>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-10"><p className="text-[14px] text-[#48484a]">No bookmarks yet</p></div>
        )
      )}

      {tab === "history" && (
        history.length > 0 ? (
          <div className="space-y-2">
            {history.map((h, i) => (
              <div key={i} className="rounded-2xl p-3.5" style={{ background: "rgba(28,28,30,0.6)", border: "1px solid rgba(255,255,255,0.04)" }}>
                <p className="text-[14px] font-medium text-[#f5f5f7]">{h.name}</p>
                <p className="text-[11px] text-[#48484a] mt-1">
                  {new Date(h.startDate).toLocaleDateString()} — {new Date(h.endDate).toLocaleDateString()} &middot; {h.durationWeeks}w
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10"><p className="text-[14px] text-[#48484a]">No completed domains yet</p></div>
        )
      )}

      {/* Language */}
      <div className="mt-6 mb-4">
        <h2 className="text-[13px] font-medium text-[#86868b] uppercase tracking-wider mb-2.5">Language</h2>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {LANGUAGES.map((l) => {
            const active = profile.language === l.code;
            return (
              <button
                key={l.code}
                onClick={() => {
                  const updated = { ...profile, language: l.code };
                  saveProfile(updated);
                  setProfile(updated);
                }}
                className="shrink-0 px-3 py-2 rounded-xl text-[12px] font-medium press-scale transition-all"
                style={{
                  background: active ? "rgba(10,132,255,0.12)" : "rgba(28,28,30,0.8)",
                  border: `1px solid ${active ? "rgba(10,132,255,0.4)" : "rgba(255,255,255,0.06)"}`,
                  color: active ? "#0a84ff" : "#86868b",
                }}
              >
                {l.flag} {l.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interests */}
      <div className="mb-4">
        <h2 className="text-[13px] font-medium text-[#86868b] uppercase tracking-wider mb-2.5">Interests</h2>
        <div className="flex flex-wrap gap-2">
          {profile.interests.map((interest) => (
            <span
              key={interest}
              className="px-3 py-1.5 rounded-full text-[12px] font-medium text-[#86868b]"
              style={{ background: "rgba(28,28,30,0.8)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              {interest}
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={handleResetProfile}
        className="w-full mt-4 px-4 py-3 rounded-[14px] text-[14px] font-semibold press-scale"
        style={{ background: "rgba(255,69,58,0.1)", color: "#ff453a", border: "1px solid rgba(255,69,58,0.15)" }}
      >
        Reset Profile
      </button>

      <Navbar />
    </main>
  );
}
