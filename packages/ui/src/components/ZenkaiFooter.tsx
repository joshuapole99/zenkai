"use client";

function ZMark({ size = 20, color = "#F5F3EC" }: { size?: number; color?: string }) {
  return (
    <svg width={Math.round(size * 44 / 36)} height={size} viewBox="0 0 44 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="44" height="6" fill={color} />
      <polygon points="44,6 44,13 6,30 0,30 0,23 38,6" fill={color} />
      <rect x="0" y="30" width="44" height="6" fill={color} />
    </svg>
  );
}

const LINKS = [
  { label: "Scan",    href: "https://scan.zenkai.nl" },
  { label: "Goals",   href: "https://goals.zenkai.nl" },
  { label: "Job",     href: "https://job.zenkai.nl" },
  { label: "Workout", href: "https://workout.zenkai.nl" },
];

export function ZenkaiFooter() {
  return (
    <footer style={{
      background: "#0F0E0E",
      padding: "48px 32px 32px",
      fontFamily: "'IBM Plex Mono', monospace",
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{
          display: "flex", alignItems: "flex-start", justifyContent: "space-between",
          gap: "32px", flexWrap: "wrap",
          paddingBottom: "32px",
          borderBottom: "1px solid rgba(245,243,236,0.08)",
        }}>
          <a href="https://zenkai.nl" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <ZMark size={20} color="#F5F3EC" />
            <span style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: "16px", fontWeight: 700,
              color: "#F5F3EC", letterSpacing: "-0.02em",
            }}>Zenkai</span>
          </a>

          <nav style={{ display: "flex", gap: "24px", flexWrap: "wrap", alignItems: "center" }}>
            {LINKS.map(l => (
              <a key={l.label} href={l.href} style={{
                fontSize: "11px",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                textDecoration: "none",
                color: "rgba(245,243,236,0.35)",
                transition: "color 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "rgba(245,243,236,0.7)")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(245,243,236,0.35)")}
              >{l.label}</a>
            ))}
          </nav>
        </div>

        <div style={{
          paddingTop: "24px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          gap: "16px", flexWrap: "wrap",
        }}>
          <span style={{ fontSize: "11px", color: "rgba(245,243,236,0.2)", letterSpacing: "0.04em" }}>
            © 2026 ZENKAI PLATFORM — JOSHUA POLE
          </span>
          <div style={{ display: "flex", gap: "20px" }}>
            <a href="https://zenkai.nl/privacy" style={{ fontSize: "11px", color: "rgba(245,243,236,0.2)", textDecoration: "none" }}>Privacy</a>
            <a href="https://zenkai.nl/terms" style={{ fontSize: "11px", color: "rgba(245,243,236,0.2)", textDecoration: "none" }}>Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
