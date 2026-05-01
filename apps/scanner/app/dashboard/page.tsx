import { redirect } from "next/navigation";
import { getServerClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";

const PLAN_COLOR: Record<string, string> = {
  free:    "#6b6b8a",
  starter: "oklch(0.68 0.19 45)",
  pro:     "oklch(0.55 0.22 290)",
};

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

  const planColor = PLAN_COLOR[plan] ?? PLAN_COLOR.free;

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--z-bg, #09090f)",
      color: "var(--z-text, #e4e4f0)",
      padding: "48px 24px",
      fontFamily: "'Rajdhani', sans-serif",
    }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, letterSpacing: "0.04em" }}>
            Dashboard
          </h1>
          <p style={{ color: "#6b6b8a", margin: "8px 0 0", fontSize: 15 }}>
            {user.email}
          </p>
        </div>

        {/* Plan badge */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          background: "var(--z-surface, #111118)",
          border: "1px solid var(--z-border, #252535)",
          borderRadius: 10,
          padding: "14px 20px",
          marginBottom: 40,
        }}>
          <span style={{ fontSize: 12, color: "#6b6b8a", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Huidig plan
          </span>
          <span style={{
            fontSize: 14,
            fontWeight: 700,
            color: planColor,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
          }}>
            {plan}
          </span>
          {plan === "free" && (
            <a
              href="/#pricing"
              style={{
                marginLeft: 8,
                fontSize: 12,
                color: "oklch(0.68 0.19 45)",
                textDecoration: "none",
                border: "1px solid oklch(0.68 0.19 45 / 0.4)",
                borderRadius: 6,
                padding: "3px 10px",
              }}
            >
              Upgrade
            </a>
          )}
        </div>

        {/* Scan history */}
        <h2 style={{ fontSize: 18, fontWeight: 600, margin: "0 0 16px", letterSpacing: "0.04em" }}>
          Scan geschiedenis
        </h2>

        {!scans || scans.length === 0 ? (
          <div style={{
            background: "var(--z-surface, #111118)",
            border: "1px solid var(--z-border, #252535)",
            borderRadius: 10,
            padding: "40px 24px",
            textAlign: "center",
            color: "#6b6b8a",
            fontSize: 15,
          }}>
            Nog geen scans uitgevoerd.
          </div>
        ) : (
          <div style={{
            background: "var(--z-surface, #111118)",
            border: "1px solid var(--z-border, #252535)",
            borderRadius: 10,
            overflow: "hidden",
          }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--z-border, #252535)" }}>
                  {["Domein", "Type", "Datum", "Rapport"].map((h) => (
                    <th key={h} style={{
                      textAlign: "left",
                      padding: "12px 16px",
                      color: "#6b6b8a",
                      fontWeight: 600,
                      fontSize: 12,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
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
                    style={{
                      borderBottom: i < scans.length - 1 ? "1px solid var(--z-border, #252535)" : "none",
                    }}
                  >
                    <td style={{ padding: "14px 16px", fontFamily: "monospace", fontSize: 13 }}>
                      {scan.domain}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        color: scan.scan_type === "full"
                          ? "oklch(0.55 0.22 290)"
                          : "oklch(0.68 0.19 45)",
                        background: scan.scan_type === "full"
                          ? "oklch(0.55 0.22 290 / 0.12)"
                          : "oklch(0.68 0.19 45 / 0.12)",
                        border: `1px solid ${scan.scan_type === "full"
                          ? "oklch(0.55 0.22 290 / 0.3)"
                          : "oklch(0.68 0.19 45 / 0.3)"}`,
                        borderRadius: 5,
                        padding: "2px 8px",
                      }}>
                        {scan.scan_type === "full" ? "Full" : "Quick"}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px", color: "#6b6b8a", fontSize: 13 }}>
                      {formatDate(scan.created_at)}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      {scan.scan_type === "full" ? (
                        <a
                          href={`/api/report/${scan.domain}`}
                          style={{
                            fontSize: 12,
                            color: "oklch(0.55 0.22 290)",
                            textDecoration: "none",
                            border: "1px solid oklch(0.55 0.22 290 / 0.4)",
                            borderRadius: 6,
                            padding: "4px 12px",
                            display: "inline-block",
                          }}
                        >
                          PDF
                        </a>
                      ) : (
                        <span style={{ color: "#3a3a55", fontSize: 12 }}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {retentionDays && (
          <p style={{ marginTop: 12, fontSize: 12, color: "#3a3a55" }}>
            Scans ouder dan {retentionDays === 30 ? "30 dagen" : "1 jaar"} worden niet getoond.
            {plan === "free" && " Upgrade naar Starter of Pro voor langere geschiedenis."}
          </p>
        )}

      </div>
    </div>
  );
}
