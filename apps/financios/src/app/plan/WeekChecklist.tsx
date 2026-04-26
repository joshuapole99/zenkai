"use client";

import { useEffect, useState } from "react";

interface WeekTask {
  week: number;
  weeklyTarget: number;
  tip: string;
}

export default function WeekChecklist({
  tasks,
  token,
  fmtEuro,
}: {
  tasks: WeekTask[];
  token: string;
  fmtEuro: (n: number) => string;
}) {
  const storageKey = `checklist:${token}`;
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) setChecked(JSON.parse(stored));
    } catch {}
    setMounted(true);
  }, [storageKey]);

  function toggle(week: number) {
    setChecked((prev) => {
      const next = { ...prev, [week]: !prev[week] };
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {}
      return next;
    });
  }

  const doneCount = tasks.filter((t) => checked[t.week]).length;

  return (
    <div>
      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-muted">{doneCount} van {tasks.length} weken afgerond</span>
          {doneCount === tasks.length && (
            <span className="text-xs font-semibold text-success">🎉 Doel bereikt!</span>
          )}
        </div>
        <div className="h-1.5 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-500"
            style={{ width: `${tasks.length > 0 ? (doneCount / tasks.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {tasks.map((task) => {
          const isDone = mounted && !!checked[task.week];
          return (
            <button
              key={task.week}
              onClick={() => toggle(task.week)}
              className={`flex gap-4 items-start w-full text-left rounded-xl p-3 border transition-all ${
                isDone
                  ? "border-success/30 bg-success/5"
                  : "border-transparent hover:border-border hover:bg-card-hover"
              }`}
            >
              <div className="shrink-0 w-10 h-10 rounded-xl bg-accent/20 flex flex-col items-center justify-center">
                <span className="text-[10px] font-medium uppercase text-accent leading-none">
                  Week
                </span>
                <span className="text-sm font-bold text-accent leading-none">
                  {task.week}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-semibold transition-colors ${isDone ? "text-success line-through opacity-60" : "text-foreground"}`}>
                    Spaardoel deze week
                  </span>
                  <span className={`text-sm font-bold transition-colors ${isDone ? "text-success/60" : "text-success"}`}>
                    €{fmtEuro(task.weeklyTarget)}
                  </span>
                </div>
                <p className={`text-xs leading-relaxed transition-opacity ${isDone ? "text-muted opacity-50" : "text-muted"}`}>
                  {task.tip}
                </p>
              </div>
              <div className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 transition-all ${
                isDone ? "border-success bg-success" : "border-border"
              }`}>
                {isDone && <span className="text-white text-[10px] font-bold">✓</span>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
