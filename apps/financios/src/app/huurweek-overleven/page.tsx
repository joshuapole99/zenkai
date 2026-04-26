import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Huurweek overleven – waarom is je saldo ineens leeg?",
  description:
    "Elke maand hetzelfde: huur, verzekeringen en abonnementen gaan af en je saldo klapt in. Ontdek waarom en wat je eraan kunt doen.",
  openGraph: {
    title: "Huurweek overleven – waarom is je saldo ineens leeg?",
    description:
      "Huur, verzekeringen en abonnementen gaan tegelijk af. Ontdek waarom je saldo klapt en wat je eraan kunt doen.",
    url: "https://financios.nl/huurweek-overleven",
  },
};

const SCAN_HREF = "/scan?doelNaam=Buffer&doel=1000&maanden=6";

const voorbeeldLasten = [
  { post: "Huur / hypotheek", bedrag: 950, wanneer: "1e" },
  { post: "Zorgverzekering", bedrag: 145, wanneer: "1e" },
  { post: "Energierekening", bedrag: 120, wanneer: "1e" },
  { post: "Abonnementen (Netflix, Spotify…)", bedrag: 45, wanneer: "1e" },
  { post: "Autoverzekering", bedrag: 75, wanneer: "1e–5e" },
  { post: "Telefoonabonnement", bedrag: 35, wanneer: "1e–5e" },
];

const faqs = [
  {
    q: "Waarom voelt de huurweek altijd zo zwaar?",
    a: "Omdat bijna alle vaste lasten op hetzelfde moment afschrijven — rondom de 1e van de maand. Je salaris komt binnen, en voor je het weet is €1.000–€1.500 verdwenen aan vaste kosten. Wat overblijft moet de hele maand mee. Dat voelt krap, ook als het wiskundig klopt.",
  },
  {
    q: "Hoe weet ik of ik te veel vaste lasten heb?",
    a: "Een vuistregel: vaste lasten (huur, verzekeringen, abonnementen) horen niet meer dan 50–60% van je netto inkomen te zijn. Zit je daarboven, dan is er weinig ruimte voor boodschappen, vervoer en sparen. Gebruik onze scan om exact te zien hoe jouw verhouding eruitziet.",
  },
  {
    q: "Wat is een noodpot en heb ik die nodig?",
    a: "Een noodpot is een kleine buffer — minimaal €500–€1.000 — die je aanhoudt voor onverwachte kosten of om de huurweek rustiger door te komen. Zonder buffer ga je bij elke tegenvaller rood staan of een rekening uitstellen. Met een buffer heb je financiële lucht.",
  },
  {
    q: "Kan ik mijn afschrijvingen spreiden over de maand?",
    a: "Soms wel. Energiebedrijven en verzekeraars laten je vaak kiezen op welke datum ze afschrijven. Bel je verzekeraar of ga naar Mijn Omgeving en vraag of je de incassodatum kunt wijzigen naar het midden van de maand. Zo verdeel je de klap.",
  },
];

export default function HuurweekOverleven() {
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
            Financiële gids
          </p>
          <h1 className="text-4xl font-bold text-foreground tracking-tight leading-tight mb-4">
            Huurweek overleven: waarom is je saldo ineens leeg?
          </h1>
          <p className="text-lg text-muted leading-[1.7]">
            Het is de 1e. Je salaris staat op je rekening. En voor je het weet
            is er €1.200 verdwenen — huur, verzekeringen, abonnementen, alles
            tegelijk. Je bent niet slecht met geld. Je vaste lasten komen
            gewoon op hetzelfde moment binnen.
          </p>
        </div>

        {/* Voorbeeld overzicht */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-8 shadow-[var(--shadow-card)]">
          <h2 className="font-semibold text-foreground mb-1 tracking-tight">
            Wat er elke maand rond de 1e afgaat
          </h2>
          <p className="text-xs font-medium uppercase tracking-wider text-muted mb-5">
            Voorbeeld voor iemand met modaal inkomen
          </p>

          <div className="flex flex-col gap-0">
            {voorbeeldLasten.map((item, i) => (
              <div
                key={item.post}
                className={`flex items-center justify-between py-3 ${
                  i < voorbeeldLasten.length - 1 ? "border-b border-border/50" : ""
                }`}
              >
                <div>
                  <span className="text-sm text-foreground">{item.post}</span>
                  <span className="ml-2 text-xs text-muted">({item.wanneer})</span>
                </div>
                <span className="text-sm font-semibold text-danger">
                  − €{item.bedrag}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between pt-4 mt-1 border-t border-border">
              <span className="text-sm font-semibold text-foreground">Totaal weg in week 1</span>
              <span className="text-base font-bold text-danger">
                − €{voorbeeldLasten.reduce((s, r) => s + r.bedrag, 0).toLocaleString("nl-NL")}
              </span>
            </div>
          </div>
          <p className="text-xs text-muted mt-4">
            * Bedragen zijn voorbeelden. Jouw situatie kan afwijken.
          </p>
        </div>

        {/* Uitleg */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-4">
            Waarom het elke maand hetzelfde voelt
          </h2>
          <p className="text-muted leading-[1.75] mb-4">
            Het probleem is niet dat je te weinig verdient. Het probleem is
            timing en inzicht. Veel mensen weten niet precies hoeveel er
            maandelijks aan vaste lasten afgaat — en worden elke 1e opnieuw
            verrast.
          </p>
          <div className="bg-card border border-border rounded-xl p-5 mb-4 shadow-[var(--shadow-card)]">
            <p className="text-foreground font-mono text-sm text-center">
              salaris − vaste lasten = wat je écht hebt om van te leven
            </p>
          </div>
          <p className="text-muted leading-[1.75]">
            Als dat getal negatief of erg klein is, zit er structureel iets
            mis. Dan helpt bezuinigen op koffie niet — dan moet je kijken naar
            je vaste lasten of naar je inkomen.
          </p>
        </div>

        {/* Tips */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-4">
            3 manieren om de huurweek makkelijker te maken
          </h2>
          <div className="flex flex-col gap-4">
            {[
              {
                n: "1",
                title: "Bouw een kleine buffer van €500–€1.000",
                body: "Met een buffer op je rekening voelt de 1e minder zwaar. Je weet dat er na de afschrijvingen nog iets overblijft. Begin klein: zet elke maand automatisch €50 apart op een aparte rekening.",
              },
              {
                n: "2",
                title: "Spreid je afschrijvingen",
                body: "Niet alle vaste lasten hoeven op de 1e af te gaan. Bel je energiebedrijf of verzekeraar en vraag of je de incassodatum kunt verplaatsen naar de 15e. Dan verdeel je de klap over de maand.",
              },
              {
                n: "3",
                title: "Weet exact wat je kunt missen",
                body: "De huurweek voelt minder hard als je van tevoren weet wat er afschrijft en hoeveel er daarna nog overblijft. Gebruik onze scan om in 60 seconden te zien wat je echte spaarruimte is.",
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
            Hoeveel hou jij over na de huurweek?
          </p>
          <p className="text-sm text-muted mb-4">
            Vul je inkomen en vaste lasten in — in 60 seconden zie je wat er
            écht overblijft en of je ruimte hebt voor een buffer.
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
            Zie precies waar jouw geld naartoe gaat
          </h2>
          <p className="text-sm text-muted mb-5 leading-relaxed">
            Vul je inkomsten en uitgaven in. In 60 seconden weet je wat je
            overhoudt na alle vaste lasten — en of er ruimte is om een buffer
            op te bouwen.
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
