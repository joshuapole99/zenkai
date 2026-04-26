import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { getDailyQuests } from "@/lib/quests";

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let user;
  try {
    user = await verifyToken(token);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const { questId } = await req.json();
  if (typeof questId !== "number") {
    return NextResponse.json({ error: "questId required" }, { status: 400 });
  }

  const today = new Date().toISOString().slice(0, 10);
  const dailyQuestIds = getDailyQuests(today).map((q) => q.id);
  if (!dailyQuestIds.includes(questId)) {
    return NextResponse.json({ error: "Not a valid quest for today" }, { status: 400 });
  }

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

  try {
    await sql`
      INSERT INTO quest_completions (user_id, quest_id, completed_date)
      VALUES (${user.userId}, ${questId}, ${today})
    `;
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "23505") {
      return NextResponse.json({ error: "Already completed" }, { status: 409 });
    }
    throw err;
  }

  const completions = (await sql`
    SELECT quest_id FROM quest_completions
    WHERE user_id = ${user.userId} AND completed_date = ${today}::date
  `) as { quest_id: number }[];

  // Coerce to number — Neon can return integer columns as strings
  const completedIds = completions.map((r) => Number(r.quest_id));
  const allDone = dailyQuestIds.every((id) => completedIds.includes(id));

  let newXp: number | null = null;
  let newStreak: number | null = null;

  if (allDone) {
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
    newXp = updated.xp;
    newStreak = updated.streak;
  }

  return NextResponse.json({ success: true, completedIds, allDone, newXp, newStreak });
}
