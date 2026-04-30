import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — Zenkai",
  description: "Hoe Zenkai jouw gegevens verzamelt, gebruikt en beschermt.",
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

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "12px", color: "rgba(15,14,14,0.35)" }}>
            Laatst bijgewerkt: april 2026
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
          <Section title="1. Wie zijn wij">
            Zenkai is een security platform ontwikkeld door Joshua Pole (security analyst, OSCP). Het platform omvat <strong>scan.zenkai.nl</strong> — een geautomatiseerde domeinscanner voor security audits. Zenkai is een eenmanszaak gevestigd in Nederland. Contact: <a href="mailto:hi@zenkai.nl" style={{ color: "#0284C7" }}>hi@zenkai.nl</a>
          </Section>

          <Section title="2. Welke gegevens verzamelen we">
            <ul style={{ paddingLeft: "20px", margin: "8px 0 0" }}>
              {[
                "E-mailadres — gebruikt voor accountbeheer en het versturen van PDF rapporten.",
                "Domeinnaam bij een scan — het domein dat je opgeeft voor analyse.",
                "Scanresultaten — technische bevindingen van het opgegeven domein, opgeslagen voor rapportage.",
                "Betaalgegevens — verwerkt via Lemon Squeezy. Zenkai slaat geen betaaldata op.",
                "IP-adres — gelogd voor beveiligingsdoeleinden en misbruikpreventie.",
              ].map((item) => (
                <li key={item} style={{ marginBottom: "8px" }}>{item}</li>
              ))}
            </ul>
          </Section>

          <Section title="3. Hoe we gegevens gebruiken">
            Wij gebruiken jouw gegevens uitsluitend voor:
            <ul style={{ paddingLeft: "20px", margin: "8px 0 0" }}>
              {[
                "Het uitvoeren van gevraagde security scans.",
                "Het genereren en versturen van PDF rapporten per e-mail.",
                "Accountbeheer en authenticatie.",
                "Facturering via Lemon Squeezy.",
                "Misbruikdetectie en rate limiting.",
              ].map((item) => (
                <li key={item} style={{ marginBottom: "8px" }}>{item}</li>
              ))}
            </ul>
            We verkopen of delen jouw gegevens nooit met derden voor marketingdoeleinden.
          </Section>

          <Section title="4. Scanresultaten en doeldomeinen">
            De scanner analyseert uitsluitend domeinen die jij opgeeft. Door een scan te starten verklaar je dat je <strong>eigenaar bent van het domein</strong> of <strong>expliciete toestemming hebt</strong> van de eigenaar. Scanresultaten worden maximaal 30 dagen opgeslagen (Starter), 1 jaar (Pro) of onbeperkt (Enterprise).
          </Section>

          <Section title="5. Derden">
            Zenkai maakt gebruik van de volgende externe diensten:
            <ul style={{ paddingLeft: "20px", margin: "8px 0 0" }}>
              {[
                "Supabase — database en authenticatie (EU servers).",
                "Vercel — hosting van de webapplicatie.",
                "Lemon Squeezy — betalingsverwerking.",
                "Resend — e-mailverzending van rapporten.",
                "Shodan, urlscan.io — externe threat intelligence (geanonimiseerde queries).",
              ].map((item) => (
                <li key={item} style={{ marginBottom: "8px" }}>{item}</li>
              ))}
            </ul>
          </Section>

          <Section title="6. Jouw rechten (AVG/GDPR)">
            Als EU-inwoner heb je het recht op inzage, correctie, verwijdering en bezwaar. Stuur een verzoek naar <a href="mailto:hi@zenkai.nl" style={{ color: "#0284C7" }}>hi@zenkai.nl</a>. We reageren binnen 30 dagen.
          </Section>

          <Section title="7. Cookies">
            Zenkai gebruikt alleen functionele cookies (sessie, authenticatie). Er worden geen tracking- of advertentiecookies geplaatst.
          </Section>

          <Section title="8. Beveiliging">
            Alle verbindingen zijn versleuteld via HTTPS/TLS. Wachtwoorden worden gehasht opgeslagen via Supabase Auth. Scanresultaten zijn alleen toegankelijk voor de accounteigenaar.
          </Section>

          <Section title="9. Contact">
            Vragen over privacy? Mail naar <a href="mailto:hi@zenkai.nl" style={{ color: "#0284C7" }}>hi@zenkai.nl</a> of schrijf naar: Zenkai, Nederland.
          </Section>
        </div>
      </main>
    </div>
  );
}
