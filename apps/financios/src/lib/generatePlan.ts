import { ScanInput, ScanResult } from "./calculate";

export interface WeeklyTask {
  week: number;
  weeklyTarget: number;
  tip: string;
}

export interface MonthlyLine {
  category: string;
  amount: number;
  percentage: number;
}

export interface ProgressScenario {
  name: string;
  emoji: string;
  monthlyAmount: number;
  extraPerMonth: number;
  monthsNeeded: number;
  targetDate: Date;
  description: string;
}

export interface PremiumPlan {
  weeklyTasks: WeeklyTask[];
  monthlyBreakdown: MonthlyLine[];
  reductions: string[];
  scenarios: ProgressScenario[];
  recommendedDate: Date;
  conclusion: string;
}

export function generatePlan(input: ScanInput, result: ScanResult): PremiumPlan {
  const today = new Date();
  const amountNeeded = Math.max(0, input.doel - input.spaargeld);

  // ── Weekly plan ──────────────────────────────────────────────
  // Base the weekly target on the medium scenario (realistic path)
  const mediumExtra = result.biggestLeak.amount * 0.2;
  const mediumMonthly = Math.max(result.monthlyCapacity, 0) + mediumExtra;
  const weeklyTarget = Math.round(mediumMonthly / 4.33);

  const weeklyTasks: WeeklyTask[] = [
    {
      week: 1,
      weeklyTarget,
      tip: getWeeklyTip(input, result, 0),
    },
    {
      week: 2,
      weeklyTarget,
      tip: getWeeklyTip(input, result, 1),
    },
    {
      week: 3,
      weeklyTarget,
      tip: getWeeklyTip(input, result, 2),
    },
    {
      week: 4,
      weeklyTarget,
      tip: getWeeklyTip(input, result, 3),
    },
  ];

  // ── Monthly breakdown ─────────────────────────────────────────
  const lines: MonthlyLine[] = [
    { category: "Huur / Hypotheek", amount: input.huur },
    { category: "Abonnementen", amount: input.abonnementen },
    { category: "Verzekeringen", amount: input.verzekeringen },
    { category: "Boodschappen", amount: input.boodschappen },
    { category: "Vervoer", amount: input.vervoer },
    { category: "Uit eten & entertainment", amount: input.horeca },
    { category: "Overige uitgaven", amount: input.overig },
  ]
    .filter((l) => l.amount > 0)
    .map((l) => ({
      ...l,
      percentage: Math.round((l.amount / input.inkomen) * 100),
    }));

  const monthlyBreakdown = lines;

  // ── Expense reduction suggestions ────────────────────────────
  const reductions = getReductions(input, result);

  // ── 3 Progression scenarios ───────────────────────────────────
  // All three build on the same base so slow ≤ medium ≤ fast is always guaranteed
  const slowMonthly = Math.max(result.monthlyCapacity, 10);
  const fastExtra = result.biggestLeak.amount * 0.4;
  const fastMonthly = slowMonthly + fastExtra;

  const slowMonths =
    amountNeeded > 0 ? Math.ceil(amountNeeded / slowMonthly) : input.maanden + 6;
  const mediumMonths =
    amountNeeded > 0 ? Math.ceil(amountNeeded / mediumMonthly) : input.maanden + 2;
  const fastMonths =
    amountNeeded > 0 ? Math.ceil(amountNeeded / fastMonthly) : input.maanden;

  const scenarios: ProgressScenario[] = [
    {
      name: "Rustig tempo",
      emoji: "🐢",
      monthlyAmount: Math.round(slowMonthly),
      extraPerMonth: 0,
      monthsNeeded: slowMonths,
      targetDate: addMonths(today, slowMonths),
      description: `Niets veranderen aan je uitgaven. Je spaart €${Math.round(slowMonthly)}/maand.`,
    },
    {
      name: "Slim bezuinigen",
      emoji: "🎯",
      monthlyAmount: Math.round(mediumMonthly),
      extraPerMonth: Math.round(mediumExtra),
      monthsNeeded: mediumMonths,
      targetDate: addMonths(today, mediumMonths),
      description: `Bezuinig 20% op ${result.biggestLeak.name} (€${Math.round(mediumExtra)}/maand extra). Realistisch en haalbaar.`,
    },
    {
      name: "Maximale besparing",
      emoji: "🚀",
      monthlyAmount: Math.round(fastMonthly),
      extraPerMonth: Math.round(fastExtra),
      monthsNeeded: fastMonths,
      targetDate: addMonths(today, fastMonths),
      description: `Bezuinig 40% op ${result.biggestLeak.name} (€${Math.round(fastExtra)}/maand extra). Snel, maar vraagt discipline.`,
    },
  ];

  const recommendedDate = scenarios[1].targetDate; // medium = recommended

  // ── Conclusion ────────────────────────────────────────────────
  const conclusion = getConclusion(input, result, scenarios);

  return {
    weeklyTasks,
    monthlyBreakdown,
    reductions,
    scenarios,
    recommendedDate,
    conclusion,
  };
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function getWeeklyTip(input: ScanInput, result: ScanResult, index: number): string {
  const tips = [
    input.horeca > 80
      ? `Beperk restaurantbezoek deze week tot maximaal 1×. Dat bespaart je direct €${Math.round(input.horeca / 4)}.`
      : "Zet je spaarbedrag aan het begin van de week direct apart — voordat je het kunt uitgeven.",

    input.boodschappen > 200
      ? "Schrijf een boodschappenlijst en stick eraan. Koop geen producten die niet op de lijst staan."
      : "Controleer aan het einde van elke dag je uitgaven. Bewustwording is de eerste stap.",

    input.abonnementen > 30
      ? `Controleer deze week al je abonnementen. Gebruik je ze allemaal actief? Zeg er één op.`
      : "Vermijd impulsaankopen: wacht 48 uur voordat je iets koopt dat niet gepland was.",

    `Evalueer je week: heb je €${Math.round(result.requiredMonthly / 4)} gespaard? Zo niet — wat ging er mis en hoe voorkom je dat volgende week?`,
  ];

  return tips[index] ?? tips[0];
}

function getReductions(input: ScanInput, result: ScanResult): string[] {
  const out: string[] = [];
  const leak = result.biggestLeak.name;

  if (input.boodschappen > 0 && (leak === "Boodschappen" || input.boodschappen > 150)) {
    out.push(
      `Boodschappen (€${Math.round(input.boodschappen)}/maand) — Meal prep op zondag, koop huismerken en gebruik een boodschappenlijst. Bespaarpotentieel: €${Math.round(input.boodschappen * 0.2)}/maand.`
    );
  }
  if (input.horeca > 0 && (leak === "Uit eten & entertainment" || input.horeca > 60)) {
    out.push(
      `Uit eten & entertainment (€${Math.round(input.horeca)}/maand) — Beperk restaurantbezoek naar 2× per maand en verwissel dure avondjes uit voor thuisactiviteiten. Bespaarpotentieel: €${Math.round(input.horeca * 0.3)}/maand.`
    );
  }
  if (input.vervoer > 0 && (leak === "Vervoer" || input.vervoer > 80)) {
    out.push(
      `Vervoer (€${Math.round(input.vervoer)}/maand) — Fiets of OV vaker, controleer je autoverzekering en overweeg carpooling. Bespaarpotentieel: €${Math.round(input.vervoer * 0.15)}/maand.`
    );
  }
  if (input.abonnementen > 35) {
    out.push(
      `Abonnementen (€${Math.round(input.abonnementen)}/maand) — Maak een lijst van alles wat je betaalt. Zeg abonnementen op die je minder dan 1× per week gebruikt. Bespaarpotentieel: €${Math.round(input.abonnementen * 0.25)}/maand.`
    );
  }
  if (input.overig > 50) {
    out.push(
      `Overige uitgaven (€${Math.round(input.overig)}/maand) — Pas de 30-dagenregel toe: wacht een maand voordat je niet-geplande aankopen doet. Bespaarpotentieel: €${Math.round(input.overig * 0.2)}/maand.`
    );
  }

  if (out.length === 0) {
    out.push(
      "Zet je spaarbedrag op de 1e van de maand automatisch over naar een apart spaarrekening — voordat je het kunt uitgeven."
    );
    out.push(
      "Gebruik een budgetapp om elke aankoop bij te houden. Mensen die hun uitgaven bijhouden sparen gemiddeld 18% meer."
    );
  }

  return out.slice(0, 4);
}

function getConclusion(
  input: ScanInput,
  result: ScanResult,
  scenarios: ProgressScenario[]
): string {
  const doelNaam = input.doelNaam || "je spaardoel";
  const medium = scenarios[1];
  const fmt = (d: Date) =>
    d.toLocaleDateString("nl-NL", { month: "long", year: "numeric" });

  if (result.status === "achievable") {
    return `${doelNaam.charAt(0).toUpperCase() + doelNaam.slice(1)} is haalbaar met je huidige financiën. Als je elke maand €${Math.round(result.requiredMonthly)} opzij zet, behaal je je doel ruim op tijd. Door slim te bezuinigen op ${result.biggestLeak.name} kun je het zelfs ${scenarios[2].monthsNeeded} maanden eerder bereiken.`;
  }

  if (result.status === "warning") {
    return `Je bent er bijna. Met €${medium.extraPerMonth} extra besparing per maand op ${result.biggestLeak.name}, haal je ${doelNaam} rond ${fmt(medium.targetDate)}. Dit is haalbaar — het vraagt alleen om een concreet plan dat je elke week volgt.`;
  }

  return `${doelNaam.charAt(0).toUpperCase() + doelNaam.slice(1)} is haalbaar, maar niet zonder aanpassingen. Door dit weekplan te volgen en te bezuinigen op ${result.biggestLeak.name}, bereik je je doel rond ${fmt(medium.targetDate)}. Het vereist discipline de eerste 4–6 weken, maar daarna wordt het een gewoonte.`;
}
