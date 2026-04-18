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

  const { ateEnough } = await req.json();
  if (typeof ateEnough !== "boolean") {
    return NextResponse.json({ error: "ateEnough required" }, { status: 400 });
  }

  const today = new Date().toISOString().slice(0, 10);
  const sql = getDb();

  await sql`
    CREATE TABLE IF NOT EXISTS food_logs (
      id         SERIAL PRIMARY KEY,
      user_id    INTEGER NOT NULL,
      log_date   DATE NOT NULL DEFAULT CURRENT_DATE,
      ate_enough BOOLEAN NOT NULL,
      UNIQUE(user_id, log_date)
    )
  `;

  await sql`
    INSERT INTO food_logs (user_id, log_date, ate_enough)
    VALUES (${user.userId}, ${today}, ${ateEnough})
    ON CONFLICT (user_id, log_date) DO UPDATE SET ate_enough = ${ateEnough}
  `;

  return NextResponse.json({ success: true });
}
