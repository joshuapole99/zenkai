import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Bruiloft sparen – hoeveel kost een bruiloft en hoe spaar je ervoor?",
  description:
    "Bereken hoeveel je per maand moet sparen voor je bruiloft. Realistisch spaarplan op basis van jouw budget en tijdlijn.",
  openGraph: {
    title: "Bruiloft sparen – hoeveel kost een bruiloft en hoe spaar je ervoor?",
    description:
      "Bereken hoeveel je per maand moet sparen voor je bruiloft. Gratis calculator + persoonlijk spaarplan.",
    url: "https://financios.nl/bruiloft-sparen",
  },
};

const examples = [
  { budget: 3000, months12: 250, months24: 125 },
  { budget: 5000, months12: 417, months24: 209 },
  { budget: 8000, months12: 667, months24: 334 },
  { budget: 10000, months12: 834, months24: 417 },
  { budget: 15000, months12: 1250, months24: 625 },
  { budget: 20000, months12: 1667, months24: 834 },
];

const faqs = [
  {
    q: "Hoeveel kost een gemiddelde bruiloft in Nederland?",
    a: "Een gemiddelde bruiloft in Nederland kost tussen de €8.000 en €20.000. De grootste kostenposten zijn de locatie (€2.000–€6.000), catering (€50–€120 per persoon), fotograaf (€1.500–€3.500) en bloemen/decoratie (€500–€2.000). Een kleinere ceremonie met 20–30 personen kan ook voor €3.000–€5.000.",
  },
  {
    q: "Hoe lang van tevoren moet je sparen voor een bruiloft?",
    a: "De meeste stellen beginnen 1 tot 2 jaar van tevoren te sparen. Dat geeft je genoeg tijd om een realistisch bedrag per maand opzij te zetten zonder jezelf te veel te belasten. Begin je later? Dan moet je meer per maand sparen of je budget aanpassen.",
  },
  {
    q: "Kunnen we ook een deel van het bruiloftsbudget lenen?",
    a: "Technisch gezien kan dat, maar het is sterk af te raden. Een lening voor een feest betekent dat je jaren na je trouwdag nog steeds terugbetaalt. Beter is het om je budget aan te passen aan wat je realistisch kunt sparen.",
  },
  {
    q: "Hoe bespaar je op een bruiloft zonder in te leveren op kwaliteit?",
    a: "Kies een doordeweekse dag (vrijdag of zaterdag middag in plaats van avond), nodig minder mensen uit, kies een locatie buiten de Randstad, of vraag vrienden/familie om te helpen met catering of decoratie. De locatie en catering zijn de grootste bezuinigingsposten.",
  },
];

export default function BruiloftSparen() {
  return (
    <main className="min-h-screen">
      <nav className="sticky top-0 z-50 border-b border-border px-6 py-4 flex items-center justify-between max-w-5xl mx-auto w-full backdrop-blur-md bg-background/80">
        <Link href="/">
          <Image src="/logo.png" alt="Financios" width={140} height={36} priority />
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/blog" className="text-sm text-muted hover:text-foreground transition-colors">
            Blog
          </Link>
          <Link
            href="/scan?doelNaam=Bruiloft&doel=10000&maanden=18"
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
        <div className="mb-10">
          <p className="text-xs font-medium uppercase tracking-wider text-accent mb-3">
            Spaargids
          </p>
          <h1 className="text-4xl font-bold text-foreground tracking-tight leading-tight mb-4">
            Bruiloft sparen: hoeveel kost het en hoe spaar je ervoor?
          </h1>
          <p className="text-lg text-muted leading-[1.7]">
            Je trouwdag is één van de mooiste dagen van je leven — maar ook
            één van de duurste. Met een realistisch spaarplan hoef je achteraf
            niet met een kater te zitten van de rekening.
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 mb-8 shadow-[var(--shadow-card)]">
          <h2 className="font-semibold text-foreground mb-1 tracking-tight">
            Snel berekend
          </h2>
          <p className="text-xs font-medium uppercase tracking-wider text-muted mb-5">
            Hoeveel per maand voor jouw bruiloftsbudget?
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-medium uppercase tracking-wider text-muted pb-3">Budget</th>
                  <th className="text-right text-xs font-medium uppercase tracking-wider text-muted pb-3">In 12 mnd</th>
                  <th className="text-right text-xs font-medium uppercase tracking-wider text-muted pb-3">In 24 mnd</th>
                </tr>
              </thead>
              <tbody>
                {examples.map((ex, i) => (
                  <tr key={ex.budget} className={`border-b border-border/50 ${i === 3 ? "bg-accent/5" : ""}`}>
                    <td className="py-3 text-foreground font-medium">
                      €{ex.budget.toLocaleString("nl-NL")}
                      {i === 3 && (
                        <span className="ml-2 text-[10px] font-semibold uppercase tracking-wider text-accent bg-accent/10 px-1.5 py-0.5 rounded-full">
                          Gemiddeld
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-right text-foreground">€{ex.months12.toLocaleString("nl-NL")}/mnd</td>
                    <td className="py-3 text-right text-success font-medium">€{ex.months24.toLocaleString("nl-NL")}/mnd</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-4">
            Wat kost een bruiloft gemiddeld?
          </h2>
          <div className="bg-card border border-border rounded-xl p-5 mb-4 shadow-[var(--shadow-card)]">
            <div className="flex flex-col gap-2 text-sm">
              {[
                ["Locatie", "€2.000 – €6.000"],
                ["Catering (per persoon)", "€50 – €120 p.p."],
                ["Fotograaf", "€1.500 – €3.500"],
                ["Bloemen & decoratie", "€500 – €2.000"],
                ["Kleding (trouwjurk + pak)", "€500 – €3.000"],
                ["Muziek / DJ", "€500 – €1.500"],
              ].map(([item, cost]) => (
                <div key={item} className="flex justify-between">
                  <span className="text-foreground">{item}</span>
                  <span className="text-muted">{cost}</span>
                </div>
              ))}
              <div className="flex justify-between border-t border-border pt-2 mt-1">
                <span className="font-semibold text-foreground">Totaal (50 gasten)</span>
                <span className="font-bold text-warning">€8.000 – €18.000</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-4">
            4 tips om slim te sparen voor je bruiloft
          </h2>
          <div className="flex flex-col gap-4">
            {[
              {
                n: "1",
                title: "Maak een gezamenlijk spaarplan",
                body: "Als jullie allebei bijdragen, spaar je twee keer zo snel. Maak een gezamenlijke spaarrekening specifiek voor de bruiloft en spreek af hoeveel jullie elk maand inleggen.",
              },
              {
                n: "2",
                title: "Stel je prioriteiten vroeg vast",
                body: "Wat is voor jullie het allerbelangrijkste? Fotograaf, locatie, catering? Gooi het budget hieraan — en bezuinig op de rest. Zo houd je het betaalbaar zonder in te leveren op wat echt telt.",
              },
              {
                n: "3",
                title: "Plan doordeweeks of buiten het seizoen",
                body: "Trouwen op een vrijdag of buiten de zomermaanden kan duizenden euro's schelen op locatie- en cateringkosten. Locaties rekenen vaak 20–40% minder voor niet-zaterdagboekingen.",
              },
              {
                n: "4",
                title: "Weet wat je samen kunt missen",
                body: "Twee inkomens maakt sparen makkelijker — maar ook vaste lasten zijn hoger. Gebruik onze scan om per persoon te zien wat er maandelijks realistisch gespaard kan worden.",
              },
            ].map((tip) => (
              <div key={tip.n} className="flex gap-4 items-start bg-card border border-border rounded-2xl p-5 shadow-[var(--shadow-card)]">
                <span className="w-8 h-8 rounded-full bg-accent/20 text-accent text-sm font-bold flex items-center justify-center shrink-0">{tip.n}</span>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{tip.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{tip.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-accent/10 border border-accent/30 rounded-2xl p-6 mb-8 shadow-[var(--shadow-card)] text-center">
          <h2 className="font-semibold text-foreground mb-2 tracking-tight">
            Is jouw bruiloft financieel haalbaar?
          </h2>
          <p className="text-sm text-muted mb-5 leading-relaxed">
            Vul je inkomsten en uitgaven in. In 60 seconden zie je hoeveel je
            kunt sparen en of je doel realistisch is.
          </p>
          <Link
            href="/scan?doelNaam=Bruiloft&doel=10000&maanden=18"
            className="inline-block bg-accent hover:bg-accent-hover text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg shadow-accent/20 active:scale-[0.98] tracking-wide"
          >
            Bereken mijn bruiloftsplan gratis →
          </Link>
          <p className="text-xs text-muted mt-3">Geen registratie · Geen creditcard · 100% gratis</p>
        </div>

        {/* Mid-page CTA */}
        <div className="bg-accent/10 border border-accent/30 rounded-2xl p-5 mb-8 shadow-[var(--shadow-card)]">
          <p className="font-semibold text-foreground mb-1">Kun jij sparen voor je bruiloft?</p>
          <p className="text-sm text-muted mb-4">Vul je inkomen en uitgaven in — in 60 seconden zie je hoeveel je kunt sparen en of jouw bruiloftsbudget haalbaar is.</p>
          <Link href="/scan?doelNaam=Bruiloft&doel=10000&maanden=18" className="inline-block bg-accent hover:bg-accent-hover text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all shadow-lg shadow-accent/20 active:scale-[0.98] tracking-wide">
            Bereken mijn bruiloftsplan →
          </Link>
          <p className="text-xs text-muted mt-3">Geen registratie · Gratis</p>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-6">Veelgestelde vragen</h2>
          <div className="flex flex-col gap-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-card border border-border rounded-2xl p-5 shadow-[var(--shadow-card)]">
                <h3 className="font-semibold text-foreground mb-2">{faq.q}</h3>
                <p className="text-sm text-muted leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-border pt-8 flex items-center justify-between flex-wrap gap-4 text-sm text-muted">
          <Link href="/" className="hover:text-foreground transition-colors">← Financios home</Link>
          <div className="flex gap-4">
            <Link href="/disclaimer" className="hover:text-foreground transition-colors">Disclaimer</Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
