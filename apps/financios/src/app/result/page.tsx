import Link from "next/link";
import { calculate, parseScanInput, GoalStatus } from "@/lib/calculate";
import { getSession } from "@/lib/session";
import { sql } from "@/lib/db";

export default async function ResultPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;

  if (!params.inkomen) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-2xl font-semibold text-foreground tracking-tight mb-4">
          Geen gegevens gevonden
        </h1>
        <p className="text-muted mb-6">
          Start de scan opnieuw om je resultaten te zien.
        </p>
        <Link
          href="/scan"
          className="bg-accent hover:bg-accent-hover text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-accent/20 active:scale-[0.98] tracking-wide"
        >
          Terug naar scan
        </Link>
      </main>
    );
  }

  const input = parseScanInput(params);
  const result = calculate(input);

  // Auto-save scan for logged-in users (fire and forget)
  const session = await getSession();
  if (session) {
    sql`
      INSERT INTO scans (user_id, params, result, doel_naam)
      VALUES (${session.userId}, ${JSON.stringify(params)}, ${JSON.stringify(result)}, ${input.doelNaam || null})
    `.catch(() => {});
  }

  const doelNaam = input.doelNaam || "je spaardoel";
  const needsFix =
    result.status === "not-achievable" || result.status === "warning";

  // Display-only derivations (no business logic changes)
  const totalGapOverPeriod = Math.round(result.savingsGap * input.maanden);
  const extraMonthsLate =
    result.monthsNeededAtCapacity !== null && result.monthsNeededAtCapacity > input.maanden
      ? result.monthsNeededAtCapacity - input.maanden
      : null;

  return (
    <main className="min-h-screen">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border backdrop-blur-md bg-background/80 mb-6">
        <div className="max-w-xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-base font-bold text-foreground tracking-tight">
            Financios
          </Link>
          <Link href="/scan" className="text-sm text-muted hover:text-foreground transition-colors">
            ← Scan aanpassen
          </Link>
        </div>
      </nav>
      <div className="px-4 pb-10 max-w-xl mx-auto">

      {/* ── NOT ACHIEVABLE / WARNING PATH ─────────────────────── */}
      {needsFix && (
        <>
          {/* Status badge */}
          <div
            className={`rounded-2xl p-6 border mb-4 shadow-[var(--shadow-card)] ${
              result.status === "not-achievable"
                ? "bg-danger/10 border-danger/20"
                : "bg-warning/10 border-warning/20"
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span
                className={`w-3.5 h-3.5 rounded-full shrink-0 ${
                  result.status === "not-achievable" ? "bg-danger" : "bg-warning"
                }`}
              />
              <span
                className={`font-bold text-lg ${
                  result.status === "not-achievable"
                    ? "text-danger"
                    : "text-warning"
                }`}
              >
                {result.status === "not-achievable"
                  ? "Doel niet haalbaar"
                  : "Bijna — maar niet genoeg"}
              </span>
            </div>
            <p className="text-foreground text-sm leading-relaxed">
              {result.status === "not-achievable" ? (
                <>
                  Op dit tempo haal jij{" "}
                  <strong className="text-foreground">{doelNaam}</strong>{" "}
                  nooit op tijd.{" "}
                  {extraMonthsLate !== null ? (
                    <>
                      Je bent{" "}
                      <span className="text-danger font-semibold">
                        {extraMonthsLate} maanden te laat
                      </span>{" "}
                      — en je mist in totaal{" "}
                      <span className="text-danger font-semibold">
                        €{" "}
                        {totalGapOverPeriod.toLocaleString("nl-NL")}
                      </span>{" "}
                      aan spaargeld. Elke maand zonder plan kost je €{fmt(result.savingsGap)} extra.
                    </>
                  ) : (
                    <>
                      Je geeft momenteel meer uit dan je verdient. Zonder
                      concrete aanpassingen is dit doel onhaalbaar.
                    </>
                  )}
                </>
              ) : (
                <>
                  Bijna is niet genoeg. Je hebt{" "}
                  <span className="text-warning font-semibold">
                    €{" "}{fmt(result.savingsGap)}/maand te weinig
                  </span>
                  . Doe je niets, dan mis je over {input.maanden} maanden{" "}
                  <span className="text-warning font-semibold">
                    €{" "}{totalGapOverPeriod.toLocaleString("nl-NL")}
                  </span>{" "}
                  in totaal — en haal je je doel niet.
                </>
              )}
            </p>
          </div>

          {/* ── KIES HOE JE VERDER WILT ── */}
          <ChoosePlanSection
            doelNaam={doelNaam}
            gap={result.savingsGap}
            checkoutHref={`/checkout?${new URLSearchParams(params).toString()}`}
          />

          {/* ── GRATIS INZICHT label ── */}
          <div className="flex items-center gap-3 mb-3 mt-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted bg-border px-2.5 py-1 rounded-full">
              Jouw gratis inzicht
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Gap visualization */}
          <div className="bg-card border border-border rounded-2xl p-5 mb-6 shadow-[var(--shadow-card)]">
            <h2 className="font-semibold text-foreground mb-4">
              Jouw spaartekort
            </h2>

            <div className="grid grid-cols-3 gap-2 mb-5 text-center">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted mb-1">
                  Jij spaart
                </p>
                <p
                  className={`text-xl font-bold ${
                    result.monthlyCapacity >= 0
                      ? "text-success"
                      : "text-danger"
                  }`}
                >
                  €{" "}{fmt(Math.max(0, result.monthlyCapacity))}
                </p>
                <p className="text-xs text-muted">per maand</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted mb-1">
                  Nodig
                </p>
                <p className="text-xl font-bold text-foreground">
                  €{" "}{fmt(result.requiredMonthly)}
                </p>
                <p className="text-xs text-muted">per maand</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted mb-1">
                  Tekort
                </p>
                <p className="text-xl font-bold text-danger">
                  €{" "}{fmt(result.savingsGap)}
                </p>
                <p className="text-xs text-muted">per maand</p>
              </div>
            </div>

            {/* Gap bar */}
            <GapBar
              capacity={result.monthlyCapacity}
              required={result.requiredMonthly}
              gap={result.savingsGap}
            />

            {/* Total impact */}
            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
              <span className="text-xs text-muted">
                Totaal tekort over {input.maanden} maanden
              </span>
              <span className="text-sm font-bold text-danger">
                − €{" "}{totalGapOverPeriod.toLocaleString("nl-NL")}
              </span>
            </div>
          </div>

          {/* Free scenarios — teaser */}
          {result.scenarios.length > 0 && (
            <div className="bg-card border border-border rounded-2xl p-5 mb-6 shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between mb-1">
                <h2 className="font-semibold text-foreground">
                  Fix scenario&apos;s
                </h2>
                <span className="text-xs font-medium uppercase tracking-wider text-muted bg-border px-2 py-0.5 rounded-full">
                  Gratis inzicht
                </span>
              </div>
              <p className="text-sm text-muted mb-4">
                Er zijn manieren om dit te fixen. Maar zonder concreet weekplan weet je morgen nog steeds niet hoe.
              </p>
              <div className="flex flex-col gap-3">
                {result.scenarios.map((scenario, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <span className="w-7 h-7 rounded-full bg-accent/20 text-accent text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <div>
                      <span className="text-sm font-medium text-foreground block">
                        {scenario.label}
                      </span>
                      <span className="text-xs text-muted">
                        {scenario.description}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Biggest expense leak */}
          <div className="bg-card border border-border rounded-2xl p-5 mb-6 shadow-[var(--shadow-card)]">
            <h2 className="font-semibold text-foreground mb-1">
              Grootste uitgavenpost
            </h2>
            <p className="text-sm text-muted mb-3">
              Hier verdwijnt het meeste geld buiten vaste lasten.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-foreground">{result.biggestLeak.name}</span>
              <span className="font-bold text-warning">
                €{" "}{fmt(result.biggestLeak.amount)}/maand
              </span>
            </div>
            <div className="mt-3 h-2 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-warning rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(
                    100,
                    (result.biggestLeak.amount / result.totalExpenses) * 100
                  )}%`,
                }}
              />
            </div>
            <p className="text-xs text-muted mt-2">
              {Math.round(
                (result.biggestLeak.amount / result.totalExpenses) * 100
              )}
              % van je totale uitgaven
            </p>
            {result.biggestLeak.amount > 0 && (
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-xs text-success">
                  Gratis tip: bezuinig 20% op {result.biggestLeak.name.toLowerCase()} → <span className="font-semibold">€{fmt(result.biggestLeak.amount * 0.2)} extra per maand</span>
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── ACHIEVABLE PATH ───────────────────────────────────── */}
      {result.status === "achievable" && (
        <>
          {/* Status badge */}
          <div className="rounded-2xl p-6 border mb-6 shadow-[var(--shadow-card)] bg-success/10 border-success/20">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-3.5 h-3.5 rounded-full shrink-0 bg-success" />
              <span className="font-bold text-lg text-success">Bereikbaar</span>
            </div>
            <p className="text-foreground text-sm leading-relaxed">
              Goed nieuws: je kunt{" "}
              <strong className="text-foreground">{doelNaam}</strong> halen.
              Zet elke maand €{" "}{fmt(result.requiredMonthly)} opzij — dan
              ben je er over {input.maanden} maanden.
              {result.monthsNeededAtCapacity !== null &&
                result.monthsNeededAtCapacity < input.maanden && (
                  <>
                    {" "}
                    Bij maximale besparing kan het zelfs in{" "}
                    <span className="text-success font-semibold">
                      {result.monthsNeededAtCapacity} maanden
                    </span>
                    .
                  </>
                )}
            </p>
          </div>

          {/* Gratis inzicht label */}
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted bg-border px-2.5 py-1 rounded-full">
              Jouw gratis inzicht
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            <MetricCard
              label="Spaarruimte per maand"
              value={`€ ${fmt(result.monthlyCapacity)}`}
              valueColor="text-success"
              sub="inkomen − uitgaven"
            />
            <MetricCard
              label="Benodigd per maand"
              value={`€ ${fmt(result.requiredMonthly)}`}
              valueColor="text-foreground"
              sub="om doel te halen"
            />
          </div>

          {/* Biggest expense leak */}
          <div className="bg-card border border-border rounded-2xl p-5 mb-6 shadow-[var(--shadow-card)]">
            <h2 className="font-semibold text-foreground mb-1">
              Grootste uitgavenpost
            </h2>
            <p className="text-sm text-muted mb-3">
              Hier verdwijnt het meeste geld buiten vaste lasten.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-foreground">{result.biggestLeak.name}</span>
              <span className="font-bold text-warning">
                €{" "}{fmt(result.biggestLeak.amount)}/maand
              </span>
            </div>
            <div className="mt-3 h-2 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-warning rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(
                    100,
                    (result.biggestLeak.amount / result.totalExpenses) * 100
                  )}%`,
                }}
              />
            </div>
            <p className="text-xs text-muted mt-2">
              {Math.round(
                (result.biggestLeak.amount / result.totalExpenses) * 100
              )}
              % van je totale uitgaven
            </p>
          </div>

          {/* Fix scenarios */}
          {result.scenarios.length > 0 && (
            <div className="bg-card border border-border rounded-2xl p-5 mb-6 shadow-[var(--shadow-card)]">
              <h2 className="font-semibold text-foreground mb-1">
                Hoe je het nog sneller haalt
              </h2>
              <p className="text-sm text-muted mb-4">
                Je doel is haalbaar. Met deze aanpassingen kom je er nóg sneller.
              </p>
              <div className="flex flex-col gap-3">
                {result.scenarios.map((scenario, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <span className="w-7 h-7 rounded-full bg-accent/20 text-accent text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <div>
                      <span className="text-sm font-medium text-foreground block">
                        {scenario.label}
                      </span>
                      <span className="text-xs text-muted">
                        {scenario.description}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Achievable CTA */}
          <AchievableCard
            checkoutHref={`/checkout?${new URLSearchParams(params).toString()}`}
          />
        </>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <WhatsAppButton
          status={result.status}
          gap={result.savingsGap}
          requiredMonthly={result.requiredMonthly}
          maanden={input.maanden}
        />
        <ShareButton
          status={result.status}
          gap={result.savingsGap}
          requiredMonthly={result.requiredMonthly}
          maanden={input.maanden}
        />
        <Link
          href="/scan"
          className="w-full bg-card border border-border hover:border-accent/50 hover:bg-card-hover text-foreground font-medium py-3.5 rounded-xl text-center text-sm transition-all"
        >
          Scan opnieuw doen
        </Link>
        <Link
          href="/"
          className="w-full text-center text-sm text-muted hover:text-foreground py-2 transition-colors"
        >
          Terug naar home
        </Link>
      </div>

      <p className="text-xs text-muted text-center mt-6">
        Resultaten zijn schattingen voor informatieve doeleinden.{" "}
        <Link href="/disclaimer" className="underline hover:text-foreground">
          Disclaimer
        </Link>
      </p>
      </div>
    </main>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────

function GapBar({
  capacity,
  required,
  gap,
}: {
  capacity: number;
  required: number;
  gap: number;
}) {
  const hasCapacity = capacity > 0 && required > 0;
  const capacityPct = hasCapacity
    ? Math.min(95, Math.round((capacity / required) * 100))
    : 0;
  const gapPct = 100 - capacityPct;

  return (
    <div>
      <div className="flex justify-between text-xs text-muted mb-2">
        <span>Jij spaart nu</span>
        <span>Tekort</span>
      </div>
      <div className="h-3 rounded-full overflow-hidden flex bg-border">
        {capacityPct > 0 && (
          <div
            className="h-full bg-success/80 transition-all duration-500"
            style={{ width: `${capacityPct}%` }}
          />
        )}
        <div
          className="h-full bg-danger/80 transition-all duration-500"
          style={{ width: `${gapPct}%` }}
        />
      </div>
      <div className="flex justify-between text-xs mt-1.5">
        <span className="text-success">
          {capacityPct}% gedekt
        </span>
        <span className="text-danger">
          {gapPct}% tekort
        </span>
      </div>
    </div>
  );
}

function ChoosePlanSection({
  doelNaam,
  gap,
  checkoutHref,
}: {
  doelNaam: string;
  gap: number;
  checkoutHref: string;
}) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-foreground tracking-tight mb-3">
        Kies hoe je verder wilt
      </h2>
      <div className="flex flex-col gap-3">
        {/* Free column */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">
            Gratis inzicht — heb je al gezien
          </p>
          <ul className="space-y-2.5">
            {["Status (haalbaar of niet)", "Spaartekort per maand", "Grootste kostenpost", "1 bespaartip"].map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-muted">
                <span className="text-success font-bold shrink-0">✓</span>
                {f}
              </li>
            ))}
            {["Weekplan", "Maandoverzicht", "Exacte afrondingsdatum"].map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-muted/40 line-through">
                <span className="shrink-0">✗</span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Paid column */}
        <div className="bg-accent/5 border border-accent/40 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">
              Persoonlijk plan
            </p>
            <span className="text-sm font-bold text-foreground">€4,99 eenmalig</span>
          </div>
          {gap > 0 && (
            <p className="text-sm font-semibold text-danger mb-3">
              Jij laat € {fmt(gap)} per maand liggen
            </p>
          )}
          <ul className="space-y-2.5 mb-5">
            {["Weekplan op maat", "Maandoverzicht", "Persoonlijke bezuinigingstips", "3 scenario's", "Exacte afrondingsdatum"].map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-foreground">
                <span className="text-success font-bold shrink-0">✓</span>
                {f}
              </li>
            ))}
          </ul>
          <Link
            href={checkoutHref}
            className="block w-full bg-accent hover:bg-accent-hover text-white font-semibold py-4 rounded-xl text-center text-base transition-all shadow-lg shadow-accent/20 active:scale-[0.98] tracking-wide"
          >
            Maak mijn plan →
          </Link>
          <p className="text-xs text-muted text-center mt-2">Geen abonnement · Direct beschikbaar</p>
          <p className="text-xs text-muted/70 text-center mt-1">Dit plan betaalt zichzelf terug in maand één</p>
        </div>
      </div>
    </div>
  );
}

function PremiumCard({
  doelNaam,
  gap,
  checkoutHref,
}: {
  doelNaam: string;
  gap: number;
  checkoutHref: string;
}) {
  const features = [
    "Weekplan — weet elke week precies hoeveel je mag uitgeven",
    "Persoonlijke bezuinigingstips — gericht op jóuw grootste kostenpost",
    "3 scenario's — zodat je kiest wat haalbaar is voor jou",
    "Exacte datum — wanneer haal jij je doel als je dit plan volgt?",
    "Maandoverzicht — zie precies waar je geld naartoe gaat",
  ];

  return (
    <div className="rounded-2xl border border-accent/40 bg-card mb-6 overflow-hidden shadow-[var(--shadow-card)]">
      {/* Header strip */}
      <div className="bg-accent/10 border-b border-accent/20 px-5 py-3 flex items-center gap-2">
        <span className="text-accent text-base">✦</span>
        <span className="text-sm font-semibold text-foreground tracking-tight">
          Jouw persoonlijke spaarfix plan
        </span>
      </div>

      <div className="p-5">
        <p className="text-sm text-muted mb-4 leading-relaxed">
          Zonder plan gaat er maand na maand voorbij — en kom je nooit bij{" "}
          <span className="text-foreground font-medium">{doelNaam}</span>. Dit
          plan vertelt je exact wat je week voor week moet doen om je doel wél
          te halen.
        </p>

        {/* Feature checklist */}
        <ul className="space-y-2.5 mb-5">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm">
              <span className="text-success shrink-0 mt-0.5 font-bold">✓</span>
              <span className="text-foreground">{f}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link
          href={checkoutHref}
          className="block w-full bg-accent hover:bg-accent-hover text-white font-semibold py-4 rounded-xl text-center text-sm transition-all shadow-lg shadow-accent/20 active:scale-[0.98] tracking-wide"
        >
          Maak mijn persoonlijk spaarplan →
        </Link>

        {/* Trust line */}
        <p className="text-xs text-muted text-center mt-3">
          Eenmalig €4,99 · Direct beschikbaar · Geen abonnement
        </p>

        {/* Value anchor */}
        {gap > 0 && (
          <p className="text-xs text-muted/70 text-center mt-1.5">
            Je mist €{" "}{fmt(gap)}/maand. Dit plan betaalt zichzelf al
            terug in maand één.
          </p>
        )}
      </div>
    </div>
  );
}

function AchievableCard({ checkoutHref }: { checkoutHref: string }) {
  const features = [
    "Weekplan — weet elke week precies hoeveel je mag uitgeven",
    "Exacte datum — wanneer haal jij je doel als je dit plan volgt?",
    "Persoonlijke bezuinigingstips — gericht op jóuw grootste kostenpost",
  ];

  return (
    <div className="rounded-2xl border border-success/30 bg-card mb-6 overflow-hidden shadow-[var(--shadow-card)]">
      <div className="bg-success/10 border-b border-success/20 px-5 py-3 flex items-center gap-2">
        <span className="text-success text-base">✦</span>
        <span className="text-sm font-semibold text-foreground tracking-tight">
          Haal je doel nóg sneller
        </span>
      </div>
      <div className="p-5">
        <p className="text-sm text-muted mb-4 leading-relaxed">
          Je doel is haalbaar — maar zonder concreet plan glipt de tijd weg.
          Dit weekplan vertelt je precies wat je elke week moet doen.
        </p>
        <ul className="space-y-2.5 mb-5">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm">
              <span className="text-success shrink-0 mt-0.5 font-bold">✓</span>
              <span className="text-foreground">{f}</span>
            </li>
          ))}
        </ul>
        <Link
          href={checkoutHref}
          className="block w-full bg-accent hover:bg-accent-hover text-white font-semibold py-4 rounded-xl text-center text-sm transition-all shadow-lg shadow-accent/20 active:scale-[0.98] tracking-wide"
        >
          Bekijk mijn weekplan →
        </Link>
        <p className="text-xs text-muted text-center mt-3">
          Eenmalig €4,99 · Direct beschikbaar · Geen abonnement
        </p>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  valueColor,
  sub,
}: {
  label: string;
  value: string;
  valueColor: string;
  sub: string;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-[var(--shadow-card)]">
      <p className="text-xs font-medium uppercase tracking-wider text-muted mb-2">
        {label}
      </p>
      <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
      <p className="text-xs text-muted mt-1">{sub}</p>
    </div>
  );
}

function ShareButton({
  status,
  gap,
  requiredMonthly,
  maanden,
}: {
  status: GoalStatus;
  gap: number;
  requiredMonthly: number;
  maanden: number;
}) {
  const shareText =
    status === "achievable"
      ? `Mijn spaardoel is haalbaar! Met €${Math.round(requiredMonthly).toLocaleString("nl-NL")}/maand ben ik er over ${maanden} maanden 💪\n\nBereken ook jouw situatie: financios.nl`
      : `Ik kom €${Math.round(gap).toLocaleString("nl-NL")}/maand tekort voor mijn spaardoel 😬\n\nBereken ook jouw situatie: financios.nl`;
  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
  return (
    <a
      href={shareUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full flex items-center justify-center gap-2.5 bg-card border border-border hover:border-accent/50 hover:bg-card-hover text-foreground font-medium py-3.5 rounded-xl text-sm transition-all"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4 fill-current shrink-0">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
      </svg>
      Deel je resultaat
    </a>
  );
}

function WhatsAppButton({
  status,
  gap,
  requiredMonthly,
  maanden,
}: {
  status: GoalStatus;
  gap: number;
  requiredMonthly: number;
  maanden: number;
}) {
  const shareText =
    status === "achievable"
      ? `Mijn spaardoel is haalbaar! Met €${Math.round(requiredMonthly).toLocaleString("nl-NL")}/maand ben ik er over ${maanden} maanden 💪\n\nBereken ook jouw situatie: https://financios.nl`
      : `Ik kom €${Math.round(gap).toLocaleString("nl-NL")}/maand tekort voor mijn spaardoel 😬\n\nBereken ook jouw situatie: https://financios.nl`;
  const shareUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  return (
    <a
      href={shareUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full flex items-center justify-center gap-2.5 bg-card border border-border hover:border-accent/50 hover:bg-card-hover text-foreground font-medium py-3.5 rounded-xl text-sm transition-all"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4 fill-current shrink-0 text-[#25D366]">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
      Deel via WhatsApp
    </a>
  );
}

function fmt(n: number): string {
  return Math.round(n).toLocaleString("nl-NL");
}
