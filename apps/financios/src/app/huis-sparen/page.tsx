import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Huis kopen sparen – hoeveel eigen geld heb je nodig?",
  description:
    "Bereken hoeveel je per maand moet sparen voor je eigen huis. Eigen inbreng, bijkomende kosten en een realistisch spaarplan op basis van jouw budget.",
  openGraph: {
    title: "Huis kopen sparen – hoeveel eigen geld heb je nodig?",
    description:
      "Bereken hoeveel je per maand moet sparen voor je eigen huis. Gratis calculator + persoonlijk spaarplan.",
    url: "https://financios.nl/huis-sparen",
  },
};

const examples = [
  { budget: 10000, months24: 417, months36: 278 },
  { budget: 20000, months24: 834, months36: 556 },
  { budget: 30000, months24: 1250, months36: 834 },
  { budget: 40000, months24: 1667, months36: 1112 },
  { budget: 50000, months24: 2084, months36: 1389 },
  { budget: 75000, months24: 3125, months36: 2084 },
];

const faqs = [
  {
    q: "Hoeveel eigen geld heb ik nodig om een huis te kopen?",
    a: "In Nederland kun je sinds 2022 maximaal 100% van de woningwaarde lenen. Maar je hebt altijd eigen geld nodig voor de bijkomende kosten: notariskosten, overdrachtsbelasting (2%), taxatiekosten en advieskosten. Reken op 4–6% van de koopprijs. Bij een woning van €300.000 is dat al snel €12.000–€18.000.",
  },
  {
    q: "Wat zijn de bijkomende kosten bij het kopen van een huis?",
    a: "De grootste post is overdrachtsbelasting (2% van de koopsom, starters onder 35 jaar betalen 0%). Daarnaast: notariskosten (€1.000–€2.500), taxatie (€400–€800), hypotheekadvies (€2.000–€3.500) en eventueel bouwkundige keuring (€300–€500). Tel alles bij elkaar: €4.000–€10.000.",
  },
  {
    q: "Hoe lang duurt het om €20.000 te sparen voor een huis?",
    a: "Dat hangt af van hoeveel je maandelijks kunt sparen. Bij €500 per maand duurt het 40 maanden (ruim 3 jaar). Bij €800 per maand is het in 25 maanden. Gebruik onze scan om te zien wat realistisch is voor jouw situatie.",
  },
  {
    q: "Kan ik ook sparen terwijl ik huur betaal?",
    a: "Ja, maar huur is vaak de grootste belemmering. Hoe hoger je huur, hoe minder er over is om te sparen. In onze scan vul je je huur in als vaste last — zo zie je precies hoeveel spaarruimte je écht hebt.",
  },
];

export default function HuisSparen() {
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
            href="/scan?doelNaam=Eigen+woning&doel=25000&maanden=36"
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
            Huis kopen sparen: hoeveel heb je nodig en hoe kom je er?
          </h1>
          <p className="text-lg text-muted leading-[1.7]">
            Een eigen huis kopen is het grootste financiële doel voor veel
            Nederlanders. Maar hoeveel eigen geld heb je écht nodig — en hoe
            spaar je dat bij elkaar terwijl je huur betaalt?
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 mb-8 shadow-[var(--shadow-card)]">
          <h2 className="font-semibold text-foreground mb-1 tracking-tight">
            Snel berekend
          </h2>
          <p className="text-xs font-medium uppercase tracking-wider text-muted mb-5">
            Hoeveel per maand voor jouw spaardoel?
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-medium uppercase tracking-wider text-muted pb-3">
                    Spaardoel
                  </th>
                  <th className="text-right text-xs font-medium uppercase tracking-wider text-muted pb-3">
                    In 2 jaar
                  </th>
                  <th className="text-right text-xs font-medium uppercase tracking-wider text-muted pb-3">
                    In 3 jaar
                  </th>
                </tr>
              </thead>
              <tbody>
                {examples.map((ex, i) => (
                  <tr key={ex.budget} className={`border-b border-border/50 ${i === 2 ? "bg-accent/5" : ""}`}>
                    <td className="py-3 text-foreground font-medium">
                      €{ex.budget.toLocaleString("nl-NL")}
                      {i === 2 && (
                        <span className="ml-2 text-[10px] font-semibold uppercase tracking-wider text-accent bg-accent/10 px-1.5 py-0.5 rounded-full">
                          Populair
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-right text-foreground">€{ex.months24.toLocaleString("nl-NL")}/mnd</td>
                    <td className="py-3 text-right text-success font-medium">€{ex.months36.toLocaleString("nl-NL")}/mnd</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted mt-4">
            * Exclusief rente op spaarrekening. Bedragen zijn afgerond.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-4">
            Wat heb je écht nodig voor een huis?
          </h2>
          <p className="text-muted leading-[1.75] mb-4">
            Naast de hypotheek zijn er altijd bijkomende kosten die je zelf moet betalen:
          </p>
          <div className="bg-card border border-border rounded-xl p-5 mb-4 shadow-[var(--shadow-card)]">
            <div className="flex flex-col gap-2 text-sm">
              {[
                ["Overdrachtsbelasting (2%)", "bij €300.000 woning = €6.000"],
                ["Notariskosten", "€1.000 – €2.500"],
                ["Hypotheekadvies", "€2.000 – €3.500"],
                ["Taxatie", "€400 – €800"],
                ["Bouwkundige keuring", "€300 – €500"],
              ].map(([item, cost]) => (
                <div key={item} className="flex justify-between">
                  <span className="text-foreground">{item}</span>
                  <span className="text-muted">{cost}</span>
                </div>
              ))}
              <div className="flex justify-between border-t border-border pt-2 mt-1">
                <span className="font-semibold text-foreground">Totaal geschat</span>
                <span className="font-bold text-warning">€10.000 – €13.000</span>
              </div>
            </div>
          </div>
          <p className="text-muted leading-[1.75]">
            Starters onder 35 jaar betalen geen overdrachtsbelasting voor woningen tot €510.000 — dat scheelt duizenden euro&apos;s.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-4">
            4 tips om sneller te sparen voor een huis
          </h2>
          <div className="flex flex-col gap-4">
            {[
              {
                n: "1",
                title: "Open een spaarrekening specifiek voor je huis",
                body: "Geef je spaardoel een naam en een eigen rekening. Maak elke maand automatisch een bedrag over op de 1e. Wat je niet ziet, geef je niet uit.",
              },
              {
                n: "2",
                title: "Gebruik de startersvrijstelling",
                body: "Ben je tussen 18 en 35 jaar en koop je een woning onder €510.000? Dan betaal je 0% overdrachtsbelasting in plaats van 2%. Dat is al snel €6.000 – €10.000 minder eigen inbreng nodig.",
              },
              {
                n: "3",
                title: "Bezuinig op je grootste variabele kostenpost",
                body: "De meeste mensen laten tientallen tot honderden euro's per maand weglekken via boodschappen, horeca of abonnementen. Onze scan laat precies zien waar het naartoe gaat.",
              },
              {
                n: "4",
                title: "Weet hoeveel je écht kunt missen",
                body: "Veel mensen overschatten hun spaarruimte. Vul je inkomen en uitgaven in bij onze scan — dan weet je in 60 seconden wat realistisch is voor jouw situatie.",
              },
            ].map((tip) => (
              <div key={tip.n} className="flex gap-4 items-start bg-card border border-border rounded-2xl p-5 shadow-[var(--shadow-card)]">
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

        <div className="bg-accent/10 border border-accent/30 rounded-2xl p-6 mb-8 shadow-[var(--shadow-card)] text-center">
          <h2 className="font-semibold text-foreground mb-2 tracking-tight">
            Is jouw huis kopen haalbaar?
          </h2>
          <p className="text-sm text-muted mb-5 leading-relaxed">
            Vul je inkomsten en uitgaven in. In 60 seconden weet je hoeveel je
            kunt sparen en of jouw doel realistisch is.
          </p>
          <Link
            href="/scan?doelNaam=Eigen+woning&doel=25000&maanden=36"
            className="inline-block bg-accent hover:bg-accent-hover text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg shadow-accent/20 active:scale-[0.98] tracking-wide"
          >
            Bereken mijn spaarplan gratis →
          </Link>
          <p className="text-xs text-muted mt-3">
            Geen registratie · Geen creditcard · 100% gratis
          </p>
        </div>

        {/* Mid-page CTA */}
        <div className="bg-accent/10 border border-accent/30 rounded-2xl p-5 mb-8 shadow-[var(--shadow-card)]">
          <p className="font-semibold text-foreground mb-1">Kun jij sparen voor een eigen woning?</p>
          <p className="text-sm text-muted mb-4">Vul je inkomen en uitgaven in — in 60 seconden zie je hoeveel je kunt sparen en wanneer jouw eigen inbreng haalbaar is.</p>
          <Link href="/scan?doelNaam=Eigen+woning&doel=25000&maanden=36" className="inline-block bg-accent hover:bg-accent-hover text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all shadow-lg shadow-accent/20 active:scale-[0.98] tracking-wide">
            Bereken mijn huisplan →
          </Link>
          <p className="text-xs text-muted mt-3">Geen registratie · Gratis</p>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-6">
            Veelgestelde vragen
          </h2>
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
