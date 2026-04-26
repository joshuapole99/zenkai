import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Auto sparen – hoeveel per maand en hoe lang duurt het?",
  description:
    "Ontdek hoe je spaart voor een auto. Inclusief rekenvoorbeeld, spaartabel en praktische tips. Bereken jouw persoonlijk spaarplan.",
  openGraph: {
    title: "Auto sparen – hoeveel per maand en hoe lang duurt het?",
    description:
      "Ontdek hoe je spaart voor een auto. Inclusief rekenvoorbeeld, spaartabel en praktische tips.",
    url: "https://financios.nl/auto-sparen",
  },
};

// Common car savings goals with 12 and 24 month options
const tableRows = [
  { goal: 3000, months12: 250, months24: 125 },
  { goal: 5000, months12: 417, months24: 209 },
  { goal: 8000, months12: 667, months24: 334 },
  { goal: 12000, months12: 1000, months24: 500 },
  { goal: 20000, months12: 1667, months24: 834 },
];

const tips = [
  {
    n: "1",
    title: "Open een aparte autorekening",
    body: "Zet je autospaargeld op een rekening met een herkenbare naam ('Auto 2026'). Maak op de 1e van de maand automatisch het bedrag over. Je vergeet het en het groeit vanzelf.",
  },
  {
    n: "2",
    title: "Reken je huidige auto mee",
    body: "Heb je al een auto? De inruilwaarde of verkoopprijs telt mee als spaargeld. Een auto van €3.000 verkopen scheelt je een jaar sparen bij een doel van €8.000.",
  },
  {
    n: "3",
    title: "Denk verder dan de aankoopprijs",
    body: "Een auto kost meer dan de prijs alleen. Reken ook wegenbelasting, verzekering, onderhoud en brandstof mee. Zorg dat je buffer hebt voor de eerste maanden rijkosten.",
  },
  {
    n: "4",
    title: "Weet wat je maandelijks kunt missen",
    body: "Hoeveel je kunt sparen hangt af van je inkomen minus al je vaste en variabele kosten. Gebruik onze scan om in 60 seconden te zien hoeveel spaarruimte je realistisch hebt.",
  },
];

const faqs = [
  {
    q: "Hoeveel moet ik sparen voor een auto?",
    a: "Dat hangt af van je budget en het type auto. Een betrouwbare tweedehands auto kost €5.000–€12.000. Een nieuwe instapmodel begint rond €18.000–€25.000. Begin met een concreet bedrag, bereken dan hoeveel je per maand opzij moet zetten.",
  },
  {
    q: "Hoe lang duurt het sparen voor een auto?",
    a: "Bij een doel van €8.000 en €250 per maand duurt het ~32 maanden. Bij €400/mnd ben je er in 20 maanden. De tijdlijn hangt volledig af van je spaarcapaciteit — gebruik onze scan om te berekenen wat voor jou haalbaar is.",
  },
  {
    q: "Is het slimmer om te sparen of te lenen voor een auto?",
    a: "Sparen is bijna altijd goedkoper. Autofinancieringen en rood staan kosten 5–15% rente per jaar. Als je 2 jaar spaart betaal je nul rente. Lenen kan in sommige gevallen handig zijn, maar let altijd op de totale kosten.",
  },
  {
    q: "Kan ik beter een tweedehands of nieuwe auto kopen?",
    a: "Een tweedehands auto van 3–5 jaar oud is financieel bijna altijd slimmer. De grootste waardedaling (30–40% in jaar 1) heb je dan al niet meegemaakt. Je kunt dan met minder spaargeld toe en eerder rijden.",
  },
  {
    q: "Wat als ik te weinig overhoudt om te sparen voor een auto?",
    a: "Dan is er iets te winnen in je uitgavenpatroon. Onze scan laat zien waar je geld naartoe gaat en geeft concrete bezuinigingstips op basis van jóuw situatie — zodat je sneller je autodoel bereikt.",
  },
];

export default function AutoSparen() {
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
            href="/scan?doelNaam=Auto&doel=8000&maanden=24"
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
            Auto sparen: hoeveel per maand en hoe lang duurt het?
          </h1>
          <p className="text-lg text-muted leading-[1.7]">
            Of je nu spaart voor een eerste auto, een betrouwbare tweedehands
            of een upgrade — het begint met één simpele berekening. Wij helpen
            je erachter te komen hoeveel je per maand opzij moet zetten en of
            jouw autodoel haalbaar is binnen jouw budget.
          </p>
        </div>

        {/* Quick table */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-8 shadow-[var(--shadow-card)]">
          <h2 className="font-semibold text-foreground mb-1 tracking-tight">
            Snel berekend
          </h2>
          <p className="text-xs font-medium uppercase tracking-wider text-muted mb-5">
            Hoeveel per maand voor jouw auto?
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-medium uppercase tracking-wider text-muted pb-3">
                    Autobudget
                  </th>
                  <th className="text-right text-xs font-medium uppercase tracking-wider text-muted pb-3">
                    In 12 maanden
                  </th>
                  <th className="text-right text-xs font-medium uppercase tracking-wider text-muted pb-3">
                    In 24 maanden
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, i) => (
                  <tr
                    key={row.goal}
                    className={`border-b border-border/50 ${i === 2 ? "bg-accent/5" : ""}`}
                  >
                    <td className="py-3 text-foreground font-medium">
                      €{row.goal.toLocaleString("nl-NL")}
                      {i === 2 && (
                        <span className="ml-2 text-[10px] font-semibold uppercase tracking-wider text-accent bg-accent/10 px-1.5 py-0.5 rounded-full">
                          Populair
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-right text-foreground">
                      €{row.months12}/mnd
                    </td>
                    <td className="py-3 text-right text-success font-medium">
                      €{row.months24}/mnd
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted mt-4">
            * Bedragen zijn afgerond. Heb je al spaargeld of een auto om in te ruilen? Dan is je maandelijks bedrag lager.
          </p>
        </div>

        {/* Rekenvoorbeeld */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-4">
            Realistisch rekenvoorbeeld
          </h2>
          <p className="text-muted leading-[1.75] mb-4">
            Stel: je wil een tweedehands auto kopen van €8.000. Je hebt al
            €1.500 gespaard. Je moet dus nog €6.500 bij elkaar sparen.
            Je netto inkomen is €2.400 per maand, je vaste en variabele lasten
            zijn €2.150. Je kunt €250 per maand sparen.
          </p>
          <div className="bg-card border border-border rounded-xl p-5 mb-4 shadow-[var(--shadow-card)]">
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Autobudget</span>
                <span className="text-foreground font-medium">€8.000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Huidig spaargeld</span>
                <span className="text-foreground font-medium">− €1.500</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Nog te sparen</span>
                <span className="text-foreground font-medium">€6.500</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Maandelijks sparen</span>
                <span className="text-foreground font-medium">€250/mnd</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between">
                <span className="text-foreground font-semibold">Doel bereikt in</span>
                <span className="text-success font-bold">~26 maanden</span>
              </div>
            </div>
          </div>
          <p className="text-muted leading-[1.75]">
            Het lastige is niet de berekening — het is weten{" "}
            <em>of</em> je die €250 ook daadwerkelijk kunt missen.
            Gebruik onze scan om je eigen cijfers in te vullen.
          </p>
        </div>

        {/* Mid-page CTA */}
        <div className="bg-accent/10 border border-accent/30 rounded-2xl p-5 mb-8 shadow-[var(--shadow-card)]">
          <p className="font-semibold text-foreground mb-1">Kun jij sparen voor een auto?</p>
          <p className="text-sm text-muted mb-4">Vul je inkomen en uitgaven in — in 60 seconden zie je hoeveel je kunt sparen en wanneer jouw auto haalbaar is.</p>
          <Link href="/scan?doelNaam=Auto&doel=8000&maanden=24" className="inline-block bg-accent hover:bg-accent-hover text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all shadow-lg shadow-accent/20 active:scale-[0.98] tracking-wide">
            Bereken mijn autoplan →
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

        {/* CTA 1 */}
        <div className="bg-accent/10 border border-accent/30 rounded-2xl p-6 mb-8 shadow-[var(--shadow-card)] text-center">
          <h2 className="font-semibold text-foreground mb-2 tracking-tight">
            Bereken jouw plan
          </h2>
          <p className="text-sm text-muted mb-5 leading-relaxed">
            Vul je eigen inkomen en uitgaven in. In 60 seconden zie je hoeveel
            jij kunt sparen en wanneer jij jouw auto kunt kopen.
          </p>
          <Link
            href="/scan?doelNaam=Auto&doel=8000&maanden=24"
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
            4 tips om sneller te sparen voor een auto
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
                  <h3 className="font-semibold text-foreground mb-1">{tip.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{tip.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-6">
            Veelgestelde vragen over auto sparen
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
            Doe de scan en ontdek of jouw autodoel haalbaar is —
            en wat je kunt aanpassen om sneller te komen.
          </p>
          <Link
            href="/scan?doelNaam=Auto&doel=8000&maanden=24"
            className="inline-block bg-accent hover:bg-accent-hover text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg shadow-accent/20 active:scale-[0.98] tracking-wide"
          >
            Bereken jouw autoplan gratis →
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
