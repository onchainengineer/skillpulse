"use client";
import { Achievement } from "@/lib/store";
import { useEffect, useState } from "react";

export default function AchievementToast({ achievement, onDismiss }: { achievement: Achievement; onDismiss: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 400);
    }, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      className="fixed top-12 left-1/2 z-[100] -translate-x-1/2 transition-all duration-400"
      style={{
        opacity: visible ? 1 : 0,
        transform: `translateX(-50%) translateY(${visible ? 0 : -20}px) scale(${visible ? 1 : 0.95})`,
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div
        className="flex items-center gap-3 px-5 py-3 rounded-2xl"
        style={{
          background: "rgba(28, 28, 30, 0.95)",
          backdropFilter: "blur(40px)",
          border: "1px solid rgba(255, 159, 10, 0.25)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
        }}
      >
        <span className="text-[28px]">{achievement.icon}</span>
        <div>
          <p className="text-[12px] font-bold text-[#ff9f0a] uppercase tracking-wider">Achievement Unlocked</p>
          <p className="text-[14px] font-semibold text-[#f5f5f7]">{achievement.title}</p>
        </div>
      </div>
    </div>
  );
}
