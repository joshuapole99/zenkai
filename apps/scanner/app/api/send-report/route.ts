import { NextRequest } from "next/server";
import { getServerClient } from "@/lib/supabase-server";

export const maxDuration = 90;

const SCANNER_URL = process.env.SCANNER_API_URL ?? "https://vmi3112892.contaboserver.net";
const SCANNER_KEY = process.env.SCANNER_API_KEY ?? "verander-dit";

function json(body: object, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: NextRequest) {
  const sb = await getServerClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return json({ error: "Niet ingelogd" }, 401);

  const body = await req.json() as { domain?: string; email?: string; scan_type?: string };
  const domain = body.domain?.trim();
  if (!domain) return json({ error: "Domein vereist" }, 400);

  const email     = body.email?.trim() || user.email!;
  const scan_type = body.scan_type ?? "full";

  let upstream: Response;
  try {
    upstream = await fetch(`${SCANNER_URL}/generate-report`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-API-Key": SCANNER_KEY },
      body: JSON.stringify({ domain, email, type: scan_type, language: "nl" }),
    });
  } catch (e) {
    return json({ error: `Scanner niet bereikbaar: ${String(e)}` }, 503);
  }

  const data = await upstream.json();
  if (!upstream.ok) return json({ error: data.error ?? "Onbekende fout" }, upstream.status);

  return json({ status: "sent", email }, 200);
}
