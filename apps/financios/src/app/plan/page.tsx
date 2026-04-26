import Link from "next/link";
import Image from "next/image";
import { calculate, parseScanInput } from "@/lib/calculate";
import { generatePlan } from "@/lib/generatePlan";
import { generatePlanAI, type AIPlanContent } from "@/lib/generatePlanAI";
import { redis } from "@/lib/redis";
import { getSession } from "@/lib/session";
import WeekChecklist from "./WeekChecklist";
import PlanParamsLoader from "./PlanParamsLoader";

export default async function PlanPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;

  if (!params.token) {
    return <PlanParamsLoader />;
  }

  const stored = await redis.get<{ params: string } | string>(`plan:${params.token}`);
  if (!stored) {
    console.log(`[plan] token not found in Redis: plan:${params.token}`);
    return <PlanParamsLoader />;
  }

  // Handle both object (Upstash auto-deserializes) and legacy JSON string
  const planData = typeof stored === "string" ? JSON.parse(stored) as { params: string } : stored;

  // Re-scan flow: if inkomen is in URL, the user submitted new scan params — use those
  const tokenParams = params.inkomen
    ? params
    : Object.fromEntries(new URLSearchParams(planData.params));

  return <PlanContent params={tokenParams} token={params.token} />;
}

async function PlanContent({ params, token }: { params: Record<string, string>; token: string }) {

  const input = parseScanInput(params);
  const result = calculate(input);
  const plan = generatePlan(input, result);
  const session = await getSession();

  // AI-generated content: try Redis cache first to avoid paying per refresh
  const aiCacheKey = `plan_ai:${token}`;
  let aiContent: AIPlanContent | null = await redis.get<AIPlanContent>(aiCacheKey);
  if (!aiContent) {
    try {
      aiContent = await generatePlanAI(input, result);
      await redis.set(aiCacheKey, aiContent, { ex: 60 * 60 * 24 * 365 });
    } catch (err) {
      console.error("[plan] AI generation failed, falling back:", err);
    }
  }

  // Use AI content where available, fall back to deterministic plan
  const weeklyTasks = aiContent?.weeklyTasks ?? plan.weeklyTasks;
  const reductions = aiContent?.reductions ?? plan.reductions;
  const conclusion = aiContent?.conclusion ?? plan.conclusion;

  const doelNaam = input.doelNaam || "Spaardoel";
  const fmtEuro = (n: number) => Math.round(n).toLocaleString("nl-NL");
  const fmtDate = (d: Date) =>
    d.toLocaleDateString("nl-NL", { month: "long", year: "numeric" });

  return (
    <main className="min-h-screen">
      {/* Sticky nav */}
      <nav className="sticky top-0 z-50 border-b border-border backdrop-blur-md bg-background/80">
        <div className="max-w-xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Image src="/logo.png" alt="Financios" width={120} height={30} priority />
          </Link>
          <div className="flex items-center gap-3">
            {session ? (
              <Link href="/dashboard" className="text-sm font-semibold text-accent hover:text-accent-hover transition-colors">
                Dashboard →
              </Link>
            ) : (
              <Link href="/scan" className="text-sm text-muted hover:text-foreground transition-colors">
                Nieuwe scan
              </Link>
            )}
          </div>
        </div>
      </nav>

      <div className="px-4 py-10 max-w-xl mx-auto">
      {/* Payment success banner */}
      <div className="bg-success/10 border border-success/20 rounded-xl px-4 py-3 mb-8 flex items-center gap-3 shadow-[var(--shadow-card)]">
        <span className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center shrink-0">
          <span className="text-success text-xs font-bold">✓</span>
        </span>
        <div>
          <p className="text-sm font-semibold text-foreground">Betaling geslaagd</p>
          <p className="text-xs text-muted">
            Jouw persoonlijk spaarplan staat hieronder klaar.
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-medium uppercase tracking-wider text-accent mb-1">
          Jouw spaarfix plan
        </p>
        <h1 className="text-3xl font-semibold text-foreground tracking-tight">
          {doelNaam}
        </h1>
        <p className="text-muted mt-1">
          €{" "}{input.doel.toLocaleString("nl-NL")} · {input.maanden} maanden
          doel · Aanbevolen datum:{" "}
          <span className="text-foreground font-medium">
            {fmtDate(plan.recommendedDate)}
          </span>
        </p>
      </div>

      {/* ── 1. Recommended target date (prominent) ─────────────── */}
      <div className="bg-accent/10 border border-accent/30 rounded-2xl p-6 mb-4 shadow-[var(--shadow-card)] text-center">
        <p className="text-xs font-medium uppercase tracking-wider text-muted mb-2">
          Jouw realistische afrondingsdatum
        </p>
        <p className="text-3xl font-bold text-foreground">
          {fmtDate(plan.recommendedDate)}
        </p>
        <p className="text-sm text-muted mt-2">
          Als je het weekplan hieronder volgt en slim bezuinigt op{" "}
          {result.biggestLeak.name.toLowerCase()}.
        </p>
      </div>

      {/* ── 2. Weekly plan ─────────────────────────────────────── */}
      <PlanCard title="Weekplan" subtitle="Vink af wat je gedaan hebt">
        <WeekChecklist tasks={weeklyTasks} token={token} fmtEuro={fmtEuro} />
      </PlanCard>

      {/* ── 3. Monthly breakdown ───────────────────────────────── */}
      <PlanCard
        title="Maandelijkse breakdown"
        subtitle={`Jouw €${fmtEuro(input.inkomen)} netto inkomen verdeeld`}
      >
        <div className="flex flex-col gap-3">
          {plan.monthlyBreakdown.map((line) => (
            <div key={line.category}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-foreground">{line.category}</span>
                <span className="text-foreground font-medium">
                  €{" "}{fmtEuro(line.amount)}
                  <span className="text-muted font-normal ml-1">
                    ({line.percentage}%)
                  </span>
                </span>
              </div>
              <div className="h-1.5 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent/60 rounded-full"
                  style={{ width: `${Math.min(line.percentage, 100)}%` }}
                />
              </div>
            </div>
          ))}

          {/* Savings row */}
          <div className="border-t border-border pt-3">
            <div className="flex justify-between text-sm">
              <span className="text-success font-semibold">
                Beschikbaar om te sparen
              </span>
              <span
                className={`font-bold ${
                  result.monthlyCapacity >= 0 ? "text-success" : "text-danger"
                }`}
              >
                €{" "}{fmtEuro(result.monthlyCapacity)}
              </span>
            </div>
          </div>
        </div>
      </PlanCard>

      {/* ── 4. Expense reductions ──────────────────────────────── */}
      <PlanCard
        title="Bezuinigingstips op maat"
        subtitle="Gebaseerd op jóuw uitgavepatroon"
      >
        <div className="flex flex-col gap-4">
          {reductions.map((tip, i) => {
            const [head, ...rest] = tip.split(" — ");
            return (
              <div key={i} className="flex gap-3 items-start">
                <span className="w-7 h-7 rounded-full bg-warning/20 text-warning text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <div>
                  <span className="text-sm font-semibold text-foreground block mb-0.5">
                    {head}
                  </span>
                  <span className="text-xs text-muted">{rest.join(" — ")}</span>
                </div>
              </div>
            );
          })}
        </div>
      </PlanCard>

      {/* ── 5. 3 Scenarios ─────────────────────────────────────── */}
      <PlanCard
        title="3 scenario's"
        subtitle="Kies het tempo dat bij jou past"
      >
        <div className="flex flex-col gap-3">
          {plan.scenarios.map((s) => (
            <div
              key={s.name}
              className={`rounded-xl p-4 border ${
                s.name === "Slim bezuinigen"
                  ? "border-accent/40 bg-accent/5"
                  : "border-border bg-background"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-foreground">
                  {s.emoji} {s.name}
                </span>
                {s.name === "Slim bezuinigen" && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                    Aanbevolen
                  </span>
                )}
              </div>
              <p className="text-xs text-muted mb-2">{s.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">
                  €{" "}{fmtEuro(s.monthlyAmount)}/maand
                </span>
                <span className="font-medium text-foreground">
                  {fmtDate(s.targetDate)} ({s.monthsNeeded} mnd)
                </span>
              </div>
            </div>
          ))}
        </div>
      </PlanCard>

      {/* ── 6. Conclusion ──────────────────────────────────────── */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-6 shadow-[var(--shadow-card)]">
        <h2 className="font-semibold text-foreground mb-3 tracking-tight">
          Conclusie
        </h2>
        <p className="text-sm text-foreground leading-[1.75]">
          {conclusion}
        </p>
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted">
            Dit plan is gegenereerd op basis van jouw ingevoerde gegevens.
            Resultaten zijn schattingen.{" "}
            <Link href="/disclaimer" className="underline hover:text-foreground">
              Disclaimer
            </Link>
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <Link
          href={`/scan?token=${token}&${new URLSearchParams(params as Record<string, string>).toString()}`}
          className="w-full bg-card border border-border hover:border-accent/50 hover:bg-card-hover text-foreground font-medium py-3.5 rounded-xl text-center text-sm transition-all"
        >
          Scan aanpassen
        </Link>
      </div>

      {/* Partner share */}
      <div className="bg-card border border-border rounded-2xl p-5 mt-4 mb-2 shadow-[var(--shadow-card)] text-center">
        <p className="text-sm font-semibold text-foreground mb-1">
          Bereken voor een vriend of partner
        </p>
        <p className="text-xs text-muted mb-4 leading-relaxed">
          Stuur de gratis scan door — in 60 seconden weet ook hij/zij waar het geld blijft.
        </p>
        <a
          href={`https://wa.me/?text=${encodeURIComponent(
            "Ik heb net mijn spaarplan gemaakt met Financios. Bereken ook jouw spaardoel gratis op: https://financios.nl/scan"
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-[#25D366] hover:bg-[#1ebe5a] text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all shadow-lg active:scale-[0.98] tracking-wide"
        >
          Stuur via WhatsApp
        </a>
        <p className="text-xs text-muted mt-2">Of deel: financios.nl/scan</p>
      </div>

      </div>
    </main>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function PlanCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 mb-4 shadow-[var(--shadow-card)]">
      <h2 className="font-semibold text-foreground tracking-tight mb-0.5">
        {title}
      </h2>
      <p className="text-xs font-medium uppercase tracking-wider text-muted mb-5">
        {subtitle}
      </p>
      {children}
    </div>
  );
}
