import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const rows = await sql`
    SELECT id, naam, doel_bedrag, huidig_bedrag, deadline, created_at
    FROM spaardoelen WHERE user_id = ${session.userId}
    ORDER BY created_at ASC
  `;
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const { naam, doelBedrag, huidigBedrag, deadline } = await req.json();

  if (typeof naam !== "string" || !naam.trim() || naam.length > 255) {
    return NextResponse.json({ error: "Ongeldige naam" }, { status: 400 });
  }
  if (typeof doelBedrag !== "number" || !isFinite(doelBedrag) || doelBedrag <= 0) {
    return NextResponse.json({ error: "Ongeldig doelbedrag" }, { status: 400 });
  }
  if (huidigBedrag !== undefined && (typeof huidigBedrag !== "number" || !isFinite(huidigBedrag) || huidigBedrag < 0)) {
    return NextResponse.json({ error: "Ongeldig huidig bedrag" }, { status: 400 });
  }
  if (deadline !== null && deadline !== undefined && isNaN(new Date(deadline).getTime())) {
    return NextResponse.json({ error: "Ongeldige deadline" }, { status: 400 });
  }

  const rows = await sql`
    INSERT INTO spaardoelen (user_id, naam, doel_bedrag, huidig_bedrag, deadline)
    VALUES (${session.userId}, ${naam.trim()}, ${doelBedrag}, ${huidigBedrag ?? 0}, ${deadline ?? null})
    RETURNING id
  `;
  return NextResponse.json(rows[0]);
}
