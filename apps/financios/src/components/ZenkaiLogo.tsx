export function ZenkaiLogo() {
  return (
    <a
      href="https://zenkai.nl"
      style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", color: "inherit" }}
    >
      <svg width="22" height="18" viewBox="0 0 44 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="44" height="6" fill="currentColor" />
        <polygon points="44,6 44,13 6,30 0,30 0,23 38,6" fill="currentColor" />
        <rect x="0" y="30" width="44" height="6" fill="currentColor" />
      </svg>
      <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "16px", fontWeight: 700, letterSpacing: "-0.02em" }}>
        Zenkai <span style={{ fontWeight: 300 }}>Goals</span>
      </span>
    </a>
  );
}
