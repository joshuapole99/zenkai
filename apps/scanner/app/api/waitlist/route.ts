import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { email, domain } = await req.json();

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Ongeldig e-mailadres." }, { status: 400 });
  }

  try {
    const sql = getDb();

    await sql`
      CREATE TABLE IF NOT EXISTS scan.waitlist (
        id         SERIAL PRIMARY KEY,
        email      TEXT UNIQUE NOT NULL,
        domain     TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    await sql`
      INSERT INTO scan.waitlist (email, domain)
      VALUES (${email.toLowerCase().trim()}, ${domain?.trim() || null})
      ON CONFLICT (email) DO NOTHING
    `;

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("Waitlist error:", err);
    return NextResponse.json({ error: "Er ging iets mis. Probeer opnieuw." }, { status: 500 });
  }
}
