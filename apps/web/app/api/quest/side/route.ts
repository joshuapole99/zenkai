import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let user;
  try {
    user = await verifyToken(token);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const fitnessLevel = searchParams.get("fitnessLevel") ?? "beginner";
  const excludeNames = (searchParams.get("excludeNames") ?? "").split(",").filter(Boolean);

  const difficulty =
    fitnessLevel === "advanced" ? "advanced"
    : fitnessLevel === "intermediate" ? "intermediate"
    : "beginner";

  const sql = getDb();
  const today = new Date().toISOString().slice(0, 10);

  // Seed includes user ID so each user gets their own fixed side quests for the day.
  // Do NOT exclude already-completed IDs — the client marks them as done.
  // Excluding completed IDs was the exploit: each call returned fresh completable exercises.
  const rows = (await sql`
    SELECT id, name, sets_reps, duration FROM exercises
    WHERE difficulty = ${difficulty}
    ORDER BY md5(id::text || ${today} || ${String(user.userId)})
    LIMIT 10
  `) as unknown as { id: number; name: string; sets_reps: string | null; duration: string | null }[];

  const quests = rows
    .filter((e) => !excludeNames.includes(e.name))
    .slice(0, 2)
    .map((e) => ({ id: e.id, name: e.name, detail: e.sets_reps ?? e.duration ?? "" }));

  return NextResponse.json({ quests });
}
