import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

function emailHtml() {
  return `<!DOCTYPE html>
<html>
<body style="background:#0a0a0a;color:#fff;font-family:-apple-system,sans-serif;padding:48px 24px;max-width:560px;margin:0 auto">
  <p style="font-size:20px;font-weight:900;letter-spacing:-0.02em;margin:0 0 4px">ZENKAI</p>
  <p style="color:rgba(255,255,255,0.3);font-size:12px;margin:0 0 48px">Open Beta · zenkai.nl</p>

  <h1 style="font-size:28px;font-weight:900;line-height:1.2;margin:0 0 20px">
    Your comeback workout<br>is waiting.
  </h1>

  <p style="color:rgba(255,255,255,0.55);line-height:1.7;margin:0 0 16px">
    You signed up for the Zenkai waitlist. The beta is now open — and it's free.
  </p>
  <p style="color:rgba(255,255,255,0.55);line-height:1.7;margin:0 0 32px">
    Zenkai is a custom workout coach built for consistency. Design your own workouts,
    pick your training days, and when life gets in the way — your Zenkai Boost activates
    and brings you back without guilt.
  </p>

  <a href="https://zenkai.nl/signup"
     style="display:inline-block;background:linear-gradient(135deg,#FF6B35,#7C3AED);color:#fff;font-weight:900;padding:14px 28px;border-radius:12px;text-decoration:none;font-size:15px">
    Get started — it&apos;s free →
  </a>

  <p style="color:rgba(255,255,255,0.15);font-size:12px;margin-top:48px;line-height:1.6">
    Free during beta. No credit card required.<br>
    You received this because you joined the Zenkai waitlist.<br>
    <a href="https://zenkai.nl" style="color:rgba(255,255,255,0.2)">zenkai.nl</a>
  </p>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-admin-secret");
  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return NextResponse.json({ error: "RESEND_API_KEY not configured" }, { status: 503 });
  }

  const sql = getDb();
  const rows = (await sql`
    SELECT email FROM waitlist_zenkai ORDER BY created_at
  `) as { email: string }[];

  if (rows.length === 0) {
    return NextResponse.json({ success: true, sent: 0, failed: 0, total: 0 });
  }

  let sent = 0;
  let failed = 0;

  for (const { email } of rows) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Zenkai <beta@zenkai.nl>",
        to: email,
        subject: "Zenkai Beta is live — your comeback workout is waiting",
        html: emailHtml(),
      }),
    });
    if (res.ok) sent++;
    else {
      failed++;
      console.error("[waitlist-blast] failed for", email, await res.text());
    }
  }

  return NextResponse.json({ success: true, sent, failed, total: rows.length });
}
