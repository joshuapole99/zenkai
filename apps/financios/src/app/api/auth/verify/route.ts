import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { createSessionToken, buildSessionCookie } from "@/lib/session";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(new URL("/login?error=invalid", req.url));
  }

  const rows = await sql`
    SELECT email, expires_at, used FROM auth_tokens WHERE token = ${token}
  `;

  if (!rows.length) {
    return NextResponse.redirect(new URL("/login?error=invalid", req.url));
  }

  const { email, expires_at, used } = rows[0] as {
    email: string;
    expires_at: string;
    used: boolean;
  };

  if (used || new Date(expires_at) < new Date()) {
    return NextResponse.redirect(new URL("/login?error=expired", req.url));
  }

  // Mark token as used
  await sql`UPDATE auth_tokens SET used = TRUE WHERE token = ${token}`;

  // Find or create user
  await sql`
    INSERT INTO users (email) VALUES (${email})
    ON CONFLICT (email) DO NOTHING
  `;
  const userRows = await sql`SELECT id FROM users WHERE email = ${email}`;
  const userId = (userRows[0] as { id: string }).id;

  const sessionToken = await createSessionToken({ userId, email });
  const cookie = buildSessionCookie(sessionToken);

  const res = NextResponse.redirect(new URL("/dashboard", req.url));
  res.cookies.set(cookie);
  return res;
}
