"use client";

import { useState } from "react";
import MomentScreen from "./MomentScreen";
import TodayCard from "./TodayCard";
import type { WorkoutPlan } from "./page";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TIME_OPTIONS = [
  { id: "morning",   label: "Morning",   sub: "Before the world wakes up" },
  { id: "afternoon", label: "Afternoon", sub: "Midday energy reset" },
  { id: "evening",   label: "Evening",   sub: "After work, before rest" },
  { id: "flexible",  label: "Flexible",  sub: "Whenever I can" },
];

type ExerciseInput = { name: string; detail: string };

// ── WorkoutSetupForm ──────────────────────────────────────────────────────────
// Used both for first-time setup and editing an existing plan from the dashboard.

function WorkoutSetupForm({
  onSave,
  onCancel,
  initial,
}: {
  onSave: (plan: WorkoutPlan) => void;
  onCancel: () => void;
  initial?: WorkoutPlan | null;
}) {
  const [exercises, setExercises] = useState<ExerciseInput[]>(
    initial?.exercises?.length
      ? initial.exercises
      : [{ name: "", detail: "" }, { name: "", detail: "" }]
  );
  const [trainingDays, setTrainingDays] = useState<number[]>(
    initial?.dayIndices ?? [0, 2, 4]
  );
  const [timeOfDay, setTimeOfDay] = useState(initial?.timeOfDay ?? "morning");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function toggleDay(i: number) {
    setTrainingDays((prev) =>
      prev.includes(i)
        ? prev.length > 1 ? prev.filter((d) => d !== i) : prev
        : prev.length < 6 ? [...prev, i].sort() : prev
    );
  }

  function updateExercise(i: number, field: keyof ExerciseInput, value: string) {
    setExercises((prev) => prev.map((e, idx) => idx === i ? { ...e, [field]: value } : e));
  }

  function addExercise() {
    if (exercises.length < 5) setExercises((prev) => [...prev, { name: "", detail: "" }]);
  }

  function removeExercise(i: number) {
    if (exercises.length > 1) setExercises((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleSave() {
    const filtered = exercises.filter((e) => e.name.trim());
    if (filtered.length === 0) { setError("Add at least one exercise."); return; }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/workout/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exercises: filtered, dayIndices: trainingDays, timeOfDay }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Something went wrong."); return; }
      onSave({ exercises: filtered, dayIndices: trainingDays, timeOfDay });
    } catch {
      setError("No connection. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="rounded-2xl p-5 space-y-5"
      style={{ background: "rgba(255,107,53,0.04)", border: "1px solid rgba(255,107,53,0.15)" }}
    >
      {/* Exercises */}
      <div>
        <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "rgba(255,107,53,0.7)" }}>
          Your exercises
        </p>
        <div className="space-y-2">
          {exercises.map((ex, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                type="text"
                value={ex.name}
                onChange={(e) => updateExercise(i, "name", e.target.value)}
                placeholder={`Exercise (e.g. Push-ups)`}
                className="flex-1 px-3 py-2 rounded-xl text-sm text-white placeholder-gray-700 outline-none"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(255,107,53,0.4)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
              />
              <input
                type="text"
                value={ex.detail}
                onChange={(e) => updateExercise(i, "detail", e.target.value)}
                placeholder="3×10"
                className="w-16 px-2 py-2 rounded-xl text-sm text-white placeholder-gray-700 outline-none text-center"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(255,107,53,0.4)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
              />
              {exercises.length > 1 && (
                <button onClick={() => removeExercise(i)} className="text-gray-600 hover:text-gray-400 text-lg leading-none w-6 flex-shrink-0">×</button>
              )}
            </div>
          ))}
        </div>
        {exercises.length < 5 && (
          <button onClick={addExercise} className="mt-2 text-xs font-bold" style={{ color: "rgba(255,107,53,0.6)" }}>
            + Add exercise
          </button>
        )}
      </div>

      {/* Training days */}
      <div>
        <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "rgba(255,107,53,0.7)" }}>
          Training days
        </p>
        <div className="grid grid-cols-7 gap-1">
          {DAY_LABELS.map((day, i) => (
            <button
              key={day}
              onClick={() => toggleDay(i)}
              className="py-2 rounded-lg text-xs font-bold transition-all"
              style={{
                background: trainingDays.includes(i) ? "rgba(255,107,53,0.15)" : "rgba(255,255,255,0.04)",
                border: trainingDays.includes(i) ? "1px solid rgba(255,107,53,0.5)" : "1px solid rgba(255,255,255,0.07)",
                color: trainingDays.includes(i) ? "#FF6B35" : "#6b7280",
              }}
            >
              {day}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-700 mt-2">
          {trainingDays.length} training · {7 - trainingDays.length} rest
        </p>
      </div>

      {/* Time of day */}
      <div>
        <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "rgba(255,107,53,0.7)" }}>
          Best time to train
        </p>
        <div className="grid grid-cols-2 gap-2">
          {TIME_OPTIONS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTimeOfDay(t.id)}
              className="text-left px-3 py-2.5 rounded-xl transition-all"
              style={{
                background: timeOfDay === t.id ? "rgba(124,58,237,0.12)" : "rgba(255,255,255,0.03)",
                border: timeOfDay === t.id ? "1px solid rgba(124,58,237,0.5)" : "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <p className="text-xs font-bold" style={{ color: timeOfDay === t.id ? "#a78bfa" : "#fff" }}>{t.label}</p>
              <p className="text-xs text-gray-700">{t.sub}</p>
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <div className="flex gap-3 pt-1">
        <button
          onClick={onCancel}
          className="px-4 py-2.5 rounded-xl text-sm text-gray-500 hover:text-gray-300 transition-colors"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 py-2.5 rounded-xl text-sm font-black text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #FF6B35, #7C3AED)" }}
        >
          {saving ? "Saving..." : "Save my week →"}
        </button>
      </div>
    </div>
  );
}

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
  graceAvailable: boolean;
  missedWorkoutDate: string | null;
  skippedDayIndex: number | null;
  surveyDoneForMissedDate: boolean;
  isSunday: boolean;
};

function getWeekDates(today: string): string[] {
  const d = new Date(today + "T00:00:00");
  const dow = d.getDay();
  const offset = dow === 0 ? -6 : 1 - dow; // go to Monday
  const monday = new Date(d);
  monday.setDate(monday.getDate() + offset);
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    // toLocaleDateString("en-CA") gives YYYY-MM-DD in the browser's local timezone.
    // toISOString() would shift the date back by the UTC offset (e.g. UTC+2 → previous day).
    return day.toLocaleDateString("en-CA");
  });
}

// ── WeekCalendar ──────────────────────────────────────────────────────────────

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

// ── FeedbackCard ──────────────────────────────────────────────────────────────

function FeedbackCard() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!message.trim()) return;
    setLoading(true);
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="text-center py-4">
        <p className="text-xs text-gray-700">Feedback received. Thank you.</p>
      </div>
    );
  }

  if (!open) {
    return (
      <div className="text-center py-4">
        <button
          onClick={() => setOpen(true)}
          className="text-xs text-gray-700 hover:text-gray-500 transition-colors"
        >
          Share feedback with the team →
        </button>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "rgba(255,255,255,0.2)" }}>
        Beta feedback
      </p>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="What's working? What's missing? What should Zenkai do differently?"
        rows={3}
        className="w-full px-3 py-2.5 rounded-xl text-sm text-white placeholder-gray-700 outline-none resize-none"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
      />
      <div className="flex gap-2 mt-3">
        <button
          onClick={() => setOpen(false)}
          className="text-xs text-gray-600 hover:text-gray-400 px-3 py-2 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={submit}
          disabled={loading || !message.trim()}
          className="flex-1 py-2 rounded-xl text-xs font-black text-white transition-all hover:opacity-90 disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #FF6B35, #7C3AED)" }}
        >
          {loading ? "Sending..." : "Send feedback"}
        </button>
      </div>
    </div>
  );
}

// ── GraceDayCard ──────────────────────────────────────────────────────────────

function GraceDayCard({
  missedDate,
  onUse,
  loading,
  used,
}: {
  missedDate: string;
  onUse: () => void;
  loading: boolean;
  used: boolean;
}) {
  const dayName = new Date(missedDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "long" });

  if (used) {
    return (
      <div
        className="rounded-2xl p-5"
        style={{ background: "rgba(124,58,237,0.04)", border: "1px solid rgba(124,58,237,0.15)" }}
      >
        <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "rgba(167,139,250,0.5)" }}>
          Grace day used
        </p>
        <p className="text-sm text-gray-500">{dayName} is now counted. Streak protected.</p>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "rgba(124,58,237,0.05)", border: "1px solid rgba(124,58,237,0.25)" }}
    >
      <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "rgba(167,139,250,0.7)" }}>
        Grace day available · 1 per week
      </p>
      <h3 className="text-base font-black text-white mb-1">You missed {dayName}.</h3>
      <p className="text-sm text-gray-500 mb-4 leading-relaxed">
        Life happens. Use your grace day to protect your streak — no guilt.
      </p>
      <button
        onClick={onUse}
        disabled={loading}
        className="px-5 py-2.5 rounded-xl text-sm font-black text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
        style={{ background: "linear-gradient(135deg, #7C3AED, #4F46E5)" }}
      >
        {loading ? "Protecting streak..." : "Use grace day — protect my streak"}
      </button>
    </div>
  );
}

// ── ExitSurveyCard ────────────────────────────────────────────────────────────

const SURVEY_OPTIONS = [
  { id: "too_busy",      label: "Too busy" },
  { id: "too_tired",     label: "Too tired" },
  { id: "forgot",        label: "I forgot" },
  { id: "no_motivation", label: "Didn't feel like it" },
];

function ExitSurveyCard({
  missedDate,
  onSubmit,
}: {
  missedDate: string;
  onSubmit: () => void;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const dayName = new Date(missedDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "long" });

  async function submit(reason: string) {
    setLoading(true);
    try {
      await fetch("/api/workout/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason, surveyDate: missedDate }),
      });
      setSubmitted(true);
      onSubmit();
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div
        className="rounded-2xl p-5"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <p className="text-sm text-gray-500">Got it. Kael is paying attention.</p>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "rgba(255,255,255,0.25)" }}>
        {dayName} — what got in the way?
      </p>
      <div className="grid grid-cols-2 gap-2">
        {SURVEY_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            onClick={() => submit(opt.id)}
            disabled={loading}
            className="px-3 py-2.5 rounded-xl text-sm font-bold text-left transition-all hover:opacity-80 disabled:opacity-50"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#9ca3af",
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── PatternInsightCard ────────────────────────────────────────────────────────

const DAY_FULL = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function PatternInsightCard({ dayIndex }: { dayIndex: number }) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "rgba(255,107,53,0.5)" }}>
        Pattern spotted
      </p>
      <h3 className="text-sm font-black text-white mb-1">You tend to skip {DAY_FULL[dayIndex]}s.</h3>
      <p className="text-sm text-gray-600 leading-relaxed">
        Consider making it a rest day — or try something shorter on {DAY_LABELS[dayIndex]}s.
      </p>
    </div>
  );
}

// ── WeeklySummaryCard ─────────────────────────────────────────────────────────

function WeeklySummaryCard({
  plan,
  thisWeekLogs,
  today,
}: {
  plan: WorkoutPlan;
  thisWeekLogs: string[];
  today: string;
}) {
  const weekDates = getWeekDates(today);
  const total = plan.dayIndices.length;
  const done = plan.dayIndices.filter((i) => thisWeekLogs.includes(weekDates[i])).length;

  const message =
    done === total
      ? "Perfect week. Every workout landed. Kael is impressed."
      : done >= Math.ceil(total * 0.75)
      ? `Strong week — ${done} out of ${total}. Consistency is building.`
      : done >= 1
      ? `${done} out of ${total} this week. Every rep counts. New week starts tomorrow.`
      : "Tough week. The new week is a clean slate.";

  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "rgba(255,107,53,0.04)", border: "1px solid rgba(255,107,53,0.12)" }}
    >
      <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "rgba(255,107,53,0.6)" }}>
        Week wrap-up · Sunday
      </p>
      <p className="text-2xl font-black text-white mb-2">{done}/{total} workouts</p>
      <p className="text-sm text-gray-500 leading-relaxed">{message}</p>
    </div>
  );
}

// ── StatsRow ──────────────────────────────────────────────────────────────────

function StatsRow({
  streak,
  lastWorkoutDate,
  today,
  graceAvailable,
  graceUsed,
}: {
  streak: number;
  lastWorkoutDate: string | null;
  today: string;
  graceAvailable: boolean;
  graceUsed: boolean;
}) {
  const lastDateFormatted = lastWorkoutDate
    ? (() => {
        const d = new Date(lastWorkoutDate + "T00:00:00");
        const diff = Math.floor((new Date(today).getTime() - d.getTime()) / 86400000);
        if (diff === 0) return "Today";
        if (diff === 1) return "Yesterday";
        return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
      })()
    : "Never";

  const graceLabel = graceUsed ? "Used" : graceAvailable ? "Available" : "—";
  const graceColor = graceUsed ? "rgba(255,255,255,0.15)" : graceAvailable ? "#22c55e" : "rgba(255,255,255,0.15)";

  return (
    <div className="grid grid-cols-3 gap-3">
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
      <div
        className="rounded-xl p-4 text-center"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
      >
        <p className="text-xs text-gray-600 mb-1">Grace day</p>
        <p className="text-sm font-black" style={{ color: graceColor }}>{graceLabel}</p>
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
  workoutPlan: initialWorkoutPlan,
  thisWeekLogs,
  isLoggedToday: initialLoggedToday,
  today,
  weakSpot,
  fighterType: _fighterType,
  isZenkaiBoost,
  isFoundingMember,
  lastWorkoutDate: initialLastWorkoutDate,
  graceAvailable,
  missedWorkoutDate,
  skippedDayIndex,
  surveyDoneForMissedDate,
  isSunday,
}: Props) {
  const [view, setView] = useState<View>(initialLoggedToday ? "done" : "workout");
  const [streak, setStreak] = useState(initialStreak);
  const [isLoggedToday, setIsLoggedToday] = useState(initialLoggedToday);
  const [lastWorkoutDate, setLastWorkoutDate] = useState(initialLastWorkoutDate);
  const [loading, setLoading] = useState(false);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(initialWorkoutPlan);
  const [showSetup, setShowSetup] = useState(false);
  const [graceUsed, setGraceUsed] = useState(false);
  const [graceLoading, setGraceLoading] = useState(false);
  const [surveySubmitted, setSurveySubmitted] = useState(false);

  const hasNoPlan = !workoutPlan || workoutPlan.exercises.length === 0;

  const showGraceCard = !!missedWorkoutDate && graceAvailable && !graceUsed;
  const showExitSurvey =
    !!missedWorkoutDate &&
    !graceUsed &&
    !surveySubmitted &&
    !surveyDoneForMissedDate;

  async function useGraceDay() {
    setGraceLoading(true);
    try {
      const res = await fetch("/api/workout/grace", { method: "POST" });
      if (res.ok) setGraceUsed(true);
    } finally {
      setGraceLoading(false);
    }
  }

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

  async function justLogToday() {
    if (loading || isLoggedToday) return;
    setLoading(true);
    try {
      if (graceAvailable && !graceUsed) {
        const res = await fetch("/api/workout/grace", { method: "POST" });
        if (res.ok) setGraceUsed(true);
      }
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

  const currentWeekLogs = isLoggedToday
    ? [...thisWeekLogs, today].filter((v, i, a) => a.indexOf(v) === i)
    : thisWeekLogs;

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
            <div className="flex items-center gap-2">
              {isZenkaiBoost && (
                <span
                  className="text-xs font-black px-3 py-1.5 rounded-full"
                  style={{ background: "linear-gradient(135deg, #FF6B35, #7C3AED)", color: "#fff" }}
                >
                  ZENKAI
                </span>
              )}
              {!hasNoPlan && !showSetup && (
                <button
                  onClick={() => setShowSetup(true)}
                  className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
                >
                  Edit workouts
                </button>
              )}
            </div>
          </div>
        </div>

        {/* No-plan banner — Design your workouts */}
        {hasNoPlan && !showSetup && (
          <div
            className="rounded-2xl p-5"
            style={{ background: "rgba(255,107,53,0.06)", border: "1px solid rgba(255,107,53,0.2)" }}
          >
            <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "rgba(255,107,53,0.7)" }}>
              Get started
            </p>
            <h3 className="text-base font-black text-white mb-2">Design your workouts</h3>
            <p className="text-sm text-gray-500 mb-4">
              Add your exercises and pick your training days. Takes 60 seconds.
            </p>
            <button
              onClick={() => setShowSetup(true)}
              className="px-5 py-2.5 rounded-xl text-sm font-black text-white transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ background: "linear-gradient(135deg, #FF6B35, #7C3AED)" }}
            >
              Design your workouts
            </button>
          </div>
        )}

        {/* Inline setup / edit form */}
        {showSetup && (
          <WorkoutSetupForm
            initial={workoutPlan}
            onSave={(plan) => { setWorkoutPlan(plan); setShowSetup(false); }}
            onCancel={() => setShowSetup(false)}
          />
        )}

        {/* Stats */}
        <StatsRow streak={streak} lastWorkoutDate={lastWorkoutDate} today={today} graceAvailable={graceAvailable} graceUsed={graceUsed} />

        {/* Sunday weekly summary */}
        {isSunday && workoutPlan && (
          <WeeklySummaryCard plan={workoutPlan} thisWeekLogs={currentWeekLogs} today={today} />
        )}

        {/* Grace day */}
        {(showGraceCard || graceUsed) && missedWorkoutDate && (
          <GraceDayCard
            missedDate={missedWorkoutDate}
            onUse={useGraceDay}
            loading={graceLoading}
            used={graceUsed}
          />
        )}

        {/* Exit survey — only when grace not available or not used */}
        {showExitSurvey && !showGraceCard && missedWorkoutDate && (
          <ExitSurveyCard
            missedDate={missedWorkoutDate}
            onSubmit={() => setSurveySubmitted(true)}
          />
        )}

        {/* Today's workout card — above calendar */}
        <TodayCard
          plan={workoutPlan}
          isLoggedToday={isLoggedToday}
          today={today}
          lastWorkoutDate={lastWorkoutDate}
          weakSpot={weakSpot}
          isZenkaiBoost={isZenkaiBoost}
          onComplete={completeWorkout}
          onJustLogToday={justLogToday}
          loading={loading}
        />

        {/* Weekly calendar */}
        <div id="week-calendar">
          <WeekCalendar plan={workoutPlan} thisWeekLogs={currentWeekLogs} today={today} />
        </div>

        {/* Pattern insight */}
        {skippedDayIndex !== null && !hasNoPlan && (
          <PatternInsightCard dayIndex={skippedDayIndex} />
        )}

        {/* Beta feedback */}
        <FeedbackCard />

      </div>
    </>
  );
}
