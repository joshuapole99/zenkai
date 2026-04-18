import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { hashPassword, signToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, username, password } = await req.json();

  if (!email || !username || !password) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }
  if (username.length < 3 || username.length > 20) {
    return NextResponse.json({ error: "Username must be 3–20 characters." }, { status: 400 });
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return NextResponse.json(
      { error: "Username can only contain letters, numbers, and underscores." },
      { status: 400 }
    );
  }

  const sql = getDb();

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id            SERIAL PRIMARY KEY,
        email         TEXT UNIQUE NOT NULL,
        username      TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at    TIMESTAMPTZ DEFAULT NOW(),
        power_level   INTEGER DEFAULT 0,
        streak        INTEGER DEFAULT 0
      )
    `;

    const passwordHash = await hashPassword(password);

    const [user] = await sql`
      INSERT INTO users (email, username, password_hash)
      VALUES (${email.toLowerCase().trim()}, ${username.trim()}, ${passwordHash})
      RETURNING id, email, username
    `;

    const token = await signToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    const res = NextResponse.json({ success: true }, { status: 201 });
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return res;
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err) {
      const code = (err as { code: string }).code;
      if (code === "23505") {
        const detail = (err as { detail?: string }).detail ?? "";
        const field = detail.includes("email") ? "email" : "username";
        return NextResponse.json(
          { error: `An account with this ${field} already exists.` },
          { status: 409 }
        );
      }
    }
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Something went wrong. Try again." }, { status: 500 });
  }
}
