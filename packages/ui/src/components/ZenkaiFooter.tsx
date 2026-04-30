"use client";

export function ZenkaiFooter() {
  return (
    <footer style={{
      background: "#0F0E0E",
      padding: "40px 32px 28px",
      fontFamily: "'IBM Plex Mono', monospace",
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: "24px", flexWrap: "wrap",
          paddingBottom: "24px",
          borderBottom: "1px solid rgba(245,243,236,0.08)",
        }}>
          <a href="https://zenkai.nl" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <img
              src="/zenkai-logo.jpg"
              alt="Zenkai"
              style={{ height: "36px", width: "auto", display: "block", filter: "invert(1)" }}
            />
          </a>

          <nav style={{ display: "flex", gap: "24px", flexWrap: "wrap", alignItems: "center" }}>
            {[
              { label: "Scan",    href: "https://scan.zenkai.nl" },
              { label: "Prijzen", href: "https://zenkai.nl/#pricing" },
              { label: "Privacy", href: "https://zenkai.nl/privacy" },
              { label: "Terms",   href: "https://zenkai.nl/terms" },
            ].map(l => (
              <a key={l.label} href={l.href} style={{
                fontSize: "11px",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                textDecoration: "none",
                color: "rgba(245,243,236,0.3)",
                transition: "color 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "rgba(245,243,236,0.7)")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(245,243,236,0.3)")}
              >{l.label}</a>
            ))}
          </nav>
        </div>

        <div style={{ paddingTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "11px", color: "rgba(245,243,236,0.18)", letterSpacing: "0.04em" }}>
            © 2026 ZENKAI SECURITY PLATFORM — JOSHUA POLE
          </span>
          <a href="mailto:hi@zenkai.nl" style={{ fontSize: "11px", color: "rgba(245,243,236,0.18)", textDecoration: "none" }}>
            hi@zenkai.nl
          </a>
        </div>
      </div>
    </footer>
  );
}
