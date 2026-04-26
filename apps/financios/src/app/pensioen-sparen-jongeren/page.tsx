import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pensioen sparen als jongere – wanneer begin je en hoeveel?",
  description:
    "Je werkgever regelt niet alles. Ontdek hoeveel je zelf moet sparen voor later en hoe je zo vroeg mogelijk begint — ook met een klein budget.",
  openGraph: {
    title: "Pensioen sparen als jongere – wanneer begin je en hoeveel?",
    description:
      "Je werkgever regelt niet alles. Bereken hoeveel je zelf moet sparen voor later en begin zo vroeg mogelijk.",
    url: "https://financios.nl/pensioen-sparen-jongeren",
  },
};

const SCAN_HREF = "/scan?doelNaam=Pensioen+buffer&doel=10000&maanden=36";

// Maandelijks bedrag om €200.000 pensioenkapitaal op te bouwen
// Vereenvoudigd: geen rente, puur lineair — bewust conservatief
const tableRows = [
  { leeftijd: 25, jarenTot67: 42, m50: 397, m100: 198, m200: 99 },
  { leeftijd: 30, jarenTot67: 37, m50: 450, m100: 225, m200: 113 },
  { leeftijd: 35, jarenTot67: 32, m50: 521, m100: 260, m200: 130 },
  { leeftijd: 40, jarenTot67: 27, m50: 617, m100: 309, m200: 154 },
];

const faqs = [
  {
    q: "Hoeveel pensioen bouwt mijn werkgever voor mij op?",
    a: "Dat hangt af van je pensioenregeling. In loondienst bouw je via je werkgever pensioen op via een pensioenfonds, maar dat dekt zelden 100% van je huidige salaris. Als ZZP'er of freelancer bouw je helemaal niets automatisch op — dat moet je volledig zelf regelen.",
  },
  {
    q: "Wat is het verschil tussen lijfrente en banksparen?",
    a: "Beide zijn fiscaal voordelige manieren om zelf pensioen op te bouwen. Bij een lijfrente betaal je premie aan een verzekeraar; bij banksparen zet je geld op een geblokkeerde rekening bij een bank. Het voordeel: je betaalt nu minder belasting over de inleg. Het nadeel: je kunt er pas bij als je met pensioen gaat.",
  },
  {
    q: "Is €100 per maand genoeg om voor pensioen te sparen?",
    a: "Afhankelijk van je leeftijd en doel kan €100/maand al een betekenisvolle bijdrage zijn. Begin je op je 25e, dan bouw je daarmee over 42 jaar (zonder rente) al €50.400 op — met rendement aanzienlijk meer. Begin vroeg, ook al is het bedrag klein.",
  },
  {
    q: "Moet ik AOW meerekenen?",
    a: "AOW is een basisinkomen van de overheid, maar het is niet genoeg om van te leven op het niveau waaraan je gewend bent. De huidige AOW bedraagt ca. €1.400/maand (alleenstaand). Als je gewend bent aan €2.500/maand, moet je het verschil zelf aanvullen.",
  },
];

export default function PensioenSparenJongeren() {
  return (
    <main className="min-h-screen">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border px-6 py-4 flex items-center justify-between max-w-5xl mx-auto w-full backdrop-blur-md bg-background/80">
        <Link href="/">
          <Image src="/logo.png" alt="Financios" width={140} height={36} priority />
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/blog" className="text-sm text-muted hover:text-foreground transition-colors">
            Blog
          </Link>
          <Link
            href={SCAN_HREF}
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            Start scan →
          </Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-12">
        <Link href="/blog" className="text-xs text-muted hover:text-accent transition-colors inline-flex items-center gap-1 mb-8">
          ← Bekijk alle spaargidsen
        </Link>
        {/* Hero */}
        <div className="mb-10">
          <p className="text-xs font-medium uppercase tracking-wider text-accent mb-3">
            Spaargids
          </p>
          <h1 className="text-4xl font-bold text-foreground tracking-tight leading-tight mb-4">
            Pensioen sparen als jongere: wanneer begin je en hoeveel?
          </h1>
          <p className="text-lg text-muted leading-[1.7]">
            Je werkgever regelt niet alles. Als ZZP'er bouw je helemaal niets
            automatisch op. En zelfs in loondienst is het pensioen zelden
            genoeg. Hoe eerder je begint, hoe minder je elke maand hoeft te
            sparen — maar hoeveel is dat precies?
          </p>
        </div>

        {/* Berekeningstafel */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-8 shadow-[var(--shadow-card)]">
          <h2 className="font-semibold text-foreground mb-1 tracking-tight">
            Hoeveel per maand per doelkapitaal?
          </h2>
          <p className="text-xs font-medium uppercase tracking-wider text-muted mb-5">
            Maandelijks bedrag om doelkapitaal te bereiken op pensioenleeftijd 67
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-medium uppercase tracking-wider text-muted pb-3">
                    Leeftijd nu
                  </th>
                  <th className="text-right text-xs font-medium uppercase tracking-wider text-muted pb-3">
                    €50k
                  </th>
                  <th className="text-right text-xs font-medium uppercase tracking-wider text-muted pb-3">
                    €100k
                  </th>
                  <th className="text-right text-xs font-medium uppercase tracking-wider text-muted pb-3">
                    €200k
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, i) => (
                  <tr
                    key={row.leeftijd}
                    className={`border-b border-border/50 ${i === 0 ? "bg-success/5" : ""}`}
                  >
                    <td className="py-3 text-foreground font-medium">
                      {row.leeftijd} jaar
                      {i === 0 && (
                        <span className="ml-2 text-[10px] font-semibold uppercase tracking-wider text-success bg-success/10 px-1.5 py-0.5 rounded-full">
                          Begin nu
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-right text-foreground">€{row.m50}/mnd</td>
                    <td className="py-3 text-right text-foreground">€{row.m100}/mnd</td>
                    <td className="py-3 text-right text-success font-medium">€{row.m200}/mnd</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted mt-4">
            * Lineaire berekening zonder rendement — conservatief geschat. Met beleggingsrendement (historisch ~5–7%/jaar) zijn de benodigde bedragen lager.
          </p>
        </div>

        {/* Uitleg */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-4">
            Waarom zo vroeg mogelijk beginnen loont
          </h2>
          <p className="text-muted leading-[1.75] mb-4">
            Het verschil tussen beginnen op je 25e of je 35e is enorm. Niet
            omdat je langer spaart, maar omdat je rendement op rendement maakt
            — compound interest. Elk jaar dat je wacht, kost je meer dan het
            jaar erna.
          </p>
          <div className="bg-card border border-border rounded-xl p-5 mb-4 shadow-[var(--shadow-card)]">
            <p className="text-foreground font-mono text-sm text-center">
              €100/mnd × 42 jaar = €50.400 — zonder rendement
            </p>
            <p className="text-success font-mono text-sm text-center mt-1">
              €100/mnd × 42 jaar = ~€148.000 — met 5% rendement/jaar
            </p>
          </div>
          <p className="text-muted leading-[1.75]">
            Het lastige is niet begrijpen dat je moet beginnen. Het lastige is
            weten hoeveel je kunt missen. Dat hangt af van je inkomen en je
            vaste lasten — en dat verschilt per persoon.
          </p>
        </div>

        {/* Tips */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-4">
            3 manieren om als jongere te beginnen met pensioensparen
          </h2>
          <div className="flex flex-col gap-4">
            {[
              {
                n: "1",
                title: "Begin klein — ook €50/maand telt",
                body: "Je hoeft niet meteen €300/maand opzij te zetten. Begin met wat haalbaar is. €50/maand op je 25e is over 42 jaar meer dan €25.000 zonder rendement. Verhoog het bedrag zodra je inkomen stijgt.",
              },
              {
                n: "2",
                title: "Gebruik lijfrente of banksparen voor belastingvoordeel",
                body: "De inleg is aftrekbaar van je belastbaar inkomen — je betaalt er nu minder belasting over. Bij een marginale belastingdruk van 37% betaalt de Belastingdienst effectief mee aan je pensioen. Vraag je bank naar een lijfrenterekening.",
              },
              {
                n: "3",
                title: "Check je AOW-gat als ZZP'er",
                body: "Als ZZP'er bouw je geen pensioen op via een werkgever. Je hebt wel recht op AOW (~€1.400/mnd), maar dat is waarschijnlijk minder dan je gewend bent. Bereken het verschil en zorg dat je dat zelf aanvult.",
              },
            ].map((tip) => (
              <div
                key={tip.n}
                className="flex gap-4 items-start bg-card border border-border rounded-2xl p-5 shadow-[var(--shadow-card)]"
              >
                <span className="w-8 h-8 rounded-full bg-accent/20 text-accent text-sm font-bold flex items-center justify-center shrink-0">
                  {tip.n}
                </span>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{tip.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{tip.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mid-page CTA */}
        <div className="bg-accent/10 border border-accent/30 rounded-2xl p-5 mb-8 shadow-[var(--shadow-card)]">
          <p className="font-semibold text-foreground mb-1">
            Hoeveel kun jij maandelijks opzij zetten?
          </p>
          <p className="text-sm text-muted mb-4">
            Vul je inkomen en uitgaven in — in 60 seconden zie je hoeveel je
            kunt missen en of er ruimte is om nu te beginnen met pensioensparen.
          </p>
          <Link
            href={SCAN_HREF}
            className="inline-block bg-accent hover:bg-accent-hover text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all shadow-lg shadow-accent/20 active:scale-[0.98] tracking-wide"
          >
            Bereken mijn spaarruimte →
          </Link>
          <p className="text-xs text-muted mt-3">Geen registratie · Gratis</p>
        </div>

        {/* FAQ */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-6">
            Veelgestelde vragen
          </h2>
          <div className="flex flex-col gap-4">
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className="bg-card border border-border rounded-2xl p-5 shadow-[var(--shadow-card)]"
              >
                <h3 className="font-semibold text-foreground mb-2">{faq.q}</h3>
                <p className="text-sm text-muted leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="bg-accent/10 border border-accent/30 rounded-2xl p-6 mb-10 shadow-[var(--shadow-card)] text-center">
          <h2 className="font-semibold text-foreground mb-2 tracking-tight">
            Weet hoeveel jij kunt sparen voor later
          </h2>
          <p className="text-sm text-muted mb-5 leading-relaxed">
            Vul je inkomsten en uitgaven in. In 60 seconden zie je hoeveel je
            maandelijks overhoudt — en of er ruimte is om nu te beginnen.
          </p>
          <Link
            href={SCAN_HREF}
            className="inline-block bg-accent hover:bg-accent-hover text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg shadow-accent/20 active:scale-[0.98] tracking-wide"
          >
            Start gratis scan →
          </Link>
          <p className="text-xs text-muted mt-3">
            Geen registratie · Geen creditcard · 100% gratis
          </p>
        </div>

        {/* Footer links */}
        <div className="border-t border-border pt-8 flex items-center justify-between flex-wrap gap-4 text-sm text-muted">
          <Link href="/" className="hover:text-foreground transition-colors">
            ← Financios home
          </Link>
          <div className="flex gap-4">
            <Link href="/disclaimer" className="hover:text-foreground transition-colors">
              Disclaimer
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
