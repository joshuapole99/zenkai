import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacybeleid",
  description: "Hoe Financios omgaat met jouw gegevens en welke gegevens we opslaan.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen px-4 py-10 max-w-2xl mx-auto">
      <Link href="/" className="text-sm text-muted hover:text-foreground transition-colors mb-8 inline-block">
        ← Home
      </Link>
      <h1 className="text-3xl font-semibold text-foreground mb-2 tracking-tight">Privacybeleid</h1>
      <p className="text-xs text-muted mb-8">Laatst bijgewerkt: april 2026</p>

      <div className="bg-card border border-border rounded-2xl p-6 space-y-6 text-sm text-muted leading-[1.75] shadow-[var(--shadow-card)]">

        <div>
          <h2 className="text-foreground font-semibold text-sm uppercase tracking-wider mb-2">Wie zijn wij?</h2>
          <p>
            Financios is een online tool waarmee je jouw spaarsituatie kunt analyseren en een persoonlijk spaarplan kunt ontvangen.
            Vragen over dit beleid? Stuur een e-mail naar <a href="mailto:privacy@financios.nl" className="text-accent underline">privacy@financios.nl</a>.
          </p>
        </div>

        <div>
          <h2 className="text-foreground font-semibold text-sm uppercase tracking-wider mb-2">Welke gegevens verzamelen we?</h2>
          <p className="mb-3">We verzamelen zo min mogelijk gegevens. Hier is een overzicht:</p>
          <div className="space-y-3">
            <div>
              <p className="text-foreground font-medium mb-1">Scangegevens (financiële invoer)</p>
              <p>De inkomsten- en uitgavencijfers die je invult worden alleen gebruikt voor de berekening op jouw apparaat. Ze worden doorgegeven via URL-parameters en worden <strong className="text-foreground">niet opgeslagen in een database</strong> — tenzij je een betaald spaarplan afneemt (zie hieronder).</p>
            </div>
            <div>
              <p className="text-foreground font-medium mb-1">Betaald spaarplan (aankoop)</p>
              <p>Als je een persoonlijk spaarplan aanschaft, worden jouw e-mailadres (via Lemon Squeezy) en de door jou ingevoerde scangegevens opgeslagen in onze database (Upstash Redis, EU-regio). Dit is noodzakelijk om je een persoonlijke magic link te sturen en je plan op elk apparaat toegankelijk te maken. Deze gegevens bewaren we maximaal 1 jaar.</p>
            </div>
            <div>
              <p className="text-foreground font-medium mb-1">E-mailadres (nieuwsbrief opt-in)</p>
              <p>Als je je e-mailadres achterlaat op de resultaatpagina, slaan we dit op in onze database (Upstash Redis, EU-regio). Je kunt je altijd afmelden door een e-mail te sturen naar <a href="mailto:privacy@financios.nl" className="text-accent underline">privacy@financios.nl</a>.</p>
            </div>
            <div>
              <p className="text-foreground font-medium mb-1">Analytics</p>
              <p>We gebruiken PostHog (EU-servers) voor privacyvriendelijke analytics. PostHog registreert paginabezoeken en klikgebeurtenissen zonder persoonsgegevens te koppelen aan individuele gebruikers. Er worden geen advertentiecookies geplaatst.</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-foreground font-semibold text-sm uppercase tracking-wider mb-2">Derde partijen</h2>
          <div className="space-y-2">
            <p><span className="text-foreground">Lemon Squeezy</span> — verwerkt betalingen. Zij hebben een eigen privacybeleid en zijn verantwoordelijk voor de verwerking van betaalgegevens.</p>
            <p><span className="text-foreground">Brevo</span> — verstuurt transactionele e-mails (magic link na aankoop). E-mailadressen worden alleen gebruikt voor het versturen van jouw spaarplan.</p>
            <p><span className="text-foreground">Upstash</span> — slaat tokens en e-mailadressen op in een Redis database in de EU-regio.</p>
            <p><span className="text-foreground">PostHog</span> — privacyvriendelijke analytics zonder persoonsgegevens.</p>
            <p><span className="text-foreground">Vercel</span> — hosting van de website in de EU/VS. Vercel verwerkt standaard serverlogboeken.</p>
          </div>
        </div>

        <div>
          <h2 className="text-foreground font-semibold text-sm uppercase tracking-wider mb-2">Cookies</h2>
          <p>Financios gebruikt geen tracking- of advertentiecookies. PostHog gebruikt een anonieme sessie-identifier zonder persoonlijk identificeerbare gegevens.</p>
        </div>

        <div>
          <h2 className="text-foreground font-semibold text-sm uppercase tracking-wider mb-2">Jouw rechten (AVG/GDPR)</h2>
          <p>Je hebt het recht om inzage te vragen in de gegevens die we van je bewaren, deze te laten corrigeren of verwijderen. Stuur hiervoor een e-mail naar <a href="mailto:privacy@financios.nl" className="text-accent underline">privacy@financios.nl</a>. We reageren binnen 30 dagen.</p>
        </div>

        <div>
          <h2 className="text-foreground font-semibold text-sm uppercase tracking-wider mb-2">Bewaartermijnen</h2>
          <p>Aankoopgerelateerde gegevens (token + scangegevens): maximaal 1 jaar na aankoop. E-mailadressen (opt-in): totdat je je afmeldt of verwijdering aanvraagt.</p>
        </div>

        <div>
          <h2 className="text-foreground font-semibold text-sm uppercase tracking-wider mb-2">Wijzigingen</h2>
          <p>We kunnen dit privacybeleid bijwerken. De datum bovenaan geeft aan wanneer het voor het laatst is gewijzigd.</p>
        </div>

      </div>
    </main>
  );
}
