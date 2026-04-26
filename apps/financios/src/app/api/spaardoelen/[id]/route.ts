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
  const { huidigBedrag } = await req.json();

  if (typeof huidigBedrag !== "number" || !isFinite(huidigBedrag) || huidigBedrag < 0) {
    return NextResponse.json({ error: "Ongeldig bedrag" }, { status: 400 });
  }

  await sql`
    UPDATE spaardoelen
    SET huidig_bedrag = ${huidigBedrag}
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
  await sql`DELETE FROM spaardoelen WHERE id = ${id} AND user_id = ${session.userId}`;
  return NextResponse.json({ ok: true });
}
