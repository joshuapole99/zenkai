import Link from "next/link";

export const metadata = {
  title: "Algemene Voorwaarden — Zenkai",
  description: "Gebruiksvoorwaarden voor het Zenkai security platform.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 style={{
        fontFamily: "'Fraunces',Georgia,serif", fontWeight: 700,
        fontSize: "1.25rem", letterSpacing: "-0.02em",
        color: "#0F0E0E", margin: "0 0 12px",
      }}>
        {title}
      </h2>
      <div style={{ fontSize: "14px", color: "rgba(15,14,14,0.55)", lineHeight: 1.8 }}>
        {children}
      </div>
    </div>
  );
}

export default function TermsPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#ffffff", color: "#0F0E0E" }}>
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 40px", height: "60px",
        borderBottom: "1px solid rgba(15,14,14,0.08)",
      }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <img src="/zenkai-logo.jpg" alt="Zenkai" style={{ height: "36px", width: "auto", display: "block", mixBlendMode: "multiply" }} />
        </Link>
        <Link href="/" style={{
          fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px",
          color: "rgba(15,14,14,0.4)", textDecoration: "none",
          letterSpacing: "0.04em",
        }}>
          ← Terug
        </Link>
      </header>

      <main style={{ maxWidth: "680px", margin: "0 auto", padding: "64px 40px 100px" }}>
        <div style={{ marginBottom: "48px" }}>
          <span style={{
            fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px",
            letterSpacing: "0.2em", color: "rgba(15,14,14,0.35)",
            textTransform: "uppercase", display: "block", marginBottom: "16px",
          }}>
            Legal
          </span>
          <h1 style={{
            fontFamily: "'Fraunces',Georgia,serif", fontWeight: 900,
            fontSize: "clamp(2rem,5vw,3.5rem)", letterSpacing: "-0.04em",
            lineHeight: 0.95, color: "#0F0E0E", margin: "0 0 16px",
          }}>
            Algemene Voorwaarden
          </h1>
          <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "12px", color: "rgba(15,14,14,0.35)" }}>
            Laatst bijgewerkt: mei 2026
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
          <Section title="1. Over Zenkai">
            Zenkai (<strong>scan.zenkai.nl</strong> en <strong>zenkai.nl</strong>) is een geautomatiseerd beveiligingsplatform aangeboden door Joshua Pole, gevestigd in Nederland. Zenkai biedt geautomatiseerde beveiligingsscans van domeinen en bijbehorende PDF rapporten.
          </Section>

          <Section title="2. Toestemming voor gebruik">
            Door gebruik te maken van Zenkai bevestigt u dat:
            <ul style={{ paddingLeft: "20px", margin: "8px 0 0" }}>
              <li style={{ marginBottom: "8px" }}>U de rechtmatige eigenaar bent van het domein dat u scant, of</li>
              <li>U aantoonbare schriftelijke toestemming heeft van de eigenaar om een beveiligingsscan uit te voeren</li>
            </ul>
            <p style={{ marginTop: "12px" }}>
              Het scannen van domeinen zonder toestemming is verboden en strafbaar onder de Wet Computercriminaliteit (artikel 138ab Wetboek van Strafrecht). Zenkai is niet aansprakelijk voor misbruik van het platform door gebruikers.
            </p>
          </Section>

          <Section title="3. Wat Zenkai doet en niet doet">
            Zenkai voert geautomatiseerde scans uit. Dit is geen handmatige penetratietest. De resultaten zijn indicatief en vormen geen volledig beveiligingsadvies. Zenkai garandeert niet dat alle kwetsbaarheden worden gevonden.
          </Section>

          <Section title="4. Abonnementen en betalingen">
            <ul style={{ paddingLeft: "20px", margin: "8px 0 0" }}>
              <li style={{ marginBottom: "8px" }}>Abonnementen worden maandelijks gefactureerd via Lemon Squeezy</li>
              <li style={{ marginBottom: "8px" }}>Opzegging is mogelijk via uw account dashboard</li>
              <li style={{ marginBottom: "8px" }}>Bij opzegging blijft uw abonnement actief tot het einde van de betaalperiode</li>
              <li>Restitutie wordt niet verleend tenzij wettelijk verplicht</li>
            </ul>
          </Section>

          <Section title="5. Aansprakelijkheidsbeperking">
            Zenkai is niet aansprakelijk voor schade die voortvloeit uit het gebruik van de scanresultaten. De gebruiker is zelf verantwoordelijk voor het nemen van beveiligingsmaatregelen op basis van de rapportage.
          </Section>

          <Section title="6. Fair use">
            Het is niet toegestaan Zenkai te gebruiken voor:
            <ul style={{ paddingLeft: "20px", margin: "8px 0 0" }}>
              <li style={{ marginBottom: "8px" }}>Het scannen van domeinen zonder toestemming</li>
              <li style={{ marginBottom: "8px" }}>Geautomatiseerd of bulk scannen via scripts of bots</li>
              <li>Het doorverkopen van scanresultaten zonder schriftelijke toestemming van Zenkai</li>
            </ul>
          </Section>

          <Section title="7. Wijzigingen">
            Zenkai behoudt het recht deze voorwaarden te wijzigen. Wijzigingen worden minimaal 14 dagen van tevoren gecommuniceerd via email.
          </Section>

          <Section title="8. Contact">
            Voor vragen over deze voorwaarden:{" "}
            <a href="mailto:info@zenkai.nl" style={{ color: "#0284C7" }}>info@zenkai.nl</a>
          </Section>
        </div>

        <div style={{ marginTop: "64px", paddingTop: "24px", borderTop: "1px solid rgba(15,14,14,0.08)", display: "flex", gap: "24px" }}>
          <Link href="/privacy" style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "rgba(15,14,14,0.4)", textDecoration: "none" }}>Privacy</Link>
          <Link href="/cookies" style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "rgba(15,14,14,0.4)", textDecoration: "none" }}>Cookies</Link>
        </div>
      </main>
    </div>
  );
}
