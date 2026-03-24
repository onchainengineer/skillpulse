"use client";

interface Props {
  current: number;
  goal: number;
  size?: number;
}

export default function DailyGoalRing({ current, goal, size = 120 }: Props) {
  const progress = Math.min(1, current / Math.max(1, goal));
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - progress * circumference;
  const completed = current >= goal;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={8}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={completed ? "#30d158" : "#0a84ff"}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)" }}
        />
        {completed && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={completed ? "rgba(48, 209, 88, 0.15)" : "transparent"}
            strokeWidth={20}
            style={{ filter: "blur(8px)" }}
          />
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {completed ? (
          <>
            <span className="text-[28px]">🎯</span>
            <span className="text-[10px] font-bold text-[#30d158] mt-0.5 uppercase tracking-wider">Done!</span>
          </>
        ) : (
          <>
            <span className="text-[24px] font-bold text-[#f5f5f7]">{current}</span>
            <span className="text-[10px] font-medium text-[#86868b]">of {goal}</span>
          </>
        )}
      </div>
    </div>
  );
}
