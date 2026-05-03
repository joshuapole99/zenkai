"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

function FontLoader() {
  useEffect(() => {
    if (document.querySelector("[data-zk-f]")) return;
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href =
      "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,300;1,9..144,700;1,9..144,900&family=IBM+Plex+Mono:wght@400;500;600&display=swap";
    l.setAttribute("data-zk-f", "");
    document.head.appendChild(l);
  }, []);
  return null;
}

const PRODUCTS = [
  {
    num: "01", id: "scan", category: "ATTACK SURFACE",
    name: "Scan",
    tagline: "Quick Scan (9 modules) en Full Scan (16 modules). PDF rapport per email.",
    desc: "SSL/TLS, DNS, headers, open poorten, directory enum, Nikto, ZAP active scan, Shodan CVEs, SQLMap, ffuf, wfuzz. Van gratis domeincheck tot volledig attack surface rapport.",
    status: "live" as const,
    href: "https://scan.zenkai.nl",
    accent: "#0284C7", accentBg: "rgba(2,132,199,0.05)", word: "Analysts.",
  },
  {
    num: "02", id: "ssl", category: "MONITORING",
    name: "SSL Monitor",
    tagline: "Certificaat monitoring en alerts voor jouw domeinen.",
    desc: "Automatische melding bij vervaldatum, zwakke cipher suites, mismatched domeinen of self-signed certs. Dashboard per domein.",
    status: "coming-soon" as const,
    href: "#",
    accent: "#16A34A", accentBg: "rgba(22,163,74,0.05)", word: "Developers.",
  },
  {
    num: "03", id: "email", category: "EMAIL SECURITY",
    name: "Email Header Analyzer",
    tagline: "SPF, DKIM en DMARC check in één klik.",
    desc: "Plak een email header en zie direct of SPF/DKIM/DMARC kloppen, waar het bericht vandaan komt, en of er tekenen zijn van spoofing.",
    status: "coming-soon" as const,
    href: "#",
    accent: "#7C3AED", accentBg: "rgba(124,58,237,0.05)", word: "Freelancers.",
  },
  {
    num: "04", id: "breach", category: "INTELLIGENCE",
    name: "Password Breach Checker",
    tagline: "Check of jouw credentials gelekt zijn via HaveIBeenPwned.",
    desc: "Voer een email of wachtwoord in en zie direct of het voorkomt in bekende datalekken. k-Anonymity: jouw data verlaat nooit de browser.",
    status: "coming-soon" as const,
    href: "#",
    accent: "#DC2626", accentBg: "rgba(220,38,38,0.05)", word: "Teams.",
  },
  {
    num: "05", id: "dns", category: "RECONNAISSANCE",
    name: "DNS Lookup",
    tagline: "Uitgebreide DNS records — A, AAAA, MX, TXT, SPF, DMARC, CAA.",
    desc: "Alle DNS records in één overzicht. Inclusief SPF-validatie, DMARC policy check, CAA analyse en reverse DNS voor IP-adressen.",
    status: "coming-soon" as const,
    href: "#",
    accent: "#EA580C", accentBg: "rgba(234,88,12,0.05)", word: "Pentesters.",
  },
  {
    num: "06", id: "pdf", category: "DOCUMENT SECURITY",
    name: "PDF Protect",
    tagline: "Beveilig PDF-documenten met wachtwoord en permissies.",
    desc: "Upload een PDF, stel een wachtwoord in, blokkeer printen of kopiëren. Alles client-side — jouw document wordt nooit geüpload naar een server.",
    status: "coming-soon" as const,
    href: "#",
    accent: "#0891B2", accentBg: "rgba(8,145,178,0.05)", word: "Builders.",
  },
  {
    num: "07", id: "pwgen", category: "UTILITIES",
    name: "Password Generator",
    tagline: "Sterke, unieke wachtwoorden in één klik.",
    desc: "Instelbare lengte, symbolen, cijfers, uitsluitingen. Entropie-indicator, clipboard copy, bulk genereren voor password managers.",
    status: "coming-soon" as const,
    href: "#",
    accent: "#059669", accentBg: "rgba(5,150,105,0.05)", word: "Everyone.",
  },
  {
    num: "08", id: "hash", category: "UTILITIES",
    name: "Hash Generator",
    tagline: "MD5, SHA-1, SHA-256, SHA-512 hashes in de browser.",
    desc: "Plak tekst of upload een bestand — krijg direct alle hashes. Inclusief HMAC-varianten en hash vergelijking voor integriteitscontrole.",
    status: "coming-soon" as const,
    href: "#",
    accent: "#B45309", accentBg: "rgba(180,83,9,0.05)", word: "Defenders.",
  },
];

const POSTS: { date: string; cat: string; title: string; excerpt: string; accent: string }[] = [];

function ScrollBar() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const fn = () => {
      const s = window.scrollY;
      const t = document.documentElement.scrollHeight - window.innerHeight;
      setP(t > 0 ? s / t : 0);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, zIndex: 999,
      height: "2px", width: `${p * 100}%`,
      background: "#0284C7",
      transition: "width 0.08s linear",
      pointerEvents: "none",
    }} />
  );
}

function ProductCard({ p, i, visible }: { p: (typeof PRODUCTS)[0]; i: number; visible: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={p.href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "block",
        position: "relative",
        overflow: "hidden",
        textDecoration: "none",
        color: "inherit",
        cursor: "pointer",
        background: hovered ? p.accentBg : "#ffffff",
        borderTop: `3px solid ${hovered ? p.accent : "rgba(15,14,14,0.08)"}`,
        padding: "32px 28px 28px",
        transition: "background 0.25s ease, border-color 0.25s ease",
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(20px)",
        transitionProperty: "background, border-color, opacity, transform",
        transitionDuration: "0.25s, 0.25s, 0.55s, 0.55s",
        transitionTimingFunction: "ease, ease, cubic-bezier(.22,1,.36,1), cubic-bezier(.22,1,.36,1)",
        transitionDelay: `0s, 0s, ${i * 0.1 + 0.2}s, ${i * 0.1 + 0.2}s`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
        <span style={{
          fontFamily: "'IBM Plex Mono',monospace", fontSize: "10px", fontWeight: 600,
          letterSpacing: "0.12em", textTransform: "uppercase", color: p.accent,
        }}>
          {p.category}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{
            fontFamily: "'IBM Plex Mono',monospace", fontSize: "9px", fontWeight: 600,
            padding: "3px 7px", letterSpacing: "0.08em",
            border: p.status === "live" ? `1px solid ${p.accent}` : "1px solid rgba(15,14,14,0.12)",
            color: p.status === "live" ? p.accent : "rgba(15,14,14,0.3)",
          }}>
            {p.status === "live" ? "LIVE" : "SOON"}
          </span>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "rgba(15,14,14,0.18)" }}>
            {p.num}
          </span>
        </div>
      </div>

      <h3 style={{
        fontFamily: "'Fraunces',Georgia,serif", fontWeight: 700,
        fontSize: "clamp(1.4rem,2.5vw,2rem)", letterSpacing: "-0.03em",
        color: "#0F0E0E", margin: "0 0 8px", lineHeight: 1.05,
      }}>
        {p.name}
      </h3>
      <p style={{
        fontFamily: "'IBM Plex Mono',monospace", fontSize: "12px",
        color: "rgba(15,14,14,0.38)", margin: "0 0 16px", lineHeight: 1.5,
      }}>
        {p.tagline}
      </p>
      <p style={{
        fontSize: "13.5px", color: "rgba(15,14,14,0.42)", lineHeight: 1.7, margin: "0 0 24px",
      }}>
        {p.desc}
      </p>

      <div style={{
        display: "flex", alignItems: "center", gap: "6px",
        fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px",
        color: hovered ? p.accent : "rgba(15,14,14,0.28)",
        transition: "color 0.2s ease",
      }}>
        <span>{p.status === "live" ? "Open app" : "Join waitlist"}</span>
        <span style={{ transform: hovered ? "translateX(4px)" : "none", transition: "transform 0.2s ease", display: "inline-block" }}>→</span>
      </div>
    </a>
  );
}

export default function HubHome() {
  const [mounted, setMounted] = useState(false);
  const [activeWord, setActiveWord] = useState(0);
  const [credVisible, setCredVisible] = useState(false);
  const [blogVisible, setBlogVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const credRef = useRef<HTMLDivElement>(null);
  const blogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    const iv = setInterval(() => setActiveWord((w) => (w + 1) % PRODUCTS.length), 2400);
    return () => { clearTimeout(t); clearInterval(iv); };
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setCredVisible(true); },
      { threshold: 0.15 }
    );
    if (credRef.current) obs.observe(credRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setBlogVisible(true); },
      { threshold: 0.1 }
    );
    if (blogRef.current) obs.observe(blogRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const ap = PRODUCTS[activeWord];

  return (
    <>
      <FontLoader />
      <ScrollBar />
      <style>{`
        @keyframes wordCycle {
          0%   { opacity: 0; transform: translateY(10px); clip-path: inset(0 0 100% 0); }
          15%  { opacity: 1; transform: translateY(0);    clip-path: inset(0 0 0% 0); }
          80%  { opacity: 1; transform: translateY(0);    clip-path: inset(0 0 0% 0); }
          100% { opacity: 0; transform: translateY(-7px); clip-path: inset(0 0 0% 0); }
        }
        @keyframes hf {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        ::selection { background: #0284C7; color: #ffffff; }
        @media (max-width: 720px) {
          .cards-grid { grid-template-columns: 1fr !important; }
          .cred-grid  { grid-template-columns: 1fr !important; gap: 48px !important; }
          .hero-bottom { flex-direction: column !important; align-items: flex-start !important; }
          .stats-row { flex-wrap: wrap; }
          .footer-inner { flex-direction: column !important; gap: 20px !important; }
          .nav-links { display: none !important; }
          .hamburger { display: flex !important; }
          .blog-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 721px) {
          .hamburger { display: none !important; }
          .mobile-menu { display: none !important; }
        }
      `}</style>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          className="mobile-menu"
          style={{
            position: "fixed", inset: 0, zIndex: 200,
            background: "#ffffff",
            display: "flex", flexDirection: "column",
            padding: "80px 32px 40px",
            animation: "slideDown 0.25s ease both",
          }}
        >
          <button
            onClick={() => setMenuOpen(false)}
            style={{
              position: "absolute", top: "18px", right: "20px",
              background: "none", border: "none", cursor: "pointer",
              padding: "8px", color: "#0F0E0E",
            }}
            aria-label="Close menu"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <line x1="2" y1="2" x2="20" y2="20" stroke="currentColor" strokeWidth="1.8" />
              <line x1="20" y1="2" x2="2" y2="20" stroke="currentColor" strokeWidth="1.8" />
            </svg>
          </button>
          <nav style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {[
              { l: "Pricing", h: "#pricing" },
              { l: "Tools", h: "#tools" },
              { l: "About", h: "#about" },
              { l: "Start Scan", h: "https://scan.zenkai.nl" },
            ].map((x) => (
              <a
                key={x.l}
                href={x.h}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontFamily: "'Fraunces',Georgia,serif", fontWeight: 700,
                  fontSize: "2rem", letterSpacing: "-0.03em",
                  color: "#0F0E0E", textDecoration: "none",
                  padding: "14px 0",
                  borderBottom: "1px solid rgba(15,14,14,0.08)",
                  display: "block",
                }}
              >
                {x.l}
              </a>
            ))}
          </nav>
          <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
            <a href="mailto:info@zenkai.nl" style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "12px", color: "rgba(15,14,14,0.35)", textDecoration: "none" }}>
              info@zenkai.nl
            </a>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "rgba(15,14,14,0.22)" }}>
              © Zenkai 2026
            </span>
          </div>
        </div>
      )}

      <main style={{ minHeight: "100vh", background: "#ffffff", color: "#0F0E0E", overflowX: "hidden" }}>

        {/* ── NAV ─────────────────────────────────────────────────────────── */}
        <nav style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
          height: "60px", display: "flex", alignItems: "center",
          justifyContent: "space-between", padding: "0 40px",
          background: "rgba(255,255,255,0.94)", backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(15,14,14,0.07)",
        }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img src="/zenkai-logo.jpg" alt="Zenkai" style={{ height: "44px", width: "auto", display: "block" }} />
          </div>

          <div className="nav-links" style={{ display: "flex", gap: "28px", alignItems: "center" }}>
            {[
              { l: "Pricing",  h: "#pricing" },
              { l: "Tools",    h: "#tools" },
              { l: "About",    h: "/about" },
            ].map((x) => (
              <a key={x.l} href={x.h} style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "rgba(15,14,14,0.4)", textDecoration: "none" }}>
                {x.l}
              </a>
            ))}
            <a href="https://scan.zenkai.nl" style={{
              fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", fontWeight: 600,
              color: "#ffffff", textDecoration: "none",
              padding: "8px 18px", background: "#0284C7",
              letterSpacing: "0.04em",
            }}>
              Start Scan →
            </a>
          </div>

          <button
            className="hamburger"
            onClick={() => setMenuOpen(true)}
            style={{
              display: "none", flexDirection: "column", justifyContent: "center",
              gap: "5px", background: "none", border: "none", cursor: "pointer",
              padding: "8px", width: "38px", height: "38px",
            }}
            aria-label="Open menu"
          >
            <span style={{ display: "block", width: "22px", height: "1.5px", background: "#0F0E0E" }} />
            <span style={{ display: "block", width: "16px", height: "1.5px", background: "#0F0E0E" }} />
            <span style={{ display: "block", width: "22px", height: "1.5px", background: "#0F0E0E" }} />
          </button>
        </nav>

        {/* ── HERO ────────────────────────────────────────────────────────── */}
        <section style={{
          minHeight: "100vh", display: "flex", flexDirection: "column",
          justifyContent: "center", padding: "100px 40px 80px",
          maxWidth: "1280px", margin: "0 auto",
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "10px", marginBottom: "28px",
            opacity: mounted ? 1 : 0, animation: mounted ? "hf .6s ease .05s both" : "none",
          }}>
            <div style={{ width: "28px", height: "1px", background: "#0284C7" }} />
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", letterSpacing: "0.2em", color: "#0284C7", textTransform: "uppercase" }}>
              zenkai.nl — security platform
            </span>
          </div>

          <div style={{ opacity: mounted ? 1 : 0, animation: mounted ? "hf .75s ease .12s both" : "none" }}>
            <h1 style={{
              fontFamily: "'Fraunces',Georgia,serif", fontWeight: 900, margin: 0,
              fontSize: "clamp(3.5rem, 9vw, 8.5rem)", lineHeight: 0.92, letterSpacing: "-0.04em",
            }}>
              One platform.
            </h1>
            <div style={{ display: "flex", alignItems: "baseline", gap: "0.18em", flexWrap: "wrap" }}>
              <span style={{
                fontFamily: "'Fraunces',Georgia,serif", fontWeight: 300, fontStyle: "italic",
                fontSize: "clamp(3.5rem, 9vw, 8.5rem)", lineHeight: 0.92, letterSpacing: "-0.04em",
                color: "rgba(15,14,14,0.22)",
              }}>
                for
              </span>
              <span
                key={activeWord}
                style={{
                  fontFamily: "'Fraunces',Georgia,serif", fontWeight: 900,
                  fontSize: "clamp(3.5rem, 9vw, 8.5rem)", lineHeight: 0.92, letterSpacing: "-0.04em",
                  color: ap.accent, display: "inline-block",
                  animation: "wordCycle 2.4s ease forwards",
                }}
              >
                {ap.word}
              </span>
            </div>
          </div>

          <div
            className="hero-bottom"
            style={{
              display: "flex", alignItems: "flex-end", justifyContent: "space-between",
              marginTop: "48px", flexWrap: "wrap", gap: "24px",
              opacity: mounted ? 1 : 0, animation: mounted ? "hf .7s ease .3s both" : "none",
            }}
          >
            <div>
              <p style={{ fontSize: "16px", color: "rgba(15,14,14,0.7)", maxWidth: "420px", lineHeight: 1.78, margin: "0 0 6px", fontWeight: 500 }}>
                Security tools for Analysts, Developers, Freelancers and Teams.
              </p>
              <p style={{ fontSize: "14px", color: "rgba(15,14,14,0.4)", maxWidth: "420px", lineHeight: 1.7, margin: 0 }}>
                Professional security tools. Built by someone who knows how attackers think.
              </p>
            </div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <a href="#tools" style={{
                padding: "13px 26px", background: "#0284C7", color: "#ffffff",
                fontFamily: "'IBM Plex Mono',monospace", fontSize: "12px", fontWeight: 600,
                letterSpacing: "0.05em", textDecoration: "none", textTransform: "uppercase",
                display: "inline-block",
              }}>
                Explore Tools ↓
              </a>
              <a href="/about" style={{
                padding: "13px 26px", border: "1px solid rgba(15,14,14,0.15)",
                color: "rgba(15,14,14,0.5)", fontFamily: "'IBM Plex Mono',monospace",
                fontSize: "12px", letterSpacing: "0.05em", textDecoration: "none",
                textTransform: "uppercase", display: "inline-block",
              }}>
                About
              </a>
            </div>
          </div>

          <div
            className="stats-row"
            style={{
              display: "flex", gap: "0", marginTop: "64px",
              paddingTop: "32px", borderTop: "1px solid rgba(15,14,14,0.08)",
              opacity: mounted ? 1 : 0, animation: mounted ? "hf .6s ease .48s both" : "none",
            }}
          >
            {[
              { v: "8", l: "Security tools" },
              { v: "1", l: "Live now" },
              { v: "OSCP", l: "Certified" },
              { v: "€0", l: "VC funding" },
            ].map((s, i) => (
              <div key={s.l} style={{
                flex: 1, paddingLeft: i ? "32px" : 0,
                borderLeft: i ? "1px solid rgba(15,14,14,0.08)" : "none",
              }}>
                <p style={{ fontFamily: "'Fraunces',Georgia,serif", fontWeight: 700, fontSize: "1.8rem", letterSpacing: "-0.03em", color: "#0F0E0E", margin: "0 0 4px" }}>
                  {s.v}
                </p>
                <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10px", color: "rgba(15,14,14,0.3)", letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>
                  {s.l}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── TOOLS CARDS ─────────────────────────────────────────────────── */}
        <section id="tools" style={{
          padding: "80px 40px 100px", maxWidth: "1280px", margin: "0 auto",
        }}>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "baseline",
            paddingBottom: "20px", marginBottom: "32px",
            borderBottom: "2px solid #0F0E0E",
          }}>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", fontWeight: 600, letterSpacing: "0.2em", color: "rgba(15,14,14,0.35)", textTransform: "uppercase" }}>
              Tools
            </span>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "rgba(15,14,14,0.28)" }}>
              1 live · 3 launching 2026
            </span>
          </div>
          <div
            className="cards-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1px",
              background: "rgba(15,14,14,0.07)",
              border: "1px solid rgba(15,14,14,0.07)",
            }}
          >
            {PRODUCTS.map((p, i) => (
              <ProductCard key={p.id} p={p} i={i} visible={mounted} />
            ))}
          </div>
        </section>

        {/* ── PRICING ─────────────────────────────────────────────────────── */}
        <section id="pricing" style={{ background: "#F5F3EC", padding: "100px 40px" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <span style={{
              fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px",
              letterSpacing: "0.2em", color: "rgba(15,14,14,0.35)",
              textTransform: "uppercase", display: "block", marginBottom: "20px",
            }}>
              Pricing
            </span>
            <h2 style={{
              fontFamily: "'Fraunces',Georgia,serif", fontWeight: 900,
              fontSize: "clamp(2.5rem,5vw,4.5rem)", letterSpacing: "-0.04em",
              lineHeight: 0.93, color: "#0F0E0E", margin: "0 0 64px",
            }}>
              Kies je plan
              <br />
              <em style={{ fontWeight: 300, color: "rgba(15,14,14,0.35)" }}>
                geen verborgen kosten.
              </em>
            </h2>
            <div className="zk-price-grid" style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "1px",
              background: "rgba(15,14,14,0.1)",
              border: "1px solid rgba(15,14,14,0.1)",
            }}>
              {[
                {
                  name: "Free",
                  price: "€0",
                  period: "",
                  desc: "Voor eenmalige checks en kennismaking met het platform.",
                  features: [
                    "1 scan per maand",
                    "6 basis checks — serverless",
                    "Security headers, SSL, DNS",
                    "OWASP indicatoren, Shodan basis, urlscan",
                    "Geen PDF rapport",
                  ],
                  cta: "Start gratis",
                  href: "https://scan.zenkai.nl",
                  highlight: false,
                },
                {
                  name: "Starter",
                  price: "€19",
                  period: "/mnd",
                  desc: "Voor freelancers en kleine bedrijven die regelmatig willen scannen.",
                  features: [
                    "3 scans per maand",
                    "Quick Scan — 9 modules",
                    "PDF rapport per email",
                    "Nmap top 1000, Nikto, ZAP passief",
                    "DNS, SSL, Headers, Shodan basis, urlscan",
                  ],
                  cta: "Start nu",
                  href: "https://scan.zenkai.nl",
                  highlight: false,
                },
                {
                  name: "Pro",
                  price: "€49",
                  period: "/mnd",
                  desc: "Voor security professionals en bedrijven met serieuze eisen.",
                  features: [
                    "Onbeperkt scans",
                    "Full Scan — 16 modules",
                    "PDF rapport per email + JSON output",
                    "Alle Starter modules + ffuf, wfuzz, WPScan",
                    "SQLMap, feroxbuster, SSLyze, ZAP active scan",
                    "Subdomains + volledige poortscan 1–65535",
                  ],
                  cta: "Kies Pro",
                  href: "https://scan.zenkai.nl",
                  highlight: true,
                },
                {
                  name: "Enterprise",
                  price: "Op aanvraag",
                  period: "",
                  desc: "Voor organisaties met eigen infrastructuur en compliance-eisen.",
                  features: [
                    "Alles van Pro",
                    "IP ranges /24, brute force tools",
                    "Custom rapport format + API toegang",
                    "10 gelijktijdige scans",
                    "SLA + NDA, dedicated support",
                  ],
                  cta: "Neem contact op",
                  href: "mailto:info@zenkai.nl",
                  highlight: false,
                },
              ].map((plan) => (
                <div
                  key={plan.name}
                  style={{
                    background: plan.highlight ? "#0F0E0E" : "#F5F3EC",
                    padding: "48px 36px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0",
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
                  <div style={{ marginBottom: "24px" }}>
                    <span style={{
                      fontFamily: "'Fraunces',Georgia,serif", fontWeight: 900,
                      fontSize: "clamp(2rem,3.5vw,3rem)", letterSpacing: "-0.04em",
                      color: plan.highlight ? "#F5F3EC" : "#0F0E0E",
                    }}>
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span style={{
                        fontFamily: "'IBM Plex Mono',monospace", fontSize: "12px",
                        color: plan.highlight ? "rgba(245,243,236,0.4)" : "rgba(15,14,14,0.4)",
                        marginLeft: "4px",
                      }}>
                        {plan.period}
                      </span>
                    )}
                  </div>
                  <p style={{
                    fontSize: "13px", lineHeight: 1.7,
                    color: plan.highlight ? "rgba(245,243,236,0.5)" : "rgba(15,14,14,0.5)",
                    margin: "0 0 32px", minHeight: "56px",
                  }}>
                    {plan.desc}
                  </p>
                  <ul style={{ listStyle: "none", padding: 0, margin: "0 0 40px", display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
                    {plan.features.map((f) => (
                      <li key={f} style={{
                        fontFamily: "'IBM Plex Mono',monospace", fontSize: "12px",
                        color: plan.highlight ? "rgba(245,243,236,0.7)" : "rgba(15,14,14,0.7)",
                        display: "flex", alignItems: "flex-start", gap: "10px",
                      }}>
                        <span style={{ color: plan.highlight ? "#F5F3EC" : "#0F0E0E", marginTop: "1px", flexShrink: 0 }}>—</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={plan.href}
                    style={{
                      display: "block", textAlign: "center",
                      padding: "14px 24px",
                      background: plan.highlight ? "#F5F3EC" : "#0F0E0E",
                      color: plan.highlight ? "#0F0E0E" : "#F5F3EC",
                      fontFamily: "'IBM Plex Mono',monospace", fontSize: "12px",
                      letterSpacing: "0.1em", textTransform: "uppercase",
                      textDecoration: "none",
                      transition: "opacity 0.15s",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.75"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; }}
                  >
                    {plan.cta}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ABOUT ───────────────────────────────────────────────────────── */}
        <section id="about" ref={credRef} style={{ background: "#0F0E0E", padding: "100px 40px" }}>
          <div
            className="cred-grid"
            style={{
              maxWidth: "1280px", margin: "0 auto",
              display: "grid", gridTemplateColumns: "1fr 1fr",
              gap: "80px", alignItems: "center",
            }}
          >
            <div>
              <span style={{
                fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px",
                letterSpacing: "0.2em", color: "rgba(245,243,236,0.3)",
                textTransform: "uppercase", display: "block", marginBottom: "20px",
              }}>
                About
              </span>
              <h2 style={{
                fontFamily: "'Fraunces',Georgia,serif", fontWeight: 900,
                fontSize: "clamp(2.5rem,5vw,4.5rem)", letterSpacing: "-0.04em",
                lineHeight: 0.93, color: "#F5F3EC", margin: "0 0 28px",
              }}>
                Security is
                <br />
                <em style={{ fontWeight: 300, color: "rgba(245,243,236,0.3)" }}>
                  mijn werk.
                </em>
              </h2>
              <p style={{ fontSize: "15px", color: "rgba(245,243,236,0.48)", lineHeight: 1.8, maxWidth: "420px", margin: "0 0 16px" }}>
                Ik ben Joshua — OSCP-gecertificeerde security analyst bij Enreach. Ik bouw Zenkai als het security platform dat ik zelf wilde: betaalbaar, eerlijk, gebouwd door iemand die weet hoe aanvallers denken.
              </p>
              <p style={{ fontSize: "15px", color: "rgba(245,243,236,0.3)", lineHeight: 1.8, maxWidth: "420px", margin: 0 }}>
                Geen VC funding. Geen team. Security is het werk — niet de hobby.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              {[
                { t: "OSCP Certified", d: "Offensive Security Certified Professional — de standaard voor penetration testing.", a: "#0284C7" },
                { t: "2+ jaar security", d: "Security analyst bij Enreach. Dagelijks bezig met pentesting, vulnerability assessment en hardening.", a: "#16A34A" },
                { t: "Gebouwd door een hacker", d: "Zenkai Scan is gebouwd met dezelfde toolset die ik gebruik op echte engagements: nmap, nikto, ZAP, feroxbuster, Shodan.", a: "#DC2626" },
                { t: "Geen enterprise BS", d: "Geen demo aanvragen, geen verborgen kosten. Gewoon scannen. Gebouwd vanuit Utrecht.", a: "#EA580C" },
              ].map((item, i) => (
                <div
                  key={item.t}
                  style={{
                    display: "flex", gap: "0", overflow: "hidden",
                    background: "rgba(245,243,236,0.03)",
                    border: "1px solid rgba(245,243,236,0.06)",
                    opacity: credVisible ? 1 : 0,
                    transform: credVisible ? "none" : "translateX(20px)",
                    transition: `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`,
                  }}
                >
                  <div style={{ width: "3px", background: item.a, flexShrink: 0 }} />
                  <div style={{ padding: "18px 22px" }}>
                    <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "12px", fontWeight: 600, color: "#F5F3EC", margin: "0 0 4px" }}>
                      {item.t}
                    </p>
                    <p style={{ fontSize: "13px", color: "rgba(245,243,236,0.35)", lineHeight: 1.6, margin: 0 }}>
                      {item.d}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BLOG ────────────────────────────────────────────────────────── */}
        {POSTS.length > 0 && <section style={{ padding: "100px 40px", maxWidth: "1280px", margin: "0 auto" }}>
          <div ref={blogRef} style={{
            display: "flex", justifyContent: "space-between", alignItems: "baseline",
            paddingBottom: "20px", marginBottom: "40px",
            borderBottom: "2px solid #0F0E0E",
          }}>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", fontWeight: 600, letterSpacing: "0.2em", color: "rgba(15,14,14,0.35)", textTransform: "uppercase" }}>
              Writing
            </span>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "rgba(15,14,14,0.28)" }}>
              Building in public
            </span>
          </div>
          <div
            className="blog-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "1px",
              background: "rgba(15,14,14,0.07)",
              border: "1px solid rgba(15,14,14,0.07)",
            }}
          >
            {POSTS.map((post, i) => (
              <div
                key={post.title}
                style={{
                  padding: "32px 28px",
                  background: "#ffffff",
                  borderTop: `3px solid ${post.accent}`,
                  opacity: blogVisible ? 1 : 0,
                  transform: blogVisible ? "none" : "translateY(16px)",
                  transition: `opacity 0.55s cubic-bezier(.22,1,.36,1) ${i * 0.12}s, transform 0.55s cubic-bezier(.22,1,.36,1) ${i * 0.12}s`,
                }}
              >
                <div style={{ display: "flex", gap: "12px", marginBottom: "20px", alignItems: "center" }}>
                  <span style={{
                    fontFamily: "'IBM Plex Mono',monospace", fontSize: "9px", fontWeight: 600,
                    letterSpacing: "0.12em", textTransform: "uppercase",
                    color: post.accent,
                  }}>
                    {post.cat}
                  </span>
                  <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "9px", color: "rgba(15,14,14,0.22)" }}>
                    {post.date}
                  </span>
                </div>
                <h3 style={{
                  fontFamily: "'Fraunces',Georgia,serif", fontWeight: 700,
                  fontSize: "1.2rem", letterSpacing: "-0.025em", lineHeight: 1.2,
                  color: "#0F0E0E", margin: "0 0 14px",
                }}>
                  {post.title}
                </h3>
                <p style={{ fontSize: "13.5px", color: "rgba(15,14,14,0.42)", lineHeight: 1.7, margin: "0 0 24px" }}>
                  {post.excerpt}
                </p>
                <span style={{
                  fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px",
                  color: "rgba(15,14,14,0.25)",
                }}>
                  Read →
                </span>
              </div>
            ))}
          </div>
        </section>}

        {/* ── CTA ─────────────────────────────────────────────────────────── */}
        <section style={{ padding: "120px 40px", background: "#0F0E0E", textAlign: "center" }}>
          <div style={{ maxWidth: "640px", margin: "0 auto" }}>
            <span style={{
              fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px",
              letterSpacing: "0.2em", color: "rgba(245,243,236,0.28)",
              textTransform: "uppercase", display: "block", marginBottom: "20px",
            }}>
              Get started
            </span>
            <h2 style={{
              fontFamily: "'Fraunces',Georgia,serif", fontWeight: 900,
              fontSize: "clamp(2.5rem,6vw,5rem)", letterSpacing: "-0.04em",
              lineHeight: 0.9, color: "#F5F3EC", margin: "0 0 24px",
            }}>
              Scan je domein.
              <br />
              <em style={{ fontWeight: 300, fontStyle: "italic", color: "rgba(245,243,236,0.3)" }}>Gratis. Nu.</em>
            </h2>
            <p style={{ fontSize: "16px", color: "rgba(245,243,236,0.35)", lineHeight: 1.75, marginBottom: "44px" }}>
              Geen account nodig. Geen credit card. Gewoon een domein invullen en scannen.
            </p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="https://scan.zenkai.nl" style={{ padding: "14px 30px", background: "#0284C7", color: "#fff", fontFamily: "'IBM Plex Mono',monospace", fontSize: "12px", fontWeight: 600, letterSpacing: "0.05em", textDecoration: "none", textTransform: "uppercase" }}>
                Start Scan →
              </a>
              <a href="#pricing" style={{ padding: "14px 30px", border: "1px solid rgba(245,243,236,0.18)", color: "rgba(245,243,236,0.55)", fontFamily: "'IBM Plex Mono',monospace", fontSize: "12px", letterSpacing: "0.05em", textDecoration: "none", textTransform: "uppercase" }}>
                Bekijk plannen
              </a>
            </div>
          </div>
        </section>

        {/* ── FOOTER ──────────────────────────────────────────────────────── */}
        <footer style={{ borderTop: "1px solid rgba(245,243,236,0.07)", background: "#0F0E0E", padding: "36px 40px" }}>
          <div
            className="footer-inner"
            style={{
              maxWidth: "1280px", margin: "0 auto",
              display: "flex", justifyContent: "space-between",
              alignItems: "center", flexWrap: "wrap", gap: "20px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <img src="/zenkai-logo.jpg" alt="Zenkai" style={{ height: "36px", width: "auto", display: "block", filter: "invert(1)" }} />
              <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "rgba(245,243,236,0.18)" }}>
                © 2026
              </span>
            </div>
            <div style={{ display: "flex", gap: "28px", flexWrap: "wrap" }}>
              {PRODUCTS.map((p) => (
                <a key={p.id} href={p.href} style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "rgba(245,243,236,0.25)", textDecoration: "none" }}>
                  {p.name}
                </a>
              ))}
            </div>
            <div style={{ display: "flex", gap: "22px" }}>
              <Link href="/privacy" style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "rgba(245,243,236,0.18)", textDecoration: "none" }}>Privacy</Link>
              <Link href="/terms" style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "rgba(245,243,236,0.18)", textDecoration: "none" }}>Terms</Link>
              <a href="mailto:info@zenkai.nl" style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "rgba(245,243,236,0.18)", textDecoration: "none" }}>Contact</a>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
