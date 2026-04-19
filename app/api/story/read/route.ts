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

  const body = await req.json().catch(() => ({}));
  const { isZenkaiBoost, storyDay } = body as { isZenkaiBoost?: boolean; storyDay?: number };

  const today = new Date().toISOString().slice(0, 10);
  const sql = getDb();

  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS last_story_day_seen INTEGER DEFAULT 0`;

  if (isZenkaiBoost) {
    // Zenkai boost: track by date so it only shows once per day
    await sql`UPDATE users SET last_story_date = ${today}::date WHERE id = ${user.userId}`;
  } else if (typeof storyDay === "number") {
    // Normal arc: track by story_day so each chapter shows exactly once
    await sql`UPDATE users SET last_story_day_seen = ${storyDay} WHERE id = ${user.userId}`;
  }

  return NextResponse.json({ success: true });
}
