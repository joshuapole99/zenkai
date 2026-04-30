"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

const PRODUCTS = [
  { id: "scan",    name: "Scan",    sub: "Quick Scan + Full Scan. PDF rapport per domein.",      href: "https://scan.zenkai.nl", accent: "#0284C7", status: "Live" },
  { id: "cve",     name: "CVE Intel", sub: "Shodan-powered CVE monitoring voor jouw IP-ranges.", href: "#",                      accent: "#DC2626", status: "Soon" },
  { id: "phish",   name: "Phishing", sub: "Lookalike domein detectie + DMARC/SPF analyse.",      href: "#",                      accent: "#EA580C", status: "Soon" },
  { id: "report",  name: "Reports",  sub: "Client-ready pentest rapporten in minuten.",           href: "#",                      accent: "#7C3AED", status: "Soon" },
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
            Ik ben Joshua, security analyst en officer bij Enreach. In mijn vrije tijd
            bouw ik Zenkai — security tools voor iedereen die serieus wil weten hoe
            hun domein ervoor staat.
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
              { num: "02", label: "Ervaring", value: "5+ jaar", sub: "Security analyst bij Enreach. Incidents, Sentinel & Defender, pentestcoördinatie." },
              { num: "03", label: "Funding", value: "€0 VC", sub: "Geen investeerders. Gebouwd in vrije tijd." },
              { num: "04", label: "Locatie", value: "Utrecht", sub: "Gebouwd in vrije tijd, voor freelancers, developers en bedrijven." },
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
        <div style={{ maxWidth: "720px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "48px" }}>
          {[
            { label: "Hoe ik hier beland ben", body: "Ik ben altijd bezig geweest met dingen uitproberen die eigenlijk niet mochten. Android telefoons rooten, wii's ombouwen, mods installeren — gewoon om te kijken hoe het werkte. Geen plan, gewoon nieuwsgierigheid." },
            { label: null, body: "Ik begon met een studie game development en webdevelopment, maar de game industrie is klein en moeilijk in te komen. Cybersecurity leek een logische stap. Wat ik niet verwachtte: dat ik het echt leuk zou vinden." },
            { label: null, body: "Binnen twee jaar haalde ik mijn HBO AD. Een jaar later mijn OSCP. Tijdens mijn stage bij Secured by Design werkte ik als pentester en ze boden me een traineeship aan. Uiteindelijk ben ik naar Enreach gegaan als security analyst." },
            { label: "Wat ik doe bij Enreach", body: "Ik werk dagelijks met Microsoft Sentinel en Defender — security incidents detecteren en afhandelen. Daarnaast organiseer ik alle pentests voor de applicaties van Enreach: scope bepalen, inplannen met Secured by Design, en zorgen dat findings ook echt opgepakt worden. Soms verifieer ik zelf of een fix werkt." },
            { label: null, body: "Van alles wat ik doe vind ik pentesten nog steeds het leukste. Het is een soort spel en als je dan een finding doet geeft dat echt een kick. Een beetje zoals die hackers in films die zeggen \"I'm in the mainframe.\" Maar dan echt." },
            { label: "Waarom Zenkai", body: "Zenkai begon als een scanner die ik zelf wilde gebruiken. De meeste goede security tools kosten honderden euro's per maand of vragen een enterprise demo aan. Dat werkt niet als je gewoon snel wil weten hoe je domein ervoor staat." },
            { label: null, body: "Ik heb meerdere side projects geprobeerd. Geen van allemaal werkte. Uiteindelijk kwam ik steeds terug bij het enige waar ik echt goed in ben en het leukst vind: security. Dus bouw ik het zelf — van gratis domeincheck tot full scan met Shodan, SQLMap en ZAP. Geen team, geen investeerders. Gewoon bouwen." },
            { label: "Voor wie", body: "Zenkai Scan heeft een plan voor elke situatie. Gratis voor een snelle eenmalige check. Starter voor freelancers en developers die regelmatig willen scannen. Pro voor IT teams en agencies met meerdere domeinen. Enterprise voor organisaties die IP-ranges willen monitoren of een dedicated rapport nodig hebben." },
            { label: null, body: "Het enige wat ze gemeen hebben: niemand hoeft een demo aan te vragen of een NDA te tekenen om te beginnen." },
          ].map((item, i) => (
            <Reveal key={i} delay={i * 0.04}>
              <div>
                {item.label && (
                  <p style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "11px", letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "rgba(15,14,14,0.3)",
                    marginBottom: "12px", marginTop: 0,
                  }}>{item.label}</p>
                )}
                <p style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontSize: "18px", fontWeight: 300, lineHeight: 1.75,
                  color: "rgba(15,14,14,0.7)",
                  margin: 0,
                  borderLeft: item.label ? "2px solid rgba(15,14,14,0.15)" : "none",
                  paddingLeft: item.label ? "20px" : "0",
                }}>{item.body}</p>
              </div>
            </Reveal>
          ))}
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
            }}>Platform — security tools</p>
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
