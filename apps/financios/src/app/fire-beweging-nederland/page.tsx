import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FIRE beweging Nederland – financieel onafhankelijk worden",
  description:
    "Wat is de FIRE beweging en hoe pas je het toe in Nederland? Bereken hoeveel je nodig hebt voor financiële onafhankelijkheid en wat je maandelijks moet sparen.",
  openGraph: {
    title: "FIRE beweging Nederland – financieel onafhankelijk worden",
    description:
      "Bereken jouw FIRE-getal: hoeveel vermogen heb je nodig om te stoppen met werken?",
    url: "https://financios.nl/fire-beweging-nederland",
  },
};

const SCAN_HREF = "/scan?doelNaam=FIRE+buffer&doel=25000&maanden=36";

// FIRE getal = jaarlijkse uitgaven × 25 (4% regel)
// Tafel: jaarlijkse uitgaven → benodigde vermogen → maandelijks sparen bij 7% rendement (vereenvoudigd)
const tableRows = [
  { uitgaven: 24000, vermogen: 600000, label: "€2.000/mnd" },
  { uitgaven: 30000, vermogen: 750000, label: "€2.500/mnd" },
  { uitgaven: 36000, vermogen: 900000, label: "€3.000/mnd" },
  { uitgaven: 48000, vermogen: 1200000, label: "€4.000/mnd" },
];

const faqs = [
  {
    q: "Wat is de FIRE beweging?",
    a: "FIRE staat voor Financial Independence, Retire Early. Het doel: genoeg vermogen opbouwen zodat je kunt leven van de opbrengsten — zonder te hoeven werken. Je bouwt een groot vermogen op, belegt het, en trekt jaarlijks 4% op (de '4%-regel'). Zolang je rendement hoger is dan je onttrekking, groeit je vermogen mee met inflatie.",
  },
  {
    q: "Wat is de 4%-regel?",
    a: "De 4%-regel zegt dat je jaarlijks 4% van je vermogen kunt opnemen zonder dat het op raakt — mits je het vermogen belegt met gemiddeld 7% rendement. Wil je €30.000 per jaar leven? Dan heb je €750.000 nodig (€30.000 ÷ 0,04). Dit is je FIRE-getal.",
  },
  {
    q: "Is FIRE realistisch in Nederland?",
    a: "Het is uitdagender dan in de VS door hogere belastingen (box 3-vermogensrendementsheffing) en hoge woonlasten. Maar het principe werkt: hoe meer je spaart en belegt, hoe eerder je financieel onafhankelijk bent. Veel Nederlanders streven niet naar vroeg stoppen, maar naar keuzevrijheid — werken omdat je wil, niet omdat je moet.",
  },
  {
    q: "Waar kan ik in Nederland beleggen voor FIRE?",
    a: "De meest gebruikte aanpak: goedkope indexfondsen via een broker (DEGIRO, Saxo, ING Beleggen). Populair zijn wereldwijde ETF's zoals Vanguard FTSE All-World of iShares MSCI World. Let op box 3-belasting: je betaalt belasting over fictief rendement boven de vrijstelling (~€57.000 per persoon in 2024).",
  },
];

export default function FireBewegingNederland() {
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
          <Link href={SCAN_HREF} className="text-sm text-muted hover:text-foreground transition-colors">
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
            Financiële gids
          </p>
          <h1 className="text-4xl font-bold text-foreground tracking-tight leading-tight mb-4">
            FIRE beweging Nederland: hoeveel heb jij nodig?
          </h1>
          <p className="text-lg text-muted leading-[1.7]">
            FIRE — Financial Independence, Retire Early. Niet per se stoppen met
            werken op je 35e, maar de vrijheid hebben om te kiezen. Hoeveel
            vermogen heb je daarvoor nodig, en hoe kom je daar?
          </p>
        </div>

        {/* FIRE-getal tabel */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-8 shadow-[var(--shadow-card)]">
          <h2 className="font-semibold text-foreground mb-1 tracking-tight">
            Jouw FIRE-getal
          </h2>
          <p className="text-xs font-medium uppercase tracking-wider text-muted mb-5">
            Benodigde vermogen op basis van maandelijkse uitgaven (4%-regel)
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-medium uppercase tracking-wider text-muted pb-3">
                    Maandelijkse uitgaven
                  </th>
                  <th className="text-right text-xs font-medium uppercase tracking-wider text-muted pb-3">
                    Jaarlijks
                  </th>
                  <th className="text-right text-xs font-medium uppercase tracking-wider text-muted pb-3">
                    FIRE-getal
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, i) => (
                  <tr
                    key={row.uitgaven}
                    className={`border-b border-border/50 ${i === 1 ? "bg-accent/5" : ""}`}
                  >
                    <td className="py-3 text-foreground font-medium">
                      {row.label}
                      {i === 1 && (
                        <span className="ml-2 text-[10px] font-semibold uppercase tracking-wider text-accent bg-accent/10 px-1.5 py-0.5 rounded-full">
                          Modaal
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-right text-muted">
                      €{row.uitgaven.toLocaleString("nl-NL")}
                    </td>
                    <td className="py-3 text-right text-foreground font-semibold">
                      €{row.vermogen.toLocaleString("nl-NL")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted mt-4">
            * Formule: jaarlijkse uitgaven ÷ 0,04 = benodigde vermogen. Gebaseerd op de 4%-regel (Trinity Study).
          </p>
        </div>

        {/* Uitleg */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-4">
            Hoe werkt de 4%-regel?
          </h2>
          <p className="text-muted leading-[1.75] mb-4">
            De 4%-regel is simpel: als je jaarlijks niet meer dan 4% van je
            vermogen opneemt, en de rest belegd blijft met gemiddeld 7%
            rendement, raakt het nooit op. De andere 3% compenseert inflatie.
          </p>
          <div className="bg-card border border-border rounded-xl p-5 mb-4 shadow-[var(--shadow-card)]">
            <p className="text-foreground font-mono text-sm text-center">
              FIRE-getal = jaarlijkse uitgaven ÷ 0,04
            </p>
            <p className="text-muted font-mono text-sm text-center mt-1">
              €2.500/mnd × 12 = €30.000/jaar → €750.000 nodig
            </p>
          </div>
          <p className="text-muted leading-[1.75]">
            Dat klinkt als veel. Maar je bouwt het op door consistent te sparen
            en te beleggen — en compound interest doet het zware werk. Stap één
            is weten hoeveel je nu kunt missen.
          </p>
        </div>

        {/* Tips */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-4">
            3 stappen om te beginnen met FIRE in Nederland
          </h2>
          <div className="flex flex-col gap-4">
            {[
              {
                n: "1",
                title: "Bereken je spaarquote",
                body: "Je spaarquote is het percentage van je inkomen dat je spaart. Hoe hoger, hoe sneller je FIRE bereikt. Spaar je 10%? Dan duurt het ~40 jaar. Spaar je 50%? Dan duurt het ~17 jaar. Begin met weten wat je nu overhoudt.",
              },
              {
                n: "2",
                title: "Beleg in lage kosten indexfondsen",
                body: "Actieve fondsen verslaan de markt zelden op de lange termijn. Goedkope ETF's (DEGIRO, Saxo) op de wereldindex geven historisch 7–8% per jaar. Houd kosten laag — elk procent aan kosten is tientallen duizenden euro's minder op de lange termijn.",
              },
              {
                n: "3",
                title: "Verlaag je uitgaven, niet je leven",
                body: "FIRE gaat niet over leven als een kluizenaar. Het gaat over bewuste keuzes: welke uitgaven geven je écht waarde, en welke zijn gewoon gewoonte? Bezuinig op de laatste categorie, niet op de eerste.",
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
            Wat is jouw huidige spaarquote?
          </p>
          <p className="text-sm text-muted mb-4">
            Vul je inkomen en uitgaven in — in 60 seconden zie je hoeveel je
            overhoudt en wat je spaarquote is.
          </p>
          <Link
            href={SCAN_HREF}
            className="inline-block bg-accent hover:bg-accent-hover text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all shadow-lg shadow-accent/20 active:scale-[0.98] tracking-wide"
          >
            Bereken mijn spaarquote →
          </Link>
          <p className="text-xs text-muted mt-3">Geen registratie · Gratis</p>
        </div>

        {/* FAQ */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-6">
            Veelgestelde vragen over FIRE
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

        {/* Bottom CTA */}
        <div className="bg-accent/10 border border-accent/30 rounded-2xl p-6 mb-10 shadow-[var(--shadow-card)] text-center">
          <h2 className="font-semibold text-foreground mb-2 tracking-tight">
            Stap 1: weet wat je kunt missen
          </h2>
          <p className="text-sm text-muted mb-5 leading-relaxed">
            Elke FIRE-reis begint met inzicht in je uitgaven. Vul je inkomsten
            en kosten in — in 60 seconden weet je je spaarruimte.
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
