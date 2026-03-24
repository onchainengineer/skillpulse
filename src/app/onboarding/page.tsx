"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveProfile, UserProfile } from "@/lib/store";
import { LANGUAGES } from "@/lib/languages";
import DailyGoalRing from "@/components/DailyGoalRing";

const ROLES = [
  "Frontend Developer", "Backend Developer", "Full Stack Developer",
  "Data Scientist", "DevOps Engineer", "Mobile Developer",
  "ML Engineer", "Security Engineer", "Product Manager", "Student", "Other",
];

const INTERESTS = [
  "AI & Machine Learning", "Web Development", "Cloud & DevOps",
  "Web3 & Blockchain", "Mobile Development", "Cybersecurity",
  "Data Engineering", "Systems Programming", "Open Source",
  "Startups & Indie Hacking", "UI/UX Design", "Game Development",
];

const DAILY_GOALS = [
  { value: 3, label: "Casual", desc: "3 articles/day", icon: "🌱" },
  { value: 5, label: "Regular", desc: "5 articles/day", icon: "🚀" },
  { value: 10, label: "Intense", desc: "10 articles/day", icon: "🔥" },
  { value: 15, label: "Hardcore", desc: "15 articles/day", icon: "⚡" },
];

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [language, setLanguage] = useState("en");
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState<"beginner" | "intermediate" | "advanced">("intermediate");
  const [interests, setInterests] = useState<string[]>([]);
  const [dailyGoal, setDailyGoal] = useState(5);
  const [projects, setProjects] = useState("");

  const toggleInterest = (interest: string) => {
    setInterests((prev) => prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]);
  };

  const canProceed = () => {
    switch (step) {
      case 0: return name.trim().length >= 2;
      case 1: return true; // language always has default
      case 2: return role.length > 0;
      case 3: return true;
      case 4: return interests.length > 0;
      case 5: return true;
      case 6: return true;
      default: return false;
    }
  };

  const handleFinish = () => {
    const profile: UserProfile = {
      name: name.trim(), role, experience, interests, dailyGoal, language,
      projects: projects.trim(), onboarded: true,
    };
    saveProfile(profile);
    router.push("/explore");
  };

  const next = () => (step === 6 ? handleFinish() : setStep(step + 1));
  const totalSteps = 7;

  return (
    <div className="min-h-screen flex flex-col px-6 py-10 max-w-lg mx-auto">
      {/* Progress */}
      <div className="flex items-center justify-center gap-2 mb-10">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className="h-[3px] rounded-full transition-all duration-500"
            style={{
              width: i === step ? 32 : 16,
              background: i === step ? "#0a84ff" : i < step ? "rgba(10,132,255,0.4)" : "rgba(255,255,255,0.08)",
            }}
          />
        ))}
      </div>

      <div className="flex-1">
        {step === 0 && (
          <div>
            <div className="text-[48px] mb-4">⚡</div>
            <h1 className="text-[28px] font-bold tracking-tight mb-2">
              Welcome to <span style={{ color: "#0a84ff" }}>SkillPulse</span>
            </h1>
            <p className="text-[15px] text-[#86868b] leading-relaxed mb-8">
              Your personalized tech learning companion. Let&apos;s set you up.
            </p>
            <label className="text-[13px] font-medium text-[#86868b] uppercase tracking-wider mb-2 block">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full rounded-xl px-4 py-3.5 text-[17px] font-medium focus:outline-none transition-all duration-200"
              style={{ background: "rgba(28,28,30,0.8)", border: "1px solid rgba(255,255,255,0.1)", color: "#f5f5f7" }}
              onFocus={(e) => (e.target.style.borderColor = "#0a84ff")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
              autoFocus
            />
          </div>
        )}

        {step === 1 && (
          <div>
            <h1 className="text-[28px] font-bold tracking-tight mb-2">Language</h1>
            <p className="text-[15px] text-[#86868b] mb-6">
              Get articles in your preferred language.
            </p>
            <div className="grid grid-cols-2 gap-2 max-h-[420px] overflow-y-auto no-scrollbar">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className="px-4 py-3 rounded-xl text-left transition-all duration-200 press-scale"
                  style={{
                    background: language === l.code ? "#0a84ff" : "rgba(28,28,30,0.8)",
                    color: language === l.code ? "white" : "#f5f5f7",
                    border: `1px solid ${language === l.code ? "transparent" : "rgba(255,255,255,0.06)"}`,
                    boxShadow: language === l.code ? "0 4px 16px rgba(10,132,255,0.3)" : "none",
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-[20px]">{l.flag}</span>
                    <div>
                      <div className="text-[14px] font-medium">{l.name}</div>
                      <div className="text-[11px] mt-0.5" style={{ opacity: language === l.code ? 0.8 : 0.5 }}>{l.nativeName}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h1 className="text-[28px] font-bold tracking-tight mb-2">Your Role</h1>
            <p className="text-[15px] text-[#86868b] mb-6">What best describes you?</p>
            <div className="grid grid-cols-2 gap-2">
              {ROLES.map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className="px-4 py-3 rounded-xl text-[14px] font-medium transition-all duration-200 text-left press-scale"
                  style={{
                    background: role === r ? "#0a84ff" : "rgba(28,28,30,0.8)",
                    color: role === r ? "white" : "#f5f5f7",
                    border: `1px solid ${role === r ? "transparent" : "rgba(255,255,255,0.06)"}`,
                    boxShadow: role === r ? "0 4px 16px rgba(10,132,255,0.3)" : "none",
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h1 className="text-[28px] font-bold tracking-tight mb-2">Experience</h1>
            <p className="text-[15px] text-[#86868b] mb-6">We&apos;ll calibrate for you.</p>
            <div className="space-y-2.5">
              {([
                { level: "beginner" as const, label: "Beginner", desc: "Under 1 year", icon: "🌱" },
                { level: "intermediate" as const, label: "Intermediate", desc: "1-4 years", icon: "🚀" },
                { level: "advanced" as const, label: "Advanced", desc: "5+ years", icon: "⭐" },
              ]).map(({ level, label, desc, icon }) => (
                <button
                  key={level}
                  onClick={() => setExperience(level)}
                  className="w-full px-5 py-4 rounded-2xl text-left transition-all duration-200 press-scale"
                  style={{
                    background: experience === level ? "rgba(10,132,255,0.12)" : "rgba(28,28,30,0.8)",
                    border: `1px solid ${experience === level ? "rgba(10,132,255,0.4)" : "rgba(255,255,255,0.06)"}`,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[24px]">{icon}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-[15px]" style={{ color: experience === level ? "#0a84ff" : "#f5f5f7" }}>{label}</div>
                      <div className="text-[13px] mt-0.5 text-[#86868b]">{desc}</div>
                    </div>
                    <div
                      className="w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center"
                      style={{ borderColor: experience === level ? "#0a84ff" : "rgba(255,255,255,0.15)", background: experience === level ? "#0a84ff" : "transparent" }}
                    >
                      {experience === level && (
                        <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={2.5}>
                          <path d="M2.5 6l2.5 2.5 4.5-5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h1 className="text-[28px] font-bold tracking-tight mb-2">Interests</h1>
            <p className="text-[15px] text-[#86868b] mb-6">Pick what excites you.</p>
            <div className="flex flex-wrap gap-2.5">
              {INTERESTS.map((interest) => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`tag-pill ${interests.includes(interest) ? "tag-pill-active" : "tag-pill-inactive"}`}
                >
                  {interest}
                </button>
              ))}
            </div>
            {interests.length > 0 && (
              <p className="text-[13px] text-[#48484a] mt-4">{interests.length} selected</p>
            )}
          </div>
        )}

        {step === 5 && (
          <div>
            <h1 className="text-[28px] font-bold tracking-tight mb-2">Daily Goal</h1>
            <p className="text-[15px] text-[#86868b] mb-6">
              How many articles do you want to read daily?
            </p>

            <div className="flex justify-center mb-6">
              <DailyGoalRing current={0} goal={dailyGoal} size={120} />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {DAILY_GOALS.map(({ value, label, desc, icon }) => (
                <button
                  key={value}
                  onClick={() => setDailyGoal(value)}
                  className="px-4 py-4 rounded-2xl text-center transition-all duration-200 press-scale"
                  style={{
                    background: dailyGoal === value ? "rgba(10,132,255,0.12)" : "rgba(28,28,30,0.8)",
                    border: `1px solid ${dailyGoal === value ? "rgba(10,132,255,0.4)" : "rgba(255,255,255,0.06)"}`,
                  }}
                >
                  <span className="text-[24px]">{icon}</span>
                  <div className="font-semibold text-[14px] mt-1" style={{ color: dailyGoal === value ? "#0a84ff" : "#f5f5f7" }}>
                    {label}
                  </div>
                  <div className="text-[11px] text-[#86868b] mt-0.5">{desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 6 && (
          <div>
            <h1 className="text-[28px] font-bold tracking-tight mb-2">Almost there!</h1>
            <p className="text-[15px] text-[#86868b] mb-6">
              Any notable projects? This is optional.
            </p>
            <textarea
              value={projects}
              onChange={(e) => setProjects(e.target.value)}
              placeholder="e.g., Built a React dashboard, contributed to open-source..."
              className="w-full rounded-xl px-4 py-3.5 text-[15px] h-36 resize-none focus:outline-none transition-all"
              style={{ background: "rgba(28,28,30,0.8)", border: "1px solid rgba(255,255,255,0.1)", color: "#f5f5f7" }}
              onFocus={(e) => (e.target.style.borderColor = "#0a84ff")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
            />

            {/* Summary */}
            <div className="mt-6 rounded-2xl p-4 space-y-2" style={{ background: "rgba(28,28,30,0.6)", border: "1px solid rgba(255,255,255,0.04)" }}>
              <p className="text-[12px] font-semibold text-[#86868b] uppercase tracking-wider mb-2">Your Setup</p>
              <div className="flex justify-between text-[13px]">
                <span className="text-[#86868b]">Name</span>
                <span className="font-medium text-[#f5f5f7]">{name}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-[#86868b]">Language</span>
                <span className="font-medium text-[#f5f5f7]">{LANGUAGES.find(l => l.code === language)?.flag} {LANGUAGES.find(l => l.code === language)?.name}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-[#86868b]">Role</span>
                <span className="font-medium text-[#f5f5f7]">{role}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-[#86868b]">Level</span>
                <span className="font-medium text-[#f5f5f7] capitalize">{experience}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-[#86868b]">Daily Goal</span>
                <span className="font-medium text-[#f5f5f7]">{dailyGoal} articles</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-[#86868b]">Interests</span>
                <span className="font-medium text-[#0a84ff]">{interests.length} selected</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 mt-8">
        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="px-5 py-3 rounded-[14px] font-semibold text-[15px] transition-all press-scale"
            style={{ background: "rgba(28,28,30,0.8)", color: "#f5f5f7", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            Back
          </button>
        )}
        <button
          onClick={next}
          disabled={!canProceed()}
          className="flex-1 px-5 py-3 rounded-[14px] font-semibold text-[15px] text-white transition-all press-scale disabled:opacity-30"
          style={{
            background: canProceed() ? "#0a84ff" : "rgba(10,132,255,0.4)",
            boxShadow: canProceed() ? "0 4px 16px rgba(10,132,255,0.25)" : "none",
          }}
        >
          {step === 6 ? "Let's Go! 🚀" : "Continue"}
        </button>
      </div>
    </div>
  );
}
