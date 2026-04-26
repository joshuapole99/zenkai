import Anthropic from "@anthropic-ai/sdk";
import { ScanInput, ScanResult } from "./calculate";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Stable system prompt — cached via cache_control (min 1024 tokens on Haiku)
const SYSTEM_PROMPT = `Je bent een Nederlandse financieel coach die persoonlijke spaarplannen maakt op basis van iemands echte financiële situatie.

Je krijgt inkomen, uitgaven per categorie, spaardoel en looptijd. Maak een concreet, persoonlijk plan.

Geef ALLEEN een geldig JSON-object terug. Geen uitleg, geen markdown, geen backticks. Exact dit formaat:

{
  "weeklyTasks": [
    { "week": 1, "weeklyTarget": 150, "tip": "Concrete actie voor week 1 met specifiek bedrag" },
    { "week": 2, "weeklyTarget": 150, "tip": "Concrete actie voor week 2 met specifiek bedrag" },
    { "week": 3, "weeklyTarget": 150, "tip": "Concrete actie voor week 3 met specifiek bedrag" },
    { "week": 4, "weeklyTarget": 150, "tip": "Evaluatie en aanpassing week 4 met specifiek bedrag" }
  ],
  "reductions": [
    "Categorienaam (€X/maand) — Concrete actie. Bespaarpotentieel: €Y/maand.",
    "Categorienaam (€X/maand) — Concrete actie. Bespaarpotentieel: €Y/maand."
  ],
  "conclusion": "2-3 zinnen persoonlijke conclusie met exacte bedragen en realistisch tijdframe."
}

Regels:
- weeklyTarget: wekelijks spaarbedrag als getal (euros, geen symbool)
- Elke tip: noem de specifieke categorie, een concrete actie en het te besparen bedrag
- reductions: alleen voor categorieën met uitgaven boven €0, maximaal 4 items
- conclusion: motiverend, met naam van het doel, exacte bedragen en maand/jaar
- Alles in het Nederlands, geen Engels
- ALLEEN JSON, geen andere tekst`;

export interface AIPlanContent {
  weeklyTasks: { week: number; weeklyTarget: number; tip: string }[];
  reductions: string[];
  conclusion: string;
}

export async function generatePlanAI(
  input: ScanInput,
  result: ScanResult
): Promise<AIPlanContent> {
  const amountNeeded = Math.max(0, input.doel - input.spaargeld);
  const statusLabel =
    result.status === "achievable"
      ? "haalbaar"
      : result.status === "warning"
      ? "krap maar haalbaar"
      : "niet haalbaar zonder aanpassingen";

  const userData = `Financiële situatie:
- Netto maandinkomen: €${input.inkomen}
- Spaardoel: "${input.doelNaam || "spaardoel"}" — €${input.doel}
- Al gespaard: €${input.spaargeld} | Nog nodig: €${amountNeeded}
- Tijdframe: ${input.maanden} maanden
- Status: ${statusLabel}

Uitgaven per maand:
- Huur/Hypotheek: €${input.huur}
- Abonnementen: €${input.abonnementen}
- Verzekeringen: €${input.verzekeringen}
- Boodschappen: €${input.boodschappen}
- Vervoer: €${input.vervoer}
- Uit eten & entertainment: €${input.horeca}
- Overige uitgaven: €${input.overig}

Berekening:
- Maandelijkse spaarruimte: €${Math.round(result.monthlyCapacity)}
- Benodigd per maand: €${Math.round(result.requiredMonthly)}
- Maandelijks tekort: €${Math.round(Math.max(0, result.savingsGap))}
- Grootste kostenpost: ${result.biggestLeak.name} (€${Math.round(result.biggestLeak.amount)}/maand)`;

  const response = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 1200,
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        // Cache the system prompt — it's identical for every plan generation
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: userData }],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Geen tekst response van Claude");
  }

  const parsed = JSON.parse(textBlock.text) as AIPlanContent;
  return parsed;
}
