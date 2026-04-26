import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Geld besparen: 15 tips die echt werken (2026)",
  description:
    "Praktische tips om geld te besparen in Nederland. Van vaste lasten tot dagelijkse uitgaven — met concrete bedragen en direct toepasbaar.",
  openGraph: {
    title: "Geld besparen: 15 tips die echt werken",
    description:
      "Praktische tips om geld te besparen in Nederland. Met concrete bedragen per categorie.",
    url: "https://financios.nl/geld-besparen-tips",
  },
};

const categories = [
  {
    categorie: "Energie & internet",
    potentieel: "€30–€80/mnd",
    tip: "Vergelijk via Independer of Gaslicht. Overstappen duurt 10 minuten.",
  },
  {
    categorie: "Boodschappen",
    potentieel: "€50–€150/mnd",
    tip: "Aldi/Lidl in plaats van Albert Heijn spaart gemiddeld 25% op je weekboodschappen.",
  },
  {
    categorie: "Abonnementen",
    potentieel: "€20–€60/mnd",
    tip: "Gemiddeld heeft een Nederlander 4–6 actieve abonnementen. Hoeveel gebruik je er nog?",
  },
  {
    categorie: "Horeca & eten buiten de deur",
    potentieel: "€80–€200/mnd",
    tip: "Lunch mee naar werk = €5 per dag bespaard = €100/mnd. Thuis koken i.p.v. thuisbezorgd = €15–€20 per bestelling.",
  },
  {
    categorie: "Transport",
    potentieel: "€30–€100/mnd",
    tip: "Ov-fiets, carpooling of een maandkaart i.p.v. treinkaartjes per rit.",
  },
  {
    categorie: "Verzekeringen",
    potentieel: "€15–€50/mnd",
    tip: "Collectieve ziektekostenverzekering via werkgever of vakbond is vaak 10–15% goedkoper.",
  },
];

const faqs = [
  {
    q: "Hoeveel kun je realistisch besparen per maand?",
    a: "Voor de meeste Nederlanders zit er €100–€300 per maand aan onnodige uitgaven in het budget zonder dat ze het doorhebben. Het zit niet in één grote post, maar in tientallen kleine gewoontes: koffie, bezorgkosten, streaming, impulsaankopen. De eerste stap is inzicht krijgen in waar het naartoe gaat.",
  },
  {
    q: "Wat zijn de grootste geldverspillers?",
    a: "Uit onderzoek blijkt dat horeca & eten buiten de deur, ongebruikte abonnementen en energiekosten de drie grootste posten zijn waar mensen onnodig geld uitgeven. Samen goed voor gemiddeld €200–€400 per maand bij iemand die niet actief bijhoudt wat hij uitgeeft.",
  },
  {
    q: "Is het de moeite om kleine bedragen te besparen?",
    a: "Een Netflix-abonnement van €15 per maand lijkt niets. Maar €15 per maand is €180 per jaar. Drie van zulke abonnementen die je niet meer gebruikt = €540 per jaar. Klein × veel = groot. Het gaat om het patroon, niet om één bedrag.",
  },
  {
    q: "Hoe weet ik waar ik het meest kan besparen?",
    a: "Door je uitgaven in kaart te brengen per categorie. Dat is precies wat de Financios scan doet: je vult in wat je uitgeeft en ziet direct welke categorie het meest lekt. Geen spreadsheet nodig — duurt 60 seconden.",
  },
];

export default function GeldBesparenTips() {
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
            Besparen
          </p>
          <h1 className="text-4xl font-bold text-foreground tracking-tight leading-tight mb-4">
            Geld besparen: 15 tips die echt werken
          </h1>
          <p className="text-lg text-muted leading-[1.7]">
            De meeste tips over besparen gaan over het weglaten van koffie. Dat
            helpt niet. Wat wél helpt: weten waar je geld naartoe gaat en de
            categorieën aanpakken die er écht toe doen.
          </p>
        </div>

        {/* Savings potential table */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-8 shadow-[var(--shadow-card)]">
          <h2 className="font-semibold text-foreground mb-4 tracking-tight">
            Waar zit het meeste bespaarpotentieel?
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-muted font-medium pb-3 pr-4">Categorie</th>
                  <th className="text-left text-muted font-medium pb-3 pr-4">Potentieel</th>
                  <th className="text-left text-muted font-medium pb-3">Hoe</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((row, i) => (
                  <tr key={i} className="border-b border-border/50 last:border-0">
                    <td className="py-3 pr-4 font-medium text-foreground">{row.categorie}</td>
                    <td className="py-3 pr-4 text-accent font-medium whitespace-nowrap">{row.potentieel}</td>
                    <td className="py-3 text-muted leading-relaxed">{row.tip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mid-page CTA */}
        <div className="bg-card border border-border rounded-2xl p-5 mb-8 shadow-[var(--shadow-card)] flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <p className="font-semibold text-foreground text-sm mb-1">Hoeveel kun jij besparen?</p>
            <p className="text-xs text-muted">Vul je uitgaven in en zie direct welke categorie het meest lekt.</p>
          </div>
          <Link href="/scan" className="inline-block bg-accent hover:bg-accent-hover text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-accent/20 active:scale-[0.98] whitespace-nowrap">
            Bereken mijn spaarruimte →
          </Link>
        </div>

        {/* Tips sections */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-6">
            Vaste lasten verlagen (tips 1–5)
          </h2>
          <div className="flex flex-col gap-4">
            {[
              { nr: "1", title: "Energie: vergelijk en stap over", body: "Nederlanders betalen gemiddeld €30–€80 per maand te veel op energie door nooit over te stappen. Gebruik Independer of Gaslicht.nl. Overstappen kost 10 minuten en de besparing is direct." },
              { nr: "2", title: "Internet & telefoon bundelen", body: "Combineer je internet en mobiel bij één provider. Bundels zijn vrijwel altijd goedkoper dan twee losse contracten. Besparing: €10–€25 per maand." },
              { nr: "3", title: "Verzekeringen jaarlijks vergelijken", body: "Zorgverzekeringen, inboedel, aansprakelijkheid — vergelijk elk jaar in november/december. Overstappen van zorgverzekeraar alleen kost gemiddeld €150–€300 per jaar minder." },
              { nr: "4", title: "Abonnementen opzeggen die je niet gebruikt", body: "Maak een lijst van al je automatische afschrijvingen. Gemiddeld heeft iemand €40–€80 per maand aan abonnementen die zelden of nooit gebruikt worden. Opzeggen duurt 5 minuten." },
              { nr: "5", title: "Hypotheek of huur: heronderhandel of verhuischeck", body: "Als je huurt: ga na of je in aanmerking komt voor een sociale huurwoning. Als je een hypotheek hebt: controleer of rentemiddeling of oversluiten goedkoper is bij rente-herziening." },
            ].map((tip) => (
              <div key={tip.nr} className="bg-card border border-border rounded-2xl p-5 shadow-[var(--shadow-card)]">
                <div className="flex items-start gap-3">
                  <span className="text-accent font-bold text-lg leading-none mt-0.5">{tip.nr}.</span>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{tip.title}</h3>
                    <p className="text-sm text-muted leading-relaxed">{tip.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-6">
            Dagelijkse uitgaven (tips 6–10)
          </h2>
          <div className="flex flex-col gap-4">
            {[
              { nr: "6", title: "Lunch mee naar werk", body: "Een broodje bij de bakker of kantine kost €4–€7 per dag. Lunch mee = €80–€140 per maand bespaard. Per jaar €960–€1.680." },
              { nr: "7", title: "Stop met thuisbezorgen als standaard", body: "Thuisbezorgd kost gemiddeld €20–€35 per bestelling inclusief bezorgkosten en fooi. Één keer per week minder = €80–€140 per maand bespaard." },
              { nr: "8", title: "Koffie: thuiszetten of thermosbeker", body: "Drie koffietjes buitenshuis per dag × €3 = €270 per maand. Een goede koffiezetapparaat + pak koffie = €15–€20 per maand. Verschil: €250." },
              { nr: "9", title: "Boodschappen: switch naar discountsupermarkt", body: "Aldi en Lidl zijn gemiddeld 20–30% goedkoper dan Albert Heijn voor hetzelfde boodschappenmandje. Een gezin spaart hiermee €100–€200 per maand." },
              { nr: "10", title: "Impulsaankopen: 48-uur regel", body: "Leg iets wat je wil kopen 48 uur 'in je hoofd'. Als je het nog steeds wil, koop het dan. Onderzoek toont dat 60–70% van impulsaankopen zo verdwijnt." },
            ].map((tip) => (
              <div key={tip.nr} className="bg-card border border-border rounded-2xl p-5 shadow-[var(--shadow-card)]">
                <div className="flex items-start gap-3">
                  <span className="text-accent font-bold text-lg leading-none mt-0.5">{tip.nr}.</span>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{tip.title}</h3>
                    <p className="text-sm text-muted leading-relaxed">{tip.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-6">
            Gedrag & systemen (tips 11–15)
          </h2>
          <div className="flex flex-col gap-4">
            {[
              { nr: "11", title: "Automatisch sparen op de 1e van de maand", body: "Stel een automatische overboeking in op de dag dat je salaris binnenkomt. Je spaart wat overblijft nooit — je geeft uit wat overblijft. Draai het om." },
              { nr: "12", title: "Gebruik één betaalrekening voor vaste lasten", body: "Zet je vaste lasten op een aparte rekening. Zo zie je altijd hoeveel 'vrij te besteden' geld je hebt zonder te rekenen." },
              { nr: "13", title: "Vergelijk grote aankopen altijd via Marktplaats", body: "Meubels, elektronica, fietsen — tweedehands is 40–70% goedkoper. Kwaliteit is vaak identiek." },
              { nr: "14", title: "Weet je grootste kostenpost per maand", body: "De meeste mensen weten niet welke categorie hen het meest kost. Zodra je dat weet, kun je gerichte keuzes maken. Niet blind snijden in alles." },
              { nr: "15", title: "Bereken je spaarruimte concreet", body: "Niet 'ik ga meer sparen' maar 'ik ga €X per maand sparen'. Dat verschil is cruciaal. Een scan van 60 seconden laat zien wat jouw X is." },
            ].map((tip) => (
              <div key={tip.nr} className="bg-card border border-border rounded-2xl p-5 shadow-[var(--shadow-card)]">
                <div className="flex items-start gap-3">
                  <span className="text-accent font-bold text-lg leading-none mt-0.5">{tip.nr}.</span>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{tip.title}</h3>
                    <p className="text-sm text-muted leading-relaxed">{tip.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-accent/10 border border-accent/30 rounded-2xl p-6 mb-10 shadow-[var(--shadow-card)] text-center">
          <h2 className="font-semibold text-foreground mb-2 tracking-tight">
            Ontdek waar jouw geld naartoe gaat
          </h2>
          <p className="text-sm text-muted mb-5 leading-relaxed">
            Tips lezen is één ding. Weten welke tip voor jóu het meest oplevert
            is een ander. De scan laat in 60 seconden zien welke categorie jou
            het meest kost.
          </p>
          <Link
            href="/scan"
            className="inline-block bg-accent hover:bg-accent-hover text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg shadow-accent/20 active:scale-[0.98] tracking-wide"
          >
            Bereken mijn bespaarpotentieel →
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
