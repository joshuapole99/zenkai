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
    num: "01", id: "scan", category: "SECURITY",
    name: "SenseiScan",
    tagline: "Automated domain security audit. PDF report in minutes.",
    status: "coming-soon" as const,
    href: "https://scanner.zenkai.nl",
    accent: "#0284C7", accentBg: "rgba(2,132,199,0.06)", word: "Security.",
  },
  {
    num: "02", id: "fin", category: "FINANCE",
    name: "Financios",
    tagline: "Financial clarity for students and Gen Z.",
    status: "live" as const,
    href: "https://financios.zenkai.nl",
    accent: "#15803D", accentBg: "rgba(21,128,61,0.06)", word: "Finance.",
  },
  {
    num: "03", id: "job", category: "CAREER",
    name: "Sollicitatie Coach",
    tagline: "CV score, cover letter, interview prep.",
    status: "live" as const,
    href: "https://jobs.zenkai.nl",
    accent: "#B45309", accentBg: "rgba(180,83,9,0.06)", word: "Career.",
  },
  {
    num: "04", id: "fit", category: "FITNESS",
    name: "Zenkai Workout",
    tagline: "The comeback fitness app. No guilt trips.",
    status: "coming-soon" as const,
    href: "https://workout.zenkai.nl",
    accent: "#C2410C", accentBg: "rgba(194,65,12,0.06)", word: "Fitness.",
  },
];

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
    <div
      style={{
        position: "fixed", top: 0, left: 0, zIndex: 999,
        height: "2px", width: `${p * 100}%`,
        background: "linear-gradient(to right, #15803D, #0284C7)",
        transition: "width 0.08s linear",
        pointerEvents: "none",
      }}
    />
  );
}

function ProductRow({
  p, i, visible,
}: {
  p: (typeof PRODUCTS)[0]; i: number; visible: boolean;
}) {
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
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateX(-16px)",
        transition: `opacity 0.55s cubic-bezier(.22,1,.36,1) ${i * 0.09 + 0.3}s, transform 0.55s cubic-bezier(.22,1,.36,1) ${i * 0.09 + 0.3}s`,
      }}
    >
      {/* hover fill slides in from left */}
      <div
        style={{
          position: "absolute", inset: 0,
          background: p.accentBg,
          transform: hovered ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: "left",
          transition: "transform 0.35s cubic-bezier(.22,1,.36,1)",
          zIndex: 0,
        }}
      />
      <div
        className="pr-grid"
        style={{
          position: "relative", zIndex: 1,
          display: "grid",
          gridTemplateColumns: "48px 90px 1fr 1fr auto",
          alignItems: "center",
          gap: "24px",
          padding: "28px 0",
          borderBottom: "1px solid rgba(15,14,14,0.09)",
        }}
      >
        <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", fontWeight: 500, color: "rgba(15,14,14,0.3)" }}>
          {p.num}
        </span>
        <span className="pr-cat" style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: p.accent }}>
          {p.category}
        </span>
        <span style={{ fontFamily: "'Fraunces',Georgia,serif", fontWeight: 700, fontSize: "clamp(1.2rem,2.2vw,1.9rem)", letterSpacing: "-0.025em", color: "#0F0E0E", lineHeight: 1 }}>
          {p.name}
        </span>
        <span className="pr-tag" style={{ fontSize: "14px", color: "rgba(15,14,14,0.5)", lineHeight: 1.5 }}>
          {p.tagline}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "14px", flexShrink: 0 }}>
          <span style={{
            fontFamily: "'IBM Plex Mono',monospace", fontSize: "10px", fontWeight: 600,
            padding: "3px 8px", letterSpacing: "0.08em", whiteSpace: "nowrap",
            border: p.status === "live" ? `1px solid ${p.accent}` : "1px solid rgba(15,14,14,0.15)",
            color: p.status === "live" ? p.accent : "rgba(15,14,14,0.35)",
          }}>
            {p.status === "live" ? "LIVE" : "SOON"}
          </span>
          <span style={{
            fontSize: "16px",
            color: hovered ? p.accent : "rgba(15,14,14,0.22)",
            transition: "color 0.2s ease, transform 0.2s ease",
            transform: hovered ? "translateX(4px)" : "none",
            display: "inline-block",
          }}>
            →
          </span>
        </div>
      </div>
    </a>
  );
}

export default function HubHome() {
  const [mounted, setMounted] = useState(false);
  const [activeWord, setActiveWord] = useState(0);
  const [credVisible, setCredVisible] = useState(false);
  const credRef = useRef<HTMLDivElement>(null);

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
        ::selection { background: #0F0E0E; color: #F5F3EC; }
        .pr-grid { transition: background 0.25s ease; }
        @media (max-width: 720px) {
          .pr-grid { grid-template-columns: 36px 1fr auto !important; gap: 10px !important; }
          .pr-cat  { display: none !important; }
          .pr-tag  { display: none !important; }
          .cred-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
          .hero-bottom { flex-direction: column !important; align-items: flex-start !important; }
          .stats-row { flex-wrap: wrap; }
          .footer-inner { flex-direction: column !important; gap: 20px !important; }
          .nav-links { display: none !important; }
        }
      `}</style>

      <main style={{ minHeight: "100vh", background: "#F5F3EC", color: "#0F0E0E", overflowX: "hidden" }}>

        {/* ── NAV ─────────────────────────────────────────────────────────── */}
        <nav style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
          height: "60px", display: "flex", alignItems: "center",
          justifyContent: "space-between", padding: "0 40px",
          background: "rgba(245,243,236,0.9)", backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(15,14,14,0.08)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontFamily: "'Fraunces',Georgia,serif", fontWeight: 700, fontStyle: "italic", fontSize: "21px", letterSpacing: "-0.03em" }}>
              Zenkai
            </span>
            <span style={{
              fontFamily: "'IBM Plex Mono',monospace", fontSize: "9px", fontWeight: 500,
              letterSpacing: "0.15em", padding: "3px 7px",
              border: "1px solid rgba(15,14,14,0.15)", color: "rgba(15,14,14,0.35)",
              textTransform: "uppercase",
            }}>
              Platform
            </span>
          </div>
          <div className="nav-links" style={{ display: "flex", gap: "28px", alignItems: "center" }}>
            {[
              { l: "Financios", h: "https://financios.zenkai.nl" },
              { l: "Jobs", h: "https://jobs.zenkai.nl" },
            ].map((x) => (
              <a key={x.l} href={x.h} style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "rgba(15,14,14,0.4)", textDecoration: "none" }}>
                {x.l}
              </a>
            ))}
            <a href="#tools" style={{
              fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px",
              color: "#0F0E0E", textDecoration: "none",
              padding: "8px 16px", border: "1px solid rgba(15,14,14,0.2)",
            }}>
              04 tools
            </a>
          </div>
        </nav>

        {/* ── HERO ────────────────────────────────────────────────────────── */}
        <section style={{
          minHeight: "100vh", display: "flex", flexDirection: "column",
          justifyContent: "center", padding: "100px 40px 80px",
          maxWidth: "1280px", margin: "0 auto",
        }}>
          {/* Eyebrow */}
          <div style={{
            display: "flex", alignItems: "center", gap: "10px", marginBottom: "28px",
            opacity: mounted ? 1 : 0, animation: mounted ? "hf .6s ease .05s both" : "none",
          }}>
            <div style={{ width: "28px", height: "1px", background: "rgba(15,14,14,0.3)" }} />
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", letterSpacing: "0.2em", color: "rgba(15,14,14,0.4)", textTransform: "uppercase" }}>
              zenkai.nl — platform
            </span>
          </div>

          {/* Headline */}
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
                color: "rgba(15,14,14,0.28)",
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

          {/* Sub + CTAs */}
          <div
            className="hero-bottom"
            style={{
              display: "flex", alignItems: "flex-end", justifyContent: "space-between",
              marginTop: "48px", flexWrap: "wrap", gap: "24px",
              opacity: mounted ? 1 : 0, animation: mounted ? "hf .7s ease .3s both" : "none",
            }}
          >
            <p style={{ fontSize: "16px", color: "rgba(15,14,14,0.48)", maxWidth: "380px", lineHeight: 1.78, margin: 0 }}>
              Security scans, finance, job coaching, fitness — built by an OSCP-certified analyst for real people. No enterprise pricing.
            </p>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <a href="https://financios.zenkai.nl" style={{
                padding: "13px 26px", background: "#15803D", color: "#fff",
                fontFamily: "'IBM Plex Mono',monospace", fontSize: "12px", fontWeight: 600,
                letterSpacing: "0.05em", textDecoration: "none", textTransform: "uppercase",
                display: "inline-block",
              }}>
                Try Financios →
              </a>
              <a href="#tools" style={{
                padding: "13px 26px", border: "1px solid rgba(15,14,14,0.18)",
                color: "rgba(15,14,14,0.55)", fontFamily: "'IBM Plex Mono',monospace",
                fontSize: "12px", letterSpacing: "0.05em", textDecoration: "none",
                textTransform: "uppercase", display: "inline-block",
              }}>
                All tools ↓
              </a>
            </div>
          </div>

          {/* Stats */}
          <div
            className="stats-row"
            style={{
              display: "flex", gap: "0", marginTop: "64px",
              paddingTop: "32px", borderTop: "1px solid rgba(15,14,14,0.1)",
              opacity: mounted ? 1 : 0, animation: mounted ? "hf .6s ease .48s both" : "none",
            }}
          >
            {[
              { v: "4", l: "Tools" },
              { v: "2", l: "Live now" },
              { v: "OSCP", l: "Certified" },
              { v: "€0", l: "VC funding" },
            ].map((s, i) => (
              <div key={s.l} style={{
                flex: 1, paddingLeft: i ? "32px" : 0,
                borderLeft: i ? "1px solid rgba(15,14,14,0.1)" : "none",
              }}>
                <p style={{ fontFamily: "'Fraunces',Georgia,serif", fontWeight: 700, fontSize: "1.8rem", letterSpacing: "-0.03em", color: "#0F0E0E", margin: "0 0 4px" }}>
                  {s.v}
                </p>
                <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10px", color: "rgba(15,14,14,0.33)", letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>
                  {s.l}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── TOOLS LEDGER ────────────────────────────────────────────────── */}
        <section id="tools" style={{
          padding: "80px 40px 100px", maxWidth: "1280px", margin: "0 auto",
          borderTop: "1px solid rgba(15,14,14,0.08)",
        }}>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "baseline",
            paddingBottom: "20px", borderBottom: "2px solid #0F0E0E",
          }}>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", fontWeight: 600, letterSpacing: "0.2em", color: "rgba(15,14,14,0.4)", textTransform: "uppercase" }}>
              Tools
            </span>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "rgba(15,14,14,0.3)" }}>
              2 live · 2 launching 2026
            </span>
          </div>
          {PRODUCTS.map((p, i) => (
            <ProductRow key={p.id} p={p} i={i} visible={mounted} />
          ))}
        </section>

        {/* ── CREDIBILITY ─────────────────────────────────────────────────── */}
        <section ref={credRef} style={{ background: "#0F0E0E", padding: "100px 40px" }}>
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
                letterSpacing: "0.2em", color: "rgba(245,243,236,0.35)",
                textTransform: "uppercase", display: "block", marginBottom: "20px",
              }}>
                Built by
              </span>
              <h2 style={{
                fontFamily: "'Fraunces',Georgia,serif", fontWeight: 900,
                fontSize: "clamp(2.5rem,5vw,4.5rem)", letterSpacing: "-0.04em",
                lineHeight: 0.93, color: "#F5F3EC", margin: "0 0 28px",
              }}>
                A security analyst.
                <br />
                <em style={{ fontWeight: 300, color: "rgba(245,243,236,0.35)" }}>
                  Not a startup.
                </em>
              </h2>
              <p style={{ fontSize: "15px", color: "rgba(245,243,236,0.5)", lineHeight: 1.8, maxWidth: "380px", margin: 0 }}>
                Every tool is built by one OSCP-certified person. No investors, no growth team, no dark patterns. If it&apos;s on Zenkai, it works.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              {[
                { t: "OSCP Certified", d: "Offensive Security Certified Professional. The industry standard for penetration testing.", a: "#0284C7" },
                { t: "Bootstrapped", d: "Zero VC funding. All decisions based on what's good for users — not investors.", a: "#15803D" },
                { t: "Privacy-first", d: "Your data stays yours. No ads, no profiling, no data selling.", a: "#B45309" },
                { t: "Fair pricing", d: "Built for students and freelancers. Not €300/month enterprise plans.", a: "#C2410C" },
              ].map((item, i) => (
                <div
                  key={item.t}
                  style={{
                    display: "flex", gap: "0", overflow: "hidden",
                    background: "rgba(245,243,236,0.04)",
                    border: "1px solid rgba(245,243,236,0.07)",
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
                    <p style={{ fontSize: "13px", color: "rgba(245,243,236,0.38)", lineHeight: 1.6, margin: 0 }}>
                      {item.d}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────────────── */}
        <section style={{ padding: "120px 40px", textAlign: "center" }}>
          <div style={{ maxWidth: "640px", margin: "0 auto" }}>
            <span style={{
              fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px",
              letterSpacing: "0.2em", color: "rgba(15,14,14,0.28)",
              textTransform: "uppercase", display: "block", marginBottom: "20px",
            }}>
              Get started
            </span>
            <h2 style={{
              fontFamily: "'Fraunces',Georgia,serif", fontWeight: 900,
              fontSize: "clamp(2.5rem,6vw,5rem)", letterSpacing: "-0.04em",
              lineHeight: 0.9, color: "#0F0E0E", margin: "0 0 24px",
            }}>
              Pick a tool.
              <br />
              <em style={{ fontWeight: 300, fontStyle: "italic" }}>Start for free.</em>
            </h2>
            <p style={{ fontSize: "16px", color: "rgba(15,14,14,0.43)", lineHeight: 1.75, marginBottom: "44px" }}>
              All tools have a free tier. No credit card. No bullshit.
            </p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="https://financios.zenkai.nl" style={{ padding: "14px 30px", background: "#15803D", color: "#fff", fontFamily: "'IBM Plex Mono',monospace", fontSize: "12px", fontWeight: 600, letterSpacing: "0.05em", textDecoration: "none", textTransform: "uppercase" }}>
                Financios
              </a>
              <a href="https://jobs.zenkai.nl" style={{ padding: "14px 30px", background: "#B45309", color: "#fff", fontFamily: "'IBM Plex Mono',monospace", fontSize: "12px", fontWeight: 600, letterSpacing: "0.05em", textDecoration: "none", textTransform: "uppercase" }}>
                Sollicitatie Coach
              </a>
            </div>
          </div>
        </section>

        {/* ── FOOTER ──────────────────────────────────────────────────────── */}
        <footer style={{ borderTop: "2px solid #0F0E0E", padding: "36px 40px" }}>
          <div
            className="footer-inner"
            style={{
              maxWidth: "1280px", margin: "0 auto",
              display: "flex", justifyContent: "space-between",
              alignItems: "center", flexWrap: "wrap", gap: "20px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <span style={{ fontFamily: "'Fraunces',Georgia,serif", fontWeight: 700, fontStyle: "italic", fontSize: "19px", letterSpacing: "-0.03em" }}>
                Zenkai
              </span>
              <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "rgba(15,14,14,0.28)" }}>
                © 2026
              </span>
            </div>
            <div style={{ display: "flex", gap: "28px", flexWrap: "wrap" }}>
              {PRODUCTS.map((p) => (
                <a key={p.id} href={p.href} style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "rgba(15,14,14,0.35)", textDecoration: "none" }}>
                  {p.name}
                </a>
              ))}
            </div>
            <div style={{ display: "flex", gap: "22px" }}>
              <Link href="/privacy" style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "rgba(15,14,14,0.28)", textDecoration: "none" }}>Privacy</Link>
              <Link href="/terms" style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "rgba(15,14,14,0.28)", textDecoration: "none" }}>Terms</Link>
              <a href="mailto:hi@zenkai.nl" style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "rgba(15,14,14,0.28)", textDecoration: "none" }}>Contact</a>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
