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

  const { date, originalQuestId, exerciseId } = await req.json();
  if (!date || typeof originalQuestId !== "number" || typeof exerciseId !== "number") {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const sql = getDb();

  await sql`
    CREATE TABLE IF NOT EXISTS quest_swaps (
      id                SERIAL PRIMARY KEY,
      user_id           INTEGER NOT NULL,
      date              DATE NOT NULL,
      original_quest_id INTEGER NOT NULL,
      exercise_id       INTEGER NOT NULL,
      UNIQUE(user_id, date, original_quest_id)
    )
  `;

  const [exercise] = (await sql`
    SELECT name, sets_reps, duration FROM exercises WHERE id = ${exerciseId}
  `) as unknown as { name: string; sets_reps: string | null; duration: string | null }[];

  if (!exercise) return NextResponse.json({ error: "Exercise not found" }, { status: 404 });

  await sql`
    INSERT INTO quest_swaps (user_id, date, original_quest_id, exercise_id)
    VALUES (${user.userId}, ${date}::date, ${originalQuestId}, ${exerciseId})
    ON CONFLICT (user_id, date, original_quest_id) DO UPDATE SET exercise_id = EXCLUDED.exercise_id
  `;

  return NextResponse.json({
    success: true,
    exercise: {
      id: exerciseId,
      name: exercise.name,
      detail: exercise.sets_reps ?? exercise.duration ?? "",
    },
  });
}
