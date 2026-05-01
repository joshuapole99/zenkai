import { redirect } from "next/navigation";
import { getServerClient } from "@/lib/supabase-server";
import { FontLoader } from "@/app/dashboard/FontLoader";
import { PrintButton } from "./PrintButton";

const SCANNER_URL = process.env.SCANNER_API_URL ?? "https://vmi3112892.contaboserver.net";
const SCANNER_KEY = process.env.SCANNER_API_KEY ?? "verander-dit";

type Finding = {
  description?: string;
  severity?: string;
  risk?: string;
  level?: string;
  status?: string;
  passed?: boolean;
  module?: string;
  category?: string;
  recommendation?: string;
  remediation?: string;
  details?: string;
  evidence?: string;
  [key: string]: unknown;
};

type ReportData = {
  findings?: Finding[];
  score?: number | string;
  risk_score?: number | string;
  domain?: string;
  scan_date?: string;
  created_at?: string;
  summary?: string;
  [key: string]: unknown;
};

function severityColor(finding: Finding): string {
  const s = (finding.severity ?? finding.risk ?? finding.level ?? finding.status ?? "").toLowerCase();
  if (s.includes("high") || s.includes("critical") || s === "fail" || s === "failed") return "#DC2626";
  if (s.includes("medium") || s.includes("warn")) return "#D97706";
  if (s.includes("low") || s.includes("info")) return "#0284C7";
  if (s === "ok" || s === "pass" || s === "passed" || finding.passed === true) return "#16A34A";
  return "rgba(15,14,14,0.4)";
}

function severityLabel(finding: Finding): string {
  const s = (finding.severity ?? finding.risk ?? finding.level ?? "").toUpperCase();
  if (s) return s;
  if (finding.passed === true) return "OK";
  if (finding.passed === false) return "FAIL";
  if (finding.status) return finding.status.toUpperCase();
  return "";
}

export default async function ReportPage({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const sb = await getServerClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/");

  const { domain } = await params;

  let report: ReportData = {};
  let fetchError: string | null = null;

  try {
    const res = await fetch(`${SCANNER_URL}/report/${domain}`, {
      headers: { "X-API-Key": SCANNER_KEY },
      next: { revalidate: 0 },
    });
    if (res.ok) {
      report = await res.json();
    } else {
      fetchError = `Flask returned ${res.status}`;
    }
  } catch (e) {
    fetchError = String(e);
  }

  const findings = report.findings ?? [];
  const score = report.score ?? report.risk_score;
  const scanDate = report.scan_date ?? report.created_at;

  return (
    <>
      <FontLoader />
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: #fff !important; }
          section { break-inside: avoid; }
        }
      `}</style>

      <div style={{ background: "#ffffff", color: "#0F0E0E", minHeight: "100vh", padding: "0 0 80px" }}>

        {/* Header */}
        <div style={{ background: "#0F0E0E", padding: "48px 40px 40px" }}>
          <div style={{ maxWidth: "960px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <span style={{
                  fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px",
                  letterSpacing: "0.2em", color: "rgba(245,243,236,0.35)", textTransform: "uppercase",
                  display: "block", marginBottom: "12px",
                }}>
                  Security Rapport
                </span>
                <h1 style={{
                  fontFamily: "'Fraunces', Georgia, serif", fontWeight: 900,
                  fontSize: "clamp(2rem,4vw,3.5rem)", letterSpacing: "-0.04em",
                  lineHeight: 0.93, color: "#F5F3EC", margin: "0 0 12px",
                }}>
                  {domain}
                </h1>
                {scanDate && (
                  <p style={{
                    fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px",
                    color: "rgba(245,243,236,0.35)", margin: 0,
                  }}>
                    {new Date(scanDate).toLocaleString("nl-NL", { timeZone: "Europe/Amsterdam" })}
                  </p>
                )}
              </div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "12px" }}>
                {score !== undefined && (
                  <div style={{ textAlign: "right" }}>
                    <span style={{
                      fontFamily: "'Fraunces', Georgia, serif", fontWeight: 900,
                      fontSize: "3.5rem", letterSpacing: "-0.04em",
                      color: Number(score) >= 70 ? "#16A34A" : Number(score) >= 40 ? "#D97706" : "#DC2626",
                    }}>
                      {score}
                    </span>
                    <span style={{
                      fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px",
                      color: "rgba(245,243,236,0.35)", display: "block",
                    }}>
                      / 100
                    </span>
                  </div>
                )}
                <span className="no-print">
                  <PrintButton />
                </span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: "960px", margin: "0 auto", padding: "0 40px" }}>

          {fetchError && (
            <div style={{
              margin: "32px 0", padding: "20px 24px",
              background: "#FEF2F2", border: "1px solid #FCA5A5",
              fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px", color: "#DC2626",
            }}>
              Rapport ophalen mislukt: {fetchError}
            </div>
          )}

          {findings.length === 0 && !fetchError && (
            <div style={{
              margin: "48px 0", padding: "40px 24px", background: "#F5F3EC",
              textAlign: "center",
              fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px",
              color: "rgba(15,14,14,0.35)", letterSpacing: "0.08em", textTransform: "uppercase",
            }}>
              Geen bevindingen gevonden voor {domain}
            </div>
          )}

          {findings.length > 0 && (
            <section style={{ marginTop: "48px" }}>
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "baseline",
                paddingBottom: "12px", borderBottom: "2px solid #0F0E0E", marginBottom: "1px",
              }}>
                <span style={{
                  fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px", fontWeight: 600,
                  letterSpacing: "0.2em", color: "rgba(15,14,14,0.4)", textTransform: "uppercase",
                }}>
                  Bevindingen
                </span>
                <span style={{
                  fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px",
                  color: "rgba(15,14,14,0.3)",
                }}>
                  {findings.length} bevinding{findings.length !== 1 ? "en" : ""}
                </span>
              </div>

              {findings.map((f, i) => {
                const label = severityLabel(f);
                const color = severityColor(f);
                const module = f.module ?? f.category ?? "";
                const recommendation = f.recommendation ?? f.remediation ?? "";
                const detail = f.details ?? f.evidence ?? "";

                return (
                  <div
                    key={i}
                    style={{
                      padding: "24px 0",
                      borderBottom: "1px solid rgba(15,14,14,0.06)",
                      display: "grid",
                      gridTemplateColumns: "1fr auto",
                      gap: "16px",
                      alignItems: "start",
                    }}
                  >
                    <div>
                      {module && (
                        <span style={{
                          fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px",
                          fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase",
                          color: "#0284C7", display: "block", marginBottom: "6px",
                        }}>
                          {module}
                        </span>
                      )}
                      {f.description && (
                        <p style={{
                          fontSize: "14px", lineHeight: 1.65,
                          color: "#0F0E0E", margin: "0 0 8px",
                        }}>
                          {f.description}
                        </p>
                      )}
                      {detail && (
                        <p style={{
                          fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px",
                          color: "rgba(15,14,14,0.45)", margin: "0 0 8px",
                          lineHeight: 1.6,
                        }}>
                          {detail}
                        </p>
                      )}
                      {recommendation && (
                        <p style={{
                          fontSize: "12px", color: "rgba(15,14,14,0.5)",
                          margin: 0, lineHeight: 1.6,
                          paddingLeft: "12px",
                          borderLeft: "2px solid rgba(15,14,14,0.1)",
                        }}>
                          {recommendation}
                        </p>
                      )}
                    </div>

                    {label && (
                      <span style={{
                        fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px",
                        fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase",
                        color,
                        border: `1px solid ${color}`,
                        padding: "3px 10px",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}>
                        {label}
                      </span>
                    )}
                  </div>
                );
              })}
            </section>
          )}

          <div className="no-print" style={{ marginTop: "48px", display: "flex", gap: "12px", alignItems: "center" }}>
            <a href="/dashboard" style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px",
              letterSpacing: "0.1em", textTransform: "uppercase",
              color: "rgba(15,14,14,0.4)", textDecoration: "none",
            }}>
              ← Dashboard
            </a>
          </div>

        </div>
      </div>
    </>
  );
}
