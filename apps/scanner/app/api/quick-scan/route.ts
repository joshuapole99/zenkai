import { NextRequest } from "next/server";
import { getUserFromRequest, PLAN_LIMITS } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";

export const maxDuration = 120;

const SCANNER_URL = process.env.SCANNER_API_URL ?? "https://vmi3112892.contaboserver.net";
const SCANNER_KEY = process.env.SCANNER_API_KEY ?? "verander-dit";

function cleanDomain(input: string): string {
  return input.trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "").toLowerCase();
}

function json(body: object, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: NextRequest) {
  // Auth — check Bearer token first, then cookie
  const user = await getUserFromRequest(req);
  if (!user) return json({ error: "Niet ingelogd" }, 401);

  // Plan lookup — keyed by email to match webhook upsert
  const { data: row } = await supabaseAdmin
    .from("users")
    .select("plan, scan_count_month, scan_reset_at")
    .eq("email", user.email)
    .single();

  const plan  = (row?.plan ?? "free") as string;
  const limits = PLAN_LIMITS[plan] ?? PLAN_LIMITS.free;

  // Monthly reset
  const resetAt   = new Date(row?.scan_reset_at ?? 0);
  const now        = new Date();
  const newMonth   = now.getMonth() !== resetAt.getMonth() || now.getFullYear() !== resetAt.getFullYear();
  let count        = newMonth ? 0 : (row?.scan_count_month ?? 0);

  // Enforce limit
  if (limits.scansPerMonth !== -1 && count >= limits.scansPerMonth) {
    return json({
      error: `Scanlimiet bereikt (${limits.scansPerMonth}/mnd voor ${plan}). Upgrade je plan.`,
    }, 429);
  }

  // Increment count — update existing row (preserves plan) or insert new free row
  if (row) {
    await supabaseAdmin
      .from("users")
      .update({
        scan_count_month: count + 1,
        ...(newMonth ? { scan_reset_at: now.toISOString() } : {}),
      })
      .eq("email", user.email!);
  } else {
    await supabaseAdmin
      .from("users")
      .insert({ email: user.email!, plan: "free", scan_count_month: 1 });
  }

  // Body
  const body = await req.json() as { domain?: string; language?: string; consent?: boolean };
  if (!body.domain) return json({ error: "Domein vereist" }, 400);

  const domain   = cleanDomain(body.domain);
  const language = body.language === "en" ? "en" : "nl";
  const consent  = body.consent === true;

  let upstream: Response;
  try {
    upstream = await fetch(`${SCANNER_URL}/quick-scan`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-API-Key": SCANNER_KEY },
      body: JSON.stringify({ domain, language }),
    });
  } catch {
    return json({ error: `Scanner backend niet bereikbaar (${SCANNER_URL})` }, 503);
  }

  if (!upstream.ok) {
    const err = await upstream.text();
    return new Response(err, { status: upstream.status });
  }

  // Record scan in history
  await supabaseAdmin.from("scans").insert({
    user_email: user.email,
    domain,
    scan_type: "quick",
    status: "done",
    consent,
  });

  return new Response(upstream.body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      "X-Accel-Buffering": "no",
    },
  });
}
