export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { verifyToken } from "@/lib/auth";
import { getDb } from "@/lib/db";
import LogoutButton from "./LogoutButton";
import DashboardClient from "./DashboardClient";

type UserRow = {
  id: number;
  username: string;
  character_name: string | null;
  character_class: string | null;
  xp: number | null;
  streak: number | null;
  onboarding_complete: boolean | null;
  is_founding_member: boolean | null;
  weak_spot: string | null;
  fighter_type: string | null;
};

export type WorkoutPlan = {
  exercises: { name: string; detail: string }[];
  dayIndices: number[];
  timeOfDay: string;
};

type PlanRow = {
  exercises: { name: string; detail: string }[];
  day_indices: number[];
  time_of_day: string;
};

function DashboardError() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#0a0a0a" }}>
      <div className="text-center max-w-sm">
        <p className="text-lg font-black text-white mb-2">Something went wrong.</p>
        <p className="text-sm text-gray-500 mb-6">Try again in a moment.</p>
        <a
          href="/dashboard"
          className="inline-block px-6 py-3 rounded-xl text-sm font-bold text-white"
          style={{ background: "linear-gradient(135deg, #FF6B35, #7C3AED)" }}
        >
          Retry
        </a>
      </div>
    </div>
  );
}

function getWeekStart(today: string): string {
  const d = new Date(today + "T00:00:00");
  const dow = d.getDay();
  const offset = dow === 0 ? -6 : 1 - dow;
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

function getWeekDates(weekStart: string): string[] {
  const monday = new Date(weekStart + "T00:00:00");
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().slice(0, 10);
  });
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) redirect("/login");

  let session;
  try {
    session = await verifyToken(token);
  } catch {
    redirect("/login");
  }

  const sql = getDb();

  // Ensure columns exist
  await Promise.all([
    sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS character_class TEXT`,
    sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS character_name TEXT`,
    sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0`,
    sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarding_complete BOOLEAN DEFAULT FALSE`,
    sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS streak INTEGER DEFAULT 0`,
    sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS last_streak_date DATE`,
    sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS is_founding_member BOOLEAN DEFAULT FALSE`,
    sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS weak_spot TEXT`,
    sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS fighter_type TEXT`,
  ]).catch((e) => console.error("[dashboard] migration error:", e));

  let user: UserRow;
  try {
    const rows = (await sql`
      SELECT id, username, character_name, character_class, xp, streak,
             onboarding_complete, is_founding_member, weak_spot, fighter_type
      FROM users WHERE id = ${session.userId}
    `) as UserRow[];
    if (!rows[0]) redirect("/login");
    user = rows[0];
  } catch (e) {
    console.error("[dashboard] user fetch error:", e);
    return <DashboardError />;
  }

  if (!user.onboarding_complete) redirect("/onboarding");

  const today = new Date().toISOString().slice(0, 10);

  try {
    // Ensure grace day columns exist
    await Promise.all([
      sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS grace_days_used INTEGER DEFAULT 0`,
      sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS grace_week_start DATE`,
    ]).catch((e) => console.error("[dashboard] grace migration error:", e));

    // Ensure tables exist
    await Promise.all([
      sql`
        CREATE TABLE IF NOT EXISTS workout_plans (
          id          SERIAL PRIMARY KEY,
          user_id     INTEGER NOT NULL UNIQUE,
          exercises   JSONB NOT NULL DEFAULT '[]',
          day_indices INTEGER[] DEFAULT '{0,2,4}',
          time_of_day TEXT DEFAULT 'flexible',
          updated_at  TIMESTAMPTZ DEFAULT NOW()
        )
      `,
      sql`
        CREATE TABLE IF NOT EXISTS workout_logs (
          id       SERIAL PRIMARY KEY,
          user_id  INTEGER NOT NULL,
          log_date DATE NOT NULL DEFAULT CURRENT_DATE,
          UNIQUE(user_id, log_date)
        )
      `,
    ]);

    // Data fix: correct "squads" typo in any workout plan exercises
    sql`
      UPDATE workout_plans
      SET exercises = (
        SELECT jsonb_agg(
          CASE WHEN lower(e->>'name') = 'squads'
          THEN jsonb_set(e, '{name}', '"Squats"')
          ELSE e END
        )
        FROM jsonb_array_elements(exercises) e
      )
      WHERE exercises::text ILIKE '%squads%'
    `.catch(() => {});

    // Fetch workout plan + this week's logs in parallel
    const weekStart = getWeekStart(today);
    const weekDates = getWeekDates(weekStart);
    const [planRows, logRows, lastLogRows, graceRows] = await Promise.all([
      sql`SELECT exercises, day_indices, time_of_day FROM workout_plans WHERE user_id = ${user.id}`,
      sql`
        SELECT log_date::text FROM workout_logs
        WHERE user_id = ${user.id}
        AND log_date >= ${weekStart}::date
        AND log_date <= ${today}::date
      `,
      sql`
        SELECT log_date::text FROM workout_logs
        WHERE user_id = ${user.id}
        ORDER BY log_date DESC LIMIT 1
      `,
      sql`
        SELECT grace_days_used, grace_week_start::text FROM users WHERE id = ${user.id}
      `,
    ]);

    const rawPlan = (planRows as PlanRow[])[0] ?? null;
    const workoutPlan: WorkoutPlan | null = rawPlan
      ? {
          exercises: rawPlan.exercises ?? [],
          dayIndices: rawPlan.day_indices ?? [],
          timeOfDay: rawPlan.time_of_day ?? "flexible",
        }
      : null;

    const thisWeekLogs = (logRows as { log_date: string }[]).map((r) =>
      String(r.log_date).slice(0, 10)
    );
    const isLoggedToday = thisWeekLogs.includes(today);

    const graceRow = (graceRows as { grace_days_used: number; grace_week_start: string | null }[])[0];
    const graceWeekStart = graceRow?.grace_week_start ? String(graceRow.grace_week_start).slice(0, 10) : null;
    const isNewWeek = !graceWeekStart || graceWeekStart < weekStart;
    const graceAvailable = isNewWeek || (graceRow?.grace_days_used ?? 0) < 1;

    const missedWorkoutDate = workoutPlan
      ? (workoutPlan.dayIndices
          .map((i) => weekDates[i])
          .filter((d) => d && d < today && !thisWeekLogs.includes(d))
          .pop() ?? null)
      : null;

    const lastLogDate = (lastLogRows as { log_date: string }[])[0]?.log_date
      ? String((lastLogRows as { log_date: string }[])[0].log_date).slice(0, 10)
      : null;

    // Zenkai Boost: has a plan, has logged before, and last log was 3+ days ago
    const isZenkaiBoost = !!(
      workoutPlan &&
      lastLogDate &&
      Math.floor(
        (new Date(today).getTime() - new Date(lastLogDate).getTime()) / 86400000
      ) >= 3
    );

    return (
      <div className="min-h-screen" style={{ background: "#0a0a0a" }}>
        <header
          className="flex items-center justify-between px-4 py-4 border-b"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <span className="font-black text-lg tracking-tight gradient-text">ZENKAI</span>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-600">{user.username}</span>
            <LogoutButton />
          </div>
        </header>

        <DashboardClient
          characterName={user.character_name ?? user.username}
          characterClass={user.character_class ?? "saiyan"}
          xp={user.xp ?? 0}
          streak={user.streak ?? 0}
          workoutPlan={workoutPlan}
          thisWeekLogs={thisWeekLogs}
          isLoggedToday={isLoggedToday}
          today={today}
          weakSpot={user.weak_spot ?? null}
          fighterType={user.fighter_type ?? null}
          isZenkaiBoost={isZenkaiBoost}
          isFoundingMember={user.is_founding_member ?? false}
          lastWorkoutDate={lastLogDate}
          graceAvailable={graceAvailable}
          missedWorkoutDate={missedWorkoutDate}
        />

        <footer
          className="border-t py-6 px-4 mt-4"
          style={{ borderColor: "rgba(255,255,255,0.04)" }}
        >
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <p className="text-xs text-gray-800">© 2026 Zenkai</p>
            <div className="flex gap-4 text-xs text-gray-700">
              <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-gray-400 transition-colors">Terms</Link>
            </div>
          </div>
        </footer>
      </div>
    );
  } catch (e) {
    console.error("[dashboard] render error:", e);
    return <DashboardError />;
  }
}
