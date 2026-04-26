import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog & Spaargidsen | Financios",
  description:
    "Praktische spaargidsen en calculators voor Nederlandse spaarders. Van vakantie sparen tot FIRE, noodfonds en pensioen — lees alles over slimmer omgaan met geld.",
  openGraph: {
    title: "Blog & Spaargidsen | Financios",
    description:
      "Praktische spaargidsen en calculators voor Nederlandse spaarders.",
    url: "https://financios.nl/blog",
  },
};

const spaardoelen = [
  {
    href: "/vakantie-sparen",
    category: "Spaardoel",
    title: "Vakantie sparen",
    description:
      "Hoeveel moet je per maand opzij zetten voor jouw vakantie? Bereken het op basis van je budget en tijdlijn.",
  },
  {
    href: "/auto-sparen",
    category: "Spaardoel",
    title: "Auto sparen",
    description:
      "Wat kost een auto écht en hoe lang duurt het sparen? Van tweedehands tot nieuw — met concrete maandbedragen.",
  },
  {
    href: "/huis-sparen",
    category: "Spaardoel",
    title: "Huis kopen sparen",
    description:
      "Hoeveel eigen geld heb je nodig voor een huis? Inclusief bijkomende kosten, startersvrijstelling en spaartijdlijn.",
  },
  {
    href: "/bruiloft-sparen",
    category: "Spaardoel",
    title: "Bruiloft sparen",
    description:
      "Wat kost een bruiloft in Nederland en hoe spaar je er samen voor? Concrete budgetten en maandelijkse bedragen.",
  },
  {
    href: "/studie-sparen",
    category: "Spaardoel",
    title: "Studie sparen",
    description:
      "Hoeveel kost studeren en hoe bouw je een studiebuffer op? Van collegegeld tot levensonderhoud.",
  },
  {
    href: "/5000-euro-sparen",
    category: "Spaardoel",
    title: "€5.000 sparen",
    description:
      "In hoeveel maanden spaar je €5.000? Bereken je persoonlijke tijdlijn op basis van wat je maandelijks kunt missen.",
  },
  {
    href: "/10000-euro-sparen",
    category: "Spaardoel",
    title: "€10.000 sparen",
    description:
      "Van €10.000 spaardoel naar concreet maandplan. Hoe lang duurt het en wat heb je nodig?",
  },
];

const slimmerSparen = [
  {
    href: "/hoeveel-moet-je-sparen-per-maand",
    category: "Strategie",
    title: "Hoeveel moet je sparen per maand?",
    description:
      "De 50/30/20-vuistregel uitgelegd met concrete voorbeelden per inkomensniveau. Wat is realistisch voor jou?",
  },
  {
    href: "/geld-besparen-tips",
    category: "Gids",
    title: "Geld besparen: 15 tips die echt werken",
    description:
      "Niet de gebruikelijke 'skip je koffie'-tips. De categorieën waar Nederlanders echt geld laten liggen, met concrete bedragen.",
  },
  {
    href: "/maandbudget-maken",
    category: "Gids",
    title: "Maandbudget maken in 5 stappen",
    description:
      "Hoe maak je een budget dat je ook bijhoudt? Stappenplan met voorbeeldbudget op basis van modaal inkomen.",
  },
  {
    href: "/spaardoelen-stellen",
    category: "Strategie",
    title: "Spaardoelen stellen",
    description:
      "Van 'meer sparen' naar een concreet doel met bedrag, datum en maandbedrag. Inclusief prioriteitenlijst.",
  },
  {
    href: "/noodfonds-opbouwen",
    category: "Strategie",
    title: "Noodfonds opbouwen",
    description:
      "Hoeveel moet je noodfonds zijn en hoe bouw je het op? De eerste stap voor iedereen die serieus wil sparen.",
  },
  {
    href: "/huurweek-overleven",
    category: "Strategie",
    title: "Huurweek overleven",
    description:
      "Waarom is je saldo ineens leeg rond de 1e van de maand? Dit is wat er misgaat — en hoe je het oplost.",
  },
  {
    href: "/pensioen-sparen-jongeren",
    category: "Strategie",
    title: "Pensioen sparen als jongere",
    description:
      "Wanneer begin je en hoeveel zet je opzij? Alles over pensioengat, lijfrente en het effect van vroeg beginnen.",
  },
  {
    href: "/fire-beweging-nederland",
    category: "Strategie",
    title: "FIRE beweging Nederland",
    description:
      "Financieel onafhankelijk worden in Nederland: hoe werkt FIRE, wat is de 4%-regel en wat is realistisch?",
  },
  {
    href: "/beleggen-beginnen",
    category: "Calculator",
    title: "Beginnen met beleggen",
    description:
      "Bereken wat €X per maand oplevert over 10, 20 of 30 jaar. Inclusief rendement en inflatie — voor beginners.",
  },
];

function ArticleCard({
  href,
  category,
  title,
  description,
}: {
  href: string;
  category: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group bg-card border border-border rounded-2xl p-6 shadow-[var(--shadow-card)] hover:border-accent/40 transition-all"
    >
      <p className="text-xs font-medium uppercase tracking-wider text-accent mb-2">
        {category}
      </p>
      <h3 className="text-base font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
        {title}
      </h3>
      <p className="text-sm text-muted leading-relaxed">{description}</p>
      <p className="text-sm text-accent mt-4 font-medium">Lees meer →</p>
    </Link>
  );
}

export default function Blog() {
  return (
    <main className="min-h-screen">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border px-6 py-4 flex items-center justify-between max-w-5xl mx-auto w-full backdrop-blur-md bg-background/80">
        <Link href="/">
          <Image src="/logo.png" alt="Financios" width={140} height={36} priority />
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/blog"
            className="text-sm text-foreground font-medium transition-colors"
          >
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

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="mb-12 max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-wider text-accent mb-3">
            Spaargidsen &amp; calculators
          </p>
          <h1 className="text-4xl font-bold text-foreground tracking-tight leading-tight mb-4">
            Alles over slimmer sparen
          </h1>
          <p className="text-lg text-muted leading-[1.7]">
            Concrete gidsen voor Nederlandse spaarders. Van je eerste noodfonds
            tot financiële onafhankelijkheid — met calculators en echte cijfers.
          </p>
        </div>

        {/* Spaardoelen */}
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">
              Sparen voor een doel
            </h2>
            <span className="text-xs bg-card border border-border rounded-full px-3 py-1 text-muted">
              {spaardoelen.length} gidsen
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {spaardoelen.map((item) => (
              <ArticleCard key={item.href} {...item} />
            ))}
          </div>
        </section>

        {/* Slimmer sparen */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">
              Slimmer met geld
            </h2>
            <span className="text-xs bg-card border border-border rounded-full px-3 py-1 text-muted">
              {slimmerSparen.length} gidsen
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {slimmerSparen.map((item) => (
              <ArticleCard key={item.href} {...item} />
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-2xl mx-auto text-center">
          <div className="bg-accent/10 border border-accent/30 rounded-2xl p-8 shadow-[var(--shadow-card)]">
            <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-3">
              Wil je weten wat jij kunt sparen?
            </h2>
            <p className="text-muted mb-6 leading-relaxed">
              Lezen is één ding — weten wat het voor jóuw situatie betekent is
              een ander. De scan duurt 60 seconden en geeft direct inzicht.
            </p>
            <Link
              href="/scan"
              className="inline-block bg-accent hover:bg-accent-hover text-white font-semibold px-8 py-4 rounded-xl text-base transition-all shadow-lg shadow-accent/20 active:scale-[0.98] tracking-wide"
            >
              Start gratis scan →
            </Link>
            <p className="text-sm text-muted mt-4">
              Gratis scan · Plan voor €4,99 eenmalig · Geen account
            </p>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8 text-center text-sm text-muted mt-8">
        <div className="flex items-center justify-center gap-6 flex-wrap">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <Link href="/disclaimer" className="hover:text-foreground transition-colors">
            Disclaimer
          </Link>
          <Link href="/privacy" className="hover:text-foreground transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-foreground transition-colors">
            Voorwaarden
          </Link>
        </div>
        <p className="mt-3 text-xs">
          Financios is een rekentool, geen financieel adviseur. Uitkomsten zijn berekeningen op basis van jouw invoer — geen advies.
        </p>
      </footer>
    </main>
  );
}
