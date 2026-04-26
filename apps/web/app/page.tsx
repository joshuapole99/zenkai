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
    name: "Scan",
    tagline: "Automated domain security audit. PDF report in minutes.",
    desc: "7-point security check: SSL, DNS, headers, open ports, email auth, vulnerabilities, reputation.",
    status: "coming-soon" as const,
    href: "https://scan.zenkai.nl",
    accent: "#0284C7", accentBg: "rgba(2,132,199,0.06)", word: "Security.",
  },
  {
    num: "02", id: "fin", category: "FINANCE",
    name: "Goals",
    tagline: "Financial clarity for students and Gen Z.",
    desc: "Budgeting, subscription tracking, financial goals — built for people who want clarity, not complexity.",
    status: "live" as const,
    href: "https://goals.zenkai.nl",
    accent: "#15803D", accentBg: "rgba(21,128,61,0.06)", word: "Finance.",
  },
  {
    num: "03", id: "job", category: "CAREER",
    name: "Job",
    tagline: "CV score, cover letter, interview prep.",
    desc: "AI-powered Dutch job coaching. Get your CV scored, cover letter reviewed, and interview questions prepped.",
    status: "live" as const,
    href: "https://job.zenkai.nl",
    accent: "#B45309", accentBg: "rgba(180,83,9,0.06)", word: "Career.",
  },
  {
    num: "04", id: "fit", category: "FITNESS",
    name: "Workout",
    tagline: "The comeback fitness app. No guilt trips.",
    desc: "Daily quest, XP system, streak tracking with a grace day mechanic. Level up your fitness — no shame.",
    status: "live" as const,
    href: "https://workout.zenkai.nl",
    accent: "#C2410C", accentBg: "rgba(194,65,12,0.06)", word: "Fitness.",
  },
];

const POSTS = [
  {
    date: "2026-04-01", cat: "SECURITY",
    title: "Why I built Scan instead of using existing tools",
    excerpt: "Most security scanners are either too expensive, too complex, or built for enterprises. I wanted something a freelancer could run on their own domain in 30 seconds.",
    accent: "#0284C7",
  },
  {
    date: "2026-03-12", cat: "BUILDING IN PUBLIC",
    title: "One year building Zenkai: what worked, what didn't",
    excerpt: "No co-founder, no investors, no marketing budget. Just shipping tools I actually use. Here's what the numbers look like after 12 months.",
    accent: "#15803D",
  },
  {
    date: "2026-02-28", cat: "OSCP",
    title: "How getting OSCP changed how I build software",
    excerpt: "OSCP isn't just a certification — it's a mindset shift. It changed how I think about every API, every form, and every login page I build.",
    accent: "#B45309",
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
        background: hovered ? p.accentBg : "rgba(15,14,14,0.02)",
        border: "1px solid rgba(15,14,14,0.09)",
        borderTop: `3px solid ${hovered ? p.accent : "rgba(15,14,14,0.09)"}`,
        padding: "28px 28px 24px",
        transition: "background 0.3s ease, border-color 0.3s ease",
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(20px)",
        transitionProperty: "background, border-color, opacity, transform",
        transitionDuration: `0.3s, 0.3s, 0.55s, 0.55s`,
        transitionTimingFunction: "ease, ease, cubic-bezier(.22,1,.36,1), cubic-bezier(.22,1,.36,1)",
        transitionDelay: `0s, 0s, ${i * 0.1 + 0.2}s, ${i * 0.1 + 0.2}s`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
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
            border: p.status === "live" ? `1px solid ${p.accent}` : "1px solid rgba(15,14,14,0.15)",
            color: p.status === "live" ? p.accent : "rgba(15,14,14,0.35)",
          }}>
            {p.status === "live" ? "LIVE" : "SOON"}
          </span>
          <span style={{
            fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px",
            color: "rgba(15,14,14,0.2)",
          }}>
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
        color: "rgba(15,14,14,0.4)", margin: "0 0 16px", lineHeight: 1.5,
      }}>
        {p.tagline}
      </p>
      <p style={{
        fontSize: "13.5px", color: "rgba(15,14,14,0.45)", lineHeight: 1.7, margin: "0 0 24px",
      }}>
        {p.desc}
      </p>

      <div style={{
        display: "flex", alignItems: "center", gap: "6px",
        fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px",
        color: hovered ? p.accent : "rgba(15,14,14,0.3)",
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
        ::selection { background: #0F0E0E; color: #F5F3EC; }
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
            background: "#F5F3EC",
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
              { l: "Tools", h: "#tools", internal: false },
              { l: "Scan", h: "https://scan.zenkai.nl", internal: false },
              { l: "Goals", h: "https://goals.zenkai.nl", internal: false },
              { l: "Job", h: "https://job.zenkai.nl", internal: false },
              { l: "Workout", h: "https://workout.zenkai.nl", internal: false },
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
            <a href="mailto:hi@zenkai.nl" style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "12px", color: "rgba(15,14,14,0.35)", textDecoration: "none" }}>
              hi@zenkai.nl
            </a>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "rgba(15,14,14,0.22)" }}>
              © Zenkai 2026
            </span>
          </div>
        </div>
      )}

      <main style={{ minHeight: "100vh", background: "#F5F3EC", color: "#0F0E0E", overflowX: "hidden" }}>

        {/* ── NAV ─────────────────────────────────────────────────────────── */}
        <nav style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
          height: "60px", display: "flex", alignItems: "center",
          justifyContent: "space-between", padding: "0 40px",
          background: "rgba(245,243,236,0.92)", backdropFilter: "blur(20px)",
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
              { l: "Goals", h: "https://goals.zenkai.nl" },
              { l: "Job", h: "https://job.zenkai.nl" },
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
              Explore Tools ↓
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
            <div style={{ width: "28px", height: "1px", background: "rgba(15,14,14,0.3)" }} />
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", letterSpacing: "0.2em", color: "rgba(15,14,14,0.4)", textTransform: "uppercase" }}>
              zenkai.nl — platform
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
              <a href="#tools" style={{
                padding: "13px 26px", background: "#0F0E0E", color: "#F5F3EC",
                fontFamily: "'IBM Plex Mono',monospace", fontSize: "12px", fontWeight: 600,
                letterSpacing: "0.05em", textDecoration: "none", textTransform: "uppercase",
                display: "inline-block",
              }}>
                Explore Tools ↓
              </a>
              <a href="#about" style={{
                padding: "13px 26px", border: "1px solid rgba(15,14,14,0.18)",
                color: "rgba(15,14,14,0.55)", fontFamily: "'IBM Plex Mono',monospace",
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
              paddingTop: "32px", borderTop: "1px solid rgba(15,14,14,0.1)",
              opacity: mounted ? 1 : 0, animation: mounted ? "hf .6s ease .48s both" : "none",
            }}
          >
            {[
              { v: "4", l: "Tools" },
              { v: "3", l: "Live now" },
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

        {/* ── TOOLS CARDS ─────────────────────────────────────────────────── */}
        <section id="tools" style={{
          padding: "80px 40px 100px", maxWidth: "1280px", margin: "0 auto",
        }}>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "baseline",
            paddingBottom: "20px", marginBottom: "32px",
            borderBottom: "2px solid #0F0E0E",
          }}>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", fontWeight: 600, letterSpacing: "0.2em", color: "rgba(15,14,14,0.4)", textTransform: "uppercase" }}>
              Tools
            </span>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "rgba(15,14,14,0.3)" }}>
              3 live · 1 launching 2026
            </span>
          </div>
          <div
            className="cards-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1px",
              background: "rgba(15,14,14,0.09)",
              border: "1px solid rgba(15,14,14,0.09)",
            }}
          >
            {PRODUCTS.map((p, i) => (
              <ProductCard key={p.id} p={p} i={i} visible={mounted} />
            ))}
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
                letterSpacing: "0.2em", color: "rgba(245,243,236,0.35)",
                textTransform: "uppercase", display: "block", marginBottom: "20px",
              }}>
                About
              </span>
              <h2 style={{
                fontFamily: "'Fraunces',Georgia,serif", fontWeight: 900,
                fontSize: "clamp(2.5rem,5vw,4.5rem)", letterSpacing: "-0.04em",
                lineHeight: 0.93, color: "#F5F3EC", margin: "0 0 28px",
              }}>
                Ik bouw tools
                <br />
                <em style={{ fontWeight: 300, color: "rgba(245,243,236,0.35)" }}>
                  die ik zelf wilde.
                </em>
              </h2>
              <p style={{ fontSize: "15px", color: "rgba(245,243,236,0.5)", lineHeight: 1.8, maxWidth: "400px", margin: "0 0 20px" }}>
                Ik ben Joshua Pole — OSCP-gecertificeerd security analyst en maker van Zenkai. Geen VC-funding, geen groei-team, geen dark patterns.
              </p>
              <p style={{ fontSize: "15px", color: "rgba(245,243,236,0.35)", lineHeight: 1.8, maxWidth: "400px", margin: 0 }}>
                Elk tool is gebouwd omdat ik het zelf miste. Als het op Zenkai staat, werkt het.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              {[
                { t: "OSCP Certified", d: "Offensive Security Certified Professional. The industry standard for penetration testing.", a: "#0284C7" },
                { t: "Bootstrapped", d: "Nul VC-funding. Alle beslissingen zijn gebaseerd op wat goed is voor gebruikers — niet investeerders.", a: "#15803D" },
                { t: "Privacy-first", d: "Jouw data blijft van jou. Geen advertenties, geen profiling, geen data-verkoop.", a: "#B45309" },
                { t: "Eerlijke prijzen", d: "Gebouwd voor studenten en freelancers. Geen €300/maand enterprise-plannen.", a: "#C2410C" },
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

        {/* ── BLOG ────────────────────────────────────────────────────────── */}
        <section style={{ padding: "100px 40px", maxWidth: "1280px", margin: "0 auto" }}>
          <div ref={blogRef} style={{
            display: "flex", justifyContent: "space-between", alignItems: "baseline",
            paddingBottom: "20px", marginBottom: "40px",
            borderBottom: "2px solid #0F0E0E",
          }}>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", fontWeight: 600, letterSpacing: "0.2em", color: "rgba(15,14,14,0.4)", textTransform: "uppercase" }}>
              Writing
            </span>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "rgba(15,14,14,0.3)" }}>
              Building in public
            </span>
          </div>
          <div
            className="blog-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "1px",
              background: "rgba(15,14,14,0.09)",
              border: "1px solid rgba(15,14,14,0.09)",
            }}
          >
            {POSTS.map((post, i) => (
              <div
                key={post.title}
                style={{
                  padding: "32px 28px",
                  background: "#F5F3EC",
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
                  <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "9px", color: "rgba(15,14,14,0.25)" }}>
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
                <p style={{ fontSize: "13.5px", color: "rgba(15,14,14,0.45)", lineHeight: 1.7, margin: "0 0 24px" }}>
                  {post.excerpt}
                </p>
                <span style={{
                  fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px",
                  color: "rgba(15,14,14,0.28)",
                }}>
                  Read →
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────────────── */}
        <section style={{ padding: "120px 40px", background: "#0F0E0E", textAlign: "center" }}>
          <div style={{ maxWidth: "640px", margin: "0 auto" }}>
            <span style={{
              fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px",
              letterSpacing: "0.2em", color: "rgba(245,243,236,0.3)",
              textTransform: "uppercase", display: "block", marginBottom: "20px",
            }}>
              Get started
            </span>
            <h2 style={{
              fontFamily: "'Fraunces',Georgia,serif", fontWeight: 900,
              fontSize: "clamp(2.5rem,6vw,5rem)", letterSpacing: "-0.04em",
              lineHeight: 0.9, color: "#F5F3EC", margin: "0 0 24px",
            }}>
              Pick a tool.
              <br />
              <em style={{ fontWeight: 300, fontStyle: "italic", color: "rgba(245,243,236,0.35)" }}>Start for free.</em>
            </h2>
            <p style={{ fontSize: "16px", color: "rgba(245,243,236,0.38)", lineHeight: 1.75, marginBottom: "44px" }}>
              All tools have a free tier. No credit card. No bullshit.
            </p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="https://goals.zenkai.nl" style={{ padding: "14px 30px", background: "#15803D", color: "#fff", fontFamily: "'IBM Plex Mono',monospace", fontSize: "12px", fontWeight: 600, letterSpacing: "0.05em", textDecoration: "none", textTransform: "uppercase" }}>
                Goals
              </a>
              <a href="https://job.zenkai.nl" style={{ padding: "14px 30px", background: "#B45309", color: "#fff", fontFamily: "'IBM Plex Mono',monospace", fontSize: "12px", fontWeight: 600, letterSpacing: "0.05em", textDecoration: "none", textTransform: "uppercase" }}>
                Job
              </a>
              <a href="https://scan.zenkai.nl" style={{ padding: "14px 30px", border: "1px solid rgba(245,243,236,0.2)", color: "rgba(245,243,236,0.6)", fontFamily: "'IBM Plex Mono',monospace", fontSize: "12px", letterSpacing: "0.05em", textDecoration: "none", textTransform: "uppercase" }}>
                Scan waitlist
              </a>
            </div>
          </div>
        </section>

        {/* ── FOOTER ──────────────────────────────────────────────────────── */}
        <footer style={{ borderTop: "1px solid rgba(245,243,236,0.08)", background: "#0F0E0E", padding: "36px 40px" }}>
          <div
            className="footer-inner"
            style={{
              maxWidth: "1280px", margin: "0 auto",
              display: "flex", justifyContent: "space-between",
              alignItems: "center", flexWrap: "wrap", gap: "20px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <span style={{ fontFamily: "'Fraunces',Georgia,serif", fontWeight: 700, fontStyle: "italic", fontSize: "19px", letterSpacing: "-0.03em", color: "#F5F3EC" }}>
                Zenkai
              </span>
              <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "rgba(245,243,236,0.2)" }}>
                © 2026
              </span>
            </div>
            <div style={{ display: "flex", gap: "28px", flexWrap: "wrap" }}>
              {PRODUCTS.map((p) => (
                <a key={p.id} href={p.href} style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "rgba(245,243,236,0.28)", textDecoration: "none" }}>
                  {p.name}
                </a>
              ))}
            </div>
            <div style={{ display: "flex", gap: "22px" }}>
              <Link href="/privacy" style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "rgba(245,243,236,0.2)", textDecoration: "none" }}>Privacy</Link>
              <Link href="/terms" style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "rgba(245,243,236,0.2)", textDecoration: "none" }}>Terms</Link>
              <a href="mailto:hi@zenkai.nl" style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "rgba(245,243,236,0.2)", textDecoration: "none" }}>Contact</a>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
