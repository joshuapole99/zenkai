"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Step = 1 | 2 | 3 | 4 | 5;

const CLASSES = [
  { id: "saiyan",   name: "Saiyan Warrior",  description: "Raw power. Built for strength and dominance.",     tag: "Strength" },
  { id: "shadow",   name: "Shadow Assassin", description: "Speed is everything. Fast, agile, untouchable.",   tag: "Speed / Agility" },
  { id: "guardian", name: "Iron Guardian",   description: "Endurance is your superpower. Never stop.",        tag: "Endurance" },
];

const GOALS = [
  { id: "stronger",   label: "Get Stronger",    sub: "Build power level through strength training" },
  { id: "weight",     label: "Lose Weight",      sub: "Burn calories, transform your body" },
  { id: "consistent", label: "Be Consistent",    sub: "Build the habit. Show up every day" },
];

const FITNESS_LEVELS = [
  { id: "beginner",     label: "Beginner",     sub: "Just starting out" },
  { id: "intermediate", label: "Intermediate", sub: "Training for a while" },
  { id: "advanced",     label: "Advanced",     sub: "Serious about it" },
];

export default function OnboardingClient({ isFoundingMember }: { isFoundingMember: boolean }) {
  const router = useRouter();
  const [showFoundingScreen, setShowFoundingScreen] = useState(isFoundingMember);
  const [step, setStep] = useState<Step>(1);
  const [characterClass, setCharacterClass] = useState("");
  const [goal, setGoal] = useState("");
  const [fitnessLevel, setFitnessLevel] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [age, setAge] = useState("");
  const [characterName, setCharacterName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function next() {
    setError("");
    if (step === 1 && !characterClass) { setError("Choose your class."); return; }
    if (step === 2 && !goal) { setError("Choose your goal."); return; }
    if (step === 3 && !fitnessLevel) { setError("Choose your level."); return; }
    if (step < 5) setStep((s) => (s + 1) as Step);
  }

  function skipBodyStats() {
    setWeightKg("");
    setHeightCm("");
    setAge("");
    setError("");
    setStep(5);
  }

  async function submit() {
    if (!characterName.trim()) { setError("Enter your character name."); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          characterClass,
          goal,
          fitnessLevel,
          characterName,
          weightKg: weightKg ? Number(weightKg) : null,
          heightCm: heightCm ? Number(heightCm) : null,
          age: age ? Number(age) : null,
        }),
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

  if (showFoundingScreen) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
        style={{ background: "#0a0a0a" }}
      >
        <div className="w-full max-w-sm text-center">
          <div className="mb-8">
            <span
              className="inline-block text-xs font-bold px-3 py-1.5 rounded-full mb-6"
              style={{ background: "rgba(255,215,0,0.08)", color: "#FFD700", border: "1px solid rgba(255,215,0,0.2)" }}
            >
              Founding Member Detected
            </span>
            <h1 className="text-3xl font-black text-white mb-4 leading-tight">
              You were on the waitlist.
            </h1>
            <p className="text-gray-400 leading-relaxed text-sm">
              Your exclusive{" "}
              <span style={{ color: "#FFD700" }} className="font-bold">Founding Member skin</span>{" "}
              is reserved. It unlocks at official launch when character visuals go live.
            </p>
          </div>

          <div
            className="rounded-2xl p-6 mb-8 text-left"
            style={{ background: "rgba(255,215,0,0.03)", border: "1px solid rgba(255,215,0,0.12)" }}
          >
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "rgba(255,215,0,0.5)" }}>
              What you get
            </p>
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12" style={{ background: "#0a0a0a" }}>
      <div className="w-full max-w-md">

        <div className="mb-10 text-center">
          <span className="font-black text-2xl tracking-tight gradient-text">ZENKAI</span>
          <p className="text-xs text-gray-600 mt-1 tracking-widest uppercase">Character Setup</p>
        </div>

        {/* Step dots */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {([1, 2, 3, 4, 5] as Step[]).map((s) => (
            <div
              key={s}
              className="transition-all duration-300"
              style={{
                width: step === s ? "28px" : "8px",
                height: "8px",
                borderRadius: "4px",
                background: s <= step
                  ? "linear-gradient(90deg, #FF6B35, #7C3AED)"
                  : "rgba(255,255,255,0.1)",
              }}
            />
          ))}
        </div>

        {step === 1 && (
          <div>
            <h1 className="text-2xl font-black text-white mb-1">Choose your class</h1>
            <p className="text-sm text-gray-500 mb-6">This defines your training style.</p>
            <div className="space-y-3">
              {CLASSES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCharacterClass(c.id)}
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

        {step === 2 && (
          <div>
            <h1 className="text-2xl font-black text-white mb-1">Set your goal</h1>
            <p className="text-sm text-gray-500 mb-6">What are you training for?</p>
            <div className="space-y-3">
              {GOALS.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setGoal(g.id)}
                  className="w-full text-left rounded-xl p-4 transition-all duration-200"
                  style={{
                    background: goal === g.id ? "rgba(124,58,237,0.08)" : "rgba(255,255,255,0.02)",
                    border: goal === g.id ? "1px solid rgba(124,58,237,0.5)" : "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <span className="font-bold text-white text-sm">{g.label}</span>
                  <p className="text-xs text-gray-500 mt-0.5">{g.sub}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h1 className="text-2xl font-black text-white mb-1">Current level</h1>
            <p className="text-sm text-gray-500 mb-6">Be honest. We calibrate quests to you.</p>
            <div className="space-y-3">
              {FITNESS_LEVELS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setFitnessLevel(l.id)}
                  className="w-full text-left rounded-xl p-4 transition-all duration-200"
                  style={{
                    background: fitnessLevel === l.id ? "rgba(255,107,53,0.08)" : "rgba(255,255,255,0.02)",
                    border: fitnessLevel === l.id ? "1px solid rgba(255,107,53,0.5)" : "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <span className="font-bold text-white text-sm">{l.label}</span>
                  <p className="text-xs text-gray-500 mt-0.5">{l.sub}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h1 className="text-2xl font-black text-white mb-1">Your body stats</h1>
            <p className="text-sm text-gray-500 mb-6">Used to calculate your daily protein goal.</p>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold tracking-widest uppercase text-gray-500 block mb-2">
                  Weight
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="30"
                    max="300"
                    value={weightKg}
                    onChange={(e) => { setWeightKg(e.target.value); setError(""); }}
                    placeholder="70"
                    className="w-full px-4 py-3 pr-12 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(255,107,53,0.5)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-600">kg</span>
                </div>
                {weightKg && Number(weightKg) > 0 && (
                  <p className="text-xs mt-1.5" style={{ color: "#FF6B35" }}>
                    Daily protein goal: <strong>{Math.round(Number(weightKg) * 1.8)}g</strong>
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold tracking-widest uppercase text-gray-500 block mb-2">
                  Height
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="100"
                    max="250"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    placeholder="175"
                    className="w-full px-4 py-3 pr-12 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(255,107,53,0.5)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-600">cm</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold tracking-widest uppercase text-gray-500 block mb-2">
                  Age
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="22"
                    className="w-full px-4 py-3 pr-16 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(255,107,53,0.5)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-600">years</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <h1 className="text-2xl font-black text-white mb-1">Name your character</h1>
            <p className="text-sm text-gray-500 mb-6">This is who you become.</p>
            <input
              type="text"
              autoFocus
              maxLength={20}
              value={characterName}
              onChange={(e) => { setCharacterName(e.target.value); setError(""); }}
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
          <p
            className="mt-4 text-xs rounded-lg px-3 py-2"
            style={{ color: "#f87171", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)" }}
          >
            {error}
          </p>
        )}

        <div className="mt-8 flex gap-3">
          {step > 1 && (
            <button
              onClick={() => setStep((s) => (s - 1) as Step)}
              className="px-5 py-3 rounded-xl text-sm font-medium text-gray-400 transition-all hover:text-white"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              Back
            </button>
          )}
          <button
            onClick={step === 5 ? submit : next}
            disabled={loading}
            className="flex-1 py-3 rounded-xl text-sm font-black text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #FF6B35, #7C3AED)" }}
          >
            {loading ? "Saving..." : step === 5 ? "Begin Training" : "Continue"}
          </button>
        </div>

        {step === 4 && (
          <button
            onClick={skipBodyStats}
            className="w-full mt-3 text-xs text-gray-700 hover:text-gray-500 transition-colors py-2"
          >
            Skip for now
          </button>
        )}

        <p className="text-center text-xs text-gray-700 mt-4">{step} / 5</p>
      </div>
    </div>
  );
}
