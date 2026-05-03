"use client";

import React, { useState, useEffect, useRef } from "react";
import { getBrowserClient } from "@/lib/supabase-browser";

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

type Sev = "High" | "Medium" | "Low" | "Info";
type StatusKey = "pass" | "warn" | "fail" | "error";

interface Finding {
  title: string;
  severity: Sev;
  description: string;
  recommendation: string;
}

interface ModuleResult {
  status: StatusKey;
  score: number;
  summary: string;
  details: string[];
  findings: Finding[];
}

type Results = Partial<Record<string, ModuleResult>>;

// ── Free scan checks ──────────────────────────────────────────────────────────
const FREE_CHECKS = [
  { id: "headers", label: "Security headers",  desc: "CSP, HSTS, X-Frame-Options" },
  { id: "ssl",     label: "SSL / TLS",          desc: "Certificaat + TLS versie" },
  { id: "dns",     label: "SPF / DMARC",        desc: "E-mail authenticatie" },
  { id: "owasp",   label: "OWASP indicatoren",  desc: "Info disclosure + misconfiguraties" },
  { id: "shodan",  label: "Open poorten",        desc: "Shodan host scan" },
  { id: "urlscan", label: "URL reputatie",       desc: "Malware + phishing check" },
];

// ── Quick scan modules ─────────────────────────────────────────────────────────
const QUICK_CHECKS = [
  { id: "headers",  label: "Security headers",      desc: "CSP, HSTS, X-Frame-Options" },
  { id: "ssl",      label: "SSL / TLS",              desc: "TLS versie + certificaat (openssl)" },
  { id: "dns",      label: "SPF / DMARC",            desc: "DNS e-mail authenticatie (dig)" },
  { id: "nmap",       label: "Poortscan",              desc: "Top 1000 TCP poorten + services (nmap)" },
  { id: "gobuster",   label: "Directory enum",         desc: "Verborgen paden (gobuster + dirb wordlist)" },
  { id: "nikto",      label: "Nikto baseline",         desc: "OWASP Top 10 indicatoren (nikto)" },
  { id: "whatweb",    label: "Tech fingerprint",       desc: "CMS, server, frameworks (whatweb)" },
  { id: "urlscan",    label: "URL reputatie",           desc: "Malware + phishing scan (urlscan.io)" },
  { id: "zap",        label: "ZAP baseline",           desc: "Passieve web crawl (OWASP ZAP)" },
];

// ── Full scan modules ─────────────────────────────────────────────────────────
const FULL_CHECKS = [
  { id: "headers",    label: "Security headers",      desc: "8 headers incl. COOP, CORP" },
  { id: "ssl",        label: "SSL / TLS deep",        desc: "Cipher suites, RC4, 3DES (sslyze)" },
  { id: "dns",        label: "DNS volledig",           desc: "SPF, DMARC, CAA, MX, NS (dig)" },
  { id: "nmap",       label: "Full poortscan",         desc: "Alle 65535 TCP poorten (nmap)" },
  { id: "subdomains", label: "Subdomain enum",         desc: "DNS brute-force subdomains" },
  { id: "gobuster",   label: "Directory enum (big)",   desc: "Uitgebreide paden (feroxbuster + raft-large)" },
  { id: "nikto",      label: "Nikto uitgebreid",       desc: "OWASP + XSS + CORS + TRACE (nikto)" },
  { id: "whatweb",    label: "Tech fingerprint",       desc: "CMS, server, frameworks (whatweb)" },
  { id: "shodan",     label: "Shodan intelligence",    desc: "CVEs + exposed services (Shodan API)" },
  { id: "urlscan",    label: "URL reputatie",          desc: "Malware + phishing scan (urlscan.io)" },
  { id: "zap",        label: "ZAP baseline",           desc: "Passieve web crawl (OWASP ZAP)" },
  { id: "sqlmap",     label: "SQL injection",          desc: "Formulieren + parameters (sqlmap BEUSTQ)" },
  { id: "injection",  label: "Injection checks",       desc: "SSTI, open redirect, host header injection" },
];

const STATUS: Record<StatusKey, { color: string; label: string }> = {
  pass:  { color: "#16A34A", label: "PASS" },
  warn:  { color: "#D97706", label: "WARN" },
  fail:  { color: "#DC2626", label: "FAIL" },
  error: { color: "rgba(15,14,14,0.3)", label: "ERR" },
};

const SEV_COLOR: Record<Sev, string> = {
  High: "#DC2626", Medium: "#D97706", Low: "#16A34A", Info: "rgba(15,14,14,0.4)",
};

type Verdict = "EXPLOITED" | "BLOCKED" | "POTENTIAL";
const VERDICT_COLOR: Record<Verdict, string> = {
  EXPLOITED: "#DC2626",
  BLOCKED:   "#16A34A",
  POTENTIAL: "#D97706",
};

function getVerdict(f: Finding, scannedDomain: string): Verdict {
  const desc = (f.description + " " + f.recommendation).toLowerCase();
  const isSSTI = desc.includes("ssti") || desc.includes("template injection");
  const isCloudflare = desc.includes("cloudflare") || scannedDomain.toLowerCase().includes("cloudflare");
  if (isSSTI && isCloudflare) return "BLOCKED";
  if (f.severity === "High") return "EXPLOITED";
  return "POTENTIAL";
}

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
  const [domain, setDomain]           = useState("");
  const [mode, setMode]               = useState<"free" | "quick" | "full">("free");
  const [language, setLanguage]       = useState<"nl" | "en">("nl");
  const [scanning, setScanning]       = useState(false);
  const [results, setResults]         = useState<Results>({});
  const [score, setScore]             = useState<number | null>(null);
  const [scanGrade, setScanGrade]     = useState<string | null>(null);
  const [expanded, setExpanded]       = useState<string | null>(null);
  const [error, setError]             = useState("");
  const [errorType, setErrorType]     = useState<null | "auth" | "upgrade" | "limit">(null);
  const [scannedDomain, setScannedDomain] = useState("");
  const [scanDone, setScanDone]       = useState(false);
  const [loggedIn, setLoggedIn]             = useState<boolean | null>(null);
  const [consentChecked, setConsentChecked] = useState(false);
  const [reportEmail, setReportEmail] = useState("");
  const [reportSending, setReportSending] = useState(false);
  const [reportSent, setReportSent]   = useState(false);
  const [reportError, setReportError] = useState("");

  const CHECKS = mode === "full" ? FULL_CHECKS : mode === "quick" ? QUICK_CHECKS : FREE_CHECKS;

  useEffect(() => {
    getBrowserClient().auth.getSession().then(({ data }) => {
      setLoggedIn(!!data.session);
    });
  }, []);

  async function runScan(e: React.FormEvent) {
    e.preventDefault();
    const d = domain.trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    if (!d) return;

    setScanning(true);
    setResults({});
    setScore(null);
    setScanGrade(null);
    setError("");
    setErrorType(null);
    setScannedDomain(d);
    setExpanded(null);
    setScanDone(false);
    setReportSent(false);
    setReportError("");

    try {
      const endpoint = mode === "full" ? "/api/full-scan" : mode === "quick" ? "/api/quick-scan" : "/api/scan";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: d, language, consent: true }),
      });

      if (res.status === 401) {
        setErrorType("auth");
        setScanning(false);
        setScanDone(false);
        return;
      }
      if (res.status === 403) {
        const body = await res.json().catch(() => ({})) as { error?: string };
        setError(body.error ?? "Full scan vereist een Pro plan.");
        setErrorType("upgrade");
        setScanning(false);
        setScanDone(false);
        return;
      }
      if (res.status === 429) {
        const body = await res.json().catch(() => ({})) as { error?: string };
        setError(body.error ?? "Scanlimiet bereikt voor dit plan.");
        setErrorType("limit");
        setScanning(false);
        setScanDone(false);
        return;
      }
      if (!res.ok || !res.body) {
        const err = await res.text().catch(() => "Scan mislukt");
        throw new Error(err.slice(0, 200));
      }

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
            const p = JSON.parse(line) as Record<string, unknown>;

            // Free scan format: { check, result }
            if (p.check && p.result) {
              const r = p.result as ModuleResult;
              setResults((prev) => ({ ...prev, [p.check as string]: { ...r, findings: r.findings ?? [] } }));
            }

            // Quick scan format: { module, status, score, summary, details, findings }
            if (p.module && p.status) {
              setResults((prev) => ({
                ...prev,
                [p.module as string]: {
                  status:   p.status as StatusKey,
                  score:    p.score as number,
                  summary:  p.summary as string,
                  details:  (p.details ?? []) as string[],
                  findings: (p.findings ?? []) as Finding[],
                },
              }));
            }

            // Done signal
            if (p.done) {
              if (p.score !== undefined) {
                setScore(p.score as number);
                setScanGrade((p.grade as string) ?? null);
              } else {
                // Quick scan: compute score from modules
                setScore(null);
              }
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
      setScanDone(true);
    }
  }

  async function sendReport(e: React.FormEvent) {
    e.preventDefault();
    if (!reportEmail || !scannedDomain) return;
    setReportSending(true);
    setReportError("");
    try {
      const res = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: scannedDomain, email: reportEmail, language, type: mode }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Mislukt" }));
        throw new Error((err as { error: string }).error);
      }
      setReportSent(true);
    } catch (e) {
      setReportError((e as Error).message);
    } finally {
      setReportSending(false);
    }
  }

  // Compute score for quick scan when done
  const allDone = !scanning && Object.keys(results).length > 0;
  const computedScore = allDone && score === null
    ? Math.round(Object.values(results).reduce((s, r) => s + (r?.score ?? 0), 0) / Math.max(Object.keys(results).length, 1))
    : score;
  const computedGrade = computedScore !== null
    ? (scanGrade ?? (computedScore >= 90 ? "A" : computedScore >= 75 ? "B" : computedScore >= 60 ? "C" : computedScore >= 45 ? "D" : "F"))
    : null;

  const totalFindings = Object.values(results).flatMap((r) => r?.findings ?? []);
  const highCount   = totalFindings.filter((f) => f.severity === "High").length;
  const mediumCount = totalFindings.filter((f) => f.severity === "Medium").length;
  const hasAnyResult = Object.keys(results).length > 0;

  return (
    <>
      <FontLoader />
      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadeIn  { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .check-row:hover   { background: rgba(15,14,14,0.02) !important; }
        .mode-btn          { transition: all 0.15s; }
        .mode-btn:hover    { border-color: rgba(2,132,199,0.4) !important; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#ffffff", color: "#0F0E0E", paddingTop: "40px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 24px 80px" }}>

          {/* ── Auth banner ── */}
          {loggedIn === false && (
            <div style={{ marginBottom: "28px", padding: "16px 20px", border: "1px solid rgba(2,132,199,0.25)", background: "rgba(2,132,199,0.04)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "13px", fontWeight: 600, color: "#0284C7", margin: "0 0 4px" }}>
                  Log in om te scannen
                </p>
                <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "rgba(15,14,14,0.5)", margin: 0 }}>
                  Quick en Full scan vereisen een account. Gratis scan werkt zonder account.
                </p>
              </div>
              <a href="/login" style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "12px", fontWeight: 600, color: "#fff", background: "#0284C7", padding: "9px 18px", textDecoration: "none", whiteSpace: "nowrap" }}>
                Inloggen →
              </a>
            </div>
          )}

          {/* ── Heading ── */}
          <div style={{ marginBottom: "32px" }}>
            <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", letterSpacing: "0.2em", color: "#0284C7", textTransform: "uppercase", marginBottom: "12px" }}>
              Domain security scan
            </p>
            <h1 style={{ fontFamily: "'Fraunces',Georgia,serif", fontWeight: 900, fontSize: "clamp(2rem,5vw,3.5rem)", letterSpacing: "-0.04em", lineHeight: 1, margin: 0 }}>
              Scan jouw domein.
            </h1>
          </div>

          {/* ── Mode toggle ── */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "28px" }}>
            {[
              { key: "free",  label: "Gratis scan",   desc: "6 checks · serverless" },
              { key: "quick", label: "Quick scan",     desc: "9 modules · Starter+" },
              { key: "full",  label: "Full scan",      desc: "13 modules · Pro" },
            ].map((m) => (
              <button
                key={m.key}
                className="mode-btn"
                onClick={() => { if (!scanning) setMode(m.key as "free" | "quick" | "full"); }}
                style={{
                  padding: "10px 20px", cursor: scanning ? "not-allowed" : "pointer",
                  border: `1px solid ${mode === m.key ? "#0284C7" : "rgba(15,14,14,0.14)"}`,
                  background: mode === m.key ? "rgba(2,132,199,0.06)" : "transparent",
                  textAlign: "left",
                }}
              >
                <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "12px", fontWeight: 600, margin: 0, color: mode === m.key ? "#0284C7" : "#0F0E0E" }}>
                  {m.label}
                </p>
                <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10px", margin: "2px 0 0", color: "rgba(15,14,14,0.35)" }}>
                  {m.desc}
                </p>
              </button>
            ))}
          </div>

          {/* Language toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "rgba(15,14,14,0.35)" }}>
              Rapport taal:
            </span>
            {(["nl", "en"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => { if (!scanning) setLanguage(lang); }}
                style={{
                  padding: "4px 12px", cursor: scanning ? "not-allowed" : "pointer",
                  border: `1px solid ${language === lang ? "#0284C7" : "rgba(15,14,14,0.14)"}`,
                  background: language === lang ? "rgba(2,132,199,0.06)" : "transparent",
                  fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px",
                  color: language === lang ? "#0284C7" : "rgba(15,14,14,0.4)",
                }}
              >
                {lang === "nl" ? "🇳🇱 Nederlands" : "🇬🇧 English"}
              </button>
            ))}
          </div>

          {mode === "quick" && (
            <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "#0284C7", marginBottom: "20px", padding: "10px 14px", border: "1px solid rgba(2,132,199,0.2)", background: "rgba(2,132,199,0.04)" }}>
              ⚡ Quick scan — 9 modules, geen setup nodig.
            </p>
          )}
          {mode === "full" && (
            <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "#7C3AED", marginBottom: "20px", padding: "10px 14px", border: "1px solid rgba(124,58,237,0.2)", background: "rgba(124,58,237,0.04)" }}>
              🔍 Full scan — 13 modules incl. SQLMap + injection checks. Duurt 10–20 min.
            </p>
          )}

          {/* ── Input form ── */}
          <form onSubmit={runScan} style={{ marginBottom: "48px", maxWidth: "560px" }}>
            <div style={{ display: "flex", gap: "0", marginBottom: "12px" }}>
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
                disabled={scanning || !domain.trim() || !consentChecked}
                style={{
                  padding: "14px 28px",
                  background: scanning ? "rgba(2,132,199,0.6)" : (!domain.trim() || !consentChecked) ? "rgba(2,132,199,0.35)" : "#0284C7",
                  color: "#fff", border: "none", cursor: (scanning || !domain.trim() || !consentChecked) ? "not-allowed" : "pointer",
                  fontFamily: "'IBM Plex Mono',monospace", fontSize: "13px", fontWeight: 600,
                  letterSpacing: "0.06em", whiteSpace: "nowrap",
                }}
              >
                {scanning ? "Scanning..." : "SCAN →"}
              </button>
            </div>
            <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
                disabled={scanning}
                style={{ marginTop: "2px", width: "14px", height: "14px", flexShrink: 0, accentColor: "#0284C7", cursor: scanning ? "not-allowed" : "pointer" }}
              />
              <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "rgba(15,14,14,0.5)", lineHeight: 1.6 }}>
                Ik bevestig dat ik eigenaar ben van dit domein of schriftelijke toestemming heb van de eigenaar om een beveiligingsscan uit te voeren.
              </span>
            </label>
          </form>

          {errorType === "auth" && (
            <div style={{ marginBottom: "32px", padding: "16px 20px", border: "1px solid rgba(2,132,199,0.25)", background: "rgba(2,132,199,0.04)" }}>
              <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "13px", fontWeight: 600, color: "#0284C7", margin: "0 0 6px" }}>
                Inloggen vereist
              </p>
              <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "12px", color: "rgba(15,14,14,0.5)", margin: "0 0 12px" }}>
                Quick scan en Full scan zijn beschikbaar voor ingelogde gebruikers. Gratis scan werkt zonder account.
              </p>
              <a href="/login" style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "12px", fontWeight: 600, color: "#fff", background: "#0284C7", padding: "8px 16px", textDecoration: "none", display: "inline-block" }}>
                Inloggen →
              </a>
            </div>
          )}

          {errorType === "upgrade" && (
            <div style={{ marginBottom: "32px", padding: "16px 20px", border: "1px solid rgba(124,58,237,0.25)", background: "rgba(124,58,237,0.04)" }}>
              <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "13px", fontWeight: 600, color: "#7C3AED", margin: "0 0 6px" }}>
                Plan upgrade vereist
              </p>
              <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "12px", color: "rgba(15,14,14,0.5)", margin: "0 0 12px", lineHeight: 1.6 }}>
                {error}
              </p>
              <a href="/#pricing" style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "12px", fontWeight: 600, color: "#fff", background: "#7C3AED", padding: "8px 16px", textDecoration: "none", display: "inline-block" }}>
                Bekijk plannen →
              </a>
            </div>
          )}

          {errorType === "limit" && (
            <div style={{ marginBottom: "32px", padding: "16px 20px", border: "1px solid rgba(217,119,6,0.25)", background: "rgba(217,119,6,0.04)" }}>
              <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "13px", fontWeight: 600, color: "#D97706", margin: "0 0 6px" }}>
                Scanlimiet bereikt
              </p>
              <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "12px", color: "rgba(15,14,14,0.5)", margin: "0 0 12px", lineHeight: 1.6 }}>
                {error}
              </p>
              <a href="/#pricing" style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "12px", fontWeight: 600, color: "#fff", background: "#D97706", padding: "8px 16px", textDecoration: "none", display: "inline-block" }}>
                Upgrade plan →
              </a>
            </div>
          )}

          {!errorType && error && (
            <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "13px", color: "#DC2626", marginBottom: "32px" }}>
              ✗ {error}
            </p>
          )}

          {/* ── Score header ── */}
          {(computedScore !== null || (scanning && hasAnyResult)) && (
            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "24px", padding: "24px 28px", border: "1px solid rgba(15,14,14,0.08)", animation: "fadeIn 0.4s ease" }}>
              <div>
                <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10px", letterSpacing: "0.15em", color: "rgba(15,14,14,0.35)", textTransform: "uppercase", margin: "0 0 4px" }}>
                  Risk score
                </p>
                <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
                  <span style={{ fontFamily: "'Fraunces',Georgia,serif", fontWeight: 900, fontSize: "3rem", letterSpacing: "-0.04em", lineHeight: 1 }}>
                    {computedScore ?? "—"}
                  </span>
                  {computedGrade && (
                    <span style={{ fontFamily: "'Fraunces',Georgia,serif", fontWeight: 700, fontSize: "1.8rem", color: GRADE_COLOR[computedGrade] ?? "#0F0E0E" }}>
                      {computedGrade}
                    </span>
                  )}
                </div>
              </div>

              {totalFindings.length > 0 && (
                <div style={{ display: "flex", gap: "20px", marginLeft: "16px" }}>
                  {highCount > 0 && (
                    <div>
                      <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "22px", fontWeight: 600, margin: 0, color: "#DC2626" }}>{highCount}</p>
                      <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "9px", letterSpacing: "0.1em", color: "rgba(15,14,14,0.35)", margin: "2px 0 0", textTransform: "uppercase" }}>Hoog</p>
                    </div>
                  )}
                  {mediumCount > 0 && (
                    <div>
                      <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "22px", fontWeight: 600, margin: 0, color: "#D97706" }}>{mediumCount}</p>
                      <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "9px", letterSpacing: "0.1em", color: "rgba(15,14,14,0.35)", margin: "2px 0 0", textTransform: "uppercase" }}>Gemiddeld</p>
                    </div>
                  )}
                </div>
              )}

              {scannedDomain && (
                <div style={{ marginLeft: "auto" }}>
                  <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "rgba(15,14,14,0.35)", margin: 0 }}>
                    {scannedDomain}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ── Free scan upgrade trigger ── */}
          {scanDone && mode === "free" && (
            <div style={{ marginBottom: "24px", padding: "20px 24px", border: "1px solid rgba(2,132,199,0.25)", background: "rgba(2,132,199,0.04)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "13px", fontWeight: 600, color: "#0284C7", margin: "0 0 4px" }}>
                  Wil je een volledig PDF rapport?
                </p>
                <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "rgba(15,14,14,0.5)", margin: 0 }}>
                  Upgrade naar Starter vanaf €19/mnd — 9 scan modules + PDF per email.
                </p>
              </div>
              <a href="/#pricing" style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", fontWeight: 600, color: "#fff", background: "#0284C7", padding: "9px 18px", textDecoration: "none", whiteSpace: "nowrap" }}>
                Upgrade naar Starter →
              </a>
            </div>
          )}

          {/* ── PDF rapport via email ── */}
          {scanDone && (mode === "quick" || mode === "full") && !reportSent && (
            <form onSubmit={sendReport} style={{ display: "flex", gap: "0", marginBottom: "24px", maxWidth: "520px", border: "1px solid rgba(15,14,14,0.1)", overflow: "hidden" }}>
              <input
                type="email"
                required
                placeholder={language === "en" ? "your@email.com — receive PDF report" : "jouw@email.nl — ontvang PDF rapport"}
                value={reportEmail}
                onChange={e => setReportEmail(e.target.value)}
                disabled={reportSending}
                style={{ flex: 1, padding: "12px 16px", fontFamily: "'IBM Plex Mono',monospace", fontSize: "12px", border: "none", outline: "none", background: "transparent", color: "#0F0E0E" }}
              />
              <button
                type="submit"
                disabled={reportSending}
                style={{ padding: "12px 20px", background: "#0F0E0E", color: "#fff", border: "none", cursor: reportSending ? "not-allowed" : "pointer", fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", fontWeight: 600, whiteSpace: "nowrap", opacity: reportSending ? 0.6 : 1 }}
              >
                {reportSending ? "..." : language === "en" ? "SEND PDF →" : "STUUR PDF →"}
              </button>
            </form>
          )}
          {reportSent && (
            <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "12px", color: "#16A34A", marginBottom: "24px" }}>
              ✓ {language === "en" ? `Report sent to ${reportEmail}` : `Rapport verstuurd naar ${reportEmail}`}
            </p>
          )}
          {reportError && (
            <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "12px", color: "#DC2626", marginBottom: "24px" }}>
              ✗ {reportError}
            </p>
          )}

          {/* ── Checks list ── */}
          {(hasAnyResult || scanning) && (
            <div style={{ border: "1px solid rgba(15,14,14,0.08)", overflow: "hidden" }}>
              {CHECKS.map((c, i) => {
                const result = results[c.id];
                const isLoading = scanning && !result;
                const st = result ? STATUS[result.status] : null;
                const isOpen = expanded === c.id;
                const hasFindings = (result?.findings?.length ?? 0) > 0;

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
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", flexShrink: 0, background: st ? st.color : "rgba(15,14,14,0.12)" }} />

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "13px", fontWeight: 600, margin: 0, color: "#0F0E0E" }}>
                          {c.label}
                        </p>
                        <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "rgba(15,14,14,0.35)", margin: "2px 0 0" }}>
                          {result ? result.summary : c.desc}
                        </p>
                      </div>

                      <div style={{ width: "160px", flexShrink: 0 }}>
                        {isLoading ? <Spinner /> : result ? <ScoreBar score={result.score} color={st!.color} /> : null}
                      </div>

                      <div style={{ width: "42px", textAlign: "right", flexShrink: 0 }}>
                        {st && (
                          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10px", fontWeight: 600, color: st.color, letterSpacing: "0.08em" }}>
                            {st.label}
                          </span>
                        )}
                      </div>

                      <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "rgba(15,14,14,0.25)", flexShrink: 0, transform: isOpen ? "rotate(90deg)" : "none", transition: "transform 0.2s", display: "inline-block" }}>
                        ›
                      </span>
                    </button>

                    {/* Detail + findings panel */}
                    {isOpen && result && (
                      <div style={{ padding: "0 20px 20px 44px", animation: "fadeIn 0.2s ease" }}>
                        {/* Details */}
                        {result.details.length > 0 && (
                          <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: hasFindings ? "16px" : 0 }}>
                            {result.details.map((d, di) => (
                              <p key={di} style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "12px", color: "rgba(15,14,14,0.55)", margin: 0, lineHeight: 1.6 }}>
                                {d}
                              </p>
                            ))}
                          </div>
                        )}

                        {/* Findings */}
                        {hasFindings && (
                          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            {result.findings.map((f, fi) => (
                              <div key={fi} style={{ padding: "14px 16px", background: "rgba(15,14,14,0.02)", border: "1px solid rgba(15,14,14,0.07)" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", marginBottom: "8px" }}>
                                  <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "12px", fontWeight: 600, margin: 0, color: "#0F0E0E" }}>
                                    {f.title}
                                  </p>
                                  <div style={{ display: "flex", gap: "6px", flexShrink: 0, alignItems: "center" }}>
                                    <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "9px", fontWeight: 600, color: SEV_COLOR[f.severity], letterSpacing: "0.1em" }}>
                                      {f.severity.toUpperCase()}
                                    </span>
                                    {(() => {
                                      const v = getVerdict(f, scannedDomain);
                                      return (
                                        <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "9px", fontWeight: 700, color: VERDICT_COLOR[v], background: `${VERDICT_COLOR[v]}18`, padding: "2px 8px", letterSpacing: "0.08em" }}>
                                          {v}
                                        </span>
                                      );
                                    })()}
                                  </div>
                                </div>
                                <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "rgba(15,14,14,0.5)", margin: "0 0 6px", lineHeight: 1.6 }}>
                                  {f.description}
                                </p>
                                <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "#0284C7", margin: 0, lineHeight: 1.6 }}>
                                  → {f.recommendation}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
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
      </div>
    </>
  );
}
