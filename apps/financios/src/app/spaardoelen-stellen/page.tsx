import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Spaardoelen stellen: hoe kies je een realistisch doel? (2026)",
  description:
    "Hoe stel je een spaardoel dat je ook haalt? Leer hoe je een SMART spaardoel formuleert, prioriteiten stelt en een concreet maandplan maakt.",
  openGraph: {
    title: "Spaardoelen stellen: hoe kies je een realistisch doel?",
    description:
      "Van vaag 'meer sparen' naar een concreet spaardoel met tijdlijn en maandbedrag.",
    url: "https://financios.nl/spaardoelen-stellen",
  },
};

const voorbeelddoelen = [
  { doel: "Noodfonds", bedrag: "€3.000–€5.000", prioriteit: "Eerste", waarom: "Zonder buffer maak je bij elke tegenslag nieuwe schulden." },
  { doel: "Vakantie", bedrag: "€500–€3.000", prioriteit: "Middelhoog", waarom: "Concreet, korte tijdlijn, motiverend om mee te beginnen." },
  { doel: "Auto", bedrag: "€3.000–€15.000", prioriteit: "Middelhoog", waarom: "Afhankelijk van hoe hard je hem nodig hebt." },
  { doel: "Huis (eigen inbreng)", bedrag: "€20.000–€50.000", prioriteit: "Lang termijn", waarom: "Duurt jaren — begin vroeg, ook met kleine bedragen." },
  { doel: "Pensioen aanvulling", bedrag: "variabel", prioriteit: "Lang termijn", waarom: "Elke €50/mnd op je 25e is €20.000+ extra op je 65e." },
];

const faqs = [
  {
    q: "Hoeveel spaardoelen kun je tegelijk hebben?",
    a: "Maximaal twee à drie actieve doelen tegelijk. Meer dan dat verspreidt je inzet te veel en demotiveert. Kies één hoofddoel (bijv. noodfonds opbouwen) en één bonus-doel (bijv. vakantie). Als het hoofddoel klaar is, pak je het volgende.",
  },
  {
    q: "Wat als ik mijn spaardoel niet haal?",
    a: "Pas het aan, stop niet. Een doel dat je verlengt is beter dan een doel dat je opgeeft. Pas ook je maandbedrag aan als je inkomen of uitgaven veranderen — een levend plan is effectiever dan een perfect plan dat je niet volhoudt.",
  },
  {
    q: "Is een spaardoel hetzelfde als een budget?",
    a: "Nee. Een budget is een overzicht van inkomsten en uitgaven. Een spaardoel is een eindpunt: €X op datum Y. Je hebt allebei nodig. Het budget laat zien hoeveel je kunt sparen; het spaardoel geeft je reden om dat ook te doen.",
  },
  {
    q: "Hoe weet ik hoeveel ik per maand opzij moet zetten?",
    a: "Deel je spaardoel door het aantal maanden. €3.000 in 12 maanden = €250 per maand. De vraag is dan: heb ik €250 per maand over? Dat hangt af van je spaarruimte. Die berekent de Financios scan in 60 seconden.",
  },
];

export default function SpaardoelenStellen() {
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
            Sparen
          </p>
          <h1 className="text-4xl font-bold text-foreground tracking-tight leading-tight mb-4">
            Spaardoelen stellen: hoe kies je een realistisch doel?
          </h1>
          <p className="text-lg text-muted leading-[1.7]">
            &ldquo;Meer sparen&rdquo; is geen doel — het is een wens. Een doel heeft een
            bedrag, een datum en een concreet maandbedrag. Dit artikel laat
            zien hoe je van wens naar werkbaar plan gaat.
          </p>
        </div>

        {/* SMART uitleg */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-8 shadow-[var(--shadow-card)]">
          <h2 className="font-semibold text-foreground mb-4 tracking-tight">
            Wat maakt een spaardoel realistisch?
          </h2>
          <div className="flex flex-col gap-3">
            {[
              { letter: "S", woord: "Specifiek", uitleg: "Niet 'sparen voor later' maar '€3.000 noodfonds opbouwen'." },
              { letter: "M", woord: "Meetbaar", uitleg: "Een concreet bedrag. €3.000, niet 'genoeg voor noodgevallen'." },
              { letter: "A", woord: "Acceptabel", uitleg: "Het maandbedrag moet passen bij je inkomen en uitgaven." },
              { letter: "R", woord: "Realistisch", uitleg: "€5.000 sparen in 3 maanden op een minimumloon is niet realistisch. Pas de tijdlijn aan." },
              { letter: "T", woord: "Tijdgebonden", uitleg: "Geef je doel een deadline: 'klaar op 1 januari 2027'." },
            ].map((item) => (
              <div key={item.letter} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-accent font-bold text-sm">{item.letter}</span>
                </div>
                <div>
                  <span className="font-semibold text-foreground text-sm">{item.woord}: </span>
                  <span className="text-sm text-muted">{item.uitleg}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Voorbeeld: goed vs slecht doel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div className="bg-danger/5 border border-danger/20 rounded-2xl p-5 shadow-[var(--shadow-card)]">
            <p className="text-xs font-medium uppercase tracking-wider text-danger mb-3">Vaag doel</p>
            <p className="text-sm text-foreground font-medium mb-2">&ldquo;Ik wil meer sparen voor mijn vakantie&rdquo;</p>
            <ul className="space-y-1 text-xs text-muted">
              <li>✗ Geen bedrag</li>
              <li>✗ Geen datum</li>
              <li>✗ Geen maandbedrag</li>
              <li>✗ Geen meetpunt</li>
            </ul>
          </div>
          <div className="bg-success/5 border border-success/20 rounded-2xl p-5 shadow-[var(--shadow-card)]">
            <p className="text-xs font-medium uppercase tracking-wider text-success mb-3">Concreet doel</p>
            <p className="text-sm text-foreground font-medium mb-2">&ldquo;€1.500 sparen voor vakantie, klaar 1 juli, €150/mnd&rdquo;</p>
            <ul className="space-y-1 text-xs text-muted">
              <li>✓ Bedrag: €1.500</li>
              <li>✓ Datum: 1 juli</li>
              <li>✓ Maandbedrag: €150</li>
              <li>✓ Direct meetbaar</li>
            </ul>
          </div>
        </div>

        {/* Prioriteiten */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-8 shadow-[var(--shadow-card)]">
          <h2 className="font-semibold text-foreground mb-1 tracking-tight">
            Welk doel eerst? Overzicht van prioriteiten
          </h2>
          <p className="text-xs text-muted mb-4">Volgorde is niet in steen — afhankelijk van je situatie.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-muted font-medium pb-3 pr-4">Doel</th>
                  <th className="text-left text-muted font-medium pb-3 pr-4">Bedrag</th>
                  <th className="text-left text-muted font-medium pb-3 pr-4">Prioriteit</th>
                  <th className="text-left text-muted font-medium pb-3">Waarom</th>
                </tr>
              </thead>
              <tbody>
                {voorbeelddoelen.map((row, i) => (
                  <tr key={i} className="border-b border-border/50 last:border-0">
                    <td className="py-3 pr-4 font-medium text-foreground">{row.doel}</td>
                    <td className="py-3 pr-4 text-accent font-medium whitespace-nowrap">{row.bedrag}</td>
                    <td className="py-3 pr-4 text-muted whitespace-nowrap">{row.prioriteit}</td>
                    <td className="py-3 text-muted leading-relaxed">{row.waarom}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mid-page CTA */}
        <div className="bg-card border border-border rounded-2xl p-5 mb-10 shadow-[var(--shadow-card)] flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <p className="font-semibold text-foreground text-sm mb-1">Weet jij hoeveel je per maand kunt sparen?</p>
            <p className="text-xs text-muted">De scan laat in 60 seconden zien of jouw spaardoel haalbaar is.</p>
          </div>
          <Link href="/scan" className="inline-block bg-accent hover:bg-accent-hover text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-accent/20 active:scale-[0.98] whitespace-nowrap">
            Check mijn spaardoel →
          </Link>
        </div>

        {/* Praktisch: hoe begin je */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-6">
            Hoe begin je morgen al?
          </h2>
          <div className="flex flex-col gap-4">
            {[
              { stap: "1", title: "Kies één doel", body: "Niet vijf doelen tegelijk. Eén hoofddoel, maximaal één bijdoel. Meer verwarrend dan helpend." },
              { stap: "2", title: "Stel een concreet bedrag en datum vast", body: "Schrijf letterlijk op: 'Ik spaar €X voor [doel], klaar op [datum]. Dat kost me €Y per maand.'" },
              { stap: "3", title: "Open een aparte spaarrekening", body: "Geef die rekening de naam van je doel. 'Vakantie 2026' of 'Noodfonds'. Je geeft minder snel uit als het geld een naam heeft." },
              { stap: "4", title: "Automatiseer op salarisdag", body: "Overboeking instellen op de dag dat je salaris binnenkomt. Niet op het einde van de maand — dan is het er niet meer." },
              { stap: "5", title: "Check maandelijks — pas aan als het niet klopt", body: "Elke maand 5 minuten: sta ik op schema? Zo niet: pas het maandbedrag aan, niet het doel weggooien." },
            ].map((item) => (
              <div key={item.stap} className="bg-card border border-border rounded-2xl p-5 shadow-[var(--shadow-card)]">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-accent font-bold text-sm">{item.stap}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                    <p className="text-sm text-muted leading-relaxed">{item.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-accent/10 border border-accent/30 rounded-2xl p-6 mb-10 shadow-[var(--shadow-card)] text-center">
          <h2 className="font-semibold text-foreground mb-2 tracking-tight">
            Is jouw spaardoel haalbaar?
          </h2>
          <p className="text-sm text-muted mb-5 leading-relaxed">
            Vul je inkomen en uitgaven in. In 60 seconden zie je hoeveel je
            kunt sparen en of je doel realistisch is — inclusief tijdlijn.
          </p>
          <Link
            href="/scan"
            className="inline-block bg-accent hover:bg-accent-hover text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg shadow-accent/20 active:scale-[0.98] tracking-wide"
          >
            Check mijn spaardoel gratis →
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
