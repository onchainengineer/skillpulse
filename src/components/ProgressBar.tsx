"use client";

export default function ProgressBar({
  value,
  className = "",
}: {
  value: number;
  className?: string;
}) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={`w-full h-[5px] rounded-full overflow-hidden ${className}`} style={{ background: "rgba(255,255,255,0.08)" }}>
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{
          width: `${clamped}%`,
          background: "linear-gradient(90deg, #0a84ff, #5e5ce6, #bf5af2)",
        }}
      />
    </div>
  );
}
