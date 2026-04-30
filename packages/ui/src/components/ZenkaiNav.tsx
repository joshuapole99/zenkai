"use client";
import { useState, useEffect } from "react";

export type ZenkaiApp = "web" | "scan" | "goals" | "job" | "workout";

const LINKS: { label: string; href: string }[] = [
  { label: "Prijzen", href: "https://zenkai.nl/#pricing" },
  { label: "Over",    href: "https://zenkai.nl/about" },
];

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
      l.href = "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap";
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
        [data-zknav-link]:hover { color: #0F0E0E !important; }
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
        background: "#ffffff",
        borderBottom: "1px solid rgba(15,14,14,0.08)",
      }}>
        <div style={{
          maxWidth: "1200px", margin: "0 auto",
          padding: "0 32px", height: "58px",
          display: "flex", alignItems: "center",
        }}>
          <a
            href="https://zenkai.nl"
            style={{ display: "flex", alignItems: "center", textDecoration: "none", flexShrink: 0 }}
          >
            <img
              src="/zenkai-logo.jpg"
              alt="Zenkai"
              style={{
                height: "72px",
                width: "auto",
                display: "block",
                mixBlendMode: "multiply",
                margin: "-14px 0",
              }}
            />
          </a>

          <nav data-zknav-links="" style={{ display: "flex", alignItems: "center", gap: "28px", marginLeft: "auto" }}>
            {LINKS.map(l => (
              <a
                key={l.label}
                href={l.href}
                data-zknav-link=""
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "12px",
                  fontWeight: 400,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  color: "rgba(15,14,14,0.4)",
                  transition: "color 0.15s",
                }}
              >
                {l.label}
              </a>
            ))}
            {rightSlot}
            <a
              href="https://scan.zenkai.nl"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "11px", fontWeight: 600,
                letterSpacing: "0.05em", textTransform: "uppercase",
                textDecoration: "none",
                color: "#ffffff",
                padding: "8px 18px",
                background: "#0284C7",
                display: currentApp === "scan" ? "none" : "inline-block",
              }}
            >
              Start Scan →
            </a>
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
          background: "#ffffff",
          display: "flex", flexDirection: "column",
          padding: "80px 40px 48px",
          overflowY: "auto",
        }}>
          {[
            { label: "Scan",    href: "https://scan.zenkai.nl" },
            { label: "Prijzen", href: "https://zenkai.nl/#pricing" },
            { label: "Over",    href: "https://zenkai.nl/about" },
          ].map((l, i) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "clamp(28px, 8vw, 44px)",
                fontWeight: 600,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: "#0F0E0E",
                textDecoration: "none",
                lineHeight: 1.1,
                padding: "16px 0",
                borderBottom: "1px solid rgba(15,14,14,0.08)",
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
            Zenkai Security Platform · zenkai.nl
          </p>
        </div>
      )}
    </>
  );
}
