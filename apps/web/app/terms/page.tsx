import Link from "next/link";

export const metadata = {
  title: "Terms of Service — Zenkai",
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
            Terms of Service
          </h1>
          <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "12px", color: "rgba(15,14,14,0.35)" }}>
            Laatst bijgewerkt: april 2026
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
          <Section title="1. Acceptatie van voorwaarden">
            Door Zenkai te gebruiken ga je akkoord met deze voorwaarden. Gebruik Zenkai niet als je het niet eens bent met deze voorwaarden. Deze voorwaarden gelden voor alle gebruikers van het platform.
          </Section>

          <Section title="2. Beschrijving van de dienst">
            Zenkai (<strong>zenkai.nl</strong>) is een security platform dat geautomatiseerde domein security audits uitvoert via <strong>scan.zenkai.nl</strong>. De scanner analyseert domeinen op kwetsbaarheden, misconfiguraties en security risico&apos;s en genereert rapporten voor de gebruiker.
          </Section>

          <Section title="3. Toegestaan gebruik — BELANGRIJK">
            <strong>Je mag Zenkai Scanner uitsluitend gebruiken op:</strong>
            <ul style={{ paddingLeft: "20px", margin: "8px 0 12px" }}>
              {[
                "Domeinen die je zelf eigenaar van bent.",
                "Domeinen waarvoor je expliciete schriftelijke toestemming hebt van de eigenaar.",
                "Domeinen die specifiek zijn aangewezen als testomgeving (bijv. pentest engagement scope).",
              ].map((item) => (
                <li key={item} style={{ marginBottom: "8px" }}>{item}</li>
              ))}
            </ul>
            <strong>Het is verboden om Zenkai te gebruiken voor:</strong>
            <ul style={{ paddingLeft: "20px", margin: "8px 0 0" }}>
              {[
                "Het scannen van domeinen zonder toestemming van de eigenaar.",
                "Aanvallen op systemen of het verstoren van diensten.",
                "Illegale activiteiten of het omzeilen van beveiligingsmaatregelen.",
                "Misbruik van gevonden kwetsbaarheden voor ongeautoriseerde toegang.",
              ].map((item) => (
                <li key={item} style={{ marginBottom: "8px" }}>{item}</li>
              ))}
            </ul>
          </Section>

          <Section title="4. Verantwoordelijkheid gebruiker">
            Jij bent volledig verantwoordelijk voor het rechtmatig gebruik van de scanner. Zenkai is niet aansprakelijk voor schade voortvloeiend uit ongeautoriseerd gebruik. Bij vermoeden van misbruik behoudt Zenkai het recht accounts onmiddellijk te blokkeren en aangifte te doen.
          </Section>

          <Section title="5. Abonnementen en betaling">
            Betaling verloopt via Lemon Squeezy. Abonnementen worden maandelijks verlengd tenzij je opzegt. Opzeggen kan op elk moment via je accountinstellingen, waarna het abonnement loopt tot het einde van de betaalperiode. Restitutie is mogelijk binnen 14 dagen na aankoop als de scanner niet naar behoren werkt.
          </Section>

          <Section title="6. Beschikbaarheid">
            We streven naar maximale uptime maar bieden geen garantie. Gepland onderhoud wordt zo mogelijk vooraf gecommuniceerd via hi@zenkai.nl. Bij storingen van de VPS-backend kunnen scans tijdelijk niet beschikbaar zijn.
          </Section>

          <Section title="7. Intellectueel eigendom">
            Alle code, rapporten en content op Zenkai zijn eigendom van Joshua Pole / Zenkai. Rapporten die je ontvangt via de scanner mag je gebruiken voor eigen beveiligingsdoeleinden. Doorverkoop of publicatie van rapporten zonder toestemming is niet toegestaan.
          </Section>

          <Section title="8. Disclaimer">
            Zenkai Scanner is een geautomatiseerde tool en is <strong>geen vervanging voor een professionele penetratietest</strong>. De tool kan false positives en false negatives produceren. Bevindingen dienen altijd handmatig te worden geverifieerd. Zenkai is niet aansprakelijk voor schade door het handelen op basis van scanresultaten zonder verificatie.
          </Section>

          <Section title="9. Wijzigingen">
            We behouden het recht deze voorwaarden te wijzigen. Wijzigingen worden gecommuniceerd via e-mail of via een melding op de website. Voortgezet gebruik na wijziging geldt als acceptatie.
          </Section>

          <Section title="10. Contact">
            Vragen over deze voorwaarden? Mail naar <a href="mailto:hi@zenkai.nl" style={{ color: "#0284C7" }}>hi@zenkai.nl</a>
          </Section>
        </div>
      </main>
    </div>
  );
}
