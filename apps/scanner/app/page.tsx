"use client";

import React, { useState, useEffect } from "react";

function FontLoader() {
  useEffect(() => {
    if (document.querySelector("[data-sk-f]")) return;
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href =
      "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,300&family=IBM+Plex+Mono:wght@400;500;600&display=swap";
    l.setAttribute("data-sk-f", "");
    document.head.appendChild(l);
  }, []);
  return null;
}

function LemonLoader() {
  useEffect(() => {
    if (document.querySelector("[data-ls]")) return;
    const s = document.createElement("script");
    s.src = "https://app.lemonsqueezy.com/js/lemon.js";
    s.defer = true;
    s.setAttribute("data-ls", "");
    document.head.appendChild(s);
  }, []);
  return null;
}

const MODULES = [
  { id: "headers",  label: "Security headers",    desc: "CSP, HSTS, X-Frame-Options, Referrer-Policy — 8 headers gecontroleerd." },
  { id: "ssl",      label: "SSL / TLS",            desc: "Certificaat geldigheid, TLS versie, cipher suites (sslyze)." },
  { id: "dns",      label: "SPF / DMARC",          desc: "E-mail authenticatie records — spoofing preventie check." },
  { id: "nmap",     label: "Poortscan",            desc: "Open TCP + UDP poorten, services en versies (nmap)." },
  { id: "gobuster", label: "Directory enum",       desc: "Verborgen paden en bestanden (gobuster + SecLists)." },
  { id: "nikto",    label: "Nikto baseline",       desc: "OWASP Top 10 indicatoren, XSS, CORS, misconfiguraties." },
  { id: "whatweb",  label: "Tech fingerprint",     desc: "CMS, server, frameworks en versie-informatie (whatweb)." },
  { id: "urlscan",  label: "URL reputatie",        desc: "Malware, phishing en blacklist check (urlscan.io)." },
  { id: "zap",      label: "ZAP baseline",         desc: "Passieve web crawl en kwetsbaarheidsdetectie (OWASP ZAP)." },
];

const PRICING = [
  {
    name: "Free",
    price: "€0",
    period: "",
    desc: "Eenmalige check — geen account nodig.",
    features: ["1 scan per maand", "6 basis checks", "Serverless", "Headers, DNS, SSL"],
    cta: "Start gratis",
    href: "/scan",
    lemon: false,
    highlight: false,
  },
  {
    name: "Starter",
    price: "€19",
    period: "/mnd",
    desc: "Voor freelancers en kleine bedrijven.",
    features: ["3 scans per maand", "Quick Scan — 9 modules", "PDF rapport per email", "Nmap, Nikto, ZAP, urlscan"],
    cta: "Start nu",
    href: "https://zenkai-security.lemonsqueezy.com/checkout/buy/2a68308b-f0e9-4719-b85e-d36f5cad8c32",
    lemon: true,
    highlight: false,
  },
  {
    name: "Pro",
    price: "€49",
    period: "/mnd",
    desc: "Voor security professionals.",
    features: ["Onbeperkt scans", "Full Scan — 11 modules", "JSON output + API", "Shodan, feroxbuster, SSLyze", "Prioriteit support"],
    cta: "Kies Pro",
    href: "https://zenkai-security.lemonsqueezy.com/checkout/buy/bb6a90f2-1fb9-41ff-9048-c0a694c13ab8",
    lemon: true,
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Op aanvraag",
    period: "",
    desc: "Voor organisaties met compliance-eisen.",
    features: ["IP-range scanning", "SQLMap integratie", "Custom rapport", "Dedicated support", "SLA + NDA"],
    cta: "Contact",
    href: "mailto:joshuapole@live.nl",
    lemon: false,
    highlight: false,
  },
];

export default function ScanLanding() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);

  return (
    <>
      <FontLoader />
      <LemonLoader />
      <style>{`
        @keyframes hf { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes scanPulse { 0%,100% { opacity:0.5; } 50% { opacity:1; } }
        @media (max-width:768px) {
          .sk-hero-grid  { grid-template-columns: 1fr !important; }
          .sk-check-grid { grid-template-columns: 1fr !important; }
          .sk-price-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width:560px) {
          .sk-price-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{ background: "#ffffff", color: "#0F0E0E" }}>

        {/* ── HERO ── */}
        <section style={{ padding: "80px 40px 80px", maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "10px", marginBottom: "28px",
            opacity: mounted ? 1 : 0, animation: mounted ? "hf .6s ease .05s both" : "none",
          }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#16A34A", animation: "scanPulse 2s ease-in-out infinite" }} />
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", letterSpacing: "0.2em", color: "#16A34A", textTransform: "uppercase" }}>
              Live — scan.zenkai.nl
            </span>
          </div>

          <div style={{ opacity: mounted ? 1 : 0, animation: mounted ? "hf .75s ease .1s both" : "none" }}>
            <h1 style={{
              fontFamily: "'Fraunces',Georgia,serif", fontWeight: 900,
              fontSize: "clamp(3rem, 8vw, 7.5rem)", lineHeight: 0.9,
              letterSpacing: "-0.04em", color: "#0F0E0E", margin: "0 0 6px",
            }}>
              Ken jouw
            </h1>
            <h1 style={{
              fontFamily: "'Fraunces',Georgia,serif", fontWeight: 300, fontStyle: "italic",
              fontSize: "clamp(3rem, 8vw, 7.5rem)", lineHeight: 0.9,
              letterSpacing: "-0.04em", color: "rgba(15,14,14,0.28)", margin: "0 0 48px",
            }}>
              aanvalsvlak.
            </h1>
          </div>

          <div
            className="sk-hero-grid"
            style={{
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "start",
              opacity: mounted ? 1 : 0, animation: mounted ? "hf .7s ease .25s both" : "none",
            }}
          >
            <div>
              <p style={{ fontSize: "17px", color: "rgba(15,14,14,0.55)", lineHeight: 1.78, marginBottom: "24px" }}>
                Vul een domeinnaam in. Ontvang binnen minuten een professioneel beveiligingsrapport — inclusief risk score, bevindingen en aanbevelingen.
              </p>
              <p style={{ fontSize: "15px", color: "rgba(15,14,14,0.38)", lineHeight: 1.7, marginBottom: "36px" }}>
                Gebouwd door een OSCP-gecertificeerde analyst. 9 modules bij Quick Scan, 11 bij Full Scan. PDF per email inbegrepen.
              </p>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <a href="/scan" style={{
                  padding: "14px 28px", background: "#0284C7", color: "#ffffff",
                  fontFamily: "'IBM Plex Mono',monospace", fontSize: "12px", fontWeight: 600,
                  letterSpacing: "0.05em", textDecoration: "none", textTransform: "uppercase",
                  display: "inline-block",
                }}>
                  Start gratis scan →
                </a>
                <a href="#pricing" style={{
                  padding: "14px 28px", border: "1px solid rgba(15,14,14,0.15)",
                  color: "rgba(15,14,14,0.5)", fontFamily: "'IBM Plex Mono',monospace",
                  fontSize: "12px", letterSpacing: "0.05em", textDecoration: "none",
                  textTransform: "uppercase", display: "inline-block",
                }}>
                  Bekijk plannen
                </a>
              </div>
              <div style={{ display: "flex", gap: "0", marginTop: "48px", paddingTop: "28px", borderTop: "1px solid rgba(15,14,14,0.08)" }}>
                {[
                  { v: "9", l: "Quick modules" },
                  { v: "11", l: "Full modules" },
                  { v: "PDF", l: "Per email" },
                  { v: "OSCP", l: "Gebouwd door" },
                ].map((s, i) => (
                  <div key={s.l} style={{ flex: 1, paddingLeft: i ? "20px" : 0, borderLeft: i ? "1px solid rgba(15,14,14,0.08)" : "none" }}>
                    <p style={{ fontFamily: "'Fraunces',Georgia,serif", fontWeight: 700, fontSize: "1.4rem", letterSpacing: "-0.03em", color: "#0F0E0E", margin: "0 0 3px" }}>{s.v}</p>
                    <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "9px", color: "rgba(15,14,14,0.3)", letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>{s.l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Terminal preview */}
            <div style={{ background: "#0F0E0E", padding: "28px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                {["#C2410C","#B45309","#15803D"].map(c => (
                  <div key={c} style={{ width: "10px", height: "10px", borderRadius: "50%", background: c }} />
                ))}
                <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "rgba(245,243,236,0.3)", marginLeft: "8px" }}>
                  quick-scan — example.com
                </span>
              </div>
              {[
                { label: "HEADERS",  val: "CSP missing — HIGH",          ok: false },
                { label: "SSL",      val: "TLS 1.3 — valid cert",         ok: true  },
                { label: "DNS",      val: "SPF OK · DMARC p=none",        ok: false },
                { label: "NMAP",     val: "3 open ports: 80,443,8080",    ok: null  },
                { label: "GOBUSTER", val: "/admin /backup found",         ok: false },
                { label: "NIKTO",    val: "X-Powered-By exposed",         ok: false },
                { label: "URLSCAN",  val: "No threats detected",          ok: true  },
                { label: "ZAP",      val: "Cookie without Secure flag",   ok: false },
                { label: "SCORE",    val: "38 / 100 — HIGH RISK",         ok: false },
              ].map((row, i) => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: i < 8 ? "1px solid rgba(245,243,236,0.05)" : "none" }}>
                  <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "rgba(245,243,236,0.3)", letterSpacing: "0.08em" }}>
                    {row.label}
                  </span>
                  <span style={{
                    fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", fontWeight: 500,
                    color: row.ok === true ? "#16A34A" : row.ok === null ? "#D97706" : "#DC2626",
                  }}>
                    {row.val}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── MODULES ── */}
        <section style={{ padding: "80px 40px", background: "#F5F3EC" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingBottom: "20px", borderBottom: "2px solid #0F0E0E", marginBottom: "1px" }}>
              <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", fontWeight: 600, letterSpacing: "0.2em", color: "rgba(15,14,14,0.4)", textTransform: "uppercase" }}>
                Modules — Quick Scan
              </span>
              <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "rgba(15,14,14,0.3)" }}>
                09 modules · Starter+
              </span>
            </div>
            <div className="sk-check-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1px", background: "rgba(15,14,14,0.08)" }}>
              {MODULES.map((m, i) => (
                <div key={m.id} style={{ padding: "28px 28px", background: "#F5F3EC" }}>
                  <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10px", fontWeight: 600, letterSpacing: "0.15em", color: "#0284C7", textTransform: "uppercase", display: "block", marginBottom: "12px" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 style={{ fontFamily: "'Fraunces',Georgia,serif", fontWeight: 700, fontSize: "1.2rem", letterSpacing: "-0.02em", color: "#0F0E0E", margin: "0 0 8px" }}>
                    {m.label}
                  </h3>
                  <p style={{ fontSize: "13px", color: "rgba(15,14,14,0.5)", lineHeight: 1.65, margin: 0 }}>
                    {m.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ── */}
        <section id="pricing" className="sk-pricing-section" style={{ padding: "80px 40px 100px", background: "#ffffff" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", letterSpacing: "0.2em", color: "rgba(15,14,14,0.35)", textTransform: "uppercase", display: "block", marginBottom: "20px" }}>
              Pricing
            </span>
            <h2 style={{
              fontFamily: "'Fraunces',Georgia,serif", fontWeight: 900,
              fontSize: "clamp(2.5rem,5vw,4.5rem)", letterSpacing: "-0.04em",
              lineHeight: 0.93, color: "#0F0E0E", margin: "0 0 56px",
            }}>
              Kies je plan
              <br />
              <em style={{ fontWeight: 300, color: "rgba(15,14,14,0.3)" }}>geen verborgen kosten.</em>
            </h2>
            <div
              className="sk-price-grid"
              style={{
                display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
                gap: "1px", background: "rgba(15,14,14,0.1)",
                border: "1px solid rgba(15,14,14,0.1)",
              }}
            >
              {PRICING.map((plan) => (
                <div
                  key={plan.name}
                  style={{
                    background: plan.highlight ? "#0F0E0E" : "#ffffff",
                    padding: "40px 28px",
                    display: "flex", flexDirection: "column",
                  }}
                >
                  <span style={{
                    fontFamily: "'IBM Plex Mono',monospace", fontSize: "10px",
                    letterSpacing: "0.2em", textTransform: "uppercase",
                    color: plan.highlight ? "rgba(245,243,236,0.4)" : "rgba(15,14,14,0.4)",
                    marginBottom: "16px", display: "block",
                  }}>
                    {plan.name}
                  </span>
                  <div style={{ marginBottom: "20px" }}>
                    <span style={{
                      fontFamily: "'Fraunces',Georgia,serif", fontWeight: 900,
                      fontSize: "clamp(1.8rem,3vw,2.6rem)", letterSpacing: "-0.04em",
                      color: plan.highlight ? "#F5F3EC" : "#0F0E0E",
                    }}>
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "12px", color: plan.highlight ? "rgba(245,243,236,0.4)" : "rgba(15,14,14,0.4)", marginLeft: "4px" }}>
                        {plan.period}
                      </span>
                    )}
                  </div>
                  <p style={{
                    fontSize: "13px", lineHeight: 1.65,
                    color: plan.highlight ? "rgba(245,243,236,0.5)" : "rgba(15,14,14,0.5)",
                    margin: "0 0 28px", minHeight: "48px",
                  }}>
                    {plan.desc}
                  </p>
                  <ul style={{ listStyle: "none", padding: 0, margin: "0 0 36px", display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
                    {plan.features.map((f) => (
                      <li key={f} style={{
                        fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px",
                        color: plan.highlight ? "rgba(245,243,236,0.7)" : "rgba(15,14,14,0.65)",
                        display: "flex", alignItems: "flex-start", gap: "8px",
                      }}>
                        <span style={{ color: plan.highlight ? "#F5F3EC" : "#0F0E0E", flexShrink: 0 }}>—</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={plan.href}
                    className={plan.lemon ? "lemonsqueezy-button" : undefined}
                    style={{
                      display: "block", textAlign: "center", padding: "13px 20px",
                      background: plan.highlight ? "#0284C7" : "#0F0E0E",
                      color: "#ffffff",
                      fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px",
                      letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none",
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.75"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; }}
                  >
                    {plan.cta}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ padding: "100px 40px", background: "#0F0E0E", textAlign: "center" }}>
          <div style={{ maxWidth: "560px", margin: "0 auto" }}>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", letterSpacing: "0.2em", color: "rgba(245,243,236,0.28)", textTransform: "uppercase", display: "block", marginBottom: "20px" }}>
              Gratis starten
            </span>
            <h2 style={{
              fontFamily: "'Fraunces',Georgia,serif", fontWeight: 900,
              fontSize: "clamp(2.5rem,6vw,5rem)", letterSpacing: "-0.04em",
              lineHeight: 0.9, color: "#F5F3EC", margin: "0 0 20px",
            }}>
              Scan je domein.
              <br />
              <em style={{ fontWeight: 300, color: "rgba(245,243,236,0.3)" }}>Nu. Gratis.</em>
            </h2>
            <p style={{ fontSize: "15px", color: "rgba(245,243,236,0.35)", lineHeight: 1.75, marginBottom: "36px" }}>
              Geen account. Geen credit card. Gewoon een domein invullen.
            </p>
            <a href="/scan" style={{
              display: "inline-block", padding: "16px 36px",
              background: "#0284C7", color: "#ffffff",
              fontFamily: "'IBM Plex Mono',monospace", fontSize: "13px",
              fontWeight: 600, letterSpacing: "0.06em",
              textDecoration: "none", textTransform: "uppercase",
            }}>
              Start Scan →
            </a>
          </div>
        </section>

      </div>
    </>
  );
}
