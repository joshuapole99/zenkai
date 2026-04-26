"use client";
import React, { useState, useEffect } from "react";

export type ZenkaiApp = "web" | "scan" | "goals" | "job" | "workout";

const LINKS: { id: ZenkaiApp; label: string; href: string }[] = [
  { id: "scan",    label: "Scan",    href: "https://scan.zenkai.nl" },
  { id: "goals",   label: "Goals",   href: "https://goals.zenkai.nl" },
  { id: "job",     label: "Job",     href: "https://job.zenkai.nl" },
  { id: "workout", label: "Workout", href: "https://workout.zenkai.nl" },
];

function ZMark({ size = 22, color = "#0F0E0E" }: { size?: number; color?: string }) {
  return (
    <svg width={Math.round(size * 44 / 36)} height={size} viewBox="0 0 44 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="44" height="6" fill={color} />
      <polygon points="44,6 44,13 6,30 0,30 0,23 38,6" fill={color} />
      <rect x="0" y="30" width="44" height="6" fill={color} />
    </svg>
  );
}

type Props = {
  currentApp?: ZenkaiApp;
  rightSlot?: React.ReactNode;
};

export function ZenkaiNav({ currentApp, rightSlot }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!document.querySelector("[data-zk-font]")) {
      const l = document.createElement("link");
      l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,700&family=IBM+Plex+Mono:wght@400;500&display=swap";
      l.setAttribute("data-zk-font", "");
      document.head.appendChild(l);
    }
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <style>{`
        [data-zknav] { box-sizing: border-box; }
        [data-zknav] * { box-sizing: inherit; }
        [data-zknav-link]:hover { color: #0F0E0E !important; border-color: rgba(15,14,14,0.4) !important; }
        [data-zknav-ham] { display: none !important; }
        @media (max-width: 640px) {
          [data-zknav-links] { display: none !important; }
          [data-zknav-ham]   { display: flex !important; }
        }
        @keyframes zk-fadeup {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <header data-zknav="" style={{
        position: "sticky", top: 0, zIndex: 200,
        background: "#F5F3EC",
        borderBottom: "1px solid rgba(15,14,14,0.1)",
      }}>
        <div style={{
          maxWidth: "1200px", margin: "0 auto",
          padding: "0 32px", height: "58px",
          display: "flex", alignItems: "center",
        }}>
          <a
            href="https://zenkai.nl"
            style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", flexShrink: 0 }}
          >
            <ZMark size={20} color="#0F0E0E" />
            <span style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: "16px", fontWeight: 700,
              color: "#0F0E0E", letterSpacing: "-0.02em",
            }}>Zenkai</span>
          </a>

          <nav data-zknav-links="" style={{ display: "flex", alignItems: "center", gap: "28px", marginLeft: "auto" }}>
            {LINKS.map(l => (
              <a
                key={l.id}
                href={l.href}
                data-zknav-link=""
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "12px",
                  fontWeight: l.id === currentApp ? 600 : 400,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  color: l.id === currentApp ? "#0F0E0E" : "rgba(15,14,14,0.4)",
                  borderBottom: `1px solid ${l.id === currentApp ? "#0F0E0E" : "transparent"}`,
                  paddingBottom: "2px",
                  transition: "color 0.15s, border-color 0.15s",
                }}
              >
                {l.label}
              </a>
            ))}
            {rightSlot}
          </nav>

          <button
            data-zknav-ham=""
            onClick={() => setOpen(o => !o)}
            aria-label={open ? "Sluit menu" : "Open menu"}
            style={{
              marginLeft: "auto", background: "none", border: "none",
              cursor: "pointer", padding: "6px",
              display: "flex", flexDirection: "column", gap: "5px",
            }}
          >
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                display: "block", width: "22px", height: "1.5px", background: "#0F0E0E",
                transition: "transform 0.2s ease, opacity 0.2s ease",
                transform:
                  open && i === 0 ? "rotate(45deg) translate(4.5px, 4.5px)" :
                  open && i === 2 ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none",
                opacity: open && i === 1 ? 0 : 1,
              }} />
            ))}
          </button>
        </div>
      </header>

      {open && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 199,
          background: "#F5F3EC",
          display: "flex", flexDirection: "column",
          padding: "80px 40px 48px",
          overflowY: "auto",
        }}>
          {LINKS.map((l, i) => (
            <a
              key={l.id}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: "clamp(40px, 11vw, 60px)",
                fontWeight: 700,
                color: "#0F0E0E",
                textDecoration: "none",
                lineHeight: 1.05,
                padding: "14px 0",
                borderBottom: i < LINKS.length - 1 ? "1px solid rgba(15,14,14,0.1)" : "none",
                animation: `zk-fadeup 0.3s ease ${i * 0.06}s both`,
              }}
            >
              {l.label}
            </a>
          ))}
          <p style={{
            marginTop: "auto",
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "11px",
            color: "rgba(15,14,14,0.25)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}>
            Zenkai Platform · zenkai.nl
          </p>
        </div>
      )}
    </>
  );
}
