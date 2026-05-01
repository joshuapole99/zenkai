import { redirect } from "next/navigation";
import { getServerClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";
import { FontLoader } from "./FontLoader";

const PLAN_RETENTION_DAYS: Record<string, number | null> = {
  free:    30,
  starter: 365,
  pro:     null,
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("nl-NL", {
    timeZone: "Europe/Amsterdam",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function DashboardPage() {
  const sb = await getServerClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/");

  const { data: userRow } = await supabaseAdmin
    .from("users")
    .select("plan")
    .eq("email", user.email!)
    .single();

  const plan = (userRow?.plan ?? "free") as string;
  const retentionDays = PLAN_RETENTION_DAYS[plan] ?? 30;
  const cutoff = retentionDays
    ? new Date(Date.now() - retentionDays * 86_400_000).toISOString()
    : null;

  let scansQuery = supabaseAdmin
    .from("scans")
    .select("id, domain, scan_type, status, created_at")
    .eq("user_email", user.email!)
    .order("created_at", { ascending: false })
    .limit(100);

  if (cutoff) scansQuery = scansQuery.gte("created_at", cutoff);

  const { data: scans } = await scansQuery;

  const planLabel = plan.charAt(0).toUpperCase() + plan.slice(1);
  const planColor = plan === "free" ? "rgba(15,14,14,0.35)" : "#0284C7";

  return (
    <>
      <FontLoader />
      <style>{`
        @keyframes hf { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        .dash-table tr:last-child td { border-bottom: none !important; }
        .dash-pdf-btn:hover { background: #0F0E0E !important; color: #fff !important; }
        .dash-upgrade:hover { background: #0284C7 !important; color: #fff !important; }
      `}</style>

      <div style={{ background: "#ffffff", color: "#0F0E0E", minHeight: "100vh" }}>

        {/* Header */}
        <section style={{ padding: "64px 40px 0", maxWidth: "1200px", margin: "0 auto" }}>
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "11px", letterSpacing: "0.2em",
            color: "rgba(15,14,14,0.35)", textTransform: "uppercase",
            display: "block", marginBottom: "16px",
          }}>
            Account
          </span>
          <h1 style={{
            fontFamily: "'Fraunces', Georgia, serif", fontWeight: 900,
            fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "-0.04em",
            lineHeight: 0.93, color: "#0F0E0E", margin: "0 0 8px",
          }}>
            Dashboard
          </h1>
          <p style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px",
            color: "rgba(15,14,14,0.35)", letterSpacing: "0.04em",
            margin: "12px 0 0",
          }}>
            {user.email}
          </p>
        </section>

        {/* Plan */}
        <section style={{ padding: "40px 40px 0", maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "16px",
            border: "1px solid rgba(15,14,14,0.1)", padding: "16px 24px",
          }}>
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px",
              letterSpacing: "0.2em", textTransform: "uppercase",
              color: "rgba(15,14,14,0.35)",
            }}>
              Huidig plan
            </span>
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: "13px",
              fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase",
              color: planColor,
            }}>
              {planLabel}
            </span>
            {plan === "free" && (
              <a
                href="/#pricing"
                className="dash-upgrade"
                style={{
                  fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px",
                  fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase",
                  color: "#0284C7", textDecoration: "none",
                  border: "1px solid #0284C7", padding: "5px 14px",
                  transition: "background 0.15s, color 0.15s",
                }}
              >
                Upgrade →
              </a>
            )}
          </div>
        </section>

        {/* Scan history */}
        <section style={{ padding: "48px 40px 100px", maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "baseline",
            paddingBottom: "16px", borderBottom: "2px solid #0F0E0E", marginBottom: "1px",
          }}>
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px",
              fontWeight: 600, letterSpacing: "0.2em",
              color: "rgba(15,14,14,0.4)", textTransform: "uppercase",
            }}>
              Scan geschiedenis
            </span>
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px",
              color: "rgba(15,14,14,0.3)",
            }}>
              {scans?.length ?? 0} scan{scans?.length !== 1 ? "s" : ""}
              {retentionDays ? ` · laatste ${retentionDays === 30 ? "30 dagen" : "jaar"}` : ""}
            </span>
          </div>

          {!scans || scans.length === 0 ? (
            <div style={{
              padding: "60px 0", textAlign: "center",
              background: "#F5F3EC",
            }}>
              <p style={{
                fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px",
                color: "rgba(15,14,14,0.3)", letterSpacing: "0.08em",
                textTransform: "uppercase", margin: "0 0 20px",
              }}>
                Nog geen scans
              </p>
              <a href="/scan" style={{
                fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px",
                fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
                color: "#ffffff", textDecoration: "none",
                background: "#0284C7", padding: "12px 24px",
                display: "inline-block",
              }}>
                Start eerste scan →
              </a>
            </div>
          ) : (
            <table className="dash-table" style={{
              width: "100%", borderCollapse: "collapse",
              background: "#F5F3EC",
            }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(15,14,14,0.08)" }}>
                  {["Domein", "Type", "Datum", "Rapport"].map((h) => (
                    <th key={h} style={{
                      textAlign: "left", padding: "12px 20px",
                      fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px",
                      fontWeight: 600, letterSpacing: "0.18em",
                      textTransform: "uppercase", color: "rgba(15,14,14,0.35)",
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scans.map((scan, i) => (
                  <tr
                    key={scan.id}
                    style={{ borderBottom: "1px solid rgba(15,14,14,0.06)" }}
                  >
                    <td style={{
                      padding: "16px 20px",
                      fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px",
                      color: "#0F0E0E", fontWeight: 500,
                    }}>
                      {scan.domain}
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      <span style={{
                        fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px",
                        fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase",
                        color: scan.scan_type === "full" ? "#0F0E0E" : "#0284C7",
                        border: `1px solid ${scan.scan_type === "full" ? "rgba(15,14,14,0.25)" : "#0284C7"}`,
                        padding: "3px 10px",
                      }}>
                        {scan.scan_type === "full" ? "Full" : "Quick"}
                      </span>
                    </td>
                    <td style={{
                      padding: "16px 20px",
                      fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px",
                      color: "rgba(15,14,14,0.4)",
                    }}>
                      {formatDate(scan.created_at)}
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      {scan.scan_type === "full" ? (
                        <a
                          href={`/api/report/${scan.domain}`}
                          className="dash-pdf-btn"
                          style={{
                            fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px",
                            fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase",
                            color: "#0F0E0E", textDecoration: "none",
                            border: "1px solid rgba(15,14,14,0.25)", padding: "5px 14px",
                            display: "inline-block", transition: "background 0.15s, color 0.15s",
                          }}
                        >
                          PDF ↓
                        </a>
                      ) : (
                        <span style={{
                          fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px",
                          color: "rgba(15,14,14,0.2)",
                        }}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {plan === "free" && scans && scans.length > 0 && (
            <p style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px",
              color: "rgba(15,14,14,0.28)", letterSpacing: "0.06em",
              marginTop: "12px",
            }}>
              Free plan toont scans van de laatste 30 dagen.{" "}
              <a href="/#pricing" style={{ color: "#0284C7", textDecoration: "none" }}>
                Upgrade voor langere geschiedenis.
              </a>
            </p>
          )}
        </section>

      </div>
    </>
  );
}
