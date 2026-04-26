import { getSession } from "@/lib/session";
import { sql } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [userRows, scanRows] = await Promise.all([
    sql`SELECT email, naam, created_at FROM users WHERE id = ${session.userId}`,
    sql`SELECT COUNT(*) as count FROM scans WHERE user_id = ${session.userId}`,
  ]);

  let planRows: unknown[] = [];
  try {
    planRows = await sql`SELECT id, created_at FROM plans WHERE user_id = ${session.userId} ORDER BY created_at DESC LIMIT 1`;
  } catch {
    // plans table may not exist yet
  }

  const user = userRows[0] as { email: string; naam: string | null; created_at: string };
  const hasPlan = planRows.length > 0;
  const scanCount = parseInt((scanRows[0] as { count: string }).count);

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Account</h1>
        <p className="text-muted text-sm mt-0.5">Jouw accountgegevens en plan.</p>
      </div>

      {/* Tier */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-card">
        <p className="text-xs text-muted uppercase tracking-wide font-medium mb-3">Plan</p>
        {hasPlan ? (
          <div className="flex items-center gap-3">
            <span className="bg-accent/15 text-accent border border-accent/30 text-sm font-semibold px-3 py-1.5 rounded-xl">
              Persoonlijk plan ✓
            </span>
            <span className="text-xs text-muted">
              Gekocht op {new Date((planRows[0] as { created_at: string }).created_at).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between flex-wrap gap-3">
            <span className="bg-card border border-border text-muted text-sm font-medium px-3 py-1.5 rounded-xl">
              Gratis
            </span>
            <Link
              href="/upgrade"
              className="text-sm font-semibold bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-xl transition-all shadow-lg shadow-accent/20"
            >
              Upgrade naar plan →
            </Link>
          </div>
        )}
      </div>

      {/* Account info */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-card space-y-4">
        <p className="text-xs text-muted uppercase tracking-wide font-medium">Gegevens</p>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted">Email</span>
            <span className="text-foreground font-medium">{user.email}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted">Lid sinds</span>
            <span className="text-foreground">
              {new Date(user.created_at).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted">Scans gedaan</span>
            <span className="text-foreground">{scanCount}</span>
          </div>
        </div>
      </div>

      {/* Logout */}
      <form action="/api/auth/logout" method="POST">
        <button
          type="submit"
          className="text-sm text-muted hover:text-danger transition-colors"
        >
          Uitloggen
        </button>
      </form>
    </div>
  );
}
