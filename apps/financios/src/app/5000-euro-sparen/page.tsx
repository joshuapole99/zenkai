import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "5000 euro sparen – hoeveel per maand en hoe lang duurt het?",
  description:
    "Ontdek hoe je €5.000 spaart. Inclusief rekenvoorbeeld, maandelijkse bedragen en praktische tips. Bereken jouw persoonlijk spaarplan.",
  openGraph: {
    title: "5000 euro sparen – hoeveel per maand en hoe lang duurt het?",
    description:
      "Ontdek hoe je €5.000 spaart. Inclusief rekenvoorbeeld, maandelijkse bedragen en praktische tips.",
    url: "https://financios.nl/5000-euro-sparen",
  },
};

const tableRows = [
  { months: 6, monthly: 834 },
  { months: 12, monthly: 417 },
  { months: 18, monthly: 278 },
  { months: 24, monthly: 209 },
  { months: 36, monthly: 139 },
];

const tips = [
  {
    n: "1",
    title: "Open een aparte spaarrekening",
    body: "Zet je spaargeld weg op een rekening die je niet dagelijks ziet. Maak op de 1e van de maand automatisch het bedrag over — vóórdat je het kunt uitgeven.",
  },
  {
    n: "2",
    title: "Snij in je grootste kostenpost",
    body: "De meeste mensen verspillen €50–€150 per maand aan één categorie: boodschappen, abonnementen, of eten buiten de deur. Snij daar 20% af en je bent al halverwege.",
  },
  {
    n: "3",
    title: "Gebruik de 'pay yourself first' methode",
    body: "Behandel je spaarbedrag als een vaste lasten. Zet het opzij vóór je andere uitgaven doet — niet wat er aan het einde van de maand overblijft.",
  },
  {
    n: "4",
    title: "Weet exact wat je kunt missen",
    body: "Hoeveel je kunt sparen hangt af van je inkomen minus al je vaste en variabele kosten. Gebruik onze scan om in 60 seconden te zien wat er maandelijks overblijft.",
  },
];

const faqs = [
  {
    q: "Hoe lang duurt het om 5000 euro te sparen?",
    a: "Dat hangt af van hoeveel je per maand opzij kunt zetten. Bij €200 per maand duurt het 25 maanden. Bij €417 per maand haal je €5.000 in precies 12 maanden. Met onze scan zie je direct wat voor jou realistisch is.",
  },
  {
    q: "Is 5000 euro sparen realistisch?",
    a: "Ja, voor de meeste mensen is €5.000 haalbaar — maar de tijdlijn verschilt. Met een modaal inkomen en wat bezuinigingen is €200–€300 per maand opzijzetten realistisch. Dan ben je er in anderhalf tot twee jaar.",
  },
  {
    q: "Hoeveel moet ik per maand sparen voor 5000 euro?",
    a: "In 12 maanden: €417/mnd. In 18 maanden: €278/mnd. In 24 maanden: €209/mnd. Heb je al wat spaargeld? Dan is het bedrag lager. Vul je huidige spaarsaldo in bij onze scan.",
  },
  {
    q: "Wat is de beste manier om 5000 euro te sparen?",
    a: "Automatisch sparen werkt het beste: stel een automatische incasso in op de 1e van de maand. Zorg dat je een concreet doel hebt (waarvoor, wanneer) — dat maakt het makkelijker vol te houden.",
  },
  {
    q: "Kan ik 5000 euro sparen met een laag inkomen?",
    a: "Met een lager inkomen duurt het langer, maar het is nog steeds haalbaar. €100 per maand levert je in 50 maanden €5.000 op. De sleutel is consistent zijn, niet snel zijn. Onze scan laat zien hoeveel ruimte je realistisch hebt.",
  },
];

export default function VijfduizendEuroSparen() {
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
            href="/scan?doelNaam=Sparen&doel=5000&maanden=24"
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
            5000 euro sparen: hoeveel per maand en hoe lang duurt het?
          </h1>
          <p className="text-lg text-muted leading-[1.7]">
            €5.000 is een veelgesteld spaardoel — voor een auto, verbouwing,
            buffer of grote aankoop. In deze gids zie je precies hoeveel je
            per maand moet sparen, een realistisch rekenvoorbeeld, en hoe je
            het snelst je doel bereikt.
          </p>
        </div>

        {/* Quick table */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-8 shadow-[var(--shadow-card)]">
          <h2 className="font-semibold text-foreground mb-1 tracking-tight">
            Snel berekend
          </h2>
          <p className="text-xs font-medium uppercase tracking-wider text-muted mb-5">
            Hoeveel per maand voor €5.000?
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-medium uppercase tracking-wider text-muted pb-3">
                    Tijdsduur
                  </th>
                  <th className="text-right text-xs font-medium uppercase tracking-wider text-muted pb-3">
                    Per maand
                  </th>
                  <th className="text-right text-xs font-medium uppercase tracking-wider text-muted pb-3">
                    Per week
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, i) => (
                  <tr
                    key={row.months}
                    className={`border-b border-border/50 ${i === 2 ? "bg-accent/5" : ""}`}
                  >
                    <td className="py-3 text-foreground font-medium">
                      {row.months} maanden
                      {i === 2 && (
                        <span className="ml-2 text-[10px] font-semibold uppercase tracking-wider text-accent bg-accent/10 px-1.5 py-0.5 rounded-full">
                          Populair
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-right text-foreground">
                      €{row.monthly}/mnd
                    </td>
                    <td className="py-3 text-right text-success font-medium">
                      €{Math.round(row.monthly / 4.33)}/wk
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted mt-4">
            * Bedragen zijn afgerond. Heb je al spaargeld? Dan is je maandelijks bedrag lager.
          </p>
        </div>

        {/* Rekenvoorbeeld */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-4">
            Realistisch rekenvoorbeeld
          </h2>
          <p className="text-muted leading-[1.75] mb-4">
            Stel: je hebt een netto inkomen van €2.200 per maand. Je vaste
            lasten zijn €1.350 (huur, boodschappen, verzekeringen, abonnementen).
            Dan houd je €850 over voor variabele uitgaven en sparen.
          </p>
          <div className="bg-card border border-border rounded-xl p-5 mb-4 shadow-[var(--shadow-card)]">
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Netto inkomen</span>
                <span className="text-foreground font-medium">€2.200</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Vaste lasten</span>
                <span className="text-foreground font-medium">− €1.350</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Variabele uitgaven</span>
                <span className="text-foreground font-medium">− €550</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between">
                <span className="text-foreground font-semibold">Beschikbaar voor sparen</span>
                <span className="text-success font-bold">€300/mnd</span>
              </div>
            </div>
          </div>
          <p className="text-muted leading-[1.75]">
            Met €300 per maand haal je €5.000 in{" "}
            <span className="text-foreground font-semibold">~17 maanden</span>.
            Het lastige is niet de berekening — het is weten{" "}
            <em>of</em> je dat ook daadwerkelijk kunt missen. Gebruik onze scan
            om je eigen cijfers in te vullen.
          </p>
        </div>

        {/* Mid-page CTA */}
        <div className="bg-accent/10 border border-accent/30 rounded-2xl p-5 mb-8 shadow-[var(--shadow-card)]">
          <p className="font-semibold text-foreground mb-1">Kun jij €5.000 sparen?</p>
          <p className="text-sm text-muted mb-4">Vul je inkomen en uitgaven in — in 60 seconden zie je hoeveel je kunt sparen en of €5.000 haalbaar is.</p>
          <Link href="/scan?doelNaam=Sparen&doel=5000&maanden=18" className="inline-block bg-accent hover:bg-accent-hover text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all shadow-lg shadow-accent/20 active:scale-[0.98] tracking-wide">
            Bereken mijn spaarplan →
          </Link>
          <p className="text-xs text-muted mt-3">Geen registratie · Gratis</p>
        </div>

        {/* Conversion block */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-8 shadow-[var(--shadow-card)]">
          <h2 className="font-semibold text-foreground mb-3 tracking-tight">
            Wat betekent dit voor jou?
          </h2>
          <p className="text-sm text-muted mb-4 leading-relaxed">
            De meeste mensen denken dat ze &ldquo;gewoon meer moeten sparen&rdquo;. Maar meestal klopt dat niet.
          </p>
          <p className="text-sm text-foreground mb-3">Het probleem zit in:</p>
          <ul className="space-y-1.5 mb-4">
            <li className="flex items-center gap-2 text-sm text-muted"><span className="text-accent">→</span> waar je geld naartoe gaat</li>
            <li className="flex items-center gap-2 text-sm text-muted"><span className="text-accent">→</span> hoeveel je écht kunt missen</li>
            <li className="flex items-center gap-2 text-sm text-muted"><span className="text-accent">→</span> hoe realistisch je doel is</li>
          </ul>
          <p className="text-sm text-foreground mb-3">Binnen 60 seconden weet je precies:</p>
          <ul className="space-y-1.5">
            <li className="flex items-center gap-2 text-sm text-muted"><span className="text-success font-bold">✔</span> hoeveel je kunt sparen</li>
            <li className="flex items-center gap-2 text-sm text-muted"><span className="text-success font-bold">✔</span> waar je geld lekt</li>
            <li className="flex items-center gap-2 text-sm text-muted"><span className="text-success font-bold">✔</span> wat je moet aanpassen</li>
          </ul>
        </div>

        {/* CTA 1 — calculator entry point */}
        <div className="bg-accent/10 border border-accent/30 rounded-2xl p-6 mb-8 shadow-[var(--shadow-card)] text-center">
          <h2 className="font-semibold text-foreground mb-2 tracking-tight">
            Bereken jouw plan
          </h2>
          <p className="text-sm text-muted mb-5 leading-relaxed">
            Vul je eigen inkomen en uitgaven in. In 60 seconden zie je hoeveel
            jij kunt sparen en wanneer je €5.000 hebt bereikt.
          </p>
          <Link
            href="/scan?doelNaam=Sparen&doel=5000&maanden=18"
            className="inline-block bg-accent hover:bg-accent-hover text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg shadow-accent/20 active:scale-[0.98] tracking-wide"
          >
            Bereken jouw plan →
          </Link>
          <p className="text-xs text-muted mt-3">
            Geen registratie · Geen creditcard · 100% gratis
          </p>
        </div>

        {/* Tips */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-4">
            4 tips om sneller €5.000 te sparen
          </h2>
          <div className="flex flex-col gap-4">
            {tips.map((tip) => (
              <div
                key={tip.n}
                className="flex gap-4 items-start bg-card border border-border rounded-2xl p-5 shadow-[var(--shadow-card)]"
              >
                <span className="w-8 h-8 rounded-full bg-accent/20 text-accent text-sm font-bold flex items-center justify-center shrink-0">
                  {tip.n}
                </span>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {tip.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">{tip.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-6">
            Veelgestelde vragen over 5000 euro sparen
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

        {/* Footer CTA */}
        <div className="bg-accent/10 border border-accent/30 rounded-2xl p-6 mb-10 shadow-[var(--shadow-card)] text-center">
          <h2 className="font-semibold text-foreground mb-2 tracking-tight">
            Klaar om te starten?
          </h2>
          <p className="text-sm text-muted mb-5 leading-relaxed">
            Doe de scan en ontdek of €5.000 sparen haalbaar is voor jou —
            en wat je kunt aanpassen om sneller te komen.
          </p>
          <Link
            href="/scan?doelNaam=Sparen&doel=5000&maanden=18"
            className="inline-block bg-accent hover:bg-accent-hover text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg shadow-accent/20 active:scale-[0.98] tracking-wide"
          >
            Bereken jouw plan gratis →
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
