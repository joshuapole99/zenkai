import Link from "next/link";

export const metadata = {
  title: "Privacybeleid — Zenkai",
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
            Privacybeleid
          </h1>
          <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "12px", color: "rgba(15,14,14,0.35)" }}>
            Laatst bijgewerkt: mei 2026
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
          <Section title="1. Wie verwerkt uw gegevens?">
            Joshua Pole, handelend onder de naam Zenkai, gevestigd in Nederland. Contact:{" "}
            <a href="mailto:info@zenkai.nl" style={{ color: "#0284C7" }}>info@zenkai.nl</a>
          </Section>

          <Section title="2. Welke gegevens verzamelen we?">
            Bij registratie en gebruik:
            <ul style={{ paddingLeft: "20px", margin: "8px 0 12px" }}>
              <li style={{ marginBottom: "8px" }}>E-mailadres</li>
              <li style={{ marginBottom: "8px" }}>Ingevoerde domeinnamen</li>
              <li style={{ marginBottom: "8px" }}>Scanresultaten en rapporten</li>
              <li style={{ marginBottom: "8px" }}>Abonnementsgegevens (plan, startdatum)</li>
              <li>IP-adres en gebruikersgedrag (via analytics)</li>
            </ul>
            Via betalingen: betalingen worden verwerkt door Lemon Squeezy. Zenkai slaat geen betaalgegevens op.
          </Section>

          <Section title="3. Waarom verwerken we uw gegevens?">
            <ul style={{ paddingLeft: "20px", margin: "8px 0 0" }}>
              <li style={{ marginBottom: "8px" }}>Uitvoeren van de dienst (scans en rapporten)</li>
              <li style={{ marginBottom: "8px" }}>Beheer van uw account en abonnement</li>
              <li style={{ marginBottom: "8px" }}>Communicatie over uw account</li>
              <li style={{ marginBottom: "8px" }}>Voldoen aan wettelijke verplichtingen</li>
              <li>Verbetering van de dienst</li>
            </ul>
          </Section>

          <Section title="4. Hoe lang bewaren we uw gegevens?">
            <ul style={{ paddingLeft: "20px", margin: "8px 0 0" }}>
              <li style={{ marginBottom: "8px" }}>Scanresultaten: 30 dagen (Free), 1 jaar (Starter), onbeperkt (Pro/Enterprise)</li>
              <li style={{ marginBottom: "8px" }}>Accountgegevens: tot 30 dagen na opzegging</li>
              <li>Betalingshistorie: 7 jaar (wettelijke bewaarplicht)</li>
            </ul>
          </Section>

          <Section title="5. Delen we uw gegevens?">
            Zenkai deelt geen persoonsgegevens met derden, behalve:
            <ul style={{ paddingLeft: "20px", margin: "8px 0 0" }}>
              <li style={{ marginBottom: "8px" }}>Lemon Squeezy (betalingsverwerking)</li>
              <li style={{ marginBottom: "8px" }}>Resend (e-mailverzending)</li>
              <li>Supabase (database hosting)</li>
            </ul>
            <p style={{ marginTop: "12px" }}>Alle verwerkers zijn AVG-compliant en gevestigd in de EU of hebben passende waarborgen.</p>
          </Section>

          <Section title="6. Uw rechten">
            U heeft het recht op:
            <ul style={{ paddingLeft: "20px", margin: "8px 0 12px" }}>
              <li style={{ marginBottom: "8px" }}>Inzage in uw gegevens</li>
              <li style={{ marginBottom: "8px" }}>Correctie van onjuiste gegevens</li>
              <li style={{ marginBottom: "8px" }}>Verwijdering van uw gegevens</li>
              <li style={{ marginBottom: "8px" }}>Bezwaar tegen verwerking</li>
              <li>Dataportabiliteit</li>
            </ul>
            Verzoeken kunt u sturen naar{" "}
            <a href="mailto:info@zenkai.nl" style={{ color: "#0284C7" }}>info@zenkai.nl</a>. We reageren binnen 30 dagen.
          </Section>

          <Section title="7. Cookies">
            Zie ons{" "}
            <Link href="/cookies" style={{ color: "#0284C7" }}>cookiebeleid</Link>{" "}
            voor meer informatie over het gebruik van cookies.
          </Section>

          <Section title="8. Beveiliging">
            Zenkai beveiligt uw gegevens met encryptie, toegangsbeperking en regelmatige beveiligingscontroles.
          </Section>

          <Section title="9. Wijzigingen">
            Bij wijzigingen in dit privacybeleid ontvangt u een melding via email.
          </Section>

          <Section title="10. Klachten">
            Als u een klacht heeft over de verwerking van uw gegevens kunt u contact opnemen via{" "}
            <a href="mailto:info@zenkai.nl" style={{ color: "#0284C7" }}>info@zenkai.nl</a>{" "}
            of een klacht indienen bij de Autoriteit Persoonsgegevens (autoriteitpersoonsgegevens.nl).
          </Section>
        </div>

        <div style={{ marginTop: "64px", paddingTop: "24px", borderTop: "1px solid rgba(15,14,14,0.08)", display: "flex", gap: "24px" }}>
          <Link href="/terms" style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "rgba(15,14,14,0.4)", textDecoration: "none" }}>Voorwaarden</Link>
          <Link href="/cookies" style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "rgba(15,14,14,0.4)", textDecoration: "none" }}>Cookies</Link>
        </div>
      </main>
    </div>
  );
}
