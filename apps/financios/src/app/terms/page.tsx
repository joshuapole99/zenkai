import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Algemene voorwaarden",
  description: "De algemene voorwaarden van Financios.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen px-4 py-10 max-w-2xl mx-auto">
      <Link href="/" className="text-sm text-muted hover:text-foreground transition-colors mb-8 inline-block">
        ← Home
      </Link>
      <h1 className="text-3xl font-semibold text-foreground mb-2 tracking-tight">Algemene voorwaarden</h1>
      <p className="text-xs text-muted mb-8">Laatst bijgewerkt: april 2026</p>

      <div className="bg-card border border-border rounded-2xl p-6 space-y-6 text-sm text-muted leading-[1.75] shadow-[var(--shadow-card)]">

        <div>
          <h2 className="text-foreground font-semibold text-sm uppercase tracking-wider mb-2">Wie zijn wij?</h2>
          <p>
            Financios is een online tool voor het analyseren van spaarsituaties en het ontvangen van een persoonlijk spaarplan.
            Voor vragen: <a href="mailto:hallo@financios.nl" className="text-accent underline">hallo@financios.nl</a>.
          </p>
        </div>

        <div>
          <h2 className="text-foreground font-semibold text-sm uppercase tracking-wider mb-2">Gebruik op eigen risico</h2>
          <p>
            Financios is een informatieve tool. Alle resultaten zijn schattingen en geen financieel advies. Het gebruik geschiedt
            volledig op eigen risico. Zie ook onze <Link href="/disclaimer" className="text-accent underline">disclaimer</Link>.
          </p>
        </div>

        <div>
          <h2 className="text-foreground font-semibold text-sm uppercase tracking-wider mb-2">Betaalde dienst — persoonlijk spaarplan</h2>
          <p className="mb-2">
            Financios biedt een betaald persoonlijk spaarplan aan voor een eenmalig bedrag van <strong className="text-foreground">€4,99</strong>. Dit plan bevat:
          </p>
          <ul className="list-disc list-inside space-y-1 mb-2">
            <li>Een weekplan op maat gebaseerd op jouw ingevoerde gegevens</li>
            <li>Een maandelijkse budgetbreakdown</li>
            <li>Persoonlijke bezuinigingstips</li>
            <li>3 progressiescenario&apos;s</li>
            <li>Een berekende afrondingsdatum</li>
          </ul>
          <p>
            Het plan is een digitaal product dat direct na betaling beschikbaar is via een persoonlijke link (magic link) die per e-mail wordt verstuurd.
          </p>
        </div>

        <div>
          <h2 className="text-foreground font-semibold text-sm uppercase tracking-wider mb-2">Betaling</h2>
          <p>
            Betalingen worden verwerkt door <strong className="text-foreground">Lemon Squeezy</strong>. Wij hebben geen toegang tot je betaalgegevens.
            Lemon Squeezy accepteert creditcards en PayPal.
          </p>
        </div>

        <div>
          <h2 className="text-foreground font-semibold text-sm uppercase tracking-wider mb-2">Herroepingsrecht</h2>
          <p>
            Omdat het spaarplan een digitaal product is dat direct na aankoop beschikbaar wordt gesteld, vervalt het herroepingsrecht
            op het moment dat je het plan opent. Door de aankoop te voltooien ga je akkoord met de onmiddellijke levering en het
            daarmee vervallen van het herroepingsrecht (conform artikel 6:230p BW).
          </p>
          <p className="mt-2">
            Indien een terugbetaling van toepassing is, wordt deze binnen <strong className="text-foreground">10 werkdagen</strong> verwerkt via de oorspronkelijke betaalmethode.
          </p>
          <p className="mt-2">
            Heb je technische problemen waardoor je het plan niet kunt openen? Neem contact op via <a href="mailto:hallo@financios.nl" className="text-accent underline">hallo@financios.nl</a> — we lossen het op.
          </p>
        </div>

        <div>
          <h2 className="text-foreground font-semibold text-sm uppercase tracking-wider mb-2">Geen financieel advies</h2>
          <p>
            De resultaten van Financios zijn geen financieel advies en dienen uitsluitend voor informatieve en educatieve doeleinden.
            Raadpleeg een gecertificeerd financieel adviseur voor persoonlijk advies.
          </p>
        </div>

        <div>
          <h2 className="text-foreground font-semibold text-sm uppercase tracking-wider mb-2">Intellectueel eigendom</h2>
          <p>
            Alle inhoud op Financios, inclusief teksten, berekeningen en het spaarplan, is eigendom van Financios. Het is niet
            toegestaan inhoud te kopiëren, verspreiden of commercieel te gebruiken zonder toestemming.
          </p>
        </div>

        <div>
          <h2 className="text-foreground font-semibold text-sm uppercase tracking-wider mb-2">Wijzigingen</h2>
          <p>
            Financios behoudt het recht om de service, prijzen of voorwaarden op elk moment te wijzigen. Bij ingrijpende
            wijzigingen communiceren we dit via de website.
          </p>
        </div>

        <div>
          <h2 className="text-foreground font-semibold text-sm uppercase tracking-wider mb-2">Toepasselijk recht</h2>
          <p>Op deze voorwaarden is Nederlands recht van toepassing.</p>
        </div>

      </div>
    </main>
  );
}
