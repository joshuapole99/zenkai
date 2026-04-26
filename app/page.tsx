"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// ── Types ─────────────────────────────────────────────────────────────────────

type ProductStatus = "live" | "coming-soon";

interface Product {
  id: string;
  name: string;
  category: string;
  tagline: string;
  desc: string;
  status: ProductStatus;
  href: string;
  accent: string;
  accentDim: string;
  accentBorder: string;
  index: number;
}

// ── Data ──────────────────────────────────────────────────────────────────────

const PRODUCTS: Product[] = [
  {
    id: "sensorscan",
    name: "SenseiScan",
    category: "SECURITY",
    tagline: "Automated domain security audit — delivered as a PDF.",
    desc: "Open ports, leaked credentials, SPF/DMARC/DKIM, VirusTotal reputation, SSL health, and OWASP indicators. One report. Plain Dutch.",
    status: "coming-soon",
    href: "https://scanner.zenkai.nl",
    accent: "#06B6D4",
    accentDim: "rgba(6,182,212,0.10)",
    accentBorder: "rgba(6,182,212,0.30)",
    index: 0,
  },
  {
    id: "financios",
    name: "Financios",
    category: "FINANCE",
    tagline: "Financial clarity for students and Gen Z.",
    desc: "Track spending, set goals, and understand your money — without a finance degree or €300/year subscription.",
    status: "live",
    href: "https://financios.zenkai.nl",
    accent: "#10B981",
    accentDim: "rgba(16,185,129,0.10)",
    accentBorder: "rgba(16,185,129,0.30)",
    index: 1,
  },
  {
    id: "jobs",
    name: "Sollicitatie Coach",
    category: "CAREER",
    tagline: "CV score, cover letter, interview prep.",
    desc: "Upload your CV, get a score and concrete improvements. Generate a targeted cover letter in one click. Built for the Dutch job market.",
    status: "live",
    href: "https://jobs.zenkai.nl",
    accent: "#F59E0B",
    accentDim: "rgba(245,158,11,0.10)",
    accentBorder: "rgba(245,158,11,0.30)",
    index: 2,
  },
  {
    id: "workout",
    name: "Zenkai Workout",
    category: "FITNESS",
    tagline: "The comeback fitness app. No guilt trips.",
    desc: "Design your own workouts. Track streaks. When you miss a week, Zenkai adapts your comeback session instead of punishing you.",
    status: "coming-soon",
    href: "https://workout.zenkai.nl",
    accent: "#FF6B35",
    accentDim: "rgba(255,107,53,0.10)",
    accentBorder: "rgba(255,107,53,0.30)",
    index: 3,
  },
];

// ── Background ────────────────────────────────────────────────────────────────

function HubBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {/* Dot grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 100%)",
        }}
      />
      {/* Orange glow top-left */}
      <div
        className="absolute"
        style={{
          top: "-200px",
          left: "-100px",
          width: "600px",
          height: "500px",
          background:
            "radial-gradient(ellipse, rgba(255,107,53,0.07) 0%, transparent 65%)",
        }}
      />
      {/* Cyan glow top-right */}
      <div
        className="absolute"
        style={{
          top: "-100px",
          right: "-80px",
          width: "500px",
          height: "400px",
          background:
            "radial-gradient(ellipse, rgba(6,182,212,0.06) 0%, transparent 65%)",
        }}
      />
      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(9,9,15,0.6) 100%)",
        }}
      />
    </div>
  );
}

// ── Product Card ──────────────────────────────────────────────────────────────

function ProductCard({ product, visible }: { product: Product; visible: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={product.href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "block",
        padding: "40px 36px 36px",
        background: hovered ? product.accentDim : "rgba(255,255,255,0.018)",
        border: `1px solid ${hovered ? product.accentBorder : "rgba(255,255,255,0.07)"}`,
        textDecoration: "none",
        position: "relative",
        overflow: "hidden",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.65s cubic-bezier(0.22,1,0.36,1) ${product.index * 0.1 + 0.15}s, transform 0.65s cubic-bezier(0.22,1,0.36,1) ${product.index * 0.1 + 0.15}s, background 0.25s ease, border-color 0.25s ease`,
        cursor: "pointer",
      }}
    >
      {/* Top accent bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: product.accent,
          opacity: hovered ? 1 : 0.6,
          transition: "opacity 0.25s ease",
        }}
      />

      {/* Card header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "36px",
        }}
      >
        <span
          style={{
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.25em",
            color: product.accent,
            textTransform: "uppercase",
            fontFamily: "monospace",
          }}
        >
          {product.category}
        </span>
        <span
          style={{
            fontSize: "10px",
            fontWeight: 700,
            padding: "3px 9px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            border:
              product.status === "live"
                ? "1px solid rgba(34,197,94,0.35)"
                : "1px solid rgba(255,255,255,0.1)",
            color:
              product.status === "live"
                ? "#22c55e"
                : "rgba(255,255,255,0.3)",
          }}
        >
          {product.status === "live" ? "Live" : "Coming soon"}
        </span>
      </div>

      {/* Name */}
      <h2
        style={{
          fontFamily: "var(--font-syne), sans-serif",
          fontWeight: 800,
          fontSize: "clamp(1.6rem, 2.5vw, 2rem)",
          letterSpacing: "-0.03em",
          color: "#fff",
          marginBottom: "12px",
          lineHeight: 1.05,
        }}
      >
        {product.name}
      </h2>

      {/* Tagline */}
      <p
        style={{
          fontSize: "14px",
          color: "rgba(228,228,240,0.55)",
          lineHeight: 1.6,
          marginBottom: "14px",
          fontWeight: 500,
        }}
      >
        {product.tagline}
      </p>

      {/* Description */}
      <p
        style={{
          fontSize: "13px",
          color: "rgba(228,228,240,0.3)",
          lineHeight: 1.65,
          marginBottom: "36px",
        }}
      >
        {product.desc}
      </p>

      {/* CTA */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "12px",
          fontWeight: 700,
          letterSpacing: "0.1em",
          color: product.accent,
          textTransform: "uppercase",
        }}
      >
        <span>{product.status === "live" ? "Open →" : "Notify me →"}</span>
      </div>
    </a>
  );
}

// ── Stats Row ─────────────────────────────────────────────────────────────────

function StatsRow({ visible }: { visible: boolean }) {
  const stats = [
    { value: "4", label: "Tools" },
    { value: "2", label: "Live now" },
    { value: "OSCP", label: "Certified builder" },
    { value: "0", label: "VC funding" },
  ];

  return (
    <div
      style={{
        display: "flex",
        gap: "0",
        marginTop: "64px",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.7s cubic-bezier(0.22,1,0.36,1) 0.55s, transform 0.7s cubic-bezier(0.22,1,0.36,1) 0.55s",
      }}
    >
      {stats.map((s, i) => (
        <div
          key={s.label}
          style={{
            flex: 1,
            padding: "24px 0",
            paddingLeft: i === 0 ? 0 : "32px",
            borderLeft: i === 0 ? "none" : "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-syne), sans-serif",
              fontWeight: 800,
              fontSize: "1.5rem",
              color: "#fff",
              letterSpacing: "-0.02em",
              marginBottom: "4px",
            }}
          >
            {s.value}
          </p>
          <p
            style={{
              fontSize: "12px",
              color: "rgba(228,228,240,0.35)",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            {s.label}
          </p>
        </div>
      ))}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function HubHome() {
  const [visible, setVisible] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    const onScroll = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <main style={{ minHeight: "100vh", background: "#09090f", color: "#e4e4f0" }}>

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 40px",
          height: "64px",
          background: navScrolled
            ? "rgba(9,9,15,0.92)"
            : "transparent",
          backdropFilter: navScrolled ? "blur(20px)" : "none",
          borderBottom: navScrolled
            ? "1px solid rgba(255,255,255,0.06)"
            : "1px solid transparent",
          transition: "background 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span
            style={{
              fontFamily: "var(--font-syne), sans-serif",
              fontWeight: 800,
              fontSize: "18px",
              letterSpacing: "-0.03em",
              color: "#fff",
            }}
          >
            ZENKAI
          </span>
          <span
            style={{
              fontSize: "9px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              padding: "3px 7px",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.35)",
              textTransform: "uppercase",
            }}
          >
            PLATFORM
          </span>
        </div>

        <div
          className="hidden sm:flex"
          style={{ gap: "32px", alignItems: "center" }}
        >
          {[
            { label: "SenseiScan", href: "https://scanner.zenkai.nl" },
            { label: "Financios", href: "https://financios.zenkai.nl" },
            { label: "Jobs", href: "https://jobs.zenkai.nl" },
            { label: "Workout", href: "https://workout.zenkai.nl" },
          ].map((l) => (
            <a
              key={l.label}
              href={l.href}
              style={{
                fontSize: "13px",
                color: "rgba(255,255,255,0.38)",
                textDecoration: "none",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.color = "#fff")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color =
                  "rgba(255,255,255,0.38)")
              }
            >
              {l.label}
            </a>
          ))}
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "120px 40px 80px",
          maxWidth: "1200px",
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        <HubBackground />

        {/* Eyebrow */}
        <p
          style={{
            fontFamily: "monospace",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(255,107,53,0.7)",
            marginBottom: "28px",
            position: "relative",
            zIndex: 1,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.6s ease 0.05s, transform 0.6s ease 0.05s",
          }}
        >
          zenkai.nl — one platform. four tools.
        </p>

        {/* Headline */}
        <h1
          style={{
            fontFamily: "var(--font-syne), sans-serif",
            fontWeight: 800,
            fontSize: "clamp(3.2rem, 8vw, 7.5rem)",
            lineHeight: 0.93,
            letterSpacing: "-0.04em",
            color: "#fff",
            marginBottom: "36px",
            maxWidth: "800px",
            position: "relative",
            zIndex: 1,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s cubic-bezier(0.22,1,0.36,1) 0.12s, transform 0.7s cubic-bezier(0.22,1,0.36,1) 0.12s",
          }}
        >
          One platform.
          <br />
          <span style={{ color: "#FF6B35" }}>Zero</span>
          <br />
          bullshit.
        </h1>

        {/* Subtext */}
        <p
          style={{
            fontSize: "clamp(15px, 2vw, 18px)",
            color: "rgba(228,228,240,0.5)",
            maxWidth: "460px",
            lineHeight: 1.72,
            marginBottom: "44px",
            position: "relative",
            zIndex: 1,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.7s cubic-bezier(0.22,1,0.36,1) 0.22s, transform 0.7s cubic-bezier(0.22,1,0.36,1) 0.22s",
          }}
        >
          Security scans, finance, job coaching, fitness — built for students, freelancers, and ambitious people. No enterprise pricing. No VC bullshit.
        </p>

        {/* CTAs */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            position: "relative",
            zIndex: 1,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 0.7s cubic-bezier(0.22,1,0.36,1) 0.32s, transform 0.7s cubic-bezier(0.22,1,0.36,1) 0.32s",
          }}
        >
          <a
            href="https://financios.zenkai.nl"
            style={{
              padding: "14px 28px",
              background: "#10B981",
              color: "#000",
              fontWeight: 800,
              fontSize: "13px",
              letterSpacing: "0.06em",
              textDecoration: "none",
              textTransform: "uppercase",
              display: "inline-block",
              transition: "opacity 0.2s ease",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.opacity = "0.85")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.opacity = "1")
            }
          >
            Try Financios →
          </a>
          <a
            href="#tools"
            style={{
              padding: "14px 28px",
              border: "1px solid rgba(255,255,255,0.14)",
              color: "rgba(255,255,255,0.55)",
              fontWeight: 600,
              fontSize: "13px",
              letterSpacing: "0.06em",
              textDecoration: "none",
              textTransform: "uppercase",
              display: "inline-block",
              transition: "border-color 0.2s ease, color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor =
                "rgba(255,255,255,0.35)";
              (e.currentTarget as HTMLElement).style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor =
                "rgba(255,255,255,0.14)";
              (e.currentTarget as HTMLElement).style.color =
                "rgba(255,255,255,0.55)";
            }}
          >
            All tools ↓
          </a>
        </div>

        <StatsRow visible={visible} />

        {/* Scroll indicator */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            right: "40px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            opacity: visible ? 0.35 : 0,
            transition: "opacity 0.7s ease 1s",
          }}
        >
          <div
            style={{
              width: "1px",
              height: "48px",
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)",
            }}
          />
          <span
            style={{
              fontSize: "9px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.5)",
              fontFamily: "monospace",
              writingMode: "vertical-rl",
              textOrientation: "mixed",
            }}
          >
            Scroll
          </span>
        </div>
      </section>

      {/* ── TOOLS GRID ───────────────────────────────────────────────────── */}
      <section
        id="tools"
        style={{
          padding: "80px 40px 120px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            marginBottom: "40px",
          }}
        >
          <p
            style={{
              fontFamily: "monospace",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.2)",
            }}
          >
            04 tools
          </p>
          <p
            style={{
              fontSize: "12px",
              color: "rgba(255,255,255,0.18)",
              fontFamily: "monospace",
            }}
          >
            2 live · 2 launching 2026
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          {PRODUCTS.map((p) => (
            <ProductCard key={p.id} product={p} visible={visible} />
          ))}
        </div>
      </section>

      {/* ── CREDIBILITY ──────────────────────────────────────────────────── */}
      <section
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.012)",
          padding: "100px 40px",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "80px",
            alignItems: "center",
          }}
          className="grid-cols-1 sm:grid-cols-2"
        >
          {/* Left */}
          <div>
            <p
              style={{
                fontFamily: "monospace",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "rgba(255,107,53,0.7)",
                marginBottom: "20px",
              }}
            >
              Built by
            </p>
            <h2
              style={{
                fontFamily: "var(--font-syne), sans-serif",
                fontWeight: 800,
                fontSize: "clamp(2rem, 4vw, 3rem)",
                letterSpacing: "-0.04em",
                color: "#fff",
                lineHeight: 1.05,
                marginBottom: "28px",
              }}
            >
              A security analyst.
              <br />
              <span style={{ color: "rgba(228,228,240,0.4)" }}>
                Not a startup.
              </span>
            </h2>
            <p
              style={{
                fontSize: "15px",
                color: "rgba(228,228,240,0.48)",
                lineHeight: 1.78,
                maxWidth: "420px",
              }}
            >
              Every tool on this platform is built by one person — OSCP certified, years in security consulting. No investors, no growth team, no dark patterns. If it&apos;s here, it&apos;s because it&apos;s actually useful.
            </p>
          </div>

          {/* Right */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {[
              {
                title: "OSCP Certified",
                desc: "Offensive Security Certified Professional — the industry standard for penetration testing.",
                accent: "#06B6D4",
              },
              {
                title: "Bootstrapped",
                desc: "Zero VC funding. No investors to answer to. Decisions based on what's actually good for users.",
                accent: "#10B981",
              },
              {
                title: "Privacy-first",
                desc: "No surveillance capitalism. Your data is yours. No ads, no selling, no profiling.",
                accent: "#F59E0B",
              },
              {
                title: "Fair pricing",
                desc: "Tools priced for students and freelancers. Not €500/month enterprise tiers.",
                accent: "#FF6B35",
              },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  padding: "20px 24px",
                  border: "1px solid rgba(255,255,255,0.07)",
                  display: "flex",
                  gap: "18px",
                  alignItems: "flex-start",
                  background: "rgba(255,255,255,0.015)",
                }}
              >
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: item.accent,
                    flexShrink: 0,
                    marginTop: "5px",
                    boxShadow: `0 0 8px ${item.accent}`,
                  }}
                />
                <div>
                  <p
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "#fff",
                      marginBottom: "4px",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {item.title}
                  </p>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "rgba(228,228,240,0.32)",
                      lineHeight: 1.6,
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ───────────────────────────────────────────────────── */}
      <section style={{ padding: "120px 40px" }}>
        <div
          style={{
            maxWidth: "700px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "monospace",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.2)",
              marginBottom: "24px",
            }}
          >
            Get started
          </p>
          <h2
            style={{
              fontFamily: "var(--font-syne), sans-serif",
              fontWeight: 800,
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              letterSpacing: "-0.04em",
              color: "#fff",
              lineHeight: 1.05,
              marginBottom: "24px",
            }}
          >
            Pick a tool.
            <br />
            Start for free.
          </h2>
          <p
            style={{
              fontSize: "16px",
              color: "rgba(228,228,240,0.45)",
              lineHeight: 1.7,
              marginBottom: "48px",
            }}
          >
            All tools have a free tier. No credit card required. No bullshit.
          </p>
          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <a
              href="https://financios.zenkai.nl"
              style={{
                padding: "14px 28px",
                background: "#10B981",
                color: "#000",
                fontWeight: 800,
                fontSize: "13px",
                letterSpacing: "0.06em",
                textDecoration: "none",
                textTransform: "uppercase",
              }}
            >
              Financios →
            </a>
            <a
              href="https://jobs.zenkai.nl"
              style={{
                padding: "14px 28px",
                background: "#F59E0B",
                color: "#000",
                fontWeight: 800,
                fontSize: "13px",
                letterSpacing: "0.06em",
                textDecoration: "none",
                textTransform: "uppercase",
              }}
            >
              Sollicitatie Coach →
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.07)",
          padding: "48px 40px",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "32px",
          }}
        >
          {/* Top row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: "32px",
            }}
          >
            <div>
              <span
                style={{
                  fontFamily: "var(--font-syne), sans-serif",
                  fontWeight: 800,
                  fontSize: "20px",
                  letterSpacing: "-0.03em",
                  color: "#fff",
                }}
              >
                ZENKAI
              </span>
              <p
                style={{
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.25)",
                  marginTop: "6px",
                  maxWidth: "240px",
                  lineHeight: 1.6,
                }}
              >
                One platform. Security, finance, career, fitness — built by a security analyst for real people.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: "48px",
                flexWrap: "wrap",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.2)",
                    marginBottom: "14px",
                    fontFamily: "monospace",
                  }}
                >
                  Tools
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  {PRODUCTS.map((p) => (
                    <a
                      key={p.id}
                      href={p.href}
                      style={{
                        fontSize: "13px",
                        color: "rgba(255,255,255,0.35)",
                        textDecoration: "none",
                        transition: "color 0.2s ease",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLElement).style.color = "#fff")
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLElement).style.color =
                          "rgba(255,255,255,0.35)")
                      }
                    >
                      <span
                        style={{
                          width: "5px",
                          height: "5px",
                          borderRadius: "50%",
                          background: p.accent,
                          flexShrink: 0,
                        }}
                      />
                      {p.name}
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <p
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.2)",
                    marginBottom: "14px",
                    fontFamily: "monospace",
                  }}
                >
                  Legal
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  {[
                    { label: "Privacy", href: "/privacy" },
                    { label: "Terms", href: "/terms" },
                    { label: "Contact", href: "mailto:hi@zenkai.nl" },
                  ].map((l) =>
                    l.href.startsWith("/") ? (
                      <Link
                        key={l.label}
                        href={l.href}
                        style={{
                          fontSize: "13px",
                          color: "rgba(255,255,255,0.35)",
                          textDecoration: "none",
                        }}
                      >
                        {l.label}
                      </Link>
                    ) : (
                      <a
                        key={l.label}
                        href={l.href}
                        style={{
                          fontSize: "13px",
                          color: "rgba(255,255,255,0.35)",
                          textDecoration: "none",
                        }}
                      >
                        {l.label}
                      </a>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
              paddingTop: "24px",
              borderTop: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <p
              style={{
                fontSize: "12px",
                color: "rgba(255,255,255,0.18)",
              }}
            >
              © 2026 Zenkai — All tools, one platform.
            </p>
            <p
              style={{
                fontSize: "12px",
                color: "rgba(255,255,255,0.12)",
                fontFamily: "monospace",
              }}
            >
              zenkai.nl
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
