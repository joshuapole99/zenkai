"use client";

import { useState, useEffect } from "react";
import { Quest, xpProgress } from "@/lib/quests";

type Props = {
  characterName: string;
  characterClass: string;
  xp: number;
  streak: number;
  quests: Quest[];
  initialCompletedIds: number[];
  initialFoodLogged: boolean;
  initialAteEnough: boolean | null;
};

const CLASS_LABELS: Record<string, string> = {
  saiyan: "Saiyan Warrior",
  shadow: "Shadow Assassin",
  guardian: "Iron Guardian",
};

export default function DashboardClient({
  characterName,
  characterClass,
  xp: initialXp,
  streak: initialStreak,
  quests,
  initialCompletedIds,
  initialFoodLogged,
  initialAteEnough,
}: Props) {
  const [completedIds, setCompletedIds] = useState<number[]>(initialCompletedIds);
  const [xp, setXp] = useState(initialXp);
  const [streak, setStreak] = useState(initialStreak);
  const [foodLogged, setFoodLogged] = useState(initialFoodLogged);
  const [ateEnough, setAteEnough] = useState<boolean | null>(initialAteEnough);
  const [completingId, setCompletingId] = useState<number | null>(null);
  const [justFinished, setJustFinished] = useState(false);

  const { xpIntoLevel, xpRequired, level } = xpProgress(xp);
  const allDone = quests.every((q) => completedIds.includes(q.id));
  const barPercent = Math.min(100, (xpIntoLevel / xpRequired) * 100);

  useEffect(() => {
    if (allDone && completedIds.length === quests.length && completedIds !== initialCompletedIds) {
      setJustFinished(true);
      const t = setTimeout(() => setJustFinished(false), 3000);
      return () => clearTimeout(t);
    }
  }, [allDone]);

  async function completeQuest(questId: number) {
    if (completedIds.includes(questId) || completingId !== null) return;
    setCompletingId(questId);
    try {
      const res = await fetch("/api/quest/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questId }),
      });
      const data = await res.json();
      if (res.ok) {
        setCompletedIds(data.completedIds);
        if (data.newXp !== null) setXp(data.newXp);
        if (data.newStreak !== null) setStreak(data.newStreak);
      }
    } finally {
      setCompletingId(null);
    }
  }

  async function logFood(ate: boolean) {
    if (foodLogged) return;
    setAteEnough(ate);
    setFoodLogged(true);
    await fetch("/api/food-check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ateEnough: ate }),
    });
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8 space-y-6">

      {/* Character header */}
      <div
        className="rounded-2xl p-6"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <p className="text-xs font-medium tracking-widest uppercase mb-1" style={{ color: "#FF6B35" }}>
          {CLASS_LABELS[characterClass] ?? characterClass}
        </p>
        <h1 className="text-3xl font-black text-white leading-none mb-4">{characterName}</h1>

        <div className="grid grid-cols-3 gap-3">
          <Stat label="Power Level" value={`${level}`} />
          <Stat label="XP Total" value={`${xp}`} />
          <Stat label="Streak" value={`${streak}d`} accent={streak > 0} />
        </div>
      </div>

      {/* XP bar */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium text-gray-500">Level {level}</span>
          <span className="text-xs text-gray-600">{xpIntoLevel} / {xpRequired} XP</span>
        </div>
        <div
          className="w-full h-2 rounded-full overflow-hidden"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${barPercent}%`,
              background: "linear-gradient(90deg, #FF6B35, #7C3AED)",
            }}
          />
        </div>
        <p className="text-xs text-gray-700 mt-1">{xpRequired - xpIntoLevel} XP to Level {level + 1}</p>
      </div>

      {/* Daily quests */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold tracking-widest uppercase text-gray-500">Daily Quests</h2>
          {allDone && (
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ background: "rgba(124,58,237,0.15)", color: "#7C3AED" }}
            >
              +100 XP
            </span>
          )}
        </div>

        {justFinished && (
          <div
            className="rounded-xl px-4 py-3 mb-3 text-center"
            style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)" }}
          >
            <p className="text-sm font-black" style={{ color: "#7C3AED" }}>ALL QUESTS COMPLETE</p>
            <p className="text-xs text-gray-500 mt-0.5">+100 XP earned. Streak extended.</p>
          </div>
        )}

        <div className="space-y-3">
          {quests.map((quest) => {
            const done = completedIds.includes(quest.id);
            const loading = completingId === quest.id;
            return (
              <div
                key={quest.id}
                className="rounded-xl p-4 flex items-center justify-between transition-all duration-200"
                style={{
                  background: done ? "rgba(124,58,237,0.05)" : "rgba(255,255,255,0.02)",
                  border: done
                    ? "1px solid rgba(124,58,237,0.2)"
                    : "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div>
                  <p
                    className="text-sm font-bold"
                    style={{ color: done ? "#7C3AED" : "#fff" }}
                  >
                    {quest.name}
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">{quest.detail}</p>
                </div>
                <button
                  onClick={() => completeQuest(quest.id)}
                  disabled={done || loading}
                  className="ml-4 px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 disabled:cursor-default"
                  style={
                    done
                      ? { background: "rgba(124,58,237,0.1)", color: "#7C3AED" }
                      : {
                          background: "linear-gradient(135deg, #FF6B35, #7C3AED)",
                          color: "#fff",
                          opacity: loading ? 0.6 : 1,
                        }
                  }
                >
                  {done ? "Done" : loading ? "..." : "Complete"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Food check */}
      <div
        className="rounded-2xl p-5"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <h2 className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-3">Daily Food Check</h2>
        {foodLogged ? (
          <div className="text-center py-2">
            <p className="text-sm font-bold" style={{ color: ateEnough ? "#FF6B35" : "#6b7280" }}>
              {ateEnough ? "Fueled up. HP maintained." : "Logged. Eat better tomorrow."}
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-400 mb-4">Did you eat enough today?</p>
            <div className="flex gap-3">
              <button
                onClick={() => logFood(true)}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 active:scale-[0.98]"
                style={{ background: "linear-gradient(135deg, #FF6B35, #7C3AED)", color: "#fff" }}
              >
                Yes
              </button>
              <button
                onClick={() => logFood(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 active:scale-[0.98]"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#9ca3af",
                }}
              >
                No
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div
      className="rounded-xl p-3 text-center"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
    >
      <p className="text-xs text-gray-600 mb-1">{label}</p>
      <p
        className="text-xl font-black"
        style={{ color: accent ? "#FF6B35" : "#fff" }}
      >
        {value}
      </p>
    </div>
  );
}
