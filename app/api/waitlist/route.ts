import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Ongeldig e-mailadres." }, { status: 400 });
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return NextResponse.json(
      { error: "Database niet geconfigureerd. Voeg DATABASE_URL toe aan .env.local." },
      { status: 503 }
    );
  }

  try {
    const sql = neon(connectionString);

    await sql`
      CREATE TABLE IF NOT EXISTS waitlist_zenkai (
        id         SERIAL PRIMARY KEY,
        email      TEXT UNIQUE NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    await sql`
      INSERT INTO waitlist_zenkai (email) VALUES (${email.toLowerCase().trim()})
    `;

    return NextResponse.json(
      { message: "Je staat op de lijst! Je Zenkai Boost wacht op je. 🔥" },
      { status: 201 }
    );
  } catch (err: unknown) {
    if (
      err &&
      typeof err === "object" &&
      "code" in err &&
      (err as { code: string }).code === "23505"
    ) {
      return NextResponse.json(
        { error: "Dit e-mailadres staat al op de wachtlijst." },
        { status: 409 }
      );
    }
    console.error("Waitlist error:", err);
    return NextResponse.json({ error: "Er ging iets mis. Probeer opnieuw." }, { status: 500 });
  }
}
