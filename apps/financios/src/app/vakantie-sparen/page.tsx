import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Vakantie sparen – hoeveel moet je per maand opzij zetten?",
  description:
    "Bereken hoeveel je per maand moet sparen voor jouw vakantie. Gratis calculator + persoonlijk spaarplan op basis van jouw budget.",
  openGraph: {
    title: "Vakantie sparen – hoeveel moet je per maand opzij zetten?",
    description:
      "Bereken hoeveel je per maand moet sparen voor jouw vakantie. Gratis calculator + persoonlijk spaarplan.",
    url: "https://financios.nl/vakantie-sparen",
  },
};

// Static example calculations
const examples = [
  { budget: 500, months6: 83, months12: 42 },
  { budget: 1000, months6: 167, months12: 84 },
  { budget: 1500, months6: 250, months12: 125 },
  { budget: 2000, months6: 334, months12: 167 },
  { budget: 3000, months6: 500, months12: 250 },
  { budget: 5000, months6: 834, months12: 417 },
];

const faqs = [
  {
    q: "Hoeveel moet ik sparen voor een vakantie?",
    a: "Dat hangt af van je bestemming, reisduur en reisgezelschap. Een weekendje weg in Europa kost al snel €500–€1.000 per persoon. Een verre reis naar Azië of de VS kost €1.500–€3.000 of meer. Deel het bedrag door het aantal maanden dat je hebt tot je vakantie — dat is je maandelijkse spaardoelstelling.",
  },
  {
    q: "Is €150 per maand sparen voor een vakantie realistisch?",
    a: "Dat is afhankelijk van je inkomen en vaste lasten. €150 per maand levert je over 10 maanden €1.500 op — genoeg voor een mooie Europese vakantie. Of het realistisch is hangt af van hoeveel je overhoudt na je vaste kosten. Gebruik onze scan om dat te berekenen.",
  },
  {
    q: "Hoe zet ik het makkelijkst geld apart voor een vakantie?",
    a: "Open een aparte spaarrekening en maak op de 1e van de maand automatisch een bedrag over. Zo geef je het geld niet uit voordat je het hebt gespaart. Dit heet 'pay yourself first' — één van de meest effectieve spaarmethoden.",
  },
  {
    q: "Wat als ik te weinig overhoudt om te sparen?",
    a: "Dan is het tijd om je uitgavenpatroon onder de loep te nemen. Onze scan laat zien waar je geld naartoe gaat en geeft concrete tips om je spaarruimte te vergroten.",
  },
];

export default function VakantieSparen() {
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
            href="/scan?doelNaam=Vakantie&doel=1500&maanden=12"
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
            Vakantie sparen: hoeveel moet je per maand opzij zetten?
          </h1>
          <p className="text-lg text-muted leading-[1.7]">
            Of je nu droomt van een citytrip naar Barcelona of een verre reis
            naar Japan — sparen begint met één simpele berekening. Wij helpen
            je erachter te komen of het haalbaar is en hoe je het snelst
            je vakantiegeld bij elkaar spaart.
          </p>
        </div>

        {/* Quick calculator table */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-8 shadow-[var(--shadow-card)]">
          <h2 className="font-semibold text-foreground mb-1 tracking-tight">
            Snel berekend
          </h2>
          <p className="text-xs font-medium uppercase tracking-wider text-muted mb-5">
            Hoeveel per maand voor jouw vakantiebudget?
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-medium uppercase tracking-wider text-muted pb-3">
                    Vakantiebudget
                  </th>
                  <th className="text-right text-xs font-medium uppercase tracking-wider text-muted pb-3">
                    In 6 maanden
                  </th>
                  <th className="text-right text-xs font-medium uppercase tracking-wider text-muted pb-3">
                    In 12 maanden
                  </th>
                </tr>
              </thead>
              <tbody>
                {examples.map((ex, i) => (
                  <tr
                    key={ex.budget}
                    className={`border-b border-border/50 ${i === 2 ? "bg-accent/5" : ""}`}
                  >
                    <td className="py-3 text-foreground font-medium">
                      €{ex.budget.toLocaleString("nl-NL")}
                      {i === 2 && (
                        <span className="ml-2 text-[10px] font-semibold uppercase tracking-wider text-accent bg-accent/10 px-1.5 py-0.5 rounded-full">
                          Populair
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-right text-foreground">
                      €{ex.months6}/mnd
                    </td>
                    <td className="py-3 text-right text-success font-medium">
                      €{ex.months12}/mnd
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted mt-4">
            * Bedragen zijn afgerond. Inclusief eventueel al aanwezig spaargeld
            ga je er sneller komen.
          </p>
        </div>

        {/* How it works */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-4">
            Zo bereken je jouw maandelijkse spaarbedrag
          </h2>
          <p className="text-muted leading-[1.75] mb-4">
            De formule is eenvoudig:
          </p>
          <div className="bg-card border border-border rounded-xl p-5 mb-4 shadow-[var(--shadow-card)]">
            <p className="text-foreground font-mono text-sm text-center">
              (vakantiebudget − huidig spaargeld) ÷ maanden = maandelijks bedrag
            </p>
          </div>
          <p className="text-muted leading-[1.75]">
            Stel je wil €1.500 sparen voor een vakantie over 10 maanden en je
            hebt al €200 opzij staan. Dan moet je elke maand{" "}
            <span className="text-foreground font-semibold">€130</span> sparen
            (€1.300 ÷ 10). Het lastige is niet de berekening — het is weten{" "}
            <em>of</em> je dat ook daadwerkelijk kunt missen.
          </p>
        </div>

        {/* Tips */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-4">
            3 tips om sneller te sparen voor je vakantie
          </h2>
          <div className="flex flex-col gap-4">
            {[
              {
                n: "1",
                title: "Open een aparte vakantierekening",
                body: "Zet je spaargeld op een aparte rekening zodat je het niet per ongeluk uitgeeft. Maak op de 1e van de maand automatisch het bedrag over — voordat je het kunt besteden.",
              },
              {
                n: "2",
                title: "Bezuinig op je grootste kostenpost",
                body: "De meeste mensen geven te veel uit aan één categorie: boodschappen, uit eten of abonnementen. Bezuinig 20% op jouw grootste post en je hebt al snel €50–€150 extra per maand.",
              },
              {
                n: "3",
                title: "Weet exact wat je kunt missen",
                body: "Hoeveel je kunt sparen hangt af van je inkomen minus al je vaste en variabele kosten. Gebruik onze scan om in 60 seconden te zien wat er maandelijks overblijft.",
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
                  <h3 className="font-semibold text-foreground mb-1">
                    {tip.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">{tip.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mid-page CTA */}
        <div className="bg-accent/10 border border-accent/30 rounded-2xl p-5 mb-8 shadow-[var(--shadow-card)]">
          <p className="font-semibold text-foreground mb-1">
            Kun jij sparen voor een vakantie?
          </p>
          <p className="text-sm text-muted mb-4">
            Vul je inkomen en uitgaven in — in 60 seconden zie je hoeveel je kunt sparen en of je vakantiedoel realistisch is.
          </p>
          <Link
            href="/scan?doelNaam=Vakantie&doel=1500&maanden=12"
            className="inline-block bg-accent hover:bg-accent-hover text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all shadow-lg shadow-accent/20 active:scale-[0.98] tracking-wide"
          >
            Bereken mijn vakantieplan →
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

        {/* CTA */}
        <div className="bg-accent/10 border border-accent/30 rounded-2xl p-6 mb-10 shadow-[var(--shadow-card)] text-center">
          <h2 className="font-semibold text-foreground mb-2 tracking-tight">
            Bereken of jouw vakantie haalbaar is
          </h2>
          <p className="text-sm text-muted mb-5 leading-relaxed">
            Vul je inkomsten en uitgaven in. In 60 seconden weet je hoeveel je
            kunt sparen en of je vakantiedoel realistisch is.
          </p>
          <Link
            href="/scan?doelNaam=Vakantie&doel=1500&maanden=12"
            className="inline-block bg-accent hover:bg-accent-hover text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg shadow-accent/20 active:scale-[0.98] tracking-wide"
          >
            Bereken mijn vakantieplan gratis →
          </Link>
          <p className="text-xs text-muted mt-3">
            Geen registratie · Geen creditcard · 100% gratis
          </p>
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
