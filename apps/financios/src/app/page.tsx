import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getSession } from "@/lib/session";
import MobileMenu from "@/components/MobileMenu";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Financios – Gratis spaaranalyse en persoonlijk spaarplan",
  description:
    "Ontdek in 60 seconden waar jouw geld naartoe gaat. Doe gratis een spaaranalyse en krijg een persoonlijk weekplan voor jouw spaardoel. Geen account nodig.",
  alternates: {
    canonical: "https://financios.nl",
  },
  openGraph: {
    title: "Financios – Gratis spaaranalyse en persoonlijk spaarplan",
    description:
      "Ontdek in 60 seconden waar jouw geld naartoe gaat. Gratis spaaranalyse + persoonlijk weekplan voor jouw spaardoel.",
    url: "https://financios.nl",
  },
};

const steps = [
  {
    n: "1",
    title: "Vul je inkomen in",
    body: "Vul je netto maandinkomen en vaste lasten in. Geen accountregistratie, geen gedoe.",
  },
  {
    n: "2",
    title: "Zie waar je geld blijft",
    body: "Wij berekenen direct hoeveel je overhoudt — en waar je geld naartoe gaat.",
  },
  {
    n: "3",
    title: "Ontvang je spaarplan",
    body: "Gratis: je status en grootste kostenpost. Betaald: weekplan, breakdown, tips en exacte afrondingsdatum.",
  },
];

const examples = [
  {
    href: "/vakantie-sparen",
    label: "Vakantie",
    title: "Vakantie sparen",
    body: "Van citytrip tot verre reis — wij berekenen het maandbedrag dat bij jou past.",
  },
  {
    href: "/huis-sparen",
    label: "Eigen woning",
    title: "Huis kopen sparen",
    body: "Hoeveel eigen inbreng heb je nodig en hoe spaar je dat bij elkaar?",
  },
  {
    href: "/bruiloft-sparen",
    label: "Bruiloft",
    title: "Bruiloft sparen",
    body: "Trouwen zonder financiële kater — bereken jouw realistisch bruiloftsbudget.",
  },
  {
    href: "/auto-sparen",
    label: "Auto",
    title: "Auto sparen",
    body: "Tweedehands of nieuw — zie hoe lang het duurt en wat je kunt versnellen.",
  },
  {
    href: "/studie-sparen",
    label: "Studie",
    title: "Studie sparen",
    body: "Bouw een buffer op voor collegegeld, boeken en levensonderhoud.",
  },
  {
    href: "/10000-euro-sparen",
    label: "Groot doel",
    title: "€10.000 sparen",
    body: "Een groter doel vraagt een concreter plan — bereken jouw persoonlijke tijdlijn.",
  },
];

export default async function LandingPage() {
  const session = await getSession();
  return (
    <main className="flex flex-col min-h-screen">
      <JsonLd />
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border px-6 py-4 flex items-center justify-between max-w-5xl mx-auto w-full backdrop-blur-md bg-background/80">
        <Image
          src="/logo.png"
          alt="Financios"
          width={140}
          height={36}
          priority
        />
        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-4 sm:gap-6">
          <Link href="/blog" className="text-sm text-muted hover:text-foreground transition-colors">Blog</Link>
          <Link href="/upgrade" className="text-sm text-muted hover:text-foreground transition-colors">Prijzen</Link>
          {session ? (
            <Link href="/dashboard" className="text-sm font-semibold text-accent hover:text-accent-hover transition-colors">
              Dashboard →
            </Link>
          ) : (
            <Link href="/login" className="text-sm font-semibold bg-card border border-border hover:border-accent/40 text-foreground px-4 py-2 rounded-xl transition-all">
              Inloggen
            </Link>
          )}
          <Link href="/scan" className="text-sm font-semibold bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-xl transition-all shadow-lg shadow-accent/20">
            Start scan →
          </Link>
        </div>

        {/* Mobile: scan knop + hamburger */}
        <div className="flex sm:hidden items-center gap-2 relative">
          <Link href="/scan" className="text-sm font-semibold bg-accent hover:bg-accent-hover text-white px-3 py-2 rounded-xl transition-all shadow-lg shadow-accent/20">
            Scan →
          </Link>
          <MobileMenu
            items={[
              { href: "/blog", label: "Blog" },
              { href: "/upgrade", label: "Prijzen" },
              session ? { href: "/dashboard", label: "Dashboard →", accent: false } : { href: "/login", label: "Inloggen" },
            ]}
          />
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 pt-28 pb-20 max-w-3xl mx-auto w-full">
        <div className="inline-flex items-center gap-2 bg-card-hover border border-border rounded-full px-4 py-1.5 text-sm text-muted mb-8 tracking-wide">
          <span className="w-2 h-2 rounded-full bg-success inline-block" />
          Gratis scan · Persoonlijk dashboard · 60 seconden
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold text-foreground leading-tight tracking-tight mb-4">
          Waarom ben jij{" "}
          <span className="text-accent">altijd blut?</span>
        </h1>

        <p className="text-xl sm:text-2xl font-semibold text-foreground/70 tracking-tight mb-6">
          Het is de 20ste. Je saldo klopt alweer niet.
        </p>

        <p className="text-lg sm:text-xl text-muted max-w-xl mb-10 leading-[1.7]">
          Je werkt, je betaalt je rekeningen — maar aan het einde van de maand is het weg.
          Vul in wat er binnenkomt en gaat. Wij laten je zien waar het misgaat.
        </p>

        <Link
          href="/scan"
          className="bg-accent hover:bg-accent-hover text-white font-semibold px-8 py-4 sm:px-12 sm:py-5 rounded-xl text-lg sm:text-xl transition-all shadow-lg shadow-accent/20 active:scale-[0.98] tracking-wide"
        >
          Start spaar scan →
        </Link>

        <div className="flex items-center justify-center gap-3 mt-5 flex-wrap">
          {[
            { icon: "✓", label: "Gratis scan" },
            { icon: "💶", label: "Plan €4,99 eenmalig" },
            { icon: "✓", label: "Voortgang bijhouden" },
            { icon: "📱", label: "Installeerbaar als app" },
            { icon: "🔒", label: "Privacy-first" },
          ].map((b) => (
            <span
              key={b.label}
              className="inline-flex items-center gap-1.5 bg-card border border-border rounded-full px-3 py-1 text-xs text-muted"
            >
              <span>{b.icon}</span>
              {b.label}
            </span>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 pb-20 max-w-5xl mx-auto w-full">
        <div className="text-center mb-10">
          <p className="text-xs font-medium uppercase tracking-wider text-accent mb-2">
            Hoe het werkt
          </p>
          <h2 className="text-2xl font-semibold text-foreground tracking-tight">
            In 3 stappen naar jouw spaarplan
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {steps.map((step) => (
            <div
              key={step.n}
              className="bg-card border border-border rounded-2xl p-6 shadow-[var(--shadow-card)] flex gap-4 items-start"
            >
              <span className="w-8 h-8 rounded-full bg-accent/20 text-accent text-sm font-bold flex items-center justify-center shrink-0">
                {step.n}
              </span>
              <div>
                <h3 className="font-semibold text-foreground mb-1">{step.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Voorbeelden */}
      <section className="px-6 pb-20 max-w-5xl mx-auto w-full">
        <div className="text-center mb-10">
          <p className="text-xs font-medium uppercase tracking-wider text-accent mb-2">
            Voorbeelden
          </p>
          <h2 className="text-2xl font-semibold text-foreground tracking-tight">
            Wat wil jij sparen?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {examples.map((ex) => (
            <Link
              key={ex.href}
              href={ex.href}
              className="bg-card border border-border rounded-2xl p-6 shadow-[var(--shadow-card)] hover:border-accent/30 hover:bg-card-hover transition-all duration-200 group"
            >
              <p className="text-xs font-medium uppercase tracking-wider text-accent mb-2">
                {ex.label}
              </p>
              <h3 className="font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                {ex.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed mb-4">{ex.body}</p>
              <span className="text-xs text-accent font-medium">
                Bereken jouw plan →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Benefit cards */}
      <section className="px-6 pb-20 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <BenefitCard
            icon="📊"
            title="Inzicht in 60 seconden"
            description="Vul in wat je verdient en uitgeeft. Wij laten je zien waar het misgaat."
          />
          <BenefitCard
            icon="🎯"
            title="Spaardoel analyse"
            description="Is jouw doel haalbaar? Je ziet het direct — geen vage antwoorden."
          />
          <BenefitCard
            icon="🔧"
            title="Concreet fix plan"
            description="Niet haalbaar? Je krijgt een weekplan dat je precies vertelt wat je moet doen."
          />
        </div>
      </section>

      {/* Voor & na */}
      <section className="px-6 pb-20 max-w-5xl mx-auto w-full">
        <div className="text-center mb-10">
          <p className="text-xs font-medium uppercase tracking-wider text-accent mb-2">
            Voor &amp; na
          </p>
          <h2 className="text-2xl font-semibold text-foreground tracking-tight">
            Van &ldquo;waar gaat mijn geld naartoe?&rdquo; naar een concreet plan
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Zonder plan */}
          <div className="bg-danger/5 border border-danger/20 rounded-2xl p-6 shadow-[var(--shadow-card)]">
            <p className="text-xs font-medium uppercase tracking-wider text-danger mb-4">
              Zonder plan
            </p>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Inkomen</span>
                <span className="text-foreground font-medium">€2.847</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Vaste lasten</span>
                <span className="text-foreground">−€1.163</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Variabele kosten</span>
                <span className="text-muted">−€??? (onbekend)</span>
              </div>
              <div className="border-t border-danger/20 pt-3 flex justify-between">
                <span className="text-danger font-semibold">Einde maand</span>
                <span className="text-danger font-bold">€0 over</span>
              </div>
            </div>
            <p className="text-xs text-muted mt-4 leading-relaxed">
              Er zou €1.684 overblijven na vaste lasten. Maar waar het heen gaat? Geen idee.
            </p>
          </div>

          {/* Met plan */}
          <div className="bg-success/5 border border-success/20 rounded-2xl p-6 shadow-[var(--shadow-card)]">
            <p className="text-xs font-medium uppercase tracking-wider text-success mb-4">
              Met Financios plan
            </p>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Inkomen</span>
                <span className="text-foreground font-medium">€2.847</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Vaste lasten</span>
                <span className="text-foreground">−€1.163</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Variabele kosten</span>
                <span className="text-foreground">−€1.034 (inzichtelijk)</span>
              </div>
              <div className="border-t border-success/20 pt-3 flex justify-between">
                <span className="text-success font-semibold">Spaarruimte</span>
                <span className="text-success font-bold">€650/maand</span>
              </div>
            </div>
            <p className="text-xs text-muted mt-4 leading-relaxed">
              Grootste lek: horeca €312/maand. Bezuinig 30% → €94 extra. Spaardoel haalbaar in 9 maanden.
            </p>
          </div>
        </div>
      </section>

      {/* Trust + final CTA */}
      <section className="px-6 pb-28 max-w-2xl mx-auto w-full text-center">
        <div className="bg-accent/10 border border-accent/30 rounded-2xl p-8 shadow-[var(--shadow-card)]">
          <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-3">
            Klaar om te starten?
          </h2>
          <p className="text-muted mb-6 leading-relaxed">
            Duurt 60 seconden. Geen account. Geen creditcard. Je gegevens
            verlaten je browser niet — alles wordt lokaal berekend.
          </p>
          <Link
            href="/scan"
            className="inline-block bg-accent hover:bg-accent-hover text-white font-semibold px-8 py-4 rounded-xl text-base transition-all shadow-lg shadow-accent/20 active:scale-[0.98] tracking-wide"
          >
            Start spaar scan gratis →
          </Link>
          <div className="flex items-center justify-center gap-6 mt-5 flex-wrap">
            {["✓ Geen registratie", "✓ Geen creditcard", "✓ Privacy-first"].map((t) => (
              <span key={t} className="text-xs text-muted">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8 text-center text-sm text-muted">
        <div className="flex items-center justify-center gap-6 flex-wrap">
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
        <div className="mt-4 flex justify-center">
          <a href="https://launchllama.co?utm_source=badge&utm_medium=referral" target="_blank" rel="noopener noreferrer">
            <img
              src="https://speaktechenglish.com/wp-content/uploads/2026/04/Screenshot_2026-04-09_at_17.40.44-removebg-preview.png"
              alt="Featured on Launch Llama"
              width="200"
              height="50"
              loading="lazy"
            />
          </a>
        </div>
      </footer>
    </main>
  );
}

function BenefitCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-[var(--shadow-card)] hover:border-accent/20 transition-colors duration-200">
      <div className="text-2xl mb-3">{icon}</div>
      <h3 className="font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted leading-relaxed">{description}</p>
    </div>
  );
}
