import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { comparePasswords, signToken, COOKIE_NAME } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  // 10 attempts per IP per 15 minutes
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed, retryAfterSeconds } = checkRateLimit(`login:${ip}`, 10, 15 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
    );
  }

  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const sql = getDb();

  try {
    const [user] = (await sql`
      SELECT id, email, username, password_hash
      FROM users
      WHERE email = ${email.toLowerCase().trim()}
    `) as { id: number; email: string; username: string; password_hash: string }[];

    if (!user || !(await comparePasswords(password, user.password_hash))) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const token = await signToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    const res = NextResponse.json({ success: true });
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return res;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Something went wrong. Try again." }, { status: 500 });
  }
}
