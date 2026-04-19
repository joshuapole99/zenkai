"use client";

import { useState } from "react";

export type FoodLogData = {
  protein: boolean;
  vegetables: boolean;
  carbs: boolean;
  fruits: boolean;
  water: boolean;
  meals_count: number;
  custom_input: string | null;
  hp_gained: number;
};

type Props = {
  initialFoodLog: FoodLogData | null;
  initialHp: number;
  onHpChange: (hp: number) => void;
};

const FOOD_ITEMS = [
  { key: "protein",    label: "Protein",    sub: "Meat / eggs / legumes", hp: 40 },
  { key: "vegetables", label: "Vegetables", sub: "Any veg counts",        hp: 20 },
  { key: "carbs",      label: "Carbs",      sub: "Rice / bread / pasta",  hp: 20 },
  { key: "fruits",     label: "Fruits",     sub: "Any fruit counts",      hp: 10 },
  { key: "water",      label: "Water 2L+",  sub: "Hydration matters",     hp: 10 },
] as const;

type FoodKey = "protein" | "vegetables" | "carbs" | "fruits" | "water";

const PILL_LABELS: Record<FoodKey, string> = {
  protein: "Protein",
  vegetables: "Vegetables",
  carbs: "Carbs",
  fruits: "Fruits",
  water: "Water",
};

export default function NutritionLog({ initialFoodLog, initialHp, onHpChange }: Props) {
  const [logged, setLogged] = useState(!!initialFoodLog);
  const [protein, setProtein] = useState(initialFoodLog?.protein ?? false);
  const [vegetables, setVegetables] = useState(initialFoodLog?.vegetables ?? false);
  const [carbs, setCarbs] = useState(initialFoodLog?.carbs ?? false);
  const [fruits, setFruits] = useState(initialFoodLog?.fruits ?? false);
  const [water, setWater] = useState(initialFoodLog?.water ?? false);
  const [mealsCount, setMealsCount] = useState(initialFoodLog?.meals_count ?? 0);
  const [customInput, setCustomInput] = useState(initialFoodLog?.custom_input ?? "");
  const [hpGained, setHpGained] = useState(initialFoodLog?.hp_gained ?? initialHp);
  const [submitting, setSubmitting] = useState(false);

  const toggles: Record<FoodKey, [boolean, (v: boolean) => void]> = {
    protein: [protein, setProtein],
    vegetables: [vegetables, setVegetables],
    carbs: [carbs, setCarbs],
    fruits: [fruits, setFruits],
    water: [water, setWater],
  };

  async function submit() {
    setSubmitting(true);
    try {
      const res = await fetch("/api/food-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ protein, vegetables, carbs, fruits, water, mealsCount, customInput: customInput || null }),
      });
      const data = await res.json();
      if (res.ok) {
        setHpGained(data.hpGained);
        onHpChange(data.hpGained);
        setLogged(true);
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (logged) {
    const activePills = (Object.keys(PILL_LABELS) as FoodKey[]).filter((k) => toggles[k][0]);
    return (
      <div
        className="rounded-2xl p-5"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <h2 className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-3">Food Log</h2>
        <div className="w-full h-1.5 rounded-full overflow-hidden mb-4" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${hpGained}%`, background: "#22c55e" }}
          />
        </div>
        {activePills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {activePills.map((k) => (
              <span
                key={k}
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: "rgba(34,197,94,0.08)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)" }}
              >
                {PILL_LABELS[k]}
              </span>
            ))}
          </div>
        )}
        {customInput && (
          <p className="text-xs text-gray-600 italic mb-2">&ldquo;{customInput}&rdquo;</p>
        )}
        <button
          onClick={() => setLogged(false)}
          className="text-xs font-bold mt-1 transition-colors"
          style={{ color: "rgba(255,107,53,0.5)" }}
        >
          Update
        </button>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <h2 className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-4">Food Log</h2>

      <div className="grid grid-cols-1 gap-2 mb-4">
        {FOOD_ITEMS.map((item) => {
          const [active, setActive] = toggles[item.key];
          return (
            <button
              key={item.key}
              onClick={() => setActive(!active)}
              className="rounded-xl p-3 flex items-center justify-between gap-3 cursor-pointer transition-all text-left w-full"
              style={{
                background: active ? "rgba(34,197,94,0.05)" : "rgba(255,255,255,0.02)",
                border: active ? "1px solid rgba(34,197,94,0.2)" : "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div>
                <p className="text-sm font-bold" style={{ color: active ? "#fff" : "#9ca3af" }}>{item.label}</p>
                <p className="text-xs text-gray-600">{item.sub}</p>
              </div>
              <span
                className="text-xs font-bold shrink-0"
                style={{ color: active ? "#22c55e" : "#374151" }}
              >
                +{item.hp} HP
              </span>
            </button>
          );
        })}
      </div>

      {/* Meals count */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs text-gray-600 shrink-0">Meals today</span>
        <div className="flex gap-2">
          {([1, 2, 3] as const).map((n) => {
            const label = n === 3 ? "3+" : String(n);
            const active = mealsCount === n;
            return (
              <button
                key={n}
                onClick={() => setMealsCount(active ? 0 : n)}
                className="w-9 h-9 rounded-lg text-xs font-bold transition-all"
                style={{
                  background: active ? "rgba(255,107,53,0.1)" : "rgba(255,255,255,0.03)",
                  border: active ? "1px solid rgba(255,107,53,0.4)" : "1px solid rgba(255,255,255,0.06)",
                  color: active ? "#FF6B35" : "#6b7280",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom input */}
      <textarea
        value={customInput}
        onChange={(e) => setCustomInput(e.target.value)}
        rows={2}
        placeholder="Anything else? (optional)"
        className="w-full rounded-xl px-3 py-2.5 text-sm text-gray-300 placeholder-gray-700 resize-none mb-4 outline-none transition-all"
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
        onFocus={(e) => (e.target.style.borderColor = "rgba(255,107,53,0.3)")}
        onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.06)")}
      />

      <button
        onClick={submit}
        disabled={submitting}
        className="w-full py-3 rounded-xl text-sm font-bold transition-all active:scale-[0.98]"
        style={{
          background: "linear-gradient(135deg, #FF6B35, #7C3AED)",
          color: "#fff",
          opacity: submitting ? 0.6 : 1,
        }}
      >
        {submitting ? "Logging..." : "Log Food"}
      </button>
    </div>
  );
}
