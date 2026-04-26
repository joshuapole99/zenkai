import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { getDb } from "@/lib/db";

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

  const message =
    typeof body.message === "string" ? body.message.trim().slice(0, 1000) : "";
  if (!message) return NextResponse.json({ error: "Message required" }, { status: 400 });

  const sql = getDb();

  await sql`
    CREATE TABLE IF NOT EXISTS user_feedback (
      id         SERIAL PRIMARY KEY,
      user_id    INTEGER NOT NULL,
      message    TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`INSERT INTO user_feedback (user_id, message) VALUES (${session.userId}, ${message})`;

  return NextResponse.json({ success: true });
}
