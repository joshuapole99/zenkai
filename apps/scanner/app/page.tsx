"use client";

import React, { useState, useEffect } from "react";

function FontLoader() {
  useEffect(() => {
    if (document.querySelector("[data-sk-f]")) return;
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href =
      "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,300;1,9..144,700;1,9..144,900&family=IBM+Plex+Mono:wght@400;500;600&display=swap";
    l.setAttribute("data-sk-f", "");
    document.head.appendChild(l);
  }, []);
  return null;
}

const CHECKS = [
  { id: "shodan",   label: "Open ports",        desc: "Shodan scant alle open poorten en services op je domein.",           icon: "⬡" },
  { id: "hibp",     label: "Leaked credentials", desc: "Have I Been Pwned — zijn e-mails uit jouw domein gelekt?",          icon: "⬡" },
  { id: "mx",       label: "SPF / DMARC / DKIM", desc: "MXToolbox controleert e-mail security records volledig.",            icon: "⬡" },
  { id: "vt",       label: "Domain reputation",  desc: "VirusTotal — staat jouw domein op blacklists of malware-lijsten?",   icon: "⬡" },
  { id: "ssl",      label: "SSL / TLS health",   desc: "Certificaat geldigheid, TLS versie, HSTS configuratie.",             icon: "⬡" },
  { id: "headers",  label: "Security headers",   desc: "CSP, X-Frame-Options, HSTS, Referrer-Policy en meer.",               icon: "⬡" },
  { id: "owasp",    label: "OWASP indicators",   desc: "Top-10 kwetsbaarheidsindicatoren op basis van response analyse.",    icon: "⬡" },
];

const PRICING = [
  { tier: "Basic", price: "€29", desc: "Eénmalig rapport voor één domein.", items: ["Alle 7 checks", "PDF rapport", "Risk score 0-100", "Top 5 bevindingen", "Geldig 30 dagen"] },
  { tier: "Pro",   price: "€49", desc: "Uitgebreid rapport met prioriteitenlijst.", items: ["Alles in Basic", "Prioriteitenlijst per ernst", "Technische aanbevelingen", "Re-scan na 14 dagen", "E-mail ondersteuning"], highlight: true },
];

function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [domain, setDomain] = useState("");
  const [status, setStatus] = useState<"idle"|"loading"|"done"|"error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    await new Promise(r => setTimeout(r, 800));
    setStatus("done");
  }

  if (status === "done") {
    return (
      <div style={{ textAlign: "center", padding: "24px 0" }}>
        <p style={{ fontFamily: "'Fraunces',Georgia,serif", fontWeight: 700, fontSize: "1.4rem", color: "#0F0E0E", letterSpacing: "-0.02em", marginBottom: "8px" }}>
          Je staat op de lijst.
        </p>
        <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "12px", color: "rgba(15,14,14,0.45)" }}>
          We sturen je een e-mail zodra Scan live gaat.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "440px", margin: "0 auto" }}>
      <input
        type="text"
        value={domain}
        onChange={e => setDomain(e.target.value)}
        placeholder="jouwdomein.nl"
        style={{
          padding: "14px 16px", border: "1px solid rgba(15,14,14,0.18)",
          background: "rgba(15,14,14,0.03)", color: "#0F0E0E",
          fontFamily: "'IBM Plex Mono',monospace", fontSize: "14px",
          outline: "none", width: "100%",
        }}
      />
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="jouw@email.nl"
        required
        style={{
          padding: "14px 16px", border: "1px solid rgba(15,14,14,0.18)",
          background: "rgba(15,14,14,0.03)", color: "#0F0E0E",
          fontFamily: "'IBM Plex Mono',monospace", fontSize: "14px",
          outline: "none", width: "100%",
        }}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        style={{
          padding: "14px 28px", background: "#0284C7", color: "#fff",
          border: "none", cursor: "pointer",
          fontFamily: "'IBM Plex Mono',monospace", fontSize: "13px",
          fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase",
          opacity: status === "loading" ? 0.6 : 1,
        }}
      >
        {status === "loading" ? "Even geduld..." : "Noteer mij →"}
      </button>
      <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "rgba(15,14,14,0.38)", textAlign: "center" }}>
        Geen spam. Je krijgt alleen een e-mail als het live gaat.
      </p>
    </form>
  );
}

export default function ScanPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);

  return (
    <>
      <FontLoader />
      <style>{`
        @keyframes hf { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes scanPulse {
          0%,100% { opacity:0.4; }
          50%      { opacity:1; }
        }
        input::placeholder { color: rgba(15,14,14,0.35); }
        input:focus { border-color: #0284C7 !important; }
        @media (max-width:768px) {
          .check-grid  { grid-template-columns: 1fr !important; }
          .price-grid  { grid-template-columns: 1fr !important; }
          .hero-grid   { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <main style={{ minHeight: "100vh", background: "#F5F3EC", color: "#0F0E0E" }}>

        {/* ── NAV ── */}
        <nav style={{
          position: "sticky", top: 0, zIndex: 50,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 40px", height: "60px",
          background: "rgba(245,243,236,0.92)", backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(15,14,14,0.08)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <a href="https://zenkai.nl" style={{ fontFamily: "'Fraunces',Georgia,serif", fontWeight: 700, fontStyle: "italic", fontSize: "18px", letterSpacing: "-0.03em", color: "#0F0E0E", textDecoration: "none" }}>
              Zenkai
            </a>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "9px", color: "rgba(15,14,14,0.4)", letterSpacing: "0.15em" }}>/ SCAN</span>
          </div>
          <a
            href="#waitlist"
            style={{
              fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", fontWeight: 600,
              padding: "8px 18px", background: "#0284C7", color: "#fff",
              textDecoration: "none", letterSpacing: "0.05em", textTransform: "uppercase",
            }}
          >
            Noteer mij
          </a>
        </nav>

        {/* ── HERO ── */}
        <section style={{ padding: "100px 40px 80px", maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "10px", marginBottom: "28px",
            opacity: mounted ? 1 : 0, animation: mounted ? "hf .6s ease .05s both" : "none",
          }}>
            <div style={{
              width: "8px", height: "8px", borderRadius: "50%", background: "#0284C7",
              animation: "scanPulse 2s ease-in-out infinite",
            }} />
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", letterSpacing: "0.2em", color: "rgba(15,14,14,0.45)", textTransform: "uppercase" }}>
              Coming soon — scan.zenkai.nl
            </span>
          </div>

          <div style={{ opacity: mounted ? 1 : 0, animation: mounted ? "hf .75s ease .1s both" : "none" }}>
            <h1 style={{
              fontFamily: "'Fraunces',Georgia,serif", fontWeight: 900,
              fontSize: "clamp(3rem, 8vw, 7rem)", lineHeight: 0.92,
              letterSpacing: "-0.04em", color: "#0F0E0E", margin: "0 0 8px",
            }}>
              Scan.
            </h1>
            <h2 style={{
              fontFamily: "'Fraunces',Georgia,serif", fontWeight: 300, fontStyle: "italic",
              fontSize: "clamp(3rem, 8vw, 7rem)", lineHeight: 0.92,
              letterSpacing: "-0.04em", color: "rgba(15,14,14,0.3)", margin: "0 0 40px",
            }}>
              Ken jouw aanvalsvlak.
            </h2>
          </div>

          <div
            className="hero-grid"
            style={{
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "start",
              opacity: mounted ? 1 : 0, animation: mounted ? "hf .7s ease .25s both" : "none",
            }}
          >
            <div>
              <p style={{ fontSize: "17px", color: "rgba(15,14,14,0.55)", lineHeight: 1.78, marginBottom: "32px" }}>
                Vul een domeinnaam in. Betaal eenmalig. Ontvang binnen minuten een professioneel PDF rapport — inclusief risk score, top bevindingen, en een prioriteitenlijst in plain Nederlands.
              </p>
              <p style={{ fontSize: "15px", color: "rgba(15,14,14,0.4)", lineHeight: 1.7, marginBottom: "32px" }}>
                Gebouwd door een OSCP-gecertificeerde security analyst. Dezelfde checks die ik handmatig deed voor klanten — nu volledig geautomatiseerd.
              </p>
              <div style={{ display: "flex", gap: "24px" }}>
                <div>
                  <p style={{ fontFamily: "'Fraunces',Georgia,serif", fontWeight: 700, fontSize: "2rem", letterSpacing: "-0.03em", color: "#0F0E0E", margin: 0 }}>7</p>
                  <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10px", color: "rgba(15,14,14,0.35)", letterSpacing: "0.1em", textTransform: "uppercase", margin: "4px 0 0" }}>Checks</p>
                </div>
                <div style={{ borderLeft: "1px solid rgba(15,14,14,0.1)", paddingLeft: "24px" }}>
                  <p style={{ fontFamily: "'Fraunces',Georgia,serif", fontWeight: 700, fontSize: "2rem", letterSpacing: "-0.03em", color: "#0F0E0E", margin: 0 }}>€29</p>
                  <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10px", color: "rgba(15,14,14,0.35)", letterSpacing: "0.1em", textTransform: "uppercase", margin: "4px 0 0" }}>Vanaf</p>
                </div>
                <div style={{ borderLeft: "1px solid rgba(15,14,14,0.1)", paddingLeft: "24px" }}>
                  <p style={{ fontFamily: "'Fraunces',Georgia,serif", fontWeight: 700, fontSize: "2rem", letterSpacing: "-0.03em", color: "#0F0E0E", margin: 0 }}>PDF</p>
                  <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10px", color: "rgba(15,14,14,0.35)", letterSpacing: "0.1em", textTransform: "uppercase", margin: "4px 0 0" }}>Output</p>
                </div>
              </div>
            </div>

            {/* Fake terminal preview */}
            <div style={{ background: "#0F0E0E", padding: "28px", border: "1px solid rgba(15,14,14,0.15)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                {["#C2410C","#B45309","#15803D"].map(c => (
                  <div key={c} style={{ width: "10px", height: "10px", borderRadius: "50%", background: c }} />
                ))}
                <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "rgba(245,243,236,0.3)", marginLeft: "8px" }}>
                  scan — jouwdomein.nl
                </span>
              </div>
              {[
                { label: "SHODAN",  val: "3 open ports found",         ok: false },
                { label: "HIBP",    val: "0 breaches detected",        ok: true  },
                { label: "SPF",     val: "Record missing",             ok: false },
                { label: "DMARC",   val: "p=none (weak)",              ok: false },
                { label: "SSL",     val: "Valid — TLS 1.3",            ok: true  },
                { label: "HEADERS", val: "CSP missing",                ok: false },
                { label: "SCORE",   val: "42 / 100 — Medium risk",     ok: null  },
              ].map((row, i) => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: i < 6 ? "1px solid rgba(245,243,236,0.05)" : "none" }}>
                  <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "rgba(245,243,236,0.35)", letterSpacing: "0.1em" }}>
                    {row.label}
                  </span>
                  <span style={{
                    fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", fontWeight: 500,
                    color: row.ok === null ? "#F59E0B" : row.ok ? "#15803D" : "#C2410C",
                  }}>
                    {row.val}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHAT IT CHECKS ── */}
        <section style={{ padding: "80px 40px", borderTop: "1px solid rgba(15,14,14,0.08)", maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingBottom: "20px", borderBottom: "2px solid #0F0E0E", marginBottom: "0" }}>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", fontWeight: 600, letterSpacing: "0.2em", color: "rgba(15,14,14,0.4)", textTransform: "uppercase" }}>
              Wat wordt gecheckt
            </span>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "rgba(15,14,14,0.3)" }}>
              07 checks
            </span>
          </div>
          <div className="check-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "rgba(15,14,14,0.08)", marginTop: "1px" }}>
            {CHECKS.map((c, i) => (
              <div key={c.id} style={{ padding: "28px 32px", background: "#F5F3EC" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10px", fontWeight: 600, letterSpacing: "0.15em", color: "#0284C7", textTransform: "uppercase" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 style={{ fontFamily: "'Fraunces',Georgia,serif", fontWeight: 700, fontSize: "1.3rem", letterSpacing: "-0.025em", color: "#0F0E0E", margin: "0 0 10px" }}>
                  {c.label}
                </h3>
                <p style={{ fontSize: "14px", color: "rgba(15,14,14,0.5)", lineHeight: 1.65, margin: 0 }}>
                  {c.desc}
                </p>
              </div>
            ))}
            {/* Empty fill cell for odd count */}
            <div style={{ padding: "28px 32px", background: "#F5F3EC", display: "flex", alignItems: "center" }}>
              <p style={{ fontFamily: "'Fraunces',Georgia,serif", fontWeight: 300, fontStyle: "italic", fontSize: "1.1rem", color: "rgba(15,14,14,0.25)", margin: 0 }}>
                Alles in één PDF rapport, in plain Nederlands.
              </p>
            </div>
          </div>
        </section>

        {/* ── PRICING ── */}
        <section style={{ padding: "80px 40px 100px", maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ marginBottom: "48px" }}>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", fontWeight: 600, letterSpacing: "0.2em", color: "rgba(15,14,14,0.35)", textTransform: "uppercase", display: "block", marginBottom: "12px" }}>
              Prijs
            </span>
            <h2 style={{ fontFamily: "'Fraunces',Georgia,serif", fontWeight: 900, fontSize: "clamp(2rem,4vw,3.5rem)", letterSpacing: "-0.04em", lineHeight: 0.95, color: "#0F0E0E", margin: 0 }}>
              Eénmalig betalen.
              <br />
              <em style={{ fontWeight: 300, fontStyle: "italic" }}>Geen abonnement.</em>
            </h2>
          </div>
          <div className="price-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px", background: "rgba(15,14,14,0.08)", maxWidth: "700px" }}>
            {PRICING.map(p => (
              <div
                key={p.tier}
                style={{
                  padding: "36px 32px",
                  background: p.highlight ? "#0F0E0E" : "#F5F3EC",
                  color: p.highlight ? "#F5F3EC" : "#0F0E0E",
                  position: "relative",
                }}
              >
                {p.highlight && (
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "#0284C7" }} />
                )}
                <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: p.highlight ? "rgba(245,243,236,0.4)" : "rgba(15,14,14,0.4)", display: "block", marginBottom: "16px" }}>
                  {p.tier}
                </span>
                <p style={{ fontFamily: "'Fraunces',Georgia,serif", fontWeight: 900, fontSize: "3rem", letterSpacing: "-0.04em", margin: "0 0 4px", color: p.highlight ? "#F5F3EC" : "#0F0E0E" }}>
                  {p.price}
                </p>
                <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: p.highlight ? "rgba(245,243,236,0.4)" : "rgba(15,14,14,0.4)", marginBottom: "24px" }}>
                  {p.desc}
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexDirection: "column", gap: "10px" }}>
                  {p.items.map(item => (
                    <li key={item} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: p.highlight ? "rgba(245,243,236,0.75)" : "rgba(15,14,14,0.65)" }}>
                      <span style={{ color: p.highlight ? "#0284C7" : "#15803D", fontWeight: 700, fontSize: "14px" }}>—</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <a
                  href="#waitlist"
                  style={{
                    display: "block", textAlign: "center",
                    padding: "13px 24px",
                    background: p.highlight ? "#0284C7" : "transparent",
                    border: p.highlight ? "none" : "1px solid rgba(15,14,14,0.2)",
                    color: p.highlight ? "#fff" : "#0F0E0E",
                    fontFamily: "'IBM Plex Mono',monospace", fontSize: "12px",
                    fontWeight: 600, letterSpacing: "0.06em",
                    textDecoration: "none", textTransform: "uppercase",
                  }}
                >
                  Noteer mij →
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* ── WAITLIST ── */}
        <section id="waitlist" style={{ background: "#0F0E0E", padding: "100px 40px" }}>
          <div style={{ maxWidth: "560px", margin: "0 auto", textAlign: "center" }}>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", letterSpacing: "0.2em", color: "rgba(245,243,236,0.3)", textTransform: "uppercase", display: "block", marginBottom: "20px" }}>
              Wachtlijst
            </span>
            <h2 style={{ fontFamily: "'Fraunces',Georgia,serif", fontWeight: 900, fontSize: "clamp(2.2rem,5vw,4rem)", letterSpacing: "-0.04em", lineHeight: 0.93, color: "#F5F3EC", margin: "0 0 16px" }}>
              Scan
              <br />
              <em style={{ fontWeight: 300, color: "rgba(245,243,236,0.38)" }}>lanceert binnenkort.</em>
            </h2>
            <p style={{ fontSize: "15px", color: "rgba(245,243,236,0.45)", lineHeight: 1.75, marginBottom: "40px" }}>
              Vul je e-mail in en je domein (optioneel). Je krijgt als eerste toegang en een korting bij lancering.
            </p>
            {/* Waitlist form on dark bg — override input styles */}
            <style>{`
              .wl-form input {
                background: rgba(245,243,236,0.05) !important;
                border-color: rgba(245,243,236,0.15) !important;
                color: #F5F3EC !important;
              }
              .wl-form input::placeholder { color: rgba(245,243,236,0.3) !important; }
              .wl-form input:focus { border-color: #0284C7 !important; }
            `}</style>
            <div className="wl-form">
              <WaitlistForm />
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ borderTop: "2px solid #0F0E0E", padding: "32px 40px" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <a href="https://zenkai.nl" style={{ fontFamily: "'Fraunces',Georgia,serif", fontWeight: 700, fontStyle: "italic", fontSize: "18px", letterSpacing: "-0.03em", color: "#0F0E0E", textDecoration: "none" }}>Zenkai</a>
              <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10px", color: "rgba(15,14,14,0.3)" }}>/ Scan</span>
            </div>
            <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "rgba(15,14,14,0.25)" }}>
              © 2026 Zenkai — Gebouwd door een OSCP-gecertificeerde analyst.
            </p>
            <a href="https://zenkai.nl" style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "rgba(15,14,14,0.35)", textDecoration: "none" }}>
              ← Terug naar platform
            </a>
          </div>
        </footer>
      </main>
    </>
  );
}
