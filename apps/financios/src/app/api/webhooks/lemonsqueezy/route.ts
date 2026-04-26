import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { redis } from "@/lib/redis";
import { sendMagicLink } from "@/lib/email";
import { sql } from "@/lib/db";

export async function POST(req: NextRequest) {
  // 1. Verify signature
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  const rawBody = await req.text();
  const signature = req.headers.get("x-signature") ?? "";
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");

  try {
    if (!timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(expected, "hex"))) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // 2. Parse payload
  const payload = JSON.parse(rawBody);
  const eventName: string = payload?.meta?.event_name ?? "";

  if (eventName !== "order_created") {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const email: string = payload?.data?.attributes?.user_email ?? "";
  const orderId: string = String(payload?.data?.id ?? "");
  const params: string = payload?.meta?.custom_data?.params ?? "";

  if (!email || !params) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  // 3. Idempotency — skip if order already processed
  const idempotencyKey = `order:${orderId}`;
  const existingToken = await redis.get<string>(idempotencyKey);
  if (existingToken) {
    console.log(`[webhook] duplicate order ${orderId}, already processed`);
    return NextResponse.json({ ok: true, skipped: true, reason: "duplicate" });
  }

  // 5. Generate token and store in Redis
  const token = crypto.randomUUID();
  const planData = { params, email, orderId, createdAt: Date.now() };
  const ttl = 60 * 60 * 24 * 365; // 1 year in seconds

  // Store plan data by token
  await redis.set(`plan:${token}`, planData, { ex: ttl });
  // Store token by order ID for recovery
  await redis.set(idempotencyKey, token, { ex: ttl });

  console.log(`[webhook] stored plan:${token} for order ${orderId}`);

  // 6. Link plan to user account if account exists
  try {
    await sql`
      INSERT INTO users (email) VALUES (${email})
      ON CONFLICT (email) DO NOTHING
    `;
    const userRows = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (userRows.length) {
      const userId = (userRows[0] as { id: string }).id;
      await sql`
        INSERT INTO plans (user_id, token, plan_data)
        VALUES (${userId}, ${token}, ${JSON.stringify({ params, orderId })})
        ON CONFLICT (token) DO NOTHING
      `;
    }
  } catch (err) {
    console.error("[webhook] DB plan link failed:", err);
  }

  // 7. Send magic link email
  const planUrl = `https://financios.nl/plan?token=${token}`;
  try {
    await sendMagicLink(email, planUrl);
    console.log(`[webhook] magic link email sent to ${email}`);
  } catch (err) {
    console.error(`[webhook] Brevo email failed for order ${orderId}:`, err);
    // Token is already in Redis — user can contact support with order ID
  }

  return NextResponse.json({ ok: true });
}
