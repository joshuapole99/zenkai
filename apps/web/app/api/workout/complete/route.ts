import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { getDb } from "@/lib/db";

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

  await sql`
    CREATE TABLE IF NOT EXISTS workout_logs (
      id         SERIAL PRIMARY KEY,
      user_id    INTEGER NOT NULL,
      log_date   DATE NOT NULL DEFAULT CURRENT_DATE,
      UNIQUE(user_id, log_date)
    )
  `;

  // Idempotent: ignore if already logged today
  await sql`
    INSERT INTO workout_logs (user_id, log_date)
    VALUES (${session.userId}, ${today}::date)
    ON CONFLICT (user_id, log_date) DO NOTHING
  `;

  // Update streak
  type UserRow = { streak: number | null; last_streak_date: string | null };
  const rows = (await sql`
    SELECT streak, last_streak_date FROM users WHERE id = ${session.userId}
  `) as unknown as UserRow[];
  const user = rows[0];
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const lastDate = user.last_streak_date ? String(user.last_streak_date).slice(0, 10) : null;
  const yesterday = new Date(today + "T00:00:00");
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  let newStreak = user.streak ?? 0;
  if (lastDate === today) {
    // Already counted today
  } else if (lastDate === yesterdayStr) {
    newStreak += 1;
  } else {
    newStreak = 1;
  }

  await sql`
    UPDATE users
    SET streak = ${newStreak}, last_streak_date = ${today}::date
    WHERE id = ${session.userId}
  `;

  return NextResponse.json({ success: true, newStreak });
}
