"use client";

import { useState, useMemo } from "react";

const RENDEMENT_OPTIONS = [
  { label: "4% (conservatief)", value: 4 },
  { label: "6% (realistisch)", value: 6 },
  { label: "8% (optimistisch)", value: 8 },
];

function fmt(n: number): string {
  return Math.round(n).toLocaleString("nl-NL");
}

function calcFutureValue(monthly: number, years: number, annualRate: number): number {
  const r = annualRate / 100 / 12;
  const n = years * 12;
  if (r === 0) return monthly * n;
  return monthly * ((Math.pow(1 + r, n) - 1) / r);
}

export default function BeleggenCalculator() {
  const [maandelijks, setMaandelijks] = useState(150);
  const [jaren, setJaren] = useState(20);
  const [rendement, setRendement] = useState(6);

  const eindkapitaal = useMemo(
    () => calcFutureValue(maandelijks, jaren, rendement),
    [maandelijks, jaren, rendement]
  );
  const ingelegd = maandelijks * jaren * 12;
  const winst = eindkapitaal - ingelegd;
  const winstPct = ingelegd > 0 ? Math.round((winst / ingelegd) * 100) : 0;
  const inlegPct = Math.round((ingelegd / eindkapitaal) * 100);
  const winstBarPct = 100 - inlegPct;

  return (
    <div className="bg-card border border-border rounded-2xl p-6 mb-8 shadow-[var(--shadow-card)]">
      <h2 className="font-semibold text-foreground mb-1 tracking-tight">
        Compound interest calculator
      </h2>
      <p className="text-xs font-medium uppercase tracking-wider text-muted mb-6">
        Pas de sliders aan en zie het resultaat direct
      </p>

      {/* Inputs */}
      <div className="flex flex-col gap-5 mb-6">
        {/* Maandelijks bedrag */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-medium uppercase tracking-wider text-muted">
              Maandelijks bedrag
            </label>
            <span className="text-sm font-bold text-foreground">€{maandelijks}</span>
          </div>
          <input
            type="range"
            min={25}
            max={1000}
            step={25}
            value={maandelijks}
            onChange={(e) => setMaandelijks(Number(e.target.value))}
            className="w-full accent-[#6366F1] h-2 rounded-full cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted mt-1">
            <span>€25</span><span>€1.000</span>
          </div>
        </div>

        {/* Looptijd */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-medium uppercase tracking-wider text-muted">
              Looptijd
            </label>
            <span className="text-sm font-bold text-foreground">{jaren} jaar</span>
          </div>
          <input
            type="range"
            min={5}
            max={40}
            step={5}
            value={jaren}
            onChange={(e) => setJaren(Number(e.target.value))}
            className="w-full accent-[#6366F1] h-2 rounded-full cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted mt-1">
            <span>5 jaar</span><span>40 jaar</span>
          </div>
        </div>

        {/* Rendement */}
        <div>
          <label className="text-xs font-medium uppercase tracking-wider text-muted block mb-2">
            Verwacht rendement
          </label>
          <div className="flex gap-2">
            {RENDEMENT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setRendement(opt.value)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all border ${
                  rendement === opt.value
                    ? "bg-accent border-accent text-white"
                    : "bg-background border-border text-muted hover:border-accent/50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Resultaat */}
      <div className="border-t border-border pt-5">
        <div className="text-center mb-5">
          <p className="text-xs font-medium uppercase tracking-wider text-muted mb-1">
            Eindkapitaal na {jaren} jaar
          </p>
          <p className="text-4xl font-bold text-success tracking-tight">
            €{fmt(eindkapitaal)}
          </p>
        </div>

        {/* Gestapelde balk */}
        <div className="mb-4">
          <div className="h-4 rounded-full overflow-hidden flex bg-border">
            <div
              className="h-full bg-accent/70 transition-all duration-300"
              style={{ width: `${inlegPct}%` }}
            />
            <div
              className="h-full bg-success/80 transition-all duration-300"
              style={{ width: `${winstBarPct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs mt-2">
            <span className="text-muted">
              <span className="inline-block w-2 h-2 rounded-sm bg-accent/70 mr-1" />
              Ingelegd €{fmt(ingelegd)}
            </span>
            <span className="text-success font-medium">
              <span className="inline-block w-2 h-2 rounded-sm bg-success/80 mr-1" />
              Rendement €{fmt(winst)} (+{winstPct}%)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-background rounded-xl p-3">
            <p className="text-xs text-muted mb-1">Totaal ingelegd</p>
            <p className="text-sm font-bold text-foreground">€{fmt(ingelegd)}</p>
          </div>
          <div className="bg-background rounded-xl p-3">
            <p className="text-xs text-muted mb-1">Rendement</p>
            <p className="text-sm font-bold text-success">€{fmt(winst)}</p>
          </div>
          <div className="bg-background rounded-xl p-3">
            <p className="text-xs text-muted mb-1">Winst %</p>
            <p className="text-sm font-bold text-success">+{winstPct}%</p>
          </div>
        </div>

        <p className="text-xs text-muted text-center mt-4">
          Berekening op basis van maandelijkse inleg met {rendement}% jaarlijks rendement. Geen garantie op toekomstig rendement.
        </p>
      </div>
    </div>
  );
}
