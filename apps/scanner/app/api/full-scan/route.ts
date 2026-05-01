import { NextRequest } from "next/server";
import { getServerClient, PLAN_LIMITS } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";

export const maxDuration = 300;

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
  // Auth
  const sb = await getServerClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return json({ error: "Niet ingelogd" }, 401);

  // Plan lookup — keyed by email to match webhook upsert
  const { data: row } = await supabaseAdmin
    .from("users")
    .select("plan, scan_count_month, scan_reset_at")
    .eq("email", user.email)
    .single();

  const plan   = (row?.plan ?? "free") as string;
  const limits = PLAN_LIMITS[plan] ?? PLAN_LIMITS.free;

  // Full scan = Pro+ only
  if (!limits.fullScan) {
    return json({
      error: `Full scan is niet beschikbaar voor het ${plan} plan. Upgrade naar Pro.`,
    }, 403);
  }

  // Body
  const body = await req.json() as { domain?: string; language?: string };
  if (!body.domain) return json({ error: "Domein vereist" }, 400);

  const domain   = cleanDomain(body.domain);
  const language = body.language === "en" ? "en" : "nl";

  let upstream: Response;
  try {
    upstream = await fetch(`${SCANNER_URL}/full-scan`, {
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
    scan_type: "full",
    status: "done",
  });

  return new Response(upstream.body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      "X-Accel-Buffering": "no",
    },
  });
}
