"use client";

import { useState, useEffect } from "react";
import { Quest, xpProgress, calcLevel } from "@/lib/quests";
import { getCharacterImage, CLASS_COLORS } from "@/lib/visuals";
import type { SwapEntry } from "./page";
import type { StoryData } from "./page";
import StoryScreen from "./StoryScreen";
import CompletionScreen from "./CompletionScreen";
import NutritionLog, { type FoodLogData } from "./NutritionLog";

type Alternative = { id: number; name: string; detail: string };
type View = "story" | "workout" | "complete";

type Props = {
  characterName: string;
  characterClass: string;
  fitnessLevel: string;
  xp: number;
  streak: number;
  quests: Quest[];
  today: string;
  initialCompletedIds: number[];
  initialFoodLog: FoodLogData | null;
  initialHp: number;
  initialSwaps: SwapEntry[];
  isFoundingMember: boolean;
  storyNotReadToday: boolean;
  storyData: StoryData;
};

const CLASS_LABELS: Record<string, string> = {
  saiyan: "Saiyan Warrior",
  shadow: "Shadow Assassin",
  guardian: "Iron Guardian",
};

export default function DashboardClient({
  characterName,
  characterClass,
  fitnessLevel,
  xp: initialXp,
  streak: initialStreak,
  quests,
  today,
  initialCompletedIds,
  initialFoodLog,
  initialHp,
  initialSwaps,
  isFoundingMember,
  storyNotReadToday,
  storyData,
}: Props) {
  const [view, setView] = useState<View>(storyNotReadToday ? "story" : "workout");
  const [completedIds, setCompletedIds] = useState<number[]>(initialCompletedIds);
  const [xp, setXp] = useState(initialXp);
  const [streak, setStreak] = useState(initialStreak);
  const [hp, setHp] = useState(initialHp);
  const [completingId, setCompletingId] = useState<number | null>(null);

  // Swap state
  const [swaps, setSwaps] = useState<SwapEntry[]>(initialSwaps);
  const [swappingQuestId, setSwappingQuestId] = useState<number | null>(null);
  const [alternatives, setAlternatives] = useState<Alternative[]>([]);
  const [loadingAlts, setLoadingAlts] = useState(false);
  const [confirmingAltId, setConfirmingAltId] = useState<number | null>(null);

  const { xpIntoLevel, xpRequired, level } = xpProgress(xp);
  const allDone = quests.every((q) => completedIds.includes(q.id));
  const barPercent = Math.min(100, (xpIntoLevel / xpRequired) * 100);

  // Transition to completion screen when all quests done
  useEffect(() => {
    if (allDone && view === "workout") {
      const t = setTimeout(() => setView("complete"), 700);
      return () => clearTimeout(t);
    }
  }, [allDone, view]);

  function getDisplayed(quest: Quest): { name: string; detail: string } {
    const swap = swaps.find((s) => s.original_quest_id === quest.id);
    return swap
      ? { name: swap.exercise_name, detail: swap.exercise_detail }
      : { name: quest.name, detail: quest.detail };
  }

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

  async function openSwap(quest: Quest) {
    if (swappingQuestId === quest.id) { setSwappingQuestId(null); return; }
    setSwappingQuestId(quest.id);
    setAlternatives([]);
    setLoadingAlts(true);
    try {
      const currentNames = quests.map((q) => q.name).join(",");
      const res = await fetch(
        `/api/quest/alternatives?fitnessLevel=${fitnessLevel}&excludeNames=${encodeURIComponent(currentNames)}`
      );
      const data = await res.json();
      setAlternatives(data.alternatives ?? []);
    } finally {
      setLoadingAlts(false);
    }
  }

  async function confirmSwap(originalQuestId: number, alt: Alternative) {
    setConfirmingAltId(alt.id);
    try {
      const res = await fetch("/api/quest/swap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: today, originalQuestId, exerciseId: alt.id }),
      });
      const data = await res.json();
      if (res.ok) {
        setSwaps((prev) => [
          ...prev.filter((s) => s.original_quest_id !== originalQuestId),
          { original_quest_id: originalQuestId, exercise_id: alt.id, exercise_name: data.exercise.name, exercise_detail: data.exercise.detail },
        ]);
        setSwappingQuestId(null);
      }
    } finally {
      setConfirmingAltId(null);
    }
  }

  return (
    <>
      {/* Story overlay */}
      {view === "story" && (
        <StoryScreen
          day={storyData.day}
          title={storyData.title}
          intro={storyData.intro}
          isZenkaiBoost={storyData.isZenkaiBoost}
          background={storyData.background}
          npc={storyData.npc}
          onAccept={() => setView("workout")}
        />
      )}

      {/* Completion overlay */}
      {view === "complete" && (
        <CompletionScreen
          completionText={storyData.completion}
          xpGained={100}
          newLevel={calcLevel(xp)}
          nextChapterTitle={storyData.nextChapterTitle}
          isZenkaiBoost={storyData.isZenkaiBoost}
          onContinue={() => setView("workout")}
        />
      )}

      {/* Workout dashboard */}
      <div className="max-w-lg mx-auto px-4 py-8 space-y-6">

        {/* Character header */}
        <div
          className="rounded-2xl p-6"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
          <p className="text-xs font-medium tracking-widest uppercase mb-1" style={{ color: "#FF6B35" }}>
            {CLASS_LABELS[characterClass] ?? characterClass}
          </p>
          <div className="flex items-center gap-3 flex-wrap mb-1">
            <h1
              className="text-3xl font-black leading-none"
              style={{ color: isFoundingMember ? "#FFD700" : "#fff" }}
            >
              {characterName}
            </h1>
            {isFoundingMember && (
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-full"
                style={{ background: "rgba(255,215,0,0.1)", color: "#FFD700", border: "1px solid rgba(255,215,0,0.25)" }}
              >
                Founding Member
              </span>
            )}
          </div>
          {isFoundingMember && (
            <div className="mb-3">
              <p className="text-xs font-bold" style={{ color: "rgba(255,215,0,0.7)" }}>Founding Member — Origin Arc</p>
              <p className="text-xs text-gray-600 mt-0.5">Exclusive skin unlocks at official launch</p>
            </div>
          )}
          {!isFoundingMember && <div className="mb-4" />}

          <div className="grid grid-cols-3 gap-3">
            <Stat label="Power Level" value={`${level}`} />
            <Stat label="XP Total" value={`${xp}`} />
            <Stat label="Streak" value={`${streak}d`} accent={streak > 0} />
          </div>
            </div>

            {/* Character image */}
            <CharacterImage characterClass={characterClass} level={level} />
          </div>
        </div>

        {/* XP bar */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-gray-500">Level {level}</span>
            <span className="text-xs text-gray-600">{xpIntoLevel} / {xpRequired} XP</span>
          </div>
          <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${barPercent}%`, background: "linear-gradient(90deg, #FF6B35, #7C3AED)" }}
            />
          </div>
          <p className="text-xs text-gray-700 mt-1">{xpRequired - xpIntoLevel} XP to Level {level + 1}</p>
        </div>

        {/* HP bar */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-gray-500">HP — Today&apos;s Nutrition</span>
            <span className="text-xs text-gray-600">{hp} / 100</span>
          </div>
          <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${hp}%`, background: "#22c55e" }}
            />
          </div>
        </div>

        {/* Daily quests */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold tracking-widest uppercase text-gray-500">Daily Quests</h2>
            {allDone && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(124,58,237,0.15)", color: "#7C3AED" }}>
                +100 XP
              </span>
            )}
          </div>

          <div className="space-y-3">
            {quests.map((quest) => {
              const done = completedIds.includes(quest.id);
              const loading = completingId === quest.id;
              const isSwapping = swappingQuestId === quest.id;
              const isSwapped = swaps.some((s) => s.original_quest_id === quest.id);
              const displayed = getDisplayed(quest);

              return (
                <div key={quest.id}>
                  <div
                    className="rounded-xl p-4 transition-all duration-200"
                    style={{
                      background: done ? "rgba(124,58,237,0.05)" : "rgba(255,255,255,0.02)",
                      border: done ? "1px solid rgba(124,58,237,0.2)" : isSwapping ? "1px solid rgba(255,107,53,0.3)" : "1px solid rgba(255,255,255,0.06)",
                      borderBottomLeftRadius: isSwapping ? "0" : undefined,
                      borderBottomRightRadius: isSwapping ? "0" : undefined,
                      borderBottom: isSwapping ? "none" : undefined,
                    }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold" style={{ color: done ? "#7C3AED" : "#fff" }}>
                            {displayed.name}
                          </p>
                          {isSwapped && !done && (
                            <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ background: "rgba(255,107,53,0.1)", color: "#FF6B35" }}>
                              swapped
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mt-0.5">{displayed.detail}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {!done && (
                          <button
                            onClick={() => openSwap(quest)}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95"
                            style={{
                              background: isSwapping ? "rgba(255,107,53,0.15)" : "rgba(255,255,255,0.05)",
                              color: isSwapping ? "#FF6B35" : "#6b7280",
                              border: isSwapping ? "1px solid rgba(255,107,53,0.3)" : "1px solid rgba(255,255,255,0.06)",
                            }}
                          >
                            {isSwapping ? "Cancel" : "Swap"}
                          </button>
                        )}
                        <button
                          onClick={() => completeQuest(quest.id)}
                          disabled={done || loading}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 disabled:cursor-default"
                          style={
                            done
                              ? { background: "rgba(124,58,237,0.1)", color: "#7C3AED" }
                              : { background: "linear-gradient(135deg, #FF6B35, #7C3AED)", color: "#fff", opacity: loading ? 0.6 : 1 }
                          }
                        >
                          {done ? "Done" : loading ? "..." : "Complete"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {isSwapping && (
                    <div
                      className="rounded-b-xl px-4 py-3 space-y-2"
                      style={{ background: "rgba(255,107,53,0.03)", border: "1px solid rgba(255,107,53,0.3)", borderTop: "1px solid rgba(255,107,53,0.1)" }}
                    >
                      <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "rgba(255,107,53,0.6)" }}>
                        Choose alternative
                      </p>
                      {loadingAlts ? (
                        <p className="text-xs text-gray-600 py-2">Loading...</p>
                      ) : alternatives.length === 0 ? (
                        <p className="text-xs text-gray-600 py-2">No alternatives found.</p>
                      ) : (
                        alternatives.map((alt) => (
                          <button
                            key={alt.id}
                            onClick={() => confirmSwap(quest.id, alt)}
                            disabled={confirmingAltId !== null}
                            className="w-full text-left rounded-xl px-4 py-3 transition-all active:scale-[0.99] disabled:opacity-50"
                            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <p className="text-sm font-bold text-white">{alt.name}</p>
                                <p className="text-xs text-gray-600 mt-0.5">{alt.detail}</p>
                              </div>
                              <span
                                className="text-xs font-bold px-2.5 py-1 rounded-lg shrink-0"
                                style={{ background: "linear-gradient(135deg, #FF6B35, #7C3AED)", color: "#fff", opacity: confirmingAltId === alt.id ? 0.6 : 1 }}
                              >
                                {confirmingAltId === alt.id ? "..." : "Pick"}
                              </span>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <NutritionLog
          initialFoodLog={initialFoodLog}
          initialHp={initialHp}
          onHpChange={(newHp) => setHp(newHp)}
        />
      </div>
    </>
  );
}

function CharacterImage({ characterClass, level }: { characterClass: string; level: number }) {
  const color = CLASS_COLORS[characterClass] ?? "#FF6B35";
  const imagePath = getCharacterImage(characterClass, level);
  const stage = level >= 16 ? 3 : level >= 6 ? 2 : 1;

  return (
    <div
      className="relative flex-shrink-0 rounded-xl overflow-hidden flex items-center justify-center"
      style={{ width: "72px", height: "96px", background: `${color}18`, border: `1px solid ${color}30` }}
    >
      <img
        src={imagePath}
        alt=""
        className="w-full h-full object-cover"
        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 pointer-events-none">
        <span className="text-xs font-black" style={{ color }}>Lv.{stage}</span>
        <span className="text-[9px] text-gray-600 text-center px-1 leading-tight">{characterClass}</span>
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
      <p className="text-xl font-black" style={{ color: accent ? "#FF6B35" : "#fff" }}>{value}</p>
    </div>
  );
}
