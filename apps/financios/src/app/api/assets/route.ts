import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getSession } from "@/lib/session";

const VALID_TYPES = ["spaar", "belegging", "crypto", "overig"] as const;

function validNaam(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0 && v.length <= 255;
}
function validWaarde(v: unknown): v is number {
  return typeof v === "number" && isFinite(v) && v >= 0;
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const rows = await sql`
    SELECT id, type, naam, waarde, updated_at
    FROM assets WHERE user_id = ${session.userId}
    ORDER BY type, naam
  `;
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const { type, naam, waarde } = await req.json();

  if (!VALID_TYPES.includes(type)) return NextResponse.json({ error: "Ongeldig type" }, { status: 400 });
  if (!validNaam(naam)) return NextResponse.json({ error: "Ongeldige naam" }, { status: 400 });
  if (!validWaarde(waarde)) return NextResponse.json({ error: "Ongeldige waarde" }, { status: 400 });

  const rows = await sql`
    INSERT INTO assets (user_id, type, naam, waarde)
    VALUES (${session.userId}, ${type}, ${naam.trim()}, ${waarde})
    RETURNING id
  `;
  return NextResponse.json(rows[0]);
}
