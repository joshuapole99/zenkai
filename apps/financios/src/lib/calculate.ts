export interface ScanInput {
  inkomen: number;
  huur: number;
  abonnementen: number;
  verzekeringen: number;
  boodschappen: number;
  vervoer: number;
  horeca: number;
  overig: number;
  doel: number;
  spaargeld: number;
  maanden: number;
  doelNaam: string;
}

export type GoalStatus = "achievable" | "warning" | "not-achievable";

export interface ExpenseLeak {
  name: string;
  amount: number;
}

export interface Scenario {
  label: string;
  description: string;
}

export interface ScanResult {
  totalFixed: number;
  totalVariable: number;
  totalExpenses: number;
  monthlyCapacity: number;
  requiredMonthly: number;
  savingsGap: number;
  status: GoalStatus;
  biggestLeak: ExpenseLeak;
  scenarios: Scenario[];
  monthsNeededAtCapacity: number | null;
}

export function calculate(input: ScanInput): ScanResult {
  const totalFixed = input.huur + input.abonnementen + input.verzekeringen;
  const totalVariable =
    input.boodschappen + input.vervoer + input.horeca + input.overig;
  const totalExpenses = totalFixed + totalVariable;

  const monthlyCapacity = input.inkomen - totalExpenses;
  const amountNeeded = Math.max(0, input.doel - input.spaargeld);
  const requiredMonthly =
    input.maanden > 0 ? amountNeeded / input.maanden : Infinity;

  const savingsGap = requiredMonthly - monthlyCapacity;

  // Status determination
  let status: GoalStatus;
  if (savingsGap <= 0) {
    status = "achievable";
  } else if (savingsGap <= requiredMonthly * 0.2) {
    status = "warning";
  } else {
    status = "not-achievable";
  }

  // Biggest expense leak (excluding housing — that's usually unavoidable)
  const variableItems: ExpenseLeak[] = [
    { name: "Boodschappen", amount: input.boodschappen },
    { name: "Vervoer", amount: input.vervoer },
    { name: "Uit eten & entertainment", amount: input.horeca },
    { name: "Overige uitgaven", amount: input.overig },
    { name: "Abonnementen", amount: input.abonnementen },
  ];
  const biggestLeak = variableItems.reduce((a, b) =>
    b.amount > a.amount ? b : a
  );

  // Fix scenarios
  const scenarios: Scenario[] = [];

  if (monthlyCapacity > 0) {
    const monthsNeeded = Math.ceil(amountNeeded / monthlyCapacity);
    scenarios.push({
      label: `${monthsNeeded} maanden`,
      description: `Als je huidig spaarritme aanhoudt, haal je je doel in ${monthsNeeded} maanden (${Math.ceil(monthsNeeded / 12)} jaar).`,
    });
  }

  if (savingsGap > 0 && biggestLeak.amount > 0) {
    const reduceBy = Math.min(biggestLeak.amount * 0.3, savingsGap);
    scenarios.push({
      label: `Bezuinig €${Math.ceil(reduceBy)}/maand`,
      description: `Verminder "${biggestLeak.name}" met 30% (€${Math.ceil(reduceBy)}) om dichter bij je doel te komen.`,
    });
  }

  if (savingsGap > 0) {
    const extendedMonths = Math.ceil(
      amountNeeded / Math.max(monthlyCapacity, 1)
    );
    const alternativeGoal = Math.round(monthlyCapacity * input.maanden + input.spaargeld);
    scenarios.push({
      label: `Pas doel aan naar €${alternativeGoal.toLocaleString("nl-NL")}`,
      description: `Met je huidige spaarruimte kun je in ${input.maanden} maanden €${alternativeGoal.toLocaleString("nl-NL")} sparen.`,
    });
  }

  const monthsNeededAtCapacity =
    monthlyCapacity > 0 ? Math.ceil(amountNeeded / monthlyCapacity) : null;

  return {
    totalFixed,
    totalVariable,
    totalExpenses,
    monthlyCapacity,
    requiredMonthly,
    savingsGap,
    status,
    biggestLeak,
    scenarios,
    monthsNeededAtCapacity,
  };
}

export function parseScanInput(params: Record<string, string>): ScanInput {
  const n = (key: string, fallback = 0) =>
    Math.max(0, parseFloat(params[key] ?? String(fallback)) || fallback);

  return {
    inkomen: n("inkomen"),
    huur: n("huur"),
    abonnementen: n("abonnementen"),
    verzekeringen: n("verzekeringen"),
    boodschappen: n("boodschappen"),
    vervoer: n("vervoer"),
    horeca: n("horeca"),
    overig: n("overig"),
    doel: n("doel"),
    spaargeld: n("spaargeld"),
    maanden: Math.max(1, n("maanden", 12)),
    doelNaam: params["doelNaam"] ?? "Spaardoel",
  };
}
