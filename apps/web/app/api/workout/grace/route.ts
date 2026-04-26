import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { getDb } from "@/lib/db";

function getWeekStart(today: string): string {
  const d = new Date(today + "T00:00:00");
  const dow = d.getDay();
  const offset = dow === 0 ? -6 : 1 - dow;
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let session;
  try {
    session = await verifyToken(token);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const sql = getDb();
  const today = new Date().toISOString().slice(0, 10);
  const weekStart = getWeekStart(today);

  await Promise.all([
    sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS grace_days_used INTEGER DEFAULT 0`,
    sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS grace_week_start DATE`,
  ]);

  type UserRow = {
    streak: number;
    last_streak_date: string | null;
    grace_days_used: number;
    grace_week_start: string | null;
  };
  const rows = (await sql`
    SELECT streak, last_streak_date::text, grace_days_used, grace_week_start::text
    FROM users WHERE id = ${session.userId}
  `) as UserRow[];
  const user = rows[0];
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const isNewWeek =
    !user.grace_week_start ||
    String(user.grace_week_start).slice(0, 10) < weekStart;
  const graceUsed = isNewWeek ? 0 : (user.grace_days_used ?? 0);

  if (graceUsed >= 1) {
    return NextResponse.json({ error: "Grace day already used this week" }, { status: 400 });
  }

  const planRows = (await sql`
    SELECT day_indices FROM workout_plans WHERE user_id = ${session.userId}
  `) as unknown as { day_indices: number[] }[];
  if (!planRows[0]) return NextResponse.json({ error: "No workout plan" }, { status: 400 });

  const monday = new Date(weekStart + "T00:00:00");
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().slice(0, 10);
  });

  const logRows = (await sql`
    SELECT log_date::text FROM workout_logs
    WHERE user_id = ${session.userId}
    AND log_date >= ${weekStart}::date
    AND log_date < ${today}::date
  `) as unknown as { log_date: string }[];
  const weekLogs = logRows.map((r) => String(r.log_date).slice(0, 10));

  const missedDate =
    planRows[0].day_indices
      .map((i) => weekDates[i])
      .filter((d) => d && d < today && !weekLogs.includes(d))
      .pop() ?? null;

  if (!missedDate) {
    return NextResponse.json({ error: "No missed workout found" }, { status: 400 });
  }

  // Log the missed day and preserve streak chain
  await sql`
    INSERT INTO workout_logs (user_id, log_date)
    VALUES (${session.userId}, ${missedDate}::date)
    ON CONFLICT (user_id, log_date) DO NOTHING
  `;

  const lastDate = user.last_streak_date
    ? String(user.last_streak_date).slice(0, 10)
    : null;
  if (!lastDate || missedDate > lastDate) {
    await sql`
      UPDATE users SET last_streak_date = ${missedDate}::date WHERE id = ${session.userId}
    `;
  }

  await sql`
    UPDATE users
    SET grace_days_used = 1, grace_week_start = ${weekStart}::date
    WHERE id = ${session.userId}
  `;

  return NextResponse.json({ success: true, graceDate: missedDate });
}
