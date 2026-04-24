"use client";

import { useState } from "react";
import type { WorkoutPlan } from "./page";

type Props = {
  plan: WorkoutPlan | null;
  isLoggedToday: boolean;
  today: string;
  lastWorkoutDate: string | null;
  weakSpot: string | null;
  isZenkaiBoost: boolean;
  onComplete: () => void;
  loading: boolean;
};

function daysBetween(from: string, to: string): number {
  return Math.floor(
    (new Date(to + "T00:00:00").getTime() - new Date(from + "T00:00:00").getTime()) /
      86400000
  );
}

function lightenDetail(detail: string): string {
  const m = detail.match(/(\d+)\s*[x×]\s*(\d+)/i);
  if (m) {
    return `${Math.max(1, Math.ceil(+m[1] * 0.6))}×${Math.max(3, Math.ceil(+m[2] * 0.6))}`;
  }
  return detail;
}

function coachMessage(weakSpot: string | null, isComeback: boolean): string | null {
  if (isComeback) return "Showing up after a break takes more courage than showing up fresh.";
  switch (weakSpot) {
    case "busy_weeks":      return "You usually stop when things get busy. Let's keep it short today.";
    case "motivation_dips": return "Low energy? That's exactly when showing up counts most.";
    case "travel":          return "Away from home? Your workout travels with you.";
    case "injury":          return "Body not cooperating? Do what you can. Rest counts.";
    default:                return null;
  }
}

function KaelNote({ note }: { note: string }) {
  return (
    <div
      className="flex gap-3 items-start px-4 py-3 rounded-xl mt-4"
      style={{ background: "rgba(255,107,53,0.04)", border: "1px solid rgba(255,107,53,0.1)" }}
    >
      <img
        src="/images/master-kael-avatar.png"
        alt="Kael"
        style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
      />
      <p className="text-xs text-gray-400 leading-relaxed italic">&ldquo;{note}&rdquo;</p>
    </div>
  );
}

function WorkoutFlow({
  exercises,
  onDone,
  loading,
}: {
  exercises: { name: string; detail: string }[];
  onDone: () => void;
  loading: boolean;
}) {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  function toggle(i: number) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  const allDone = checked.size === exercises.length;

  return (
    <div className="space-y-2 mt-4">
      {exercises.map((ex, i) => (
        <button
          key={i}
          onClick={() => toggle(i)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all text-left"
          style={{
            background: checked.has(i) ? "rgba(34,197,94,0.07)" : "rgba(255,255,255,0.03)",
            border: checked.has(i)
              ? "1px solid rgba(34,197,94,0.25)"
              : "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background: checked.has(i) ? "#22c55e" : "transparent",
                border: checked.has(i) ? "none" : "2px solid rgba(255,255,255,0.15)",
              }}
            >
              {checked.has(i) && (
                <span style={{ color: "#fff", fontSize: "10px", fontWeight: 900 }}>✓</span>
              )}
            </div>
            <p className={`text-sm font-bold ${checked.has(i) ? "text-gray-600 line-through" : "text-white"}`}>
              {ex.name}
            </p>
          </div>
          {ex.detail && <p className="text-xs text-gray-600">{ex.detail}</p>}
        </button>
      ))}

      <button
        onClick={onDone}
        disabled={loading || !allDone}
        className="w-full py-3.5 mt-2 rounded-xl font-black text-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40"
        style={{
          background: allDone ? "linear-gradient(135deg, #22c55e, #16a34a)" : "rgba(255,255,255,0.05)",
          color: "#fff",
          border: allDone ? "none" : "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {loading ? "Logging..." : allDone ? "Done — log my workout" : `${checked.size} / ${exercises.length} complete`}
      </button>
    </div>
  );
}

export default function TodayCard({
  plan,
  isLoggedToday,
  today,
  lastWorkoutDate,
  weakSpot,
  isZenkaiBoost,
  onComplete,
  loading,
}: Props) {
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [restActive, setRestActive] = useState(false);

  const todayDow = (new Date(today + "T00:00:00").getDay() + 6) % 7;
  const isTodayWorkoutDay = plan?.dayIndices.includes(todayDow) ?? false;
  const dayName = new Date(today + "T00:00:00").toLocaleDateString("en-US", { weekday: "long" });
  const dateFormatted = new Date(today + "T00:00:00").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  const daysAway = lastWorkoutDate ? daysBetween(lastWorkoutDate, today) : null;
  const isComeback = !!(plan && daysAway !== null && daysAway >= 3) || isZenkaiBoost;
  const note = coachMessage(weakSpot, isComeback);

  // ── Scenario 4: Already done ──────────────────────────────────────────────────
  if (isLoggedToday) {
    return (
      <div
        className="rounded-2xl p-6"
        style={{ background: "rgba(34,197,94,0.04)", border: "1px solid rgba(34,197,94,0.2)" }}
      >
        <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "rgba(34,197,94,0.5)" }}>
          Today · {dayName}, {dateFormatted}
        </p>
        <div className="flex items-center gap-3 mb-2">
          <span style={{ fontSize: "24px", color: "#22c55e" }}>✓</span>
          <h3 className="text-xl font-black text-white">You showed up.</h3>
        </div>
        <p className="text-sm text-gray-500 mb-5">That&apos;s the whole game.</p>
        <button
          onClick={() => document.getElementById("week-calendar")?.scrollIntoView({ behavior: "smooth" })}
          className="text-xs font-bold text-gray-600 hover:text-gray-400 transition-colors"
        >
          View your week ↓
        </button>
      </div>
    );
  }

  if (!plan) return null;

  const comebackExercises = plan.exercises.map((ex) => ({
    ...ex,
    detail: lightenDetail(ex.detail),
  }));

  // ── Scenario 3: Comeback (3+ days away) ──────────────────────────────────────
  if (isComeback) {
    return (
      <div
        className="rounded-2xl p-6"
        style={{ background: "rgba(124,58,237,0.05)", border: "1px solid rgba(124,58,237,0.25)" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <span
            className="text-xs font-black px-2.5 py-1 rounded-full"
            style={{ background: "linear-gradient(135deg, #FF6B35, #7C3AED)", color: "#fff" }}
          >
            WELCOME BACK
          </span>
          {daysAway !== null && daysAway > 0 && (
            <p className="text-xs" style={{ color: "rgba(167,139,250,0.6)" }}>
              {daysAway} day{daysAway !== 1 ? "s" : ""} away
            </p>
          )}
        </div>
        <h3 className="text-xl font-black text-white mb-1">Let&apos;s restart simple.</h3>
        <p className="text-sm text-gray-500 mb-5 leading-relaxed">
          Same exercises, lighter load. One session to break the gap.
        </p>

        {workoutStarted ? (
          <WorkoutFlow exercises={comebackExercises} onDone={onComplete} loading={loading} />
        ) : (
          <>
            <div className="space-y-2 mb-2">
              {comebackExercises.map((ex, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-4 py-3 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <p className="text-sm font-bold text-white">{ex.name}</p>
                  <div className="flex items-center gap-2">
                    {ex.detail && (
                      <p className="text-xs font-bold" style={{ color: "rgba(167,139,250,0.7)" }}>
                        {ex.detail}
                      </p>
                    )}
                    <span className="text-xs text-gray-700 italic">light</span>
                  </div>
                </div>
              ))}
            </div>
            {note && <KaelNote note={note} />}
            <div className="space-y-2 mt-5">
              <button
                onClick={() => setWorkoutStarted(true)}
                className="w-full py-3.5 rounded-xl font-black text-white transition-all hover:opacity-90 active:scale-[0.98]"
                style={{ background: "linear-gradient(135deg, #FF6B35, #7C3AED)" }}
              >
                Start comeback workout
              </button>
              <button
                onClick={onComplete}
                disabled={loading}
                className="w-full py-2.5 rounded-xl text-sm text-gray-500 hover:text-gray-300 transition-colors disabled:opacity-50"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                {loading ? "Logging..." : "Not ready — just log today"}
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  // ── Scenario 2: Rest day ──────────────────────────────────────────────────────
  if (!isTodayWorkoutDay) {
    return (
      <div
        className="rounded-2xl p-6"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "rgba(255,255,255,0.2)" }}>
          Today · {dayName}, {dateFormatted}
        </p>
        <h3 className="text-xl font-black text-white mb-2">Rest day.</h3>
        <p className="text-sm text-gray-500 mb-5 leading-relaxed">Recovery is part of training.</p>

        {restActive ? (
          <>
            <p className="text-xs text-gray-600 mb-3">Light version — take it easy:</p>
            <WorkoutFlow
              exercises={plan.exercises.map((ex) => ({ ...ex, detail: lightenDetail(ex.detail) }))}
              onDone={onComplete}
              loading={loading}
            />
          </>
        ) : (
          <div className="space-y-2">
            <button
              onClick={() => setRestActive(true)}
              className="w-full py-3 rounded-xl text-sm font-bold transition-all hover:opacity-80"
              style={{ background: "rgba(255,107,53,0.08)", border: "1px solid rgba(255,107,53,0.2)", color: "#FF6B35" }}
            >
              Want to stay active? +5 min
            </button>
            <button
              onClick={onComplete}
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-bold text-gray-500 hover:text-gray-300 transition-colors disabled:opacity-50"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              {loading ? "Logging..." : "Log rest day"}
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── Scenario 1: Normal workout day ────────────────────────────────────────────
  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: "rgba(255,107,53,0.04)", border: "1px solid rgba(255,107,53,0.15)" }}
    >
      <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "rgba(255,107,53,0.6)" }}>
        Today · {dayName}, {dateFormatted}
      </p>
      <h3 className="text-xl font-black text-white mb-4">
        {workoutStarted ? "In progress" : "Today’s workout"}
      </h3>

      {workoutStarted ? (
        <WorkoutFlow exercises={plan.exercises} onDone={onComplete} loading={loading} />
      ) : (
        <>
          <div className="space-y-2 mb-2">
            {plan.exercises.map((ex, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-4 py-3 rounded-xl"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <p className="text-sm font-bold text-white">{ex.name}</p>
                {ex.detail && <p className="text-xs text-gray-600">{ex.detail}</p>}
              </div>
            ))}
          </div>
          {note && <KaelNote note={note} />}
          <button
            onClick={() => setWorkoutStarted(true)}
            className="mt-5 w-full py-3.5 rounded-xl font-black text-white transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ background: "linear-gradient(135deg, #FF6B35, #7C3AED)" }}
          >
            Start 10 min workout
          </button>
        </>
      )}
    </div>
  );
}
