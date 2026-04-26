import Link from "next/link";
import { getSession } from "@/lib/session";
import { sql } from "@/lib/db";
import { redirect } from "next/navigation";

function eur(n: number) {
  return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [scans, doelen, assets] = await Promise.all([
    sql`SELECT id, doel_naam, result, params, created_at FROM scans WHERE user_id = ${session.userId} ORDER BY created_at DESC LIMIT 5`,
    sql`SELECT id, naam, doel_bedrag, huidig_bedrag, deadline FROM spaardoelen WHERE user_id = ${session.userId} ORDER BY created_at ASC`,
    sql`SELECT type, SUM(waarde::numeric) as totaal FROM assets WHERE user_id = ${session.userId} GROUP BY type`,
  ]);

  const totalAssets = (assets as { type: string; totaal: string }[]).reduce(
    (sum, a) => sum + parseFloat(a.totaal ?? "0"), 0
  );

  const latestScan = scans[0] as { id: string; doel_naam: string; result: Record<string, unknown>; params: Record<string, unknown>; created_at: string } | undefined;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          Jouw overzicht
        </h1>
        <p className="text-muted mt-1 text-sm">{session.email}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-card border border-border rounded-2xl p-4 shadow-card">
          <p className="text-xs text-muted mb-1 uppercase tracking-wide font-medium">Totaal vermogen</p>
          <p className="text-xl font-bold text-foreground">{eur(totalAssets)}</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 shadow-card">
          <p className="text-xs text-muted mb-1 uppercase tracking-wide font-medium">Actieve doelen</p>
          <p className="text-xl font-bold text-foreground">{doelen.length}</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 shadow-card col-span-2 sm:col-span-1">
          <p className="text-xs text-muted mb-1 uppercase tracking-wide font-medium">Scans gedaan</p>
          <p className="text-xl font-bold text-foreground">{scans.length}</p>
        </div>
      </div>

      {/* Spaardoelen */}
      {doelen.length > 0 ? (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-foreground">Spaardoelen</h2>
            <Link href="/dashboard/spaardoelen" className="text-sm text-accent hover:text-accent-hover transition-colors">
              Beheer →
            </Link>
          </div>
          <div className="space-y-3">
            {(doelen as { id: string; naam: string; doel_bedrag: string; huidig_bedrag: string; deadline: string | null }[]).map((d) => {
              const pct = Math.min(100, Math.round((parseFloat(d.huidig_bedrag) / parseFloat(d.doel_bedrag)) * 100));
              return (
                <div key={d.id} className="bg-card border border-border rounded-2xl p-4 shadow-card">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium text-foreground text-sm">{d.naam}</p>
                    <p className="text-sm text-muted">{pct}%</p>
                  </div>
                  <div className="h-2 bg-background rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-accent transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-muted">
                    <span>{eur(parseFloat(d.huidig_bedrag))} gespaard</span>
                    <span>doel: {eur(parseFloat(d.doel_bedrag))}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : (
        <section className="bg-card border border-border rounded-2xl p-6 shadow-card text-center">
          <p className="text-muted text-sm mb-3">Je hebt nog geen spaardoelen aangemaakt.</p>
          <Link
            href="/dashboard/spaardoelen"
            className="inline-block bg-accent hover:bg-accent-hover text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-accent/20"
          >
            Eerste doel toevoegen
          </Link>
        </section>
      )}

      {/* Laatste scan */}
      {latestScan && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-foreground">Laatste scan</h2>
            <Link href="/scan" className="text-sm text-accent hover:text-accent-hover transition-colors">
              Nieuwe scan →
            </Link>
          </div>
          <div className="bg-card border border-border rounded-2xl p-4 shadow-card">
            <p className="text-sm font-medium text-foreground mb-1">
              {latestScan.doel_naam ?? "Spaardoel"}
            </p>
            <p className="text-xs text-muted">
              {new Date(latestScan.created_at).toLocaleDateString("nl-NL", {
                day: "numeric", month: "long", year: "numeric",
              })}
            </p>
            {latestScan.result && (
              <div className="mt-3 flex gap-2 flex-wrap">
                {(() => {
                  const r = latestScan.result as { status?: string; savingsCapacity?: number };
                  const statusLabel: Record<string, string> = {
                    achievable: "Haalbaar",
                    warning: "Krap",
                    "not-achievable": "Niet haalbaar",
                  };
                  const statusColor: Record<string, string> = {
                    achievable: "text-success bg-success/10 border-success/20",
                    warning: "text-warning bg-warning/10 border-warning/20",
                    "not-achievable": "text-danger bg-danger/10 border-danger/20",
                  };
                  return (
                    <>
                      {r.status && (
                        <span className={`text-xs px-2 py-1 rounded-lg border font-medium ${statusColor[r.status] ?? "text-muted bg-card border-border"}`}>
                          {statusLabel[r.status] ?? r.status}
                        </span>
                      )}
                      {r.savingsCapacity != null && (
                        <span className="text-xs px-2 py-1 rounded-lg border border-border text-muted">
                          Spaarruimte: {eur(r.savingsCapacity as number)}/mnd
                        </span>
                      )}
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        </section>
      )}

      {!latestScan && (
        <section className="bg-card border border-border rounded-2xl p-6 shadow-card text-center">
          <p className="text-muted text-sm mb-3">Doe je eerste scan om te zien hoeveel je kunt sparen.</p>
          <Link
            href="/scan"
            className="inline-block bg-accent hover:bg-accent-hover text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-accent/20"
          >
            Scan starten
          </Link>
        </section>
      )}
    </div>
  );
}
