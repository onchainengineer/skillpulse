"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getProfile } from "@/lib/store";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const profile = getProfile();
    if (profile?.onboarded) {
      router.replace("/dashboard");
    } else {
      router.replace("/onboarding");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-3 animate-pulse">⚡</div>
        <p className="text-slate-400 text-sm">Loading SkillPulse...</p>
      </div>
    </div>
  );
}
