"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

const PRODUCTS = [
  { id: "scan",    name: "Scan",    sub: "Domein security",   href: "https://scan.zenkai.nl",    accent: "#0284C7", status: "Beta" },
  { id: "goals",   name: "Goals",   sub: "Financiële helderheid", href: "https://goals.zenkai.nl", accent: "#16A34A", status: "Live" },
  { id: "job",     name: "Job",     sub: "CV + sollicitatiebegeleiding", href: "https://job.zenkai.nl",   accent: "#7C3AED", status: "Live" },
  { id: "workout", name: "Workout", sub: "Fitness comeback mechanic", href: "https://workout.zenkai.nl", accent: "#EA580C", status: "Live" },
];

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useInView();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(20px)",
      transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
    }}>
      {children}
    </div>
  );
}

export default function AboutPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,300;1,9..144,700&family=IBM+Plex+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; }
      `}</style>

      {/* ── HERO (dark) ────────────────────────────────────── */}
      <section style={{
        background: "#0F0E0E",
        padding: "clamp(80px, 12vw, 140px) clamp(24px, 6vw, 80px)",
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}>
        <div style={{ maxWidth: "900px" }}>
          <p style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "11px", letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(245,243,236,0.3)",
            marginBottom: "32px",
          }}>
            Joshua Pole — Security Analyst & Maker
          </p>
          <h1 style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: "clamp(44px, 8vw, 88px)",
            fontWeight: 900,
            lineHeight: 0.95,
            letterSpacing: "-0.04em",
            color: "#F5F3EC",
            margin: "0 0 40px",
          }}>
            Ik bouw tools die ik<br />
            <em style={{ fontStyle: "italic", fontWeight: 300 }}>zelf wilde hebben.</em>
          </h1>
          <p style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: "clamp(17px, 2.5vw, 22px)",
            fontWeight: 300,
            lineHeight: 1.65,
            color: "rgba(245,243,236,0.6)",
            maxWidth: "600px",
          }}>
            Ik ben Joshua — security analyst, ethical hacker, en maker van Zenkai.
            Overdag werk ik als security analyst bij Enreach. In het weekend bouw ik
            tools die ik zelf wilde maar niet kon betalen.
          </p>
        </div>
      </section>

      {/* ── CREDENTIALS ──────────────────────────────────────── */}
      <section style={{
        background: "#F5F3EC",
        padding: "clamp(64px, 10vw, 100px) clamp(24px, 6vw, 80px)",
        borderBottom: "1px solid rgba(15,14,14,0.08)",
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <Reveal>
            <p style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "11px", letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(15,14,14,0.3)",
              marginBottom: "48px",
            }}>Achtergrond</p>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1px", background: "rgba(15,14,14,0.08)" }}>
            {[
              { num: "01", label: "Certificering", value: "OSCP", sub: "Offensive Security Certified Professional" },
              { num: "02", label: "Ervaring", value: "5+ jaar", sub: "Security analyst @ Enreach. Pentesting, hardening, vulnerability assessment." },
              { num: "03", label: "Funding", value: "€0 VC", sub: "Geen investeerders. Gebouwd in vrije tijd, voor echte mensen." },
              { num: "04", label: "Locatie", value: "Nederland", sub: "Amsterdam. Tools voor studenten, freelancers en zzp'ers." },
            ].map((c, i) => (
              <Reveal key={c.num} delay={i * 0.08}>
                <div style={{
                  background: "#F5F3EC",
                  padding: "36px 32px",
                  display: "flex", flexDirection: "column", gap: "10px",
                }}>
                  <span style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "10px", letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "rgba(15,14,14,0.28)",
                  }}>{c.num} — {c.label}</span>
                  <span style={{
                    fontFamily: "'Fraunces', Georgia, serif",
                    fontSize: "28px", fontWeight: 700,
                    color: "#0F0E0E", lineHeight: 1,
                    letterSpacing: "-0.02em",
                  }}>{c.value}</span>
                  <span style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "12px", lineHeight: 1.5,
                    color: "rgba(15,14,14,0.45)",
                  }}>{c.sub}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── STORY ────────────────────────────────────────────── */}
      <section style={{
        background: "#F5F3EC",
        padding: "clamp(64px, 10vw, 100px) clamp(24px, 6vw, 80px)",
      }}>
        <div data-about-story="" style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "start" }}>
          <Reveal>
            <p style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "11px", letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(15,14,14,0.3)",
              marginBottom: "24px",
            }}>Waarom Zenkai</p>
            <h2 style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: "clamp(32px, 5vw, 52px)",
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "#0F0E0E",
              margin: 0,
            }}>
              Elke tool begon<br />als een eigen probleem.
            </h2>
          </Reveal>

          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {[
              "Elk tool op Zenkai is gebouwd omdat het probleem echt is en de bestaande oplossingen te duur, te complex, of gewoon slecht zijn.",
              "Scan: geen security scanner was betaalbaar voor een freelancer. Job: ik zag hoeveel mensen CV's sturen die niemand leest. Goals: niemand legde studenten eerlijk uit waar hun geld bleef.",
              "Workout: consistentie is moeilijker dan motivatie. De grace day mechanic bestaat omdat ik hem zelf nodig had — niet om perfect te zijn, maar om niet te stoppen.",
              "OSCP gecertificeerd. Geen VC funding. Geen team. Gewoon bouwen.",
            ].map((p, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <p style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontSize: "17px",
                  fontWeight: 300,
                  lineHeight: 1.7,
                  color: "rgba(15,14,14,0.7)",
                  margin: 0,
                  borderLeft: "2px solid rgba(15,14,14,0.1)",
                  paddingLeft: "20px",
                }}>{p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCTS ─────────────────────────────────────────── */}
      <section style={{
        background: "#0F0E0E",
        padding: "clamp(64px, 10vw, 100px) clamp(24px, 6vw, 80px)",
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <Reveal>
            <p style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "11px", letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(245,243,236,0.3)",
              marginBottom: "48px",
            }}>Platform — vier tools</p>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1px", background: "rgba(245,243,236,0.06)" }}>
            {PRODUCTS.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.08}>
                <a href={p.href} style={{
                  display: "block", padding: "36px 32px",
                  background: "#0F0E0E",
                  textDecoration: "none",
                  transition: "background 0.2s",
                  borderTop: `2px solid ${p.accent}`,
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(245,243,236,0.03)")}
                onMouseLeave={e => (e.currentTarget.style.background = "#0F0E0E")}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,243,236,0.25)" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: "10px", letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      padding: "3px 8px",
                      color: p.accent,
                      border: `1px solid ${p.accent}`,
                      opacity: 0.7,
                    }}>{p.status}</span>
                  </div>
                  <h3 style={{
                    fontFamily: "'Fraunces', Georgia, serif",
                    fontSize: "32px", fontWeight: 700,
                    color: "#F5F3EC", margin: "0 0 8px",
                    letterSpacing: "-0.02em", lineHeight: 1,
                  }}>{p.name}</h3>
                  <p style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "12px", lineHeight: 1.5,
                    color: "rgba(245,243,236,0.35)",
                    margin: "0 0 24px",
                  }}>{p.sub}</p>
                  <span style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "11px", letterSpacing: "0.04em",
                    color: p.accent,
                  }}>Bekijk →</span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section style={{
        background: "#F5F3EC",
        padding: "clamp(80px, 12vw, 120px) clamp(24px, 6vw, 80px)",
        borderTop: "1px solid rgba(15,14,14,0.08)",
      }}>
        <div style={{ maxWidth: "700px" }}>
          <Reveal>
            <h2 style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: "clamp(36px, 6vw, 60px)",
              fontWeight: 700, lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "#0F0E0E",
              margin: "0 0 24px",
            }}>
              Geen pitch. Geen waitlist.<br />
              <em style={{ fontWeight: 300, fontStyle: "italic" }}>Gewoon proberen.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: "18px", fontWeight: 300, lineHeight: 1.65,
              color: "rgba(15,14,14,0.55)",
              margin: "0 0 40px", maxWidth: "520px",
            }}>
              Elke tool heeft een gratis tier. Je kunt ze nu meteen gebruiken.
              Als ze jou helpen, hoor ik dat graag.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link href="/" style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "13px", letterSpacing: "0.04em",
                padding: "14px 28px",
                background: "#0F0E0E", color: "#F5F3EC",
                textDecoration: "none",
              }}>
                Bekijk alle tools →
              </Link>
              <a href="mailto:joshuapole@live.nl" style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "13px", letterSpacing: "0.04em",
                padding: "14px 28px",
                background: "transparent", color: "rgba(15,14,14,0.5)",
                border: "1px solid rgba(15,14,14,0.15)",
                textDecoration: "none",
              }}>
                Stuur een mail
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── MOBILE: collapse story grid ──────────────────────── */}
      <style>{`
        @media (max-width: 768px) {
          [data-about-story] { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </>
  );
}
