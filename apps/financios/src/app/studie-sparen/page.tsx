import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Studie sparen – hoeveel kost studeren en hoe spaar je ervoor?",
  description:
    "Bereken hoeveel je per maand moet sparen voor een studie. Collegegeld, studieboeken, huur en levensonderhoud — alles op een rij.",
  openGraph: {
    title: "Studie sparen – hoeveel kost studeren en hoe spaar je ervoor?",
    description:
      "Bereken hoeveel je per maand moet sparen voor een studie. Gratis calculator + persoonlijk spaarplan.",
    url: "https://financios.nl/studie-sparen",
  },
};

const examples = [
  { budget: 2000, months12: 167, months24: 84 },
  { budget: 4000, months12: 334, months24: 167 },
  { budget: 6000, months12: 500, months24: 250 },
  { budget: 8000, months12: 667, months24: 334 },
  { budget: 10000, months12: 834, months24: 417 },
  { budget: 15000, months12: 1250, months24: 625 },
];

const faqs = [
  {
    q: "Hoeveel kost een studie in Nederland?",
    a: "Het wettelijk collegegeld voor een HBO of WO bachelor is in 2025 circa €2.530 per jaar. Daarboven komen studieboeken (€500–€1.000 per jaar), en als je uitwonend bent: huur (€400–€900/mnd), boodschappen en vervoer. Totaal kan een studiejaar uitwonend €15.000–€20.000 kosten.",
  },
  {
    q: "Kan ik studeren zonder studieschuld?",
    a: "Dat is moeilijk als je uitwonend bent en geen bijbaan hebt. Maar je kunt de schuld beperken: spaar vooraf een buffer op, werk naast je studie, kies voor een studentenkamer in een goedkopere stad, en gebruik je reisrecht slim. Elke euro die je vooraf spaart, is een euro minder lenen.",
  },
  {
    q: "Hoe spaar ik als student terwijl ik zelf ook kosten heb?",
    a: "Zelfs kleine bedragen helpen. €50 per maand is €600 per jaar extra buffer. Gebruik onze scan om te zien hoeveel je kunt missen — ook als student met een bijbaan en studielening.",
  },
  {
    q: "Wat is een studiebuffer en waarom heb ik die nodig?",
    a: "Een studiebuffer is een bedrag achter de hand voor onverwachte kosten: kapotte laptop, hoge energierekening of een maand zonder bijbaaninkomen. Financieel adviseurs raden een buffer van 3 maanden levenskosten aan. Als student is €1.500–€3.000 een goede basis.",
  },
];

export default function StudieSparen() {
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
            href="/scan?doelNaam=Studie+buffer&doel=5000&maanden=12"
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
            Studie sparen: hoeveel kost studeren en hoe bouw je een buffer op?
          </h1>
          <p className="text-lg text-muted leading-[1.7]">
            Studeren is duur — zeker als je uitwonend bent. Met een goede
            voorbereiding start je zonder financiële stress aan je studie
            en bouw je een buffer op voor de onverwachte kosten.
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 mb-8 shadow-[var(--shadow-card)]">
          <h2 className="font-semibold text-foreground mb-1 tracking-tight">Snel berekend</h2>
          <p className="text-xs font-medium uppercase tracking-wider text-muted mb-5">
            Hoeveel per maand voor jouw studiebuffer?
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-medium uppercase tracking-wider text-muted pb-3">Spaardoel</th>
                  <th className="text-right text-xs font-medium uppercase tracking-wider text-muted pb-3">In 12 mnd</th>
                  <th className="text-right text-xs font-medium uppercase tracking-wider text-muted pb-3">In 24 mnd</th>
                </tr>
              </thead>
              <tbody>
                {examples.map((ex, i) => (
                  <tr key={ex.budget} className={`border-b border-border/50 ${i === 2 ? "bg-accent/5" : ""}`}>
                    <td className="py-3 text-foreground font-medium">
                      €{ex.budget.toLocaleString("nl-NL")}
                      {i === 2 && (
                        <span className="ml-2 text-[10px] font-semibold uppercase tracking-wider text-accent bg-accent/10 px-1.5 py-0.5 rounded-full">
                          Aanbevolen
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
            Wat kost studeren per jaar?
          </h2>
          <div className="bg-card border border-border rounded-xl p-5 mb-4 shadow-[var(--shadow-card)]">
            <div className="flex flex-col gap-2 text-sm">
              {[
                ["Collegegeld (2025)", "€2.530 / jaar"],
                ["Studieboeken", "€500 – €1.000 / jaar"],
                ["Huur (uitwonend)", "€400 – €900 / mnd"],
                ["Boodschappen", "€150 – €300 / mnd"],
                ["Vervoer", "€50 – €150 / mnd"],
                ["Overig (kleding, uitgaan)", "€100 – €300 / mnd"],
              ].map(([item, cost]) => (
                <div key={item} className="flex justify-between">
                  <span className="text-foreground">{item}</span>
                  <span className="text-muted">{cost}</span>
                </div>
              ))}
              <div className="flex justify-between border-t border-border pt-2 mt-1">
                <span className="font-semibold text-foreground">Totaal uitwonend</span>
                <span className="font-bold text-warning">±€15.000 – €20.000 / jaar</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-4">
            4 tips voor studenten die slim willen sparen
          </h2>
          <div className="flex flex-col gap-4">
            {[
              {
                n: "1",
                title: "Bouw eerst een noodbuffer op",
                body: "Zorg dat je minstens €1.500–€2.000 achter de hand hebt voordat je gaat studeren. Dat dekt een kapotte laptop, een maand zonder bijbaan of een onverwachte rekening — zonder dat je meteen moet lenen.",
              },
              {
                n: "2",
                title: "Leen alleen wat je écht nodig hebt",
                body: "Studenten lenen gemiddeld meer dan ze nodig hebben. Leen het minimale en vul aan met bijbaan-inkomen. Elke euro minder lenen = minder terugbetalen na je studie.",
              },
              {
                n: "3",
                title: "Gebruik je OV-studentenkaart optimaal",
                body: "Je OV-studentenkaart is gratis vervoer in de week óf het weekend. Kies de variant die het beste past bij jouw reispatroon. Zo bespaar je honderden euro's per jaar op vervoer.",
              },
              {
                n: "4",
                title: "Weet precies wat je uitgeeft",
                body: "Veel studenten weten niet waar hun geld naartoe gaat. Onze scan laat je in 60 seconden zien wat je grootste kostenpost is en hoeveel je realistisch kunt sparen.",
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
            Hoeveel kun jij sparen voor je studie?
          </h2>
          <p className="text-sm text-muted mb-5 leading-relaxed">
            Vul je inkomsten en uitgaven in. In 60 seconden weet je wat er
            maandelijks overblijft en of je spaardoel haalbaar is.
          </p>
          <Link
            href="/scan?doelNaam=Studie+buffer&doel=5000&maanden=12"
            className="inline-block bg-accent hover:bg-accent-hover text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg shadow-accent/20 active:scale-[0.98] tracking-wide"
          >
            Bereken mijn spaarplan gratis →
          </Link>
          <p className="text-xs text-muted mt-3">Geen registratie · Geen creditcard · 100% gratis</p>
        </div>

        {/* Mid-page CTA */}
        <div className="bg-accent/10 border border-accent/30 rounded-2xl p-5 mb-8 shadow-[var(--shadow-card)]">
          <p className="font-semibold text-foreground mb-1">Kun jij een studiebuffer opbouwen?</p>
          <p className="text-sm text-muted mb-4">Vul je inkomen en uitgaven in — in 60 seconden zie je hoeveel je kunt sparen en of jouw studiebudget haalbaar is.</p>
          <Link href="/scan?doelNaam=Studie+buffer&doel=5000&maanden=12" className="inline-block bg-accent hover:bg-accent-hover text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all shadow-lg shadow-accent/20 active:scale-[0.98] tracking-wide">
            Bereken mijn studieplan →
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
