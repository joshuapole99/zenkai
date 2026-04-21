"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CLASSES = [
  { id: "saiyan",   name: "Saiyan Warrior",  description: "Raw power. Built for strength and dominance.",   tag: "Strength"     },
  { id: "shadow",   name: "Shadow Assassin", description: "Speed is everything. Fast, agile, untouchable.", tag: "Speed / Agility" },
  { id: "guardian", name: "Iron Guardian",   description: "Endurance is your superpower. Never stop.",      tag: "Endurance"    },
];

type Step = 1 | 2;

export default function OnboardingClient({ isFoundingMember }: { isFoundingMember: boolean }) {
  const router = useRouter();
  const [showFoundingScreen, setShowFoundingScreen] = useState(isFoundingMember);
  const [step, setStep] = useState<Step>(1);
  const [characterClass, setCharacterClass] = useState("");
  const [characterName, setCharacterName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!characterName.trim()) { setError("Enter your character name."); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ characterClass, characterName }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Something went wrong."); return; }
      router.push("/dashboard");
    } catch {
      setError("No connection. Try again.");
    } finally {
      setLoading(false);
    }
  }

  // ── Founding member interstitial ──────────────────────────────────────────

  if (showFoundingScreen) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12" style={{ background: "#0a0a0a" }}>
        <div className="w-full max-w-sm text-center">
          <div className="mb-8">
            <span
              className="inline-block text-xs font-bold px-3 py-1.5 rounded-full mb-6"
              style={{ background: "rgba(255,215,0,0.08)", color: "#FFD700", border: "1px solid rgba(255,215,0,0.2)" }}
            >
              Founding Member Detected
            </span>
            <h1 className="text-3xl font-black text-white mb-4 leading-tight">You were on the waitlist.</h1>
            <p className="text-gray-400 leading-relaxed text-sm">
              Your exclusive <span style={{ color: "#FFD700" }} className="font-bold">Founding Member skin</span> is reserved.
              It unlocks at official launch when character visuals go live.
            </p>
          </div>
          <div className="rounded-2xl p-6 mb-8 text-left" style={{ background: "rgba(255,215,0,0.03)", border: "1px solid rgba(255,215,0,0.12)" }}>
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "rgba(255,215,0,0.5)" }}>What you get</p>
            <div className="space-y-2 text-sm text-gray-400">
              <p>— Exclusive Founding Member skin (reserved)</p>
              <p>— "Founding Member" badge on your profile</p>
              <p>— Origin Arc — the first story arc</p>
              <p>— Your name in the Founding Member list</p>
            </div>
          </div>
          <button
            onClick={() => setShowFoundingScreen(false)}
            className="w-full py-3.5 rounded-xl text-sm font-black text-white transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ background: "linear-gradient(135deg, #FFD700, #FF6B35)" }}
          >
            Claim your spot
          </button>
        </div>
      </div>
    );
  }

  // ── Main onboarding ───────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12" style={{ background: "#0a0a0a" }}>
      <div className="w-full max-w-md">

        <div className="mb-10 text-center">
          <span className="font-black text-2xl tracking-tight" style={{ background: "linear-gradient(90deg, #FF6B35, #7C3AED)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            ZENKAI
          </span>
          <p className="text-xs text-gray-600 mt-1 tracking-widest uppercase">Character Setup</p>
        </div>

        {/* Step dots */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {([1, 2] as Step[]).map((s) => (
            <div
              key={s}
              className="transition-all duration-300"
              style={{
                width: step === s ? "28px" : "8px",
                height: "8px",
                borderRadius: "4px",
                background: s <= step ? "linear-gradient(90deg, #FF6B35, #7C3AED)" : "rgba(255,255,255,0.1)",
              }}
            />
          ))}
        </div>

        {/* Step 1: Class */}
        {step === 1 && (
          <div>
            <h1 className="text-2xl font-black text-white mb-1">Choose your class</h1>
            <p className="text-sm text-gray-500 mb-6">This defines your training style.</p>
            <div className="space-y-3">
              {CLASSES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => { setCharacterClass(c.id); setStep(2); }}
                  className="w-full text-left rounded-xl p-4 transition-all duration-200"
                  style={{
                    background: characterClass === c.id ? "rgba(255,107,53,0.08)" : "rgba(255,255,255,0.02)",
                    border: characterClass === c.id ? "1px solid rgba(255,107,53,0.5)" : "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{c.name}</span>
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{
                        background: characterClass === c.id ? "rgba(255,107,53,0.15)" : "rgba(255,255,255,0.05)",
                        color: characterClass === c.id ? "#FF6B35" : "#6b7280",
                      }}
                    >
                      {c.tag}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{c.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Name */}
        {step === 2 && (
          <div>
            <h1 className="text-2xl font-black text-white mb-1">Name your character</h1>
            <p className="text-sm text-gray-500 mb-6">This is who you become.</p>
            <input
              type="text"
              autoFocus
              maxLength={20}
              value={characterName}
              onChange={(e) => { setCharacterName(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="e.g. Shadow Goku"
              className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(255,107,53,0.5)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
            />
            <p className="text-xs text-gray-600 mt-2">Max 20 characters.</p>
          </div>
        )}

        {error && (
          <p className="mt-4 text-xs rounded-lg px-3 py-2" style={{ color: "#f87171", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)" }}>
            {error}
          </p>
        )}

        {step === 2 && (
          <div className="mt-8 flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="px-5 py-3 rounded-xl text-sm font-medium text-gray-400 transition-all hover:text-white"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              Back
            </button>
            <button
              onClick={submit}
              disabled={loading}
              className="flex-1 py-3 rounded-xl text-sm font-black text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #FF6B35, #7C3AED)" }}
            >
              {loading ? "Saving..." : "Begin Training"}
            </button>
          </div>
        )}

        <p className="text-center text-xs text-gray-700 mt-4">{step} / 2</p>
      </div>
    </div>
  );
}
