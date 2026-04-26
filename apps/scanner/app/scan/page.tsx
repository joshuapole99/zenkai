"use client";

import React, { useState, useEffect } from "react";

function FontLoader() {
  useEffect(() => {
    if (document.querySelector("[data-sk-f]")) return;
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href =
      "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900&family=IBM+Plex+Mono:wght@400;500;600&display=swap";
    l.setAttribute("data-sk-f", "");
    document.head.appendChild(l);
  }, []);
  return null;
}

type CheckStatus = "pass" | "warn" | "fail" | "error";
type CheckResult = { status: CheckStatus; score: number; summary: string; details: string[] };
type Results = Partial<Record<string, CheckResult>>;

const CHECKS = [
  { id: "headers", label: "Security headers",   desc: "CSP, HSTS, X-Frame-Options" },
  { id: "ssl",     label: "SSL / TLS",           desc: "Certificaat + TLS versie" },
  { id: "dns",     label: "SPF / DMARC",         desc: "E-mail authenticatie" },
  { id: "owasp",   label: "OWASP indicatoren",   desc: "Info disclosure + misconfiguraties" },
  { id: "shodan",  label: "Open poorten",         desc: "Shodan host scan" },
  { id: "urlscan", label: "URL reputatie",        desc: "Malware + phishing check" },
];

const STATUS: Record<CheckStatus, { color: string; label: string }> = {
  pass:  { color: "#16A34A", label: "PASS" },
  warn:  { color: "#D97706", label: "WARN" },
  fail:  { color: "#DC2626", label: "FAIL" },
  error: { color: "rgba(15,14,14,0.3)", label: "ERR" },
};

const GRADE_COLOR: Record<string, string> = {
  A: "#16A34A", B: "#0284C7", C: "#D97706", D: "#EA580C", F: "#DC2626",
};

function ScoreBar({ score, color }: { score: number; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: "120px" }}>
      <div style={{ flex: 1, height: "4px", background: "rgba(15,14,14,0.08)", borderRadius: "2px", overflow: "hidden" }}>
        <div style={{ width: `${score}%`, height: "100%", background: color, transition: "width 0.6s ease" }} />
      </div>
      <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "12px", fontWeight: 600, color, minWidth: "28px", textAlign: "right" }}>
        {score}
      </span>
    </div>
  );
}

function Spinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" style={{ animation: "spin 0.8s linear infinite" }}>
      <circle cx="8" cy="8" r="6" stroke="rgba(15,14,14,0.15)" strokeWidth="2" fill="none" />
      <path d="M 8 2 A 6 6 0 0 1 14 8" stroke="#0284C7" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export default function ScanPage() {
  const [domain, setDomain] = useState("");
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<Results>({});
  const [score, setScore] = useState<number | null>(null);
  const [scanGrade, setScanGrade] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [scannedDomain, setScannedDomain] = useState("");

  async function runScan(e: React.FormEvent) {
    e.preventDefault();
    const d = domain.trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    if (!d) return;

    setScanning(true);
    setResults({});
    setScore(null);
    setScanGrade(null);
    setError("");
    setScannedDomain(d);
    setExpanded(null);

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: d }),
      });

      if (!res.ok || !res.body) throw new Error("Scan mislukt");

      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const p = JSON.parse(line) as { check?: string; result?: CheckResult; done?: boolean; score?: number; grade?: string };
            if (p.check && p.result) {
              setResults((prev) => ({ ...prev, [p.check!]: p.result! }));
            }
            if (p.done && p.score !== undefined) {
              setScore(p.score);
              setScanGrade(p.grade ?? null);
            }
          } catch {
            // partial chunk
          }
        }
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setScanning(false);
    }
  }

  const hasAnyResult = Object.keys(results).length > 0;

  return (
    <>
      <FontLoader />
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .check-row:hover { background: rgba(15,14,14,0.02) !important; }
      `}</style>

      <main style={{ minHeight: "100vh", background: "#ffffff", color: "#0F0E0E", paddingTop: "104px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 24px 80px" }}>

          {/* ── Heading ── */}
          <div style={{ marginBottom: "40px" }}>
            <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", letterSpacing: "0.2em", color: "#0284C7", textTransform: "uppercase", marginBottom: "12px" }}>
              Domain security scan
            </p>
            <h1 style={{ fontFamily: "'Fraunces',Georgia,serif", fontWeight: 900, fontSize: "clamp(2rem,5vw,3.5rem)", letterSpacing: "-0.04em", lineHeight: 1, margin: 0 }}>
              Scan jouw domein.
            </h1>
            <p style={{ fontSize: "15px", color: "rgba(15,14,14,0.45)", marginTop: "12px", lineHeight: 1.7 }}>
              6 checks in parallel: SSL, headers, DNS, OWASP, open poorten, reputatie.
            </p>
          </div>

          {/* ── Input form ── */}
          <form onSubmit={runScan} style={{ display: "flex", gap: "0", marginBottom: "48px", maxWidth: "560px" }}>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="example.com"
              disabled={scanning}
              style={{
                flex: 1, padding: "14px 16px",
                border: "1px solid rgba(15,14,14,0.18)", borderRight: "none",
                background: "#fff", color: "#0F0E0E",
                fontFamily: "'IBM Plex Mono',monospace", fontSize: "15px",
                outline: "none",
              }}
            />
            <button
              type="submit"
              disabled={scanning || !domain.trim()}
              style={{
                padding: "14px 28px",
                background: scanning ? "rgba(2,132,199,0.6)" : "#0284C7",
                color: "#fff", border: "none", cursor: scanning ? "not-allowed" : "pointer",
                fontFamily: "'IBM Plex Mono',monospace", fontSize: "13px", fontWeight: 600,
                letterSpacing: "0.06em", whiteSpace: "nowrap",
              }}
            >
              {scanning ? "Scanning..." : "SCAN →"}
            </button>
          </form>

          {error && (
            <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "13px", color: "#DC2626", marginBottom: "32px" }}>
              ✗ {error}
            </p>
          )}

          {/* ── Score ── */}
          {(score !== null || (scanning && hasAnyResult)) && (
            <div style={{ display: "flex", alignItems: "center", gap: "24px", marginBottom: "32px", padding: "24px 28px", border: "1px solid rgba(15,14,14,0.08)", animation: "fadeIn 0.4s ease" }}>
              <div>
                <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10px", letterSpacing: "0.15em", color: "rgba(15,14,14,0.35)", textTransform: "uppercase", margin: "0 0 4px" }}>
                  Risk score
                </p>
                <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
                  <span style={{ fontFamily: "'Fraunces',Georgia,serif", fontWeight: 900, fontSize: "3rem", letterSpacing: "-0.04em", lineHeight: 1 }}>
                    {score ?? "—"}
                  </span>
                  {scanGrade && (
                    <span style={{ fontFamily: "'Fraunces',Georgia,serif", fontWeight: 700, fontSize: "1.8rem", color: GRADE_COLOR[scanGrade] ?? "#0F0E0E" }}>
                      {scanGrade}
                    </span>
                  )}
                </div>
              </div>
              {scannedDomain && (
                <div style={{ marginLeft: "auto" }}>
                  <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "rgba(15,14,14,0.35)", margin: 0 }}>
                    {scannedDomain}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ── Checks list ── */}
          {(hasAnyResult || scanning) && (
            <div style={{ border: "1px solid rgba(15,14,14,0.08)", overflow: "hidden" }}>
              {CHECKS.map((c, i) => {
                const result = results[c.id];
                const isLoading = scanning && !result;
                const st = result ? STATUS[result.status] : null;
                const isOpen = expanded === c.id;

                return (
                  <div key={c.id} style={{ borderTop: i === 0 ? "none" : "1px solid rgba(15,14,14,0.07)" }}>
                    <button
                      className="check-row"
                      onClick={() => result && setExpanded(isOpen ? null : c.id)}
                      style={{
                        width: "100%", display: "flex", alignItems: "center", gap: "16px",
                        padding: "18px 20px", background: "transparent", border: "none",
                        cursor: result ? "pointer" : "default", textAlign: "left",
                        transition: "background 0.15s",
                      }}
                    >
                      {/* Status indicator */}
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", flexShrink: 0, background: st ? st.color : "rgba(15,14,14,0.12)" }} />

                      {/* Label */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "13px", fontWeight: 600, margin: 0, color: "#0F0E0E" }}>
                          {c.label}
                        </p>
                        <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "rgba(15,14,14,0.35)", margin: "2px 0 0" }}>
                          {result ? result.summary : c.desc}
                        </p>
                      </div>

                      {/* Score bar or spinner */}
                      <div style={{ width: "160px", flexShrink: 0 }}>
                        {isLoading ? (
                          <Spinner />
                        ) : result ? (
                          <ScoreBar score={result.score} color={st!.color} />
                        ) : null}
                      </div>

                      {/* Status badge */}
                      <div style={{ width: "42px", textAlign: "right", flexShrink: 0 }}>
                        {st && (
                          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10px", fontWeight: 600, color: st.color, letterSpacing: "0.08em" }}>
                            {st.label}
                          </span>
                        )}
                      </div>

                      {/* Expand arrow */}
                      <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "rgba(15,14,14,0.25)", flexShrink: 0, transform: isOpen ? "rotate(90deg)" : "none", transition: "transform 0.2s", display: "inline-block" }}>
                        ›
                      </span>
                    </button>

                    {/* Details panel */}
                    {isOpen && result && (
                      <div style={{ padding: "0 20px 20px 44px", animation: "fadeIn 0.2s ease" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          {result.details.map((d, di) => (
                            <p key={di} style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "12px", color: "rgba(15,14,14,0.55)", margin: 0, lineHeight: 1.6 }}>
                              {d}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Empty state ── */}
          {!hasAnyResult && !scanning && !error && (
            <div style={{ borderTop: "1px solid rgba(15,14,14,0.08)", paddingTop: "32px" }}>
              {CHECKS.map((c) => (
                <div key={c.id} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "14px 0", borderBottom: "1px solid rgba(15,14,14,0.05)" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "rgba(15,14,14,0.1)", flexShrink: 0 }} />
                  <div>
                    <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "13px", fontWeight: 600, margin: 0, color: "rgba(15,14,14,0.4)" }}>{c.label}</p>
                    <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "rgba(15,14,14,0.25)", margin: "2px 0 0" }}>{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
