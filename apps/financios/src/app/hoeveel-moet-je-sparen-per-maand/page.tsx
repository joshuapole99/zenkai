import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hoeveel moet je sparen per maand? Realistisch berekend",
  description:
    "Hoeveel moet je per maand sparen? Dat hangt af van je inkomen, doel en tijdlijn. Bereken het zelf met concrete voorbeelden en de 50/30/20-vuistregel.",
  openGraph: {
    title: "Hoeveel moet je sparen per maand?",
    description:
      "Concrete vuistregels, rekenvoorbeelden en een gratis calculator om te zien wat jij kunt sparen.",
    url: "https://financios.nl/hoeveel-moet-je-sparen-per-maand",
  },
};

const spaartabel = [
  { inkomen: "€1.800", tien: "€180", twintig: "€360", dertig: "€540" },
  { inkomen: "€2.200", tien: "€220", twintig: "€440", dertig: "€660" },
  { inkomen: "€2.600", tien: "€260", twintig: "€520", dertig: "€780" },
  { inkomen: "€3.000", tien: "€300", twintig: "€600", dertig: "€900" },
  { inkomen: "€3.500", tien: "€350", twintig: "€700", dertig: "€1.050" },
];

const doeltabel = [
  { doel: "Noodfonds (€3.000)", maanden6: "€500", maanden12: "€250", maanden18: "€167" },
  { doel: "Vakantie (€1.500)", maanden6: "€250", maanden12: "€125", maanden18: "€83" },
  { doel: "Auto (€8.000)", maanden12: "€667", maanden24: "€333", maanden36: "€222" },
  { doel: "Huis (€20.000)", maanden24: "€833", maanden36: "€556", maanden48: "€417" },
];

const faqs = [
  {
    q: "Is 10% sparen genoeg?",
    a: "10% is een goede start als je nog geen noodfonds hebt. Voor concrete doelen (huis, auto, pensioen) is 20% realistischer. Hoeveel genoeg is hangt volledig af van je doel en tijdlijn — er is geen universeel antwoord.",
  },
  {
    q: "Wat als ik helemaal niets kan missen?",
    a: "Begin met €25 of €50 per maand. Het gaat niet om het bedrag — het gaat om het gewoontepatroon. De meeste mensen die 'niets kunnen missen' geven onbewust €100–€200 per maand uit aan dingen die ze niet bijhouden. Een scan laat precies zien waar dat geld blijft.",
  },
  {
    q: "Moet ik eerst schulden aflossen of sparen?",
    a: "Aflossen gaat voor als je rentedragende schulden hebt (creditcard, rood staan, lening). Bouw tegelijkertijd een kleine noodbuffer op van €500–€1.000 zodat je niet opnieuw schulden maakt bij een onverwachte uitgave.",
  },
  {
    q: "Hoe weet ik hoeveel ik kan sparen?",
    a: "Netto inkomen minus vaste lasten minus variabele kosten = spaarruimte. Klinkt simpel, maar de variabele kosten zijn het probleem — die zijn voor de meeste mensen een blinde vlek. Dat is precies wat de Financios scan inzichtelijk maakt.",
  },
];

export default function HoeveeelMoetJeSparenPerMaand() {
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
            Sparen
          </p>
          <h1 className="text-4xl font-bold text-foreground tracking-tight leading-tight mb-4">
            Hoeveel moet je sparen per maand?
          </h1>
          <p className="text-lg text-muted leading-[1.7]">
            Er is geen magisch getal. Hoeveel je moet sparen hangt af van wat
            je wilt bereiken en wanneer. Maar er zijn goede vuistregels — en
            voor jouw situatie is er een exacte berekening.
          </p>
        </div>

        {/* 50/30/20 uitleg */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-4">
            De 50/30/20-vuistregel
          </h2>
          <p className="text-muted leading-[1.75] mb-5">
            De bekendste spaarvuistregel verdeelt je netto inkomen in drie
            categorieën:
          </p>
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { pct: "50%", label: "Vaste lasten", color: "text-foreground", bg: "bg-card" },
              { pct: "30%", label: "Vrij besteedbaar", color: "text-muted", bg: "bg-card" },
              { pct: "20%", label: "Sparen", color: "text-success", bg: "bg-success/5 border-success/20" },
            ].map((item) => (
              <div
                key={item.pct}
                className={`${item.bg} border border-border rounded-xl p-4 text-center shadow-[var(--shadow-card)]`}
              >
                <p className={`text-2xl font-bold mb-1 ${item.color}`}>{item.pct}</p>
                <p className="text-xs text-muted">{item.label}</p>
              </div>
            ))}
          </div>
          <p className="text-muted leading-[1.75]">
            20% sparen op een inkomen van €2.500 netto = €500 per maand. Lukt
            dat niet direct? Begin met 10% en bouw het op. Het gaat erom dat
            je structureel spaart — niet om het percentage.
          </p>
        </div>

        {/* Spaartabel per inkomen */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-4">
            Hoeveel is dat in euro's?
          </h2>
          <p className="text-muted leading-[1.75] mb-4">
            Wat 10%, 20% of 30% betekent per inkomensniveau:
          </p>
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-[var(--shadow-card)]">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted">
                      Netto inkomen
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted">
                      10%
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-medium uppercase tracking-wider text-success">
                      20%
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted">
                      30%
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {spaartabel.map((row, i) => (
                    <tr
                      key={row.inkomen}
                      className={i < spaartabel.length - 1 ? "border-b border-border" : ""}
                    >
                      <td className="px-4 py-3 font-medium text-foreground">{row.inkomen}</td>
                      <td className="px-4 py-3 text-right text-muted">{row.tien}</td>
                      <td className="px-4 py-3 text-right text-success font-semibold">{row.twintig}</td>
                      <td className="px-4 py-3 text-right text-muted">{row.dertig}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Hoeveel per doel */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-4">
            Hoeveel per spaardoel?
          </h2>
          <p className="text-muted leading-[1.75] mb-4">
            Wil je sparen voor een specifiek doel? Dan rekent je terug vanuit
            het bedrag en de tijdlijn:
          </p>
          <div className="flex flex-col gap-3">
            {[
              { doel: "Noodfonds (€3.000)", rows: [{ label: "6 maanden", val: "€500/mnd" }, { label: "12 maanden", val: "€250/mnd" }, { label: "18 maanden", val: "€167/mnd" }] },
              { doel: "Vakantie (€1.500)", rows: [{ label: "6 maanden", val: "€250/mnd" }, { label: "12 maanden", val: "€125/mnd" }] },
              { doel: "Auto (€8.000)", rows: [{ label: "12 maanden", val: "€667/mnd" }, { label: "24 maanden", val: "€333/mnd" }, { label: "36 maanden", val: "€222/mnd" }] },
              { doel: "Huis (€20.000)", rows: [{ label: "24 maanden", val: "€833/mnd" }, { label: "36 maanden", val: "€556/mnd" }, { label: "48 maanden", val: "€417/mnd" }] },
            ].map((item) => (
              <div key={item.doel} className="bg-card border border-border rounded-2xl p-5 shadow-[var(--shadow-card)]">
                <p className="text-sm font-semibold text-foreground mb-3">{item.doel}</p>
                <div className="flex flex-wrap gap-3">
                  {item.rows.map((r) => (
                    <div key={r.label} className="bg-background rounded-xl px-3 py-2 text-center min-w-[90px]">
                      <p className="text-xs text-muted mb-0.5">{r.label}</p>
                      <p className="text-sm font-bold text-foreground">{r.val}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3 tips */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-4">
            3 tips om meer te sparen
          </h2>
          <div className="flex flex-col gap-4">
            {[
              {
                n: "1",
                title: "Automatiseer op de 1e van de maand",
                body: "Zet een automatische overboeking in direct na je salaris. Wat je niet ziet, geef je niet uit. Dit is de meest effectieve spaartechniek — niet discipline, maar structuur.",
              },
              {
                n: "2",
                title: "Begin met je grootste kostenpost",
                body: "De meeste mensen besparen op kleine dingen (koffie, abonnementen) terwijl de grootste lekken ergens anders zitten. Weet waar jouw geld naartoe gaat voordat je gaat bezuinigen.",
              },
              {
                n: "3",
                title: "Stel een concreet doel met een datum",
                body: "\"Meer sparen\" werkt niet. \"€5.000 voor een auto in 18 maanden\" wel. Een concreet doel maakt de maandelijkse doelstelling rekenkundig duidelijk — en makkelijker vol te houden.",
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
            Hoeveel kun jij eigenlijk sparen?
          </p>
          <p className="text-sm text-muted mb-4">
            Vuistregels zijn een start. Maar hoeveel jij kunt sparen hangt af
            van jouw inkomen en uitgaven — niet van een gemiddelde. Doe de
            scan en zie het direct.
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
            Weet precies wat jij kunt sparen
          </h2>
          <p className="text-sm text-muted mb-5 leading-relaxed">
            Geen vuistregel maar een berekening op basis van jóuw inkomen en
            uitgaven. In 60 seconden.
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
