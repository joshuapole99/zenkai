import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { sql } from "@/lib/db";
import { sendLoginEmail } from "@/lib/email";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.fixedWindow(3, "1 h"),
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email || typeof email !== "string" || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Ongeldig emailadres" }, { status: 400 });
  }

  const normalized = email.toLowerCase().trim();

  const { success } = await ratelimit.limit(`auth:${normalized}`);
  if (!success) {
    return NextResponse.json({ error: "Te veel verzoeken. Probeer over een uur opnieuw." }, { status: 429 });
  }

  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await sql`
    INSERT INTO auth_tokens (token, email, expires_at)
    VALUES (${token}, ${normalized}, ${expiresAt.toISOString()})
  `;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://financios.nl";
  const loginUrl = `${appUrl}/api/auth/verify?token=${token}`;

  try {
    await sendLoginEmail(normalized, loginUrl);
  } catch (err) {
    console.error("[auth/send] email failed:", err);
    return NextResponse.json({ error: "Email versturen mislukt" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
