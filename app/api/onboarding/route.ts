import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { getDb } from "@/lib/db";

const VALID_CLASSES      = ["saiyan", "shadow", "guardian"];
const VALID_WEAK_SPOTS   = ["busy_weeks", "motivation_dips", "travel", "injury"];
const VALID_FIGHTER_TYPES = ["comeback_king", "unbreakable", "survivor", "quiet_beast"];
const VALID_TIMES        = ["morning", "afternoon", "evening", "flexible"];

type ExerciseInput = { name: string; detail: string };

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

  const body = await req.json();
  const { characterClass, characterName, weakSpot: rawWeakSpot, fighterType: rawFighterType, workoutPlan } = body;

  if (!characterClass || !characterName?.trim()) {
    return NextResponse.json({ error: "Class and character name are required" }, { status: 400 });
  }
  if (!VALID_CLASSES.includes(characterClass)) {
    return NextResponse.json({ error: "Invalid class" }, { status: 400 });
  }

  const weakSpot    = VALID_WEAK_SPOTS.includes(rawWeakSpot)     ? rawWeakSpot     : null;
  const fighterType = VALID_FIGHTER_TYPES.includes(rawFighterType) ? rawFighterType : null;

  const sql = getDb();

  // Ensure users columns exist
  await Promise.all([
    sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS character_class TEXT`,
    sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS character_name TEXT`,
    sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0`,
    sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS streak INTEGER DEFAULT 0`,
    sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS last_streak_date DATE`,
    sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS fitness_level TEXT`,
    sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarding_complete BOOLEAN DEFAULT FALSE`,
    sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS weak_spot TEXT`,
    sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS fighter_type TEXT`,
  ]).catch(() => {});

  await sql`
    UPDATE users
    SET character_class     = ${characterClass},
        fitness_level       = 'beginner',
        character_name      = ${characterName.trim()},
        onboarding_complete = TRUE,
        weak_spot           = ${weakSpot},
        fighter_type        = ${fighterType}
    WHERE id = ${user.userId}
  `;

  // Save workout plan if provided
  if (workoutPlan && Array.isArray(workoutPlan.exercises) && Array.isArray(workoutPlan.dayIndices)) {
    const exercises: ExerciseInput[] = workoutPlan.exercises
      .filter((e: ExerciseInput) => typeof e.name === "string" && e.name.trim())
      .slice(0, 5)
      .map((e: ExerciseInput) => ({ name: e.name.trim(), detail: (e.detail ?? "").trim() }));

    const dayIndices: number[] = workoutPlan.dayIndices
      .filter((d: unknown) => typeof d === "number" && d >= 0 && d <= 6)
      .slice(0, 6);

    const timeOfDay = VALID_TIMES.includes(workoutPlan.timeOfDay) ? workoutPlan.timeOfDay : "flexible";

    if (exercises.length > 0 && dayIndices.length > 0) {
      await sql`
        CREATE TABLE IF NOT EXISTS workout_plans (
          id         SERIAL PRIMARY KEY,
          user_id    INTEGER NOT NULL UNIQUE,
          exercises  JSONB NOT NULL DEFAULT '[]',
          day_indices INTEGER[] DEFAULT '{0,2,4}',
          time_of_day TEXT DEFAULT 'flexible',
          updated_at  TIMESTAMPTZ DEFAULT NOW()
        )
      `;

      await sql`
        INSERT INTO workout_plans (user_id, exercises, day_indices, time_of_day)
        VALUES (${user.userId}, ${JSON.stringify(exercises)}, ${dayIndices}, ${timeOfDay})
        ON CONFLICT (user_id) DO UPDATE
          SET exercises   = EXCLUDED.exercises,
              day_indices = EXCLUDED.day_indices,
              time_of_day = EXCLUDED.time_of_day,
              updated_at  = NOW()
      `;
    }
  }

  return NextResponse.json({ success: true });
}
