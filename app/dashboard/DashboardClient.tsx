"use client";

import { useState } from "react";
import MomentScreen from "./MomentScreen";
import type { WorkoutPlan } from "./page";

type View = "workout" | "moment" | "done";

type Props = {
  characterName: string;
  characterClass: string;
  xp: number;
  streak: number;
  workoutPlan: WorkoutPlan | null;
  thisWeekLogs: string[];
  isLoggedToday: boolean;
  today: string;
  weakSpot: string | null;
  fighterType: string | null;
  isZenkaiBoost: boolean;
  isFoundingMember: boolean;
  lastWorkoutDate: string | null;
};

// 0=Mon, 6=Sun in our system. JS Date.getDay(): 0=Sun → our 6, 1=Mon → our 0
function jsDownToOurIndex(jsDow: number): number {
  return (jsDow + 6) % 7;
}

function getWeekDates(today: string): string[] {
  const d = new Date(today + "T00:00:00");
  const dow = d.getDay();
  const offset = dow === 0 ? -6 : 1 - dow; // go to Monday
  const monday = new Date(d);
  monday.setDate(monday.getDate() + offset);
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    return day.toISOString().slice(0, 10);
  });
}

// ── WeekCalendar ──────────────────────────────────────────────────────────────

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function WeekCalendar({
  plan,
  thisWeekLogs,
  today,
}: {
  plan: WorkoutPlan | null;
  thisWeekLogs: string[];
  today: string;
}) {
  const weekDates = getWeekDates(today);
  const workoutDayIndices = plan?.dayIndices ?? [];

  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-bold tracking-widest uppercase text-gray-500">This week</h2>
        {plan && workoutDayIndices.length > 0 && (
          <span className="text-xs text-gray-600">
            {thisWeekLogs.filter((d) => weekDates.includes(d) && workoutDayIndices.includes(weekDates.indexOf(d))).length}
            {" / "}
            {workoutDayIndices.length} workouts
          </span>
        )}
      </div>

      <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(7, 1fr)" }}>
        {DAY_LABELS.map((label, i) => {
          const dateStr = weekDates[i];
          const isToday = dateStr === today;
          const isWorkoutDay = workoutDayIndices.includes(i);
          const isDone = thisWeekLogs.includes(dateStr);
          const isPast = dateStr < today;

          return (
            <div
              key={label}
              style={{
                borderRadius: "10px",
                padding: "10px 4px",
                textAlign: "center",
                background: isToday
                  ? "rgba(255,107,53,0.08)"
                  : isWorkoutDay && isDone
                  ? "rgba(34,197,94,0.05)"
                  : "rgba(255,255,255,0.02)",
                border: isToday
                  ? "1px solid rgba(255,107,53,0.35)"
                  : isWorkoutDay && isDone
                  ? "1px solid rgba(34,197,94,0.2)"
                  : "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <p
                style={{
                  fontSize: "9px",
                  fontWeight: 700,
                  color: isToday ? "rgba(255,107,53,0.7)" : "rgba(255,255,255,0.3)",
                  marginBottom: "6px",
                }}
              >
                {label}
              </p>

              {isWorkoutDay ? (
                isDone ? (
                  <p style={{ fontSize: "14px", color: "#22c55e" }}>✓</p>
                ) : isToday ? (
                  <p style={{ fontSize: "9px", color: "#FF6B35", fontWeight: 700 }}>Today</p>
                ) : isPast ? (
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.12)" }}>○</p>
                ) : (
                  <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.2)" }}>–</p>
                )
              ) : (
                <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.15)" }}>Rest</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Exercise preview for workout days */}
      {plan && plan.exercises.length > 0 && (
        <div
          className="mt-4 pt-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <p className="text-xs text-gray-700 mb-2">Your workout</p>
          <div className="flex flex-wrap gap-2">
            {plan.exercises.map((ex, i) => (
              <span
                key={i}
                className="text-xs px-2.5 py-1 rounded-lg"
                style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                {ex.name}{ex.detail ? ` · ${ex.detail}` : ""}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── TodayCard ─────────────────────────────────────────────────────────────────

function TodayCard({
  plan,
  isLoggedToday,
  today,
  isZenkaiBoost,
  weakSpot,
  onComplete,
  loading,
}: {
  plan: WorkoutPlan | null;
  isLoggedToday: boolean;
  today: string;
  isZenkaiBoost: boolean;
  weakSpot: string | null;
  onComplete: () => void;
  loading: boolean;
}) {
  const todayDow = jsDownToOurIndex(new Date(today + "T00:00:00").getDay());
  const isTodayWorkoutDay = plan?.dayIndices.includes(todayDow) ?? false;

  const dayName = new Date(today + "T00:00:00").toLocaleDateString("en-US", { weekday: "long" });
  const dateFormatted = new Date(today + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric" });

  // No plan set yet
  if (!plan) {
    return (
      <div
        className="rounded-2xl p-6"
        style={{ background: "rgba(255,107,53,0.04)", border: "1px solid rgba(255,107,53,0.15)" }}
      >
        <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "rgba(255,107,53,0.6)" }}>
          Get started
        </p>
        <h3 className="text-lg font-black text-white mb-2">Design your first week</h3>
        <p className="text-sm text-gray-500 mb-4 leading-relaxed">
          Add your exercises, pick your training days, and Zenkai handles the rest.
        </p>
        <a
          href="/onboarding"
          className="inline-block px-5 py-2.5 rounded-xl text-sm font-black text-white transition-all hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #FF6B35, #7C3AED)" }}
        >
          Set up my week
        </a>
      </div>
    );
  }

  // Already done today
  if (isLoggedToday) {
    return (
      <div
        className="rounded-2xl p-6"
        style={{ background: "rgba(34,197,94,0.04)", border: "1px solid rgba(34,197,94,0.2)" }}
      >
        <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "rgba(34,197,94,0.6)" }}>
          {dayName} · {dateFormatted}
        </p>
        <div className="flex items-center gap-3 mb-1">
          <span style={{ fontSize: "24px", color: "#22c55e" }}>✓</span>
          <h3 className="text-xl font-black text-white">Done for today.</h3>
        </div>
        <p className="text-sm text-gray-500">You showed up. That&apos;s the whole game.</p>
      </div>
    );
  }

  // Rest day
  if (!isTodayWorkoutDay) {
    return (
      <div
        className="rounded-2xl p-6"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "rgba(255,255,255,0.25)" }}>
          {dayName} · {dateFormatted}
        </p>
        <h3 className="text-xl font-black text-white mb-2">Rest day.</h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          Recovery is part of training. Your next workout is{" "}
          {getNextWorkoutDay(plan, today)}.
        </p>
      </div>
    );
  }

  // Zenkai Boost workout day
  if (isZenkaiBoost) {
    return (
      <div
        className="rounded-2xl p-6"
        style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.3)" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span
            className="text-xs font-black px-2.5 py-1 rounded-full"
            style={{ background: "linear-gradient(135deg, #FF6B35, #7C3AED)", color: "#fff" }}
          >
            ZENKAI BOOST
          </span>
          <p className="text-xs font-bold" style={{ color: "rgba(167,139,250,0.7)" }}>
            Comeback activated
          </p>
        </div>
        <h3 className="text-xl font-black text-white mb-2">{dayName} — comeback workout</h3>
        <p className="text-sm text-gray-400 mb-5 leading-relaxed">
          You were away. That&apos;s real life. No judgment — just momentum. Your workout is exactly the same,
          and today it counts double.
        </p>
        <ExerciseList exercises={plan.exercises} />
        <CoachNote weakSpot={weakSpot} isZenkai />
        <button
          onClick={onComplete}
          disabled={loading}
          className="mt-5 w-full py-3.5 rounded-xl font-black text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #FF6B35, #7C3AED)" }}
        >
          {loading ? "Logging..." : "Mark workout done"}
        </button>
      </div>
    );
  }

  // Normal workout day
  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: "rgba(255,107,53,0.04)", border: "1px solid rgba(255,107,53,0.15)" }}
    >
      <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "rgba(255,107,53,0.6)" }}>
        {dayName} · {dateFormatted}
      </p>
      <h3 className="text-xl font-black text-white mb-4">Today&apos;s workout</h3>
      <ExerciseList exercises={plan.exercises} />
      <CoachNote weakSpot={weakSpot} />
      <button
        onClick={onComplete}
        disabled={loading}
        className="mt-5 w-full py-3.5 rounded-xl font-black text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
        style={{ background: "linear-gradient(135deg, #FF6B35, #7C3AED)" }}
      >
        {loading ? "Logging..." : "Mark workout done"}
      </button>
    </div>
  );
}

function ExerciseList({ exercises }: { exercises: { name: string; detail: string }[] }) {
  return (
    <div className="space-y-2 mb-1">
      {exercises.map((ex, i) => (
        <div
          key={i}
          className="flex items-center justify-between px-4 py-3 rounded-xl"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p className="text-sm font-bold text-white">{ex.name}</p>
          {ex.detail && (
            <p className="text-xs text-gray-600">{ex.detail}</p>
          )}
        </div>
      ))}
    </div>
  );
}

function CoachNote({ weakSpot, isZenkai = false }: { weakSpot: string | null; isZenkai?: boolean }) {
  const note = isZenkai
    ? "Showing up after a break takes more courage than showing up fresh. Kael knows."
    : weakSpot === "busy_weeks"
    ? "Busy week? This workout counts no matter how fast you do it."
    : weakSpot === "motivation_dips"
    ? "Low energy? Starting is the hardest part. Once you begin, you're already winning."
    : weakSpot === "travel"
    ? "Traveling? Your workouts go wherever you go."
    : weakSpot === "injury"
    ? "Body not at 100%? Do what you can. Showing up is the whole point."
    : null;

  if (!note) return null;

  return (
    <div
      className="mt-3 flex gap-3 items-start px-4 py-3 rounded-xl"
      style={{ background: "rgba(255,107,53,0.04)", border: "1px solid rgba(255,107,53,0.1)" }}
    >
      <img
        src="/images/master-kael-avatar.png"
        alt="Kael"
        style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover", flexShrink: 0, background: "rgba(255,107,53,0.1)" }}
      />
      <p className="text-xs text-gray-400 leading-relaxed italic">&ldquo;{note}&rdquo;</p>
    </div>
  );
}

function getNextWorkoutDay(plan: WorkoutPlan, today: string): string {
  const weekDates = getWeekDates(today);
  const todayIdx = weekDates.indexOf(today);
  for (let i = todayIdx + 1; i < 7; i++) {
    if (plan.dayIndices.includes(i)) {
      return new Date(weekDates[i] + "T00:00:00").toLocaleDateString("en-US", { weekday: "long" });
    }
  }
  // Next week
  for (let i = 0; i < todayIdx; i++) {
    if (plan.dayIndices.includes(i)) {
      return `next ${DAY_LABELS[i]}`;
    }
  }
  return "soon";
}

// ── StatsRow ──────────────────────────────────────────────────────────────────

function StatsRow({ streak, lastWorkoutDate, today }: { streak: number; lastWorkoutDate: string | null; today: string }) {
  const lastDateFormatted = lastWorkoutDate
    ? (() => {
        const d = new Date(lastWorkoutDate + "T00:00:00");
        const diff = Math.floor((new Date(today).getTime() - d.getTime()) / 86400000);
        if (diff === 0) return "Today";
        if (diff === 1) return "Yesterday";
        return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
      })()
    : "Never";

  return (
    <div className="grid grid-cols-2 gap-3">
      <div
        className="rounded-xl p-4 text-center"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
      >
        <p className="text-xs text-gray-600 mb-1">Streak</p>
        <p className="text-2xl font-black" style={{ color: streak > 0 ? "#FF6B35" : "#fff" }}>
          {streak}
        </p>
        <p className="text-xs text-gray-700 mt-0.5">day{streak !== 1 ? "s" : ""}</p>
      </div>
      <div
        className="rounded-xl p-4 text-center"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
      >
        <p className="text-xs text-gray-600 mb-1">Last workout</p>
        <p className="text-sm font-black text-white">{lastDateFormatted}</p>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function DashboardClient({
  characterName,
  characterClass: _characterClass,
  xp: _xp,
  streak: initialStreak,
  workoutPlan,
  thisWeekLogs,
  isLoggedToday: initialLoggedToday,
  today,
  weakSpot,
  fighterType: _fighterType,
  isZenkaiBoost,
  isFoundingMember,
  lastWorkoutDate: initialLastWorkoutDate,
}: Props) {
  const [view, setView] = useState<View>(initialLoggedToday ? "done" : "workout");
  const [streak, setStreak] = useState(initialStreak);
  const [isLoggedToday, setIsLoggedToday] = useState(initialLoggedToday);
  const [lastWorkoutDate, setLastWorkoutDate] = useState(initialLastWorkoutDate);
  const [loading, setLoading] = useState(false);

  async function completeWorkout() {
    if (loading || isLoggedToday) return;
    setLoading(true);
    try {
      const res = await fetch("/api/workout/complete", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setStreak(data.newStreak ?? streak + 1);
        setIsLoggedToday(true);
        setLastWorkoutDate(today);
        setView("moment");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {view === "moment" && (
        <MomentScreen onDone={() => setView("done")} />
      )}

      <div className="max-w-lg mx-auto px-4 py-8 space-y-5">

        {/* Header */}
        <div
          className="rounded-2xl p-5"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "rgba(255,107,53,0.6)" }}>
                {isFoundingMember ? "Founding Member" : "Zenkai"}
              </p>
              <h1
                className="text-2xl font-black leading-none"
                style={{ color: isFoundingMember ? "#FFD700" : "#fff" }}
              >
                {characterName}
              </h1>
            </div>
            {isZenkaiBoost && (
              <span
                className="text-xs font-black px-3 py-1.5 rounded-full"
                style={{ background: "linear-gradient(135deg, #FF6B35, #7C3AED)", color: "#fff" }}
              >
                ZENKAI
              </span>
            )}
          </div>
        </div>

        {/* Stats */}
        <StatsRow streak={streak} lastWorkoutDate={lastWorkoutDate} today={today} />

        {/* Weekly calendar */}
        <WeekCalendar plan={workoutPlan} thisWeekLogs={isLoggedToday ? [...thisWeekLogs, today].filter((v, i, a) => a.indexOf(v) === i) : thisWeekLogs} today={today} />

        {/* Today's workout card */}
        <TodayCard
          plan={workoutPlan}
          isLoggedToday={isLoggedToday}
          today={today}
          isZenkaiBoost={isZenkaiBoost}
          weakSpot={weakSpot}
          onComplete={completeWorkout}
          loading={loading}
        />

      </div>
    </>
  );
}
