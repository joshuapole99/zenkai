import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const rows = await sql`
    SELECT id, params, result, doel_naam, created_at
    FROM scans WHERE user_id = ${session.userId}
    ORDER BY created_at DESC LIMIT 10
  `;
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const { params, result, doelNaam } = await req.json();
  if (!params || typeof params !== "object" || !result || typeof result !== "object") {
    return NextResponse.json({ error: "Ongeldige data" }, { status: 400 });
  }
  if (JSON.stringify(params).length > 10_000 || JSON.stringify(result).length > 10_000) {
    return NextResponse.json({ error: "Data te groot" }, { status: 400 });
  }

  await sql`
    INSERT INTO scans (user_id, params, result, doel_naam)
    VALUES (${session.userId}, ${JSON.stringify(params)}, ${JSON.stringify(result)}, ${doelNaam ?? null})
  `;
  return NextResponse.json({ ok: true });
}
