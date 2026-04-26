import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { getDailyQuests } from "@/lib/quests";

// Floor Session: marks all daily quests complete in one shot.
// Intended for days when the user can only do "the minimum dose" —
// checking in still counts, earns full XP + streak.
export async function POST(_req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let user;
  try {
    user = await verifyToken(token);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const today = new Date().toISOString().slice(0, 10);
  const dailyQuests = getDailyQuests(today);
  const dailyQuestIds = dailyQuests.map((q) => q.id);

  const sql = getDb();

  await sql`
    CREATE TABLE IF NOT EXISTS quest_completions (
      id             SERIAL PRIMARY KEY,
      user_id        INTEGER NOT NULL,
      quest_id       INTEGER NOT NULL,
      completed_date DATE NOT NULL DEFAULT CURRENT_DATE,
      UNIQUE(user_id, quest_id, completed_date)
    )
  `;

  // Check if all quests were already complete before this call
  const existing = (await sql`
    SELECT quest_id FROM quest_completions
    WHERE user_id = ${user.userId} AND completed_date = ${today}::date
  `) as { quest_id: number }[];
  const existingIds = existing.map((r) => Number(r.quest_id));
  const alreadyAllDone = dailyQuestIds.every((id) => existingIds.includes(id));

  if (!alreadyAllDone) {
    for (const questId of dailyQuestIds) {
      await sql`
        INSERT INTO quest_completions (user_id, quest_id, completed_date)
        VALUES (${user.userId}, ${questId}, ${today})
        ON CONFLICT DO NOTHING
      `;
    }

    const [updated] = (await sql`
      UPDATE users
      SET xp = COALESCE(xp, 0) + 100,
          streak = CASE
            WHEN last_streak_date = (${today}::date - INTERVAL '1 day')
            THEN COALESCE(streak, 0) + 1
            ELSE 1
          END,
          last_streak_date = ${today}::date
      WHERE id = ${user.userId}
      RETURNING xp, streak
    `) as { xp: number; streak: number }[];

    return NextResponse.json({ success: true, completedIds: dailyQuestIds, newXp: updated.xp, newStreak: updated.streak });
  }

  // Already done — return current values without double-awarding XP
  const [cur] = (await sql`SELECT xp, streak FROM users WHERE id = ${user.userId}`) as { xp: number; streak: number }[];
  return NextResponse.json({ success: true, completedIds: dailyQuestIds, newXp: cur.xp, newStreak: cur.streak });
}
