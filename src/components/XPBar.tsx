"use client";
import { XPData, getLevelProgress } from "@/lib/store";

export default function XPBar({ xp }: { xp: XPData }) {
  const progress = getLevelProgress(xp);

  return (
    <div className="flex items-center gap-3">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold text-white shrink-0"
        style={{
          background: "linear-gradient(135deg, #ff9f0a, #ff6723)",
          boxShadow: "0 2px 8px rgba(255, 159, 10, 0.3)",
        }}
      >
        {xp.level}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-semibold text-[#86868b]">Level {xp.level}</span>
          <span className="text-[11px] font-medium text-[#48484a]">{xp.total} XP</span>
        </div>
        <div className="w-full h-[4px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #ff9f0a, #ff6723)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
