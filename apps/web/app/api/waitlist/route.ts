import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return NextResponse.json(
      { error: "Database not configured. Add DATABASE_URL to .env.local." },
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
      { message: "You're on the list. Your Zenkai Boost is waiting. 🔥" },
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
        { error: "This email is already on the waitlist." },
        { status: 409 }
      );
    }
    console.error("Waitlist error:", err);
    return NextResponse.json({ error: "Something went wrong. Try again." }, { status: 500 });
  }
}
