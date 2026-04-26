import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import BeleggenCalculator from "./BeleggenCalculator";

export const metadata: Metadata = {
  title: "Beleggen beginnen Nederland – bereken wat €X/maand oplevert",
  description:
    "Wat levert beleggen op als je elke maand een vast bedrag inlegt? Bereken je eindkapitaal met de compound interest calculator en ontdek het verschil tussen vroeg en laat beginnen.",
  openGraph: {
    title: "Beleggen beginnen – bereken wat €X/maand oplevert",
    description:
      "Interactieve calculator: hoeveel levert maandelijks beleggen op na 10, 20 of 30 jaar?",
    url: "https://financios.nl/beleggen-beginnen",
  },
};

const faqs = [
  {
    q: "Hoeveel geld heb ik nodig om te beginnen met beleggen?",
    a: "Bij de meeste brokers kun je al beginnen met €1. DEGIRO heeft geen minimuminleg, bij veel ETF's koop je al voor €10–€20 een fractie. Er is geen drempel — het gaat om het beginnen, niet om het bedrag.",
  },
  {
    q: "Wat is een ETF en waarom kiezen beginners daarvoor?",
    a: "Een ETF (Exchange Traded Fund) is een mandje met aandelen dat je als één product koopt. Een wereldwijde ETF zoals MSCI World bevat ~1.500 bedrijven uit 23 landen. Voordelen: automatische spreiding, lage kosten (0,1–0,3%/jaar), geen keuzes per bedrijf.",
  },
  {
    q: "Is beleggen niet te riskant?",
    a: "Op korte termijn schommelt de beurs — soms -20% of meer. Op de lange termijn (10+ jaar) is een wereldwijde index historisch altijd gestegen. Wie in 1980 €100/maand inlegde in een wereldindex, heeft nu ruim €1,2 miljoen. Risico verkleint naarmate je looptijd langer is.",
  },
  {
    q: "Moet ik belasting betalen over beleggingswinst?",
    a: "In Nederland betaal je geen belasting over gerealiseerde winst (geen vermogensaanwasbelasting zoals in andere landen). Wel betaal je box 3-belasting over je vermogen boven de vrijstelling (~€57.000 per persoon). De Belastingdienst rekent met een fictief rendement, ongeacht wat je werkelijk maakt.",
  },
];

export default function BeleggenBeginnen() {
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
            href="/scan"
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
            Calculator
          </p>
          <h1 className="text-4xl font-bold text-foreground tracking-tight leading-tight mb-4">
            Beleggen beginnen: wat levert €X per maand op?
          </h1>
          <p className="text-lg text-muted leading-[1.7]">
            Compound interest is het achtste wereldwonder — zo heet het citaat.
            Maar wat betekent het concreet? Bereken zelf wat een vast maandelijks
            bedrag oplevert over 10, 20 of 30 jaar.
          </p>
        </div>

        {/* Calculator */}
        <BeleggenCalculator />

        {/* Uitleg */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-4">
            Waarom het uitmaakt wanneer je begint
          </h2>
          <p className="text-muted leading-[1.75] mb-4">
            Het verschil tussen beginnen op je 25e of je 35e is niet 10 jaar
            inleg — het is exponentieel meer rendement. Rendement maakt rendement.
            Hoe vroeger je begint, hoe meer tijd compound interest heeft om te
            werken.
          </p>
          <div className="bg-card border border-border rounded-xl p-5 mb-4 shadow-[var(--shadow-card)]">
            <div className="flex flex-col gap-2 text-sm font-mono">
              <div className="flex justify-between">
                <span className="text-muted">€100/mnd × 40 jaar × 7%</span>
                <span className="text-success font-semibold">= €262.000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">€100/mnd × 30 jaar × 7%</span>
                <span className="text-foreground">= €121.000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">€100/mnd × 20 jaar × 7%</span>
                <span className="text-muted">= €52.000</span>
              </div>
            </div>
          </div>
          <p className="text-muted leading-[1.75]">
            10 jaar langer beleggen verdubbelt niet je uitkomst — het verviervoudigt hem bijna.
          </p>
        </div>

        {/* Tips */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-4">
            3 tips voor beginners
          </h2>
          <div className="flex flex-col gap-4">
            {[
              {
                n: "1",
                title: "Begin met een wereldwijde indexfonds",
                body: "Kies een ETF die de wereldindex volgt (MSCI World of FTSE All-World). Je spreidt automatisch over 1.000+ bedrijven en betaalt minimale kosten (0,1–0,2%/jaar). Geen enkel aandeel selecteren, geen stress.",
              },
              {
                n: "2",
                title: "Automatiseer je inleg op de 1e van de maand",
                body: "Stel een automatische periodieke aankoop in bij je broker. Dan beleg je consequent — ook als de markt zakt. Op de lange termijn middel je je aankoopprijs uit (dollar cost averaging).",
              },
              {
                n: "3",
                title: "Beleg alleen geld dat je kunt missen",
                body: "Bouw eerst een noodpot op van 3 maanden lasten. Belegde bedragen kunnen tijdelijk in waarde dalen — zorg dat je niet gedwongen bent op een slecht moment te verkopen.",
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
            Hoeveel kun jij maandelijks beleggen?
          </p>
          <p className="text-sm text-muted mb-4">
            De calculator laat zien wat je kunt bereiken. Maar kun je ook
            daadwerkelijk €100 of €200 missen? Doe de scan en zie het direct.
          </p>
          <Link
            href="/scan"
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
            Weet hoeveel je kunt beleggen
          </h2>
          <p className="text-sm text-muted mb-5 leading-relaxed">
            De calculator laat zien wat mogelijk is. De scan laat zien wat voor
            jou haalbaar is — gebaseerd op je eigen inkomen en uitgaven.
          </p>
          <Link
            href="/scan"
            className="inline-block bg-accent hover:bg-accent-hover text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg shadow-accent/20 active:scale-[0.98] tracking-wide"
          >
            Start gratis scan →
          </Link>
          <p className="text-xs text-muted mt-3">
            Geen registratie · Geen creditcard · 100% gratis
          </p>
        </div>

        {/* Footer */}
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
