import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { getDb } from "@/lib/db";

const VALID_REASONS = ["too_busy", "too_tired", "forgot", "no_motivation"];

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

  const { reason, surveyDate } = body;

  if (!VALID_REASONS.includes(reason)) {
    return NextResponse.json({ error: "Invalid reason" }, { status: 400 });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(surveyDate)) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }

  const sql = getDb();

  await sql`
    CREATE TABLE IF NOT EXISTS exit_surveys (
      id          SERIAL PRIMARY KEY,
      user_id     INTEGER NOT NULL,
      survey_date DATE NOT NULL,
      reason      TEXT NOT NULL,
      created_at  TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_id, survey_date)
    )
  `;

  await sql`
    INSERT INTO exit_surveys (user_id, survey_date, reason)
    VALUES (${session.userId}, ${surveyDate}::date, ${reason})
    ON CONFLICT (user_id, survey_date) DO NOTHING
  `;

  return NextResponse.json({ success: true });
}
