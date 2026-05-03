import Link from "next/link";

export const metadata = {
  title: "Cookiebeleid — Zenkai",
  description: "Hoe Zenkai cookies gebruikt op zenkai.nl en scan.zenkai.nl.",
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

export default function CookiesPage() {
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
            Cookiebeleid
          </h1>
          <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "12px", color: "rgba(15,14,14,0.35)" }}>
            Laatst bijgewerkt: mei 2026
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
          <Section title="Wat zijn cookies?">
            Cookies zijn kleine tekstbestanden die op uw apparaat worden opgeslagen wanneer u onze website bezoekt.
          </Section>

          <Section title="Welke cookies gebruiken we?">
            <p style={{ marginBottom: "16px" }}>
              <strong>Noodzakelijke cookies (altijd actief)</strong><br />
              Deze cookies zijn vereist voor het functioneren van de website en kunnen niet worden uitgeschakeld.
            </p>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'IBM Plex Mono',monospace", fontSize: "12px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(15,14,14,0.12)" }}>
                  <th style={{ textAlign: "left", padding: "8px 0", color: "#0F0E0E", fontWeight: 600 }}>Cookie</th>
                  <th style={{ textAlign: "left", padding: "8px 16px", color: "#0F0E0E", fontWeight: 600 }}>Doel</th>
                  <th style={{ textAlign: "left", padding: "8px 0", color: "#0F0E0E", fontWeight: 600 }}>Bewaartermijn</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "supabase-auth-token", goal: "Inlogstatus bijhouden", ttl: "Sessie" },
                  { name: "sb-access-token", goal: "API authenticatie", ttl: "1 uur" },
                  { name: "sb-refresh-token", goal: "Sessie verlenging", ttl: "7 dagen" },
                ].map((row) => (
                  <tr key={row.name} style={{ borderBottom: "1px solid rgba(15,14,14,0.06)" }}>
                    <td style={{ padding: "10px 0", color: "rgba(15,14,14,0.55)" }}>{row.name}</td>
                    <td style={{ padding: "10px 16px", color: "rgba(15,14,14,0.55)" }}>{row.goal}</td>
                    <td style={{ padding: "10px 0", color: "rgba(15,14,14,0.55)" }}>{row.ttl}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ marginTop: "20px" }}>
              <strong>Analytische cookies (optioneel)</strong><br />
              We gebruiken geen externe analytics tools die persoonsgegevens doorgeven aan derden.
            </p>
          </Section>

          <Section title="Hoe kunt u cookies beheren?">
            U kunt cookies uitschakelen via uw browserinstellingen. Let op: het uitschakelen van noodzakelijke cookies kan de werking van de website beïnvloeden.
          </Section>

          <Section title="Contact">
            Voor vragen over ons cookiebeleid:{" "}
            <a href="mailto:info@zenkai.nl" style={{ color: "#0284C7" }}>info@zenkai.nl</a>
          </Section>
        </div>

        <div style={{ marginTop: "64px", paddingTop: "24px", borderTop: "1px solid rgba(15,14,14,0.08)", display: "flex", gap: "24px" }}>
          <Link href="/terms" style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "rgba(15,14,14,0.4)", textDecoration: "none" }}>Voorwaarden</Link>
          <Link href="/privacy" style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "rgba(15,14,14,0.4)", textDecoration: "none" }}>Privacy</Link>
        </div>
      </main>
    </div>
  );
}
