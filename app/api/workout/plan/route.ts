import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { getDb } from "@/lib/db";

const VALID_TIMES = ["morning", "afternoon", "evening", "flexible"];

type ExerciseInput = { name: string; detail: string };

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let session;
  try {
    session = await verifyToken(token);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const { exercises, dayIndices, timeOfDay } = body;

  if (!Array.isArray(exercises) || !Array.isArray(dayIndices)) {
    return NextResponse.json({ error: "exercises and dayIndices are required" }, { status: 400 });
  }

  const cleanedExercises: ExerciseInput[] = exercises
    .filter((e: ExerciseInput) => typeof e?.name === "string" && e.name.trim())
    .slice(0, 5)
    .map((e: ExerciseInput) => ({
      name: e.name.trim().slice(0, 50),
      detail: (e.detail ?? "").trim().slice(0, 30),
    }));

  if (cleanedExercises.length === 0) {
    return NextResponse.json({ error: "At least one exercise is required" }, { status: 400 });
  }

  const cleanedDayIndices: number[] = [...new Set(
    dayIndices.filter((d: unknown) => typeof d === "number" && d >= 0 && d <= 6)
  )].sort() as number[];

  if (cleanedDayIndices.length === 0) {
    return NextResponse.json({ error: "At least one training day is required" }, { status: 400 });
  }

  const cleanedTime = VALID_TIMES.includes(timeOfDay) ? timeOfDay : "flexible";

  const sql = getDb();

  await sql`
    CREATE TABLE IF NOT EXISTS workout_plans (
      id          SERIAL PRIMARY KEY,
      user_id     INTEGER NOT NULL UNIQUE,
      exercises   JSONB NOT NULL DEFAULT '[]',
      day_indices INTEGER[] DEFAULT '{0,2,4}',
      time_of_day TEXT DEFAULT 'flexible',
      updated_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    INSERT INTO workout_plans (user_id, exercises, day_indices, time_of_day)
    VALUES (${session.userId}, ${JSON.stringify(cleanedExercises)}, ${cleanedDayIndices}, ${cleanedTime})
    ON CONFLICT (user_id) DO UPDATE
      SET exercises   = EXCLUDED.exercises,
          day_indices = EXCLUDED.day_indices,
          time_of_day = EXCLUDED.time_of_day,
          updated_at  = NOW()
  `;

  return NextResponse.json({
    success: true,
    workoutPlan: {
      exercises: cleanedExercises,
      dayIndices: cleanedDayIndices,
      timeOfDay: cleanedTime,
    },
  });
}
