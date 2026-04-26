import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let user;
  try {
    user = await verifyToken(token);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const sql = getDb();

  const [updated] = (await sql`
    UPDATE users
    SET story_day = CASE WHEN COALESCE(story_day, 1) < 7 THEN COALESCE(story_day, 1) + 1 ELSE 7 END
    WHERE id = ${user.userId}
    RETURNING story_day
  `) as unknown as { story_day: number }[];

  return NextResponse.json({ success: true, storyDay: updated?.story_day ?? 1 });
}
