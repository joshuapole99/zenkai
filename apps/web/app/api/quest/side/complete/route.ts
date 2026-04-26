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

  const { exerciseId } = await req.json();
  if (typeof exerciseId !== "number") {
    return NextResponse.json({ error: "exerciseId required" }, { status: 400 });
  }

  const today = new Date().toISOString().slice(0, 10);
  const sql = getDb();

  await sql`
    CREATE TABLE IF NOT EXISTS side_quest_completions (
      id             SERIAL PRIMARY KEY,
      user_id        INTEGER NOT NULL,
      exercise_id    INTEGER NOT NULL,
      completed_date DATE NOT NULL DEFAULT CURRENT_DATE,
      UNIQUE(user_id, exercise_id, completed_date)
    )
  `;

  try {
    await sql`
      INSERT INTO side_quest_completions (user_id, exercise_id, completed_date)
      VALUES (${user.userId}, ${exerciseId}, ${today})
    `;
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "23505") {
      return NextResponse.json({ error: "Already completed" }, { status: 409 });
    }
    throw err;
  }

  const [updated] = (await sql`
    UPDATE users SET xp = COALESCE(xp, 0) + 25 WHERE id = ${user.userId} RETURNING xp
  `) as { xp: number }[];

  return NextResponse.json({ success: true, newXp: updated.xp });
}
