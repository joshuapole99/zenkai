import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { getDb } from "@/lib/db";

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

  const { all } = await req.json().catch(() => ({ all: false }));
  const sql = getDb();

  if (all) {
    // Wipe all users — blocked in production
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    await sql`UPDATE users SET
      onboarding_complete = FALSE,
      character_name      = NULL,
      character_class     = NULL,
      fitness_level       = NULL,
      xp                  = 0,
      streak              = 0,
      hp                  = 100,
      story_day           = 1,
      last_story_date     = NULL,
      last_story_day_seen = 0,
      last_streak_date    = NULL,
      weight_kg           = NULL,
      height_cm           = NULL,
      age                 = NULL,
      protein_goal        = NULL,
      avatar_config       = NULL
    `;
    await sql`DELETE FROM quest_completions`;
    await sql`DELETE FROM food_logs`;
    await sql`DELETE FROM quest_swaps`;
    await sql`DELETE FROM side_quest_completions`;
    await sql`DELETE FROM workout_plans`;
    await sql`DELETE FROM workout_logs`;
  } else {
    // Reset current user only
    await sql`UPDATE users SET
      onboarding_complete = FALSE,
      character_name      = NULL,
      character_class     = NULL,
      fitness_level       = NULL,
      xp                  = 0,
      streak              = 0,
      hp                  = 100,
      story_day           = 1,
      last_story_date     = NULL,
      last_story_day_seen = 0,
      last_streak_date    = NULL,
      weight_kg           = NULL,
      height_cm           = NULL,
      age                 = NULL,
      protein_goal        = NULL,
      avatar_config       = NULL
    WHERE id = ${user.userId}`;
    await sql`DELETE FROM quest_completions     WHERE user_id = ${user.userId}`;
    await sql`DELETE FROM food_logs             WHERE user_id = ${user.userId}`;
    await sql`DELETE FROM quest_swaps           WHERE user_id = ${user.userId}`;
    await sql`DELETE FROM side_quest_completions WHERE user_id = ${user.userId}`;
    await sql`DELETE FROM workout_plans         WHERE user_id = ${user.userId}`;
    await sql`DELETE FROM workout_logs          WHERE user_id = ${user.userId}`;
  }

  return NextResponse.json({ success: true, reset: all ? "all users (dev only)" : "current user" });
}
