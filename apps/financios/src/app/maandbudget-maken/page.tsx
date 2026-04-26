import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Maandbudget maken: zo doe je het in 5 stappen (2026)",
  description:
    "Leer hoe je een maandbudget maakt dat je ook bijhoudt. Concrete stappen, voorbeeldbudget op basis van modaal inkomen en gratis calculator.",
  openGraph: {
    title: "Maandbudget maken: zo doe je het in 5 stappen",
    description:
      "Concrete stappen voor een maandbudget dat werkt. Met voorbeeldbudget op basis van modaal inkomen.",
    url: "https://financios.nl/maandbudget-maken",
  },
};

const voorbeeldbudget = [
  { categorie: "Huur / hypotheek", percentage: "30–35%", voorbeeld: "€840–€980" },
  { categorie: "Boodschappen", percentage: "10–15%", voorbeeld: "€280–€420" },
  { categorie: "Transport", percentage: "5–10%", voorbeeld: "€140–€280" },
  { categorie: "Vaste lasten (energie, internet)", percentage: "8–12%", voorbeeld: "€224–€336" },
  { categorie: "Verzekeringen", percentage: "5–8%", voorbeeld: "€140–€224" },
  { categorie: "Kleding & persoonlijke verzorging", percentage: "3–5%", voorbeeld: "€84–€140" },
  { categorie: "Vrije tijd & horeca", percentage: "5–10%", voorbeeld: "€140–€280" },
  { categorie: "Sparen", percentage: "10–20%", voorbeeld: "€280–€560" },
];

const stappen = [
  {
    nr: "1",
    title: "Schrijf je netto inkomen op",
    body: "Begin met wat er écht binnenkomt: netto salaris, toeslagen, bijverdiensten. Gebruik je gemiddelde van de afgelopen 3 maanden als je variabel inkomen hebt. Bruto telt niet — je betaalt rekeningen met netto.",
  },
  {
    nr: "2",
    title: "Lijst al je vaste lasten op",
    body: "Huur/hypotheek, energie, internet, verzekeringen, telefoon, abonnementen. Dit zijn de bedragen die elke maand automatisch afgeschreven worden. Tel ze bij elkaar op — dit is het bedrag dat je niet kunt vermijden.",
  },
  {
    nr: "3",
    title: "Schat je variabele uitgaven in",
    body: "Boodschappen, horeca, kleding, benzine, uitjes. Bekijk je bankafschriften van de afgelopen 2–3 maanden. Mensen onderschatten dit bedrag structureel met 20–40%. Wees eerlijk.",
  },
  {
    nr: "4",
    title: "Bereken je spaarruimte",
    body: "Netto inkomen − vaste lasten − variabele kosten = spaarruimte. Als dit negatief is, geef je meer uit dan je verdient. Als het positief is maar je spaart niets, weet je nu waar het naartoe gaat.",
  },
  {
    nr: "5",
    title: "Stel een spaardoel in en automatiseer",
    body: "Maak een automatische overboeking in op de dag dat je salaris binnenkomt. Niet wat overblijft sparen — maar eerst sparen, dan de rest uitgeven. Begin klein: €50 of €100 per maand is beter dan niets.",
  },
];

const faqs = [
  {
    q: "Hoeveel procent van je inkomen moet je sparen?",
    a: "De 50/30/20-vuistregel zegt: 50% vaste lasten, 30% vrije keuzes, 20% sparen. Dat is een richtlijn, geen wet. Met een laag inkomen is 20% sparen niet realistisch. Begin met 5–10% en bouw op. Een concreet getal is beter dan een ideaal dat je nooit haalt.",
  },
  {
    q: "Wat is het verschil tussen een budget en een spaarplan?",
    a: "Een budget laat zien waar je geld naartoe gaat. Een spaarplan zegt concreet: dit bedrag zet ik opzij voor dit doel, klaar op deze datum. Je hebt allebei nodig: het budget geeft inzicht, het spaarplan geeft richting.",
  },
  {
    q: "Hoe houd ik een budget bij zonder spreadsheet?",
    a: "De makkelijkste methode: gebruik drie rekeningen. Eén voor vaste lasten (alleen automatische afschrijvingen), één voor vrij te besteden geld, één spaarrekening. Je weet altijd waar je staat zonder iets bij te houden.",
  },
  {
    q: "Wat doe je als je inkomen te laag is om te sparen?",
    a: "Controleer eerst of je alle toeslagen ontvangt (huurtoeslag, zorgtoeslag, kinderbijslag). Veel mensen laten honderden euro's per maand liggen. Ga naar toeslagen.belastingdienst.nl. Daarna kijk je naar vaste lasten verlagen — dat heeft meer effect dan bezuinigen op dagelijkse dingen.",
  },
];

export default function MaandbudgetMaken() {
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
          <Link href="/scan" className="text-sm text-muted hover:text-foreground transition-colors">
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
            Budgetteren
          </p>
          <h1 className="text-4xl font-bold text-foreground tracking-tight leading-tight mb-4">
            Maandbudget maken: zo doe je het in 5 stappen
          </h1>
          <p className="text-lg text-muted leading-[1.7]">
            Een budget hoeft geen ingewikkelde spreadsheet te zijn. Je hebt maar
            drie cijfers nodig: wat er binnenkomt, wat er vast uitmoet, en wat
            er overblijft. Dit artikel legt uit hoe je dat in 5 stappen
            concreet maakt.
          </p>
        </div>

        {/* Steps */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-6">
            De 5 stappen
          </h2>
          <div className="flex flex-col gap-4">
            {stappen.map((stap) => (
              <div key={stap.nr} className="bg-card border border-border rounded-2xl p-5 shadow-[var(--shadow-card)]">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-accent font-bold text-sm">{stap.nr}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{stap.title}</h3>
                    <p className="text-sm text-muted leading-relaxed">{stap.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mid-page CTA */}
        <div className="bg-card border border-border rounded-2xl p-5 mb-10 shadow-[var(--shadow-card)] flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <p className="font-semibold text-foreground text-sm mb-1">Sla stap 3 over — wij berekenen het</p>
            <p className="text-xs text-muted">Vul je inkomsten en uitgaven in. In 60 seconden zie je je spaarruimte.</p>
          </div>
          <Link href="/scan" className="inline-block bg-accent hover:bg-accent-hover text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-accent/20 active:scale-[0.98] whitespace-nowrap">
            Start gratis scan →
          </Link>
        </div>

        {/* Example budget */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-10 shadow-[var(--shadow-card)]">
          <h2 className="font-semibold text-foreground mb-1 tracking-tight">
            Voorbeeldbudget: modaal inkomen (€2.800 netto)
          </h2>
          <p className="text-xs text-muted mb-4">Dit zijn richtlijnen, geen regels. Jouw situatie bepaalt jouw verdeling.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-muted font-medium pb-3 pr-4">Categorie</th>
                  <th className="text-left text-muted font-medium pb-3 pr-4">% van inkomen</th>
                  <th className="text-left text-muted font-medium pb-3">Bedrag</th>
                </tr>
              </thead>
              <tbody>
                {voorbeeldbudget.map((row, i) => (
                  <tr key={i} className={`border-b border-border/50 last:border-0 ${row.categorie === "Sparen" ? "font-medium" : ""}`}>
                    <td className={`py-3 pr-4 ${row.categorie === "Sparen" ? "text-success" : "text-foreground"}`}>{row.categorie}</td>
                    <td className="py-3 pr-4 text-muted">{row.percentage}</td>
                    <td className={`py-3 ${row.categorie === "Sparen" ? "text-success font-semibold" : "text-muted"}`}>{row.voorbeeld}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Biggest mistake */}
        <div className="bg-danger/5 border border-danger/20 rounded-2xl p-6 mb-10 shadow-[var(--shadow-card)]">
          <h2 className="font-semibold text-foreground mb-3 tracking-tight">
            De meest gemaakte fout bij budgetteren
          </h2>
          <p className="text-sm text-muted leading-relaxed mb-3">
            Mensen schatten hun variabele uitgaven te laag in. Ze denken
            &ldquo;ik geef €300 uit aan boodschappen&rdquo; terwijl het €480 is.
            Ze denken &ldquo;ik ga een keer per maand uit eten&rdquo; terwijl het zes keer is.
          </p>
          <p className="text-sm text-muted leading-relaxed">
            Het gevolg: het budget klopt op papier, maar aan het einde van de
            maand is er alsnog niets over. De oplossing is niet strenger
            budgetteren — het is eerlijker meten.
          </p>
        </div>

        {/* CTA */}
        <div className="bg-accent/10 border border-accent/30 rounded-2xl p-6 mb-10 shadow-[var(--shadow-card)] text-center">
          <h2 className="font-semibold text-foreground mb-2 tracking-tight">
            Maak in 60 seconden jouw persoonlijk budget
          </h2>
          <p className="text-sm text-muted mb-5 leading-relaxed">
            Geen spreadsheet. Vul in wat je verdient en uitgeeft — wij laten
            zien hoeveel je kunt sparen en waar het misgaat.
          </p>
          <Link
            href="/scan"
            className="inline-block bg-accent hover:bg-accent-hover text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg shadow-accent/20 active:scale-[0.98] tracking-wide"
          >
            Bereken mijn budget gratis →
          </Link>
          <p className="text-xs text-muted mt-3">
            Gratis scan · Plan voor €4,99 eenmalig · Geen account
          </p>
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

        {/* Footer links */}
        <div className="border-t border-border pt-8 flex items-center justify-between flex-wrap gap-4 text-sm text-muted">
          <Link href="/" className="hover:text-foreground transition-colors">
            ← Financios home
          </Link>
          <div className="flex gap-4">
            <Link href="/disclaimer" className="hover:text-foreground transition-colors">Disclaimer</Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
