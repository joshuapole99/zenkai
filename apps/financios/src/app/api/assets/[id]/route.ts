import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const { id } = await params;
  const { naam, waarde } = await req.json();

  if (typeof naam !== "string" || !naam.trim() || naam.length > 255) {
    return NextResponse.json({ error: "Ongeldige naam" }, { status: 400 });
  }
  if (typeof waarde !== "number" || !isFinite(waarde) || waarde < 0) {
    return NextResponse.json({ error: "Ongeldige waarde" }, { status: 400 });
  }

  await sql`
    UPDATE assets
    SET naam = ${naam.trim()}, waarde = ${waarde}, updated_at = NOW()
    WHERE id = ${id} AND user_id = ${session.userId}
  `;
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const { id } = await params;
  await sql`DELETE FROM assets WHERE id = ${id} AND user_id = ${session.userId}`;
  return NextResponse.json({ ok: true });
}
