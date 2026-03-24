"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { DOMAINS, DomainConfig } from "@/lib/domains";
import { getProfile, getActiveDomain, saveActiveDomain, ActiveDomain } from "@/lib/store";

export default function Explore() {
  const router = useRouter();
  const [selectedDomain, setSelectedDomain] = useState<DomainConfig | null>(null);
  const [weeks, setWeeks] = useState(4);
  const [activeDomain, setActiveDomain] = useState<ActiveDomain | null>(null);
  const profile = typeof window !== "undefined" ? getProfile() : null;

  useEffect(() => { setActiveDomain(getActiveDomain()); }, []);

  const handleStartLearning = () => {
    if (!selectedDomain) return;
    const domain: ActiveDomain = {
      id: selectedDomain.id, name: selectedDomain.name, icon: selectedDomain.icon,
      startDate: new Date().toISOString(), durationWeeks: weeks,
      subreddits: selectedDomain.subreddits, hnTags: selectedDomain.hnTags, devtoTags: selectedDomain.devtoTags,
    };
    saveActiveDomain(domain);
    router.push("/dashboard");
  };

  const suggestedWeeks = selectedDomain
    ? selectedDomain.suggestedWeeks[profile?.experience || "intermediate"]
    : 4;

  return (
    <main className="min-h-screen pb-[70px] px-5 pt-[52px] max-w-lg mx-auto">
      <div className="mb-1">
        <h1 className="text-[26px] font-bold tracking-tight">Explore</h1>
        <p className="text-[14px] text-[#86868b] mt-1">
          {activeDomain ? `Learning: ${activeDomain.name}` : "Pick your next skill journey"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5 mt-6">
        {DOMAINS.map((domain) => {
          const isActive = activeDomain?.id === domain.id;
          return (
            <button
              key={domain.id}
              onClick={() => {
                setSelectedDomain(domain);
                setWeeks(domain.suggestedWeeks[profile?.experience || "intermediate"]);
              }}
              className="relative p-4 rounded-[18px] text-left transition-all duration-200 press-scale group"
              style={{
                background: isActive
                  ? "rgba(10, 132, 255, 0.08)"
                  : "rgba(28, 28, 30, 0.6)",
                border: `1px solid ${isActive ? "rgba(10, 132, 255, 0.25)" : "rgba(255,255,255,0.04)"}`,
              }}
            >
              <div className="text-[26px] mb-3">{domain.icon}</div>
              <div className="text-[14px] font-semibold text-[#f5f5f7] leading-tight">{domain.name}</div>
              <div className="text-[11px] text-[#6e6e73] mt-1.5 leading-snug line-clamp-2">
                {domain.description}
              </div>
              {isActive && (
                <div className="mt-2.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#0a84ff" }}>
                    Active
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Modal */}
      {selectedDomain && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center px-5"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", animation: "fadeOverlay 0.2s ease" }}
          onClick={() => setSelectedDomain(null)}
        >
          <div
            className="w-full max-w-[360px] rounded-[20px] p-6"
            style={{
              background: "#1c1c1e",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
              animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-[24px]" style={{ background: "rgba(255,255,255,0.06)" }}>
                {selectedDomain.icon}
              </div>
              <div>
                <h2 className="text-[17px] font-semibold tracking-tight">{selectedDomain.name}</h2>
                <p className="text-[13px] text-[#86868b] mt-0.5">{selectedDomain.description}</p>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-[13px] font-medium text-[#86868b]">Duration</label>
                <span className="text-[15px] font-bold" style={{ color: "#0a84ff" }}>
                  {weeks} week{weeks > 1 ? "s" : ""}
                </span>
              </div>
              <input type="range" min={1} max={8} value={weeks} onChange={(e) => setWeeks(Number(e.target.value))} className="w-full" />
              <p className="text-[11px] text-[#48484a] mt-2">
                Suggested: {suggestedWeeks}w for {profile?.experience || "intermediate"}
              </p>
            </div>

            <div className="flex gap-2.5">
              <button
                onClick={() => setSelectedDomain(null)}
                className="flex-1 px-4 py-3 rounded-[14px] font-semibold text-[14px] transition-all duration-200 press-scale"
                style={{ background: "rgba(255,255,255,0.06)", color: "#f5f5f7", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                Cancel
              </button>
              <button
                onClick={handleStartLearning}
                className="flex-[1.5] px-4 py-3 rounded-[14px] font-semibold text-[14px] text-white transition-all duration-200 press-scale"
                style={{ background: "#0a84ff", boxShadow: "0 4px 16px rgba(10,132,255,0.3)" }}
              >
                Start Learning
              </button>
            </div>
          </div>
        </div>
      )}

      <Navbar />
    </main>
  );
}
