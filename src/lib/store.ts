export interface UserProfile {
  name: string;
  role: string;
  experience: "beginner" | "intermediate" | "advanced";
  interests: string[];
  projects: string;
  onboarded: boolean;
  dailyGoal: number; // articles per day
}

export interface ActiveDomain {
  id: string;
  name: string;
  icon: string;
  startDate: string;
  durationWeeks: number;
  subreddits: string[];
  hnTags: string[];
  devtoTags: string[];
}

export interface BookmarkedItem {
  id: string;
  title: string;
  url: string;
  source: string;
  savedAt: string;
}

// --- Gamification ---
export interface XPData {
  total: number;
  level: number;
  todayXP: number;
  todayDate: string;
  todayReads: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

const PROFILE_KEY = "skillpulse_profile";
const DOMAIN_KEY = "skillpulse_domain";
const BOOKMARKS_KEY = "skillpulse_bookmarks";
const HISTORY_KEY = "skillpulse_history";
const STREAK_KEY = "skillpulse_streak";
const XP_KEY = "skillpulse_xp";
const ACHIEVEMENTS_KEY = "skillpulse_achievements";

// --- Profile ---
export function getProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(PROFILE_KEY);
  if (!raw) return null;
  const p = JSON.parse(raw);
  return { dailyGoal: 5, ...p };
}

export function saveProfile(profile: UserProfile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

// --- Domain ---
export function getActiveDomain(): ActiveDomain | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(DOMAIN_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function saveActiveDomain(domain: ActiveDomain) {
  localStorage.setItem(DOMAIN_KEY, JSON.stringify(domain));
}

export function clearActiveDomain() {
  localStorage.removeItem(DOMAIN_KEY);
}

// --- Bookmarks ---
export function getBookmarks(): BookmarkedItem[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(BOOKMARKS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function toggleBookmark(item: BookmarkedItem) {
  const bookmarks = getBookmarks();
  const idx = bookmarks.findIndex((b) => b.id === item.id);
  if (idx >= 0) {
    bookmarks.splice(idx, 1);
  } else {
    bookmarks.push(item);
  }
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  return bookmarks;
}

export function isBookmarked(id: string): boolean {
  return getBookmarks().some((b) => b.id === id);
}

// --- History ---
export interface DomainHistory {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  durationWeeks: number;
}

export function getDomainHistory(): DomainHistory[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(HISTORY_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function addToHistory(entry: DomainHistory) {
  const history = getDomainHistory();
  history.unshift(entry);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

// --- Streak ---
export function getStreak(): { lastDate: string; count: number } {
  if (typeof window === "undefined") return { lastDate: "", count: 0 };
  const raw = localStorage.getItem(STREAK_KEY);
  return raw ? JSON.parse(raw) : { lastDate: "", count: 0 };
}

export function updateStreak() {
  const today = new Date().toISOString().split("T")[0];
  const streak = getStreak();
  if (streak.lastDate === today) return streak;
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const newStreak = {
    lastDate: today,
    count: streak.lastDate === yesterday ? streak.count + 1 : 1,
  };
  localStorage.setItem(STREAK_KEY, JSON.stringify(newStreak));
  return newStreak;
}

// --- XP & Levels ---
const XP_PER_LEVEL = 100;

function defaultXP(): XPData {
  return { total: 0, level: 1, todayXP: 0, todayDate: "", todayReads: 0 };
}

export function getXP(): XPData {
  if (typeof window === "undefined") return defaultXP();
  const raw = localStorage.getItem(XP_KEY);
  if (!raw) return defaultXP();
  const data = JSON.parse(raw) as XPData;
  const today = new Date().toISOString().split("T")[0];
  if (data.todayDate !== today) {
    data.todayXP = 0;
    data.todayReads = 0;
    data.todayDate = today;
  }
  return data;
}

export function addXP(amount: number): { xp: XPData; leveledUp: boolean } {
  const data = getXP();
  const today = new Date().toISOString().split("T")[0];
  data.total += amount;
  data.todayXP += amount;
  data.todayDate = today;
  data.todayReads += 1;
  const oldLevel = data.level;
  data.level = Math.floor(data.total / XP_PER_LEVEL) + 1;
  localStorage.setItem(XP_KEY, JSON.stringify(data));
  return { xp: data, leveledUp: data.level > oldLevel };
}

export function getLevelProgress(xp: XPData): number {
  const xpInLevel = xp.total % XP_PER_LEVEL;
  return Math.round((xpInLevel / XP_PER_LEVEL) * 100);
}

// --- Achievements ---
const ACHIEVEMENT_DEFS = [
  { id: "first_read", title: "First Steps", description: "Read your first article", icon: "👣" },
  { id: "streak_3", title: "On Fire", description: "3 day streak", icon: "🔥" },
  { id: "streak_7", title: "Unstoppable", description: "7 day streak", icon: "⚡" },
  { id: "bookmark_5", title: "Collector", description: "Bookmark 5 articles", icon: "📚" },
  { id: "level_5", title: "Rising Star", description: "Reach level 5", icon: "⭐" },
  { id: "level_10", title: "Expert", description: "Reach level 10", icon: "🏆" },
  { id: "domain_complete", title: "Domain Master", description: "Complete a learning domain", icon: "🎓" },
  { id: "daily_goal", title: "Goal Crusher", description: "Hit your daily goal", icon: "🎯" },
  { id: "reads_50", title: "Bookworm", description: "Read 50 articles total", icon: "🐛" },
  { id: "multi_domain", title: "Renaissance", description: "Explore 3+ domains", icon: "🌈" },
];

export function getAchievements(): Achievement[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(ACHIEVEMENTS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function unlockAchievement(id: string): Achievement | null {
  const achievements = getAchievements();
  if (achievements.some((a) => a.id === id)) return null;
  const def = ACHIEVEMENT_DEFS.find((d) => d.id === id);
  if (!def) return null;
  const achievement: Achievement = { ...def, unlockedAt: new Date().toISOString() };
  achievements.push(achievement);
  localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
  return achievement;
}

export function getAllAchievementDefs() {
  return ACHIEVEMENT_DEFS;
}

export function checkAchievements(): Achievement[] {
  const newlyUnlocked: Achievement[] = [];
  const xp = getXP();
  const streak = getStreak();
  const bookmarks = getBookmarks();
  const history = getDomainHistory();
  const profile = getProfile();

  if (xp.todayReads >= 1) {
    const a = unlockAchievement("first_read");
    if (a) newlyUnlocked.push(a);
  }
  if (streak.count >= 3) {
    const a = unlockAchievement("streak_3");
    if (a) newlyUnlocked.push(a);
  }
  if (streak.count >= 7) {
    const a = unlockAchievement("streak_7");
    if (a) newlyUnlocked.push(a);
  }
  if (bookmarks.length >= 5) {
    const a = unlockAchievement("bookmark_5");
    if (a) newlyUnlocked.push(a);
  }
  if (xp.level >= 5) {
    const a = unlockAchievement("level_5");
    if (a) newlyUnlocked.push(a);
  }
  if (xp.level >= 10) {
    const a = unlockAchievement("level_10");
    if (a) newlyUnlocked.push(a);
  }
  if (history.length >= 1) {
    const a = unlockAchievement("domain_complete");
    if (a) newlyUnlocked.push(a);
  }
  if (profile && xp.todayReads >= profile.dailyGoal) {
    const a = unlockAchievement("daily_goal");
    if (a) newlyUnlocked.push(a);
  }
  if (xp.total >= 50 * 10) {
    const a = unlockAchievement("reads_50");
    if (a) newlyUnlocked.push(a);
  }
  if (history.length >= 3) {
    const a = unlockAchievement("multi_domain");
    if (a) newlyUnlocked.push(a);
  }

  return newlyUnlocked;
}

// --- Domain Progress ---
export function getDomainProgress(domain: ActiveDomain): number {
  const start = new Date(domain.startDate).getTime();
  const end = start + domain.durationWeeks * 7 * 86400000;
  const now = Date.now();
  if (now >= end) return 100;
  if (now <= start) return 0;
  return Math.round(((now - start) / (end - start)) * 100);
}
