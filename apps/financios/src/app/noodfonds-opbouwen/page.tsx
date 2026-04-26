import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Noodfonds opbouwen – hoeveel moet je sparen?",
  description:
    "Leer hoeveel je nodig hebt voor een noodfonds en bereken hoe snel jij het kunt opbouwen op basis van jouw inkomen en uitgaven.",
  openGraph: {
    title: "Noodfonds opbouwen – hoeveel moet je sparen?",
    description:
      "Hoeveel heb je nodig voor een noodfonds? Bereken het in 60 seconden op basis van jouw eigen situatie.",
    url: "https://financios.nl/noodfonds-opbouwen",
  },
};

const SCAN_HREF = "/scan?doelNaam=Noodfonds&doel=5000&maanden=18";

// Maandelijks bedrag = doel / maanden
const tableRows = [
  { doel: 1000, m6: 167, m12: 84, m18: 56, m24: 42 },
  { doel: 2000, m6: 334, m12: 167, m18: 112, m24: 84 },
  { doel: 3000, m6: 500, m12: 250, m18: 167, m24: 125 },
  { doel: 5000, m6: 834, m12: 417, m18: 278, m24: 209 },
  { doel: 7500, m6: 1250, m12: 625, m18: 417, m24: 313 },
  { doel: 10000, m6: 1667, m12: 834, m18: 556, m24: 417 },
];

const faqs = [
  {
    q: "Hoeveel moet ik hebben in mijn noodfonds?",
    a: "De vuistregel is 3 tot 6 maanden aan vaste lasten. Zijn je maandelijkse lasten €1.500? Dan is €4.500–€9.000 een solide noodfonds. Begin met een minimaal noodfonds van €1.000 — dat dekt de meeste onverwachte kosten al.",
  },
  {
    q: "Hoe snel kan ik een noodfonds opbouwen?",
    a: "Dat hangt af van hoeveel je maandelijks kunt sparen. Met €100/maand heb je in 10 maanden €1.000. Met €250/maand heb je in 20 maanden €5.000. Gebruik onze scan om te berekenen wat haalbaar is met jouw inkomen en uitgaven.",
  },
  {
    q: "Waar bewaar ik mijn noodfonds?",
    a: "Op een aparte spaarrekening — niet je dagelijkse betaalrekening. Kies een rekening zonder opnamebeperkingen, zodat je er direct bij kunt in geval van nood. Rendement is minder belangrijk dan bereikbaarheid.",
  },
  {
    q: "Moet ik eerst schulden aflossen of eerst een noodfonds opbouwen?",
    a: "Bouw eerst een mini-noodfonds van €1.000 op, ook als je schulden hebt. Zonder buffer ga je bij elke tegenvaller terug naar schulden. Daarna focus je op schulden aflossen, en daarna bouw je het volledige noodfonds op.",
  },
];

export default function NoodfondsOpbouwen() {
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
            Spaargids
          </p>
          <h1 className="text-4xl font-bold text-foreground tracking-tight leading-tight mb-4">
            Noodfonds opbouwen: hoeveel moet je sparen?
          </h1>
          <p className="text-lg text-muted leading-[1.7]">
            Een noodfonds is de basis van financiële rust. Autopech, kapotte
            wasmachine, plotseling ontslag — zonder buffer leid één tegenvaller
            direct tot stress of schulden. Maar hoeveel heb je nodig, en hoe
            bouw je het op zonder te veel in te leveren?
          </p>
        </div>

        {/* Berekeningstafel */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-8 shadow-[var(--shadow-card)]">
          <h2 className="font-semibold text-foreground mb-1 tracking-tight">
            Hoeveel per maand?
          </h2>
          <p className="text-xs font-medium uppercase tracking-wider text-muted mb-5">
            Noodfonds-doel × looptijd
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-medium uppercase tracking-wider text-muted pb-3">
                    Noodfonds
                  </th>
                  <th className="text-right text-xs font-medium uppercase tracking-wider text-muted pb-3">
                    6 mnd
                  </th>
                  <th className="text-right text-xs font-medium uppercase tracking-wider text-muted pb-3">
                    12 mnd
                  </th>
                  <th className="text-right text-xs font-medium uppercase tracking-wider text-muted pb-3">
                    18 mnd
                  </th>
                  <th className="text-right text-xs font-medium uppercase tracking-wider text-muted pb-3">
                    24 mnd
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, i) => (
                  <tr
                    key={row.doel}
                    className={`border-b border-border/50 ${i === 3 ? "bg-accent/5" : ""}`}
                  >
                    <td className="py-3 text-foreground font-medium">
                      €{row.doel.toLocaleString("nl-NL")}
                      {i === 3 && (
                        <span className="ml-2 text-[10px] font-semibold uppercase tracking-wider text-accent bg-accent/10 px-1.5 py-0.5 rounded-full">
                          Populair
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-right text-foreground">€{row.m6}/mnd</td>
                    <td className="py-3 text-right text-foreground">€{row.m12}/mnd</td>
                    <td className="py-3 text-right text-success font-medium">€{row.m18}/mnd</td>
                    <td className="py-3 text-right text-muted">€{row.m24}/mnd</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted mt-4">
            * Bedragen zijn afgerond. Heb je al spaargeld? Dan kom je er sneller.
          </p>
        </div>

        {/* Formule */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-4">
            Hoeveel heb jij nodig?
          </h2>
          <p className="text-muted leading-[1.75] mb-4">
            De eenvoudigste formule:
          </p>
          <div className="bg-card border border-border rounded-xl p-5 mb-4 shadow-[var(--shadow-card)]">
            <p className="text-foreground font-mono text-sm text-center">
              maandelijkse vaste lasten × 3 = minimaal noodfonds
            </p>
          </div>
          <p className="text-muted leading-[1.75]">
            Betaal je elke maand €1.800 aan huur, boodschappen, verzekeringen en
            abonnementen? Dan is{" "}
            <span className="text-foreground font-semibold">€5.400</span> een
            solide minimaal noodfonds. Voor meer zekerheid — zeker als zelfstandige
            — ga je voor 6 maanden: €10.800. Het lastige is niet de berekening,
            maar weten hoeveel je maandelijks kunt missen om het ook écht op te
            bouwen.
          </p>
        </div>

        {/* Tips */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-4">
            3 tips om sneller een noodfonds op te bouwen
          </h2>
          <div className="flex flex-col gap-4">
            {[
              {
                n: "1",
                title: "Open een aparte rekening",
                body: "Zet je noodfonds op een rekening die je niet dagelijks gebruikt. Zo geef je het geld niet onbewust uit. Kies een rekening zonder opnamebeperkingen — je moet er altijd snel bij kunnen.",
              },
              {
                n: "2",
                title: "Begin klein: €50 per maand telt",
                body: "Je hoeft niet meteen €300/maand opzij te zetten. Begin met wat haalbaar is — ook €50/maand is €600 na een jaar. Verhoog het bedrag zodra je ruimte ziet in je budget.",
              },
              {
                n: "3",
                title: "Automatiseer op de 1e van de maand",
                body: "Maak een automatische overschrijving op de 1e van de maand, direct na je salaris. Zo verdwijnt het geld voordat je het kunt uitgeven. Dit is de meest effectieve manier om consistent te sparen.",
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
            Kun jij een noodfonds opbouwen?
          </p>
          <p className="text-sm text-muted mb-4">
            Vul je inkomen en uitgaven in — in 60 seconden zie je hoeveel je maandelijks kunt sparen en wanneer je jouw noodfonds hebt.
          </p>
          <Link
            href={SCAN_HREF}
            className="inline-block bg-accent hover:bg-accent-hover text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all shadow-lg shadow-accent/20 active:scale-[0.98] tracking-wide"
          >
            Bereken mijn noodfonds →
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
            Bereken of jouw noodfonds haalbaar is
          </h2>
          <p className="text-sm text-muted mb-5 leading-relaxed">
            Vul je inkomsten en uitgaven in. In 60 seconden weet je hoeveel je
            kunt sparen en wanneer je financieel veilig zit.
          </p>
          <Link
            href={SCAN_HREF}
            className="inline-block bg-accent hover:bg-accent-hover text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg shadow-accent/20 active:scale-[0.98] tracking-wide"
          >
            Bereken mijn noodfonds gratis →
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
